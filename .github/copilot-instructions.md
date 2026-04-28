# ZEN Development Guide for AI Agents

## Project Overview

ZEN is a realtime, decentralized, offline-first, graph data synchronization engine with CRDT-based conflict resolution. It is a production-grade P2P database with built-in crypto, an embedded WebAssembly policy VM (PEN), and multi-curve key support.

## Architecture & Build System

### Module System

ZEN uses **native ES modules** (`import`/`export`) throughout `/src`. A custom Node.js bundler at `lib/builder/zen.js` bundles `src/index.js` and all its imports into `zen.js` for the browser. There is **no** USE/CommonJS wrapper pattern.

- Source files in `/src` — edit these directly
- `lib/builder/zen.js` — bundler script
- `lib/builder/pen.js` — bundles PEN module
- `lib/builder/crypto.js` — bundles crypto module
- Bundled outputs: `zen.js`, `zen.min.js`
- **After modifying `/src` files, always run `npm run buildZEN`**

### Entry Points

- `index.js` → Node.js server (imports `lib/server.js`)
- `browser.js` → Browser (imports `zen.js`)
- `zen.js` → Pre-bundled browser build (built from `src/index.js`)
- `lib/server.js` → Adds rfs, rs3, wire, axe, multicast, serve on top of zen.js

### Core Source Modules (`/src`)

- `root.js` — Core `Zen` constructor, `Zen.create()`, `universe()` message router
- `graph.js` — Assembles all chain methods, exports `graph.create(opt)`
- `chain.js` — `Zen.chain.chain()`, output routing
- `put.js` — Write path, `zen.put(data, cb, opt)`
- `get.js` — Read path, `zen.get(key)`
- `on.js` — Real-time subscriptions
- `map.js`, `set.js` — Collection operations
- `mesh.js` — P2P networking, message batching/puffing
- `websocket.js` — WebSocket transport
- `locstore.js` — localStorage adapter (browser default)
- `state.js` — HAM state timestamp generation
- `valid.js` — Value type validation
- `shim.js` — Buffer, TextEncoder, async JSON, `String.random`, `setTimeout.turn`
- `security.js` — Re-exports `src/runtime.js` (runtime middleware bridge)

### Crypto Modules (`/src`)

- `index.js` — ZEN class with static crypto methods; mirrors all statics + chain methods
- `pair.js` — Key generation: `pair(cb, opt)` — secp256k1 or p256, supports seed and additive derivation
- `sign.js` / `verify.js` — ECDSA sign/verify
- `encrypt.js` / `decrypt.js` — AES-GCM encryption/decryption
- `secret.js` — ECDH shared secret
- `hash.js` — SHA-256, KECCAK-256, base62 encoding, **mining mode** via `opt.pow`
- `recover.js` — Public key recovery from signature + recovery bit
- `certify.js` — Certificate system (delegate write access to other pub keys)
- `keyid.js` — Key fingerprinting
- `curves.js` — Curve registry: `secp256k1` (default), `p256` (alias `secp256r1`)
- `curves/secp256k1.js`, `curves/p256.js` — Pure-JS elliptic curve implementations
- `aeskey.js` — AES-GCM key derivation
- `settings.js` — Crypto settings, `settings.check()`, `settings.parse()`, `settings.pack/unpack`
- `base62.js` — Base62 encoding/decoding (used throughout crypto)
- `sha256.js`, `keccak256.js` — Hash primitives
- `format.js` — Signature serialization

### PEN Policy VM (`/src/pen.js` + `/src/pen.wasm`)

PEN (Predicate-Embedded Namespace) is a **WebAssembly bytecode VM** compiled from Zig (`src/pen.zig`).

```
┌─────────────────────────────────────────────────────┐
│  Layer 2: Application                               │
│  ZEN.pen(spec) → soul string "!<base62>"            │
├─────────────────────────────────────────────────────┤
│  Layer 1: ZEN-PEN Bridge (src/pen.js)               │
│  Compiles spec to bytecode, enforces policies       │
│  Handles policy opcodes: SGN(0xC0), CRT(0xC1),      │
│  NOA(0xC3), POW(0xC4)                               │
│  Hooks into security middleware via runtime.check   │
├─────────────────────────────────────────────────────┤
│  Layer 0: pen.wasm — STANDALONE (26 KB, 0 imports)  │
│  Source: src/pen.zig, compiled to WASM              │
│  Input: bytecode + registers → Output: boolean      │
└─────────────────────────────────────────────────────┘
```

**PEN soul format**: `'!' + base62(bytecode)` — souls starting with `!` trigger PEN validation on every write.

**PEN register conventions**:

