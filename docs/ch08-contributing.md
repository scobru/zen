# Chapter 8 — Contributing

> **Goal:** Get your development environment running, understand the build system, run the test suite, and know the conventions for adding new features.

---

## 8.1 Development setup

```bash
git clone https://github.com/akaoio/zen
cd zen
npm install
```

To build PEN (the WASM policy VM), you also need [Zig](https://ziglang.org/download/) on your `PATH`:

```bash
zig version  # should print something like "0.14.0"
```

---

## 8.2 Build system — USE

ZEN uses a **custom bundler** called USE (not CommonJS or ESM). Source files live in `/src`. The bundled output is `zen.js` and `zen.min.js`.

```
/src/*.js     ← source (USE module format)
zen.js        ← bundled browser build (generated)
zen.min.js    ← minified (generated)
```

**CRITICAL:** After modifying any `/src` file, run:

```bash
npm run buildZEN
```

If you skip this step, browser tests and the bundled output will use the old code.

---

## 8.3 Build scripts

| Script | What it does |
|--------|-------------|
| `npm run buildZEN` | Build `zen.js` from `/src` (includes buildPEN + buildCrypto) |
| `npm run buildPEN` | Build `lib/pen.wasm` from `src/pen.zig` (requires Zig) |
| `npm run buildCrypto` | Bundle the crypto module |
| `npm run minifyZEN` | Minify `zen.js` → `zen.min.js` using uglify-js |
| `npm run buildRelease` | Full release build: buildZEN + minify all |
| `npm run verifyRelease` | buildRelease + full test suite |

To extract `zen.js` back into `/src` (unbundle):

```bash
npm run unbuildZEN
```

---

## 8.4 Test suite

ZEN has three test suites, all run via Mocha.

### Run all tests

```bash
npm test
```

This runs `buildZEN` first, then all three suites.

### Individual suites

```bash
npm run testPEN:unit    # PEN VM tests (test/pen.js)
npm run testZEN:unit    # ZEN unit tests (test/zen/*.js)
npm run test:core       # Core graph tests (test/zen.js, test/rad/*, etc.)
```

### Test file map

| Suite | Files | What it tests |
|-------|-------|---------------|
| `testPEN:unit` | `test/pen.js` | PEN bytecode, pack/unpack, policy execution |
| `testZEN:unit` | `test/zen/instance.js`, `secp256k1.js`, `crypto.js`, `multicurve.js`, `certify.js` | ZEN instance API, crypto primitives |
| `test:core` | `test/abc.js`, `test/rad/rad.js`, `test/radix.js`, `test/zen.js` | Graph operations, Radisk, core behavior |

### Clean data before testing

**Always** remove stale test data before running tests:

```bash
node clean.js
npm test
```

Or manually:

```bash
rm -rf *data* *radata*
```

Test data from previous runs can cause false positives and hard-to-debug failures.

---

## 8.5 Running a development server

```bash
npm start
# Starts examples/zen-http.js on localhost with V8 profiling
```

For HTTPS (required for WebCrypto/SEA in browsers):

```bash
npm run https
```

---

## 8.6 Browser tests (Playwright)

End-to-end browser tests run via Playwright:

```bash
npm run test:browser:setup  # install Chromium
npm run test:browser        # run e2e/distributed.js and others
```

---

## 8.7 Adding a chain method

Chain methods are added to `Zen.chain` (= `Zen.prototype`). Each method should:

1. Return `zen` (the chain instance) to allow chaining
2. Use a single lowercase word as the method name (no camelCase)
3. Live in its own file under `/src` or `/lib`
4. Register itself via `Zen.chain.methodname = function(...){}`

**Template:**

```js
import __root from "./root.js";

var Zen = __root;

Zen.chain.mymethod = function(data, cb) {
  var zen = this, at = zen._, root = at.root;
  // implementation
  return zen;  // always return zen for chaining
};
```

After adding, rebuild:

```bash
npm run buildZEN
```

---

## 8.8 Adding a storage adapter

Follow the `lib/rfs.js` pattern:

```js
import ZEN from "../zen.js";

ZEN.on("create", function(root) {
  this.to.next(root);  // required — pass root through the chain

  if (!root.opt.mystore) { return; }  // only activate if opt is set

  var store = {};

  root.opt.store = {
    get: function(key, cb) {
      cb(null, store[key] || undefined);
    },
    put: function(key, data, cb) {
      store[key] = data;
      cb(null, 1);
    }
  };
});
```

The adapter is then used by Radisk for all persistence.

---

## 8.9 The USE module format

Source files in `/src` use a USE module wrapper. When you look at the source, you will see:

```js
/* UNBUILD */
USE(function(module) {
  // module code here
  module.exports = ...;
}, "./src/filename.js");
```

The `/* UNBUILD */` comment marks where `lib/builder/zen.js` should split the bundled output back into individual source files.

When writing new source files in `/src`, follow the same pattern. The bundler handles the rest.

---

## 8.10 Internal event bus

ZEN's core uses a synchronous event bus (`Zen.on`, from `src/onto.js`). This is different from the chain-level `on()` method.

```js
// Static listener (fires for all ZEN instances)
Zen.on("create", function(root) { ... });
Zen.on("opt", function(root) { ... });

// Instance listener
root.on("in", function(msg) { ... });   // incoming messages
root.on("out", function(msg) { ... });  // outgoing messages
root.on("put", function(msg) { ... });  // graph writes
```

When registering a listener, always call `this.to.next(root)` (or `this.to.next(msg)`) at the start to pass control to the next listener in the chain. Forgetting this silently breaks other plugins.

---

## 8.11 Message deduplication

Every message has a `#` (message ID). Use `dup.check` and `dup.track` to deduplicate:

```js
var dup = root.dup;

if (dup.check(msg["#"])) { return; }  // already seen
dup.track(msg["#"]);                  // mark as seen
```

---

## 8.12 PANIC tests

`test/panic/` contains stress and correctness tests for the core graph engine:

| File | Purpose |
|------|---------|
| `holy-grail.js` | Core correctness — run this first before any major change |
| `scale.js` | Multi-peer load testing |
| `on-recovery.js` | State recovery validation |

```bash
node test/panic/holy-grail.js
```

Run these after any change to `src/root.js`, `src/put.js`, `src/get.js`, or `src/mesh.js`.

---

## 8.13 Code conventions

- **Method names** — single lowercase words, only `a-z`. No camelCase for new public API.
- **Callbacks first** — callback before options for user-facing methods.
- **Return `zen`** — chain methods must return the chain instance.
- **No `undefined`** — use `u` (the local undefined alias) in source files.
- **No `this` in inner functions** — capture `zen` and `at = zen._` at the top.
- **`opt` vs `as`** — in `put()`, `opt` (param 3) = security only (`authenticator`, `pub`, `cert`); `as` (param 4) = runtime context (`soul`, `state`, `acks`, `turn`, `ok`). Never mix them.

---

## 8.14 After your change

```bash
npm run buildZEN          # rebuild from /src
node clean.js             # clean test data
npm test                  # run full test suite
node test/panic/holy-grail.js  # run correctness tests
```

All 396 tests must pass before submitting a pull request (80 PEN + 171 ZEN unit + 145 core).

---

## 8.15 put() internals

This section is for contributors modifying the write path or adding security middleware.

### Signature

```js
Zen.chain.put = function(data, cb, opt, as)
```

| Param | Type | Description |
|-------|------|-------------|
| `data` | any valid value, plain object, or `function(go)` | The value to write |
| `cb` | function or string | Ack callback `(ack)`, or a string used as the explicit soul |
| `opt` | plain object | **Wire security options only**: `authenticator`, `pub`, `cert` |
| `as` | plain object | **Runtime context**: `soul`, `state`, `acks`, `ok`, `turn` — internal reuse |

The split between `opt` (param 3) and `as` (param 4) is strict. Never put `soul`, `state`, `acks`, `turn`, or `ok` into `opt`.

### Write pipeline

```
put(data, cb, opt, as)
  │
  ├── options(opt)           → normalize opt once, create closure
  ├── context(zen, data, cb) → create as (if not provided)
  ├── stun(as, at.id)        → block reads on this chain
  │
  ├── [resolve soul]
  │   └── get(as, opt)  ←─── if soul unknown, resolve via chain
  │
  ├── walk()                 → expand data tree into graph nodes
  │   ├── valid(d)           → validate each leaf value
  │   ├── state_ify(...)     → attach HAM timestamps
  │   └── [nested object]    → resolve child soul (may recurse)
  │
  └── as.ran(as)             → fires ran(as, opt)
      └── ran(as, opt)
          ├── cat.ask(...)   → register ack listener
          ├── root.on("out", { put: as.graph, opt, # }) → emit to wire
          └── ran.end(stun)  → unblock stunned reads
```

### Stun mechanism

While a chain is being written, any reads that arrive are **stunned** (delayed) so they do not observe a partial write. `ran.end(stun, root)` unblocks them after the full put completes. This is how `once()` called immediately after `put()` always sees the new values.

### Security middleware integration

`src/security.js` intercepts writes on the `"in"` channel. It reads the wire opt from `msg._.msg.opt` to find `authenticator` and `pub`. This is how `put(data, cb, { authenticator: pair })` flows into the security check.

### How external callers pass context

```js
// Pass soul explicitly
zen.put(shell, cb, null, { soul: soul });

// Pass custom acks limit
node.put(pid, cb, null, { acks: max });

// Pass state (test override)
node.put(data, cb, { authenticator: pair }, { state: futureState });
```

Rule: `opt` (param 3) = security only. `as` (param 4) = everything else.
