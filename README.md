# ZEN — Zen Entropy Network

**ZEN** is an **offline-first decentralized graph database** created to **replace GUN in the akao repo**.

It was not born as a pointless side project. It exists because `akao` needs a new graph + crypto + execution foundation that inherits the best parts of GUN while fixing its core bottlenecks around runtime, storage, identity, and policy.

> **Carry the legacy. Fix the core. Evolve the system.**

## TL;DR for new developers

If you are new to this repo, here is the most important context:

1. **ZEN now evolves forward from the invention base in `akaoio/gun`**, not from Mark's original `amark/gun` alone.
2. **ZEN's practical goal is to replace GUN inside akao.**
3. **PEN is the core policy/execution system**, and ZEN does not intend to inherit older layers like `SEA.certify`, the user namespace model, or content-addressing as separate first-class feature layers.
4. **ZEN wants to preserve the graph feeling of GUN**, while redesigning the clock, crypto, storage, and execution model.
5. This README clearly distinguishes:
   - what belongs to **Mark's original GUN lineage**
   - what was **invented in `akaoio/gun`**
   - what is **the direction of ZEN**
   - what is **not intended to be inherited**

## README contract

To avoid overclaiming, this README should be read in three layers:

### 1. Current repo reality

The current `zen/` repo has already pivoted to the `attempt2` branch.

That means:

- the current codebase is **no longer** the scratch-built runtime from `attempt1`
- the current codebase started from a **tree imported from `akaoio/gun`**
- ZEN-level docs such as `README.md`, `docs/`, and `PLAN.md` are preserved to describe the direction
- `npm start` currently runs on top of the gun-based runtime
- `npm test` also currently runs on top of the gun-based test system

In other words, current reality is now:

> **ZEN docs + akaoio/gun invention base**

not yet a codebase where every ZEN design direction has already been fully re-applied to the new fork.

This also needs to be stated clearly:

- `attempt1` is considered an abandoned implementation direction
- `attempt2` is the more correct new base because it starts from lineage that already runs for real
- the repo now has a stronger server/runtime/test harness because it inherits from the more advanced `akaoio/gun` base rather than from `amark/gun`
- but this README still contains many sections describing **ZEN direction**, so it should not be read as if that entire direction has already been implemented in the current branch

This README still describes:

- the goal of the project
- the architectural principles
- what is carried forward from `akaoio/gun`
- what ZEN intends to build as core

### 2. Original GUN vs `akaoio/gun`

This repo needs to distinguish two different sources of lineage:

1. **`amark/gun/`** is Mark Nadal's original GUN.
2. **`akaoio/gun/`** is the much more advanced `gun` fork.

The original GUN established the graph sync lineage:

- graph-first sync
- offline-first thinking
- CRDT / HAM intuition
- P2P orientation
- SEA as the historical crypto/auth layer

But `akaoio/gun` is **not merely a renamed mirror** of that work. It is a separate invention layer that added major capabilities on top of the original system.

### 3. Advancements created in `akaoio/gun`

The following advancements were created in the `akaoio/gun` fork and are central to what ZEN now carries forward:

#### Crypto and identity

- **Universal base62 key material**
  - `sea/base62.js`
  - public keys move from old base64url-with-dot form to clean alphanumeric base62
  - private keys also move to base62
  - backward compatibility is preserved while enabling cleaner paths and identifiers
- **Seed-based deterministic key generation**
  - documented in `gun/docs/seed-based-keys.md`
  - implemented in `gun/sea/pair.js`
  - enables account recovery, deterministic testing, and reproducible identity generation
- **Additive key derivation**
  - documented in `gun/docs/additive-derivation.md`
  - implemented in `gun/sea/pair.js`
  - enables HD-wallet-style identity trees and pub-only derivation flows
- **WebAuthn / passkey integration**
  - documented in `gun/docs/webauthn.md`
  - includes support for hardware authenticators, biometrics, and passkey-style auth flows
- **External authenticators**
  - documented in `gun/docs/external-authenticators.md`
  - extended in `gun/sea/auth.js`
  - enables stateless signing flows and integration with custom backends such as HSM/KMS-style systems

#### Policy and execution

- **PEN — Predicate-Embedded Namespace**
  - documented in `gun/docs/pen.md`
  - implemented in `gun/lib/pen.js` with `gun/lib/pen.wasm`
  - tested in `gun/test/pen.js`
  - introduces a compact bytecode policy/execution VM rather than leaving policy as scattered wrapper logic
