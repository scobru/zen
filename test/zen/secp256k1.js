import assert from 'assert';
import ZEN from '../../zen.js';

describe('ZEN secp256k1', function() {
  this.timeout(20 * 1000);

  it('derives deterministic secp256k1 pairs from the same seed', async function() {
    var first = await ZEN.pair(null, { seed: 'same-seed' });
    var second = await ZEN.pair(null, { seed: 'same-seed' });
    assert.strictEqual(first.curve, 'secp256k1');
    assert.strictEqual(first.priv, second.priv);
    assert.strictEqual(first.pub, second.pub);
    assert.strictEqual(first.epriv, second.epriv);
    assert.strictEqual(first.epub, second.epub);
  });

  it('emits public keys that are valid secp256k1 points', async function() {
    var pair = await ZEN.pair();
    var point = ZEN.SECP256K1.parsePub(pair.pub);
    assert.strictEqual(ZEN.SECP256K1.isOnCurve(point), true);
  });

  it('signs deterministically and rejects tampering', async function() {
    var pair = await ZEN.pair(null, { seed: 'sign-seed' });
    var one = await ZEN.sign({ ok: true }, pair);
    var two = await ZEN.sign({ ok: true }, pair);
    var verified = await ZEN.verify(one, pair.pub);
    assert.strictEqual(one, two);
    assert.strictEqual(one.startsWith('SEA'), false);
    assert.deepStrictEqual(verified, { ok: true });

    var tampered = JSON.parse(one);
    tampered.m = { ok: false };
    await assert.rejects(
      ZEN.verify(JSON.stringify(tampered), pair.pub),
      /Signature did not match/
    );
  });

  it('rejects verification with the wrong public key', async function() {
    var alice = await ZEN.pair(null, { seed: 'alice-seed' });
    var bob = await ZEN.pair(null, { seed: 'bob-seed' });
    var signed = await ZEN.sign('hello', alice);
    await assert.rejects(
      ZEN.verify(signed, bob.pub),
      /Signature did not match/
    );
  });

  it('derives symmetric shared secrets for secp256k1 encryption keys', async function() {
    var alice = await ZEN.pair(null, { seed: 'alice-secret' });
    var bob = await ZEN.pair(null, { seed: 'bob-secret' });
    var toBob = await ZEN.secret(bob.epub, alice);
    var toAlice = await ZEN.secret(alice.epub, bob);
    assert.strictEqual(toBob, toAlice);
    assert.strictEqual(typeof toBob, 'string');
    assert.strictEqual(toBob.length, 44);
  });
});
