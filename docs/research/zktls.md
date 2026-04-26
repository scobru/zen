# zkTLS — Research

> **Status:** Research — not yet implemented.
>
> **Goal:** Understand ZEN zkTLS — cryptographic proofs that a specific value was honestly fetched from a specific HTTPS server, verifiable by any peer without trusting the oracle that fetched it.

---

## 1. The oracle problem

ZEN is a decentralised, peer-verified graph. When a node writes a price, a balance, or any real-world fact sourced from an HTTPS API, other peers have no way to verify it. They must either trust the writer or re-fetch the same URL — neither is acceptable in a trustless graph.

**zkTLS** solves this. The oracle generates a zero-knowledge proof alongside the data, proving that the claim came from a specific HTTPS server response. Any peer can verify the proof in under 1 ms without re-fetching, without trusting the oracle, and without any multi-party computation.

---

## 2. What "oracle cannot fake data" requires

The fundamental constraint: the oracle is the TLS client. They hold the session key. A proof that merely shows correct AES decryption is **not sufficient** — the oracle could construct a fake `(key, ciphertext)` pair for any plaintext they choose.

Truly trustless proof requires binding the session key to the server's identity:

```
server_pub ← cert_chain_verify(server_cert, embedded_root_CAs)   ← public
shared_secret = ECDH(oracle_ephem_priv, server_pub)               ← ZK
session_key  = HKDF(shared_secret, handshake_transcript)          ← ZK
plaintext    = AES_GCM_decrypt(session_key, ciphertext)           ← ZK
claim_value  = extract(plaintext, selector)                        ← ZK
```

Public inputs: `server_cert`, `ciphertext`, `handshake_transcript_hash`, `root_CA_pubkeys`, `claim_value`, `selector`  
Private inputs: `oracle_ephem_priv`, `plaintext`

If the oracle uses a fake server, `cert_chain_verify` fails. If they tamper with ciphertext, AES-GCM's auth tag fails. If they claim a wrong value, extraction fails. The proof is unforgeable.

This is a large circuit (~5.75 M constraints). ZEN zkTLS implements this as a single `tls13` circuit — the only approach that is genuinely trustless for arbitrary HTTPS APIs.

---

## 3. Architecture

```
┌───────────────────────────────────────────────────────────────┐
│  Layer 3: Application                                         │
│  zktls.prove({ url, extract, circuit })                       │
│  zen.get(soul).get(key).put(val, cb, { tls: attestation })    │
├───────────────────────────────────────────────────────────────┤
│  Layer 2: ZEN bridge (src/pen.js + src/put.js)                │
│  PEN opcode 0xC5 — enforces tls policy on every write         │
│  spec.tls in ZEN.pen() compiles to 0xC5 tail bytes            │
│  opt.tls in zen.put() auto-proves or passes attestation       │
├───────────────────────────────────────────────────────────────┤
│  Layer 1: lib/zktls.js  (~2000 lines, single file)            │
│  prove(opt)    → Attestation   (oracle role, BigInt prover)   │
│  verify(att)   → boolean       (all peers, calls WASM)        │
│  setup(circuit, ptau, out)     (one-time trusted setup)       │
│  register(name, { prove, verify })  (custom circuits)         │
│  Internals: BN254 BigInt, Groth16 prover, R1CS (tls13)       │
│  R1CS written directly in JS — no Circom dependency           │
├───────────────────────────────────────────────────────────────┤
│  Layer 0: lib/zktls.wasm — STANDALONE (~35–45 KB, 0 imports)     │
│  Source: lib/zktls.zig                                        │
│  Groth16 verifier over BN254                                  │
│  BN254 field tower (Fp → Fp2 → Fp6 → Fp12)                   │
│  Ate pairing, AES-128-GCM, SHA-256                            │
└───────────────────────────────────────────────────────────────┘
```

Every ZEN peer is a potential oracle. `lib/zktls.js` is a single file that handles both roles:

- **Verify role** (all peers, including browser): calls `lib/zktls.wasm` for the BN254 pairing check — fast (~1 ms), loads ~35–45 KB WASM only.
- **Oracle role** (any peer that fetches HTTPS data): runs the BigInt Groth16 prover internally. Proving key (`.zkey`) is loaded lazily on first `prove()` call.

No external dependencies. R1CS constraint matrices for `tls13` are written directly in JS — no Circom compiler required.

---

## 4. Why not a simpler ecdsa circuit?