- **Base62 bytecode identity packing**
  - PEN bytecode compiles to compact base62 soul-friendly strings
  - this is one of the clearest examples of invention in `akaoio/gun` that ZEN should treat as foundation, not addon

#### Storage and runtime

- **OPFS storage adapter**
  - documented in `gun/docs/opfs.md`
  - implemented in `gun/lib/opfs.js`
  - modern browser persistence for RAD through Origin Private File System
- **`globalThis` migration across `lib/`**
  - documented in `gun/docs/globalthis-worker-compat.md`
  - removes `window` assumptions and makes more of the runtime work inside Web Workers, Service Workers, and broader JS environments

#### Graph and protocol extensions

- **Tilde shard index**
  - documented in `gun/docs/tilde-shard.md`
  - uses SEA-enforced rules for sharded public-key discovery
- **Hashgraph layer draft**
  - documented in `gun/docs/hashgraph-layer.md`
  - shows that `akaoio/gun` was already pushing beyond plain inherited GUN behavior into new protocol design space

#### Tooling, build, and test infrastructure

- **Dedicated advanced docs corpus**
  - `gun/docs/README.md` plus focused docs for each major invention
  - original `amark/gun/` does not carry an equivalent docs tree
- **New build pipeline**
  - `gun/lib/build.js`
  - package scripts such as `buildGUN`, `buildSEA`, and `buildPEN`
- **Browser automation coverage**
  - `gun/playwright.config.js`
  - browser tests such as `gun/test/browser/gun.spec.js`
- **Fork-specific examples**
  - `gun/examples/webauthn.html`
  - `gun/examples/webauthn.js`

Some of these inventions are documented in `gun/docs/`, but not all of them are obvious there. Important code-level additions also live in:

- `gun/sea/base62.js`
- `gun/lib/pen.js`
- `gun/lib/pen.wasm`
- `gun/lib/build.js`
- `gun/test/pen.js`
- `gun/test/browser/gun.spec.js`

### 4. ZEN direction

The following are **architectural directions for ZEN**:

- Zig -> WASM-first compute
- a unified API for data + crypto + execution
- the `zen.now` candle clock
- node metadata that keeps the GUN-like shape while state semantics follow ZEN's own clock
- PEN becoming the central policy/execution layer of the whole system

## Why ZEN exists

ZEN exists because GUN and SEA, while very strong in concept, have shown clear limits for the production goals of `akao`.

### Problems ZEN wants to address

#### 1. CommonJS-first design and side effects

- not friendly to modern ESM
- dependent on `window`
- easy to trigger import side effects

#### 2. Compute locked inside JavaScript

This is not ideal for:

- hashing
- cryptography
- execution logic
- a policy VM

#### 3. Storage is not yet the optimal baseline for the new local-first direction

- classic GUN is heavily tied to IndexedDB / RAD plugins
- that is not necessarily the best storage direction for a compute-heavy and WASM-oriented design

#### 4. The worker story is not yet central

The `akaoio/gun` fork has improved this area, but for ZEN this needs to be an architectural principle from the start.

#### 5. SEA is no longer the final policy layer

SEA provides many useful things, but under the current direction:

- `SEA.certify`
- the user namespace model
- the older auth/policy layers

are no longer the center of the system.

Inside `akaoio/gun`, PEN is already strong enough to carry more complex authorization and execution. Because of that, ZEN does not treat those older layers as first-class features that must be preserved.

## What ZEN carries forward from `akaoio/gun`

ZEN does not reject GUN. ZEN inherits the most important things from that lineage:

- graph-first thinking
- an offline-first sync mindset
- CRDT / HAM intuition
- P2P orientation
- the distinction between original GUN and the invention layer added in `akaoio/gun`
- OPFS reuse through `gun/lib/opfs.js`
- a worker-compatible direction
- PEN as a bytecode policy/runtime
- base62-friendly bytecode identity packing
- seed-based keys
- additive derivation
- external authenticators
- WebAuthn-capable identity flows
- tilde-shard-style identity indexing

In short: **ZEN does not remain "a Gun fork." ZEN evolves forward from the invention base established in `akaoio/gun`.**

ZEN still carries the deeper legacy of Mark's original GUN, but it does so through the more advanced akaoio/gun layer rather than by resetting back to `amark/gun`.

## What ZEN will not inherit

