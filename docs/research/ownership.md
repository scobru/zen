# Trustless Ownership & Transfer on ZEN

**Status:** Research / Design Phase  
**Date:** 2026-04-20  
**Author:** ZEN Core Team

---

## 1. Problem Statement

Most distributed systems fail at one deceptively simple task: **proving that exactly one entity owns exactly one thing, and that ownership can change hands without a trusted intermediary.**

Blockchains solve this, but they do so by introducing global consensus — miners, validators, stakers, a shared ledger that every participant must agree on. The cost is enormous: energy, latency, validator centralization, and a single point of regulatory or technical failure.

ZEN's goal is different: **local-first, peer-to-peer, no special roles, no validators, no global state.** Can trustless ownership work inside this model?

This document argues: **yes, with a different set of trade-offs that are more honest and more practical than blockchain alternatives.**

---

## 2. Why This Is Hard

### 2.1 The Double-Spend Problem

Alice owns a sword. She wants to give it to Bob. The naive approach:

```
Alice writes: sword.owner = "bob"
```

But Alice can also write:

```
Alice writes: sword.owner = "carol"
```

In a distributed system, different peers may see different writes first. CRDT (last-write-wins) resolves this by taking the higher timestamp — but Alice controls her own timestamps. She can write both with the same timestamp, or forge a later one. **CRDT cannot solve ownership.**

### 2.2 FLP Impossibility

Fischer, Lynch, and Paterson (1985) proved: **no deterministic algorithm can achieve consensus in an asynchronous network if even one process can fail.**

This means there is no perfect solution. Every ownership system is a compromise:

| Approach | What you sacrifice |
|---|---|
| Blockchain (PoW/PoS) | Decentralization, energy, speed |
| BFT (Tendermint, PBFT) | ≥2/3 honest validators required |
| Notary | Single point of trust/failure |
| Hashgraph | In-house peers, permissioned gossip |
| **Fraud-proof + challenge period** | **Latency (must wait for window)** |

The last row is what ZEN can implement. We sacrifice **finality latency** (you must wait T seconds before transfer is confirmed), not decentralization or trust assumptions.

### 2.3 Off-Chain Payment is Unsolvable

If Bob pays Alice with fiat/crypto *outside* ZEN, and Alice then transfers the item *inside* ZEN — this is the **Two Generals Problem**. There is no protocol that atomically links an off-chain payment to an on-chain asset transfer without a trusted third party.

**ZEN does not claim to solve this.** It solves the *on-chain* half: proving who owns what inside the ZEN graph, without validators or global consensus.

---

## 3. Core Design: Optimistic Ownership with Fraud Proofs

### 3.1 Mental Model

Borrow from **Optimistic Rollups** (Arbitrum, Optimism), but without needing an L1 chain underneath:

> **Assume all transfers are valid. If fraud is detected during a challenge window, the fraudulent transfer is self-invalidating. After the window closes with no challenge, the transfer is final.**

No validators needed. No global agreement needed. Fraud proofs are pure cryptography — anyone can verify, no one has a special role.

### 3.2 The Three Rules

**Rule 1: Write-once claims**  
Each transfer claim is written to a unique soul derived from its signature hash. A claim, once written, cannot be overwritten (PEN enforces this). This is the foundation of fraud detection.

**Rule 2: Fork = burn**  
If two claims exist from the same previous owner pointing to different successors, the item is permanently burned. No winner. Both lose. This creates a **strong economic disincentive** against double-spending — the attacker loses the item too.

**Rule 3: Challenge period**  
A transfer is "pending" for T seconds (e.g., 60 seconds on LAN, 300 seconds on wide-area P2P). During this window, any honest peer can detect a fork and broadcast fraud evidence. After T with no fork detected, the transfer is final.

---

## 4. Data Structure

### 4.1 Soul Layout

```
item/<id>/current       → hash of the most recent valid transfer step
item/<id>/chain/<hash>  → individual transfer steps (append-only)
item/<id>/burned        → fraud evidence (if double-spend detected)
```

### 4.2 Transfer Step Format

Each step is a ZEN signed value:

