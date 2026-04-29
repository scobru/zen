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
    description: "Generate a new cryptographic key pair. Supports secp256k1 (default) and p256 curves. Pass seed for deterministic derivation. Pass priv/epriv+seed for additive (HD) derivation.",
    inputSchema: { type: "object", properties: {
      curve: { type: "string", description: "secp256k1 (default) or p256" },
      seed:  { type: "string", description: "Passphrase for deterministic key generation" },
      priv:  { type: "string", description: "Existing signing private key for additive derivation" },
      epriv: { type: "string", description: "Existing encryption private key for additive derivation" },
      pub:   { type: "string", description: "Existing signing public key for public-only additive derivation" },
      epub:  { type: "string", description: "Existing encryption public key for public-only additive derivation" },
    }},
  },
  {
    name: "sign",
    description: "Sign data with a private key (ECDSA)",
    inputSchema: { type: "object", required: ["data", "priv"],
      properties: {
        data: { type: "string" },
        priv: { type: "string", description: "Signing private key" },
        pub:  { type: "string", description: "Corresponding public key (optional, improves verification)" },
      } },
  },
  {
    name: "verify",
    description: "Verify a signed value, returns original data or null",
    inputSchema: { type: "object", required: ["signed", "pub"],
      properties: { signed: { type: "string" }, pub: { type: "string" } } },
  },
  {
    name: "encrypt",
    description: "Encrypt data with a recipient public encryption key (epub) using AES-GCM + ECDH",
    inputSchema: { type: "object", required: ["data", "epub"],
      properties: {
        data: { type: "string" },
        epub: { type: "string", description: "Recipient encryption public key" },
      } },
  },
  {
    name: "decrypt",
    description: "Decrypt data with a private encryption key (epriv)",
    inputSchema: { type: "object", required: ["enc", "epriv"],
      properties: {
        enc:   { type: "string", description: "Encrypted object as JSON string" },
        epriv: { type: "string", description: "Your encryption private key" },
      } },
  },
  {
    name: "secret",
    description: "Derive ECDH shared secret between your epriv and a peer's epub",
    inputSchema: { type: "object", required: ["epub", "epriv"],
      properties: {
        epub:  { type: "string", description: "Peer's encryption public key" },
        epriv: { type: "string", description: "Your encryption private key" },
      } },
  },
  {
    name: "hash",
    description: "Hash data. Default: PBKDF2 with random salt. Pass name='SHA-256' or name='KECCAK-256' for raw digest. Pass pow for mining mode.",
    inputSchema: { type: "object", required: ["data"],
      properties: {
        data:       { type: "string" },
        salt:       { type: "string", description: "Salt for PBKDF2 (optional, random if omitted)" },
        name:       { type: "string", description: "Algorithm: SHA-256, KECCAK-256, PBKDF2, HKDF (default: PBKDF2)" },
        encode:     { type: "string", description: "Output encoding: base62 (default), base64, hex" },
        iterations: { type: "number", description: "PBKDF2 iterations (default: 100000)" },
        pow:        { type: "string", description: "JSON: {unit, difficulty} for mining mode" },
      } },
  },
  {
    name: "certify",
    description: "Issue a certificate granting another pubkey write access to a policy",
    inputSchema: { type: "object", required: ["pub", "policy", "priv"],
      properties: {
        pub:    { type: "string", description: "Recipient public key (or JSON array of pub keys)" },
        policy: { type: "string", description: "JSON: {write: expr} or {read: expr, write: expr}" },
        priv:   { type: "string", description: "Issuer signing private key" },
        expiry: { type: "number", description: "Expiry timestamp (ms)" },
      } },
  },
  {
    name: "recover",
    description: "Recover public key from a signed value (requires recovery bit v in signature)",
    inputSchema: { type: "object", required: ["signed"],
      properties: {
        signed: { type: "string", description: "Signed data string produced by sign()" },
      } },
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
  if (name === "pair") {
    const opt = {};
    if (args.curve) opt.curve = args.curve;
    if (args.seed)  opt.seed  = args.seed;
    if (args.priv)  opt.priv  = args.priv;
    if (args.epriv) opt.epriv = args.epriv;
    if (args.pub)   opt.pub   = args.pub;
    if (args.epub)  opt.epub  = args.epub;
    return ZEN.pair(null, Object.keys(opt).length ? opt : undefined);
  }
  if (name === "sign")    return ZEN.sign(args.data, { priv: args.priv, pub: args.pub });
  if (name === "verify")  return ZEN.verify(args.signed, args.pub);
  if (name === "encrypt") return ZEN.encrypt(args.data, args.epub);
  if (name === "decrypt") return ZEN.decrypt(args.enc, { epriv: args.epriv });
  if (name === "secret")  return ZEN.secret(args.epub, { epriv: args.epriv });
  if (name === "recover") return ZEN.recover(args.signed);
  if (name === "certify") {
    const policy = JSON.parse(args.policy);
    const auth   = { priv: args.priv, pub: args.pub };
    const opt    = {};
    if (args.expiry) opt.expiry = args.expiry;
    return ZEN.certify(args.pub, policy, auth, null, opt);
  }
  if (name === "hash") {
    const opt = {};
    if (args.name)       opt.name       = args.name;
    if (args.encode)     opt.encode     = args.encode;
    if (args.salt)       opt.salt       = args.salt;
    if (args.iterations) opt.iterations = args.iterations;
    if (args.pow)        opt.pow        = JSON.parse(args.pow);
    return ZEN.hash(args.data, null, null, Object.keys(opt).length ? opt : { name: "SHA-256", encode: "base62" });
  }
  throw new Error("Unknown tool: " + name);
}