If an API already signs its responses with ECDSA (Chainlink, Pyth, JWT ES256), one might propose a lighter circuit that only proves `ECDSA_verify(api_pub, hash(body), sig) = true`. This is **redundant** — ZEN and PEN already handle it natively with zero ZK overhead:

```js
// API signs response → oracle writes {data, sig} → PEN verifies ECDSA directly
const soul = ZEN.pen({ sign: true, cert: API_PUB })
zen.get(soul).get('price').put(data, null, { authenticator: pair, cert: apiCert })
```

PEN opcode `0xC0` (SGN) + `0xC1` (CRT) already enforce this. Any peer verifies in microseconds with no proof, no `.zkey`, no pairing. An ecdsa ZK circuit would add proving cost (~15 s) for zero security gain — the trust model is identical to native PEN cert verification.

**zkTLS is only needed when the API does not sign its responses** — the general HTTPS case where the oracle is the only party that knows the TLS session key. That is what the `tls13` circuit solves.

---

## 5. Circuit `tls13` — general HTTPS

zkTLS provides a single circuit: `tls13`. Targets any HTTPS server. No server cooperation needed. Embeds well-known root CA public keys in the circuit. Oracle cannot impersonate a legitimate server.

**What the circuit proves:**

```
server_pub                           ← cert_chain_verify(cert, root_CAs)
HS = ECDH(oracle_ephem_priv, server_pub)
K  = HKDF_expand(HKDF_extract(HS, ""), transcript_hash || "key exp")
plaintext = AES_128_GCM_decrypt(K, iv, ciphertext, aad)
extract(plaintext, selector) = claim_value
```

Public inputs: `server_cert_chain`, `ciphertext`, `transcript_hash`, `claim_value`, `selector_hash`  
Private inputs: `oracle_ephem_priv`, `plaintext`

**Trust model:** Fully trustless. Oracle cannot fake data without forging a root-CA-signed certificate for the target host. Verification does not require trusting the oracle in any way.

**Constraint estimate:**

| Component | Constraints |
|-----------|-------------|
| P-256 ECDH scalar multiplication (emulated, BN254 field) | ~4 500 000 |
| HKDF-SHA256 key schedule | ~120 000 |
| AES-128-GCM decrypt (1 TLS record, ~1 KB payload) | ~350 000 |
| X.509 cert chain verify (2-cert chain) | ~700 000 |
| JSON / regex extraction | ~80 000 |
| **Total (1 KB response)** | **~5 750 000** |

- Proof generation: ~3–8 min server-side (Node.js BigInt, or GPU accelerated)
- Proof size: 192 bytes
- Verification: < 1 ms

> **Trusted setup:** Requires `hermez_final_23.ptau` (2²³, ~4.2 GB) from the Hermez public ceremony. Download once, generate `lib/zktls_tls13.zkey` + `vk.json` locally.

---

## 6. Attestation format

Every attestation is a plain JSON object, stored in `msg.put["~z"]` on the ZEN wire and optionally persisted in the graph.

The attestation carries both the ZK proof **and the public witness data** the verifier needs to reconstruct the public inputs. Without `server_cert`, `ciphertext`, and `transcript_hash`, a verifier cannot confirm the oracle did not substitute different data.

```json
{
  "circuit": "tls13",
  "origin": {
    "host": "api.coingecko.com",
    "path": "/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
    "method": "GET"
  },
  "extract": {
    "type": "json",
    "path": ".bitcoin.usd"
  },
  "claim": {
    "value": "42150.73",
    "type": "number"
  },
  "tls": {
    "server_cert": "<base64 DER cert chain, ~2 KB>",
    "ciphertext":  "<base64 raw TLS record ciphertext, ~1 KB>",
    "transcript_hash": "<base62 32-byte handshake transcript hash>"
  },
  "proof": {
    "pi_a": "<base62 G1 point>",
    "pi_b": "<base62 G2 point>",
    "pi_c": "<base62 G1 point>",
    "pub":  ["<base62 BN254 field element>", "..."]
  },
  "timestamp": 1714060800,
  "ttl": 3600
}
```

**`proof.pub` encodes (in order):** `SHA256(server_cert)`, `SHA256(ciphertext)`, `transcript_hash`, `selector_hash`, `claim_value` — all as BN254 scalar field elements. The verifier hashes `tls.server_cert` and `tls.ciphertext`, then checks these match `proof.pub[0]` and `proof.pub[1]` before running the pairing check.

