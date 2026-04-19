# Chapter 3 — Cryptography

> **Goal:** Master ZEN's built-in crypto runtime — key generation, signing, encryption, shared secrets, hashing, and write-access certificates.

All crypto methods are available as **static methods on `ZEN`** and also as **instance methods on any ZEN chain**.

WebCrypto is required. In browsers, HTTPS is mandatory (WebCrypto is disabled on HTTP origins).

---

## 3.1 Key pairs

### `ZEN.pair(seed, opt)`

Generate a key pair.

```js
const pair = await ZEN.pair();
```

**Returns an object:**

| Field | Type | Description |
|-------|------|-------------|
| `pub` | string (88 chars) | Public key, base62 encoded |
| `priv` | string (44 chars) | Private key — **never share or store in the graph** |
| `epub` | string (88 chars) | Ephemeral public key (for ECDH) |
| `epriv` | string (44 chars) | Ephemeral private key |
| `curve` | string | `"secp256k1"` by default |

```js
console.log(pair.curve);      // "secp256k1"
console.log(pair.pub.length); // 88
```

**Options:**

```js
// P-256 (secp256r1)
const p256pair = await ZEN.pair(null, { curve: "p256" });

// EVM-format (0x checksummed address)
const evmpair = await ZEN.pair(null, { format: "evm" });

// Bitcoin P2PKH mainnet
const btcpair = await ZEN.pair(null, { format: "btc" });
```

**Seed-based (deterministic):**

```js
const pair = await ZEN.pair("my deterministic seed");
// Same seed → same key pair, every time
```

---

## 3.2 Signing and verification

### `ZEN.sign(data, pair)`

Signs `data` with a private key. Returns a JSON string `{ m, s }` where `m` is the data and `s` is the signature.

```js
const signed = await ZEN.sign("hello", pair);
// '{"m":"hello","s":"<signature>"}'
```

**`data` can be any valid JS value:**

```js
await ZEN.sign(null, pair);
await ZEN.sign(true, pair);
await ZEN.sign(42, pair);
await ZEN.sign("hello", pair);
await ZEN.sign([1, 2, 3], pair);
await ZEN.sign({ key: "value" }, pair);
await ZEN.sign(JSON.stringify({ a: 1 }), pair);
```

### `ZEN.verify(sig, pub)`

Verifies a signed value against a public key. Returns the original data on success, `undefined` on failure.

```js
const data = await ZEN.verify(signed, pair.pub);
// "hello"

const bad = await ZEN.verify(signed, otherPair.pub);
// undefined — wrong key

const tampered = await ZEN.verify('{"m":"evil","s":"..."}', pair.pub);
// undefined — signature mismatch
```

You can also pass the parsed JSON object directly:

```js
const obj = JSON.parse(signed);
const data = await ZEN.verify(obj, pair.pub);
```

If the original data was `JSON.stringify(...)`, the result is automatically parsed back:

```js
const signed = await ZEN.sign(JSON.stringify({ a: 1 }), pair);
const data   = await ZEN.verify(signed, pair.pub);
// { a: 1 }  ← parsed back to object
```

---

## 3.3 Encryption and decryption

### `ZEN.encrypt(data, key)`

Encrypts `data` using AES-GCM. Returns a ciphertext string.

```js
const enc = await ZEN.encrypt("secret", pair);
```

**`data` can be any valid JS value** (same as sign). **`key`** can be:
- Your own `pair` (self-encryption)
- Another user's `pair.epub` combined with your own pair (shared-key mode — see §3.4)

### `ZEN.decrypt(enc, key)`

Decrypts a ciphertext string. Returns the original data, or `undefined` if the key is wrong.

```js
const dec = await ZEN.decrypt(enc, pair);
// "secret"

const wrong = await ZEN.decrypt(enc, otherPair).catch(() => undefined);
// undefined
```

Round-trip with a stringified object:

```js
const original = JSON.stringify({ msg: "hello" });
const enc = await ZEN.encrypt(original, pair);
const dec = await ZEN.decrypt(enc, pair);
// { msg: "hello" }  ← automatically parsed back
```

---

## 3.4 Shared secrets (ECDH)

### `ZEN.secret(epub, pair)`

Derives a shared AES secret using ECDH. Two parties can derive the same secret without transmitting it.