```js
const step = await ZEN.sign({
    to: newOwner.pub,         // recipient's public key
    prev: prevStepHash,       // hash of previous step (links the chain)
    t: ZEN.state(),           // HAM timestamp
    item: itemId,             // which item
}, currentOwner);             // signed by current owner's keypair
```

After `ZEN.sign`, the value looks like:

```json
{
    ":": "{\"to\":\"...\",\"prev\":\"...\",\"t\":...,\"item\":\"...\"}",
    "~": "v1:r:s",
    "_": {}
}
```

No `"*"` field. Signer identity is recovered via `ZEN.recover(step)`.

### 4.3 Genesis (Item Creation)

```js
// Alice creates an item she owns
const genesis = await ZEN.sign({
    to: alice.pub,
    prev: null,
    t: ZEN.state(),
    item: itemId,
}, alice);

await zen.get(`item/${itemId}/chain/${hashOf(genesis)}`).put(genesis, alice);
await zen.get(`item/${itemId}/current`).put(hashOf(genesis), alice);
```

The item now exists in a neutral soul. Alice's namespace is not required. Alice is the owner by virtue of being the genesis signer — not by having a special flag.

---

## 5. Transfer Protocol

### 5.1 Alice Transfers to Bob (Bob Offline)

```js
async function transfer(itemId, fromPair, toPub) {
    const currentHash = await zen.get(`item/${itemId}/current`).then();
    const currentStep = await zen.get(`item/${itemId}/chain/${currentHash}`).then();

    // Alice signs a new step
    const newStep = await ZEN.sign({
        to: toPub,
        prev: currentHash,
        t: ZEN.state(),
        item: itemId,
    }, fromPair);

    const newHash = hashOf(newStep);

    // Write-once: PEN rejects if this hash already exists
    await zen.get(`item/${itemId}/chain/${newHash}`).put(newStep, fromPair);

    // Bob does NOT need to be online. Transfer is complete on Alice's side.
    // Bob reads item/${itemId}/current after challenge period to confirm.
}
```

**Bob is completely passive.** He comes online 10 minutes, 10 days, or 10 months later and reads the current pointer. If the challenge period has passed and no fork exists, he is the confirmed owner.

### 5.2 Challenge Period and Finalization

```js
async function finalizeTransfer(itemId, pendingHash) {
    const step = await zen.get(`item/${itemId}/chain/${pendingHash}`).then();
    const { prev, t } = JSON.parse(step[":"]);

    // Check challenge period has passed
    if (ZEN.state() - t < CHALLENGE_PERIOD_MS) {
        throw new Error("Transfer still pending");
    }

    // Check for forks: any other step pointing to the same prev?
    const allSteps = await zen.get(`item/${itemId}/chain`).map().then();
    const conflicts = Object.values(allSteps).filter(s => {
        const m = JSON.parse(s[":"]);
        return m.prev === prev && hashOf(s) !== pendingHash;
    });

    if (conflicts.length > 0) {
        // Fork detected → burn
        await zen.get(`item/${itemId}/burned`).put({
            reason: "double-spend",
            evidence: [pendingHash, hashOf(conflicts[0])],
        });
        return { status: "burned" };
    }

    // No conflicts → update current pointer
    await zen.get(`item/${itemId}/current`).put(pendingHash);
    return { status: "confirmed", owner: JSON.parse(step[":"]).to };
}
```

### 5.3 Who Runs Finalization?

There is no special role. Anyone can run `finalizeTransfer`:

- **Bob**, when he comes online and wants to confirm he's the owner
- **Any peer** watching the network (automated watchers)
- **Alice herself**, to complete the transfer she initiated
- **A background process** in a ZEN relay node

This is the optimistic rollup pattern: you don't need anyone in particular to finalize — you just need *someone* to eventually do it, and the math guarantees they'll arrive at the same answer.

---

## 6. Storage Strategy: O(1) Long-Term

### 6.1 The Chain Growth Problem

Naive implementation: every transfer appends to the chain. After 1,000 transfers, the chain has 1,000 entries. Verification requires reading all 1,000. **This does not scale.**

### 6.2 Key Insight: Only the Leaf Can Fork

Once a transfer step has been finalized (challenge period passed, no conflicts), it **cannot be disputed**. Fraud can only happen at the **current pending step** (the leaf). Historical steps are immutable facts.

This means:

