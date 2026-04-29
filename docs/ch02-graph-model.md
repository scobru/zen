# Chapter 2 — Graph Model

> **Goal:** Understand how ZEN stores data as a graph, how conflict resolution works, and master the core read/write/subscribe API.

---

## 2.1 Everything is a graph

ZEN stores data as a **directed graph**. There are no tables, rows, schemas, or foreign keys. There is only one concept: a **node**.

Every node has:

| Field | Meaning |
|-------|---------|
| `_["#"]` | **Soul** — the unique string identifier for this node |
| `_[">"]` | **State map** — a per-key timestamp used by HAM (the CRDT) |
| `key: value` | **User data** — any primitive or a reference to another node |

Example of a graph node as stored internally:

```json
{
  "_": {
    "#": "profile",
    ">":  { "name": 1700000000000, "age": 1700000000001 }
  },
  "name": "Alice",
  "age": 30
}
```

The `_` property on the chain object (`zen._`) gives you access to this internal structure, but you rarely need it directly.

---

## 2.2 Souls

A **soul** is a string. It uniquely identifies a node across the entire graph, across all peers, for all time.

When you call `zen.get("profile")`, you navigate to the node whose soul is `"profile"`. If that node does not exist yet, it will be created when you first `put()` a value into it.

Nested paths create their own souls automatically:

```js
zen.get("app").get("settings").get("theme").put("dark");
//                             ^ this node gets a generated soul like "appXYZsettingsABC"
```

You can also set the soul explicitly:

```js
zen.get("profile").put({ name: "Alice" }, "profile");
//                                         ^ explicit soul
```

User-space nodes use a tilde prefix for authenticated ownership:

```
~/                     ← root of all user namespaces
~<pub>/               ← root of user with public key <pub>
~<pub>/profile        ← "profile" node owned by <pub>
```

See [Chapter 3](ch03-crypto.md) for how authentication interacts with souls.

---

## 2.3 HAM — Hypothetical Amnesia Machine

ZEN resolves write conflicts using **HAM**, a state-based CRDT.

Every value has a **state** — a millisecond timestamp assigned at write time. When two peers disagree on the value of a key, HAM applies the following rule:

```
if stateA > stateB → use valueA   (later state wins)
if stateA < stateB → use valueB
if stateA === stateB → keep existing value (ignore the incoming write)
```

HAM also rejects writes whose state is too far in the future:

```js
// Maximum allowed future delta: 1 week (in milliseconds)
Ham.max = 1000 * 60 * 60 * 24 * 7;
```

This prevents malicious or misconfigured peers from poisoning the graph with far-future timestamps that would permanently block all future writes to the same key.

**You never set state yourself.** ZEN calls `Zen.state()` automatically on every `put()`.

```js
const now = ZEN.state();  // millisecond timestamp (number)
```

---

## 2.4 Valid values

Only these types can be stored as leaf values:

| Type | Example |
|------|---------|
| `null` | `null` |
| `boolean` | `true`, `false` |
| `number` | `42`, `3.14` |
| `string` | `"hello"` |
| Zen reference (link) | `{ "#": "soul" }` |

Anything else — functions, `undefined`, `Symbol`, class instances — is invalid and will be rejected.

```js
ZEN.valid(42);         // true
ZEN.valid("hello");    // true
ZEN.valid(undefined);  // undefined (falsy)
ZEN.valid({});         // undefined (objects must go through put())
```

---

## 2.5 `get(key)` — navigate the graph

`get(key)` returns a **chain** pointing to the child node with that key under the current node.

```js
const root    = zen;                    // root of the graph
const profile = zen.get("profile");    // navigate to "profile" node
const name    = profile.get("name");   // navigate to "name" inside "profile"
```

Chains are lazy — navigating does not create nodes or send messages. Only `put()`, `once()`, and `on()` trigger network/storage activity.

Chains are **cached**: calling `zen.get("profile")` twice returns the same chain object.

### Lexical range queries

Pass a plain object to `get()` for range queries:

