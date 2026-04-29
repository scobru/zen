# Chapter 6 — Networking

> **Goal:** Understand how ZEN peers synchronize, how to configure connections, and how the message protocol works.

---

## 6.1 Symmetric peers

There is no server-client distinction in ZEN. Every node is a **peer** — it can relay messages to other peers, persist data, and serve reads.

A "relay" is just a peer that happens to be publicly reachable and always online. You can run your own.

---

## 6.2 Connecting to peers

Pass peer URLs in the constructor:

```js
const zen = new ZEN({
  peers: ["wss://relay.example.com/zen"]
});
```

Or add peers at runtime:

```js
zen.opt("wss://relay.example.com/zen");

// Multiple peers
zen.opt(["wss://relay1.example.com/zen", "wss://relay2.example.com/zen"]);

// Object form
zen.opt({ peers: { "https://relay.example.com/zen": { url: "..." } } });
```

---

## 6.3 WebSocket transport

ZEN uses **WebSocket** as its primary transport. The implementation is internal — there is no `ws` npm dependency. The protocol is the same in Node.js and browser.

- Peer URL can be `ws://`, `wss://`, `http://`, or `https://` — ZEN normalizes them
- Each peer connection is managed independently; disconnects are retried automatically
- Messages are JSON strings (or batches of JSON strings)

---

## 6.4 The mesh layer (`src/mesh.js`)

`Mesh` handles message routing between peers. Key behaviors:

**Message size limit:**

```js
// Default: 30% of available memory, or ~90 MB
opt.max = opt.memory * 999 * 999 * 0.3 || 300000000 * 0.3;
```

Messages larger than `opt.max` bytes are rejected immediately with `{ dam: "!", err: "Message too big!" }`.

**Send batching:**

```js
opt.gap   = 0;   // delay before flushing outgoing messages (ms)
opt.pack  = opt.max * 0.0001;  // target pack size
opt.puff  = 9;   // messages processed per turn in batch loop
```

**Deduplication:** Every message has a `#` (message ID). The mesh tracks seen IDs via `dup` to prevent processing the same message twice, even when it arrives from multiple peers.

**`mesh.hear(raw, peer)`:** Called when a raw string arrives from a peer. Parses and routes it.

**`mesh.say(msg, peer)`:** Sends a message to a specific peer (or broadcasts if `peer` is omitted).

---

## 6.5 Message protocol

Every ZEN message is a JSON object with these fields:

| Field | Type | Description |
|-------|------|-------------|
| `#` | string | Message ID (9 random chars). Generated if absent. |
| `@` | string | Reply-to message ID. Present in ack messages. |
| `put` | object | Graph delta being written. Keys are souls, values are node objects. |
| `get` | object | Query. `{ "#": soul }` or `{ ".": lexical range }` |
| `opt` | object | Wire security options (`authenticator`, `pub`, `cert`) |
| `_` | function | Internal metadata carrier (not serialized). |
| `$` | Zen ref | Chain reference (not serialized). |

**Example put message:**

```json
{
  "#": "abc123xyz",
  "put": {
    "profile": {
      "_": { "#": "profile", ">": { "name": 1700000000000 } },
      "name": "Alice"
    }
  }
}
```

**Example get message:**

```json
{
  "#": "def456uvw",
  "get": { "#": "profile" }
}
```

---

## 6.6 Routing: `in` and `out`

Messages flow through two internal event channels:

- **`in`** — incoming from the wire. Security middleware, HAM, and storage run here.
- **`out`** — outgoing to the wire. After processing, messages are broadcast to peers.

The `universe()` router (in `src/root.js`) sits on both channels:

1. Incoming message arrives on `in`
2. `universe()` deduplicates, routes to `put()` or `get()` handler
3. Handler sets `msg.out = universe` and fires `at.on("out", msg)`
4. `universe()` on `out` calls `this.to.next(msg)` → propagates to mesh → sends to peers

---

## 6.7 Running a relay server

The simplest relay is just a ZEN instance with a WebSocket server. ZEN uses ES modules — use `import` syntax:

```js
import http from "http";
import ZEN from "@akaoio/zen";

const server = http.createServer().listen(8420);

const zen = new ZEN({
  web:  server,
  file: "relay-data",
});

console.log("Relay running on ws://localhost:8420/zen");
```

Clients connect with:

```js
const zen = new ZEN({ peers: ["ws://localhost:8420/zen"] });
```

For a production relay with SSL, logging, and auto-restart, use the included `relay.js` at the project root:

```bash
node relay.js
# or via systemd / PM2
npm start        # node --prof relay.js (V8 profiling enabled)
```

See `script/install.sh` for full production deployment (XDG paths, systemd service, SSL setup).

---

## 6.8 NTS — No Time Sync mode

ZEN supports a no-timestamp mode for environments without a reliable clock:

```js
const zen = new ZEN({ NTS: true });
```

When `msg.nts` or `msg.NTS` is set on a message, `universe()` skips the `out` broadcast. This prevents NTS messages from spreading to peers that do not understand the mode. The NTS logic is a temporary compatibility measure; a future version will remove this special case.

---

## 6.9 AXE — automatic peer clustering

`lib/axe.js` implements distributed hash table (DHT) clustering for automatic peer discovery and load balancing. It is an optional add-on loaded by the server entry point.

```js
const zen = new ZEN({ axe: true });
```