This section needs to be explicit to avoid misunderstanding.

ZEN does **not** want to continue carrying the following layers as first-class architecture:

- `SEA.certify`
- the user namespace model
- content-addressing as an independent feature layer
- SEA-style prefixed/enveloped crypto formats
- auth/session thinking built on a wrapper layer rather than a policy layer

The reason is that ZEN wants a more unified system:

- crypto in the core
- policy in PEN
- execution in the core
- graph metadata with its own logic

rather than piling historical feature layers on top of one another.

## Architectural direction

### 1. Compute: Zig -> WASM

**ZEN direction:** heavy compute should go through Zig and WASM.

Goals:

- faster cryptography and hashing
- better fit for bytecode / VM execution
- portability across browser / server / edge

### 2. Storage: OPFS

**Existing lineage:** `akaoio/gun` already has `lib/opfs.js`.

ZEN does not need to reinvent OPFS. The right direction is:

- reuse `gun/lib/opfs.js`
- leverage the existing detect / fallback logic
- only change it if ZEN truly needs a new storage contract

Benefits:

- lower maintenance cost
- continuity with the lineage
- more focus on the areas where ZEN is genuinely different

### 3. Network

ZEN still belongs to the world of:

- WebSocket
- WebRTC mesh
- decentralized sync

This is inherited GUN spirit, not something to throw away.

### 4. CRDT + HAM

ZEN still favors deterministic conflict resolution.

What matters is:

- ZEN keeps the GUN-style graph conflict intuition
- but the clock semantics will be redesigned to fit PEN and the candle model

## Metadata and the candle clock

This is one of the most important differentiators.

### Abstract key naming

ZEN learns an important lesson from GUN about graph naming:

> a key does not need to be an easy English word; it can be an abstract symbol carrying dense semantics like `>`, `#`, `.`, `:`, `~`, ...

ZEN favors this style of key naming and tries to keep it **as close to GUN as possible**.

Why:

- it is part of the graph language that GUN already formed
- short and abstract keys keep metadata / wire shape / graph contracts tighter
- continuity with GUN lineage matters more than renaming everything into “readable” English words that distort the original semantics

### Metadata shape

**ZEN direction:** node metadata **must match GUN node metadata**.

That means ZEN does **not** create a different metadata model. The graph intuition and node metadata contract should still follow the way GUN represents a node.

The difference lies in **how the `state` value is produced**, not in the metadata shape itself.

`state` in metadata will **not use `Gun.state`**.

### `zen.now`

Instead, `zen.now` depends on the `candle` parameter when the instance is initialized:

```js
const zen = new Zen({ candle })
zen.now = Math.floor(Date.now() / candle)
```

If `candle` is not passed, the default is:

```js
const zen = new Zen()
// candle = 1
```

If you want `zen.now` to return to normal time pacing:

```js
const zen = new Zen({ candle: 1 })
```

### Meaning of the candle model

This is the **candle clock** way of thinking inside PEN:

- state is no longer the old millisecond clock
- policy, execution, and sync can share the same candle rhythm
- each instance can choose its own clock granularity
- ZEN can build its own clock system instead of being locked to `Gun.state()`

## PEN is core

PEN is not an addon. PEN is the central **policy + execution + bytecode identity** layer.

### Existing lineage

Inside `akaoio/gun`, PEN already has a real foundation:

- a runtime via `pen.wasm`
- base62 packing / unpacking
- bytecode attached to soul identity

### ZEN direction

ZEN wants to elevate PEN into the actual core:

- not a side feature
- not an add-on extension
- not something that only serves authorization

The end goal is:

> every piece of data in ZEN can carry executable logic

## Soul model

Unlike classic GUN + SEA thinking:

> in the ZEN direction, every soul can carry ZEN / PEN nature

This unifies:

- data
- logic
- execution

That said, this should be understood as **ZEN direction**, not a claim that the current repo has already completed that model.

## Crypto foundation

ZEN favors:

> **secp256k1** as the crypto baseline

instead of SEA's P256.

### Why

- better fit for the blockchain / wallet ecosystem
- deterministic key generation (`seed -> key`)
- better fit for decentralized identity
- a stronger tooling ecosystem

### Encoding stance

ZEN favors **base62**.

This is also not an entirely new idea, because in `akaoio/gun`:

- PEN bytecode already uses base62 packing
- the lineage already leans toward base62-friendly identifiers

So this README should treat that as **continuity**, not just a new ZEN preference.

