# ZEN — Zen Entropy Network

**ZEN** là một **graph database offline-first, phi tập trung, tích hợp mật mã đa curve** — được xây để thay thế GUN trong hệ sinh thái akao.

ZEN không phải là fork. ZEN là hướng tiến hóa tiếp theo:

> `amark/gun` → `akaoio/gun` → **ZEN**

---

## Trạng thái hiện tại

ZEN đang chạy thật. Các thành phần sau đây đã xây xong và có test coverage:

| Thành phần | Trạng thái |
|---|---|
| Graph sync (CRDT / HAM) | ✅ kế thừa từ akaoio/gun, hoạt động |
| secp256k1 — pair, sign, verify, encrypt, decrypt, secret | ✅ hoàn chỉnh |
| P-256 — pair, sign, verify, ECDH | ✅ hoàn chỉnh |
| EVM format — checksummed address, 0x priv, uncompressed epub | ✅ |
| BTC format — P2PKH Base58Check, WIF, compressed epub | ✅ |
| SHA-256, keccak256, RIPEMD-160 | ✅ pure JS, không dependency |
| Certify protocol | ✅ port từ SEA.certify, tích hợp ZEN |
| OPFS storage adapter | ✅ kế thừa từ akaoio/gun |
| RAD / Radisk / Radix storage | ✅ hoạt động, đã migrate sang zen.js |
| WebSocket transport + relay server | ✅ zen-http.js |
| PEN — bytecode policy VM (Zig → WASM) | 🔄 WASM đã biên dịch, integration tiếp tục |
| `lib/*.js` → migrate từ gun.js sang zen.js | ✅ 51 files, globalThis.GUN removed |

Test suite: **145 passing, 0 failing** (April 2026).

---

## Tại sao ZEN tồn tại

GUN và SEA có nền tảng rất mạnh về mặt khái niệm. Nhưng với mục tiêu production của akao, chúng có giới hạn rõ ràng:

1. **CommonJS và side effects**: không friendly với ESM, phụ thuộc `window`, dễ trigger import side effects.
2. **globalThis exposure**: `globalThis.GUN` là attack surface — ai kiểm soát `globalThis` có thể inject dữ liệu bẩn vào graph.
3. **Single-curve SEA**: SEA hardcode P-256. ZEN cần đa curve — secp256k1 cho blockchain/wallet, P-256 cho WebAuthn/Passkey/iOS Secure Enclave.
4. **SEA.certify, user namespace**: các layer này không còn là trung tâm. Policy thuộc về PEN.
5. **Compute locked in JS**: hash, crypto, VM execution — ZEN hướng tới Zig → WASM.

---

## Quick start

```js
import ZEN from 'zen'

// Graph (offline-first, P2P sync)
const zen = new ZEN({ file: 'mydata' })
zen.get('user').put({ name: 'Alice' })
zen.get('user').once(console.log)

// Crypto
const pair = await ZEN.pair()
const sig  = await ZEN.sign('hello', pair)
const ok   = await ZEN.verify(sig, pair.pub)

// Multi-curve
const evmPair = await ZEN.pair(null, { format: 'evm' })
// evmPair.pub  = '0xAbCd...' (EIP-55 checksum address)
// evmPair.priv = '0x<64hex>'

const btcPair = await ZEN.pair(null, { format: 'btc' })
// btcPair.pub  = '1Abc...' (P2PKH Base58Check)
// btcPair.priv = 'K...' or 'L...' (WIF compressed)

const p256Pair = await ZEN.pair(null, { curve: 'p256' })
// dùng cho WebAuthn, iOS Secure Enclave, TLS

// Hash
const h = await ZEN.hash('hello')               // SHA-256, base62
const k = await ZEN.hash('hello', { name: 'keccak256' }) // keccak256, hex
```

---

## API

### Graph API

```js
const zen = new ZEN(opt)

zen.get(key)          // truy cập node
zen.put(data)         // ghi dữ liệu
zen.on(cb)            // subscribe real-time
zen.once(cb)          // đọc một lần
zen.map()             // iterate collection
zen.set(data)         // thêm vào set
zen.back(n)           // trở về chain cha
```

