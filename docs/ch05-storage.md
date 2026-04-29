# Chapter 5 — Storage Adapters

> **Goal:** Understand how ZEN persists data, which adapter is right for your environment, and how to write your own.

---

## 5.1 Overview

ZEN stores data through **storage adapters** — pluggable backends that implement two methods: `get(key, cb)` and `put(key, data, cb)`. The adapter layer sits between the in-memory graph and the disk/cloud.

| Environment | Adapter | Module |
|------------|---------|--------|
| Node.js (default) | Radisk (file-based) | `lib/rfs.js` + `lib/radisk.js` |
| Browser (default) | localStorage | built-in to `zen.js` |
| Browser (modern) | IndexedDB | `lib/rindexed.js` |
| Browser (modern) | OPFS | `lib/opfs.js` |
| AWS | S3 | `lib/rs3.js` |
| Custom | any | implement `get` + `put` |

---

## 5.2 Radisk — the default storage engine

**Radisk** is ZEN's primary persistence layer. It uses a radix tree to batch writes and shard data across multiple `.radata` files.

Key properties:
- Writes are batched by default (250ms window, 10k operations max)
- Keys are stored as `encodeURIComponent(key)` on disk
- Multiple `.radata` files; auto-shards when files grow large
- Uses async JSON parsing to avoid blocking the event loop

Radisk is enabled automatically when you set the `file` option:

```js
const zen = new ZEN({ file: "data" });
// Creates ./data.radata, ./data1.radata, etc.
```

When running on Node.js **without** a `file` option, ZEN uses the **XDG Base Directory** default — see §5.12.

To disable Radisk (in-memory only):

```js
const zen = new ZEN({ radisk: false });
```

---

## 5.3 Node.js filesystem adapter (rfs)

`lib/rfs.js` wraps the Node.js `fs` module. It is loaded automatically in the Node.js entry point (`index.js → lib/server.js`).

- Writes use a temp-file + rename pattern to prevent partial writes on crash
- Each shard file is a single string stored at `<dir>/<filename>`
- Concurrent writes to the same file are coalesced by tracking in-flight puts

The `file` constructor option **overrides** the default storage directory:

```js
const zen = new ZEN({ file: "myapp-data" });
// stores data in ./myapp-data/
```

Without `file`, the default on Node.js is the XDG data directory (see §5.12).

---

## 5.4 Browser localStorage adapter

When running in a browser without explicit configuration, ZEN uses `localStorage` as a fallback store. This works for small datasets but has a typical 5–10 MB browser quota.

Disable it when you want another adapter or a pure in-memory instance:

```js
const zen = new ZEN({ localStorage: false });
```

---

## 5.5 IndexedDB adapter (rindexed)

`lib/rindexed.js` provides browser persistence via IndexedDB, which has much higher quota than localStorage.

It is used automatically when available in environments that support it (modern browsers on HTTPS). Falls back to in-memory if IndexedDB is not available (e.g. `file://` protocol) with a warning.

The database name defaults to `"radata"` and is controlled by the `file` option:

```js
const zen = new ZEN({ file: "myapp" });
// Opens IndexedDB database named "myapp"
```

---

## 5.6 OPFS adapter (Origin Private File System)

`lib/opfs.js` uses the OPFS API available in modern browsers (Chrome 86+, Safari 15.2+). OPFS provides a sandboxed filesystem with better performance than IndexedDB for large files.

```js
import ZEN from "@akaoio/zen";
import OPFS from "@akaoio/zen/lib/opfs.js";

const zen = new ZEN({ store: OPFS });
```

See [docs/opfs.md](opfs.md) for full configuration options.

---

## 5.7 S3 adapter (rs3)

`lib/rs3.js` stores ZEN shards in AWS S3 (or any S3-compatible service).

```js
import ZEN from "@akaoio/zen";
import rs3 from "@akaoio/zen/lib/rs3.js";

// Configure via environment variables:
// AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, ZEN_S3_BUCKET

const zen = new ZEN({ store: rs3 });
```

---

## 5.8 Writing your own storage adapter

All adapters follow the same pattern. Register a `Zen.on("create", ...)` listener that installs your `get`/`put` methods when a new ZEN instance is created.

```js
ZEN.on("create", function(root) {
  this.to.next(root);  // always call this first

  if (!root.opt.store) { return; }  // only activate if configured

  var myStore = {};

  // Called by Radisk to write a shard
  root.opt.store = {
    put: function(key, data, cb) {
      myStore[key] = data;
      cb(null, 1);
    },
    get: function(key, cb) {
      cb(null, myStore[key] || undefined);
    }
  };
});
```

**`get(key, cb)`:**
- `key` — string shard key
- `cb(err, data)` — call with `(null, undefined)` if not found, `(null, string)` if found, `(err)` on error

**`put(key, data, cb)`:**
- `key` — string shard key
- `data` — string to store
- `cb(err, ok)` — call with `(null, 1)` on success, `(err)` on failure

---

## 5.9 Disabling all storage (pure in-memory)

For testing or ephemeral use, disable all persistence:

```js
const zen = new ZEN({
  radisk:       false,
  localStorage: false,
  peers:        [],
});
```

The graph exists only in memory and is lost on page reload or process exit.

---

## 5.10 Cleaning data between test runs

Test data from previous runs can cause false positives. Always clean before running tests:

```bash
npm run clean
npm test
```

Tests that use Node.js storage (`lib/rfs.js`) automatically isolate to a local `radata/` directory when `GUN_TEST_TMP=1` is set. The `npm test` and `npm run test:core` scripts set this automatically.

---

## 5.11 Data directory layout

After running `new ZEN({ file: "data" })` on Node.js, the directory looks like:

```
data/               ← root Radisk directory
  !                 ← shard for keys starting with "!"
  %1C               ← shard for encoded path separator
  ...               ← one file per key prefix
```

Files are named by `encodeURIComponent` of the first character(s) of the stored key.

---

## 5.12 Production storage paths (XDG Base Directory)

ZEN follows the [XDG Base Directory Specification](https://specifications.freedesktop.org/basedir-spec/latest/) for production storage on Node.js. When you start ZEN **without** a `file` option, storage is placed under your home directory:

| Purpose | Environment variable | Default path |
|---------|---------------------|-------------|
| Graph data (radata) | `XDG_DATA_HOME` | `~/.local/share/zen/radata/` |
| Config + CLI metadata | `XDG_CONFIG_HOME` | `~/.config/zen/` |
| Runtime state + stats | `XDG_STATE_HOME` | `~/.local/state/zen/` |

These paths are computed by `lib/xdg.js`. Set the environment variables to override them.

**Test isolation:** When `GUN_TEST_TMP=1` is set, `lib/rfs.js` uses a local relative `radata/` path instead of the XDG default. This keeps test runs isolated from production data.

```bash
# Run tests without touching production data:
GUN_TEST_TMP=1 npm run test:core

# Or use npm run clean + npm test (does both automatically)
```