| Field | Required | Description |
|-------|----------|-------------|
| `circuit` | ✓ | `"tls13"` or custom registered name |
| `origin.host` | ✓ | HTTPS server hostname |
| `origin.path` | ✓ | Request path + query string |
| `origin.method` | — | HTTP method, default `"GET"` |
| `extract.type` | ✓ | `"json"`, `"regex"`, or `"text"` |
| `extract.path` | ✓ | Dot-notation JSON path or regex with one capture group |
| `claim.value` | ✓ | The proven extracted value (as string) |
| `claim.type` | — | `"string"`, `"number"`, `"boolean"` |
| `tls.server_cert` | ✓ | Base64 DER-encoded server cert chain (verifier hashes to check pub[0]) |
| `tls.ciphertext` | ✓ | Base64 raw TLS record ciphertext (verifier hashes to check pub[1]) |
| `tls.transcript_hash` | ✓ | Base62 32-byte handshake transcript hash (verifier checks pub[2]) |
| `proof.pi_a/b/c` | ✓ | Groth16 proof points (base62 encoded) |
| `proof.pub` | ✓ | Groth16 public inputs array (base62 BN254 scalars) |
| `timestamp` | ✓ | Unix seconds when fetch occurred |
| `ttl` | — | Attestation freshness window (seconds) |

---

## 7. `zktls.prove(opt)` — fetch and prove

Any peer can act as oracle. Fetches the HTTPS response and generates the full SNARK proof using the BigInt Groth16 prover inside `lib/zktls.js`. The proving key (`.zkey`) is loaded lazily on first call.

```js
import zktls from './lib/zktls.js'
import ZEN    from './zen.js'

const oraclePair = await ZEN.pair()

const attestation = await zktls.prove({
  url:     'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
  method:  'GET',
  headers: { 'Accept': 'application/json' },
  extract: {
    type: 'json',
    path: '.bitcoin.usd',
  },
  pair:    oraclePair,    // oracle's ZEN key pair (signs the attestation envelope)
  ttl:     3600,
})
```

**Options:**

| Option | Description |
|--------|-------------|
| `url` | Full HTTPS URL to fetch |
| `method` | HTTP method, default `"GET"` |
| `headers` | Request headers |
| `extract.type` | `"json"`, `"regex"`, or `"text"` |
| `extract.path` | JSON path or regex with one capture group |
| `root_cas` | Array of DER-encoded root CA certs. Defaults to Mozilla NSS bundle (top 15 roots). |
| `capture` | `'response_only'` (default) or `'full_session'` (include handshake for audit). |
| `pair` | Oracle's ZEN key pair (signs the attestation envelope) |
| `ttl` | Attestation freshness window in seconds |

**Extract types:**

| Type | `path` | Extracts |
|------|--------|---------|
| `'json'` | Dot-notation: `'.data.price'`, `'.items[0].id'` | Parsed JSON value |
| `'regex'` | Regex with one capture group: `'"price":"(\\d+\\.?\\d*)"'` | First capture group |
| `'text'` | `null` | Full response body as string |

### How the oracle captures TLS session data

Node.js's built-in `tls` module does not expose ephemeral ECDH private keys — the information needed to build the ZK witness. `lib/zktls.js` therefore implements a **minimal TLS 1.3 client** that generates its own ephemeral key pair and retains all session state:

```
Oracle                                    Server
  │──── ClientHello (oracle_ephem_pub) ─────▶│
  │◀─── ServerHello (server_ephem_pub) ──────│
  │◀─── {Certificate, CertVerify, Finished}──│  ← captures cert chain
  │                                           │
  │  oracle computes:                         │
  │    HS = ECDH(oracle_ephem_priv, server_ephem_pub)
  │    transcript_hash = SHA256(all handshake messages so far)
  │    session_key = HKDF(HS, transcript_hash, "key exp")
  │                                           │
  │──── {Finished} ─────────────────────────▶│
  │◀─── {ApplicationData (ciphertext)} ──────│  ← captures raw ciphertext
```

The TLS 1.3 client (~800 lines inside `lib/zktls.js`) reuses ZEN's existing P-256 curve implementation (`src/curves/p256.js`) for the ECDH step. After the session completes, the oracle holds:

| Captured value | Used as |
|----------------|---------|
| `oracle_ephem_priv` | ZK private input |
| `server_cert` (DER chain) | Public input (`proof.pub[0]` = SHA256 hash) |
| `ciphertext` (raw TLS record) | Public input (`proof.pub[1]` = SHA256 hash) |
| `transcript_hash` | Public input (`proof.pub[2]`) |

