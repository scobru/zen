/**
 * lib/scan.js — ZEN smart peer scanner
 *
 * Given a domain like "peer1.akao.io", derives sibling patterns and probes them.
 * Supports formats:
 *   peer1.akao.io    → peer{N}.akao.io
 *   node-1.site.com  → node-{N}.site.com
 *   relay01.net      → relay{N}.net  (zero-padded)
 *
 * Probe: GET /zen.js (HTTP/HTTPS) on configured port + 8420.
 * Returns discovered peer WSS URLs usable by ZEN.
 */

import https from "https";
import http from "http";

const DPORT = 8420;
const MIDX  = 100;
const MFND  = 10;   // stop once this many peers found per cycle
const CONC  = 10;
const TOUT  = 3000;

// ── domain pattern parsing ─────────────────────────────────────────────────

/**
 * mkpat("peer1.akao.io")
 * → { prefix: "peer", index: 1, tail: "", suffix: ".akao.io", padLen: 0 }
 * Returns null if no numeric index found in leftmost label.
 */
export function mkpat(d) {
  if (!d) return null;
  const h   = d.split(":")[0];
  const dot = h.indexOf(".");
  const lbl = dot >= 0 ? h.slice(0, dot) : h;
  const rst = dot >= 0 ? h.slice(dot) : "";
  const m   = lbl.match(/^(.*?)(\d+)(.*)$/);
  if (!m) return null;
  return {
    prefix: m[1],
    index:  parseInt(m[2], 10),
    tail:   m[3],
    suffix: rst,
    padLen: m[2].length > 1 && m[2][0] === "0" ? m[2].length : 0,
    label:  lbl,
    host:   h,
  };
}

/**
 * bdom(pat, n) → "peer2.akao.io"
 */
export function bdom(p, n) {
  let idx = String(n);
  if (p.padLen > 0) idx = idx.padStart(p.padLen, "0");
  return p.prefix + idx + p.tail + p.suffix;
}

// ── probe ──────────────────────────────────────────────────────────────────

// Wrap IPv6 literal addresses in brackets for use in URLs (RFC 2732).
function hostInUrl(host) {
  return host.includes(":") ? "[" + host + "]" : host;
}

function prb(host, port) {
  return new Promise((ok) => {
    const h = hostInUrl(host);
    const att = (tls) => {
      const mod = tls ? https : http;
      const url = (tls ? "https" : "http") + "://" + h + ":" + port + "/zen.js";
      const req = mod.get(url, { timeout: TOUT, rejectUnauthorized: false }, (res) => {
        if (res.statusCode === 200) {
          ok((tls ? "wss" : "ws") + "://" + h + ":" + port + "/zen");
        } else {
          if (tls) att(false); else ok(null);
        }
        res.resume();
      });
      req.on("error",   () => { if (tls) att(false); else ok(null); });
      req.on("timeout", () => { req.destroy(); if (tls) att(false); else ok(null); });
    };
    att(true);
  });
}

// ── concurrency pool ───────────────────────────────────────────────────────

async function pool(tasks, con) {
  const res = [];
  let i = 0;
  const run = async () => {
    while (i < tasks.length) {
      const idx = i++;
      res[idx] = await tasks[idx]();
    }
  };
  const wkr = Array.from({ length: Math.min(con, tasks.length) }, run);
  await Promise.all(wkr);
  return res.filter(Boolean);
}

// ── main exports ───────────────────────────────────────────────────────────

/**
 * scan(domain, opt) → Promise<string[]>
 *
 * opt.port     — configured port (probed in addition to DPORT)
 * opt.maxIndex — how far to scan (default: 100)
 * opt.maxFound — stop after N found per cycle (default: 10)
 * opt.onFound  — callback(url) called as each peer is discovered
 * opt.ip6      — array of IPv6 addresses to probe directly
 */
export async function scan(d, opt = {}) {
  const pat   = mkpat(d);
  const uport = Number(opt.port) || DPORT;
  const midx  = opt.maxIndex || MIDX;
  const mfnd  = opt.mfnd !== undefined ? opt.mfnd : MFND;
  const fnd   = [];
  let   stp   = false;

  const cands = [];

  // Domain-pattern candidates (IPv4 hostname scanning)
  if (pat) {
    for (let n = 0; n <= midx; n++) {
      if (n === pat.index) continue;
      const host = bdom(pat, n);
      const pts  = [...new Set([uport, DPORT])];
      for (const port of pts) cands.push({ host, port });
    }
  }

  // Direct IPv6 address probes
  if (Array.isArray(opt.ip6)) {
    const pts = [...new Set([uport, DPORT])];
    for (const addr of opt.ip6) {
      for (const port of pts) cands.push({ host: addr, port });
    }
  }

  if (!cands.length) return [];

  const tasks = cands.map(({ host, port }) => async () => {
    if (stp) return null;
    const url = await prb(host, port);
    if (url) {
      fnd.push(url);
      if (opt.onFound) opt.onFound(url);
      if (mfnd > 0 && fnd.length >= mfnd) stp = true;
    }
    return url;
  });

  await pool(tasks, CONC);
  return fnd;
}

/**
 * scanip6(addresses, opt) → Promise<string[]>
 *
 * Probe a list of raw IPv6 addresses directly (no pattern needed).
 * opt.port    — configured port (probed in addition to DPORT)
 * opt.onFound — callback(url) per peer found
 */
export function scanip6(addresses, opt = {}) {
  return scan(null, { ...opt, ip6: addresses });
}

/**
 * scanbg(domain, opt) — fire-and-forget, calls opt.onFound per peer found.
 */
export function scanbg(d, opt = {}) {
  if (!d) return;
  setImmediate(() => { scan(d, opt).catch(() => {}); });
}