| Register | Field | Description |
|---------|-------|-------------|
| R[0] | `key` | Graph key being written |
| R[1] | `val` | Value (verified plaintext if `sign:true`) |
| R[2] | `soul` | Full soul string |
| R[3] | `state` | HAM state timestamp |
| R[4] | `now` | `Date.now()` |
| R[5] | `pub` | Writer's public key |
| R[6] | `path` | Path after pencode/ in soul |
| R[7] | `nonce` | PoW nonce (from `msg.put["^"]`) |
| R[128–255] | `local[n]` | LET-bound locals |

**Policy tail opcodes** (appended after expression bytecode, invisible to WASM VM):

| Opcode | Name | Effect |
|--------|------|--------|
| `0xC0` | SGN | Require valid signature |
| `0xC1 <len> <pub>` | CRT | Require cert signed by `pub` |
| `0xC3` | NOA | Open write (no policy) |
| `0xC4 <field> <diff> <ulen> <unit>` | POW | Require Proof of Work |

**`ZEN.pen(spec)` — spec fields**:

| Field | Validates | Register |
|-------|-----------|----------|
| `key` | key string | R[0] |
| `val` | value | R[1] |
| `soul` | full soul | R[2] |
| `state` | state timestamp | R[3] |
| `path` | path sub-soul | R[6] |
| `sign: true` | require valid ECDSA signature | policy |
| `cert: pubkey` | require cert from pubkey | policy |
| `open: true` | allow all writes | policy |
| `pow: {unit, difficulty}` | require PoW | policy |

**`ZEN.candle(opts)`** — returns a `key` expr validating a time-candle window. Options: `{ seg, sep, size, back, fwd }`.

### Storage Adapters (`/lib`)

- `locstore.js` (in `/src`) — localStorage (browser default, pass `localStorage: false` for memory-only)
- `rfs.js` — Node.js filesystem
- `radisk.js` — RAD (Radix Atomic Disk) storage, primary persistence for Node
- `rs3.js` — AWS S3 adapter
- `rindexed.js` — Browser IndexedDB adapter

## Developer Workflows

### Build & Test

```bash
# Build
npm run buildZEN       # Bundle src/ → zen.js + zen.min.js (CRITICAL after /src changes)
npm run buildPEN       # Rebuild PEN WASM module (only after src/pen.zig changes)
npm run buildCrypto    # Rebuild crypto module
npm run buildRelease   # Full release build (buildZEN + uglify all lib/)

# Testing
npm run clean          # Remove radata/data directories
npm run test:all       # Run all tests
npm run test:core      # Core + RAD tests (mocha)
npm run testZEN:unit   # Crypto/certify unit tests
npm run testPEN        # PEN VM tests
npm test               # buildZEN + test:all

# Browser tests
npm run test:browser:setup   # Install Playwright Chromium
npm run test:browser         # Run browser tests via Playwright
```

### Build flow

1. Edit files in `/src`
2. Run `npm run buildZEN` — bundles `src/index.js` → `zen.js`
3. Run `npm run clean && npm run test:all` — clean data and run tests

## Core Patterns

### 1. HAM (Hypothetical Amnesia Machine)

ZEN's CRDT conflict resolution:

- Every value has a `>` (state) timestamp (`Zen.state()` generates ms timestamps)
- Conflicts resolved by: later state wins, ties preserve existing value
- `src/state.js` and `src/valid.js`

### 2. Graph Node Structure

```javascript
{
  "_": {
    "#": "soul-id",              // Node ID (soul)
    ">": { "key": 1234567890 }   // HAM state per key
  },
  "key": "value",                // User data (or signed blob)
  "^": "nonce"                   // PoW nonce (if applicable)
}
```

### 3. Internal Messaging Protocol

All operations flow through `universe()` in `src/root.js`:

- Messages: `#` (msg ID), `@` (reply-to), `put` (write data), `get` (query)
- Dedup via `dup.track()` / `dup.check()`
- Routing: `at.on('in')` incoming, `at.on('out')` outgoing
- **Never modify `msg.out`** — it tracks middleware chain

### 4. Crypto API

```javascript
// Key generation
const pair = await ZEN.pair()                    // secp256k1 by default
const pair256 = await ZEN.pair(null, { curve: 'p256' })
const derived = await ZEN.pair(null, { seed: 'passphrase' })

// Additive derivation (HD wallets)
const child = await ZEN.pair(null, { seed: 'child-seed', priv: pair.priv, epriv: pair.epriv })

// Sign / verify
const signed = await ZEN.sign(data, pair)
const data = await ZEN.verify(signed, pair.pub)

// Encrypt / decrypt
const enc = await ZEN.encrypt(data, pair.epub)
const dec = await ZEN.decrypt(enc, pair.epriv)

// Hash (SHA-256 or KECCAK-256)
const h = await ZEN.hash(data, null, null, { name: 'SHA-256', encode: 'base62' })

// Mining
const result = await ZEN.hash(data, null, null, { pow: { unit: '0', difficulty: 3 } })
// result = { hash, nonce, proof }
```

