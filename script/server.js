#!/usr/bin/env node

import cluster from "cluster";
import fs from "fs";
import path from "path";
import http from "http";
import https from "https";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import ZEN from "../index.js";
import * as xdg from "../lib/xdg.js";
import { discover, DOMAIN_FILE, PORT_FILE } from "../lib/discover.js";
import { scanBackground, parseDomainPattern } from "../lib/scan.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isMain = !!process.argv[1] && __filename === process.argv[1];

const nodeVersion = process.versions.node.split(".").map(Number);
if (nodeVersion[0] < 14) {
  console.error(
    "ERROR: Node.js 14+ required. Current version:",
    process.version,
  );
  process.exit(1);
}

process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("Received SIGINT, shutting down gracefully");
  process.exit(0);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

function validatePort(port) {
  const portNum = parseInt(port, 10);
  if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
    throw new Error("Invalid port: " + port + ". Must be between 1-65535");
  }
  return portNum;
}

function validateFilePath(filePath) {
  if (filePath.includes("../") || filePath.includes("..\\")) {
    throw new Error("Path traversal detected: " + filePath);
  }
  if (!path.isAbsolute(filePath)) {
    throw new Error("Absolute path required for security files: " + filePath);
  }
  return filePath;
}

function validatePeers(peers) {
  if (!peers) return [];
  return peers.split(",").map((peer) => {
    const trimmed = peer.trim();
    if (!/^https?:\/\/[\w.-]+([:/].*)?$/i.test(trimmed)) {
      throw new Error("Invalid peer URL: " + trimmed);
    }
    return trimmed;
  });
}

let zen;