- To verify ownership: read `current` pointer → read that one step → check challenge period → check siblings for conflicts. **O(1).**
- The rest of the chain is audit trail only.

### 6.3 Lazy Pruning by Sender

When Bob transfers to Carol, he prunes the history:

```js
async function transferWithPrune(itemId, fromPair, toPub) {
    const currentHash = await zen.get(`item/${itemId}/current`).then();
    const currentStep = await zen.get(`item/${itemId}/chain/${currentHash}`).then();
    const { prev: grandparentHash } = JSON.parse(currentStep[":"]);

    // Create new step
    const newStep = await ZEN.sign({ to: toPub, prev: currentHash, ... }, fromPair);
    await zen.get(`item/${itemId}/chain/${hashOf(newStep)}`).put(newStep, fromPair);

    // Prune grandparent (no longer needed for fraud detection)
    if (grandparentHash) {
        await zen.get(`item/${itemId}/chain/${grandparentHash}`).put(null, fromPair);
    }
}
```

**Storage invariant:**

| State | Chain entries | Reason |
|---|---|---|
| Idle (owner holds item) | 1 | Only current step |
| Transfer in progress | 2 | Current + pending |
| After finalization | 1 again | Current only |
| Dispute (double-spend) | 2 + burned flag | Evidence preserved |

Long-term storage is **O(1) per item**, regardless of transfer history.

### 6.4 "Re-confirm" for Holders Who Never Transfer

If Bob holds an item forever and never transfers, his step stays. If he wants to clean up the chain without transferring:

```js
// Bob re-signs his ownership, pruning the incoming step from Alice
const reconfirm = await ZEN.sign({
    to: bob.pub,        // same owner
    prev: currentHash,  // same prev
    t: ZEN.state(),     // new timestamp
    item: itemId,
    action: "reconfirm",
}, bob);
// This prunes the step that Alice created
```

After challenge period, `reconfirm` becomes current. Alice's step gets pruned. **Chain resets to depth 1.**

---

## 7. PEN Policy Enforcement

