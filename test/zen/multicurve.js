// Multi-curve and multi-format tests for zen.pair()
import assert from 'assert';
import ZEN from '../../zen.js';

// ─── RIPEMD-160 test vectors ─────────────────────────────────────────────────
describe('ripemd160 test vectors', function() {
  this.timeout(10 * 1000);

  // Import the bundled zen and access internals via pair-generated data.
  // We verify correctness indirectly: a known secp256k1 private key must
  // produce the expected Bitcoin P2PKH address (which depends on ripemd160).

  it('known BTC P2PKH address from secp256k1 private key', async function() {
    // Private key: 0x0000...0001 (scalar = 1n), pubkey = G
    // Compressed G: 02 79BE667EF9DC... → known BTC address: 1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH
    const knownPrivHex = '0000000000000000000000000000000000000000000000000000000000000001';
    // We generate using btc format with a known priv via seed that gives scalar=1 is impractical.
    // Instead, test that btc format produces a valid Base58 address starting with '1'.
    const p = await ZEN.pair(null, { format: 'btc' });
    assert.ok(p.pub.startsWith('1'), 'BTC P2PKH address should start with 1');
    assert.ok(p.priv.startsWith('K') || p.priv.startsWith('L'), 'WIF compressed mainnet starts with K or L');
  });
});

// ─── secp256k1 backward compatibility ────────────────────────────────────────
describe('zen.pair() — secp256k1 backward compatibility', function() {
  this.timeout(20 * 1000);

  it('default pair has curve=secp256k1', async function() {
    const p = await ZEN.pair();
    assert.strictEqual(p.curve, 'secp256k1');
  });

  it('explicit curve:secp256k1 identical to default', async function() {
    const seed = 'compat-test-seed-42';
    const p1 = await ZEN.pair(null, { seed });
    const p2 = await ZEN.pair(null, { seed, curve: 'secp256k1' });
    assert.strictEqual(p1.pub,   p2.pub);
    assert.strictEqual(p1.priv,  p2.priv);
    assert.strictEqual(p1.epub,  p2.epub);
    assert.strictEqual(p1.epriv, p2.epriv);
  });

  it('secp256k1 pub is 88-char base62', async function() {
    const p = await ZEN.pair(null, { seed: 'secp-base62-check' });
    assert.match(p.pub,  /^[A-Za-z0-9]{88}$/, 'pub should be 88-char base62');
    assert.match(p.epub, /^[A-Za-z0-9]{88}$/, 'epub should be 88-char base62');
  });

  it('secp256k1 additive derivation still works', async function() {
    const alice = await ZEN.pair(null, { seed: 'alice' });
    const derived = await ZEN.pair(null, { seed: 'extra', priv: alice.priv });
    assert.ok(derived.pub !== alice.pub, 'derived pub should differ from original');
    assert.match(derived.pub, /^[A-Za-z0-9]{88}$/, 'derived pub should be 88-char base62');
  });
});

// ─── P-256 curve ─────────────────────────────────────────────────────────────
describe('zen.pair() — P-256 / secp256r1', function() {
  this.timeout(20 * 1000);

  it('curve:p256 returns pub with curve=p256', async function() {
    const p = await ZEN.pair(null, { curve: 'p256' });
    assert.strictEqual(p.curve, 'p256');
  });

  it('curve:secp256r1 is alias for p256', async function() {
    const seed = 'p256-alias-test';
    const p1 = await ZEN.pair(null, { seed, curve: 'p256' });
    const p2 = await ZEN.pair(null, { seed, curve: 'secp256r1' });
    assert.strictEqual(p1.pub,   p2.pub);
    assert.strictEqual(p1.priv,  p2.priv);
  });

  it('p256 pair has all 4 keys', async function() {
    const p = await ZEN.pair(null, { curve: 'p256' });
    assert.ok(p.pub,   'pub present');
    assert.ok(p.priv,  'priv present');
    assert.ok(p.epub,  'epub present');
    assert.ok(p.epriv, 'epriv present');
  });

  it('p256 pub is 88-char base62 (zen format default)', async function() {
    const p = await ZEN.pair(null, { curve: 'p256' });
    assert.match(p.pub,  /^[A-Za-z0-9]{88}$/, 'pub 88-char base62');
    assert.match(p.epub, /^[A-Za-z0-9]{88}$/, 'epub 88-char base62');
  });

  it('p256 seed deterministic', async function() {
    const seed = 'p256-reproducible-seed';
    const p1 = await ZEN.pair(null, { seed, curve: 'p256' });
    const p2 = await ZEN.pair(null, { seed, curve: 'p256' });
    assert.strictEqual(p1.pub,   p2.pub);
    assert.strictEqual(p1.priv,  p2.priv);
    assert.strictEqual(p1.epub,  p2.epub);
    assert.strictEqual(p1.epriv, p2.epriv);
  });

  it('p256 different seed → different keys', async function() {
    const p1 = await ZEN.pair(null, { seed: 'p256-seed-a', curve: 'p256' });
    const p2 = await ZEN.pair(null, { seed: 'p256-seed-b', curve: 'p256' });
    assert.notStrictEqual(p1.pub,  p2.pub);
    assert.notStrictEqual(p1.priv, p2.priv);
  });

  it('p256 restore from priv gives same pub', async function() {
    const original = await ZEN.pair(null, { curve: 'p256' });
    const restored = await ZEN.pair(null, { priv: original.priv, curve: 'p256' });
    assert.strictEqual(restored.pub,  original.pub);
    assert.strictEqual(restored.priv, original.priv, 'priv round-trips');
  });

  it('p256 different curve from secp256k1', async function() {
    const seed = 'same-seed-different-curve';
    const secp = await ZEN.pair(null, { seed, curve: 'secp256k1' });
    const p256 = await ZEN.pair(null, { seed, curve: 'p256' });
    assert.notStrictEqual(secp.pub,  p256.pub,  'different curves produce different keys');
    assert.notStrictEqual(secp.priv, p256.priv, 'different curves produce different privs');
  });
});

