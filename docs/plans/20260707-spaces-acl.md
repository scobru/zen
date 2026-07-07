# Spaces & ACL Layer — Implementation Plan

**Status:** Plan / Approved direction
**Date:** 2026-07-07
**Depends on:** `docs/research/ownership.md` (fraud-proof anti-fork model), PEN (ch07), Certify (ch04)
**Consumer:** linda "Spaces" app (see `scobru/linda` → `docs/plans/20260707-spaces-app.md`)

---

## 1. Goal

Give ZEN an access-control layer functionally equivalent to any-sync's Space ACL
(anyproto), built entirely on ZEN's existing primitives:

- **Multi-member Spaces** with roles: `owner` / `admin` / `editor` / `viewer`
- **E2E encryption**: all Space content encrypted with a symmetric **read key**,
  sealed per-member via ECDH
- **Membership lifecycle**: invite → join → grant → revoke, with **read-key
  rotation** on revoke
- **Anti-fork ordering** of the ACL chain via the fraud-proof model already
  designed in `ownership.md` (1-of-N honest watcher), instead of any-sync's
  consensus nodes

### Non-goals

- Wire compatibility with any-sync networks (they use Ed25519/X25519; we use
  secp256k1/P-256). We implement an *equivalent* protocol, not an interoperable one.
- Sequence CRDTs for rich text (app-layer concern; LWW-per-block is accepted).
- Storage incentives for fraud evidence (open problem, ownership.md §10.7).

---

## 2. Primitives already available (verified in source)

| Need | ZEN primitive | File |
|---|---|---|
| Per-member key agreement | `secret(peerPub, myPair)` → ECDH shared secret | `src/secret.js` |
| Symmetric encryption | AES-GCM with derived key + salt/iv | `src/encrypt.js`, `src/decrypt.js` |
| Signed grants w/ expiry, multi-certificant, ban | Certify | `src/certify.js` |
| Deterministic / additive key derivation | `pair({seed, priv/pub})` | `src/pair.js` |
| Signer recovery | `recover` | `src/recover.js` |
| Write-once souls, policy enforcement | PEN | `src/pen.js`, `docs/pen/*` |
| Time-windowed writes, soul factories | ZACP | `docs/pen/08_zacp.md` |
| Anti-fork design | fraud proofs, burn rule, challenge period T | `docs/research/ownership.md` |

What's missing is **composition + lifecycle**, not cryptography.

---

## 3. Soul layout

```
space/<sid>/meta                     → { name, createdAt, genesisHash } (signed by owner)
space/<sid>/acl/chain/<hash>        → ACL records, hash-linked, write-once (PEN)
space/<sid>/acl/head                → hash of latest finalized ACL record
space/<sid>/acl/burned              → fraud evidence if the ACL chain forked
space/<sid>/keys/<kid>/<memberPub>  → read key #kid sealed to memberPub
space/<sid>/obj/**                  → content, encrypted with current read key
```

`<sid>` is content-addressed: `sid = hash(genesis ACL record)` — globally unique,
no naming authority (same choice as ownership.md §10.6).

## 4. ACL record format

Each record is a ZEN signed value (same envelope as ownership.md §4.2):

```js
const record = await ZEN.sign({
  op:   "create" | "invite" | "join" | "grant" | "revoke" | "rotate",
  prev: prevRecordHash,        // hash-links the chain (null for genesis)
  sid:  spaceId,
  t:    ZEN.state(),
  // op-specific fields:
  who:  memberPub,             // grant/revoke target
  role: "owner"|"admin"|"editor"|"viewer",
  kid:  readKeyId,             // rotate: new key generation id
  inv:  invitePub,             // invite: ephemeral invite key
}, signerPair);
```

Validity rules (enforced by PEN + verifier):

1. Genesis (`op:create`, `prev:null`) — signer becomes `owner`.
2. Every other record's signer must hold a role that permits the op
   (permission matrix below) **at the state reached by replaying the chain up
   to `prev`**.
3. Soul key must equal `hash(record)` and must not already exist (write-once).
4. Two records with the same `prev` = fork → freeze + burn evidence
   (ownership.md §7.3 policy, verbatim reuse).

### Permission matrix

| op | owner | admin | editor | viewer |
|---|---|---|---|---|
| invite / grant(≤editor) / revoke(≤editor) | ✓ | ✓ | — | — |
| grant(admin) / revoke(admin) | ✓ | — | — | — |
| rotate | ✓ | ✓ | — | — |
| write `obj/**` | ✓ | ✓ | ✓ | — |
| read (holds sealed key) | ✓ | ✓ | ✓ | ✓ |

## 5. Read-key lifecycle (keyring)

