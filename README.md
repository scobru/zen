# ZEN — Zen Entropy Network

**ZEN** is an **offline-first graph database and cryptographic runtime** built from the `amark/gun -> akaoio/gun -> ZEN` lineage.

ZEN is no longer "GUN plus wrappers". It is now a **ZEN-first codebase**:

- **`src/`** is the active runtime source tree.
- **`zen.js` / `zen.min.js`** are the main build artifacts.
- the old parallel **`src/gun/`** and **`src/sea/`** trees have been removed from the active repo
- the public entry is **ZEN-only**
- the relay/server path is centered on **`lib/server.js`**

---

## Current status

ZEN has already moved well beyond yesterday's shape.

| Area                                                | Status                                      |
| --------------------------------------------------- | ------------------------------------------- |
| Graph runtime (HAM/CRDT, chain API, peers, storage) | Active in `src/`                            |
| Public runtime surface                              | `ZEN` only                                  |
| secp256k1 crypto                                    | Implemented                                 |
| P-256 / secp256r1 crypto                            | Implemented                                 |
| EVM and BTC key formats                             | Implemented                                 |
| PEN / policy VM                                     | Implemented with Zig -> WASM build pipeline |
| OPFS support                                        | Integrated                                  |
| RAD / Radisk / Radix                                | Integrated                                  |
| WebSocket transport                                 | Integrated                                  |
| Internal WebSocket server adapter                   | Replaced `ws` dependency                    |
| Vanilla HTTP form/body parsing                      | Replaced `formidable` dependency            |
| Internal S3 client                                  | Replaced `aws-sdk` dependency               |

Current test baseline:

- `npm test` -> **145 passing, 10 pending**
- `npm run testZEN` -> green
- `npm run testPEN` -> green

---

## What changed

ZEN is now a **fork-first successor**, not a greenfield experiment and not a thin rebrand.

### Before

- parallel `gun` / `sea` / `zen` identity
- legacy wrappers and compatibility layers
- extra dependency weight (`ws`, `formidable`, `aws-sdk`)
- noisy test harness output
- lingering architecture drift such as duplicate server identity

### Now

- **single active runtime identity: ZEN**
- `src/` is the source of truth
- public entry exports **ZEN**
- `gun.js` / `sea.js` are no longer the center of the repo
- noisy test harness output has been cleaned up
- transport/storage helpers were simplified and purified
- several legacy IIFE-style wrappers were removed or rewritten safely

---

## Why ZEN exists

ZEN keeps the strong graph and sync ideas from the GUN family, but pushes them toward a cleaner, more production-focused architecture:

1. **ZEN-first runtime identity** instead of multi-entry confusion.
2. **ESM-oriented structure** instead of old CommonJS-era habits.
3. **Multi-curve crypto** instead of a narrow single-curve worldview.
4. **Policy as a first-class runtime concern** through PEN.
5. **Smaller dependency surface** with more internal control over critical adapters.

---

## Install

```bash
npm install
```

### Developer onboarding

If you are only consuming ZEN as a package, `npm install` is enough.

If you are developing ZEN itself, you should also install the **Zig compiler** and make sure `zig` is available on your `PATH`.

Why this matters:

- ZEN is moving toward using more **Zig** over time
- **PEN** already uses a Zig -> WASM build pipeline
- the normal dev build path goes through `buildPEN`
- `npm run build`, `npm test`, and release-oriented builds are expected to work best in an environment where Zig is installed

Recommended dev setup:

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

### Crypto

```js
const pair = await ZEN.pair();
const signed = await ZEN.sign("hello", pair);
const verified = await ZEN.verify(signed, pair.pub);
```

### Multi-curve

```js
const secp = await ZEN.pair();
const p256 = await ZEN.pair(null, { curve: "p256" });
const evm = await ZEN.pair(null, { format: "evm" });
const btc = await ZEN.pair(null, { format: "btc" });
```

### Hashing

```js
const sha = await ZEN.hash("hello");
const keccak = await ZEN.hash("hello", { name: "keccak256" });
```

---

## Public API

### Instance API

```js
const zen = new ZEN(opt);

zen.get(key);
zen.put(data);
zen.on(cb);
zen.once(cb);
zen.map();
zen.set(data);
zen.back(n);
```

### Static / mirrored crypto API

```js
ZEN.pair(cb, opt);
ZEN.sign(data, pair);
ZEN.verify(data, pub);
ZEN.encrypt(data, pair);
ZEN.decrypt(data, pair);
ZEN.secret(pub, pair);
ZEN.hash(data, opt);
ZEN.certify(certs, policy, pair);
```

These helpers are also mirrored onto ZEN instances.

---

## PEN

PEN is part of the ZEN direction, not an add-on.

- policy bytecode VM
- Zig source
- WASM build output
- integrated into the repo's release and test flow

If you are contributing to ZEN, assume Zig is part of the toolchain, not an optional extra.

Relevant scripts:

```bash
npm run buildPEN
npm run testPEN
```

---

## Storage

ZEN currently includes multiple persistence paths:

- **RAD / Radisk / Radix**
- **filesystem storage**
- **IndexedDB**
- **OPFS**
- **S3**

Useful modules:

```js
import "@akaoio/zen/lib/store";
import "@akaoio/zen/lib/rfs";
import "@akaoio/zen/lib/rindexed";
import "@akaoio/zen/lib/opfs";
import "@akaoio/zen/lib/rs3";
```

Recent cleanup:

- direct `ws` dependency removed
- direct `formidable` dependency removed
- direct `aws-sdk` dependency removed

---

## Relay / server

The repo now treats **`lib/server.js`** as the server identity for ZEN.

Start the example relay:

```bash
npm start
```

That currently runs:

```bash
node --prof examples/zen-http.js
```

---

## Build and test

```bash
npm test
npm run testZEN
npm run testPEN
npm run buildZEN
npm run buildRelease
```

`npm test` rebuilds `zen.js`, rebuilds/minifies artifacts, cleans local test data, and runs the active graph/runtime suite.

---

## Architecture notes

### Source of truth

- runtime source: **`src/`**
- bundled output: **`zen.js`**, **`zen.min.js`**
- policy runtime: **PEN**
- active server path: **`lib/server.js`**

### Project direction

ZEN aims for:

- cleaner module boundaries
- less architecture drift
- fewer legacy wrappers
- fewer oversized dependencies
- tighter ownership over critical runtime layers

---

## Lineage

```text
amark/gun
  ->
akaoio/gun
  ->
ZEN
```

ZEN keeps the graph/sync inheritance, but its repo identity and runtime architecture are now explicitly ZEN-centered.

---

## Repository reality

If you knew this project yesterday, the important update is simple:

**ZEN is now materially different.**

It is no longer best described as a side experiment beside GUN/SEA. The repo has been consolidated around ZEN as the primary runtime, build target, test target, and architectural direction.