```js
const alice = await ZEN.pair();
const bob   = await ZEN.pair();

// Alice derives the shared secret using Bob's epub and her own pair
const sharedByAlice = await ZEN.secret(bob.epub, alice);

// Bob derives the same secret using Alice's epub and his own pair
const sharedByBob   = await ZEN.secret(alice.epub, bob);

// sharedByAlice === sharedByBob  ← same bytes, different derivations
```

Use the shared secret as an encryption key:

```js
const enc = await ZEN.encrypt("private msg", { ...alice, pub: sharedByAlice });
const dec = await ZEN.decrypt(enc, { ...bob, priv: sharedByBob });
```

---

## 3.5 Hashing

### `ZEN.hash(data, pair, cb, opt)`

Produces a deterministic hash of `data`.

```js
// SHA-256 (default, PBKDF2-derived, base62 output)
const h = await ZEN.hash("hello");

// SHA-256 direct digest, hex output
const sha = await ZEN.hash("hello", null, null, { name: "SHA-256", encode: "hex" });

// Keccak-256
const keccak = await ZEN.hash("hello", null, null, { name: "keccak256", encode: "hex" });

// keccak256 of empty string
// "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"

// ArrayBuffer input
const buf = new TextEncoder().encode("hello").buffer;
const h = await ZEN.hash(buf);
```

**Callback form:**

```js
ZEN.hash("hello", null, function(result) {
  console.log(result);
});
```

---

### 3.5.1 Mining — `opt.pow`

When `opt.pow` is set, `hash()` enters **mining mode**: it loops with base62-encoded nonces until the hash output starts with the required prefix, then returns `{ hash, nonce, proof }`.

```js
const result = await ZEN.hash(
  nonce => `order:${candle}:${nonce}`,   // nonce is a base62 string
  null, null,
  { name: "SHA-256", encode: "hex", pow: { unit: "0", difficulty: 2 } }
);
// result.hash  — winning SHA-256 hex hash (starts with "00")
// result.nonce — base62-encoded nonce string, e.g. "G" or "1z"
// result.proof — the full data string that was hashed, e.g. "order:1712000000:G"
```

`opt.pow` fields mirror the pen soul `pow` policy:

| Field | Type | Description |
|-------|------|-------------|
| `unit` | `string` | Prefix character(s) each hash must start with (default `"0"`) |
| `difficulty` | `number` | How many times `unit` is repeated (default `1`) |

**Nonce encoding:** nonces are base62 (`0-9A-Za-z`) so they stay short as the search space grows.

**Separator:** when `data` is a plain string, the nonce is appended with `:` as separator:
```js
// data = "work", nonce = "G" → proof = "work:G"
const result = await ZEN.hash("work", null, null,
  { name: "SHA-256", encode: "hex", pow: { unit: "0", difficulty: 1 } });
```

**Function form** (full nonce control — nonce in any position):
```js
const result = await ZEN.hash(
  nonce => `${candle}:${nonce}`,  // nonce anywhere in the string
  null, null,
  { name: "SHA-256", encode: "hex", pow: { unit: "0", difficulty: 2 } }
);
```

---

### 3.5.2 Pen PoW compatibility

ZEN's pen policy engine verifies PoW with:

```js
// pen.js internals — how the verifier checks PoW:
hash(fieldValue, null, cb, { name: "SHA-256", encode: "hex" })
// passes if hash starts with pow.unit.repeat(pow.difficulty)
```

Mining is compatible because:
1. The `proof` IS the literal field value (key/val/soul/etc.) written to the graph.
2. Both the miner and the verifier hash that same string via `SHA-256/hex`.
3. Same input → same hash → same prefix check → **passes automatically**.

```js
// Mine a key for a pen soul with pow: { unit: "0", difficulty: 2 }
const { proof } = await ZEN.hash(
  nonce => `${candle}:${nonce}`,
  null, null,
  { name: "SHA-256", encode: "hex", pow: { unit: "0", difficulty: 2 } }
);

// Write using `proof` as the key — pen will accept it
zen.get(penSoul).get(proof).put(data, cb, { authenticator: pair });
```

> **Why not `opt.salt` as nonce?**
>
> When `opt.name` is `"SHA-256"` (or any direct hash), the code takes the `ishash()` path
> and calls `sha256(data)` directly. `opt.salt` is **never read** in that path — it only
> exists in the PBKDF2 branch. Therefore, changing `opt.salt` has zero effect on the
> SHA-256 output, and cannot be used as a nonce for pen-compatible PoW mining.
> The nonce **must** be embedded in the data itself.

---

## 3.6 Certificates — delegating write access

