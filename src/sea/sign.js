import __root from './root.js';
import __shim from './shim.js';
import __settings from './settings.js';
import __sign from './secp256k1.sign.js';

let __defaultExport;
(function(){

    var SEA = __root;
    var shim = __shim;
    var S = __settings;
    var u;

    async function n(r, o, c) {
      try {
        if(!o.raw){ r = await shim.stringify(r) }
        if(c){ try{ c(r) }catch(e){} }
        return r;
      } catch(e) { return r }
    }

    async function w(r, j, o, c) {
      var x = {
        m: j,
        s: r.signature ? shim.Buffer.from(r.signature, 'binary').toString(o.encode || 'base64') : u,
        a: shim.Buffer.from(r.authenticatorData, 'binary').toString('base64'),
        c: shim.Buffer.from(r.clientDataJSON, 'binary').toString('base64')
      };
      if (!x.s || !x.a || !x.c) throw "WebAuthn signature invalid";
      return n(x, o, c);
    }

    SEA.sign = SEA.sign || (async (data, pair, cb, opt) => { try {
      opt = opt || {};
      if(u === data) throw '`undefined` not allowed.';
      if(!(pair||opt).priv && typeof pair !== 'function'){
        if(!SEA.I) throw 'No signing key.';
        pair = await SEA.I(null, {what: data, how: 'sign', why: opt.why});
      }

      var j = await S.parse(data);
      var c = opt.check = opt.check || j;

      if(SEA.verify && (S.check(c) || (c && c.s && c.m))
      && u !== (await SEA.verify(c, pair))){
        return n(await S.parse(c), opt, cb);
      }

      if(typeof pair === 'function') {
        var r = await pair(data);
        return r.authenticatorData ? w(r, j, opt, cb) : 
          n({m: j, s: typeof r === 'string' ? r : 
            r.signature && shim.Buffer.from(r.signature, 'binary').toString(opt.encode || 'base64')}, opt, cb);
      }

      return __sign(j, pair, cb, opt);
    } catch(e) {
      SEA.err = e;
      if(SEA.throw){ throw e }
      if(cb){ cb() }
      return;
    }});

    __defaultExport = SEA.sign;

}());
export default __defaultExport;