This approach is fully self-contained — no OS-level key logging, no external proxy, no platform-specific hooks.

---

## 8. `zktls.verify(attestation, policy?)` — verify a proof

Runs in any ZEN peer, browser or server. Calls `lib/zktls.wasm` for the pairing check. Does not require the `.zkey` proving key.

```js
const ok = await zktls.verify(attestation)
// or with policy constraints:
const ok = await zktls.verify(attestation, {
  host:      'api.coingecko.com',
  path:      '/api/v3/simple/price',
  maxAge:    300,               // reject if timestamp > 5 min old
  claimType: 'number',
})
```

Policy fields:

| Field | Effect |
|-------|--------|
| `host` | Must match `attestation.origin.host` |
| `path` | Prefix match. `'/api/v3/*'` accepts any path under `/api/v3/`. |
| `maxAge` | Reject if `Date.now()/1000 - attestation.timestamp > maxAge` |
| `claimType` | `claim.value` must parse as this type |

---

## 9. PEN policy — `spec.tls` in `ZEN.pen()`

Encode a zkTLS requirement directly in a PEN soul. The policy is enforced on every write to that soul, by every peer independently.

```js
import ZEN from './zen.js'

const soul = ZEN.pen({
  key:  myKeyExpr,
  sign: true,         // also require oracle's ZEN signature
  tls: {
    host:     'api.coingecko.com',
    path:     '/api/v3/simple/price',
    maxAge:   60,
    claimType: 'number',
  }
})

// soul starts with '!', embeds both predicate bytecode and 0xC5 tail policy
```

**How enforcement works:**
1. Write arrives at a `!`-prefixed soul.
2. PEN evaluates the predicate expression (key, val, etc.) via `pen.wasm`.
3. The ZEN bridge reads `msg.put["~z"]` (the attestation).
4. `zktls.verify(attestation, policy.tls)` is called.
5. If verification fails → write is rejected, dropped silently (same as any HAM/policy reject).

### PEN opcode 0xC5 encoding

`spec.tls` compiles to a `0xC5` tail byte followed by the serialised policy. The Zig VM (`pen.wasm`) does not process this opcode — it is handled entirely by `applypolicy()` in `src/pen.js`.

```
0xC5
<host_len: u8>     <host: utf8>
<path_len: u8>     <path: utf8>
<flags: u8>                                  bit 0 = has_maxAge
                                             bit 1 = has_claimType
[<maxAge: u32le>]                            if has_maxAge
[<claimType_len: u8> <claimType: utf8>]      if has_claimType
```

---

## 10. Writing with a zkTLS attestation

### Option A — pre-proved attestation

The oracle proves first, then writes:

```js
import ZEN   from './zen.js'
import zktls from './lib/zktls.js'

const pair = await ZEN.pair()

const soul = ZEN.pen({
  sign: true,
  tls:  { host: 'api.coingecko.com', path: '/api/v3/simple/price', maxAge: 60, claimType: 'number' }
})

// Prove (takes ~3–8 min for tls13 circuit)
const att = await zktls.prove({
  url:     'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
  extract: { type: 'json', path: '.bitcoin.usd' },
  pair,
})

// Write — passes attestation in opt.tls
const zen = new ZEN({ peers: ['ws://relay.example.com'] })
zen.get(soul).get('btcUsd').put(att.claim.value, null, {
  authenticator: pair,
  tls: att,
})
```

### Option B — auto-prove inline

Pass `tls` as a fetch config. ZEN calls `zktls.prove()` internally before the put:

```js
zen.get(soul).get('btcUsd').put(null, null, {
  authenticator: pair,
  tls: {
    url:     'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
    extract: { type: 'json', path: '.bitcoin.usd' },
  }
})
// data is set automatically to att.claim.value
// msg.put["~z"] is set automatically to the attestation
```

---

## 11. Custom circuits

Register a circuit with `zktls.register(name, { prove, verify })`:

```js
zktls.register('my-circuit', {
  // ctx: { url, method, headers, response (raw string), origin, extract, claim }
  async prove(ctx) {
    // Generate proof data. Return any JSON-serialisable object.
    return { pi_a: '...', pi_b: '...', pi_c: '...', pub: ['...'] }
  },
  // att: full Attestation object including att.proof
  async verify(att, policy) {
    // Call lib/zktls.wasm or do pure JS verification.
    // Return true or false.
    return true
  }
})
```

