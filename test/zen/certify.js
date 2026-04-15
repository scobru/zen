// Tests for zen.certify() — ZEN port of sea.certify
import assert from 'assert';
import ZEN from '../../zen.js';

describe('zen.certify()', function() {
  this.timeout(20 * 1000);

  var alice, bob, carol;

  before(async function() {
    alice = await ZEN.pair();
    bob   = await ZEN.pair();
    carol = await ZEN.pair();
  });

  // ─── Basic write policy ────────────────────────────────────────────────────
  describe('basic write policy', function() {
    it('certifies a single pub with a string policy', async function() {
      const out = await ZEN.certify(bob.pub, 'inbox', alice);
      assert.ok(typeof out === 'string', 'output should be a JSON string');
      const cert = JSON.parse(out);
      assert.ok(cert.m, 'certificate should have .m');
      assert.ok(cert.s, 'certificate should have .s');
    });

    it('cert.m contains correct c and w fields', async function() {
      const out = await ZEN.certify(bob.pub, 'inbox', alice);
      const cert = JSON.parse(out);
      const data = typeof cert.m === 'string' ? JSON.parse(cert.m) : cert.m;
      assert.strictEqual(data.c, bob.pub, 'c should be the certificant pub');
      assert.strictEqual(data.w, 'inbox', 'w should be the write policy');
      assert.ok(!data.r, 'r should not be present');
      assert.ok(!data.e, 'e should not be present');
    });

    it('certificate verifies with authority pub', async function() {
      const out = await ZEN.certify(bob.pub, 'inbox', alice);
      const cert = JSON.parse(out);
      const verified = await ZEN.verify(cert, alice.pub);
      assert.ok(verified !== undefined, 'should verify');
      const data = typeof verified === 'string' ? JSON.parse(verified) : verified;
      assert.strictEqual(data.c, bob.pub);
      assert.strictEqual(data.w, 'inbox');
    });
  });

  // ─── Wildcard certificants ─────────────────────────────────────────────────
  describe('wildcard certificants', function() {
    it('string "*" produces wildcard', async function() {
      const out = await ZEN.certify('*', 'messages', alice);
      const cert = JSON.parse(out);
      const data = typeof cert.m === 'string' ? JSON.parse(cert.m) : cert.m;
      assert.strictEqual(data.c, '*');
    });

    it('array containing "*" produces wildcard', async function() {
      const out = await ZEN.certify([bob.pub, '*'], 'messages', alice);
      const cert = JSON.parse(out);
      const data = typeof cert.m === 'string' ? JSON.parse(cert.m) : cert.m;
      assert.strictEqual(data.c, '*');
    });
  });

  // ─── Array of certificants ────────────────────────────────────────────────
  describe('array of certificants', function() {
    it('array of pub strings', async function() {
      const out = await ZEN.certify([bob.pub, carol.pub], 'inbox', alice);
      const cert = JSON.parse(out);
      const data = typeof cert.m === 'string' ? JSON.parse(cert.m) : cert.m;
      assert.ok(Array.isArray(data.c), 'c should be an array');
      assert.ok(data.c.includes(bob.pub));
      assert.ok(data.c.includes(carol.pub));
    });

    it('single-element array unwraps to string', async function() {
      const out = await ZEN.certify([bob.pub], 'inbox', alice);
      const cert = JSON.parse(out);
      const data = typeof cert.m === 'string' ? JSON.parse(cert.m) : cert.m;
      assert.strictEqual(data.c, bob.pub, 'single-element array should unwrap');
    });

    it('array of objects with .pub', async function() {
      const out = await ZEN.certify([bob, carol], 'inbox', alice);
      const cert = JSON.parse(out);
      const data = typeof cert.m === 'string' ? JSON.parse(cert.m) : cert.m;
      assert.ok(Array.isArray(data.c));
      assert.ok(data.c.includes(bob.pub));
    });
  });

  // ─── Object certificant ──────────────────────────────────────────────────
  describe('object with .pub as certificant', function() {
    it('single object with .pub', async function() {
      const out = await ZEN.certify(bob, 'inbox', alice);
      const cert = JSON.parse(out);
      const data = typeof cert.m === 'string' ? JSON.parse(cert.m) : cert.m;
      assert.strictEqual(data.c, bob.pub);
    });
  });

  // ─── Policy forms ─────────────────────────────────────────────────────────
  describe('policy forms', function() {
    it('RAD/LEX object as write policy', async function() {
      const pol = { '#': 'inbox', '.': '*' };
      const out = await ZEN.certify(bob.pub, pol, alice);
      const cert = JSON.parse(out);
      const data = typeof cert.m === 'string' ? JSON.parse(cert.m) : cert.m;
      assert.deepStrictEqual(data.w, pol);
    });

    it('array of policies as write policy', async function() {
      const pol = ['inbox', 'outbox'];
      const out = await ZEN.certify(bob.pub, pol, alice);
      const cert = JSON.parse(out);
      const data = typeof cert.m === 'string' ? JSON.parse(cert.m) : cert.m;
      assert.deepStrictEqual(data.w, pol);
    });

    it('policy.read and policy.write both set', async function() {
      const pol = { read: 'pub', write: 'inbox' };
      const out = await ZEN.certify(bob.pub, pol, alice);
      const cert = JSON.parse(out);
      const data = typeof cert.m === 'string' ? JSON.parse(cert.m) : cert.m;
      assert.strictEqual(data.r, 'pub', 'r should be read policy');
      assert.strictEqual(data.w, 'inbox', 'w should be write policy');
    });

    it('policy.read only', async function() {
      const pol = { read: 'pub' };
      const out = await ZEN.certify(bob.pub, pol, alice);
      const cert = JSON.parse(out);
      const data = typeof cert.m === 'string' ? JSON.parse(cert.m) : cert.m;
      assert.strictEqual(data.r, 'pub');
      assert.ok(!data.w, 'w should not be present');
    });
  });

  // ─── Expiry ──────────────────────────────────────────────────────────────
  describe('expiry', function() {
    it('opt.expiry is embedded as e', async function() {
      const ts = Date.now() + 60_000;
      const out = await ZEN.certify(bob.pub, 'inbox', alice, null, { expiry: ts });
      const cert = JSON.parse(out);
      const data = typeof cert.m === 'string' ? JSON.parse(cert.m) : cert.m;
      assert.strictEqual(data.e, ts);
    });

    it('opt.expiry as string is parsed to float', async function() {
      const ts = Date.now() + 60_000;
      const out = await ZEN.certify(bob.pub, 'inbox', alice, null, { expiry: String(ts) });
      const cert = JSON.parse(out);
      const data = typeof cert.m === 'string' ? JSON.parse(cert.m) : cert.m;
      assert.strictEqual(data.e, parseFloat(String(ts)));
    });
  });

  // ─── Block lists ─────────────────────────────────────────────────────────
  describe('block lists', function() {
    it('opt.block with write block string', async function() {
      const out = await ZEN.certify(bob.pub, 'inbox', alice, null, { block: 'blocklist' });
      const cert = JSON.parse(out);
      const data = typeof cert.m === 'string' ? JSON.parse(cert.m) : cert.m;
      assert.strictEqual(data.wb, 'blocklist');
    });

    it('opt.block with .read block', async function() {
      const out = await ZEN.certify(bob.pub, 'inbox', alice, null, { block: { read: 'readblock' } });
      const cert = JSON.parse(out);
      const data = typeof cert.m === 'string' ? JSON.parse(cert.m) : cert.m;
      assert.strictEqual(data.rb, 'readblock');
    });

    it('opt.block with .write block soul ref', async function() {
      const ref = { '#': 'myBlockList' };
      const out = await ZEN.certify(bob.pub, 'inbox', alice, null, { block: { write: ref } });
      const cert = JSON.parse(out);
      const data = typeof cert.m === 'string' ? JSON.parse(cert.m) : cert.m;
      assert.deepStrictEqual(data.wb, ref);
    });

    it('opt.blacklist alias works', async function() {
      const out = await ZEN.certify(bob.pub, 'inbox', alice, null, { blacklist: 'blist' });
      const cert = JSON.parse(out);
      const data = typeof cert.m === 'string' ? JSON.parse(cert.m) : cert.m;
      assert.strictEqual(data.wb, 'blist');
    });

    it('opt.ban alias works', async function() {
      const out = await ZEN.certify(bob.pub, 'inbox', alice, null, { ban: 'banlist' });
      const cert = JSON.parse(out);
      const data = typeof cert.m === 'string' ? JSON.parse(cert.m) : cert.m;
      assert.strictEqual(data.wb, 'banlist');
    });
  });

  // ─── opt.raw ─────────────────────────────────────────────────────────────
  describe('opt.raw', function() {
    it('opt.raw returns cert object not string', async function() {
      const cert = await ZEN.certify(bob.pub, 'inbox', alice, null, { raw: 1 });
      assert.ok(typeof cert === 'object', 'should be object with opt.raw');
      assert.ok(cert.m && cert.s, 'should have m and s');
    });
  });

  // ─── Callback ────────────────────────────────────────────────────────────
  describe('callback', function() {
    it('calls cb with result', function(done) {
      ZEN.certify(bob.pub, 'inbox', alice, function(out) {
        assert.ok(typeof out === 'string');
        const cert = JSON.parse(out);
        assert.ok(cert.m && cert.s);
        done();
      });
    });
  });

  // ─── Error cases ──────────────────────────────────────────────────────────
  describe('error cases', function() {
    it('null certificants returns undefined (no crash)', async function() {
      const out = await ZEN.certify(null, 'inbox', alice);
      assert.strictEqual(out, undefined);
    });

    it('empty object certificants returns undefined', async function() {
      const out = await ZEN.certify({}, 'inbox', alice);
      assert.strictEqual(out, undefined);
    });

    it('no policy returns undefined', async function() {
      const out = await ZEN.certify(bob.pub, {}, alice);
      assert.strictEqual(out, undefined);
    });
  });

  // ─── Multi-curve authority ────────────────────────────────────────────────
  describe('multi-curve authority (P-256)', function() {
    it('p256 authority signs a certificate', async function() {
      const p256alice = await ZEN.pair(null, { curve: 'p256' });
      const out = await ZEN.certify(bob.pub, 'inbox', p256alice);
      assert.ok(typeof out === 'string', 'output should be JSON string');
      const cert = JSON.parse(out);
      assert.ok(cert.m && cert.s, 'cert should have m and s');
    });

    it('p256 certificate has curve marker in signed data', async function() {
      const p256alice = await ZEN.pair(null, { curve: 'p256' });
      const out = await ZEN.certify(bob.pub, 'inbox', p256alice);
      const cert = JSON.parse(out);
      const data = typeof cert.m === 'string' ? JSON.parse(cert.m) : cert.m;
      assert.strictEqual(data.c, bob.pub);
      assert.strictEqual(data.w, 'inbox');
      // sign.js embeds c: 'p256' in the cert envelope itself (not in the inner data)
      assert.ok(cert.c === 'p256', 'envelope c field marks p256 curve');
    });

    it('p256 certificate verifies with p256 authority pub', async function() {
      const p256alice = await ZEN.pair(null, { curve: 'p256' });
      const out = await ZEN.certify(bob.pub, 'inbox', p256alice);
      const cert = JSON.parse(out);
      const verified = await ZEN.verify(cert, p256alice.pub);
      assert.ok(verified !== undefined);
      const data = typeof verified === 'string' ? JSON.parse(verified) : verified;
      assert.strictEqual(data.c, bob.pub);
    });
  });

  // ─── ZEN class instance ───────────────────────────────────────────────────
  describe('ZEN instance method', function() {
    it('zen.certify() mirrors static certify()', async function() {
      const zen = new ZEN();
      const out = await zen.certify(bob.pub, 'inbox', alice);
      assert.ok(typeof out === 'string');
      const cert = JSON.parse(out);
      assert.ok(cert.m && cert.s);
    });
  });
});
