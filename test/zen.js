import assert from 'assert';
import ZENDefault, { ZEN, SEA, PEN, createZEN } from '../zen.js';

describe('ZEN', function() {
  it('exports the ZEN class by default', function() {
    assert.strictEqual(ZENDefault, ZEN);
  });

  it('keeps PEN on class and instance', function() {
    var zen = createZEN();
    var soul = ZEN.pen({ key: 'fixed' });
    assert.strictEqual(typeof soul, 'string');
    assert.ok(soul.startsWith('$'));
    assert.strictEqual(zen.pen({ key: 'fixed' }), soul);
    assert.strictEqual(ZEN.PEN, PEN);
    assert.strictEqual(zen.PEN, PEN);
  });

  it('creates isolated instances without globals', function() {
    var a = createZEN({ localStorage: false, peers: [] });
    var b = createZEN({ localStorage: false, peers: [] });
    assert.ok(a instanceof ZEN);
    assert.ok(b instanceof ZEN);
    assert.notStrictEqual(a, b);
    assert.notStrictEqual(a.GUN, b.GUN);
    assert.strictEqual(globalThis.ZEN, undefined);
  });

  it('bridges SEA helpers', async function() {
    var zen = createZEN();
    var pair = await zen.pair();
    assert.strictEqual(typeof SEA.sign, 'function');
    assert.strictEqual(typeof pair.pub, 'string');
    assert.strictEqual(pair.pub.length, 88);
  });
});
