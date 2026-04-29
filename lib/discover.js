/**
 * lib/discover.js — ZEN self IP/domain discovery
 *
 * Offline-first priority:
 *   1. Read ~/.config/zen/domain (user-configured)
 *   2. ip route get 8.8.8.8  → outbound LAN/WAN IP
 *   3. hostname -I            → first non-loopback IP
 *   4. STUN (stun.l.google.com:19302) → public IP behind NAT
 *   5. HTTP fallback (api.ipify.org / ifconfig.me)
 *
 * Returns: { domain, ip, source }
 * Saves discovered domain to ~/.config/zen/domain if not already set.
 */

import dgram from "dgram";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import * as xdg from "./xdg.js";

const DOMAIN_FILE = path.join(xdg.config(), "domain");
const PORT_FILE   = path.join(xdg.config(), "port");

// ── helpers ──────────────────────────────────────────────────────────────────

function readFileTrim(f) {
  try { return fs.readFileSync(f, "utf8").trim() || null; } catch { return null; }
}

function shellOut(cmd) {
  try { return execSync(cmd, { timeout: 2000 }).toString().trim() || null; } catch { return null; }
}

function httpGet(url, timeout = 3000) {
  return new Promise((resolve) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.get(url, { timeout }, (res) => {
      let d = "";
      res.on("data", (c) => { d += c; });
      res.on("end", () => resolve(d.trim()));
    });
    req.on("error", () => resolve(null));
    req.on("timeout", () => { req.destroy(); resolve(null); });
  });
}

// RFC 3489 / RFC 5389 — minimal STUN binding request
function stunDiscover(host = "stun.l.google.com", port = 19302, timeout = 3000) {
  return new Promise((resolve) => {
    const sock = dgram.createSocket("udp4");
    const done = (ip) => { try { sock.close(); } catch {} resolve(ip); };
    const timer = setTimeout(() => done(null), timeout);

    // Binding Request: magic cookie 0x2112A442, random transaction ID
    const buf = Buffer.alloc(20);
    buf.writeUInt16BE(0x0001, 0);  // type: Binding Request
    buf.writeUInt16BE(0,      2);  // length: 0 attributes
    buf.writeUInt32BE(0x2112A442, 4); // magic cookie
    for (let i = 8; i < 20; i++) buf[i] = Math.floor(Math.random() * 256);

    sock.once("message", (msg) => {
      clearTimeout(timer);
      // Walk attributes looking for XOR-MAPPED-ADDRESS (0x0020) or MAPPED-ADDRESS (0x0001)
      let offset = 20;
      while (offset < msg.length - 4) {
        const type = msg.readUInt16BE(offset);
        const len  = msg.readUInt16BE(offset + 2);
        if (type === 0x0020 || type === 0x0001) {
          // family at offset+5 (0x01=IPv4), address at offset+8
          if (msg[offset + 5] === 0x01 && len >= 8) {
            let ip;
            if (type === 0x0020) {
              // XOR with magic cookie
              ip = [
                (msg[offset + 8]  ^ 0x21).toString(),
                (msg[offset + 9]  ^ 0x12).toString(),
                (msg[offset + 10] ^ 0xA4).toString(),
                (msg[offset + 11] ^ 0x42).toString(),
              ].join(".");
            } else {
              ip = [msg[offset+8], msg[offset+9], msg[offset+10], msg[offset+11]].join(".");
            }
            done(ip);
            return;
          }
        }
        offset += 4 + len + (len % 4 ? 4 - (len % 4) : 0);
      }
      done(null);
    });

    sock.on("error", () => { clearTimeout(timer); done(null); });
    sock.send(buf, 0, buf.length, port, host, (err) => { if (err) { clearTimeout(timer); done(null); } });
  });
}

// ── offline IP discovery ──────────────────────────────────────────────────────

function getLocalIP() {
  // Try ip route first (most reliable, gets the actual outbound interface IP)
  const route = shellOut("ip route get 8.8.8.8 2>/dev/null");
  if (route) {
    const m = route.match(/src\s+(\d+\.\d+\.\d+\.\d+)/);
    if (m && !m[1].startsWith("127.")) return m[1];
  }
  // hostname -I fallback
  const hI = shellOut("hostname -I 2>/dev/null");
  if (hI) {
    const first = hI.split(/\s+/).find(ip => ip && !ip.startsWith("127.") && !ip.startsWith("::"));
    if (first) return first;
  }
  return null;
}

// ── main export ───────────────────────────────────────────────────────────────

/**
 * discover(opt) → Promise<{ domain, ip, port, source }>
 *
 * opt.port       — configured port (used to build self URL)
 * opt.domain     — override; skip file + network discovery
 * opt.noSave     — don't persist discovered domain
 */
export async function discover(opt = {}) {
  const port = opt.port || readFileTrim(PORT_FILE) || 8420;
  let domain = opt.domain || null;
  let source = "opt";

  // 1. Config file
  if (!domain) {
    domain = readFileTrim(DOMAIN_FILE);
    if (domain) source = "config";
  }

  // 2. Offline IP
  let ip = getLocalIP();

  // 3. STUN — public IP
  let publicIP = null;
  if (!domain) {
    publicIP = await stunDiscover();
    if (publicIP) { ip = publicIP; source = "stun"; }
  }

  // 4. HTTP fallback (only if STUN failed and domain still unknown)
  if (!domain && !publicIP) {
    const fromHttp =
      await httpGet("https://api.ipify.org", 3000) ||
      await httpGet("https://ifconfig.me/ip", 3000) ||
      await httpGet("http://api.ipify.org", 3000);
    if (fromHttp && /^\d+\.\d+\.\d+\.\d+$/.test(fromHttp)) {
      ip = fromHttp;
      source = "http";
    }
  }

  // If still no domain but have IP, use IP as domain
  if (!domain && ip) {
    domain = ip;
    source = source === "opt" ? "ip" : source;
  }

  // Persist if newly discovered and not user-set
  if (domain && !opt.noSave && !opt.domain && !readFileTrim(DOMAIN_FILE)) {
    try {
      xdg.ensure(xdg.config());
      fs.writeFileSync(DOMAIN_FILE, domain + "\n");
    } catch {}
  }

  return { domain, ip, port: Number(port), source };
}

export { DOMAIN_FILE, PORT_FILE };
