#!/usr/bin/env node
// ZEN MCP — full peer node + Model Context Protocol stdio server
// Each running instance contributes to the ZEN P2P network
import ZEN from "../index.js";
import * as xdg from "./xdg.js";

const BOOTSTRAP = ["wss://peer0.akao.io", "wss://peer1.akao.io"];
const peers = process.env.ZEN_PEERS
  ? process.env.ZEN_PEERS.split(",").filter(Boolean)
  : BOOTSTRAP;

// Full ZEN peer — rfs + axe + multicast activated via index.js
xdg.ensure(xdg.data());
const zen = new ZEN({ peers, file: xdg.data() + "/mcp" });

// JSON-RPC 2.0 over stdio — no external dependencies
let buf = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (d) => {
  buf += d;
  const lines = buf.split("\n");
  buf = lines.pop();
  for (const line of lines) {
    if (!line.trim()) continue;
    try { handle(JSON.parse(line)); } catch (e) {}
  }
});

function send(obj) { process.stdout.write(JSON.stringify(obj) + "\n"); }

const TOOLS = [
  {
    name: "get",
    description: "Read a value from the ZEN graph",
    inputSchema: { type: "object", required: ["soul", "key"],
      properties: { soul: { type: "string" }, key: { type: "string" } } },
  },
  {
    name: "put",
    description: "Write a value to the ZEN graph, synced P2P to all peers",
    inputSchema: { type: "object", required: ["soul", "key", "value"],
      properties: { soul: { type: "string" }, key: { type: "string" }, value: { type: "string" } } },
  },
  {
    name: "on",
    description: "Get current value of a node (snapshot)",
    inputSchema: { type: "object", required: ["soul", "key"],
      properties: { soul: { type: "string" }, key: { type: "string" } } },
  },
  {
    name: "pair",
    description: "Generate a new cryptographic key pair (secp256k1)",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "sign",
    description: "Sign data with a private key",
    inputSchema: { type: "object", required: ["data", "priv"],
      properties: { data: { type: "string" }, priv: { type: "string" }, pub: { type: "string" } } },
  },
  {
    name: "verify",
    description: "Verify a signed value, returns original data or null",
    inputSchema: { type: "object", required: ["signed", "pub"],
      properties: { signed: { type: "string" }, pub: { type: "string" } } },
  },
  {
    name: "encrypt",
    description: "Encrypt data with a recipient public encryption key (epub)",
    inputSchema: { type: "object", required: ["data", "epub"],
      properties: { data: { type: "string" }, epub: { type: "string" } } },
  },
  {
    name: "decrypt",
    description: "Decrypt data with a private encryption key (epriv)",
    inputSchema: { type: "object", required: ["enc", "epriv"],
      properties: { enc: { type: "string" }, epriv: { type: "string" } } },
  },
  {
    name: "hash",
    description: "Hash data with SHA-256, returns base62 string",
    inputSchema: { type: "object", required: ["data"],
      properties: { data: { type: "string" } } },
  },
];

async function handle(msg) {
  const { id, method, params } = msg;

  if (method === "initialize") {
    return send({ jsonrpc: "2.0", id, result: {
      protocolVersion: "2024-11-05",
      capabilities: { tools: {} },
      serverInfo: { name: "zen", version: "1.0.0" },
    }});
  }

  if (!method || method.startsWith("notifications/")) return;

  if (method === "tools/list") {
    return send({ jsonrpc: "2.0", id, result: { tools: TOOLS } });
  }

  if (method === "tools/call") {
    const { name, arguments: args } = params;
    try {
      const result = await call(name, args || {});
      send({ jsonrpc: "2.0", id, result: {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      }});
    } catch (e) {
      send({ jsonrpc: "2.0", id, error: { code: -32000, message: e.message } });
    }
    return;
  }

  if (id !== undefined) {
    send({ jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } });
  }
}

async function call(name, args) {
  if (name === "get" || name === "on") {
    return new Promise((r) => zen.get(args.soul).get(args.key).once((v) => r(v ?? null)));
  }
  if (name === "put") {
    return new Promise((resolve, reject) => {
      zen.get(args.soul).get(args.key).put(args.value, (ack) => {
        if (ack && ack.err) reject(new Error(ack.err));
        else resolve({ ok: true });
      });
    });
  }
  if (name === "pair")    return ZEN.pair();
  if (name === "sign")    return ZEN.sign(args.data, { priv: args.priv, pub: args.pub });
  if (name === "verify")  return ZEN.verify(args.signed, args.pub);
  if (name === "encrypt") return ZEN.encrypt(args.data, args.epub);
  if (name === "decrypt") return ZEN.decrypt(args.enc, { epriv: args.epriv });
  if (name === "hash")    return ZEN.hash(args.data);
  throw new Error("Unknown tool: " + name);
}