```js
// All keys starting with "a"
zen.get("words").get({ ".": { "*": "a" } }).map().on(cb);

// Keys from "a" to "b"
zen.get("words").get({ ".": { ">": "a", "<": "b" } }).map().on(cb);
```

---

## 2.6 `put(data, cb, opt)` — write a value

```js
zen.get("key").put(value);
zen.get("key").put(value, function(ack) {
  if (ack.err) { console.error(ack.err); return; }
  console.log("saved");
});
```

**Parameter summary:**

| Param | Type | Description |
|-------|------|-------------|
| `data` | any valid value or plain object | The value to write |
| `cb` | function or string | Ack callback `{ ok, err }`, or an explicit soul string |
| `opt` | object | Wire security options: `{ authenticator, pub, cert }` |

`put()` returns the same chain, so you can chain further calls:

```js
zen.get("profile")
   .put({ name: "Alice" })
   .get("name")
   .once(console.log);
```

**Writing nested objects** expands into multiple graph nodes:

```js
zen.get("user").put({ name: "Alice", address: { city: "London" } });
// Creates nodes: "user", "user/address" (auto-soul), sets links between them
```

**Writing a function** defers the put until the function calls its argument:

```js
zen.get("lazy").put(function(go) {
  fetchFromAPI().then(go);  // put fires when go() is called
});
```

---

## 2.7 `on(cb)` — subscribe to changes

```js
zen.get("counter").on(function(data, key) {
  console.log(key, "=", data);
});
```

The callback fires:
1. Immediately with the current value (if any exists)
2. Every time the value changes

`on()` returns the chain, so you can store the reference and call `.off()` later.

```js
const ref = zen.get("counter");
ref.on(myCallback);
// ... later ...
ref.off();
```

---

## 2.8 `once(cb)` — read once

```js
zen.get("profile").once(function(data) {
  console.log(data);
});
```

Fires exactly once, after a 99ms debounce (waits for all pending writes to settle). After firing, automatically unsubscribes.

---

## 2.9 `set(item, cb)` — add to a collection

`set()` adds an item to an unordered collection (set). Each item gets its own generated soul.

```js
const msgs = zen.get("messages");

msgs.set({ text: "hello", from: "alice" });
msgs.set({ text: "hi", from: "bob" });
```

**Item types handled by `set()`:**

| Input | Behavior |
|-------|---------|
| Plain object `{}` | Generates a soul, writes item, links it |
| Node with `_["#"]` soul | Links existing node into collection |
| String link | Uses the string as the soul directly |
| Zen reference | Resolves the soul of the reference, then links it |

---

## 2.10 `map()` — iterate a collection

`map()` returns a chain that receives events for each item in the collection, including future arrivals.

```js
zen.get("messages").map().on(function(data, soul) {
  console.log(soul, data);
});
```

Combine with `once()` to read all current items without subscribing:

```js
zen.get("messages").map().once(function(data, soul) {
  console.log(soul, data);
});
```

You can pass a transform function (experimental):

```js
zen.get("messages").map(function(data, key) {
  return data && data.active ? data : undefined;  // filter nulls
}).on(cb);
```

---

## 2.11 `back(n)` — traverse up the chain

`back()` navigates up the chain hierarchy.

```js
zen.get("a").get("b").back();       // returns "a" chain
zen.get("a").get("b").back(2);      // returns root
zen.get("a").get("b").back(-1);     // returns root (shortcut)
zen.get("a").get("b").back(Infinity); // returns root
```

Useful inside callbacks where you need the parent:

```js
zen.get("profile").get("name").on(function(data) {
  this.back().get("age").once(console.log);  // read sibling "age"
});
```

---

## 2.12 Instance isolation

Two separate `ZEN` instances are completely isolated — they do not share memory:

```js
const a = new ZEN({ localStorage: false, peers: [] });
const b = new ZEN({ localStorage: false, peers: [] });

a.get("x").put(1);
b.get("x").once(console.log);  // undefined — different instance
```

Instances synchronize only through listed peers or shared storage.
