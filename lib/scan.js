/**
 * lib/scan.js — ZEN smart peer scanner
 *
 * Given a domain like "peer1.akao.io", derives sibling patterns and probes them.
 * Supports formats:
 *   peer1.akao.io       → peer{N}.akao.io
 *   node-1.site.com     → node-{N}.site.com
 *   zen1-prod.io        → zen{N}-prod.io
 *   relay01.net         → relay{N}.net  (zero-padded)
 *
 * Probe: GET /zen.js (HTTP/HTTPS) on configured port + 8420.
 * Returns discovered peer WSS/HTTPS URLs usable by ZEN.
 */

import https from "https";
import http from "http";

const DEFAULT_PORT = 8420;
const MAX_INDEX    = 100;
const CONCURRENCY  = 10;
const TIMEOUT      = 3000;

// ── domain pattern parsing ────────────────────────────────────────────────────

/**
 * parseDomainPattern("peer1.akao.io")
 * → { prefix: "peer", index: 1, suffix: ".akao.io", padLen: 0 }
 * Returns null if no numeric index found.
 */
export function parseDomainPattern(domain) {
  if (!domain) return null;
  // Strip port if present
  const host = domain.split(":")[0];
  // Match: everything before the first run of digits in the leftmost label
  // e.g. "peer1.akao.io" → label="peer1", rest=".akao.io"
  const dot = host.indexOf(".");
  const label = dot >= 0 ? host.slice(0, dot) : host;
  const rest  = dot >= 0 ? host.slice(dot) : "";

  const m = label.match(/^(.*?)(\d+)(.*)$/);
  if (!m) return null;

  const prefix = m[1];      // "peer", "node-", "zen"
  const index  = parseInt(m[2], 10);
  const tail   = m[3];      // e.g. "-prod" or ""
  const padLen = m[2].length > 1 && m[2][0] === "0" ? m[2].length : 0; // zero-padding

  return { prefix, index, tail, suffix: rest, padLen, label, host };
}

/**
 * buildDomain(pattern, n)
 * → "peer2.akao.io"
 */
export function buildDomain(p, n) {
  let idx = String(n);
  if (p.padLen > 0) idx = idx.padStart(p.padLen, "0");
  return p.prefix + idx + p.tail + p.suffix;
}

// ── probe ─────────────────────────────────────────────────────────────────────

/**
 * probePeer(host, port) → Promise<string|null>
 * Returns the ZEN WebSocket URL if the peer responds, else null.
 */
function probePeer(host, port) {
  return new Promise((resolve) => {
    const proto   = (port === 443 || port === 8420) ? "https" : "http";
    // Try HTTPS first; fall back to HTTP on connection error
    const attempt = (useHttps) => {
      const mod = useHttps ? https : http;
      const url = (useHttps ? "https" : "http") + "://" + host + ":" + port + "/zen.js";
      const req = mod.get(url, { timeout: TIMEOUT, rejectUnauthorized: false }, (res) => {
        if (res.statusCode === 200) {
          resolve((useHttps ? "wss" : "ws") + "://" + host + ":" + port + "/zen");
        } else {
          if (useHttps) attempt(false); else resolve(null);
        }
        res.resume();
      });
      req.on("error", () => { if (useHttps) attempt(false); else resolve(null); });
      req.on("timeout", () => { req.destroy(); if (useHttps) attempt(false); else resolve(null); });
    };
    attempt(true);
  });
}

// ── concurrency pool ──────────────────────────────────────────────────────────

async function pool(tasks, concurrency) {
  const results = [];
  let i = 0;
  const run = async () => {
    while (i < tasks.length) {
      const idx = i++;
      results[idx] = await tasks[idx]();
    }
  };
  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, run);
  await Promise.all(workers);
  return results.filter(Boolean);
}

// ── main export ───────────────────────────────────────────────────────────────

/**
 * scan(domain, opt) → Promise<string[]>
 *
 * opt.port       — configured port (probed in addition to DEFAULT_PORT)
 * opt.maxIndex   — how far to scan (default: 100)
 * opt.onFound    — callback(url) called as each peer is discovered
 *
 * Returns array of discovered peer ZEN WebSocket URLs.
 */
export async function scan(domain, opt = {}) {
  const pattern = parseDomainPattern(domain);
  if (!pattern) return [];

  const userPort = Number(opt.port) || DEFAULT_PORT;
  const maxIdx   = opt.maxIndex || MAX_INDEX;
  const found    = [];

  // Build candidate list: all indices 0..maxIdx except self
  const candidates = [];
  for (let n = 0; n <= maxIdx; n++) {
    if (n === pattern.index) continue; // skip self
    const host = buildDomain(pattern, n);
    const ports = [...new Set([userPort, DEFAULT_PORT])];
    for (const port of ports) {
      candidates.push({ host, port });
    }
  }

  // Probe in batches
  const tasks = candidates.map(({ host, port }) => async () => {
    const url = await probePeer(host, port);
    if (url) {
      found.push(url);
      if (opt.onFound) opt.onFound(url);
    }
    return url;
  });

  await pool(tasks, CONCURRENCY);
  return found;
}

/**
 * scanBackground(domain, opt) — fire-and-forget scan, calls opt.onFound as peers are found.
 * Returns immediately; does not block startup.
 */
export function scanBackground(domain, opt = {}) {
  if (!domain) return;
  setImmediate(() => {
    scan(domain, opt).catch(() => {});
  });
}
