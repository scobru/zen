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
 * Returns: { domain, ip, port, source }
 */

import dgram from "dgram";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import * as xdg from "./xdg.js";

const DOMF  = path.join(xdg.config(), "domain");
const PORTF = path.join(xdg.config(), "port");

// ── helpers ────────────────────────────────────────────────────────────────

function rft(f) {
  try { return fs.readFileSync(f, "utf8").trim() || null; } catch { return null; }
}

function shl(cmd) {
  try { return execSync(cmd, { timeout: 2000 }).toString().trim() || null; } catch { return null; }
}

function hget(url, tout = 3000) {
  return new Promise((ok) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.get(url, { timeout: tout }, (res) => {
      let d = "";
      res.on("data", (c) => { d += c; });
      res.on("end",  () => ok(d.trim()));
    });
    req.on("error",   () => ok(null));
    req.on("timeout", () => { req.destroy(); ok(null); });
  });
}

// RFC 3489/5389 — minimal STUN binding request
function stun(host = "stun.l.google.com", port = 19302, tout = 3000) {
  return new Promise((ok) => {
    const sk   = dgram.createSocket("udp4");
    const done = (ip) => { try { sk.close(); } catch {} ok(ip); };
    const tmr  = setTimeout(() => done(null), tout);

    const buf = Buffer.alloc(20);
    buf.writeUInt16BE(0x0001,     0);  // Binding Request
    buf.writeUInt16BE(0,          2);  // length: 0 attrs
    buf.writeUInt32BE(0x2112A442, 4);  // magic cookie
    for (let i = 8; i < 20; i++) buf[i] = Math.floor(Math.random() * 256);

    sk.once("message", (msg) => {
      clearTimeout(tmr);
      let off = 20;
      while (off < msg.length - 4) {
        const typ = msg.readUInt16BE(off);
        const len = msg.readUInt16BE(off + 2);
        if (typ === 0x0020 || typ === 0x0001) {
          if (msg[off + 5] === 0x01 && len >= 8) {
            let ip;
            if (typ === 0x0020) {
              ip = [
                (msg[off + 8]  ^ 0x21).toString(),
                (msg[off + 9]  ^ 0x12).toString(),
                (msg[off + 10] ^ 0xA4).toString(),
                (msg[off + 11] ^ 0x42).toString(),
              ].join(".");
            } else {
              ip = [msg[off+8], msg[off+9], msg[off+10], msg[off+11]].join(".");
            }
            done(ip);
            return;
          }
        }
        off += 4 + len + (len % 4 ? 4 - (len % 4) : 0);
      }
      done(null);
    });

    sk.on("error", () => { clearTimeout(tmr); done(null); });
    sk.send(buf, 0, buf.length, port, host, (err) => { if (err) { clearTimeout(tmr); done(null); } });
  });
}

// ── offline IP discovery ───────────────────────────────────────────────────

function glip() {
  const rt = shl("ip route get 8.8.8.8 2>/dev/null");
  if (rt) {
    const m = rt.match(/src\s+(\d+\.\d+\.\d+\.\d+)/);
    if (m && !m[1].startsWith("127.")) return m[1];
  }
  const hn = shl("hostname -I 2>/dev/null");
  if (hn) {
    const fst = hn.split(/\s+/).find(ip => ip && !ip.startsWith("127.") && !ip.startsWith("::"));
    if (fst) return fst;
  }
  return null;
}

// ── main export ────────────────────────────────────────────────────────────

/**
 * disc(opt) → Promise<{ domain, ip, port, source }>
 *
 * opt.port   — configured port
 * opt.domain — override; skip file + network discovery
 * opt.noSave — don't persist discovered domain
 */
export async function disc(opt = {}) {
  const port = opt.port || rft(PORTF) || 8420;
  let dom    = opt.domain || null;
  let src    = "opt";

  if (!dom) {
    dom = rft(DOMF);
    if (dom) src = "config";
  }

  let ip  = glip();
  let pip = null;
  if (!dom) {
    pip = await stun();
    if (pip) { ip = pip; src = "stun"; }
  }

  if (!dom && !pip) {
    const fh =
      await hget("https://api.ipify.org",   3000) ||
      await hget("https://ifconfig.me/ip",  3000) ||
      await hget("http://api.ipify.org",    3000);
    if (fh && /^\d+\.\d+\.\d+\.\d+$/.test(fh)) { ip = fh; src = "http"; }
  }

  if (!dom && ip) {
    dom = ip;
    src = src === "opt" ? "ip" : src;
  }

  if (dom && !opt.noSave && !opt.domain && !rft(DOMF)) {
    try { xdg.ensure(xdg.config()); fs.writeFileSync(DOMF, dom + "\n"); } catch {}
  }

  return { domain: dom, ip, port: Number(port), source: src };
}

export { DOMF, PORTF };
