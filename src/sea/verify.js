import __root from './root.js';
import __shim from './shim.js';
import __settings from './settings.js';
import __verify from './secp256k1.verify.js';

let __defaultExport;
(function(){

    var SEA = __root;
    var shim = __shim;
    var S = __settings;
    var u;

    async function w(j, k, s) {
      var a = new Uint8Array(shim.Buffer.from(j.a, 'base64'));
      var c = shim.Buffer.from(j.c, 'base64').toString('utf8');
      var m = new TextEncoder().encode(j.m);
      var e = btoa(String.fromCharCode(...new Uint8Array(m))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
      if (JSON.parse(c).challenge !== e) throw "Challenge verification failed";
      var h = await (shim.ossl || shim.subtle).digest(
          {name: 'SHA-256'},
          new TextEncoder().encode(c)
      );
      var d = new Uint8Array(a.length + h.byteLength);
      d.set(a);
      d.set(new Uint8Array(h), a.length);
      if (s[0] !== 0x30) throw "Invalid DER signature format";
      var o = 2, r = new Uint8Array(64);
      for(var i = 0; i < 2; i++) {
        var l = s[o + 1];
        o += 2;
        if (s[o] === 0x00) { o++; l--; }
        var p = new Uint8Array(32).fill(0);
        p.set(s.slice(o, o + l), 32 - l);
        r.set(p, i * 32);
        o += l;
      }
      return (shim.ossl || shim.subtle).verify({ name: 'ECDSA', hash: {name: 'SHA-256'} }, k, r, d);
    }

    SEA.verify = SEA.verify || (async (d, p, cb, o) => { try {
      var j = await S.parse(d);
      if(false === p) return cb ? cb(await S.parse(j.m)) : await S.parse(j.m);

      o = o || {};

      try {
        if(j && j.a && j.c){
          var pub = p.pub || p;
          var b62 = SEA.base62;
          var xy = b62.pubToJwkXY(pub);
          var x = xy.x, y = xy.y;
          var k = await (shim.ossl || shim.subtle).importKey('jwk', {
              kty: 'EC', crv: 'P-256', x, y, ext: true, key_ops: ['verify']
          }, {name: 'ECDSA', namedCurve: 'P-256'}, false, ['verify']);
          var s = new Uint8Array(shim.Buffer.from(j.s || '', o.encode || 'base64'));
          var c = await w(j, k, s);
          if(!c) throw "Signature did not match";
          var raw = await S.parse(j.m);
          if(cb){ try{ cb(raw) }catch(e){} }
          return raw;
        }
        var verified = await __verify(d, p, null, o);
        var signedMessage = j && j.m;
        if(typeof signedMessage === 'string') {
          var parsed = await S.parse(signedMessage);
          if(parsed && typeof parsed === 'object' &&
             typeof parsed.ct === 'string' &&
             typeof parsed.iv === 'string' &&
             typeof parsed.s === 'string') {
            if(cb){ try{ cb(signedMessage) }catch(e){} }
            return signedMessage;
          }
        }
        if(cb){ try{ cb(verified) }catch(e){} }
        return verified;
      } catch(e) {
        if(cb){ cb() }
        return;
      }
    } catch(e) {
      SEA.err = e;
      if(SEA.throw){ throw e }
      if(cb){ cb() }
      return;
    }});

    __defaultExport = SEA.verify;

    SEA.opt.fallback = 0;

}());
export default __defaultExport;
