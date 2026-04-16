import ZEN from '../../zen.js';
import '../../lib/store.js';
import '../../lib/rfs.js';
import __fs from 'fs';
import __fsrm from '../../lib/fsrm.js';
var __gun;
{
  var W = function(o){return new ZEN(o)};
  Object.setPrototypeOf(W, ZEN);
  W.prototype = ZEN.prototype;
  __gun = W;
}
import __expect from '../expect.js';
import __util from 'util';
import exp from 'constants';
import expect from '../expect.js';
import SeaArray from '../../src/zen/array.js';
var Runtime = ZEN;
var SUITE_NAME = 'ZEN security';
var root;
var Gun;
{
  var env;
  if(typeof global !== 'undefined'){ env = global }
  if(typeof window !== 'undefined'){ env = window }
  root = env.window? env.window : global;
  try{ env.window && root.localStorage && root.localStorage.clear() }catch(e){}
  //try{ indexedDB.deleteDatabase('radatatest') }catch(e){}
  if(root.Gun){
    root.Gun = root.Gun;
    root.Gun.TESTING = true;
  } else {
    try{ __fs.unlinkSync('tmp/data.json') }catch(e){}
    try{ __fsrm('tmp/radatatest') }catch(e){}
    root.Gun = __gun;
    root.Gun.TESTING = true;
  }

  try{ var expect = global.expect = __expect }catch(e){}

  root.Gun.SEA = Runtime
}(this));