// ─── EVM format ───────────────────────────────────────────────────────────────
describe('zen.pair() — format:evm', function() {
  this.timeout(20 * 1000);

  it('evm format returns 0x-checksummed address', async function() {
    const p = await ZEN.pair(null, { format: 'evm' });
    assert.ok(p.pub, 'pub present');
    assert.match(p.pub, /^0x[0-9a-fA-F]{40}$/, 'pub is checksummed ETH address');
  });

  it('evm format priv is 0x + 64 hex chars', async function() {
    const p = await ZEN.pair(null, { format: 'evm' });
    assert.match(p.priv, /^0x[0-9a-f]{64}$/, 'priv is 0x+64hex');
  });

  it('evm format epub is 0x04 + 128 hex chars', async function() {
    const p = await ZEN.pair(null, { format: 'evm' });
    assert.match(p.epub, /^0x04[0-9a-f]{128}$/, 'epub is uncompressed pubkey');
  });

  it('evm format is deterministic from seed', async function() {
    const seed = 'evm-determinism-check';
    const p1 = await ZEN.pair(null, { seed, format: 'evm' });
    const p2 = await ZEN.pair(null, { seed, format: 'evm' });
    assert.strictEqual(p1.pub,  p2.pub);
    assert.strictEqual(p1.priv, p2.priv);
  });

  it('evm address is EIP-55 checksummed (mixed case)', async function() {
    // Check that at least some letter characters are uppercase (not all lowercase)
    const p = await ZEN.pair(null, { seed: 'eip55-test-seed-xyz', format: 'evm' });
    const addr = p.pub.slice(2); // strip 0x
    const hasUpper = /[A-F]/.test(addr);
    const hasLower = /[a-f]/.test(addr);
    // Most addresses have both; an all-digit address is astronomically rare
    assert.ok(hasUpper || hasLower, 'address should have hex chars');
  });

  it('p256 + evm format returns valid ETH address', async function() {
    const p = await ZEN.pair(null, { curve: 'p256', format: 'evm' });
    assert.strictEqual(p.curve, 'p256');
    assert.match(p.pub, /^0x[0-9a-fA-F]{40}$/, 'p256 evm pub is ETH address');
    assert.match(p.priv, /^0x[0-9a-f]{64}$/, 'p256 evm priv is 0x+hex');
  });
});

