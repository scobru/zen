import assert from 'assert';
import ZENDefault, { ZEN, GUN, SEA, PEN, createZEN } from '../zen.js';

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
    assert.strictEqual(zen.SEA, SEA);
    assert.strictEqual(ZEN.PEN, PEN);
    assert.strictEqual(zen.PEN, PEN);
  });

  it('mirrors GUN SEA and PEN statics onto ZEN', function() {
    assert.strictEqual(ZEN.GUN, GUN);
    assert.strictEqual(ZEN.SEA, SEA);
    assert.strictEqual(ZEN.PEN, PEN);
    assert.strictEqual(ZEN.state, GUN.state);
    assert.strictEqual(ZEN.valid, GUN.valid);
    assert.strictEqual(ZEN.Buffer, SEA.Buffer);
    assert.strictEqual(ZEN.random, SEA.random);
    assert.strictEqual(ZEN.keyid, SEA.keyid);
    assert.strictEqual(ZEN.pack, PEN.pack);
    assert.strictEqual(ZEN.unpack, PEN.unpack);
    assert.strictEqual(ZEN.run, PEN.run);
    assert.strictEqual(ZEN.ready, PEN.ready);
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

  it('mirrors GUN chain and PEN methods onto instances', function() {
    var zen = createZEN({ localStorage: false, peers: [] });
    var raw = Uint8Array.from([1, 2, 3, 4]);
    assert.strictEqual(typeof zen.opt, 'function');
    assert.strictEqual(typeof zen.then, 'function');
    assert.strictEqual(typeof zen.pack, 'function');
    assert.strictEqual(typeof zen.unpack, 'function');
    assert.strictEqual(zen.pack(raw), PEN.pack(raw));
  });
});