AXE handles:
- Peer discovery via DHT
- Automatic routing to the peers that hold specific data
- Load balancing across peer clusters

See `lib/axe.js` for configuration options.

---

## 6.10 WebRTC

`lib/webrtc.js` adds browser-to-browser WebRTC connections:

```js
import ZEN from "@akaoio/zen";
import "@akaoio/zen/lib/webrtc.js";

const zen = new ZEN({ rtc: { max: 5 } });
// max = maximum number of simultaneous WebRTC peers
```

WebRTC peers use `put(pid, cb, null, { acks: rtc.max })` internally to track connection state.

---

## 6.11 Multicast (LAN discovery)

`lib/multicast.js` provides UDP multicast for automatic peer discovery on a local network:

```js
import "@akaoio/zen/lib/multicast.js";
const zen = new ZEN({ multicast: true });
```

Useful for local-network deployments (IoT, offline-first apps).

---

## 6.12 Faith mode

The server entry point sets `root.opt.faith = true` automatically. In faith mode, ack messages (`msg["@"]` present, `msg.put` absent) are immediately rebroadcast to peers without re-processing. This reduces redundant computation on relay nodes.

```js
// server.js sets:
root.opt.faith = true;
root.opt.super = true;  // also set; marks this as a "super peer"
```

---

## 6.13 Self-discovery (`lib/discover.js`)

A relay peer needs to know its own domain or IP to announce itself to the network and to build correct self-URLs (`wss://peer1.akao.io:8420/zen`). `lib/discover.js` finds this offline-first:

| Priority | Method | Notes |
|----------|--------|-------|
| 1 | `~/.config/zen/domain` config file | Written by `install.sh` prompt or `ldom()` latch |
| 2 | `ip route get 8.8.8.8` | LAN/WAN interface IP, most reliable offline method |
| 3 | `hostname -I` | Fallback; first non-loopback IP |
| 4 | STUN (`stun.l.google.com:19302`) | Public IP behind NAT — RFC 5389 Binding Request |
| 5 | `api.ipify.org` / `ifconfig.me` | HTTP fallback only if all else fails |

```js
import { disc, DOMF } from "./lib/discover.js";

const { domain, ip, port, source } = await disc({ port: 8420 });
// source: "config" | "stun" | "http" | "ip" | "opt"
```

The domain is persisted to `DOMF` (`~/.config/zen/domain`) on first discovery so subsequent starts skip network calls. If the domain is still unknown at server start, `script/server.js` latches it from the first incoming HTTP request's `Host` header.

---

## 6.14 Smart domain scanning (`lib/scan.js`)

Given a known peer domain like `peer1.akao.io`, ZEN automatically scans for sibling peers by detecting the numeric index in the leftmost label and probing all candidates:

```
peer1.akao.io  →  peer{0..100}.akao.io
node-3.net     →  node-{0..100}.net
relay01.host   →  relay{00..100}.host   (zero-padded)
```

The scanner (`lib/scan.js`) exports:

| Function | Description |
|----------|-------------|
| `mkpat(domain)` | Parse domain → `{ prefix, index, tail, suffix, padLen }` |
| `bdom(pat, n)` | Build domain for index `n` from a parsed pattern |
| `scan(domain, opt)` | Probe all candidates; returns `Promise<string[]>` of `wss://` URLs |
| `scanbg(domain, opt)` | Fire-and-forget variant; calls `opt.onFound(url)` per discovery |

**Bandwidth controls:**

- Stops probing once `opt.mfnd` peers found (default **10**) — avoids exhausting the full 0–100 range when the network is small
- Concurrent HTTP/HTTPS probes (default **10**), 3 s timeout each; tries HTTPS first, falls back to HTTP
- `script/server.js` tracks `spat` (scanned patterns) per cycle to skip re-probing the same pattern within one cycle

**Backoff schedule:**

```
Cycle 1: no new peers → next scan in 20 min
Cycle 2: no new peers → next scan in 40 min
...
Cap: 2 hours — minimum bandwidth regardless of network size
Discovery resets backoff to 10 min immediately.
```

---

## 6.15 Peer Exchange (PEX)

When a new peer connects, the relay immediately sends it the full list of known peers via a DAM `"pex"` message — a direct peer-to-peer exchange that does not touch the public graph:

```js
// Sent on "hi" (new connection):
mesh.say({ dam: "pex", peers: ["wss://peer0.akao.io:8420/zen", ...] }, newPeer)

// Handler on receiving end:
mesh.hear["pex"] = function(msg, _peer) {
  msg.peers.forEach(url => adp(url));  // adp = addPeer
};
```

When a peer is discovered mid-session (via scan or inbound pex), it is **immediately broadcast** to all currently connected peers — not deferred to the next `"hi"`.

**Full-mesh prevention:**

ZEN uses two complementary mechanisms to prevent every peer connecting to every other peer (O(n²) links):

| Layer | Mechanism | Where |
|-------|-----------|-------|
| Inbound | **MOB** — redirects excess inbound connections to other peers | `lib/axe.js` line 491 |
| Outbound | **`MUPS = 10`** — scan-initiated `mesh.hi()` capped at 10 upstream connections | `script/server.js` `adp()` |

Checks `root.axe.up` (AXE upstream connection map) before each `mesh.hi()` call. Broadcast (`pex` send) is always allowed regardless of upstream limit — only the actual WebSocket connection is capped.