if (isMain && cluster.isPrimary) {
  console.log("Master process " + process.pid + " starting...");
  cluster.setupPrimary({ exec: __filename });

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      "Worker " +
        worker.process.pid +
        " died with code " +
        code +
        " and signal " +
        signal,
    );
    if (code === 1) {
      console.error("Worker died due to configuration error, not restarting");
      process.exit(1);
    }
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log("Restarting worker...");
      cluster.fork();
    }
  });

  const worker = cluster.fork();
  process.on("SIGTERM", () => {
    console.log("Master received SIGTERM, shutting down workers...");
    worker.disconnect();
    setTimeout(() => {
      worker.kill();
    }, 5000);
  });
} else if (isMain) {
  const env = process.env;
  let port;
  let httpsPort;
  let peers;
  let domain;

  try {
    port = validatePort(env.PORT || process.argv[2] || 8420);
    httpsPort = env.HTTPS_PORT ? validatePort(env.HTTPS_PORT) : null;
    peers = validatePeers(env.PEERS);
    // Domain: env var > XDG config file
    domain = env.DOMAIN || null;
    if (!domain) {
      try { domain = fs.readFileSync(DOMAIN_FILE, "utf8").trim() || null; } catch {}
    }
  } catch (err) {
    console.error("Configuration Error:", err.message);
    process.exit(1);
  }

  const opt = {
    port,
    peers,
  };

  const zenCfgDir = xdg.config();
  const defaultKeyFile = path.join(zenCfgDir, "key.pem");
  const defaultCertFile = path.join(zenCfgDir, "cert.pem");

  if (env.HTTPS_KEY) {
    try {
      env.HTTPS_KEY = validateFilePath(env.HTTPS_KEY);
    } catch (err) {
      console.error("HTTPS_KEY validation failed:", err.message);
      process.exit(1);
    }
  }

  if (env.HTTPS_CERT) {
    try {
      env.HTTPS_CERT = validateFilePath(env.HTTPS_CERT);
    } catch (err) {
      console.error("HTTPS_CERT validation failed:", err.message);
      process.exit(1);
    }
  }

  if (fs.existsSync(defaultCertFile)) {
    env.HTTPS_KEY = env.HTTPS_KEY || defaultKeyFile;
    env.HTTPS_CERT = env.HTTPS_CERT || defaultCertFile;
  }

  // Latch domain from first incoming request Host header if still unknown
  let domainLatched = !!domain;
  function latchDomain(req) {
    if (domainLatched) return;
    const host = (req.headers.host || "").split(":")[0];
    if (host && host !== "localhost" && !/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
      domain = host;
      domainLatched = true;
      try { xdg.ensure(zenCfgDir); fs.writeFileSync(DOMAIN_FILE, domain + "\n"); } catch {}
      console.log("Domain latched from request:", domain);
      startScan();
      scheduleScan();
    }
  }

  // ── peer discovery ────────────────────────────────────────────────────────
  const knownPeers  = new Set(peers);  // all URLs ever seen
  const scannedPats = new Set();       // patterns scanned this cycle
  let scanTimer     = null;
  let pexMesh       = null;            // set after AXE attaches
  let foundInCycle  = false;           // tracks if addPeer fired this scan cycle
  const SCAN_INTERVAL     = 10 * 60 * 1000;   // 10 min base interval
  const MAX_SCAN_INTERVAL = 2 * 60 * 60 * 1000; // 2 hr cap
  const MAX_UPSTREAMS     = 10;        // max outbound peer connections from scan
  let   scanInterval      = SCAN_INTERVAL;

  function patternKey(host) {
    const p = parseDomainPattern((host || "").split(":")[0]);
    return p ? (p.prefix + "*" + p.tail + p.suffix) : host;
  }

  function addPeer(url) {
    if (knownPeers.has(url)) return;
    knownPeers.add(url);
    foundInCycle = true;
    console.log("Discovered peer:", url);
    const r = zen && zen._graph && zen._graph._;
    // Connect only if under upstream limit (prevents full mesh / bandwidth waste)
    const upstreamCount = r && r.axe ? Object.keys(r.axe.up || {}).length : 0;
    if (pexMesh && upstreamCount < MAX_UPSTREAMS) {
      try { pexMesh.hi({ id: url, url, retry: 9 }); } catch {}
    } else if (!pexMesh && r && r.opt) {
      // mesh not yet attached — queue in peer list for AXE to connect later
      if (!Array.isArray(r.opt.peers)) r.opt.peers = [];
      if (!r.opt.peers.includes(url)) r.opt.peers.push(url);
    }
    // Broadcast immediately to all currently connected peers
    if (pexMesh) {
      try { pexMesh.say({ dam: "pex", peers: [url] }, r && r.opt && r.opt.peers); } catch {}
    }
    // Expand scan to this peer's domain pattern
    try { scanDomain(new URL(url).hostname); } catch {}
  }

  function scanDomain(host) {
    if (!host) return;
    const key = patternKey(host);
    if (scannedPats.has(key)) return;
    scannedPats.add(key);
    console.log("Scanning pattern:", key);
    scanBackground(host, { port, onFound: addPeer });
  }

  function startScan() {
    if (domain) scanDomain(domain);
  }

  function scheduleScan() {
    clearTimeout(scanTimer);
    scanTimer = setTimeout(() => {
      foundInCycle = false;
      scannedPats.clear(); // new cycle — re-probe all known patterns
      startScan();
      // After 2 min (scan finishes well within that), check if we found anything
      const check = setTimeout(() => {
        if (!foundInCycle) {
          scanInterval = Math.min(scanInterval * 2, MAX_SCAN_INTERVAL);
          console.log(`Scan: no new peers — next scan in ${Math.round(scanInterval / 60000)}m`);
        } else {
          scanInterval = SCAN_INTERVAL; // reset backoff on any discovery
        }
        scheduleScan();
      }, 2 * 60 * 1000);
      if (check.unref) check.unref();
    }, scanInterval);
    scanTimer.unref();
  }

  if (
    env.HTTPS_KEY &&
    fs.existsSync(env.HTTPS_KEY) &&
    fs.existsSync(env.HTTPS_CERT)
  ) {
    const actualHttpsPort = httpsPort || opt.port || 443;
    const httpPort = env.HTTP_PORT ? validatePort(env.HTTP_PORT) : 80;

    console.log("SSL certificates found, enabling HTTPS...");

    let keyData;
    let certData;
    try {
      keyData = fs.readFileSync(env.HTTPS_KEY, "utf8");
      certData = fs.readFileSync(env.HTTPS_CERT, "utf8");

      if (!keyData.includes("BEGIN") || !keyData.includes("PRIVATE KEY")) {
        throw new Error("Invalid private key format");
      }
      if (!certData.includes("BEGIN CERTIFICATE")) {
        throw new Error("Invalid certificate format");
      }

      opt.key = keyData;
      opt.cert = certData;
    } catch (err) {
      console.error("SSL Certificate Error:", err.message);
      process.exit(1);
    }

    const serveHandler = ZEN.serve(__dirname);
    opt.server = https.createServer(opt, (req, res) => {
      latchDomain(req);
      serveHandler(req, res);
    });

    if (httpsPort == 443 || env.HTTP_REDIRECT === "true") {
      try {
        http
          .createServer((req, res) => {
            latchDomain(req);
            const redirectUrl =
              "https://" +
              req.headers.host.replace(":" + httpPort, ":" + httpsPort) +
              req.url;
            res.writeHead(301, { Location: redirectUrl });
            res.end();
          })
          .listen(httpPort);
        console.log(
          "HTTP redirect server started on port " +
            httpPort +
            " -> HTTPS " +
            httpsPort,
        );
      } catch (e) {
        console.log(
          "Warning: Could not start HTTP redirect server on port " +
            httpPort +
            ": " +
            e.message,
        );
      }
    }

    opt.port = actualHttpsPort;
    console.log("HTTPS server will start on port " + actualHttpsPort);
  } else {
    const serveHandler = ZEN.serve(__dirname);
    opt.server = http.createServer((req, res) => {
      latchDomain(req);
      serveHandler(req, res);
    });
    console.log("HTTP server will start on port " + opt.port);
  }

  zen = new ZEN({ web: opt.server.listen(opt.port), peers: opt.peers });
  console.log("Relay peer started on port " + opt.port + " with /zen");

  // ── PEX: peer exchange via direct DAM message (not public graph) ──────────
  // mesh.hear["pex"] + root.on("hi") — only shared with already-connected peers
  const selfUrl = domain
    ? ((opt.key ? "wss" : "ws") + "://" + domain + ":" + port + "/zen")
    : null;

  const root = zen._graph._;

  // Wait for AXE to attach opt.mesh (it runs synchronously but after ZEN init)
  setImmediate(() => {
    const mesh = root.opt && root.opt.mesh;
    if (!mesh) return;
    pexMesh = mesh;

    // Handle incoming peer lists from other nodes
    mesh.hear["pex"] = function (msg, _peer) {
      if (!Array.isArray(msg.peers)) return;
      msg.peers.forEach((url) => {
        if (typeof url === "string" && /^wss?:\/\//.test(url) && url !== selfUrl) {
          addPeer(url);
        }
      });
    };

    // On new peer connection: send our full known peer list to them
    root.on("hi", function (peer) {
      this.to.next(peer);
      const list = Array.from(knownPeers).filter((u) => u !== selfUrl);
      if (list.length) {
        setTimeout(() => {
          try { mesh.say({ dam: "pex", peers: list }, peer); } catch {}
        }, 500);
      }
      // Also send self URL
      if (selfUrl) {
        setTimeout(() => {
          try { mesh.say({ dam: "pex", peers: [selfUrl] }, peer); } catch {}
        }, 600);
      }
    });
  });

  // Start scan immediately if domain already known, else wait for first request
  if (domain) { startScan(); scheduleScan(); }
  else console.log("Domain not configured — will scan after first request");

  // Reactive rescan: when a peer disconnects, rescan after a 30s debounce
  let byeTimer = null;
  root.on("bye", function () {
    this.to.next.apply(this.to, arguments);
    clearTimeout(byeTimer);
    byeTimer = setTimeout(() => {
      scanInterval = SCAN_INTERVAL; // reset backoff — need to find replacements
      scannedPats.clear();
      console.log("Peer disconnected — rescanning...");
      startScan();
      scheduleScan();
    }, 30000);
    byeTimer.unref();
  });
}

export default zen;