- **Genesis:** owner generates random 32-byte `readKey[0]`, seals it to self:
  `sealed = encrypt(readKey, { priv: await secret(memberPub, ownerPair) })`
  stored at `space/<sid>/keys/0/<ownerPub>`.
- **Add member:** an admin+ seals the *current* read key to the new member's pub.
- **Revoke:** admin+ generates `readKey[kid+1]`, appends `op:rotate` record,
  re-seals the new key to every remaining member. The revoked member keeps the
  ability to read history up to `kid` (same guarantee any-sync gives) but
  nothing written after rotation.
- **Content:** every value under `obj/**` is `encrypt(value, readKey[kid])`
  prefixed with `kid` so readers pick the right key from their keyring.
- Old sealed keys are never deleted (history stays readable for members).

## 6. Anti-fork: binding to ownership.md

The ACL chain is exactly an "item micro-chain" in ownership.md terms, where the
"item" is *control of the Space*. We reuse:

- **Write-once chain souls** keyed by record hash (PEN policy §7.1)
- **`head` update policy** = `current` pointer policy (§7.2): only after
  challenge period T, only if no sibling fork
- **Self-evident burn** (§7.3): two records with same `prev` signed by the same
  signer → anyone can write the burn evidence; PEN verifies it cryptographically
- **Two-phase finalization** with active peer polling during T (§5.2)

Divergence from any-sync, stated honestly: any-sync gets *strong, immediate*
ACL ordering from consensus nodes; we get *optimistic* ordering with finality
after T under a 1-of-N honest watcher assumption. For membership changes a
finality window of 60–600 s is acceptable; the app treats `grant`/`revoke` as
"pending" until finalized.

**Fork by non-signer note:** ownership.md's burn rule requires both fork
branches signed by the *same* key. In an ACL, two *different* admins can
innocently append concurrent records with the same `prev` (a race, not fraud).
Resolution: deterministic tie-break (lower record hash wins, loser re-appends
on top of winner). Burn applies only to same-signer forks. This rule must be in
the PEN head-update policy.

## 7. Public API (new `lib/space.js` + `lib/acl.js`)

```js
const sp = await ZEN.space.create(ownerPair, { name })        // → { sid }
const inv = await ZEN.space.invite(sid, adminPair)            // → invite link/key
await ZEN.space.join(sid, inv, myPair)                        // join request
await ZEN.space.grant(sid, memberPub, "editor", adminPair)    // seals read key too
await ZEN.space.revoke(sid, memberPub, adminPair)             // rotates read key
await ZEN.space.put(sid, path, value, memberPair)             // encrypt + write
await ZEN.space.get(sid, path, memberPair)                    // read + decrypt
ZEN.space.members(sid)                                        // replay ACL → roster
ZEN.space.role(sid, pub)                                      // → role | null
```

## 8. Work breakdown

### M0 — Chain core (~1–2 weeks)
- [ ] `lib/acl.js`: record create/verify, chain replay → roster, permission matrix
- [ ] PEN policies: `acl/chain/*` write-once + signer-role check; `acl/burned` self-evident
- [ ] Unit tests: replay, permission matrix, fork detection, same-signer burn vs race tie-break

### M1 — Keyring (~1 week)
- [ ] `lib/keyring.js`: generate, seal (ECDH+AES-GCM), unseal, rotate, kid-prefixed content encryption
- [ ] Tests: member add/revoke/rotation, revoked member cannot read post-rotation writes

### M2 — Finalization & network (~2 weeks, depends on ownership.md Phase 0)
- [ ] `head` two-phase finalization with active peer polling during T
- [ ] `ZEN.space.*` facade wiring acl + keyring + finalization
- [ ] PANIC-style multi-peer tests: concurrent grants race, revoke-vs-write race, eclipse simulation

### M3 — Hardening (~1 week)
- [ ] Invite flow (ephemeral invite key, join request, approval)
- [ ] Docs chapter (`docs/ch11-spaces.md`), examples
- [ ] Fuzz ACL verifier with malformed/replayed records

## 9. Open questions

1. **T for ACL ops** — same 60–600 s guidance as ownership.md; needs calibration tooling (Phase 0 there).
2. **Viewer proof-of-membership** — viewers hold sealed keys but write nothing; is presence in keyring soul enough, or do they need a `join` record? (Leaning: `join` record required, keeps roster in one place.)
3. **TPRE alternative sealing** — linda already ships Umbral TPRE (`ThresholdService`); protocol stays ECDH-only (no new deps in zen), app may layer TPRE on top.
4. **Relay assistance** — should relays run the finalization watcher by default? (Leaning: yes, opt-in flag.)
