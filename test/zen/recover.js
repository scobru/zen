// zen.recover — TDD tests (written before implementation)
// zen.recover(sig) takes a signature produced by zen.sign (new format with v)
// and returns the pub key of the signer — without needing to supply pub.
import assert from "assert";
import ZEN from "../../zen.js";

describe("ZEN.recover — basic", function () {
  this.timeout(20 * 1000);

  it("ZEN.recover is a function", function () {
    assert.strictEqual(typeof ZEN.recover, "function");
  });

  it("recover returns the signer pub", async function () {
    const pair = await ZEN.pair();
    const sig = await ZEN.sign("hello", pair);
    const pub = await ZEN.recover(sig);
    assert.strictEqual(pub, pair.pub);
  });

  it("recovered pub is 45-char base62 compressed", async function () {
    const pair = await ZEN.pair();
    const sig = await ZEN.sign("test", pair);
    const pub = await ZEN.recover(sig);
    assert.match(pub, /^[A-Za-z0-9]{44}[01]$/, "pub must be 45-char compressed");
  });

  it("sign output now includes v field (0 or 1)", async function () {
    const pair = await ZEN.pair();
    const sig = await ZEN.sign("data", pair);
    const parsed = JSON.parse(sig);
    assert.ok(parsed.v === 0 || parsed.v === 1, "v must be 0 or 1");
  });

  it("recover is deterministic — same sig same pub", async function () {
    const pair = await ZEN.pair();
    const sig = await ZEN.sign("stable", pair);
    const pub1 = await ZEN.recover(sig);
    const pub2 = await ZEN.recover(sig);
    assert.strictEqual(pub1, pub2);
  });
});

describe("ZEN.recover — cross-check with verify", function () {
  this.timeout(20 * 1000);

  it("verify still works alongside recover (backward compat)", async function () {
    const pair = await ZEN.pair();
    const sig = await ZEN.sign("cross check", pair);
    const recovered = await ZEN.recover(sig);
    const verified = await ZEN.verify(sig, recovered);
    assert.strictEqual(verified, "cross check");
  });

  it("alice and bob produce different recovered pubs", async function () {
    const alice = await ZEN.pair();
    const bob = await ZEN.pair();
    const sigA = await ZEN.sign("msg", alice);
    const sigB = await ZEN.sign("msg", bob);
    const pubA = await ZEN.recover(sigA);
    const pubB = await ZEN.recover(sigB);
    assert.strictEqual(pubA, alice.pub);
    assert.strictEqual(pubB, bob.pub);
    assert.notStrictEqual(pubA, pubB);
  });
});

describe("ZEN.recover — JS types", function () {
  this.timeout(20 * 1000);

  var cases = [null, true, false, 0, 1, "hello", { a: 1 }, [1, 2]];

  cases.forEach(function (val) {
    it("recover works for " + JSON.stringify(val), async function () {
      const pair = await ZEN.pair();
      const sig = await ZEN.sign(val, pair);
      const pub = await ZEN.recover(sig);
      assert.strictEqual(pub, pair.pub);
    });
  });
});

describe("ZEN.recover — error cases", function () {
  this.timeout(10 * 1000);

  it("throws (or returns undefined via cb) when v is missing", async function () {
    const pair = await ZEN.pair();
    const sig = await ZEN.sign("data", pair);
    const parsed = JSON.parse(sig);
    delete parsed.v;
    const stripped = JSON.stringify(parsed);
    await assert.rejects(
      ZEN.recover(stripped),
      /recovery bit|v/i,
    );
  });

  it("tampered sig recovers a different (wrong) pub", async function () {
    const pair = await ZEN.pair();
    const sig = await ZEN.sign("original", pair);
    const parsed = JSON.parse(sig);
    // Flip one byte in the base64 sig
    const bytes = Buffer.from(parsed.s, "base64");
    bytes[0] ^= 0xff;
    parsed.s = bytes.toString("base64");
    // Recovery may succeed but should return a different (wrong) public key
    let result;
    try {
      result = await ZEN.recover(JSON.stringify(parsed));
    } catch (e) {
      // Throwing is also acceptable
      return;
    }
    assert.notStrictEqual(result, pair.pub);
  });

  it("recover returns undefined via callback on error", function (done) {
    ZEN.recover("not-a-sig", function (pub) {
      assert.strictEqual(pub, undefined);
      done();
    });
  });
});

describe("ZEN.recover — P-256 curve", function () {
  this.timeout(20 * 1000);

  it("recover works for P-256 pair", async function () {
    const pair = await ZEN.pair(null, { curve: "p256" });
    const sig = await ZEN.sign("p256 test", pair);
    const pub = await ZEN.recover(sig);
    assert.strictEqual(pub, pair.pub);
  });

  it("cross-curve: p256 sig forced to recover with secp256k1 gives wrong pub or throws", async function () {
    const pair = await ZEN.pair(null, { curve: "p256" });
    const sig = await ZEN.sign("cross curve test", pair);
    // Strip the c field to force secp256k1 recovery
    const parsed = JSON.parse(sig);
    delete parsed.c;
    let result;
    try {
      result = await ZEN.recover(JSON.stringify(parsed));
    } catch (e) {
      return;
    }
    assert.notStrictEqual(result, pair.pub);
  });

  it("cross-curve: secp256k1 sig forced to recover with p256 gives wrong pub or throws", async function () {
    const pair = await ZEN.pair(); // secp256k1
    const sig = await ZEN.sign("cross curve test", pair);
    // Force curve to p256 by injecting c field
    const parsed = JSON.parse(sig);
    parsed.c = "p256";
    let result;
    try {
      result = await ZEN.recover(JSON.stringify(parsed));
    } catch (e) {
      // Throwing is acceptable — wrong curve, wrong curve constants
      return;
    }
    // If it doesn't throw, it must return a different (wrong) pub
    assert.notStrictEqual(result, pair.pub);
  });
});

describe("ZEN instance — recover method", function () {
  it("zen.recover mirrors ZEN.recover", async function () {
    const zen = new ZEN({ peers: [] });
    const pair = await ZEN.pair();
    const sig = await ZEN.sign("instance test", pair);
    const pub = await zen.recover(sig);
    assert.strictEqual(pub, pair.pub);
  });
});
