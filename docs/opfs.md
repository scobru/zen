# OPFS Storage Adapter

## Overview

`lib/opfs.js` adds an **Origin Private File System (OPFS)** storage adapter for RAD in browser environments that support `navigator.storage.getDirectory()`.

It is designed to fit the existing GUN storage contract:

- `store.put(file, data, cb)`
- `store.get(file, cb)`
- `store.list(cb)`

That means it can back `lib/radisk.js` without changing the rest of the architecture.

---

## What it does

When loaded in a supported browser runtime, `lib/opfs.js`:

1. Registers itself on `globalThis` as `ROPFS`
2. Creates one OPFS directory per `opt.file`
3. Stores RAD chunk/index files inside that directory
4. Auto-hooks `ZEN.on('create', ...)` and claims `root.opt.store` only if no store is already set

Like the other `lib/` storage adapters, it is a **side-effect plugin**, not an ES module export.

---

## Basic Usage

### Auto-activation

If OPFS is available and `root.opt.store` is not already set:

```html
<script src="/zen.js"></script>
<script src="/lib/opfs.js"></script>
<script>
  const zen = ZEN({ file: "my-opfs-db" });
</script>
```

### Explicit selection

If you want to make the active store deterministic, select it manually:

```javascript
var opt = { file: "my-opfs-db" };
opt.store = ROPFS(opt);
const zen = ZEN(opt);
```

This is the safest way to avoid ambiguity when multiple browser storage plugins are loaded.

---

## File naming

Yes — developers can choose the persistent storage name with `opt.file`:

```javascript
const zen = ZEN({ file: "orders-db" });
```

For OPFS, this name becomes the **directory name** inside the origin-private filesystem.

RAD then stores its internal files inside that directory. So `opt.file` is the storage namespace/container, not a single flat file path.

---

## Using with ES modules

`lib/opfs.js` works fine in ES module applications as a **side-effect import**:

```javascript
import "/zen.js";
import "/lib/opfs.js";

const zen = ZEN({ file: "my-opfs-db" });
```

It does **not** currently export `ROPFS` with ESM syntax, so this is **not** supported:

```javascript
import ROPFS from "/lib/opfs.js"; // not supported
```

Use the global instead:

```javascript
const opt = { file: "my-opfs-db" };
opt.store = ROPFS(opt);
const zen = ZEN(opt);
```

---

## Workers

`lib/opfs.js` is written against the **async OPFS API**, so it can run in browser worker environments where `navigator.storage.getDirectory()` is available.

### Supported target

- **Browser main thread:** yes
- **Dedicated Web Workers:** yes, where OPFS is exposed

### Not supported

- **Node.js `worker_threads`:** no

Node workers do not provide `navigator.storage.getDirectory()`, so `opfs.js` will not activate there.

### Important note

This implementation does **not** use `createSyncAccessHandle()`.

That means:

- it stays compatible with more browser runtimes
- it uses promise-based file APIs
- it is simpler to integrate with current GUN patterns

If you need a future high-performance worker-only variant, that would be a separate optimization path.

---

## Interaction with IndexedDB

If both `lib/opfs.js` and `lib/rindexed.js` are loaded, GUN still uses **only one active store per ZEN instance**.

Rules:

1. If `opt.store` is already set manually, both plugins back off
2. If OPFS claims `root.opt.store` first, IndexedDB does nothing
3. If IndexedDB claims `root.opt.store` first, OPFS does nothing
4. If OPFS is unavailable, IndexedDB can still take over

So there is **no automatic dual-write or mirroring** between OPFS and IndexedDB.

If you want deterministic selection, set `opt.store` explicitly.

---

## Disabling OPFS auto-activation

To prevent the plugin from auto-claiming `root.opt.store`:

```javascript
const zen = ZEN({
  opfs: false,
});
```

This only disables the auto-hook. You can still choose another store manually.

---

## Browser support behavior

If OPFS is not available, `lib/opfs.js` logs a warning and does not provide a store instance.

That allows another storage plugin, such as `rindexed.js`, to become the active RAD store.

---

## Testing

This repo includes a Playwright browser suite that verifies browser persistence behavior:

```bash
npm run test:browser:setup
npm run test:browser
```

The browser suite currently covers:

- browser runtime boot with RAD storage plugins
- IndexedDB persistence across reload
- OPFS persistence across reload

This is the recommended place to extend storage tests for browser-only adapters.