PEN (ZEN's WASM policy engine) enforces the write rules at the protocol level. No application code can bypass these rules.

### 7.1 Policy for `item/<id>/chain/<hash>`

```
POLICY chain-write:
  1. Input: new step S, writer W
  2. Recover signer: pub = recover(S) 
  3. Get current step C = graph[item/id/current]
  4. If C is null (genesis):
       Accept only if signer matches genesis conditions
  5. Else:
       current_owner = JSON.parse(C).to
       Assert pub === current_owner        // only owner can transfer
  6. Compute expected_hash = hash(S)
  7. Assert soul_key === expected_hash     // write-once (hash is the key)
  8. Assert soul does not exist yet       // truly write-once
  9. Accept.
```

### 7.2 Policy for `item/<id>/current`

```
POLICY current-update:
  1. Input: new hash H, writer W
  2. Get step S = graph[item/id/chain/H]
  3. Assert S exists
  4. Recover step signer: pub = recover(S)
  5. Get previous current step PC = graph[item/id/chain/current_pointer]
  6. Assert JSON.parse(PC).to === pub     // updater is the step's signer (previous owner)
     OR Assert JSON.parse(PC).to === W   // or the new owner finalizing their own receipt
  7. Check challenge period passed
  8. Check no sibling forks exist
  9. Accept.
```

---

## 8. Attack Analysis

### 8.1 Double-Spend (Fork Attack)

**Attack:** Alice sends item to Bob via chain step A, then also sends to Carol via chain step B. Both reference the same `prev`.

**Defense:**
- Both A and B are write-once. Both get written to the graph (different hash keys).
- Any peer who syncs both detects the fork.
- Fork detection triggers burn. Alice loses the item. Bob and Carol get nothing.
- **Economic outcome:** Alice lost the item she was trying to steal. Strong disincentive.

**Residual risk:** Before sync (partition), Bob and Carol each believe they own it. After sync resolves, both discover the truth. Burn is then finalized.

### 8.2 Eclipse Attack

**Attack:** Alice controls Bob's peers during the transfer. She ensures Bob only sees "fork A" (transfer to Carol), not "fork B" (transfer to himself). After T seconds, Alice's preferred fork gets finalized while Bob's fork is isolated.

**Defense:** After partition heals, the burn rule still applies retroactively. The `current` pointer update requires passing conflict checks. If both forks exist in the merged graph, `current` update is rejected and burn is triggered.

**Residual risk:** If Alice can maintain the eclipse **permanently**, she can prevent Bob's fork from ever reaching other peers, and Carol's fork gets finalized. This is a network-layer attack, not a protocol-layer attack. Mitigation: use multiple diverse peer connections, onion routing, etc.

### 8.3 Grief Attack

**Attack:** Alice deliberately creates two conflicting transfers to burn her own item (out of spite, to deny Bob after Bob paid off-chain, etc.).

**Defense:** The protocol cannot prevent this. If Alice is willing to destroy the item, she can. This is the Two Generals Problem — off-chain payment is not atomically linked to on-chain transfer.

**Mitigation:** HTLC (Hash Time-Locked Contracts) for on-chain payment coordination (see §10).

### 8.4 Timestamp Manipulation

**Attack:** Alice creates a step with a fake future timestamp to extend or shrink the challenge period.

**Defense:** HAM (ZEN's CRDT) handles timestamp conflicts by taking the higher value. A future timestamp doesn't help Alice — it just means her step's challenge period starts later. A past timestamp would be overridden by HAM.

**Residual risk:** Skewed clocks in a network can cause minor finality variations (e.g., ±30 seconds). Challenge period T should be large enough to absorb clock skew.

### 8.5 Replay Attack

**Attack:** Alice keeps a copy of an old signed step from a previous transfer and replays it to reclaim the item.

**Defense:** Each step contains `prev: prevHash`. A replay of an old step would have the wrong `prev` (pointing to an old state that no longer matches `current`). The PEN policy rejects steps whose `prev` doesn't match the current pointer.

---

## 9. Comparison to Blockchain

This design reuses blockchain's foundational data structure (hash chain) but differs at every level of the stack:

| Property | Bitcoin/Ethereum | ZEN Ownership |
|---|---|---|
| **Data structure** | Hash chain | Hash chain |
| **Scope** | Global ledger (all txns) | Per-item micro-chain |
| **Consensus** | PoW / PoS (global agreement) | None — fraud proofs only |
| **Validators** | Miners / stakers | No special roles |
| **Finality** | Probabilistic (depth) | Deterministic after T |
| **History** | Immutable forever | Prunable (O(1) long-term) |
| **Global clock** | Block height | Not required |
| **Throughput** | ~7-30 TPS (global) | Parallel per item |
| **Trust model** | ≥51% honest | Any single honest peer |

**Closest analog:** Optimistic Rollups (Arbitrum, Optimism), but without requiring an L1 chain. ZEN is its own settlement layer.

**Also similar to:** Nano's bilateral block lattice (each account has its own chain), but without requiring the receiver to publish a "receive block."

---

## 10. Open Problems

### 10.1 Off-Chain Payment Atomicity (HTLC)

For atomic "Bob pays Alice, Alice transfers item" without trust:

**Hash Time-Locked Contract on ZEN:**

```
Alice creates:
  item/<id>/chain/<hash_A> = transfer to Bob,
  BUT with condition: only valid if Bob publishes preimage R
  where H(R) = agreed_hash

Bob creates (after seeing Alice's conditional transfer):
  payment/<payment_id> = payment to Alice,
  BUT with condition: only valid if Alice publishes preimage R

Alice reveals R → both conditions unlock atomically.
```

ZEN's PEN can implement the conditional logic. The challenge: **timing race.** If Alice reveals R just before T expires and Bob's payment times out, Alice gets the preimage credit but Bob's payment has already expired. This requires careful T alignment.

**Further research needed:** VDF (Verifiable Delay Function) to provide a provable time gap that prevents timing races.

### 10.2 Privacy

All ownership data is public in the current design. Anyone reading the ZEN graph can see:
- Who owns what item
- Full transfer history (even with pruning, current owner is visible)

**Approaches to explore:**
- **Stealth addresses:** recipient generates a one-time address; only recipient knows they own it
- **ZK proofs of ownership:** prove you own item X without revealing your public key
- **Encrypted item souls:** item data encrypted with owner's key; ownership proof is separate

### 10.3 Multi-Owner / Threshold Ownership

The current design assumes single-key ownership. Multi-sig ownership (e.g., item owned by 2-of-3 keys):

- Transfer requires M-of-N signatures on the new step
- ZEN's multi-sig primitives (if built) can verify the threshold
- Challenge period is same; burn rule is same

**Further research needed:** how to represent M-of-N in the step format, and how PEN policy verifies threshold signatures.

### 10.4 Rentals and Temporary Delegation

Alice owns item but wants to let Bob use it for 7 days:

```js
const rental = await ZEN.sign({
    type: "rental",
    to: bob.pub,
    expires: ZEN.state() + 7 * 24 * 3600 * 1000,
    item: itemId,
}, alice);
```

Bob can prove rental (not ownership) to third parties. After expiry, rental is void — but Alice still has the permanent transfer step. **No new step needed.**

PEN can enforce rental-specific policies (e.g., renter cannot sub-transfer, rental expires, etc.).

### 10.5 Chain Compaction via ZK Accumulators

If audit trail must be preserved (regulatory, provenance) but chain still needs to be O(1) verifiable:

**ZK accumulator approach:**
- Maintain a Merkle root of all historical steps
- Current owner provides a Merkle proof of their step
- Verification: check Merkle proof → O(log N), not O(N)

This requires ZK proof infrastructure that ZEN does not currently have. Long-term research direction.

### 10.6 Item Namespacing and Discovery

Current design: item souls are `item/<id>/...`. Who names the ID? Who discovers items?

- **Creator names:** Alice creates `item/alice-sword-001/...`
- **Content-addressed:** item ID = hash of genesis step (globally unique, no coordination)
- **Registry soul:** a discovery layer at `registry/<category>/<id>` pointing to items

Content-addressing is the most trustless: `item/<hash_of_genesis>/...` — no naming conflicts possible, globally unique by construction.

---

## 11. Implementation Roadmap

### Phase 1: Core Protocol (Proof of Concept)
- [ ] `ZEN.item.create(pair, metadata)` — genesis step
- [ ] `ZEN.item.transfer(itemId, fromPair, toPub)` — transfer step
- [ ] `ZEN.item.owner(itemId)` — verify current owner
- [ ] `ZEN.item.finalize(itemId, hash)` — promote pending to current
- [ ] Basic PEN policy for `chain/*` (write-once, signer check)

### Phase 2: Fraud Detection
- [ ] `ZEN.item.watch(itemId, cb)` — watch for forks
- [ ] Automatic burn on fork detection
- [ ] `ZEN.item.status(itemId)` — `pending | confirmed | burned`
- [ ] Peer broadcasting of fraud evidence

### Phase 3: Ergonomics
- [ ] `ZEN.item.transfer(itemId, fromPair, toPub, { prune: true })` — transfer + prune
- [ ] `ZEN.item.reconfirm(itemId, pair)` — reconfirm + prune without transfer
- [ ] Chain explorer utility

### Phase 4: Advanced
- [ ] Rental / temporary delegation
- [ ] Multi-sig ownership
- [ ] HTLC for atomic payment-transfer
- [ ] Stealth address recipient

---

## 12. Summary

ZEN can implement trustless ownership transfer without blockchain, validators, or global consensus. The design:

1. **Uses ZEN's native primitives**: `ZEN.sign`, `ZEN.recover`, HAM CRDT, PEN policies
2. **Fraud proofs replace consensus**: double-spend is self-detecting and self-punishing
3. **Bob never needs to be online to receive**: transfer is one-sided (Alice signs, Bob reads later)
4. **O(1) storage long-term**: lazy pruning by sender keeps chain at depth 1-2
5. **O(1) verification**: only the leaf of the chain matters; history is confirmed and irrelevant

The only honest trade-off: **finality latency** (challenge period T). This is unavoidable in any trustless system — FLP impossibility ensures no faster deterministic solution exists in an asynchronous network.

This trade-off is **more honest** than blockchain's trade-offs (validator centralization, energy, PoS stake requirements). For most real-world use cases (game items, digital collectibles, access rights, certificates), a 60-300 second finality window is entirely acceptable.

---

*Next: implement Phase 1 as a standalone `lib/item.js` module and validate against the PANIC test suite.*
