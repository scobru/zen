# ZEN — Zen Entropy Network

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
// Bob derives a child key pair from his private key + shared seed
// ZEN.pair() automatically performs additive derivation when given both priv and seed
const child = await ZEN.pair(null, { priv: pair.priv, seed: "shared-namespace" });

// Alice derives the same child public key from Bob's public key + same seed
// ZEN.pair() performs public-only derivation when given pub and seed
const childPub = await ZEN.pair(null, { pub: pair.pub, seed: "shared-namespace" });
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

ZEN ships a second WASM module — `crypto.wasm` — compiled from Zig for the algorithms where native WASM compute beats JavaScript.

The principle: **use whatever is fastest**. Measure at the micro level, then decide. Hardware wins for SHA/AES/HMAC. WASM wins for algorithms the platform does not expose natively.

| Algorithm | Runtime | Why |
|-----------|---------|-----|
| SHA-256 | WebCrypto (`subtle.digest`) | Hardware SHA-NI |
| AES-GCM | WebCrypto (`subtle.encrypt`) | Hardware AES-NI |
| HMAC-SHA-256 | WebCrypto (`subtle.sign`) | Hardware SHA-NI — WASM was 7× slower |
| secp256k1 point multiply | V8 BigInt (native C++) | V8 JIT > WASM32 emulated wide mul (8–12×) |
| P-256 point multiply | V8 BigInt (native C++) | same reason |
| **Keccak-256** | **WASM** (`crypto.wasm`) | 25-lane u64, no WebCrypto equivalent — **5× faster** |
| **RIPEMD-160** | **WASM** (`crypto.wasm`) | No WebCrypto equivalent — **1.6M ops/s** |
| **base62** encode/decode | **WASM** (`crypto.wasm`) | Faster than BigInt for encoding |

```bash
npm run buildCrypto  # rebuild crypto.wasm from src/crypto_wasm.zig
```

---

## Benchmarks

ZEN ships a micro-benchmark harness in `test/bench/` for data-driven optimization. Each benchmark suite runs with configurable warmup and iteration counts and outputs both human-readable color output and machine-readable JSON.

```bash
npm run bench          # run all suites
npm run bench:hash     # hash algorithms (SHA-256, keccak256, ripemd160, DJB2)
npm run bench:json     # JSON.parse / parseAsync / YSON chunk parser
npm run bench:dup      # dedup pipeline (dup.check + dup.track)
npm run bench:radix    # Radix tree vs native Map
npm run bench:ham      # HAM CRDT comparisons, State(), put() e2e
npm run bench:sign     # ZEN.pair / sign / verify / encrypt
npm run bench:base62   # base62 WASM vs base64 baseline
```

Selected baselines (Node.js, 5000 iters):

| Suite | Operation | Throughput |
|-------|-----------|-----------|
| hash | keccak256 WASM 4B | 275K ops/s |
| hash | ripemd160 WASM 4B | 1.6M ops/s |
| hash | String.hash DJB2 | 3.6M ops/s |
| dup | full pipeline (Map) | 1.13M ops/s |
| dup | check missing (Map) | 4.54M ops/s |

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
  shim.js             — setTimeout.turn, setTimeout.each, String.hash DJB2
  dup.js              — message deduplication (called on every message)
  state.js            — CRDT vector clock (HAM)
  valid.js            — value validation
  onto.js             — doubly-linked list event emitter
  root.js             — ZEN constructor, universe() pipeline
  index.js            — main entry point
  core.js             — graph operations
  mesh.js             — P2P networking, JSON parse, batching
  websocket.js        — WebSocket transport layer
  chain.js            — method chaining logic
  get.js              — graph navigation
  put.js              — graph writes
  on.js               — event subscriptions
  map.js              — map/reduce operations
  set.js              — unordered collections
  back.js             — chain traversal
  
  # Crypto (formerly SEA, now integrated into ZEN)
  pair.js             — key pair generation
  sign.js             — signing
  verify.js           — signature verification
  encrypt.js          — encryption
  decrypt.js          — decryption
  secret.js           — ECDH shared secrets
  hash.js             — hashing (SHA-256, Keccak-256)
  certify.js          — certificates
  aeskey.js           — AES key derivation
  
  # Curves & formats
  curves/             — ECC implementations
    secp256k1.js      — secp256k1 curve (Bitcoin/Ethereum)
    secp256k1.zig     — Zig implementation
    p256.js           — P-256/secp256r1 curve
    p256.zig          — Zig implementation
    utils.js          — curve utilities
    utils.zig         — Zig utilities
  curves.js           — curve registry
  format.js           — key format conversions (base62, EVM, BTC)
  keyid.js            — key identifiers
  
  # WASM-accelerated crypto
  keccak256.js        — Keccak-256 wrapper
  keccak256.zig       — Zig implementation
  ripemd160.js        — RIPEMD-160 wrapper
  ripemd160.zig       — Zig implementation
  base62.js           — base62 encode/decode wrapper
  base62.zig          — Zig implementation
  sha256.js           — SHA-256 wrapper
  sha256.zig          — Zig implementation
  hmac_sha256.zig     — HMAC-SHA-256 implementation
  crypto_wasm_bridge.js — lazy WASM loader + typed wrappers
  crypto_wasm.zig     — WASM crypto module source
  wasm.zig            — WASM utilities
  
  # Policy engine
  pen.js              — PEN policy VM
  pen.zig             — PEN implementation in Zig
  
  # Utilities
  json.js             — JSON parsing & YSON
  buffer.js           — buffer utilities
  array.js            — array utilities
  ask.js              — query handling
  book.js             — peer registry
  graph.js            — graph utilities
  locstore.js         — local storage adapter
  runtime.js          — runtime detection
  security.js         — security utilities
  settings.js         — configuration

zen.js               — bundled browser/Node.js artifact
zen.min.js           — minified
crypto.wasm          — 66KB WASM crypto module
pen.wasm             — ~27KB WASM policy engine

lib/                 — storage adapters, extensions, build scripts
  server.js          — ZEN relay / server identity
  build-zen.js       — bundle script
  build-pen.js       — PEN WASM build
  build-crypto.js    — crypto WASM build
  
  # Storage adapters
  store.js           — storage abstraction
  radisk.js          — RAD/Radisk (default)
  radix.js           — Radix tree implementation
  rfs.js             — filesystem (Node.js)
  rindexed.js        — IndexedDB (browser)
  opfs.js            — OPFS (browser)
  rs3.js             — AWS S3
  memdisk.js         — in-memory storage
  
  # Extensions & utilities
  axe.js             — automatic peering / DHT
  webrtc.js          — WebRTC transport
  promise.js         — Promise API
  then.js            — Promise chaining
  yson.js            — YSON parser
  verify.js          — verification utilities
  cryptomodules.js   — crypto module loader
  and 100+ other adapters, utilities, middleware...

test/
  bench/             — micro-benchmark harness + 7 suites
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
    → ZEN (Zen Entropy Network)
```

ZEN keeps the graph and sync inheritance but has a separate runtime identity, build system, and architectural direction. It is not a thin rebrand — the source has been materially rewritten.