{
Gun = root.Gun
var SEA = Gun.SEA
if(!SEA){ return }

describe(SUITE_NAME, function(){
  this.timeout(20 * 1000);
  var gun;

  var prep = async function(d,k, n,s){ return {'#':s,'.':k,':': await SEA.opt.parse(d),'>':Gun.state.is(n, k)} }; // shim for old - prep for signing.
  var pack = function(d,cb,k, n,s){ return new Promise(function(res, rej){ SEA.opt.pack(d, function(r){ res(r) }, k,n,s) }) }; // make easier to upgrade test, cb to await
  describe('Utility', function(){
    it('deleting old SEA tests (may take long time)', function(done){
        done(); // Mocha doesn't print test until after its done, so show this first.
    });
    it('deleted', function(done){
        this.timeout(60 * 1000);
        if(!Gun.window){ return done() }
        indexedDB.deleteDatabase('radatatest').onsuccess = function(e){ done() }
    });
    /*it('generates aeskey from jwk', function(done) { // DEPRECATED!!!
      console.log("WARNING: THIS DOES NOT WORK IN BROWSER!!!! NEEDS FIX");
      SEA.opt.aeskey('x','x').then(k => {
        //console.log("DATA", k.data);
        expect(k.data.toString('base64')).to.be('Xd6JaIf2dUybFb/jpEGuSAbfL96UABMR4IvxEGIuC74=')
        done()
      })
    })*/
    it('quickstart', function(done){
      SEA.pair(function(pair){
      SEA.encrypt('hello self', pair, function(enc){
      SEA.sign(enc, pair, function(data){
      SEA.verify(data, pair.pub, function(msg){
      SEA.decrypt(msg, pair, function(dec){
      expect(dec).to.be('hello self');
      SEA.hash(dec, pair, function(proof){
      SEA.hash('hello self', pair, function(check){
      expect(proof).to.be(check);
      SEA.pair(function(alice){
      SEA.pair(function(bob){
      SEA.secret(bob.epub, alice, function(aes){
      SEA.encrypt('shared data', aes, function(enc){
      SEA.secret(alice.epub, bob, function(aes){
      SEA.decrypt(enc, aes, function(dec){
      expect(dec).to.be('shared data');
      done();
      });});});});});});});});});});});});});
    })

    it('quickwrong', function(done){
      SEA.pair(function(alice){
      SEA.pair(function(bob){
      SEA.sign('asdf', alice, function(data){
      SEA.verify(data, bob.pub, function(msg){
      expect(msg).to.be(undefined);
      SEA.verify(data.slice(0,20)+data.slice(21), alice.pub, function(msg){
      expect(msg).to.be(undefined);
      SEA.encrypt('secret', alice, function(enc){
      SEA.decrypt(enc, bob, function(dec){
      expect(dec).to.be(undefined);
      SEA.decrypt(enc.slice(0,20)+enc.slice(21), alice, function(dec){
      expect(dec).to.be(undefined);
      done();
      });});});});});});});});
    })

    it('hash() base64url no slash', function(done){
      this.timeout(60 * 1000);
      (async function(){
        function randStr(len){
          var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          var out = '';
          for(var i = 0; i < len; i++){
            out += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          return out;
        }
        function hashAsync(data){
          return new Promise(function(res){
            SEA.hash(data, null, function(r){ res(r) }, {name: 'SHA-256'});
          });
        }
        for(var i = 0; i < 1000; i++){
          var s = randStr(32);
          var r = await hashAsync(s);
          if(r.indexOf('/') >= 0){
            throw new Error('Found "/" in hash() output at index '+i+': '+r+' (input: '+s+')');
          }
        }
        done();
      })().catch(function(err){ done(err || new Error('hash() base64url test failed')); });
    })

    it('hash() supports keccak256', function(done){
      (async function(){
        var byHash = await SEA.hash('', null, null, {name: 'keccak256', encode: 'hex'});
        expect(byHash).to.be('c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470');
        done();
      })().catch(function(err){ done(err || new Error('hash() keccak256 test failed')); });
    })

    it('btoa/atob utf8 roundtrip', function(done){
      (async function(){
        var TextEnc = typeof TextEncoder !== 'undefined' ? TextEncoder : __util.TextEncoder;
        var TextDec = typeof TextDecoder !== 'undefined' ? TextDecoder : __util.TextDecoder;
        var enc = new TextEnc();
        var dec = new TextDec('utf-8');

        function toBinaryString(str){
          var bytes = enc.encode(str);
          var bin = '';
          for(var i = 0; i < bytes.length; i++){
            bin += String.fromCharCode(bytes[i]);
          }
          return bin;
        }

        function fromBinaryString(bin){
          var bytes = new Uint8Array(bin.length);
          for(var i = 0; i < bin.length; i++){
            bytes[i] = bin.charCodeAt(i);
          }
          return dec.decode(bytes);
        }

        var samples = [
          'Tiếng Việt có dấu: ắềôữ đặng',
          '中文測試：漢字とかな',
          'Emoji 😀🔥✨'
        ];

        samples.forEach(function(s){
          var bin = toBinaryString(s);
          var b64 = btoa(bin);
          var round = fromBinaryString(atob(b64));
          expect(round).to.be(s);
        });
        done();
      })().catch(function(err){ done(err || new Error('btoa/atob utf8 test failed')); });
    })

    it('types', function(done){
      var pair, s, v;
      SEA.pair(function(pair){
      SEA.sign(null, pair, function(s){
      SEA.verify(s, pair, function(v){
      expect(null).to.be(v);
      SEA.sign(true, pair, function(s){
      SEA.verify(s, pair, function(v){
      expect(true).to.be(v);
      SEA.sign(false, pair, function(s){
      SEA.verify(s, pair, function(v){
      expect(false).to.be(v);
      SEA.sign(0, pair, function(s){
      SEA.verify(s, pair, function(v){
      expect(0).to.be(v);
      SEA.sign(1, pair, function(s){
      SEA.verify(s, pair, function(v){
      expect(1).to.be(v);
      SEA.sign(1.01, pair, function(s){
      SEA.verify(s, pair, function(v){
      expect(1.01).to.be(v);
      SEA.sign('', pair, function(s){
      SEA.verify(s, pair, function(v){
      expect('').to.be(v);
      SEA.sign('a', pair, function(s){
      SEA.verify(s, pair, function(v){
      expect('a').to.be(v);
      SEA.sign([], pair, function(s){
      SEA.verify(s, pair, function(v){
      expect([]).to.eql(v);
      SEA.sign([1], pair, function(s){
      SEA.verify(s, pair, function(v){
      expect([1]).to.eql(v);
      SEA.sign({}, pair, function(s){
      SEA.verify(s, pair, function(v){
      expect({}).to.eql(v);
      SEA.sign({a:1}, pair, function(s){
      SEA.verify(s, pair, function(v){
      expect({a:1}).to.eql(v);
      SEA.sign(JSON.stringify({a:1}), pair, function(s){
      SEA.verify(s, pair, function(v){
      expect({a:1}).to.eql(v);
      done();
      });});});});});});});});});});});});});});});});});});});});});});});});});});});
    })

    it('atypes', function(done){
      var pair, s, v;
      SEA.pair(function(pair){
      SEA.encrypt(null, pair, function(s){
      SEA.decrypt(s, pair, function(v){
      expect(null).to.be(v);
      SEA.encrypt(true, pair, function(s){
      SEA.decrypt(s, pair, function(v){
      expect(true).to.be(v);
      SEA.encrypt(false, pair, function(s){
      SEA.decrypt(s, pair, function(v){
      expect(false).to.be(v);
      SEA.encrypt(0, pair, function(s){
      SEA.decrypt(s, pair, function(v){
      expect(0).to.be(v);
      SEA.encrypt(1, pair, function(s){
      SEA.decrypt(s, pair, function(v){
      expect(1).to.be(v);
      SEA.encrypt(1.01, pair, function(s){
      SEA.decrypt(s, pair, function(v){
      expect(1.01).to.be(v);
      SEA.encrypt('', pair, function(s){
      SEA.decrypt(s, pair, function(v){
      expect('').to.be(v);
      SEA.encrypt('a', pair, function(s){
      SEA.decrypt(s, pair, function(v){
      expect('a').to.be(v);
      SEA.encrypt([], pair, function(s){
      SEA.decrypt(s, pair, function(v){
      expect([]).to.eql(v);
      SEA.encrypt([1], pair, function(s){
      SEA.decrypt(s, pair, function(v){
      expect([1]).to.eql(v);
      SEA.encrypt({}, pair, function(s){
      SEA.decrypt(s, pair, function(v){
      expect({}).to.eql(v);
      SEA.encrypt({a:1}, pair, function(s){
      SEA.decrypt(s, pair, function(v){
      expect({a:1}).to.eql(v);
      SEA.encrypt(JSON.stringify({a:1}), pair, function(s){
      SEA.decrypt(s, pair, function(v){
      expect({a:1}).to.eql(v);
      done();
      });});});});});});});});});});});});});});});});});});});});});});});});});});});
    })
    
    /*it('DOESNT DECRYPT SCIENTIFIC NOTATION', function(done){
      var pair, s, v;
      SEA.pair(function(pair){
      SEA.encrypt('4e2', pair, function(s){
      SEA.decrypt(s, pair, function(v){
      expect(400).to.be(v);
      done();
      });});});
    })*/

    it('hash array buffer', function(done) {
      (async function() {
        // Create a deterministic ArrayBuffer (buffer 1)
        var buff1 = new ArrayBuffer(16);
        var view1 = new Uint8Array(buff1); // Use a Uint8Array to modify the buffer
        for (var i = 0; i < view1.length; i++) {
          view1[i] = i;
        }
        var hash1 = await SEA.hash(buff1, "salt");

        // Create another deterministic ArrayBuffer (buffer 2)
        var buff2 = new ArrayBuffer(16);
        var view2 = new Uint8Array(buff2);
        for (var i = 0; i < view2.length; i++) {
          view2[i] = i + 16;
        }
        var hash2 = await SEA.hash(buff2, "salt");

        // Ensure the hashes are strings and different from each other
        expect(typeof hash1 === "string" && typeof hash2 === "string").to.be(true);
        expect(hash1 !== hash2).to.be(true);
        done(); // Signal that the test is complete
      })();
    });

    it('JSON escape', function(done){ (async function(){
      var plain = "hello world";
      var json = JSON.stringify({hello:'world'});

      var n1 = Gun.state.ify({}, 'key', 1, plain, 'soul');
      var n2 = Gun.state.ify({}, 'key', 1, json, 'soul');
      var tmp = await prep(plain, 'key', n1, 'soul');
      expect(tmp[':']).to.be("hello world");
      tmp = await prep(json, 'key', n2, 'soul');
      expect(tmp[':'].hello).to.be("world");
      tmp = SEA.opt.unpack(tmp);
      expect(tmp.hello).to.be("world");
      done();
    }())});

    it('double sign', function(done){ (async function(){
      var pair = await SEA.pair();
      var sig = await SEA.sign('hello world', pair);
      var dup = await SEA.sign(sig, pair);
      expect(dup).to.be(sig);

      var json = JSON.stringify({hello:'world'});
      var n1 = Gun.state.ify({}, 'key', 1, json, 'soul');
      var sig = await SEA.sign(await prep(json, 'key', n1, 'soul'), pair, null, {raw:1 , check: await pack(json, 'key', n1, 'soul')});
      var dup = await SEA.sign(await prep(sig, 'key', n1, 'soul'), pair, null, {raw:1 , check: await pack(sig, 'key', n1, 'soul')});
      expect(dup).to.be.eql(sig);

      var json = JSON.stringify({hello:'world'});
      var n1 = Gun.state.ify({}, 'key', 1, json, 'soul');
      var bob = await SEA.pair();
      var sig = await SEA.sign(await prep(json, 'key', n1, 'soul'), bob, null, {raw:1 , check: await pack(json, 'key', n1, 'soul')});
      var dup = await SEA.sign(await prep(sig, 'key', n1, 'soul'), pair, null, {raw:1 , check: await pack(sig, 'key', n1, 'soul')});
      expect(dup).to.not.be.eql(sig);

      var json = JSON.stringify({hello:'world'});
      var bob = await SEA.pair();
      var sig = await SEA.sign(json, bob);
      var dup = await SEA.sign(sig, pair);
      expect(dup).to.not.be.eql(sig);
      done();
    }())})
  });

  describe('pair() key format', function() {
    var B62 = /^[A-Za-z0-9]{88}$/;
    var B62_44 = /^[A-Za-z0-9]{44}$/;

    it('curve is secp256k1', async function() {
      var pair = await SEA.pair();
      expect(pair.curve).to.be('secp256k1');
    });

    it('pub is 88-char base62 (no dot, dash, underscore)', async function() {
      var pair = await SEA.pair();
      expect(pair.pub).to.be.a('string');
      expect(pair.pub.length).to.be(88);
      expect(B62.test(pair.pub)).to.be(true);
    });

    it('epub is 88-char base62 (no dot, dash, underscore)', async function() {
      var pair = await SEA.pair();
      expect(pair.epub).to.be.a('string');
      expect(pair.epub.length).to.be(88);
      expect(B62.test(pair.epub)).to.be(true);
    });

    it('priv is 44-char base62', async function() {
      var pair = await SEA.pair();
      expect(pair.priv).to.be.a('string');
      expect(pair.priv.length).to.be(44);
      expect(B62_44.test(pair.priv)).to.be(true);
    });

    it('epriv is 44-char base62', async function() {
      var pair = await SEA.pair();
      expect(pair.epriv).to.be.a('string');
      expect(pair.epriv.length).to.be(44);
      expect(B62_44.test(pair.epriv)).to.be(true);
    });

    it('pub and epub differ (ECDSA vs ECDH keys)', async function() {
      var pair = await SEA.pair();
      expect(pair.pub).to.not.be(pair.epub);
    });

    it('format holds across multiple independent pairs', async function() {
      var pairs = await Promise.all([SEA.pair(), SEA.pair(), SEA.pair()]);
      pairs.forEach(function(p) {
        expect(B62.test(p.pub)).to.be(true);
        expect(B62.test(p.epub)).to.be(true);
        expect(B62_44.test(p.priv)).to.be(true);
        expect(B62_44.test(p.epriv)).to.be(true);
      });
    });

    it('seed-based pair has same format', async function() {
      var pair = await SEA.pair(null, { seed: 'test-seed-format' });
      expect(B62.test(pair.pub)).to.be(true);
      expect(B62.test(pair.epub)).to.be(true);
      expect(B62_44.test(pair.priv)).to.be(true);
      expect(B62_44.test(pair.epriv)).to.be(true);
    });
  });

  describe('wire format', function() {
    it('sign() and encrypt() omit SEA prefix', async function() {
      var pair = await SEA.pair(null, { seed: 'sea-wire-format' });
      var signed = await SEA.sign({ hello: 'sea' }, pair);
      var encrypted = await SEA.encrypt('secret', pair);
      expect(signed.startsWith('SEA')).to.be(false);
      expect(encrypted.startsWith('SEA')).to.be(false);
    });
  });

  describe('Seed-based Key Generation', function() {
    this.timeout(5000); // Set timeout for all tests in this suite
    
    it('generates deterministic key pairs from same seed', async function () {
      // Seed string tests
      const pair1 = await SEA.pair(null, { seed: "my secret seed" });
      const pair2 = await SEA.pair(null, { seed: "my secret seed" });
      const pair3 = await SEA.pair(null, { seed: "not my seed" });

      // Check if pairs with same seed are identical
      const sameKeys = pair1.priv === pair2.priv && 
                      pair1.pub === pair2.pub && 
                      pair1.epriv === pair2.epriv && 
                      pair1.epub === pair2.epub;

      // Check if pairs with different seeds are different
      const differentKeys = pair1.priv !== pair3.priv && 
                            pair1.pub !== pair3.pub && 
                            pair1.epriv !== pair3.epriv && 
                            pair1.epub !== pair3.epub;

      expect(sameKeys).to.be(true);
      expect(differentKeys).to.be(true);
      
      // Test consistent generation across multiple calls
      const numTests = 5;
      const pairs = [];
      const seed = "consistency test seed";
      
      // Generate multiple pairs with the same seed
      for (let i = 0; i < numTests; i++) {
        pairs.push(await SEA.pair(null, { seed }));
      }
      
      // Verify all pairs are identical
      let allMatch = true;
      for (let i = 1; i < numTests; i++) {
        if (pairs[i].pub !== pairs[0].pub || 
            pairs[i].priv !== pairs[0].priv ||
            pairs[i].epub !== pairs[0].epub ||
            pairs[i].epriv !== pairs[0].epriv) {
          allMatch = false;
          break;
        }
      }
      
      expect(allMatch).to.be(true);
      
      // Test that the created pair works with SEA functions
      var enc = await SEA.encrypt('hello self', pair1);
      var data = await SEA.sign(enc, pair1);
      var msg = await SEA.verify(data, pair1.pub);
      expect(msg).to.be(enc);
      var dec = await SEA.decrypt(msg, pair1);
      expect(dec).to.be('hello self');
      var proof = await SEA.hash(dec, pair1);
      var check = await SEA.hash('hello self', pair1);
      expect(proof).to.be(check);
    });

    it('generates deterministic key pairs from ArrayBuffer seed', async function () {
      // Create ArrayBuffer seeds
      const textEncoder = new TextEncoder();
      const seedData1 = textEncoder.encode("my secret seed");  // Convert string to Uint8Array
      const seedBuffer1 = seedData1.buffer;  // Get the underlying ArrayBuffer
      
      // Create a second identical seed
      const seedData2 = textEncoder.encode("my secret seed");
      const seedBuffer2 = seedData2.buffer;
      
      // Create a different seed
      const seedData3 = textEncoder.encode("not my seed");
      const seedBuffer3 = seedData3.buffer;
      
      // Generate key pairs using ArrayBuffer seeds
      const pair1 = await SEA.pair(null, { seed: seedBuffer1 });
      const pair2 = await SEA.pair(null, { seed: seedBuffer2 });
      const pair3 = await SEA.pair(null, { seed: seedBuffer3 });
      
      // Check if pairs with same seed content are identical
      const sameKeys = pair1.priv === pair2.priv && 
                     pair1.pub === pair2.pub && 
                     pair1.epriv === pair2.epriv && 
                     pair1.epub === pair2.epub;
      
      // Check if pairs with different seeds are different
      const differentKeys = pair1.priv !== pair3.priv && 
                          pair1.pub !== pair3.pub && 
                          pair1.epriv !== pair3.epriv && 
                          pair1.epub !== pair3.epub;
      
      expect(sameKeys).to.be(true);
      expect(differentKeys).to.be(true);
      
      // Test with different ways to create ArrayBuffer seeds
      // Method 1: Direct encoding
      const buffer1 = textEncoder.encode("buffer-seed-test").buffer;
      
      // Method 2: Clone buffer from another array
      const tempArray = textEncoder.encode("buffer-seed-test");
      const buffer2 = tempArray.buffer.slice(0);
      
      // Generate key pairs
      const bufPair1 = await SEA.pair(null, { seed: buffer1 });
      const bufPair2 = await SEA.pair(null, { seed: buffer2 });
      
      // Keys should be identical
      expect(bufPair1.pub).to.be(bufPair2.pub);
      expect(bufPair1.priv).to.be(bufPair2.priv);
      expect(bufPair1.epub).to.be(bufPair2.epub);
      expect(bufPair1.epriv).to.be(bufPair2.epriv);
      
      // Test that different buffers produce different keys
      const buffer3 = textEncoder.encode("different-buffer-seed").buffer;
      const bufPair3 = await SEA.pair(null, { seed: buffer3 });
      
      expect(bufPair1.pub).to.not.be(bufPair3.pub);
      
      // Test that the created pair works with SEA functions
      var enc = await SEA.encrypt('hello self', bufPair1);
      var data = await SEA.sign(enc, bufPair1);
      var msg = await SEA.verify(data, bufPair1.pub);
      expect(msg).to.be(enc);
      var dec = await SEA.decrypt(msg, bufPair1);
      expect(dec).to.be('hello self');
      var proof = await SEA.hash(dec, bufPair1);
      var check = await SEA.hash('hello self', bufPair1);
      expect(proof).to.be(check);
    });
    
    it('generate key pairs from private key', async function () {
      const test1 = await SEA.pair(null, { seed: "seed" });
      const test2 = await SEA.pair(null, { priv: test1.priv });
      expect(test2.priv).to.be(test1.priv);
      expect(test2.pub).to.be(test1.pub);
      
      // Test that the created pair works with SEA functions
      var enc = await SEA.encrypt('hello self', test2);
      var data = await SEA.sign(enc, test2);
      var msg = await SEA.verify(data, test2.pub);
      expect(msg).to.be(enc);
      var dec = await SEA.decrypt(msg, test2);
      expect(dec).to.be('hello self');
      var proof = await SEA.hash(dec, test2);
      var check = await SEA.hash('hello self', test2);
      expect(proof).to.be(check);
      expect(test2.pub).to.be(test1.pub);
      const test3 = await SEA.pair(null, { epriv: test2.epriv });
      expect(test3.epriv).to.be(test2.epriv);
      expect(test3.epub).to.be(test2.epub);
    });
    
    it('handles different types of seed values correctly', async function () {
      // Test different seed types
      const testCases = [
        { type: "empty string", seed: "" },
        { type: "numeric", seed: "12345" },
        { type: "special chars", seed: "!@#$%^&*()" },
        { type: "long string", seed: "a".repeat(1000) },
        { type: "unicode", seed: "😀🔑🔒👍" }
      ];
      
      // Generate pairs for each test case
      const results = [];
      for (const test of testCases) {
        try {
          const pair = await SEA.pair(null, { seed: test.seed });
          
          // Check if pair has all required properties
          const isValid = pair && 
                        typeof pair.pub === 'string' && 
                        typeof pair.priv === 'string' &&
                        typeof pair.epub === 'string' &&
                        typeof pair.epriv === 'string';
                        
          results.push({ ...test, success: isValid, pair: pair });
        } catch (e) {
          results.push({ ...test, success: false, error: e.message });
        }
      }
      
      // All test cases should succeed
      const allSucceeded = results.every(r => r.success);
      expect(allSucceeded).to.be(true);
      
      // All pairs should be different from each other
      const uniquePairs = new Set(results.map(r => r.pair?.pub));
      expect(uniquePairs.size).to.be(results.length);
      
      // Similar seeds should produce different key pairs
      const seed1 = "test-seed";
      const seed2 = "test-seed1";
      const seed3 = "test-seed ";  // note the space
      const seed4 = "Test-seed";   // capitalization
      
      const pairs = await Promise.all([
        SEA.pair(null, { seed: seed1 }),
        SEA.pair(null, { seed: seed2 }),
        SEA.pair(null, { seed: seed3 }),
        SEA.pair(null, { seed: seed4 })
      ]);
      
      // Check that all pairs are different
      const [p1, p2, p3, p4] = pairs;
      expect(p1.pub).to.not.equal(p2.pub);
      expect(p1.pub).to.not.equal(p3.pub);
      expect(p1.pub).to.not.equal(p4.pub);
      expect(p2.pub).to.not.equal(p3.pub);
      expect(p2.pub).to.not.equal(p4.pub);
      expect(p3.pub).to.not.equal(p4.pub);
    });
    
    it('works with SEA operations (sign, verify, encrypt, decrypt)', async function () {
      // Test with sign/verify
      const seed = "sign-verify-seed";
      const pair = await SEA.pair(null, { seed });
      const message = "Hello deterministic world!";
      
      // Test signing and verification
      const signature = await SEA.sign(message, pair);
      const verified = await SEA.verify(signature, pair.pub);
      expect(verified).to.be(message);
      
      // Test with encrypt/decrypt
      const encryptSeed = "encrypt-decrypt-seed";
      const encPair = await SEA.pair(null, { seed: encryptSeed });
      const secretMessage = "Secret deterministic message";
      
      // Test encryption and decryption
      const encrypted = await SEA.encrypt(secretMessage, encPair);
      const decrypted = await SEA.decrypt(encrypted, encPair);
      expect(decrypted).to.be(secretMessage);
      
      // Test with SEA.secret (key exchange)
      const aliceSeed = "alice-deterministic";
      const bobSeed = "bob-deterministic";
      
      const alice = await SEA.pair(null, { seed: aliceSeed });
      const bob = await SEA.pair(null, { seed: bobSeed });
      
      // Generate shared secrets
      const aliceShared = await SEA.secret(bob.epub, alice);
      const bobShared = await SEA.secret(alice.epub, bob);
      
      expect(aliceShared).to.be(bobShared);
      
      // Test shared secret for encryption
      const sharedMessage = "Secret shared deterministically";
      const sharedEncrypted = await SEA.encrypt(sharedMessage, aliceShared);
      const sharedDecrypted = await SEA.decrypt(sharedEncrypted, bobShared);
      
      expect(sharedDecrypted).to.be(sharedMessage);
      
      // Test complete workflow
      const workflowSeed = "workflow-test-seed";
      const workflowPair = await SEA.pair(null, { seed: workflowSeed });
      const workflowMessage = "hello deterministic self";
      
      // Complete workflow: encrypt, sign, verify, decrypt
      const wfEncrypted = await SEA.encrypt(workflowMessage, workflowPair);
      const wfSigned = await SEA.sign(wfEncrypted, workflowPair);
      const wfVerified = await SEA.verify(wfSigned, workflowPair.pub);
      const wfDecrypted = await SEA.decrypt(wfVerified, workflowPair);
      
      expect(wfDecrypted).to.be(workflowMessage);
      
      // Test with SEA.hash
      const proof1 = await SEA.hash(workflowMessage, workflowPair);
      const proof2 = await SEA.hash(workflowMessage, workflowPair);
      
      expect(proof1).to.be(proof2);
    });
  });

  describe('Derive (additive)', function() {
    this.timeout(5000);
    const biToB64 = n => Buffer.from(n.toString(16).padStart(64, '0'), 'hex').toString('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    const P = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F");
    const n = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141");

    it('is deterministic for same priv + seed', async function () {
      const base = await SEA.pair();
      const seed = 'derive-determinism';
      const derived1 = await SEA.pair(null, { priv: base.priv, seed });
      const derived2 = await SEA.pair(null, { priv: base.priv, seed });

      expect(derived1.priv).to.be(derived2.priv);
      expect(derived1.pub).to.be(derived2.pub);
    });

    it('matches Bob/Alice derived pub (sign)', async function () {
      const base = await SEA.pair();
      const seed = 'derive-match-sign';

      const bob = await SEA.pair(null, { priv: base.priv, seed });
      const alice = await SEA.pair(null, { pub: base.pub, seed });

      expect(bob.pub).to.be(alice.pub);
    });

    it('matches Bob/Alice derived epub (encrypt)', async function () {
      const base = await SEA.pair();
      const seed = 'derive-match-encrypt';

      const bob = await SEA.pair(null, { epriv: base.epriv, seed });
      const alice = await SEA.pair(null, { epub: base.epub, seed });

      expect(bob.epub).to.be(alice.epub);
    });

    it('derives partial outputs based on inputs', async function () {
      const base = await SEA.pair();
      const seed = 'derive-partial';

      const onlyPriv = await SEA.pair(null, { priv: base.priv, seed });
      expect(onlyPriv.priv).to.be.ok();
      expect(onlyPriv.pub).to.be.ok();
      expect(onlyPriv.epriv).to.not.be.ok();
      expect(onlyPriv.epub).to.not.be.ok();

      const onlyPub = await SEA.pair(null, { pub: base.pub, seed });
      expect(onlyPub.pub).to.be.ok();
      expect(onlyPub.priv).to.not.be.ok();
      expect(onlyPub.epriv).to.not.be.ok();
      expect(onlyPub.epub).to.not.be.ok();
    });

    it('rejects invalid pub format', async function () {
      let error;
      try {
        await SEA.pair(null, { pub: 'invalid', seed: 'derive-invalid-format' });
      } catch (e) {
        error = e;
      }
      expect(!!error).to.be(true);
    });

    it('rejects pub not on curve', async function () {
      let error;
      try {
        await SEA.pair(null, { pub: 'AA.AA', seed: 'derive-off-curve' });
      } catch (e) {
        error = e;
      }
      expect(!!error).to.be(true);
    });

    it('rejects pub coordinates out of range', async function () {
      let error;
      try {
        const pub = biToB64(P) + '.' + biToB64(1n);
        await SEA.pair(null, { pub, seed: 'derive-out-of-range' });
      } catch (e) {
        error = e;
      }
      expect(!!error).to.be(true);
    });

    it('rejects priv out of range', async function () {
      let error;
      try {
        const priv = biToB64(n);
        await SEA.pair(null, { priv, seed: 'derive-priv-out-of-range' });
      } catch (e) {
        error = e;
      }
      expect(!!error).to.be(true);
    });

    it('rejects zero priv', async function () {
      let error;
      try {
        const priv = biToB64(0n);
        await SEA.pair(null, { priv, seed: 'derive-priv-zero' });
      } catch (e) {
        error = e;
      }
      expect(!!error).to.be(true);
    });
  });

  describe('User', function(){
    var gun = Gun(), gtmp;

    it("put to user graph without having to be authenticated (provide pair)", function(done){(async function(){
      var bob = await SEA.pair();
      gun.get(`~${bob.pub}`).get('test').put('this is Bob', (ack) => {
        gun.get(`~${bob.pub}`).get('test').once((data) => {
          expect(ack.err).to.not.be.ok()
          expect(data).to.be('this is Bob')
          done();
        })
      }, {opt: {authenticator: bob}})
    })()});

    it("put to user graph using external authenticator (nested SEA.sign)", function(done){(async function(){
      var bob = await SEA.pair();
      async function authenticator(data) {
        const sig = await SEA.sign(data, bob)
        return sig
      }
      gun.get(`~${bob.pub}`).get('test').put('this is Bob', (ack) => {
        gun.get(`~${bob.pub}`).get('test').once((data) => {
          expect(ack.err).to.not.be.ok()
          expect(data).to.be('this is Bob')
          done();
        })
      }, {opt: {authenticator: authenticator}})
    })()});

    it("put to user graph deep with authenticator", function(done){(async function(){
      var bob = await SEA.pair();
      var encrypted = await SEA.encrypt('secret', bob);
      gun.get(`~${bob.pub}`).get('a').get('b').put(encrypted, (ack) => {
        gun.get(`~${bob.pub}`).get('a').get('b').once((data) => {
          expect(ack.err).to.not.be.ok()
          expect(data).to.be(encrypted)
          done();
        })
      }, {opt: {authenticator: bob}})
    })()});

    it("accepts shard intermediate when link target matches child soul", function(done){(async function(){
      var bob = await SEA.pair();
      var key = bob.pub.slice(0, 2);
      var expected = '~/' + key;
      gun.get('~').get(key).put({'#': expected}, function(ack){
        expect(ack.err).to.not.be.ok();
        done();
      }, {opt: {authenticator: bob}})
    })()});

    it("rejects shard intermediate when link target mismatches child soul", function(done){(async function(){
      var bob = await SEA.pair();
      var key = bob.pub.slice(0, 2);
      gun.get('~').get(key).put({'#': '~/zz'}, function(ack){
        expect(ack.err).to.be.ok();
        done();
      }, {opt: {authenticator: bob}})
    })()});

    it("rejects shard intermediate when value is not link", function(done){
      gun.get('~').get('ab').put('no-link', function(ack){
        expect(ack.err).to.be.ok();
        done();
      })
    });

    it("accepts shard intermediate with external async authenticator", function(done){(async function(){
      var bob = await SEA.pair();
      var key = bob.pub.slice(0, 2);
      var expected = '~/' + key;
      async function authenticator(data){ return SEA.sign(data, bob) }
      gun.get('~').get(key).put({'#': expected}, function(ack){
        expect(ack.err).to.not.be.ok();
        done();
      }, {opt: {authenticator: authenticator, pub: bob.pub}}) // function auth has no .pub — must pass opt.pub explicitly
    })()});

    it("rejects shard intermediate with function authenticator but missing opt.pub", function(done){(async function(){
      var bob = await SEA.pair();
      var key = bob.pub.slice(0, 2);
      var expected = '~/' + key;
      async function authenticator(data){ return SEA.sign(data, bob) }
      gun.get('~').get(key).put({'#': expected}, function(ack){
        expect(ack.err).to.be.ok(); // claim = undefined without opt.pub → "Invalid shard intermediate pub."
        done();
      }, {opt: {authenticator: authenticator}}) // no opt.pub → claim undefined
    })()});

    it("rejects shard intermediate with state too far in future", function(done){(async function(){
      var bob = await SEA.pair();
      var key = bob.pub.slice(0, 2);
      var expected = '~/' + key;
      // HAM.max is 1 week; inject a state 2 weeks in the future.
      // HAM now rejects immediately with an error — ack.err is set before SEA runs.
      var futureState = Gun.state() + (1000 * 60 * 60 * 24 * 14);
      gun.get('~').get(key).put({'#': expected}, function(ack){
        expect(ack.err).to.be.ok();
        done();
      }, {state: futureState, opt: {authenticator: bob}});
    })()});

    it("rejects shard intermediate without authenticator", function(done){(async function(){
      var bob = await SEA.pair();
      var key = bob.pub.slice(0, 2);
      var expected = '~/' + key;
      gun.get('~').get(key).put({'#': expected}, function(ack){
        expect(ack.err).to.be.ok();
        done();
      }) // no opt.authenticator
    })()});

    it("rejects shard intermediate with wrong pub prefix", function(done){(async function(){
      var bob = await SEA.pair();
      var alice = await SEA.pair();
      var key = bob.pub.slice(0, 2);
      while(alice.pub.slice(0, 2) === key){ alice = await SEA.pair() }
      var expected = '~/' + key;
      gun.get('~').get(key).put({'#': expected}, function(ack){
        expect(ack.err).to.be.ok(); // alice.pub doesn't start with key
        done();
      }, {opt: {authenticator: alice}})
    })()});

    it("rejects shard write with invalid key length", function(done){
      gun.get('~').get('abc').put({'#':'~/abc'}, function(ack){
        expect(ack.err).to.be.ok();
        done();
      })
    });

    it("rejects shard write when depth exceeds limit", function(done){
      var segs = Array(44).fill('ab');
      var soul = '~/' + segs.join('/');
      gun.get(soul).get('cd').put({'#': soul + '/cd'}, function(ack){
        expect(ack.err).to.be.ok();
        done();
      })
    });

    it("rejects shard leaf when value is raw pub string", function(done){(async function(){
      var bob = await SEA.pair();
      var chunks = bob.pub.match(/.{1,2}/g) || [];
      var key = chunks.pop();
      var soul = chunks.length ? '~/' + chunks.join('/') : '~';
      gun.get(soul).get(key).put(bob.pub, function(ack){
        expect(ack.err).to.be.ok();
        done();
      })
    })()});

    it("rejects shard leaf when value is null", function(done){(async function(){
      var bob = await SEA.pair();
      var chunks = bob.pub.match(/.{1,2}/g) || [];
      var key = chunks.pop();
      var soul = chunks.length ? '~/' + chunks.join('/') : '~';
      gun.get(soul).get(key).put(null, function(ack){
        expect(ack.err).to.be.ok();
        done();
      })
    })()});

    it("rejects shard leaf when value is a number", function(done){(async function(){
      var bob = await SEA.pair();
      var chunks = bob.pub.match(/.{1,2}/g) || [];
      var key = chunks.pop();
      var soul = chunks.length ? '~/' + chunks.join('/') : '~';
      gun.get(soul).get(key).put(42, function(ack){
        expect(ack.err).to.be.ok();
        done();
      })
    })()});

    it("rejects shard leaf when link points to wrong soul", function(done){(async function(){
      var bob = await SEA.pair();
      var chunks = bob.pub.match(/.{1,2}/g) || [];
      var key = chunks.pop();
      var soul = chunks.length ? '~/' + chunks.join('/') : '~';
      gun.get(soul).get(key).put({'#': soul + '/' + key}, function(ack){
        expect(ack.err).to.be.ok(); // link must point to ~pub not intermediate path
        done();
      })
    })()});

    it("rejects shard leaf without authenticator", function(done){(async function(){
      var bob = await SEA.pair();
      var chunks = bob.pub.match(/.{1,2}/g) || [];
      var key = chunks.pop();
      var soul = chunks.length ? '~/' + chunks.join('/') : '~';
      gun.get(soul).get(key).put({'#': '~' + bob.pub}, function(ack){
        expect(ack.err).to.be.ok(); // no authenticator — rejected
        done();
      })
    })()});

    it("put to shard leaf with authenticator pair", function(done){(async function(){
      var bob = await SEA.pair();
      var chunks = bob.pub.match(/.{1,2}/g) || [];
      var key = chunks.pop();
      var soul = chunks.length ? '~/' + chunks.join('/') : '~';
      gun.get(soul).get(key).put({'#': '~' + bob.pub}, function(ack){
        expect(ack.err).to.not.be.ok();
        done();
      }, {opt: {authenticator: bob}})
    })()});

    it("put to shard leaf with external authenticator", function(done){(async function(){
      var bob = await SEA.pair();
      var chunks = bob.pub.match(/.{1,2}/g) || [];
      var key = chunks.pop();
      var soul = chunks.length ? '~/' + chunks.join('/') : '~';
      async function authenticator(data){
        return SEA.sign(data, bob)
      }
      gun.get(soul).get(key).put({'#': '~' + bob.pub}, function(ack){
        expect(ack.err).to.not.be.ok();
        done();
      }, {opt: {authenticator: authenticator}})
    })()});

    it("full chain put: gun.get('~').get(c0)...get(cN).put({#:~pub}) registers full path", function(done){(async function(){
      var bob = await SEA.pair();
      var chunks = bob.pub.match(/.{1,2}/g) || [];
      var node;
      if(USE_ZEN){
        var key = chunks.pop();
        var soul = chunks.length ? '~/' + chunks.join('/') : '~';
        node = gun.get(soul).get(key);
      } else {
        // Chain: gun.get('~').get(chunks[0]).get(chunks[1])...get(chunks[N]).put(leaf)
        node = gun.get('~');
        for(var i = 0; i < chunks.length; i++){ node = node.get(chunks[i]) }
      }
      node.put({'#': '~' + bob.pub}, function(ack){
        expect(ack.err).to.not.be.ok();
        done();
      }, {opt: {authenticator: bob}})
    })()});

    it("full chain put: rejects when no authenticator", function(done){(async function(){
      var bob = await SEA.pair();
      var chunks = bob.pub.match(/.{1,2}/g) || [];
      var node = gun.get('~');
      for(var i = 0; i < chunks.length; i++){ node = node.get(chunks[i]) }
      node.put({'#': '~' + bob.pub}, function(ack){
        expect(ack.err).to.be.ok();
        done();
      }) // no authenticator
    })()});

    it("rejects shard path with double slash", function(done){
      gun.get('~/ab//cd').get('ef').put({'#':'~/ab//cd/ef'}, function(ack){
        expect(ack.err).to.be.ok();
        done();
      })
    });

    it("rejects shard path with trailing slash", function(done){
      gun.get('~/ab/cd/').get('ef').put({'#':'~/ab/cd//ef'}, function(ack){
        expect(ack.err).to.be.ok();
        done();
      })
    });

    it("rejects hash mismatch inside user graph (~pub)", function(done){(async function(){
      var bob = await SEA.pair();
      gun.get(`~${bob.pub}`).get('payload#deadbeef').put('hello world', function(ack){
        expect(ack.err).to.be.ok();
        done();
      }, {opt: {authenticator: bob}})
    })()});

    it("rejects hash mismatch at depth 2 under ~pub", function(done){(async function(){
      var bob = await SEA.pair();
      gun.get(`~${bob.pub}`).get('parent').get('payload#deadbeef').put('hello world', function(ack){
        expect(ack.err).to.be.ok();
        done();
      }, {opt: {authenticator: bob}})
    })()});

    it("rejects hash mismatch at depth 3 under ~pub", function(done){(async function(){
      var bob = await SEA.pair();
      gun.get(`~${bob.pub}`).get('parent').get('child').get('payload#deadbeef').put('hello world', function(ack){
        expect(ack.err).to.be.ok();
        done();
      }, {opt: {authenticator: bob}})
    })()});

    it("does not leak authenticator on out", function(done){(async function(){
      var g = Gun();
      var bob = await SEA.pair();
      g.on('out', function(msg){
        if(msg.put){
          var meta = msg._ || {};
          expect(Object.prototype.propertyIsEnumerable.call(meta, 'sea')).to.be(false);
          expect(((msg.opt||{}).authenticator)).to.not.be.ok();
        }
        this.to.next(msg);
      });
      g.get(`~${bob.pub}`).get('a').get('b').put('x', (ack) => {
        expect(ack.err).to.not.be.ok();
        done();
      }, {opt: {authenticator: bob}})
    })()});

    

    

    describe('node', function(){
      var u;
      if(''+u === typeof process){ return }
      console.log("REMEMBER TO RUN mocha test/sea/nodeauth !!!!");
    });

  });

  if(!USE_ZEN && 'function' === typeof SEA.certify){ describe('CERTIFY', function () {
    var gun = Gun()

    it('Certify: Simple', function(done){(async function(){
      var alice = await SEA.pair()
      var bob = await SEA.pair()
      var cert = await SEA.certify(bob, {"*": "private"}, alice)
      var data = Gun.state().toString(36)
      gun.get("~" + alice.pub)
        .get("private")
        .get("asdf")
        .get("qwerty")
        .put(data, () => {
          gun.get("~" + alice.pub)
          .get("private")
          .get("asdf")
          .get("qwerty").once(_data=>{
            expect(_data).to.be(data)
            done()
          })
        }, { opt: { cert, authenticator: bob } })
    }())})

    it('Certify: Attack', function(done){(async function(){
      var alice = await SEA.pair()
      var bob = await SEA.pair()
      var cert = await SEA.certify(bob, {"*": "private"}, alice);
      
      var data = Gun.state().toString(36)
      gun.get("~" + alice.pub)
        .get("wrongway")
        .get("asdf")
        .get("qwerty")
        .put(data, ack => {
          expect(ack.err).to.be.ok()
          done()
        }, { opt: { cert, authenticator: bob } })
    }())})

    it('Certify: Public inbox', function(done){(async function(){
      var alice = await SEA.pair()
      var bob = await SEA.pair()
      var cert = await SEA.certify('*', [{"*": "test", "+": "*"}, {"*": "inbox", "+": "*"}], alice)
      var data = Gun.state().toString(36)
      gun.get("~" + alice.pub)
        .get("inbox")
        .get(bob.pub)
        .put(data, ack => {
          expect(ack.err).to.not.be.ok()
          done()
        }, { opt: { cert, authenticator: bob } })
    }())});

    it('Certify: Deep content addressing write', function(done){(async function(){
      var alice = await SEA.pair()
      var bob = await SEA.pair()
      var cert = await SEA.certify(bob, {"*": "private"}, alice)

      var data = Gun.state().toString(36)
      var fullHash = await SEA.hash(data, null, null, {name: 'SHA-256'})
      var hash = fullHash.slice(-20)

      gun.get("~" + alice.pub)
        .get("private")
        .get("thread")
        .get("message#" + hash)
        .put(data, ack => {
          expect(ack.err).to.not.be.ok()
          gun.get("~" + alice.pub)
            .get("private")
            .get("thread")
            .get("message#" + hash)
            .once(_data => {
              expect(_data).to.be(data)
              done()
            })
        }, { opt: { cert, authenticator: bob } })
    }())})

    it('Certify: Deep content addressing reject mismatch', function(done){(async function(){
      var alice = await SEA.pair()
      var bob = await SEA.pair()
      var cert = await SEA.certify(bob, {"*": "private"}, alice)
      var data = Gun.state().toString(36)

      gun.get("~" + alice.pub)
        .get("private")
        .get("thread")
        .get("message#deadbeef")
        .put(data, ack => {
          expect(ack.err).to.be.ok()
          done()
        }, { opt: { cert, authenticator: bob } })
    }())})

    it('Certify: Expiry', function(done){(async function(){
      var alice = await SEA.pair()
      var bob = await SEA.pair()
      var cert = await SEA.certify(bob, {"*": "private"}, alice, null, {
        expiry: Gun.state() - 100, // expired 100 milliseconds ago
      })

      var data = Gun.state().toString(36)
      gun.get("~" + alice.pub)
        .get("private")
        .get("asdf")
        .get("qwerty")
        .put(data, ack => {
          expect(ack.err).to.be.ok()
          done()
        }, { opt: { cert, authenticator: bob } })
    }())})

    it('Certify: Path or Key must contain Certificant Pub', function(done){(async function(){
      var alice = await SEA.pair()
      var bob = await SEA.pair()
      var cert = await SEA.certify(bob, {"*": "private", "+": "*"}, alice)

      var data = Gun.state().toString(36)
      gun.get("~" + alice.pub)
        .get("private")
        .get('wrongway')
        .put(data, ack => {
          expect(ack.err).to.be.ok()
          gun.get("~" + alice.pub)
          .get("private")
          .get(bob.pub)
          .get('today')
          .put(data, ack => {
            expect(ack.err).to.not.be.ok()
            gun.get("~" + alice.pub)
            .get("private")
            .get(bob.pub)
            .get('today')
            .once(_data => {
              expect(_data).to.be(data)
              done()
            })
          }, { opt: { cert, authenticator: bob } })
        }, { opt: { cert, authenticator: bob } })
    }())})

    it('Certify: Advanced - Block', function(done){(async function(){
      var alice = await SEA.pair()
      var dave = await SEA.pair()
      var bob = await SEA.pair()
      var cert = await SEA.certify(bob, {"*": "private"}, alice, null, {
        expiry: Gun.state() + 5000, // expires in 5 seconds
        block: 'block' // path to block in Alice's graph
      })
      var put = function(chain, data, opt){
        return new Promise(function(res){
          chain.put(data, function(ack){ res(ack || {}) }, opt);
        });
      };

      // Alice points her block to Dave's graph
      await put(gun.get("~" + alice.pub).get('block'), {'#': '~'+dave.pub+'/block'}, {opt: {authenticator: alice}});

      // Dave logins, he adds Bob to his block, which is connected to the certificate that Alice issued for Bob
      await put(gun.get("~" + dave.pub).get('block').get(bob.pub), true, {opt: {authenticator: dave}});

      // Bob logins and tries to hack Alice
      var data = Gun.state().toString(36)
      gun.get("~" + alice.pub)
          .get("private")
          .get("asdf")
          .get("qwerty")
          .put(data, ack => {
            expect(ack.err).to.be.ok()
            done()
          }, { opt: { cert, authenticator: bob } })
    }())})

  }); }

  describe('Frozen', function () {
    it('Across spaces', function(done){(async function(){
      var gun = Gun();
      var alice = await SEA.pair();

      await new Promise(function(res){
        gun.get("~" + alice.pub).put({name: "Alice", country: "USA"}, function(){ res() }, {opt: {authenticator: alice}});
      });

      var data = "hello world";
      var hash = await SEA.hash(data, null, null, {name: "SHA-256"});
      hash = hash.slice(-20);
      await new Promise(function(res){
        gun.get('#users').get(hash).put(data, function(){ res() });
      });
      var test = await new Promise(function(res){
        gun.get('#users').get(hash).once(function(v){ res(v) });
      });
      expect(test).to.be(data);
      done();
    }())});
  });
})

}