### 5. Signed Data Format

- Signed: `'ZEN{...}' | '{"m":{...},"s":"sig","v":0}'`
- Encrypted: `{ ct: "...", iv: "...", s: "..." }`
- `settings.check(t)` — detects signed/encrypted strings
- `settings.parse(t)` — async parse/verify
- `settings.pack(d, cb, k, n, s)` — pack for verify
- `settings.unpack(d, k, n)` — extract plaintext

### 6. Certificates

```javascript
// Grant write access to another pubkey
const cert = await ZEN.certify([recipientPub], { write: policyExpr }, issuerPair)

// Use cert in put
zen.get(soul).get(key).put(data, null, { authenticator: pair, cert })
```

### 7. Proof of Work (PoW)

**In `ZEN.pen(spec)`** — soul policy declares PoW requirement:
```javascript
const soul = ZEN.pen({ key: myKeyExpr, pow: { unit: '0', difficulty: 3 } })
// No `field` needed — R[7] is always the nonce register
```

**In `zen.put` opt** — triggers auto-mining before write:
```javascript
zen.get(soul).get(key).put(data, null, { authenticator, pow: { unit: '0', difficulty: 3 } })
```

- `pow` in `opt` must be `{ unit, difficulty }` (policy object) — **not** a nonce string
- Mining hashes the canonical block `{#, ., :, >}` + ":" + nonce (SHA-256)
- Computed nonce stored in `msg.put["^"]` and propagated to all peers
- Peers verify by re-hashing the same canonical block
- `sign` and `pow` are independent — a soul can require both, either, or neither

### 8. Authenticator Pattern

```javascript
// Key pair as authenticator
zen.get(soul).get(key).put(data, null, { authenticator: pair })

// External signer (WebAuthn, HSM)
zen.get(soul).get(key).put(data, null, {
  authenticator: async (data) => ({ signature, authenticatorData })
})
```

### 9. `ZEN` class (main export)

`zen.js` exports a `class ZEN` that wraps the graph core and mirrors all static crypto methods:

```javascript
import ZEN from './zen.js'

// Create a graph instance
const zen = new ZEN({ localStorage: false })   // memory-only
const zenP = new ZEN({ peers: ['ws://...'] })  // with peers

// Static methods available on ZEN class
ZEN.pen(spec)         // compile PEN policy soul
ZEN.candle(opts)      // candle window expression
ZEN.pair(cb, opt)     // generate key pair
ZEN.sign(data, pair)  // sign data
ZEN.verify(sig, pub)  // verify signature
ZEN.encrypt(data, epub) // encrypt
ZEN.decrypt(enc, epriv) // decrypt
ZEN.hash(data, ...)   // hash / mine
ZEN.certify(...)      // create certificate
ZEN.recover(signed)   // recover pub key from signature
```

### 10. Adding Chain Methods

```javascript
import Zen from './src/root.js'

Zen.chain.myMethod = function (data) {
  var zen = this, at = zen._
  // use zen.get(), zen.put(), etc.
  return zen // enable chaining
}
```

## Common Pitfalls

1. **Forgotten Build**: Changes to `/src/*.js` don't affect browser until `npm run buildZEN`
2. **Test Data Pollution**: ALWAYS `npm run clean` between test runs
3. **Circular References**: ZEN supports them natively — don't "fix" them
4. **Async Everywhere**: All storage/network ops use callbacks or async/await
5. **HAM Violations**: Never manually set state timestamps — use `Zen.state()`
6. **PoW `opt.pow` must be a policy object `{unit, difficulty}`**, not a nonce string
7. **`field` in `pen.pow` is internal** — R[7] is always the nonce register, do not pass `field` from application code
8. **PEN soul must start with `!`** — the `ZEN.pen()` compiler always adds this prefix
9. **`pen.ready`** is a Promise — must `await pen.ready` before calling `pen.run()` directly
10. **`sign` and `pow` are independent policies** — can be combined freely in one `ZEN.pen()` spec

## File Naming Conventions

- `r*.js` in `/lib` = Storage adapters (rfs, radisk, rindexed, rs3)
- `*.zig` in `/src` = Zig source for WASM modules (pen.zig, crypto.zig, etc.)
- `*.wasm` = Compiled WebAssembly (do not edit directly)
- `*.d.ts` = TypeScript definitions (not primary source)
- `axe.js` = Automatic peering/DHT clustering
- `nts.js` = "No Time Sync" mode

---

**After any `/src` change**: `npm run buildZEN && npm run clean && npm run test:all`
**After `src/pen.zig` change**: `npm run buildPEN && npm run buildZEN`
