#!/usr/bin/env node

import cluster from "cluster";
import fs from "fs";
import path from "path";
import os from "os";
import http from "http";
import https from "https";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import ZEN from "../index.js";

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

  try {
    port = validatePort(env.PORT || process.argv[2] || 8420);
    httpsPort = env.HTTPS_PORT ? validatePort(env.HTTPS_PORT) : null;
    peers = validatePeers(env.PEERS);
  } catch (err) {
    console.error("Configuration Error:", err.message);
    process.exit(1);
  }

  const opt = {
    port,
    peers,
  };

  const homeDir = os.homedir();
  const defaultKeyFile = path.join(homeDir, "key.pem");
  const defaultCertFile = path.join(homeDir, "cert.pem");

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

    opt.server = https.createServer(opt, ZEN.serve(__dirname));

    if (httpsPort == 443 || env.HTTP_REDIRECT === "true") {
      try {
        http
          .createServer((req, res) => {
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
    opt.server = http.createServer(ZEN.serve(__dirname));
    console.log("HTTP server will start on port " + opt.port);
  }

  zen = ZEN({ web: opt.server.listen(opt.port), peers: opt.peers });
  console.log("Relay peer started on port " + opt.port + " with /zen");
}

export default zen;