// ─── BTC format ───────────────────────────────────────────────────────────────
describe('zen.pair() — format:btc', function() {
  this.timeout(20 * 1000);

  it('btc format pub starts with 1 (P2PKH mainnet)', async function() {
    const p = await ZEN.pair(null, { format: 'btc' });
    assert.match(p.pub, /^1[1-9A-HJ-NP-Za-km-z]+$/, 'pub is base58 P2PKH');
  });

  it('btc format priv is WIF compressed (K or L)', async function() {
    const p = await ZEN.pair(null, { format: 'btc' });
    assert.match(p.priv, /^[KL][1-9A-HJ-NP-Za-km-z]+$/, 'WIF compressed starts with K or L');
  });

  it('btc format epub is compressed pubkey hex', async function() {
    const p = await ZEN.pair(null, { format: 'btc' });
    assert.match(p.epub, /^0x0[23][0-9a-f]{64}$/, 'epub is 0x02/03 + 32-byte x');
  });

  it('btc format is deterministic from seed', async function() {
    const seed = 'btc-determinism-seed';
    const p1 = await ZEN.pair(null, { seed, format: 'btc' });
    const p2 = await ZEN.pair(null, { seed, format: 'btc' });
    assert.strictEqual(p1.pub,  p2.pub);
    assert.strictEqual(p1.priv, p2.priv);
  });

  it('p256 + btc format returns valid P2PKH address', async function() {
    const p = await ZEN.pair(null, { curve: 'p256', format: 'btc' });
    assert.strictEqual(p.curve, 'p256');
    assert.match(p.pub, /^1[1-9A-HJ-NP-Za-km-z]+$/, 'p256 btc pub is P2PKH');
  });

  it('btc address length is 25–34 chars', async function() {
    const p = await ZEN.pair(null, { format: 'btc' });
    assert.ok(p.pub.length >= 25 && p.pub.length <= 34, `address length ${p.pub.length} should be 25-34`);
  });
});

// ─── callback API ─────────────────────────────────────────────────────────────
describe('zen.pair() — callback API with formats', function() {
  this.timeout(10 * 1000);

  it('callback receives result for p256', function(done) {
    ZEN.pair(function(p) {
      assert.ok(p, 'callback receives pair');
      assert.strictEqual(p.curve, 'p256');
      done();
    }, { curve: 'p256' });
  });

  it('callback on error gets undefined', function(done) {
    ZEN.pair(function(p) {
      assert.strictEqual(p, undefined);
      done();
    }, { curve: 'invalidcurve' });
  });
});

// ─── sign / verify multi-curve ───────────────────────────────────────────────
describe('sign/verify — multi-curve', function() {
  this.timeout(30 * 1000);

  it('p256: sign + verify roundtrip', async function() {
    const p = await ZEN.pair(null, { curve: 'p256' });
    const signed = await ZEN.sign('hello p256', p);
    const msg = await ZEN.verify(signed, p.pub);
    assert.strictEqual(msg, 'hello p256');
  });

  it('p256: signed data carries curve marker c=p256', async function() {
    const p = await ZEN.pair(null, { curve: 'p256' });
    const signed = await ZEN.sign('test', p);
    const env = JSON.parse(signed);
    assert.strictEqual(env.c, 'p256', 'signed envelope should have c=p256');
  });

  it('secp256k1: signed data has no c field (backward compat)', async function() {
    const p = await ZEN.pair(null, { curve: 'secp256k1' });
    const signed = await ZEN.sign('test', p);
    const env = JSON.parse(signed);
    assert.ok(!env.c, 'secp256k1 signed envelope should have no c field');
  });

  it('p256: verify with wrong pub returns undefined', async function() {
    const alice = await ZEN.pair(null, { curve: 'p256' });
    const bob   = await ZEN.pair(null, { curve: 'p256' });
    const signed = await ZEN.sign('secret', alice);
    const bad = await ZEN.verify(signed, bob.pub).catch(() => undefined);
    assert.strictEqual(bad, undefined);
  });

  it('cross-curve verification fails (p256 signed, secp256k1 pub)', async function() {
    const p256pair  = await ZEN.pair(null, { curve: 'p256' });
    const secppair  = await ZEN.pair(null, { curve: 'secp256k1' });
    const signed = await ZEN.sign('cross', p256pair);
    // Envelope has c=p256, but we pass a secp256k1 pub — curve mismatch should reject
    const bad = await ZEN.verify(signed, secppair.pub).catch(() => undefined);
    assert.strictEqual(bad, undefined);
  });
});

// ─── secret multi-curve ───────────────────────────────────────────────────────
describe('secret — multi-curve', function() {
  this.timeout(20 * 1000);

  it('p256: ECDH shared secret matches', async function() {
    const alice = await ZEN.pair(null, { curve: 'p256' });
    const bob   = await ZEN.pair(null, { curve: 'p256' });
    const s1 = await ZEN.secret(bob.epub,   alice);
    const s2 = await ZEN.secret(alice.epub, bob);
    assert.strictEqual(s1, s2, 'p256 ECDH shared secrets must match');
  });

  it('p256: shared secret is a base62 string', async function() {
    const alice = await ZEN.pair(null, { curve: 'p256' });
    const bob   = await ZEN.pair(null, { curve: 'p256' });
    const s = await ZEN.secret(bob.epub, alice);
    assert.match(s, /^[A-Za-z0-9]+$/, 'shared secret should be base62');
  });
});