### `ZEN.certify(certificant, policy, authority)`

Creates a certificate that grants write access to another user (or all users) for a specific path.

```js
const alice = await ZEN.pair();  // the authority
const bob   = await ZEN.pair();  // the recipient

// Alice grants Bob write access to the "inbox" path
const cert = await ZEN.certify(bob.pub, "inbox", alice);
```

**`certificant` can be:**

| Value | Meaning |
|-------|---------|
| `bob.pub` (string) | Grant access to Bob only |
| `"*"` | Grant access to any user (wildcard) |
| `[bob.pub, carol.pub]` | Grant access to multiple users |
| `[alice, bob]` (pair objects) | Uses `.pub` from each pair |

**`policy`** is a string path, e.g. `"inbox"`, `"messages"`.

**Returns:** a JSON string `{ m, s }` (signed by the authority). The certificate can be verified:

```js
const data = await ZEN.verify(cert, alice.pub);
// { c: bob.pub, w: "inbox" }
```

**Using a certificate in `put()`:**

```js
// Bob writes to Alice's inbox using the certificate
zen.get("~" + alice.pub).get("inbox").put(
  { text: "hello" },
  function(ack) { console.log(ack); },
  { authenticator: bob, cert: cert }
);
```

---

## 3.7 Key IDs

### `ZEN.keyid(pub)`

Returns a short identifier for a public key (first N chars). Useful for display or lookup without revealing the full key.

```js
const id = ZEN.keyid(pair.pub);
```

---

## 3.8 Key encoding utilities

### `ZEN.pack(data)` and `ZEN.unpack(str)`

ZEN uses base62 (`[A-Za-z0-9]`) for all key material. These utilities pack/unpack binary data to/from base62 strings.

```js
const packed   = ZEN.pack(uint8Array);   // → base62 string
const unpacked = ZEN.unpack(str);        // → Uint8Array
```

---

## 3.9 Public key format

All public keys in ZEN use **base62 encoding** — only alphanumeric characters, no `_`, `-`, `.` separators.

| Field | Length | Alphabet |
|-------|--------|---------|
| `pub` / `epub` | 88 chars | `[A-Za-z0-9]` |
| `priv` / `epriv` | 44 chars | `[A-Za-z0-9]` |

This is a deliberate change from the original GUN base64url format. It enables keys to be used as URL path segments and graph souls without escaping.

ZEN automatically accepts old-format (base64url, 43/87-char) keys for backward compatibility.

---

## 3.10 `ZEN.opt.pub(soul)` — extract pub from soul

Extracts the public key from a `~/...` soul path:

```js
ZEN.opt.pub("~" + pair.pub + "/profile");  // → pair.pub
```

Returns `undefined` if the soul is not a valid tilde path.

---

## 3.11 Crypto on instance methods

All static crypto methods are also available as instance methods for convenience:

```js
const zen = new ZEN({ ... });

const pair   = await zen.pair();
const signed = await zen.sign("data", pair);
const ok     = await zen.verify(signed, pair.pub);
const enc    = await zen.encrypt("msg", pair);
const dec    = await zen.decrypt(enc, pair);
```

They behave identically to the static forms.

---

## 3.12 SECP256K1 namespace

The secp256k1 curve is exposed as a namespace:

```js
zen.SECP256K1.curve   // "secp256k1"
ZEN.SECP256K1.curve   // "secp256k1"
```

---

## 3.13 `ZEN.check`

`ZEN.check` is a function that validates whether a graph write is authorized. It is called automatically by the security middleware — you do not normally call it directly.

---

## 3.14 `ZEN.security`

```js
ZEN.security.opt === ZEN.opt  // true
```

`ZEN.security` is an object that holds the security configuration. `ZEN.security.opt` is the same function as `ZEN.opt` — they refer to the same option-parser.

---

## 3.15 Security summary

| Method | Direction | Key used |
|--------|-----------|---------|
| `sign(data, pair)` | Write | `pair.priv` |
| `verify(sig, pub)` | Read | `pub` string |
| `encrypt(data, pair)` | Write | `pair.priv` + own `pair.epub` |
| `decrypt(enc, pair)` | Read | `pair.priv` + own `pair.epriv` |
| `secret(epub, pair)` | Key exchange | `pair.epriv` + `epub` |
| `certify(cert, policy, auth)` | Delegation | `auth.priv` |
| `hash(data)` | Fingerprint | none (deterministic) |