ZEN wrap gun-based runtime bên trong. Graph API hoàn toàn tương thích với GUN chain API.

### Crypto API (static)

```js
ZEN.pair(cb, opt)           // tạo key pair
ZEN.sign(data, pair)        // ký
ZEN.verify(data, pub)       // xác thực
ZEN.encrypt(data, pair)     // mã hóa
ZEN.decrypt(data, pair)     // giải mã
ZEN.secret(pub, pair)       // ECDH shared secret
ZEN.hash(data, opt)         // SHA-256 / keccak256 / SHA-1 / SHA-512
ZEN.certify(certs, policy, pair) // certify protocol
```

Tất cả đều work cả ở dạng static (`ZEN.pair()`) lẫn instance (`zen.pair()`).

### Multi-curve

```js
// secp256k1 (default) — GUN/ZEN native, base62
await ZEN.pair()
await ZEN.pair(null, { curve: 'secp256k1' })

// P-256 / secp256r1 — WebAuthn, iOS, TLS
await ZEN.pair(null, { curve: 'p256' })

// EVM format — Ethereum / EVM chains
await ZEN.pair(null, { format: 'evm' })

// BTC format — Bitcoin P2PKH
await ZEN.pair(null, { format: 'btc' })

// Kết hợp: P-256 key → EVM address
await ZEN.pair(null, { curve: 'p256', format: 'evm' })
```

Multi-curve sign/verify tự động detect curve từ `pair.curve`. Envelope chứa `c: 'p256'` nếu dùng P-256, không có `c` nếu secp256k1 — backward compatible hoàn toàn.

### Deterministic keys

```js
// Từ seed cố định — reproduced được, dùng cho test/recovery
const pair = await ZEN.pair(null, { seed: 'my-secret-seed' })

// Additive derivation — HD-wallet style
const derived = await ZEN.pair(null, { seed: 'child', priv: parent.priv })
```

### PEN — Policy + Execution

```js
// Pen policy spec
ZEN.pen(spec)          // static
zen.pen(spec)          // instance

// Candle clock
ZEN.candle(opts)
```

PEN là bytecode policy VM viết bằng Zig, biên dịch sang WASM. Đây là lớp policy trung tâm của ZEN, thay thế cho auth/session wrapper trong SEA.

---

## Kiến trúc

### 1. Graph engine

ZEN dùng gun-based runtime làm graph engine bên trong (`src/zen/graph.js`). CRDT/HAM conflict resolution, offline-first sync, WebSocket transport đều được kế thừa nguyên vẹn.

ZEN class wrap graph engine:

```
ZEN  →  _graph (GUN instance)  →  graph sync + storage
     →  secp256k1 / p256 / keccak / ripemd160 → crypto
     →  PEN (WASM)             →  policy + execution
```

### 2. Mật mã

**secp256k1** là baseline. Tất cả mã hóa trong ZEN đều pure JS, không dependency ngoài (không libsodium, không external crypto lib). Sign/verify/ECDH hoạt động đồng nhất trên secp256k1 và P-256.

**Base62** là encoding tiêu chuẩn cho keys — URL-safe, soul-friendly, compact hơn base64.

**Clean JSON**: không SEA-style prefix hay envelope format. `sign()` trả về `{ m, s }`. `encrypt()` trả về `{ ct, iv, s }`. Không có `SEA{...}` wrapper.

### 3. Storage

- **OPFS** — browser persistence qua Origin Private File System
- **RAD/Radisk** — filesystem storage cho Node.js
- **IndexedDB** — fallback browser storage
- **AWS S3** — cloud storage adapter

Tất cả adapters đã migrate từ `gun.js` sang `zen.js`. Không còn `globalThis.GUN` ở bất kỳ đâu trong `lib/`.

### 4. Transport