Custom circuits use the same wire format (`msg.put["~z"]`) and the same PEN opcode (`0xC5`). The `circuit` field in the attestation routes to the correct registered handler.

---

## 12. Standalone usage (no ZEN graph)

`lib/zktls.js` is usable as a pure proof library independent of ZEN:

```js
import zktls from './lib/zktls.js'
import ZEN    from './zen.js'

// Generate proof (any peer acting as oracle)
const pair = await ZEN.pair()
const att  = await zktls.prove({
  url:     'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
  extract: { type: 'json', path: '.bitcoin.usd' },
  pair,
})

// Serialise
const json = JSON.stringify(att)

// Verify anywhere (browser or server) — no zkey needed
const ok = await zktls.verify(JSON.parse(json), {
  host:    'api.coingecko.com',
  maxAge:  3600,
})

console.log(ok) // true
```

---

## 13. Trusted setup

The `tls13` circuit uses Groth16, which requires a one-time **trusted setup**. ZEN zkTLS uses the public **Hermez Powers of Tau** ceremony (2021, ~1000 participants, toxic waste demonstrably destroyed):

| Circuit | Required ptau | File size |
|---------|--------------|-----------|
| `tls13` | `hermez_final_23.ptau` (2²³) | 4.2 GB |

The ptau file is downloaded once and used to generate the circuit-specific `.zkey` (proving key):

```bash
npm run zktls:setup   # generates lib/zktls_tls13.zkey + embeds vk in lib/zktls.wasm
```

The `.zkey` file (~2–3 GB) is only needed on oracle nodes (provers). The verification key (`vk.json`, ~2 KB) is extracted from the `.zkey` and embedded in `lib/zktls.wasm` at build time — all verifying peers need only the WASM.

---

## 14. Security model

| Threat | Defense |
|--------|---------|
| Oracle uses a fake server | Server's cert must chain to embedded root CA — forgery requires compromising a root CA |
| Oracle alters ciphertext | AES-GCM authentication tag check is inside the circuit |
| Oracle claims wrong ECDH session key | ZK-ECDH in circuit — oracle cannot use a key inconsistent with `server_pub` from cert |
| Oracle substitutes a different server's cert | `server_cert` is a public input; verifier checks it matches the expected host |
| Oracle replays old data | `timestamp` + `ttl` + PEN `maxAge` policy |
| Root CA compromise | Update embedded root CA list and re-deploy `lib/zktls.wasm` |

### Groth16 trusted setup

If the ptau ceremony's toxic waste is not destroyed, an attacker who holds it can forge proofs for any circuit. Mitigation:
- Use the Hermez public ceremony (~1000 participants, toxic waste demonstrably destroyed).
- Verification keys (`vk.json`) are public and pinned in `lib/zktls.wasm` — any tampering is detectable.

---

## 15. lib/zktls.wasm internals

Compiled from `lib/zktls.zig`. Standalone, zero imports.

**Exports:**

| Export | Signature | Description |
|--------|-----------|-------------|
| `groth16_verify` | `(vk_ptr, proof_ptr, pub_ptr, pub_len) → i32` | Returns 1 if valid, 0 if invalid |
| `alloc` | `(size: u32) → ptr: u32` | WASM allocator |
| `free` | `(ptr: u32, size: u32)` | WASM allocator |
| `mem` | `() → ptr: u32` | Returns pointer to shared memory region |

**Internal modules (Zig):**

| Module | Lines (est.) | Purpose |
|--------|-------------|---------|
| `bn254_fp.zig` | ~200 | BN254 Fp field (254-bit Montgomery mul) |
| `bn254_fp2.zig` | ~100 | Fp2 extension (quadratic) |
| `bn254_fp6.zig` | ~120 | Fp6 tower (cubic over Fp2) |
| `bn254_fp12.zig` | ~120 | Fp12 tower (quadratic over Fp6) |
| `bn254_g1.zig` | ~80 | G1 group ops (affine + Jacobian) |
| `bn254_g2.zig` | ~80 | G2 group ops |
| `bn254_pairing.zig` | ~150 | Ate pairing + Miller loop + final expo |
| `groth16.zig` | ~60 | Groth16 verifier (3 pairings + 1 MSM) |

**Expected size:** ~35–45 KB compiled (`-O ReleaseSmall`).

> AES-128-GCM and SHA-256 are R1CS constraints verified implicitly by the pairing check — the WASM verifier does not re-execute them.

---

## 16. `lib/zktls.js` internals

