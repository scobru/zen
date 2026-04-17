# ZEN

**ZEN** is an offline-first, decentralized graph database with a built-in cryptographic runtime.

It is the production successor to the `amark/gun → akaoio/gun → ZEN` lineage, now consolidated around a single ZEN-first identity, build target, and runtime architecture.

---

## What it does

- **Graph database** — realtime, decentralized, offline-first, CRDT-based conflict resolution
- **Crypto runtime** — key pairs, signing, verification, encryption, shared secrets, hashing
- **Multi-curve** — secp256k1 and P-256 / secp256r1 support
- **Key formats** — native base62, EVM (0x checksummed), BTC (P2PKH / WIF)
- **Policy VM** — PEN: a bytecode policy engine compiled from Zig to WASM
- **Storage adapters** — RAD/Radisk, filesystem, IndexedDB, OPFS, S3
- **Transport** — WebSocket (internal, no `ws` dependency)

---

## Install

```bash
npm install @akaoio/zen
```

Development requires [Zig](https://ziglang.org/) on your `PATH` (for the WASM build pipelines):

```bash
npm install
zig version
npm run build
```

---

## Quick start

```js
import ZEN from "@akaoio/zen";

const zen = new ZEN({ file: "data" });

zen.get("user").put({ name: "Alice" });
zen.get("user").once(console.log);
```

### Key pairs and crypto

```js
// Default: secp256k1
const pair = await ZEN.pair();
const signed = await ZEN.sign("hello", pair);
const ok = await ZEN.verify(signed, pair.pub);

// Encrypt / decrypt
const enc = await ZEN.encrypt("secret", pair);
const dec = await ZEN.decrypt(enc, pair);

// Shared secret (ECDH)
const alicePair = await ZEN.pair();
const secret = await ZEN.secret(alicePair.epub, pair);
```

### Multi-curve

```js
const secp = await ZEN.pair();                        // secp256k1 (default)
const p256 = await ZEN.pair(null, { curve: "p256" }); // P-256 / secp256r1
const evm  = await ZEN.pair(null, { format: "evm" }); // 0x EVM address
const btc  = await ZEN.pair(null, { format: "btc" }); // P2PKH mainnet
```

### Hashing

```js
const sha     = await ZEN.hash("hello");                        // SHA-256
const keccak  = await ZEN.hash("hello", { name: "keccak256" }); // Keccak-256
```

### Seed-based deterministic keys

```js
const pair1 = await ZEN.pair(null, { seed: "my-deterministic-seed" });
const pair2 = await ZEN.pair(null, { seed: "my-deterministic-seed" });
// pair1.pub === pair2.pub — always
```

### Additive key derivation

```js
// Bob derives child key pair from his private key + shared seed
const child = await ZEN.derive(pair, "shared-namespace");

// Alice derives the same child public key from Bob's public key + same seed
const childPub = await ZEN.derive({ pub: pair.pub }, "shared-namespace");
// child.pub === childPub.pub — without either party revealing private keys
```

---

## API

### Graph (instance)

```js
const zen = new ZEN(opt);

zen.get(key)        // navigate to a node
zen.put(data)       // write data
zen.on(cb)          // subscribe to realtime updates
zen.once(cb)        // read once
zen.map()           // iterate a set
zen.set(data)       // add to a set (unordered collection)
zen.back(n)         // navigate up the chain
```

### Crypto (static + instance mirror)

```js
ZEN.pair(cb, opt)                // generate key pair
ZEN.sign(data, pair)             // sign data
ZEN.verify(data, pub)            // verify signature
ZEN.encrypt(data, pair)          // encrypt
ZEN.decrypt(data, pair)          // decrypt
ZEN.secret(pub, pair)            // ECDH shared secret
ZEN.hash(data, opt)              // hash (SHA-256 or keccak256)
ZEN.certify(certs, policy, pair) // create a certificate
```

All static methods are also available as instance methods: `zen.pair()`, `zen.sign()`, etc.

---

## Storage

```js
import "@akaoio/zen/lib/store";    // RAD / Radisk (default)
import "@akaoio/zen/lib/rfs";      // filesystem (Node.js)
import "@akaoio/zen/lib/rindexed"; // IndexedDB (browser)
import "@akaoio/zen/lib/opfs";     // OPFS (browser)
import "@akaoio/zen/lib/rs3";      // AWS S3
```

---

## PEN — policy VM

PEN is a bytecode policy engine integrated into ZEN. It compiles Zig source to WASM and runs verifiable access policies over graph writes.

```js
const soul = ZEN.pen({ val: { type: "string" }, sign: true });
// soul is a bytecode-encoded access policy string
```

```bash
npm run buildPEN     # rebuild pen.wasm from src/pen.zig
npm run testPEN      # run PEN unit tests
```

---

## WASM crypto pipeline

ZEN ships a second WASM module — `crypto.wasm` — compiled from Zig for the algorithms where native WASM compute beats JavaScript:

| Algorithm | Runtime | Why |
|-----------|---------|-----|
| SHA-256 | WebCrypto (`subtle.digest`) | Hardware SHA-NI |
| AES-GCM | WebCrypto (`subtle.encrypt`) | Hardware AES-NI |
| HMAC-SHA-256 | WebCrypto (`subtle.sign`) | Hardware SHA-NI |
| secp256k1 point multiply | V8 BigInt (native C++) | V8 JIT > WASM32 emulated wide mul |
| P-256 point multiply | V8 BigInt (native C++) | same reason |
| **Keccak-256** | **WASM** (`crypto.wasm`) | 25-lane u64, no WebCrypto equivalent |
| **RIPEMD-160** | **WASM** (`crypto.wasm`) | No WebCrypto equivalent |
| **base62** encode/decode | **WASM** (`crypto.wasm`) | Faster than BigInt for encoding |

The principle: use whatever is fastest. Platform hardware wins for SHA/AES/HMAC. WASM wins for algorithms the platform does not expose natively.

```bash
npm run buildCrypto  # rebuild crypto.wasm from src/crypto_wasm.zig
```

---

## Build and test

```bash
npm test             # build zen.js + run full suite (PEN + ZEN unit + core)
npm run testZEN      # build + ZEN unit tests only
npm run testPEN      # build + PEN unit tests only
npm run buildZEN     # buildPEN + buildCrypto + bundle + minify
npm run buildRelease # buildZEN + uglify all lib adapters
npm start            # start example relay (examples/zen-http.js)
```

Current baseline: **171 passing**.

---

## Architecture

```
src/                  — runtime source (source of truth)
  root.js             — ZEN constructor
  core.js             — graph operations
  mesh.js             — P2P networking
  sea/                — crypto: pair, sign, verify, encrypt, hash, certify
  curves/             — ECC (secp256k1, P-256) BigInt + Zig sources
  keccak256.js        — WASM-accelerated Keccak-256
  ripemd160.js        — WASM-accelerated RIPEMD-160
  base62.js           — WASM-accelerated base62
  crypto_wasm_bridge.js — lazy WASM loader + typed wrappers
  pen.js              — PEN policy VM

zen.js               — bundled browser/Node.js artifact
zen.min.js           — minified
crypto.wasm          — 66KB WASM crypto module
pen.wasm             — ~27KB WASM policy engine

lib/                 — storage adapters, build scripts
  server.js          — ZEN relay / server identity
  build-zen.js       — bundle script
  build-pen.js       — PEN WASM build
  build-crypto.js    — crypto WASM build
  radisk.js / rfs.js / rindexed.js / rs3.js / ...

test/
  zen/               — ZEN unit tests (instance, crypto, multicurve, certify)
  pen.js             — PEN unit tests
  zen.js             — core graph integration tests
  rad/               — RAD storage tests
```

---

## Lineage

```
amark/gun
  → akaoio/gun
    → ZEN
```

ZEN keeps the graph and sync inheritance but has a separate runtime identity, build system, and architectural direction. It is not a thin rebrand — the source has been materially rewritten.