- **WebSocket** — transport mặc định
- **WebRTC** — P2P mesh
- **Multicast** — LAN discovery
- **Axe** — automatic clustering / DHT

### 5. PEN (Zig → WASM)

`src/zen/pen.zig` — bytecode VM không dependency, biên dịch sang `freestanding wasm32`. PEN không phải addon — đây là lớp policy trung tâm, xử lý authorization và execution logic gắn với soul identity.

---

## Storage adapters

```js
import 'zen/lib/store'   // RAD/Radisk storage (Node + browser)
import 'zen/lib/rfs'     // filesystem (Node)
import 'zen/lib/rindexed' // IndexedDB (browser)
import 'zen/lib/opfs'    // OPFS (browser, preferred)
import 'zen/lib/rs3'     // AWS S3
```

---

## Server / relay

```js
// Relay node tích hợp
import 'zen/lib/zen-server'
```

`npm start` khởi động ZEN relay server qua `lib/zen-server.js`. Hỗ trợ multi-peer sync, superpeers, và faith mode.

---

## Development

```bash
npm test       # 145 passing (abc.js + rad/rad.js + radix.js + zen.js)
npm start      # ZEN relay server
npm run buildGUN   # rebuild gun.js sau khi sửa /src
npm run buildZEN   # rebuild zen.js (nếu có)
```

Clean test data trước khi chạy lại:
```bash
rm -rf *data* *radata*
npm test
```

---

## Lineage

```
amark/gun
    │
    └─ graph sync, CRDT/HAM, offline-first, P2P, SEA foundations
    
akaoio/gun  (major invention layer)
    │
    ├─ seed-based deterministic keys
    ├─ additive key derivation
    ├─ WebAuthn / passkey integration
    ├─ external authenticators / HSM support
    ├─ PEN — bytecode policy VM
    ├─ base62 key material
    ├─ OPFS storage adapter
    ├─ globalThis worker compatibility
    ├─ tilde shard indexing
    └─ hashgraph layer draft
    
ZEN  (hướng tiến hóa tiếp theo)
    ├─ multi-curve: secp256k1 + P-256
    ├─ EVM / BTC format output
    ├─ keccak256 + RIPEMD-160 pure JS
    ├─ certify protocol tích hợp
    ├─ toàn bộ lib/ migrate sang zen.js
    ├─ globalThis.GUN hoàn toàn removed
    ├─ ZEN class — unified graph + crypto + policy API
    └─ PEN WASM — policy VM in Zig
```

ZEN giữ nguyên đặc tính cốt lõi của GUN (graph-first, offline-first, CRDT, P2P) trong khi rebuild phần crypto, storage identity và policy layer.

---

## Những gì ZEN không kế thừa

ZEN có chủ đích không giữ những lớp sau từ SEA/GUN:

- `SEA.certify` như một first-class architecture layer (ZEN có certify riêng, tích hợp trực tiếp)
- user namespace model như một first-class layer
- content-addressing như một feature độc lập
- SEA-style `SEA{...}` prefix/envelope format
- `globalThis.GUN` / `globalThis.Gun` — đây là security hole, đã remove hoàn toàn

---

## Tại sao multi-curve quan trọng

| Curve | Dùng cho |
|---|---|
| secp256k1 | GUN/ZEN native, Ethereum, Bitcoin |
| P-256 (secp256r1) | WebAuthn, iOS Secure Enclave, Android Strongbox, TLS |
| EVM format | Ethereum address, EIP-55 checksum |
| BTC format | Bitcoin P2PKH, WIF private key |

Một user trong ZEN có thể có identity trên nhiều chain, nhiều hệ thống crypto, nhiều context khác nhau — tất cả từ một API `pair()` duy nhất.

---

## ZEN và akao

ZEN không phải side project. ZEN tồn tại để thay thế GUN trong [akao](https://github.com/akaoio/akao) — framework-free serverless eCommerce engine dùng native Web Components.

akao là lý do ZEN được xây. Mọi quyết định kiến trúc đều hướng về production readiness cho hệ sinh thái đó.