Single file (~2800 lines). No external dependencies. No Circom. R1CS constraint matrices are written directly as JS objects. Reuses ZEN's existing P-256 curve (`src/curves/p256.js`) for the TLS ECDH step.

```js
// Internal structure (all in lib/zktls.js):
// ── TLS 1.3 client ───────────────────────────── ~800 lines
//    Minimal TLS 1.3 handshake (ClientHello → ServerHello → Finished)
//    Captures: oracle_ephem_priv, server_cert, ciphertext, transcript_hash
//    Reuses src/curves/p256.js for ephemeral ECDH key generation
//    HKDF-SHA256 key schedule, AES-128-GCM record decryption
// ── BN254 BigInt arithmetic ──────────────────── ~200 lines
//    Montgomery mul, Fp add/sub/mul/inv, point ops
// ── Groth16 prover ───────────────────────────── ~400 lines
//    NTT (number-theoretic transform), MSM (multi-scalar mul)
//    Polynomial commitment, proof assembly
// ── R1CS: tls13 circuit ──────────────────────── ~400 lines
//    Constraint matrices for ECDH + HKDF + AES-GCM + X.509
// ── Witness generation ───────────────────────── ~300 lines
//    Maps TLS session state → BN254 field elements (private + public inputs)
// ── Setup utilities ──────────────────────────── ~200 lines
//    Phase 2 setup: (r1cs, ptau) → zkey
//    vk extraction: zkey → vk.json (embeds in zktls.wasm)
// ── WASM verifier loader ─────────────────────── ~100 lines
//    Load zktls.wasm, SHA256(server_cert/ciphertext), call groth16_verify
// ── Public API ───────────────────────────────── ~150 lines
//    prove / verify / setup / register
```

Calling pattern by role:

```js
// Any peer — verify only (loads ~35–45 KB WASM, no zkey needed):
import zktls from './lib/zktls.js'
const ok = await zktls.verify(attestation, policy)

// Any peer acting as oracle — prove + verify:
const att = await zktls.prove({ url, extract, ... })
// .zkey loaded lazily from disk on first prove() call

// One-time trusted setup (run once after downloading hermez_final_23.ptau):
await zktls.setup('tls13', './hermez_final_23.ptau', './lib/zktls_tls13.zkey')
```

---

## 17. Building

```bash
# Build WASM verifier (requires Zig on PATH)
npm run buildZKTLS

# Generate trusted setup for tls13 circuit
# (downloads hermez_final_23.ptau ~4.2 GB, one time)
npm run zktls:setup

# Run zkTLS tests
npm run testZKTLS
```

`lib/builder/zktls.js` compiles `lib/zktls.zig` to `lib/zktls.wasm` and embeds the `vk.json` files. Pattern is identical to `lib/builder/pen.js`.

---

## 18. File reference

| File | Role |
|------|------|
| `lib/zktls.js` | Single file: prove + verify + setup + R1CS (tls13) |
| `lib/zktls.wasm` | BN254 Groth16 verifier (Zig, ~35–45 KB, standalone) |
| `lib/zktls.zig` | Source of `lib/zktls.wasm` |
| `lib/builder/zktls.js` | Build script (zig → wasm, embeds vk.json) |
| `lib/zktls_tls13.zkey` | Proving key for tls13 circuit (oracle node, ~2–3 GB) |
| `test/zktls.js` | Unit tests (verifier, prove/verify round-trips) |

`.zkey` files are not committed to the repo. They are generated locally by running `zktls.setup()` after downloading the Hermez `.ptau` file. The verifier key (`vk.json`) is extracted from the `.zkey` and embedded into `lib/zktls.wasm` at build time — peers do not need the `.zkey` to verify.

---

## 19. Implementation

Single-phase implementation targeting the `tls13` circuit — the only circuit needed for trustless general HTTPS data.

1. `lib/zktls.js` — BN254 BigInt, Groth16 prover, R1CS for tls13, witness gen, verifier loader, public API
2. `lib/zktls.zig` — BN254 field tower + Groth16 verifier (Zig → WASM)
3. `src/pen.js` — opcode `0xC5` in `scanpolicy` + `applypolicy`
4. `src/put.js` — `opt.tls` auto-prove and `msg.put["~z"]` attachment
5. `lib/builder/zktls.js` — build script (zig → wasm, embeds vk.json)
6. `package.json` — `buildZKTLS`, `zktls:setup`, `testZKTLS` scripts
7. `test/zktls.js` — round-trip tests for prove + verify