## Clean JSON crypto

One important ZEN rule:

- `sign`
- `verify`
- `encrypt`
- `decrypt`

should work with **plain JSON**, without forcing developers to use SEA-style prefixes or envelope formats marked by SEA's historical conventions.

Goals:

- cleaner payloads
- easier reasoning
- easier passage across network / storage / worker / WASM boundaries

## Unified API direction

ZEN's API direction is to unify data, crypto, and execution inside one interface.

Concept example:

```js
const zen = new Zen({ candle: 60000 })

zen.get(key).put(data)
zen.get(key).set(otherSoul)
zen.get(key).once()

zen.work(data)

const pair = zen.pair()
const sig = zen.sign(data, pair)
zen.verify(data, sig, pair.pub)

zen.pen({
  put(ctx){
    return { value: ctx.value }
  }
})
```

This section should be read as **API direction**, not as a full description of the current `attempt2` implementation.

`attempt1` once had a small executable for several of these surfaces, but the current code direction has already pivoted to a fork-first base from `akaoio/gun`.

## ZEN's practical role inside akao

ZEN is not a vague experiment.

It was created to:

- replace GUN in the `akao` repo
- become the new graph/crypto/execution foundation for that ecosystem
- make PEN the real policy core

In other words: **akao is why ZEN exists**.

## Lineage and divergence

ZEN is a successor direction emerging from:

> Mark's original GUN (`amark/gun`) -> `akaoio/gun` -> ZEN

What that means:

1. **`amark/gun`** is the historical origin.
2. **`akaoio/gun`** is the major invention layer that introduced base62 keys, seed-based keys, additive derivation, WebAuthn, external authenticators, OPFS, `globalThis` worker compatibility, PEN, tilde shard indexing, and stronger build/test/docs infrastructure.
3. **ZEN** now moves beyond remaining a fork by carrying those inventions forward into a new architecture centered on ZEN's own clock, storage strategy, execution model, and identity direction.

So `akaoio/gun` should be understood as **far more than an intermediate mirror**. It is the invention-rich foundation that ZEN now evolves beyond.

## Testing mindset

One of the most important lessons ZEN takes from GUN is:

> **tests are the spec**

ZEN favors **test-driven programming**:

1. write the test first
2. let the test fail first, proving that it is actually checking the intended behavior
3. write the code after that
4. turn red into green

This matters because:

- tests are not only for preventing regressions
- tests are how the real behavior of the system gets described
- letting a test fail first proves that the test has value
- implementation must follow the spec, not the other way around

For ZEN, the right mindset is:

- tests go first
- fail first
- code later
- red turns green

If an important behavior is not described by a test, then that behavior is not yet solid enough to become part of the system's foundation.

At the current stage, ZEN already has:

- a test system and server runtime inherited from the gun base
- `npm start` running on top of that base

but it still does **not** yet have the same testing depth as GUN:

- because the current branch is still, fundamentally, a gun tree rebased as the starting point for the next round of ZEN-specific edits

At the current stage, ZEN already has:

- spec-level tests for the core runtime
- a server smoke test for `npm start`

but it still does **not** yet have the same testing depth as GUN:

- real multi-peer distributed tests
- a real browser automation suite
- large-scale recovery / reload / failure harnesses

## Design philosophy

- Do not destroy -> inherit
- Do not patch around problems -> re-architect
- Test first -> code second
- Fail first -> then turn green
- Do not separate data and crypto -> unify them
- Do not keep policy in a wrapper layer -> move it into the core through PEN
- Do not lock clock semantics into the old model -> build a clock system for ZEN

## Where the README should be improved next

After this version, the README should continue improving in the following directions:

1. add a **Current implementation status** section once the repo starts carrying more real ZEN-specific code
2. add a lineage diagram `GUN -> akaoio/gun -> ZEN`
3. add an “Inherited / Rejected / Planned” table
4. add concrete examples once ZEN has a runnable API
5. keep every claim clearly labeled as:
   - current reality
   - inherited lineage
   - design direction

## Conclusion

ZEN is a **next-generation decentralized graph database** created to carry the GUN lineage into an architecture better suited for:

- akao
- secp256k1 identity
- PEN-centric policy
- OPFS / worker / WASM direction
- unified graph + crypto + execution

It does not reject GUN. It carries forward the original graph lineage, preserves the invention layer created in `akaoio/gun`, and then builds past both into ZEN's own system.
