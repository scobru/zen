let __bundleExport;
;(function(){

  /* UNBUILD */

  const MOD = { exports: {} };
function USE(arg, req){
    return req? USE[R(arg)] : arg.slice? USE[R(arg)] : function(mod, path){
      arg(mod = {exports: {}});
      USE[R(path)] = mod.exports;
    }
    function R(p){
      return p.split('/').slice(-1).toString().replace('.js','');
    }
  }
  var MODULE = MOD
  /* UNBUILD */

  ;USE(function(module){
    let __defaultExport;
    (function(){

        // Security, Encryption, and Authorization: SEA.js
        // MANDATORY READING: https://gun.eco/explainers/data/security.html
        // IT IS IMPLEMENTED IN A POLYFILL/SHIM APPROACH.
        // THIS IS AN EARLY ALPHA!

        var root = {};
        root.window = (typeof globalThis !== "undefined" && typeof window === "undefined" && typeof WorkerGlobalScope !== "undefined") ? globalThis : (typeof window !== "undefined" ? window : undefined);

        var tmp = root.window || root, u;
        var SEA = tmp.SEA || {};

        if(SEA.window = root.window){ SEA.window.SEA = SEA }

        try{ if(u+'' !== typeof MODULE){ MODULE.exports = SEA } }catch(e){}
        __defaultExport = SEA;

    }());
    module.exports = __defaultExport;
  })(USE, './root');

  ;USE(function(module){
    var __root = USE('./root.js', 1);
    (function(){

        var SEA = __root;
        try{ if(SEA.window){
          if(location.protocol.indexOf('s') < 0
          && location.host.indexOf('localhost') < 0
          && ! /^127\.\d+\.\d+\.\d+$/.test(location.hostname)
          && location.protocol.indexOf('blob:') < 0
          && location.protocol.indexOf('file:') < 0
          && location.origin != 'null'){
            console.warn('HTTPS needed for WebCrypto in SEA, redirecting...');
            location.protocol = 'https:'; // WebCrypto does NOT work without HTTPS!
          }
        } }catch(e){}

    }());
  })(USE, './https');

  ;USE(function(module){
    var __buffer = (typeof require !== 'undefined') ? USE('buffer') : undefined;
    (function(){

        var u, root = (typeof globalThis !== "undefined") ? globalThis : (typeof global !== "undefined" ? global : (typeof window !== "undefined" ? window : this));
        var native = {}
        native.btoa = (u+'' != typeof root.btoa) && root.btoa && root.btoa.bind(root);
        native.atob = (u+'' != typeof root.atob) && root.atob && root.atob.bind(root);
        if(u+'' == typeof Buffer){
          if(u+'' != typeof require){
            try{ root.Buffer = __buffer.Buffer }catch(e){ console.log("Please `npm install buffer` or add it to your package.json !") }
          }
        }
        if(u+'' != typeof Buffer){
          root.btoa = function(data){ return Buffer.from(data, "binary").toString("base64").replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');};
          root.atob = function(data){
            var tmp = data.replace(/-/g, '+').replace(/_/g, '/')
            while(tmp.length % 4){ tmp += '=' }
            return Buffer.from(tmp, "base64").toString("binary");
          };
          return;
        }
        if(native.btoa){
          root.btoa = function(data){ return native.btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, ''); };
        }
        if(native.atob){
          root.atob = function(data){
            var tmp = data.replace(/-/g, '+').replace(/_/g, '/')
            while(tmp.length % 4){ tmp += '=' }
            return native.atob(tmp);
          };
        }

    }());
  })(USE, './base64');

  ;USE(function(module){
    USE('./base64.js', 1);

    let __defaultExport;
    (function(){
      // This is Array extended to have .toString(['utf8'|'hex'|'base64'])
      function SeaArray() {}
      Object.assign(SeaArray, { from: Array.from })
      SeaArray.prototype = Object.create(Array.prototype)
      SeaArray.prototype.toString = function(enc, start, end) { enc = enc || 'utf8'; start = start || 0;
        const length = this.length
        if (enc === 'hex') {
          const buf = new Uint8Array(this)
          return [ ...Array(((end && (end + 1)) || length) - start).keys()]
          .map((i) => buf[ i + start ].toString(16).padStart(2, '0')).join('')
        }
        if (enc === 'utf8') {
          return Array.from(
            { length: (end || length) - start },
            (_, i) => String.fromCharCode(this[ i + start])
          ).join('')
        }
        if (enc === 'base64') {
          return btoa(this)
        }
      }
      __defaultExport = SeaArray;
    }());
    module.exports = __defaultExport;
  })(USE, './array');

  ;USE(function(module){
    USE('./base64.js', 1);
    var __array = USE('./array.js', 1);

    let __defaultExport;
    (function(){
      // This is Buffer implementation used in SEA. Functionality is mostly
      // compatible with NodeJS 'safe-buffer' and is used for encoding conversions
      // between binary and 'hex' | 'utf8' | 'base64'
      // See documentation and validation for safe implementation in:
      // https://github.com/feross/safe-buffer#update
      var SeaArray = __array;
      function SafeBuffer(...props) {
        console.warn('new SafeBuffer() is depreciated, please use SafeBuffer.from()')
        return SafeBuffer.from(...props)
      }
      SafeBuffer.prototype = Object.create(Array.prototype)
      Object.assign(SafeBuffer, {
        // (data, enc) where typeof data === 'string' then enc === 'utf8'|'hex'|'base64'
        from() {
          if (!Object.keys(arguments).length || arguments[0]==null) {
            throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
          }
          const input = arguments[0]
          let buf
          if (typeof input === 'string') {
            const enc = arguments[1] || 'utf8'
            if (enc === 'hex') {
              const bytes = input.match(/([\da-fA-F]{2})/g)
              .map((byte) => parseInt(byte, 16))
              if (!bytes || !bytes.length) {
                throw new TypeError('Invalid first argument for type \'hex\'.')
              }
              buf = SeaArray.from(bytes)
            } else if (enc === 'utf8' || 'binary' === enc) { // EDIT BY MARK: I think this is safe, tested it against a couple "binary" strings. This lets SafeBuffer match NodeJS Buffer behavior more where it safely btoas regular strings.
              const length = input.length
              const words = new Uint16Array(length)
              Array.from({ length: length }, (_, i) => words[i] = input.charCodeAt(i))
              buf = SeaArray.from(words)
            } else if (enc === 'base64') {
              const dec = atob(input)
              const length = dec.length
              const bytes = new Uint8Array(length)
              Array.from({ length: length }, (_, i) => bytes[i] = dec.charCodeAt(i))
              buf = SeaArray.from(bytes)
            } else if (enc === 'binary') { // deprecated by above comment
              buf = SeaArray.from(input) // some btoas were mishandled.
            } else {
              console.info('SafeBuffer.from unknown encoding: '+enc)
            }
            return buf
          }
          const byteLength = input.byteLength // what is going on here? FOR MARTTI
          const length = input.byteLength ? input.byteLength : input.length
          if (length) {
            let buf
            if (input instanceof ArrayBuffer) {
              buf = new Uint8Array(input)
            }
            return SeaArray.from(buf || input)
          }
        },
        // This is 'safe-buffer.alloc' sans encoding support
        alloc(length, fill = 0 /*, enc*/ ) {
          return SeaArray.from(new Uint8Array(Array.from({ length: length }, () => fill)))
        },
        // This is normal UNSAFE 'buffer.alloc' or 'new Buffer(length)' - don't use!
        allocUnsafe(length) {
          return SeaArray.from(new Uint8Array(Array.from({ length : length })))
        },
        // This puts together array of array like members
        concat(arr) { // octet array
          if (!Array.isArray(arr)) {
            throw new TypeError('First argument must be Array containing ArrayBuffer or Uint8Array instances.')
          }
          return SeaArray.from(arr.reduce((ret, item) => ret.concat(Array.from(item)), []))
        }
      })
      SafeBuffer.prototype.from = SafeBuffer.from
      SafeBuffer.prototype.toString = SeaArray.prototype.toString

      __defaultExport = SafeBuffer;
    }());
    module.exports = __defaultExport;
  })(USE, './buffer');

  ;USE(function(module){
    var __root = USE('./root.js', 1);
    var __buffer = USE('./buffer.js', 1);
    var __crypto = (typeof require !== 'undefined') ? USE('crypto') : undefined;
    var __webcrypto = (typeof require !== 'undefined') ? USE('@peculiar/webcrypto') : undefined;
    var __text_encoding = (typeof require !== 'undefined') ? USE('../lib/text-encoding/index.js') : undefined;

    let __defaultExport;
    (function(){

        const SEA = __root
        const globalScope = (typeof globalThis !== 'undefined') ? globalThis : (typeof global !== 'undefined' ? global : (typeof window !== 'undefined' ? window : {}));
        const api = {Buffer: __buffer || globalScope.Buffer}
        var o = {}, u;

        // ideally we can move away from JSON entirely? unlikely due to compatibility issues... oh well.
        JSON.parseAsync = JSON.parseAsync || function(t,cb,r){ var u; try{ cb(u, JSON.parse(t,r)) }catch(e){ cb(e) } }
        JSON.stringifyAsync = JSON.stringifyAsync || function(v,cb,r,s){ var u; try{ cb(u, JSON.stringify(v,r,s)) }catch(e){ cb(e) } }

        api.parse = function(t,r){ return new Promise(function(res, rej){
          JSON.parseAsync(t,function(err, raw){ err? rej(err) : res(raw) },r);
        })}
        api.stringify = function(v,r,s){ return new Promise(function(res, rej){
          JSON.stringifyAsync(v,function(err, raw){ err? rej(err) : res(raw) },r,s);
        })}

        if(SEA.window){
          api.crypto = SEA.window.crypto || SEA.window.msCrypto
          api.subtle = (api.crypto||o).subtle || (api.crypto||o).webkitSubtle;
          api.TextEncoder = SEA.window.TextEncoder;
          api.TextDecoder = SEA.window.TextDecoder;
          api.random = (len) => api.Buffer.from(api.crypto.getRandomValues(new Uint8Array(api.Buffer.alloc(len))));
        }
        if(!api.crypto && globalScope.crypto){
          api.crypto = globalScope.crypto;
          api.subtle = (api.crypto||o).subtle || (api.crypto||o).webkitSubtle;
          api.random = (len) => api.Buffer.from(api.crypto.getRandomValues(new Uint8Array(api.Buffer.alloc(len))));
        }
        if(!api.TextEncoder){ api.TextEncoder = globalScope.TextEncoder }
        if(!api.TextDecoder){ api.TextDecoder = globalScope.TextDecoder }
        if(!api.TextDecoder)
        {
          const { TextEncoder, TextDecoder } = __text_encoding;
          api.TextDecoder = TextDecoder;
          api.TextEncoder = TextEncoder;
        }
        if(!api.crypto)
        {
          try
          {
          var crypto = __crypto;
          Object.assign(api, {
            crypto,
            random: (len) => api.Buffer.from(crypto.randomBytes(len))
          });      
          const { Crypto: WebCrypto } = __webcrypto;
          api.ossl = api.subtle = new WebCrypto({directory: 'ossl'}).subtle // ECDH
        }
        catch(e){
          console.log("Please `npm install @peculiar/webcrypto` or add it to your package.json !");
        }}

        __defaultExport = api

    }());
    module.exports = __defaultExport;
  })(USE, './shim');

  ;USE(function(module){
    var __root = USE('./root.js', 1);
    var __shim = USE('./shim.js', 1);

    let __defaultExport;
    (function(){

        var SEA = __root;
        var shim = __shim;

        // Base62 alphabet: digits → uppercase → lowercase (62 chars, a-zA-Z0-9 only)
        var ALPHA = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var ALPHA_MAP = {};
        for (var i = 0; i < ALPHA.length; i++) { ALPHA_MAP[ALPHA[i]] = i; }

        // Fixed output length for a 256-bit (32-byte) value in base62
        // 62^44 > 2^256 ✓
        var PUB_LEN = 44;

        // BigInt → base62 string, zero-padded to PUB_LEN (44 chars)
        function biToB62(n) {
            if (typeof n !== 'bigint' || n < 0n) {
                throw new Error('biToB62: input must be non-negative BigInt');
            }
            var s = '';
            var v = n;
            while (v > 0n) {
                s = ALPHA[Number(v % 62n)] + s;
                v = v / 62n;
            }
            while (s.length < PUB_LEN) { s = '0' + s; }
            if (s.length > PUB_LEN) {
                throw new Error('biToB62: value too large for ' + PUB_LEN + '-char base62');
            }
            return s;
        }

        // base62 string → BigInt (accepts exactly PUB_LEN chars)
        function b62ToBI(s) {
            if (typeof s !== 'string' || s.length !== PUB_LEN) {
                throw new Error('b62ToBI: expected ' + PUB_LEN + '-char base62 string, got ' + (s && s.length));
            }
            if (!/^[A-Za-z0-9]+$/.test(s)) {
                throw new Error('b62ToBI: invalid base62 characters');
            }
            var n = 0n;
            for (var i = 0; i < s.length; i++) {
                var c = ALPHA_MAP[s[i]];
                if (c === undefined) { throw new Error('b62ToBI: unknown char ' + s[i]); }
                n = n * 62n + BigInt(c);
            }
            return n;
        }

        // base64url string (43 chars, from JWK) → base62 (44 chars)
        function b64ToB62(s) {
            if (typeof s !== 'string' || !s) {
                throw new Error('b64ToB62: input must be non-empty string');
            }
            var hex = shim.Buffer.from(atob(s), 'binary').toString('hex');
            var n = BigInt('0x' + (hex || '0'));
            return biToB62(n);
        }

        // base62 (44 chars) → base64url string (for JWK)
        function b62ToB64(s) {
            var n = b62ToBI(s);
            var hex = n.toString(16).padStart(64, '0');
            var b64 = shim.Buffer.from(hex, 'hex').toString('base64')
                .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
            return b64;
        }

        // Parse pub (old or new format) → { x, y } as base64url strings (for JWK importKey)
        // Old format: [43 base64url].[43 base64url]  length=87
        // New format: [44 base62][44 base62]          length=88
        function pubToJwkXY(pub) {
            if (typeof pub !== 'string') {
                throw new Error('pubToJwkXY: pub must be a string');
            }
            if (pub.length === 87 && pub[43] === '.') {
                // Old base64url format
                var parts = pub.split('.');
                if (parts.length !== 2) { throw new Error('pubToJwkXY: invalid old pub format'); }
                return { x: parts[0], y: parts[1] };
            }
            if (pub.length === 88 && /^[A-Za-z0-9]{88}$/.test(pub)) {
                // New base62 format
                return {
                    x: b62ToB64(pub.slice(0, 44)),
                    y: b62ToB64(pub.slice(44))
                };
            }
            throw new Error('pubToJwkXY: unrecognised pub format (length=' + pub.length + ')');
        }

        // Encode arbitrary Buffer/Uint8Array as base62: chunks into 32-byte blocks, each → 44 chars
        // e.g. SHA-256 (32B) → 44 chars, PBKDF2 (64B) → 88 chars
        function bufToB62(buf) {
            var out = '';
            for (var i = 0; i < buf.length; i += 32) {
                var end = Math.min(i + 32, buf.length);
                var hex = '';
                // left-pad short last chunk to 32 bytes
                for (var p = 0; p < 32 - (end - i); p++) { hex += '00'; }
                for (var j = i; j < end; j++) {
                    hex += ('0' + buf[j].toString(16)).slice(-2);
                }
                out += biToB62(BigInt('0x' + hex));
            }
            return out;
        }

        var b62 = { biToB62: biToB62, b62ToBI: b62ToBI, b64ToB62: b64ToB62, b62ToB64: b62ToB64, pubToJwkXY: pubToJwkXY, bufToB62: bufToB62, PUB_LEN: PUB_LEN };
        SEA.base62 = b62;
        __defaultExport = b62;

    }());
    module.exports = __defaultExport;
  })(USE, './base62');

  ;USE(function(module){
    var __root = USE('./root.js', 1);
    var __shim = USE('./shim.js', 1);

    let __defaultExport;
    (function(){

        var SEA = __root;
        var shim = __shim;
        var s = {};
        s.pbkdf2 = {hash: {name : 'SHA-256'}, iter: 100000, ks: 64};
        s.ecdsa = {
          pair: {name: 'ECDSA', namedCurve: 'secp256k1'},
          sign: {name: 'ECDSA', hash: {name: 'SHA-256'}}
        };
        s.ecdh = {name: 'ECDH', namedCurve: 'secp256k1'};

        // This creates Web Cryptography API compliant JWK for sign/verify purposes
        s.jwk = function(pub, d){  // d === priv
          var b62 = SEA.base62;
          var xy = b62.pubToJwkXY(pub); // handles old (87-char x.y) and new (88-char base62)
          var x = xy.x, y = xy.y;
          var jwk = {kty: "EC", crv: "secp256k1", x: x, y: y, ext: true};
          jwk.key_ops = d ? ['sign'] : ['verify'];
          // Convert base62 priv (44-char) back to base64url for WebCrypto JWK importKey
          if(d){ jwk.d = (d.length === 44 && /^[A-Za-z0-9]{44}$/.test(d)) ? b62.b62ToB64(d) : d }
          return jwk;
        };

        s.keyToJwk = function(keyBytes) {
          const keyB64 = keyBytes.toString('base64');
          const k = keyB64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
          return { kty: 'oct', k: k, ext: false, alg: 'A256GCM' };
        }

        s.recall = {
          validity: 12 * 60 * 60, // internally in seconds : 12 hours
          hook: function(props){ return props } // { iat, exp, alias, remember } // or return new Promise((resolve, reject) => resolve(props)
        };

        s.check = function(t){
          if(typeof t !== 'string'){ return false }
          if('SEA{' === t.slice(0,4)){ return true }
          if('{' !== t.slice(0,1)){ return false }
          try {
            var parsed = JSON.parse(t);
            return !!(parsed && (
              (typeof parsed.s === 'string' && Object.prototype.hasOwnProperty.call(parsed, 'm')) ||
              (typeof parsed.ct === 'string' && typeof parsed.iv === 'string' && typeof parsed.s === 'string')
            ));
          } catch (e) {}
          return false;
        }
        s.parse = async function p(t){ try {
          var yes = (typeof t == 'string');
          if(yes && 'SEA{' === t.slice(0,4)){ t = t.slice(3) }
          return yes ? await shim.parse(t) : t;
          } catch (e) {}
          return t;
        }

        SEA.opt = s;
        __defaultExport = s

    }());
    module.exports = __defaultExport;
  })(USE, './settings');

  ;USE(function(module){
    var __shim = USE('./shim.js', 1);

    let __defaultExport;
    (function(){

        var shim = __shim;
        __defaultExport = async function(d, o){
          var t = (typeof d == 'string')? d : await shim.stringify(d);
          var hash = await shim.subtle.digest({name: o||'SHA-256'}, new shim.TextEncoder().encode(t));
          return shim.Buffer.from(hash);
        }

    }());
    module.exports = __defaultExport;
  })(USE, './sha256');

  ;USE(function(module){
    var __shim_2 = USE('./shim.js', 1);

    let __defaultExport;
    (function(){

        // This internal func returns SHA-1 hashed data for KeyID generation
        const __shim = __shim_2
        const subtle = __shim.subtle
        const ossl = __shim.ossl ? __shim.ossl : subtle
        const sha1hash = (b) => ossl.digest({name: 'SHA-1'}, new ArrayBuffer(b))
        __defaultExport = sha1hash

    }());
    module.exports = __defaultExport;
  })(USE, './sha1');

  ;USE(function(module){
    var __root = USE('./root.js', 1);
    var __shim = USE('./shim.js', 1);
    var __settings = USE('./settings.js', 1);
    var __sha256 = USE('./sha256.js', 1);

    let __defaultExport;
    (function(){

        var SEA = __root;
        var shim = __shim;
        var S = __settings;
        var sha = __sha256;
        var u;

        SEA.work = SEA.work || (async (data, pair, cb, opt) => { try { // used to be named `proof`
          var salt = (pair||{}).epub || pair; // epub not recommended, salt should be random!
          opt = opt || {};
          var enc = opt.encode || 'base62';
          var b62 = SEA.base62;
          if(salt instanceof Function){
            cb = salt;
            salt = u;
          }
          // Check if data is an ArrayBuffer, if so use Uint8Array to access the data
          if(data instanceof ArrayBuffer){
            data = new Uint8Array(data);
            data = new shim.TextDecoder("utf-8").decode(data);
          }
          data = (typeof data == 'string') ? data : await shim.stringify(data);
          if('sha' === (opt.name||'').toLowerCase().slice(0,3)){
            var rsha = shim.Buffer.from(await sha(data, opt.name), 'binary');
            rsha = ('base62' === enc) ? b62.bufToB62(rsha) : ('base64' === enc) ? btoa(String.fromCharCode(...new Uint8Array(rsha))) : rsha.toString(enc);
            if(cb){ try{ cb(rsha) }catch(e){console.log(e)} }
            return rsha;
          }
          if (typeof salt === "number") salt = salt.toString();
          if (typeof opt.salt === "number") opt.salt = opt.salt.toString();
          salt = salt || shim.random(9);
          var key = await (shim.ossl || shim.subtle).importKey('raw', new shim.TextEncoder().encode(data), {name: opt.name || 'PBKDF2'}, false, ['deriveBits']);
          var work = await (shim.ossl || shim.subtle).deriveBits({
            name: opt.name || 'PBKDF2',
            iterations: opt.iterations || S.pbkdf2.iter,
            salt: new shim.TextEncoder().encode(opt.salt || salt),
            hash: opt.hash || S.pbkdf2.hash,
          }, key, opt.length || (S.pbkdf2.ks * 8))
          data = shim.random(data.length)  // Erase data in case of passphrase
          var r = shim.Buffer.from(work, 'binary');
          r = ('base62' === enc) ? b62.bufToB62(r) : ('base64' === enc) ? btoa(String.fromCharCode(...new Uint8Array(r))) : r.toString(enc);
          if(cb){ try{ cb(r) }catch(e){console.log(e)} }
          return r;
        } catch(e) { 
          console.log(e);
          SEA.err = e;
          if(SEA.throw){ throw e }
          if(cb){ cb() }
          return;
        }});

        __defaultExport = SEA.work;

    }());
    module.exports = __defaultExport;
  })(USE, './work');

  ;USE(function(module){
    var __root = USE('./root.js', 1);
    var __pair = USE('./secp256k1.pair.js', 1);

    let __defaultExport;
    (function(){

        var SEA = __root;
        SEA.pair = SEA.pair || (async (cb, opt) => { try {
          return await __pair(cb, opt);
        } catch(e) {
          SEA.err = e;
          if(SEA.throw) throw e;
          if(cb) try { cb(); } catch(cbErr) {}
          return;
        }});

        __defaultExport = SEA.pair;

    }());
    module.exports = __defaultExport;
  })(USE, './pair');

  ;USE(function(module){
    var __root = USE('./root.js', 1);
    var __shim = USE('./shim.js', 1);
    var __settings = USE('./settings.js', 1);
    var __sign = USE('./secp256k1.sign.js', 1);

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
    module.exports = __defaultExport;
  })(USE, './sign');

  ;USE(function(module){
    var __root = USE('./root.js', 1);
    var __shim = USE('./shim.js', 1);
    var __settings = USE('./settings.js', 1);
    var __verify = USE('./secp256k1.verify.js', 1);

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
    module.exports = __defaultExport;
  })(USE, './verify');

  ;USE(function(module){
    var __shim = USE('./shim.js', 1);
    var __settings = USE('./settings.js', 1);
    var __sha256 = USE('./sha256.js', 1);

    let __defaultExport;
    (function(){

        var shim = __shim;
        var S = __settings;
        var sha256hash = __sha256;

        const importGen = async (key, salt, opt) => {
          //const combo = shim.Buffer.concat([shim.Buffer.from(key, 'utf8'), salt || shim.random(8)]).toString('utf8') // old
          opt = opt || {};
          const combo = key + (salt || shim.random(8)).toString('utf8'); // new
          const hash = shim.Buffer.from(await sha256hash(combo), 'binary')

          const jwkKey = S.keyToJwk(hash)      
          return await shim.subtle.importKey('jwk', jwkKey, {name:'AES-GCM'}, false, ['encrypt', 'decrypt'])
        }
        __defaultExport = importGen;

    }());
    module.exports = __defaultExport;
  })(USE, './aeskey');

  ;USE(function(module){
    var __root = USE('./root.js', 1);
    var __encrypt = USE('./secp256k1.encrypt.js', 1);

    let __defaultExport;
    (function(){

        var SEA = __root;
        var u;

        SEA.encrypt = SEA.encrypt || (async (data, pair, cb, opt) => { try {
          opt = opt || {};
          var key = (pair||opt).epriv || pair;
          if(u === data){ throw '`undefined` not allowed.' }
          if(!key){
            if(!SEA.I){ throw 'No encryption key.' }
            pair = await SEA.I(null, {what: data, how: 'encrypt', why: opt.why});
            key = pair.epriv || pair;
          }
          return await __encrypt(data, key, cb, opt);
        } catch(e) { 
          console.log(e);
          SEA.err = e;
          if(SEA.throw){ throw e }
          if(cb){ cb() }
          return;
        }});

        __defaultExport = SEA.encrypt;

    }());
    module.exports = __defaultExport;
  })(USE, './encrypt');

  ;USE(function(module){
    var __root = USE('./root.js', 1);
    var __decrypt = USE('./secp256k1.decrypt.js', 1);

    let __defaultExport;
    (function(){

        var SEA = __root;

        SEA.decrypt = SEA.decrypt || (async (data, pair, cb, opt) => { try {
          opt = opt || {};
          var key = (pair||opt).epriv || pair;
          if(!key){
            if(!SEA.I){ throw 'No decryption key.' }
            pair = await SEA.I(null, {what: data, how: 'decrypt', why: opt.why});
            key = pair.epriv || pair;
          }
          return await __decrypt(data, key, cb, opt);
        } catch(e) { 
          SEA.err = e;
          if(SEA.throw){ throw e }
          if(cb){ cb() }
          return;
        }});

        __defaultExport = SEA.decrypt;

    }());
    module.exports = __defaultExport;
  })(USE, './decrypt');

  ;USE(function(module){
    var __root = USE('./root.js', 1);
    var __secret = USE('./secp256k1.secret.js', 1);

    let __defaultExport;
    (function(){

        var SEA = __root;
        // Derive shared secret from other's pub and my epub/epriv 
        SEA.secret = SEA.secret || (async (key, pair, cb, opt) => { try {
          opt = opt || {};
          if(!pair || !pair.epriv || !pair.epub){
            if(!SEA.I){ throw 'No secret mix.' }
            pair = await SEA.I(null, {what: key, how: 'secret', why: opt.why});
          }
          return await __secret(key, pair, cb, opt);
        } catch(e) {
          console.log(e);
          SEA.err = e;
          if(SEA.throw){ throw e }
          if(cb){ cb() }
          return;
        }});

        __defaultExport = SEA.secret;

    }());
    module.exports = __defaultExport;
  })(USE, './secret');

  ;USE(function(module){
    var __root = USE('./root.js', 1);

    let __defaultExport;
    (function(){

        var SEA = __root;
        // This is to certify that a group of "certificants" can "put" anything at a group of matched "paths" to the certificate authority's graph
        SEA.certify = SEA.certify || (async (certificants, policy = {}, authority, cb, opt = {}) => { try {
          /*
          The Certify Protocol was made out of love by a Vietnamese code enthusiast. Vietnamese people around the world deserve respect!
          IMPORTANT: A Certificate is like a Signature. No one knows who (authority) created/signed a cert until you put it into their graph.
          "certificants": '*' or a String (Bob.pub) || an Object that contains "pub" as a key || an array of [object || string]. These people will have the rights.
          "policy": A string ('inbox'), or a RAD/LEX object {'*': 'inbox'}, or an Array of RAD/LEX objects or strings. RAD/LEX object can contain key "?" with indexOf("*") > -1 to force key equals certificant pub. This rule is used to check against soul+'/'+key using Gun.text.match or String.match.
          "authority": Key pair or priv of the certificate authority.
          "cb": A callback function after all things are done.
          "opt": If opt.expiry (a timestamp) is set, SEA won't sync data after opt.expiry. If opt.block is set, SEA will look for block before syncing.
          */

          certificants = (() => {
            var data = []
            if (certificants) {
              if ((typeof certificants === 'string' || Array.isArray(certificants)) && certificants.indexOf('*') > -1) return '*'
              if (typeof certificants === 'string') return certificants
              if (Array.isArray(certificants)) {
                if (certificants.length === 1 && certificants[0]) return typeof certificants[0] === 'object' && certificants[0].pub ? certificants[0].pub : typeof certificants[0] === 'string' ? certificants[0] : null
                certificants.map(certificant => {
                  if (typeof certificant ==='string') data.push(certificant)
                  else if (typeof certificant === 'object' && certificant.pub) data.push(certificant.pub)
                })
              }

              if (typeof certificants === 'object' && certificants.pub) return certificants.pub
              return data.length > 0 ? data : null
            }
            return
          })()

          if (!certificants) return console.log("No certificant found.")

          const expiry = opt.expiry && (typeof opt.expiry === 'number' || typeof opt.expiry === 'string') ? parseFloat(opt.expiry) : null
          const readPolicy = (policy || {}).read ? policy.read : null
          const writePolicy = (policy || {}).write ? policy.write : typeof policy === 'string' || Array.isArray(policy) || policy["+"] || policy["#"] || policy["."] || policy["="] || policy["*"] || policy[">"] || policy["<"] ? policy : null
          // The "blacklist" feature is now renamed to "block". Why ? BECAUSE BLACK LIVES MATTER!
          // We can now use 3 keys: block, blacklist, ban
          const block = (opt || {}).block || (opt || {}).blacklist || (opt || {}).ban || {}
          const readBlock = block.read && (typeof block.read === 'string' || (block.read || {})['#']) ? block.read : null
          const writeBlock = typeof block === 'string' ? block : block.write && (typeof block.write === 'string' || block.write['#']) ? block.write : null

          if (!readPolicy && !writePolicy) return console.log("No policy found.")

          // reserved keys: c, e, r, w, rb, wb
          const data = JSON.stringify({
            c: certificants,
            ...(expiry ? {e: expiry} : {}), // inject expiry if possible
            ...(readPolicy ? {r: readPolicy }  : {}), // "r" stands for read, which means read permission.
            ...(writePolicy ? {w: writePolicy} : {}), // "w" stands for write, which means write permission.
            ...(readBlock ? {rb: readBlock} : {}), // inject READ block if possible
            ...(writeBlock ? {wb: writeBlock} : {}), // inject WRITE block if possible
          })

          const certificate = await SEA.sign(data, authority, null, {raw:1})

          var r = certificate
          if(!opt.raw){ r = 'SEA'+JSON.stringify(r) }
          if(cb){ try{ cb(r) }catch(e){console.log(e)} }
          return r;
        } catch(e) {
          SEA.err = e;
          if(SEA.throw){ throw e }
          if(cb){ cb() }
          return;
        }});

        __defaultExport = SEA.certify;

    }());
    module.exports = __defaultExport;
  })(USE, './certify');

  ;USE(function(module){
    var __shim = USE('./shim.js', 1);
    var __sha1 = USE('./sha1.js', 1);
    var __root = USE('./root.js', 1);
    var __work = USE('./work.js', 1);
    var __sign = USE('./sign.js', 1);
    var __verify = USE('./verify.js', 1);
    var __encrypt = USE('./encrypt.js', 1);
    var __decrypt = USE('./decrypt.js', 1);
    var __certify = USE('./certify.js', 1);
    var __buffer = USE('./buffer.js', 1);

    let __defaultExport;
    (function(){

        var shim = __shim;
        var sha1hash = __sha1;
        // Practical examples about usage found in tests.
        var SEA = __root;
        SEA.work = __work;
        SEA.sign = __sign;
        SEA.verify = __verify;
        SEA.encrypt = __encrypt;
        SEA.decrypt = __decrypt;
        SEA.certify = __certify;
        // SEA.opt.aeskey is intentionally left disabled; it caused WebCrypto issues upstream.

        SEA.random = SEA.random || shim.random;

        // This is Buffer used in SEA and usable from Gun/SEA application also.
        // For documentation see https://nodejs.org/api/buffer.html
        SEA.Buffer = SEA.Buffer || __buffer;

        // These SEA functions support now ony Promises or
        // async/await (compatible) code, use those like Promises.
        //
        // Creates a wrapper library around Web Crypto API
        // for various AES, ECDSA, PBKDF2 functions we called above.
        // Calculate public key KeyID aka PGPv4 (result: 8 bytes as hex string)
        SEA.keyid = SEA.keyid || (async (pub) => {
          try {
            // Decode pub key coordinates (handles old 87-char base64url and new 88-char base62)
            var xy = SEA.base62.pubToJwkXY(pub);
            const pb = shim.Buffer.concat(
              [xy.x, xy.y].map((t) => shim.Buffer.from(atob(t.replace(/-/g,'+').replace(/_/g,'/')), 'binary'))
            )
            // id is PGPv4 compliant raw key
            const id = shim.Buffer.concat([
              shim.Buffer.from([0x99, pb.length / 0x100, pb.length % 0x100]), pb
            ])
            const sha1 = await sha1hash(id)
            const hash = shim.Buffer.from(sha1, 'binary')
            return hash.toString('hex', hash.length - 8)  // 16-bit ID as hex
          } catch (e) {
            console.log(e)
            throw e
          }
        });
        // all done!
        // Obviously it is missing MANY necessary features. This is only an alpha release.
        // Please experiment with it, audit what I've done so far, and complain about what needs to be added.
        // SEA should be a full suite that is easy and seamless to use.
        // Again, scroll naer the top, where I provide an EXAMPLE of how to create a user and sign in.
        // Once logged in, the rest of the code you just read handled automatically signing/validating data.
        // But all other behavior needs to be equally easy, like opinionated ways of
        // Adding friends (trusted public keys), sending private messages, etc.
        // Cheers! Tell me what you think.
        ((SEA.window||{}).GUN||{}).SEA = SEA;

        __defaultExport = SEA
        // -------------- END SEA MODULES --------------------
        // -- BEGIN SEA+GUN MODULES: BUNDLED BY DEFAULT UNTIL OTHERS USE SEA ON OWN -------

    }());
    module.exports = __defaultExport;
  })(USE, './sea');

  ;USE(function(module){
    var __gun = (typeof GUN !== 'undefined') ? GUN : ((typeof Gun !== 'undefined') ? Gun : ((typeof require !== 'undefined') ? USE('../gun.js') : undefined));

    (function(){

        var u, Gun = (''+u != typeof GUN)? (GUN||{chain:{}}) : __gun;
        Gun.chain.then = function(cb, opt){
          var gun = this, p = (new Promise(function(res, rej){
            gun.once(res, opt);
          }));
          return cb? p.then(cb) : p;
        }

    }());
  })(USE, './then');

  ;USE(function(module){
    var __sea = USE('./sea.js', 1);
    var __settings = USE('./settings.js', 1);
    var __gun = (typeof GUN !== 'undefined') ? GUN : ((typeof Gun !== 'undefined') ? Gun : ((typeof require !== 'undefined') ? USE('../gun.js') : undefined));
    (function(){

        var SEA = __sea, S = __settings, noop = function() {}, u;
        var Gun = (SEA.window||'').GUN || __gun;
        // After we have a GUN extension to make user registration/login easy, we then need to handle everything else.

        // We do this with a GUN adapter, we first listen to when a gun instance is created (and when its options change)
        Gun.on('opt', function(at){
          if(!at.sea){ // only add SEA once per instance, on the "at" context.
            at.sea = {own: {}};
            at.on('put', check, at); // SEA now runs its firewall on HAM diffs, not all i/o.
          }
          this.to.next(at); // make sure to call the "next" middleware adapter.
        });

        // Alright, this next adapter gets run at the per node level in the graph database.
        // correction: 2020 it gets run on each key/value pair in a node upon a HAM diff.
        // This will let us verify that every property on a node has a value signed by a public key we trust.
        // If the signature does not match, the data is just `undefined` so it doesn't get passed on.
        // If it does match, then we transform the in-memory "view" of the data into its plain value (without the signature).
        // Now NOTE! Some data is "system" data, not user data. Example: List of public keys, aliases, etc.
        // This data is self-enforced (the value can only match its ID), but that is handled in the `security` function.
        // From the self-enforced data, we can see all the edges in the graph that belong to a public key.
        // Example: ~ASDF is the ID of a node with ASDF as its public key, signed alias and salt, and
        // its encrypted private key, but it might also have other signed values on it like `profile = <ID>` edge.
        // Using that directed edge's ID, we can then track (in memory) which IDs belong to which keys.
        // Here is a problem: Multiple public keys can "claim" any node's ID, so this is dangerous!
        // This means we should ONLY trust our "friends" (our key ring) public keys, not any ones.
        // I have not yet added that to SEA yet in this alpha release. That is coming soon, but beware in the meanwhile!

        // --------------- Main dispatcher ---------------
        function check(msg){
          var eve = this, at = eve.as, put = msg.put, soul = put['#'], key = put['.'], val = put[':'], state = put['>'], id = msg['#'], tmp;
          if(!soul || !key){ return }

          // Faith fast-path — bypass all validation
          if((msg._||'').faith && (at.opt||'').faith && 'function' == typeof msg._){
            check.pipe.faith({ eve: eve, msg: msg, put: put, at: at }); return;
          }

          var no = function(why){ at.on('in', {'@': id, err: msg.err = why}) };
          (msg._||'').DBG && ((msg._||'').DBG.c = +new Date);

          // Build context object shared across all stages
          var ctx = { eve: eve, msg: msg, at: at, put: put, soul: soul, key: key, val: val, state: state, id: id, no: no, pub: null };

          // Route: determine which feature stage to run after forget
          var pipeline = [check.pipe.forget];

          if('~@' === soul){
            pipeline.push(check.pipe.alias);
          } else if('~@' === soul.slice(0,2)){
            pipeline.push(check.pipe.pubs);
          } else if('~' === soul || '~/' === soul.slice(0,2)){
            pipeline.push(check.pipe.shard);
          } else if(tmp = SEA.opt.pub(soul)){
            ctx.pub = tmp;
            pipeline.push(check.pipe.pub);
          } else if(0 <= soul.indexOf('#')){
            pipeline.push(check.pipe.hash);
          } else {
            pipeline.push(check.pipe.any);
          }

          // Keep reference to the required security stage before plugins can touch the array
          var required = pipeline[1];

          // Allow plugins to augment/reorder the pipeline
          for(var pi = 0; pi < check.plugins.length; pi++){
            check.plugins[pi](ctx, pipeline);
          }

          // Guard: ensure the routing security stage was not removed by a plugin
          if(required && pipeline.indexOf(required) < 0){ return no("Security stage removed."); }

          check.run(pipeline, ctx);
        }

        // --------------- Pipeline runner ---------------
        // Each stage is fn(ctx, next, reject) where:
        //   next()       = advance to the next stage (or COMMIT if last)
        //   reject(why)  = call no(why) and stop
        // A stage that does NOT call next() or reject() must handle forwarding itself
        // (e.g. stages that call eve.to.next(msg) directly).
        check.run = function(stages, ctx) {
          var no = ctx.no; // snapshot: prevent ctx.no mutation from bypassing rejection
          var i = 0;
          var next = function() {
            if (i >= stages.length) return; // all stages consumed, done
            var stage = stages[i++];
            var spent = false; // guard: each stage may advance the pipeline at most once
            var once = function(){ if(!spent){ spent = true; next(); } };
            try { stage(ctx, once, no); } catch(e) { no(e && e.message || String(e)); }
          };
          next();
        };

        // --------------- Pipeline stages (check.pipe.<name>) ---------------
        // Each stage: fn(ctx, next, reject)
        check.pipe = {
          faith: function(ctx, next, reject) {
            var eve = ctx.eve, msg = ctx.msg, put = ctx.put, at = ctx.at;
            SEA.opt.pack(put, function(raw){
              SEA.verify(raw, false, function(data){
                put['='] = SEA.opt.unpack(data);
                eve.to.next(msg);
              });
            });
          },
          forget: function(ctx, next, reject) {
            var soul = ctx.soul, state = ctx.state, msg = ctx.msg, tmp;
            if(0 <= soul.indexOf('<?')){
              // 'a~pub.key/b<?9'
              tmp = parseFloat(soul.split('<?')[1]||'');
              if(tmp && (state < (Gun.state() - (tmp * 1000)))){ // sec to ms
                (tmp = msg._) && (tmp.stun) && (tmp.stun--); // THIS IS BAD CODE! It assumes GUN internals do something that will probably change in future, but hacking in now.
                return; // omit — do NOT call next()
              }
            }
            next();
          },
          alias:  function(ctx, next, reject) { check.alias(ctx.eve, ctx.msg, ctx.val, ctx.key, ctx.soul, ctx.at, reject); },
          pubs:   function(ctx, next, reject) { check.pubs(ctx.eve, ctx.msg, ctx.val, ctx.key, ctx.soul, ctx.at, reject); },
          shard:  function(ctx, next, reject) { check.shard(ctx.eve, ctx.msg, ctx.val, ctx.key, ctx.soul, ctx.at, reject, ctx.at.user||''); },
          pub:    function(ctx, next, reject) { check.pub(ctx.eve, ctx.msg, ctx.val, ctx.key, ctx.soul, ctx.at, reject, ctx.at.user||'', ctx.pub); },
          hash:   function(ctx, next, reject) { check.hash(ctx.eve, ctx.msg, ctx.val, ctx.key, ctx.soul, ctx.at, reject); },
          any:    function(ctx, next, reject) { check.any(ctx.eve, ctx.msg, ctx.val, ctx.key, ctx.soul, ctx.at, reject, ctx.at.user||''); }
        };

        Object.freeze(check.pipe); // prevent replacement of built-in security stages

        // --------------- Plugin registry ---------------
        // Plugins receive (ctx, pipeline) and may insert/reorder stages.
        // NOTE: plugins cannot remove the routing security stage (validated in check()).
        check.plugins = [];
        check.use = function(fn) { check.plugins.push(fn); };
        SEA.check = check;

        // Verify content-addressed data matches its hash
        check.hash = function (eve, msg, val, key, soul, at, no, yes) {
          function base64ToHex(data) {
            var binaryStr = atob(data);
            var a = [];
            for (var i = 0; i < binaryStr.length; i++) {
              var hex = binaryStr.charCodeAt(i).toString(16);
              a.push(hex.length === 1 ? "0" + hex : hex);
            }
            return a.join("");
          }
          var hash = key.split('#').pop();
          yes = yes || function(){ eve.to.next(msg) };
          if(!hash || hash === key){ return yes() }
          SEA.work(val, null, function (b64hash) {
            var hexhash = base64ToHex(b64hash), b64slice = b64hash.slice(-20), hexslice = hexhash.slice(-20);
            if ([b64hash, b64slice, hexhash, hexslice].some(item => item.endsWith(hash))) return yes();
            no("Data hash not same as hash!");
          }, { name: 'SHA-256' });
        }
        check.alias = function(eve, msg, val, key, soul, at, no){ // Example: {_:#~@, ~@alice: {#~@alice}}
          if(!val){ return no("Data must exist!") } // data MUST exist
          if('~@'+key === link_is(val)){ return eve.to.next(msg) } // in fact, it must be EXACTLY equal to itself
          no("Alias not same!"); // if it isn't, reject.
        };
        check.pubs = function(eve, msg, val, key, soul, at, no){ // Example: {_:#~@alice, ~asdf: {#~asdf}}
          if(!val){ return no("Alias must exist!") } // data MUST exist
          if(key === link_is(val)){ return eve.to.next(msg) } // and the ID must be EXACTLY equal to its property
          no("Alias not same!"); // that way nobody can tamper with the list of public keys.
        };
        check.$sh = {
          pub: 88,
          cut: 2,
          min: 1,
          root: '~',
          pre: '~/',
          bad: /[^0-9a-zA-Z]/
        }
        check.$sh.max = Math.ceil(check.$sh.pub / check.$sh.cut)
        check.$seg = function(seg, short){
          if('string' != typeof seg || !seg){ return }
          if(short){
            if(seg.length < check.$sh.min || seg.length > check.$sh.cut){ return }
          } else {
            if(seg.length !== check.$sh.cut){ return }
          }
          if(check.$sh.bad.test(seg)){ return }
          return 1
        }
        check.$path = function(soul){
          if(check.$sh.root === soul){ return [] }
          if(check.$sh.pre !== (soul||'').slice(0,2)){ return }
          if('/' === soul.slice(-1) || 0 <= soul.indexOf('//')){ return }
          var path = soul.slice(2).split('/'), i = 0, seg;
          for(i; i < path.length; i++){
            seg = path[i];
            if(!check.$seg(seg)){ return }
          }
          return path
        }
        check.$kid = function(soul, key){
          if(check.$sh.root === soul){ return check.$sh.pre + key }
          return soul + '/' + key
        }
        check.$pub = function(soul, key){
          var path = check.$path(soul);
          if(!path){ return }
          return path.join('') + key
        }
        check.$leaf = function(soul, key){
          var pub = check.$pub(soul, key);
          if(!pub || pub.length !== check.$sh.pub){ return }
          if(SEA.opt.pub('~' + pub) !== pub){ return }
          return pub
        }
        check.$sea = function(msg, user, pub){
          var ctx = (msg._.msg || {}).opt || {}
          var opt = msg._.sea || (function(){
            var o = Object.assign({}, ctx)
            try{
              Object.defineProperty(msg._, 'sea', {value: o, enumerable: false, configurable: true, writable: true})
            }catch(e){ msg._.sea = o }
            return o
          }())
          var sea = (user && user._) || {}
          var is = (user && user.is) || {}
          var authenticator = opt.authenticator || sea.sea
          var upub = opt.pub || (authenticator || {}).pub || is.pub || pub
          if (!msg._.done) {
            delete ctx.authenticator; delete ctx.pub
            msg._.done = true
          }
          return {opt, authenticator, upub}
        }
        check.shard = async function(eve, msg, val, key, soul, at, no, user){
          var path = check.$path(soul), link = link_is(val), expected, leaf, raw, claim;
          if(!path){ return no("Invalid shard soul path.") }
          if(!check.$seg(key, 1)){ return no("Invalid shard key.") }
          if((path.length + 1) > check.$sh.max){ return no("Invalid shard depth.") }
          leaf = check.$leaf(soul, key)
          if(leaf){
            if(!link){ return no("Shard leaf value must be a link.") }
            if(link !== '~' + leaf){ return no("Shard leaf link must point to ~pub.") }
            // Always sign fresh — authenticator required; sig covers state, preventing pre-signed writes
            var lsec = check.$sea(msg, user, leaf)
            var lauthenticator = lsec.authenticator
            var lupub = lsec.upub || (lauthenticator||{}).pub
            if(!lauthenticator){ return no("Shard leaf requires authenticator.") }
            if(lupub !== leaf){ return no("Shard leaf authenticator pub mismatch.") }
            check.auth(msg, no, lauthenticator, function(data){
              if(link_is(data) !== link){ return no("Shard leaf signed payload mismatch.") }
              msg.put['='] = {'#': link}
              check.next(eve, msg, no)
            })
            return
          }
          // Intermediate
          expected = check.$kid(soul, key)
          var prefix = check.$pub(soul, key)
          raw = link ? {} : ((await S.parse(val)) || {})
          claim = (raw && typeof raw === 'object') ? raw['*'] : undefined
          if(!claim){
            // Fresh client write — authenticator required; SEA.opt.pack binds sig to Gun state
            if(!link){ return no("Shard intermediate value must be link.") }
            if(link !== expected){ return no("Invalid shard link target.") }
            var sec = check.$sea(msg, user)
            var authenticator = sec.authenticator
            claim = sec.upub || ((authenticator||{}).pub)
            if(!authenticator){ return no("Shard intermediate requires authenticator.") }
            if('string' !== typeof claim || claim.length !== check.$sh.pub){ return no("Invalid shard intermediate pub.") }
            if(SEA.opt.pub('~' + claim) !== claim){ return no("Invalid shard intermediate pub format.") }
            if(0 !== claim.indexOf(prefix)){ return no("Shard pub prefix mismatch.") }
            check.auth(msg, no, authenticator, function(data){
              if(link_is(data) !== expected){ return no("Shard intermediate signed payload mismatch.") }
              msg.put[':']['*'] = claim  // append fullPub to {':':link,'~':sig} set by check.auth
              msg.put['='] = {'#': expected}
              check.next(eve, msg, no)
            })
            return
          }
          // Peer re-read: stored envelope {':': link, '~': sig, '*': fullPub}
          // Skip if local graph already has a valid link for this slot — avoid redundant verify+write
          var existing = ((at.graph||{})[soul]||{})[key]
          if(existing){
            var existingParsed = await S.parse(existing)
            if(existingParsed && link_is(existingParsed[':']) === expected){
              msg.put['='] = {'#': expected}
              return eve.to.next(msg)
            }
          }
          if('string' !== typeof claim || claim.length !== check.$sh.pub){ return no("Invalid shard intermediate pub.") }
          if(SEA.opt.pub('~' + claim) !== claim){ return no("Invalid shard intermediate pub format.") }
          if(0 !== claim.indexOf(prefix)){ return no("Shard pub prefix mismatch.") }
          if(link_is(raw[':']) !== expected){ return no("Invalid shard link target.") }
          SEA.opt.pack(msg.put, function(packed){
            SEA.verify(packed, claim, function(data){
              data = SEA.opt.unpack(data)
              if(u === data){ return no("Invalid shard intermediate signature.") }
              if(link_is(data) !== expected){ return no("Shard intermediate payload mismatch.") }
              msg.put['='] = data
              eve.to.next(msg)  // val already a JSON string — forward directly
            })
          })
        };
        check.$vfy = function(eve, msg, key, soul, pub, no, certificate, certificant, cb){
          if (!(certificate||'').m || !(certificate||'').s || !certificant || !pub) { return }
          return SEA.verify(certificate, pub, data => { // check if "pub" (of the graph owner) really issued this cert
            if (u !== data && u !== data.e && msg.put['>'] && msg.put['>'] > parseFloat(data.e)) return no("Certificate expired.") // certificate expired
            // "data.c" = a list of certificants/certified users
            // "data.w" = lex WRITE permission, in the future, there will be "data.r" which means lex READ permission
            if (u !== data && data.c && data.w && (data.c === certificant || data.c.indexOf('*') > -1 || data.c.indexOf(certificant) > -1)) {
              // ok, now "certificant" is in the "certificants" list, but is "path" allowed? Check path
              var path = soul.indexOf('/') > -1 ? soul.replace(soul.substring(0, soul.indexOf('/') + 1), '') : ''
              String.match = String.match || Gun.text.match
              var w = Array.isArray(data.w) ? data.w : typeof data.w === 'object' || typeof data.w === 'string' ? [data.w] : []
              for (const lex of w) {
                if ((String.match(path, lex['#']) && String.match(key, lex['.'])) || (!lex['.'] && String.match(path, lex['#'])) || (!lex['#'] && String.match(key, lex['.'])) || String.match((path ? path + '/' + key : key), lex['#'] || lex)) {
                  // is Certificant forced to present in Path
                  if (lex['+'] && lex['+'].indexOf('*') > -1 && path && path.indexOf(certificant) == -1 && key.indexOf(certificant) == -1) return no(`Path "${path}" or key "${key}" must contain string "${certificant}".`)
                  // path is allowed, but is there any WRITE block? Check it out
                  if (data.wb && (typeof data.wb === 'string' || ((data.wb || {})['#']))) { // "data.wb" = path to the WRITE block
                    var root = eve.as.root.$.back(-1)
                    if (typeof data.wb === 'string' && '~' !== data.wb.slice(0, 1)) root = root.get('~' + pub)
                    return root.get(data.wb).get(certificant).once(value => { // TODO: INTENT TO DEPRECATE.
                      if (value && (value === 1 || value === true)) return no(`Certificant ${certificant} blocked.`)
                      return cb(data)
                    })
                  }
                  return cb(data)
                }
              }
              return no("Certificate verification fail.")
            }
          })
        }
        check.next = function(eve, msg, no){
          JSON.stringifyAsync(msg.put[':'], function(err,s){
            if(err){ return no(err || "Stringify error.") }
            msg.put[':'] = s;
            return eve.to.next(msg);
          })
        }
        check.guard = function(eve, msg, key, soul, at, no, data, next){
          if(0 > key.indexOf('#')){ return next() }
          check.hash(eve, msg, data, key, soul, at, no, next)
        }
        check.auth = function(msg, no, authenticator, done){
          SEA.opt.pack(msg.put, packed => {
            if (!authenticator) return no("Missing authenticator");
            SEA.sign(packed, authenticator, async function(data) {
              if (u === data) return no(SEA.err || 'Signature fail.')
              if (!data.m || !data.s) return no('Invalid signature format')
              var parsed = SEA.opt.unpack(data.m)
              msg.put[':'] = {':': parsed, '~': data.s}
              msg.put['='] = parsed
              done(parsed)
            }, {raw: 1})
          })
        }
        check.$tag = async function(msg, cert, upub, verify, next){
          const _cert = await S.parse(cert)
          if (_cert && _cert.m && _cert.s) verify(_cert, upub, _ => {
            msg.put[':']['+'] = _cert // '+' is a certificate
            msg.put[':']['*'] = upub // '*' is pub of the user who puts
            next()
            return
          })
        }
        check.pass = function(eve, msg, raw, data, verify){
          if (raw['+'] && raw['+']['m'] && raw['+']['s'] && raw['*']){
            return verify(raw['+'], raw['*'], _ => {
              msg.put['='] = data;
              return eve.to.next(msg);
            })
          }
          msg.put['='] = data;
          return eve.to.next(msg);
        }
        check.pub = async function(eve, msg, val, key, soul, at, no, user, pub, conf){ var tmp // Example: {_:#~asdf, hello:'world'~fdsa}}
          conf = conf || {}
          const verify = (certificate, certificant, cb) => check.$vfy(eve, msg, key, soul, pub, no, certificate, certificant, cb)
          const $next = () => check.next(eve, msg, no)

          // Localize auth options into message-private SEA context.
          const sec = check.$sea(msg, user, pub)
          const opt = sec.opt
          const authenticator = sec.authenticator
          const upub = sec.upub
          const cert = conf.nocert ? u : opt.cert;
          const $expect = function(data){
            if(u === conf.want){ return 1 }
            if(data === conf.want){ return 1 }
            no(conf.err || "Unexpected payload.")
          }
          const raw = (await S.parse(val)) || {}
          const $hash = function(data, next){
            check.guard(eve, msg, key, soul, at, no, data, next)
          }
          const $sign = async function(){
            // if writing to own graph, just allow it
            if (pub === upub) {
              if (tmp = link_is(val)) (at.sea.own[tmp] = at.sea.own[tmp] || {})[pub] = 1
              $next()
              return
            }

            // if writing to other's graph, check if cert exists then try to inject cert into put, also inject self pub so that everyone can verify the put
            if (pub !== upub && cert) {
              return check.$tag(msg, cert, upub, verify, $next)
            }
          }
          const $pass = function(data){
            return check.pass(eve, msg, raw, data, verify)
          }

          if ('pub' === key && '~' + pub === soul) {
            if (val === pub) return eve.to.next(msg) // the account MUST match `pub` property that equals the ID of the public key.
            return no("Account not same!")
          }

          if (((user && user.is) || authenticator) && upub && !raw['*'] && !raw['+'] && (pub === upub || (pub !== upub && cert))){
            check.auth(msg, no, authenticator, function(data){
              if(!$expect(data)){ return }
              $hash(data, $sign)
            })
            return;
          }

          SEA.opt.pack(msg.put, packed => {
            SEA.verify(packed, raw['*'] || pub, function(data){ var tmp;
              data = SEA.opt.unpack(data);
              if (u === data) return no("Unverified data.") // make sure the signature matches the account it claims to be on. // reject any updates that are signed with a mismatched account.
              if(!$expect(data)){ return }
              if ((tmp = link_is(data)) && pub === SEA.opt.pub(tmp)) (at.sea.own[tmp] = at.sea.own[tmp] || {})[pub] = 1

              $hash(data, function(){ $pass(data) })
            });
          })
          return
        };
        check.any = function(eve, msg, val, key, soul, at, no, user){ var tmp, pub;
          if(at.opt.secure){ return no("Soul missing public key at '" + key + "'.") }
          // TODO: Ask community if should auto-sign non user-graph data.
          at.on('secure', function(msg){ this.off();
            if(!at.opt.secure){ return eve.to.next(msg) }
            no("Data cannot be changed.");
          }).on.on('secure', msg);
          return;
        }

        var valid = Gun.valid, link_is = function(d,l){ return 'string' == typeof (l = valid(d)) && l }, state_ify = (Gun.state||'').ify;

        var pubcut = /[^\w_-]/; // kept for old-format parsing below
        SEA.opt.pub = function(s){
          if(!s){ return }
          s = s.split('~')[1]
          if(!s){ return }
          if('@' === (s[0]||'')[0]){ return }
          // New format: 88 alphanumeric chars (base62)
          if(/^[A-Za-z0-9]{88}/.test(s)){ return s.slice(0, 88) }
          // Old format: x.y (base64url, 87 chars) — backward compat for check.pub routing
          var parts = s.split(pubcut).slice(0,2)
          if(!parts || 2 !== parts.length){ return }
          return parts.slice(0,2).join('.')
        }
        SEA.opt.stringy = function(t){
          // TODO: encrypt etc. need to check string primitive. Make as breaking change.
        }
        SEA.opt.pack = function(d,cb,k, n,s){ var tmp, f; // pack for verifying
          if(SEA.opt.check(d)){ return cb(d) }
          if(d && d['#'] && d['.'] && d['>']){ tmp = d[':']; f = 1 }
          JSON.parseAsync(f? tmp : d, function(err, meta){
            var sig = ((u !== (meta||'')[':']) && (meta||'')['~']); // or just ~ check?
            if(!sig){ cb(d); return }
            cb({m: {'#':s||d['#'],'.':k||d['.'],':':(meta||'')[':'],'>':d['>']||Gun.state.is(n, k)}, s: sig});
          });
        }
        var O = SEA.opt;
        SEA.opt.unpack = function(d, k, n){ var tmp;
          if(u === d){ return }
          if(d && (u !== (tmp = d[':']))){ return tmp }
          k = k || O.fall_key; if(!n && O.fall_val){ n = {}; n[k] = O.fall_val }
          if(!k || !n){ return }
          if(d === n[k]){ return d }
          if(!SEA.opt.check(n[k])){ return d }
          var soul = (n && n._ && n._['#']) || O.fall_soul, s = Gun.state.is(n, k) || O.fall_state;
          if(d && 4 === d.length && soul === d[0] && k === d[1] && fl(s) === fl(d[3])){
            return d[2];
          }
          if(s < SEA.opt.shuffle_attack){
            return d;
          }
        }
        SEA.opt.shuffle_attack = 1546329600000; // Jan 1, 2019
        var fl = Math.floor; // TODO: Still need to fix inconsistent state issue.
        // TODO: Potential bug? If pub/priv key starts with `-`? IDK how possible.

    }());
  })(USE, './index');


__bundleExport = MOD.exports;
}());
export default __bundleExport;
/* UNBUILD-SNAPSHOT-START
eyJraW5kIjoic2VhIiwiZmlsZXMiOnsic2VhL3Jvb3QuanMiOiJsZXQgX19kZWZhdWx0RXhwb3J0O1xuKGZ1bmN0aW9uKCl7XG5cbiAgICAvLyBTZWN1cml0
eSwgRW5jcnlwdGlvbiwgYW5kIEF1dGhvcml6YXRpb246IFNFQS5qc1xuICAgIC8vIE1BTkRBVE9SWSBSRUFESU5HOiBodHRwczovL2d1bi5lY28vZXhwbGFp
bmVycy9kYXRhL3NlY3VyaXR5Lmh0bWxcbiAgICAvLyBJVCBJUyBJTVBMRU1FTlRFRCBJTiBBIFBPTFlGSUxML1NISU0gQVBQUk9BQ0guXG4gICAgLy8gVEhJ
UyBJUyBBTiBFQVJMWSBBTFBIQSFcblxuICAgIHZhciByb290ID0ge307XG4gICAgcm9vdC53aW5kb3cgPSAodHlwZW9mIGdsb2JhbFRoaXMgIT09IFwidW5k
ZWZpbmVkXCIgJiYgdHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgV29ya2VyR2xvYmFsU2NvcGUgIT09IFwidW5kZWZpbmVkXCIp
ID8gZ2xvYmFsVGhpcyA6ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDogdW5kZWZpbmVkKTtcblxuICAgIHZhciB0bXAgPSBy
b290LndpbmRvdyB8fCByb290LCB1O1xuICAgIHZhciBTRUEgPSB0bXAuU0VBIHx8IHt9O1xuXG4gICAgaWYoU0VBLndpbmRvdyA9IHJvb3Qud2luZG93KXsg
U0VBLndpbmRvdy5TRUEgPSBTRUEgfVxuXG4gICAgdHJ5eyBpZih1KycnICE9PSB0eXBlb2YgTU9EVUxFKXsgTU9EVUxFLmV4cG9ydHMgPSBTRUEgfSB9Y2F0
Y2goZSl7fVxuICAgIF9fZGVmYXVsdEV4cG9ydCA9IFNFQTtcbiAgXG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgX19kZWZhdWx0RXhwb3J0O1xuIiwic2VhL2h0
dHBzLmpzIjoiaW1wb3J0IF9fcm9vdCBmcm9tICcuL3Jvb3QuanMnO1xuKGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgU0VBID0gX19yb290O1xuICAgIHRyeXsg
aWYoU0VBLndpbmRvdyl7XG4gICAgICBpZihsb2NhdGlvbi5wcm90b2NvbC5pbmRleE9mKCdzJykgPCAwXG4gICAgICAmJiBsb2NhdGlvbi5ob3N0LmluZGV4
T2YoJ2xvY2FsaG9zdCcpIDwgMFxuICAgICAgJiYgISAvXjEyN1xcLlxcZCtcXC5cXGQrXFwuXFxkKyQvLnRlc3QobG9jYXRpb24uaG9zdG5hbWUpXG4gICAg
ICAmJiBsb2NhdGlvbi5wcm90b2NvbC5pbmRleE9mKCdibG9iOicpIDwgMFxuICAgICAgJiYgbG9jYXRpb24ucHJvdG9jb2wuaW5kZXhPZignZmlsZTonKSA8
IDBcbiAgICAgICYmIGxvY2F0aW9uLm9yaWdpbiAhPSAnbnVsbCcpe1xuICAgICAgICBjb25zb2xlLndhcm4oJ0hUVFBTIG5lZWRlZCBmb3IgV2ViQ3J5cHRv
IGluIFNFQSwgcmVkaXJlY3RpbmcuLi4nKTtcbiAgICAgICAgbG9jYXRpb24ucHJvdG9jb2wgPSAnaHR0cHM6JzsgLy8gV2ViQ3J5cHRvIGRvZXMgTk9UIHdv
cmsgd2l0aG91dCBIVFRQUyFcbiAgICAgIH1cbiAgICB9IH1jYXRjaChlKXt9XG4gIFxufSgpKTsiLCJzZWEvYmFzZTY0LmpzIjoiaW1wb3J0IF9fYnVmZmVy
IGZyb20gJ2J1ZmZlcic7XG4oZnVuY3Rpb24oKXtcblxuICAgIHZhciB1LCByb290ID0gKHR5cGVvZiBnbG9iYWxUaGlzICE9PSBcInVuZGVmaW5lZFwiKSA/
IGdsb2JhbFRoaXMgOiAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwi
ID8gd2luZG93IDogdGhpcykpO1xuICAgIHZhciBuYXRpdmUgPSB7fVxuICAgIG5hdGl2ZS5idG9hID0gKHUrJycgIT0gdHlwZW9mIHJvb3QuYnRvYSkgJiYg
cm9vdC5idG9hICYmIHJvb3QuYnRvYS5iaW5kKHJvb3QpO1xuICAgIG5hdGl2ZS5hdG9iID0gKHUrJycgIT0gdHlwZW9mIHJvb3QuYXRvYikgJiYgcm9vdC5h
dG9iICYmIHJvb3QuYXRvYi5iaW5kKHJvb3QpO1xuICAgIGlmKHUrJycgPT0gdHlwZW9mIEJ1ZmZlcil7XG4gICAgICBpZih1KycnICE9IHR5cGVvZiByZXF1
aXJlKXtcbiAgICAgICAgdHJ5eyByb290LkJ1ZmZlciA9IF9fYnVmZmVyLkJ1ZmZlciB9Y2F0Y2goZSl7IGNvbnNvbGUubG9nKFwiUGxlYXNlIGBucG0gaW5z
dGFsbCBidWZmZXJgIG9yIGFkZCBpdCB0byB5b3VyIHBhY2thZ2UuanNvbiAhXCIpIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYodSsnJyAhPSB0eXBlb2Yg
QnVmZmVyKXtcbiAgICAgIHJvb3QuYnRvYSA9IGZ1bmN0aW9uKGRhdGEpeyByZXR1cm4gQnVmZmVyLmZyb20oZGF0YSwgXCJiaW5hcnlcIikudG9TdHJpbmco
XCJiYXNlNjRcIikucmVwbGFjZSgvXFwrL2csICctJykucmVwbGFjZSgvXFwvL2csICdfJykucmVwbGFjZSgvPSskL2csICcnKTt9O1xuICAgICAgcm9vdC5h
dG9iID0gZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgIHZhciB0bXAgPSBkYXRhLnJlcGxhY2UoLy0vZywgJysnKS5yZXBsYWNlKC9fL2csICcvJylcbiAgICAg
ICAgd2hpbGUodG1wLmxlbmd0aCAlIDQpeyB0bXAgKz0gJz0nIH1cbiAgICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHRtcCwgXCJiYXNlNjRcIikudG9TdHJp
bmcoXCJiaW5hcnlcIik7XG4gICAgICB9O1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZihuYXRpdmUuYnRvYSl7XG4gICAgICByb290LmJ0b2EgPSBm
dW5jdGlvbihkYXRhKXsgcmV0dXJuIG5hdGl2ZS5idG9hKGRhdGEpLnJlcGxhY2UoL1xcKy9nLCAnLScpLnJlcGxhY2UoL1xcLy9nLCAnXycpLnJlcGxhY2Uo
Lz0rJC9nLCAnJyk7IH07XG4gICAgfVxuICAgIGlmKG5hdGl2ZS5hdG9iKXtcbiAgICAgIHJvb3QuYXRvYiA9IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICB2
YXIgdG1wID0gZGF0YS5yZXBsYWNlKC8tL2csICcrJykucmVwbGFjZSgvXy9nLCAnLycpXG4gICAgICAgIHdoaWxlKHRtcC5sZW5ndGggJSA0KXsgdG1wICs9
ICc9JyB9XG4gICAgICAgIHJldHVybiBuYXRpdmUuYXRvYih0bXApO1xuICAgICAgfTtcbiAgICB9XG4gIFxufSgpKTsiLCJzZWEvYXJyYXkuanMiOiJpbXBv
cnQgJy4vYmFzZTY0LmpzJztcblxubGV0IF9fZGVmYXVsdEV4cG9ydDtcbihmdW5jdGlvbigpe1xuICAvLyBUaGlzIGlzIEFycmF5IGV4dGVuZGVkIHRvIGhh
dmUgLnRvU3RyaW5nKFsndXRmOCd8J2hleCd8J2Jhc2U2NCddKVxuICBmdW5jdGlvbiBTZWFBcnJheSgpIHt9XG4gIE9iamVjdC5hc3NpZ24oU2VhQXJyYXks
IHsgZnJvbTogQXJyYXkuZnJvbSB9KVxuICBTZWFBcnJheS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEFycmF5LnByb3RvdHlwZSlcbiAgU2VhQXJyYXku
cHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oZW5jLCBzdGFydCwgZW5kKSB7IGVuYyA9IGVuYyB8fCAndXRmOCc7IHN0YXJ0ID0gc3RhcnQgfHwgMDtc
biAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIGlmIChlbmMgPT09ICdoZXgnKSB7XG4gICAgICBjb25zdCBidWYgPSBuZXcgVWludDhBcnJh
eSh0aGlzKVxuICAgICAgcmV0dXJuIFsgLi4uQXJyYXkoKChlbmQgJiYgKGVuZCArIDEpKSB8fCBsZW5ndGgpIC0gc3RhcnQpLmtleXMoKV1cbiAgICAgIC5t
YXAoKGkpID0+IGJ1ZlsgaSArIHN0YXJ0IF0udG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJycpXG4gICAgfVxuICAgIGlmIChlbmMgPT09
ICd1dGY4Jykge1xuICAgICAgcmV0dXJuIEFycmF5LmZyb20oXG4gICAgICAgIHsgbGVuZ3RoOiAoZW5kIHx8IGxlbmd0aCkgLSBzdGFydCB9LFxuICAgICAg
ICAoXywgaSkgPT4gU3RyaW5nLmZyb21DaGFyQ29kZSh0aGlzWyBpICsgc3RhcnRdKVxuICAgICAgKS5qb2luKCcnKVxuICAgIH1cbiAgICBpZiAoZW5jID09
PSAnYmFzZTY0Jykge1xuICAgICAgcmV0dXJuIGJ0b2EodGhpcylcbiAgICB9XG4gIH1cbiAgX19kZWZhdWx0RXhwb3J0ID0gU2VhQXJyYXk7XG59KCkpO1xu
ZXhwb3J0IGRlZmF1bHQgX19kZWZhdWx0RXhwb3J0OyIsInNlYS9idWZmZXIuanMiOiJpbXBvcnQgJy4vYmFzZTY0LmpzJztcbmltcG9ydCBfX2FycmF5IGZy
b20gJy4vYXJyYXkuanMnO1xuXG5sZXQgX19kZWZhdWx0RXhwb3J0O1xuKGZ1bmN0aW9uKCl7XG4gIC8vIFRoaXMgaXMgQnVmZmVyIGltcGxlbWVudGF0aW9u
IHVzZWQgaW4gU0VBLiBGdW5jdGlvbmFsaXR5IGlzIG1vc3RseVxuICAvLyBjb21wYXRpYmxlIHdpdGggTm9kZUpTICdzYWZlLWJ1ZmZlcicgYW5kIGlzIHVz
ZWQgZm9yIGVuY29kaW5nIGNvbnZlcnNpb25zXG4gIC8vIGJldHdlZW4gYmluYXJ5IGFuZCAnaGV4JyB8ICd1dGY4JyB8ICdiYXNlNjQnXG4gIC8vIFNlZSBk
b2N1bWVudGF0aW9uIGFuZCB2YWxpZGF0aW9uIGZvciBzYWZlIGltcGxlbWVudGF0aW9uIGluOlxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL3Nh
ZmUtYnVmZmVyI3VwZGF0ZVxuICB2YXIgU2VhQXJyYXkgPSBfX2FycmF5O1xuICBmdW5jdGlvbiBTYWZlQnVmZmVyKC4uLnByb3BzKSB7XG4gICAgY29uc29s
ZS53YXJuKCduZXcgU2FmZUJ1ZmZlcigpIGlzIGRlcHJlY2lhdGVkLCBwbGVhc2UgdXNlIFNhZmVCdWZmZXIuZnJvbSgpJylcbiAgICByZXR1cm4gU2FmZUJ1
ZmZlci5mcm9tKC4uLnByb3BzKVxuICB9XG4gIFNhZmVCdWZmZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBcnJheS5wcm90b3R5cGUpXG4gIE9iamVj
dC5hc3NpZ24oU2FmZUJ1ZmZlciwge1xuICAgIC8vIChkYXRhLCBlbmMpIHdoZXJlIHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJyB0aGVuIGVuYyA9PT0gJ3V0
ZjgnfCdoZXgnfCdiYXNlNjQnXG4gICAgZnJvbSgpIHtcbiAgICAgIGlmICghT2JqZWN0LmtleXMoYXJndW1lbnRzKS5sZW5ndGggfHwgYXJndW1lbnRzWzBd
PT1udWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZm
ZXIsIEFycmF5LCBvciBhcnJheS1saWtlIG9iamVjdC4nKVxuICAgICAgfVxuICAgICAgY29uc3QgaW5wdXQgPSBhcmd1bWVudHNbMF1cbiAgICAgIGxldCBi
dWZcbiAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnN0IGVuYyA9IGFyZ3VtZW50c1sxXSB8fCAndXRmOCdcbiAg
ICAgICAgaWYgKGVuYyA9PT0gJ2hleCcpIHtcbiAgICAgICAgICBjb25zdCBieXRlcyA9IGlucHV0Lm1hdGNoKC8oW1xcZGEtZkEtRl17Mn0pL2cpXG4gICAg
ICAgICAgLm1hcCgoYnl0ZSkgPT4gcGFyc2VJbnQoYnl0ZSwgMTYpKVxuICAgICAgICAgIGlmICghYnl0ZXMgfHwgIWJ5dGVzLmxlbmd0aCkge1xuICAgICAg
ICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBmaXJzdCBhcmd1bWVudCBmb3IgdHlwZSBcXCdoZXhcXCcuJylcbiAgICAgICAgICB9XG4gICAg
ICAgICAgYnVmID0gU2VhQXJyYXkuZnJvbShieXRlcylcbiAgICAgICAgfSBlbHNlIGlmIChlbmMgPT09ICd1dGY4JyB8fCAnYmluYXJ5JyA9PT0gZW5jKSB7
IC8vIEVESVQgQlkgTUFSSzogSSB0aGluayB0aGlzIGlzIHNhZmUsIHRlc3RlZCBpdCBhZ2FpbnN0IGEgY291cGxlIFwiYmluYXJ5XCIgc3RyaW5ncy4gVGhp
cyBsZXRzIFNhZmVCdWZmZXIgbWF0Y2ggTm9kZUpTIEJ1ZmZlciBiZWhhdmlvciBtb3JlIHdoZXJlIGl0IHNhZmVseSBidG9hcyByZWd1bGFyIHN0cmluZ3Mu
XG4gICAgICAgICAgY29uc3QgbGVuZ3RoID0gaW5wdXQubGVuZ3RoXG4gICAgICAgICAgY29uc3Qgd29yZHMgPSBuZXcgVWludDE2QXJyYXkobGVuZ3RoKVxu
ICAgICAgICAgIEFycmF5LmZyb20oeyBsZW5ndGg6IGxlbmd0aCB9LCAoXywgaSkgPT4gd29yZHNbaV0gPSBpbnB1dC5jaGFyQ29kZUF0KGkpKVxuICAgICAg
ICAgIGJ1ZiA9IFNlYUFycmF5LmZyb20od29yZHMpXG4gICAgICAgIH0gZWxzZSBpZiAoZW5jID09PSAnYmFzZTY0Jykge1xuICAgICAgICAgIGNvbnN0IGRl
YyA9IGF0b2IoaW5wdXQpXG4gICAgICAgICAgY29uc3QgbGVuZ3RoID0gZGVjLmxlbmd0aFxuICAgICAgICAgIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJy
YXkobGVuZ3RoKVxuICAgICAgICAgIEFycmF5LmZyb20oeyBsZW5ndGg6IGxlbmd0aCB9LCAoXywgaSkgPT4gYnl0ZXNbaV0gPSBkZWMuY2hhckNvZGVBdChp
KSlcbiAgICAgICAgICBidWYgPSBTZWFBcnJheS5mcm9tKGJ5dGVzKVxuICAgICAgICB9IGVsc2UgaWYgKGVuYyA9PT0gJ2JpbmFyeScpIHsgLy8gZGVwcmVj
YXRlZCBieSBhYm92ZSBjb21tZW50XG4gICAgICAgICAgYnVmID0gU2VhQXJyYXkuZnJvbShpbnB1dCkgLy8gc29tZSBidG9hcyB3ZXJlIG1pc2hhbmRsZWQu
XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5pbmZvKCdTYWZlQnVmZmVyLmZyb20gdW5rbm93biBlbmNvZGluZzogJytlbmMpXG4gICAg
ICAgIH1cbiAgICAgICAgcmV0dXJuIGJ1ZlxuICAgICAgfVxuICAgICAgY29uc3QgYnl0ZUxlbmd0aCA9IGlucHV0LmJ5dGVMZW5ndGggLy8gd2hhdCBpcyBn
b2luZyBvbiBoZXJlPyBGT1IgTUFSVFRJXG4gICAgICBjb25zdCBsZW5ndGggPSBpbnB1dC5ieXRlTGVuZ3RoID8gaW5wdXQuYnl0ZUxlbmd0aCA6IGlucHV0
Lmxlbmd0aFxuICAgICAgaWYgKGxlbmd0aCkge1xuICAgICAgICBsZXQgYnVmXG4gICAgICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7
XG4gICAgICAgICAgYnVmID0gbmV3IFVpbnQ4QXJyYXkoaW5wdXQpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFNlYUFycmF5LmZyb20oYnVmIHx8IGlu
cHV0KVxuICAgICAgfVxuICAgIH0sXG4gICAgLy8gVGhpcyBpcyAnc2FmZS1idWZmZXIuYWxsb2MnIHNhbnMgZW5jb2Rpbmcgc3VwcG9ydFxuICAgIGFsbG9j
KGxlbmd0aCwgZmlsbCA9IDAgLyosIGVuYyovICkge1xuICAgICAgcmV0dXJuIFNlYUFycmF5LmZyb20obmV3IFVpbnQ4QXJyYXkoQXJyYXkuZnJvbSh7IGxl
bmd0aDogbGVuZ3RoIH0sICgpID0+IGZpbGwpKSlcbiAgICB9LFxuICAgIC8vIFRoaXMgaXMgbm9ybWFsIFVOU0FGRSAnYnVmZmVyLmFsbG9jJyBvciAnbmV3
IEJ1ZmZlcihsZW5ndGgpJyAtIGRvbid0IHVzZSFcbiAgICBhbGxvY1Vuc2FmZShsZW5ndGgpIHtcbiAgICAgIHJldHVybiBTZWFBcnJheS5mcm9tKG5ldyBV
aW50OEFycmF5KEFycmF5LmZyb20oeyBsZW5ndGggOiBsZW5ndGggfSkpKVxuICAgIH0sXG4gICAgLy8gVGhpcyBwdXRzIHRvZ2V0aGVyIGFycmF5IG9mIGFy
cmF5IGxpa2UgbWVtYmVyc1xuICAgIGNvbmNhdChhcnIpIHsgLy8gb2N0ZXQgYXJyYXlcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAg
ICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG11c3QgYmUgQXJyYXkgY29udGFpbmluZyBBcnJheUJ1ZmZlciBvciBVaW50OEFycmF5
IGluc3RhbmNlcy4nKVxuICAgICAgfVxuICAgICAgcmV0dXJuIFNlYUFycmF5LmZyb20oYXJyLnJlZHVjZSgocmV0LCBpdGVtKSA9PiByZXQuY29uY2F0KEFy
cmF5LmZyb20oaXRlbSkpLCBbXSkpXG4gICAgfVxuICB9KVxuICBTYWZlQnVmZmVyLnByb3RvdHlwZS5mcm9tID0gU2FmZUJ1ZmZlci5mcm9tXG4gIFNhZmVC
dWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gU2VhQXJyYXkucHJvdG90eXBlLnRvU3RyaW5nXG5cbiAgX19kZWZhdWx0RXhwb3J0ID0gU2FmZUJ1ZmZlcjtc
bn0oKSk7XG5leHBvcnQgZGVmYXVsdCBfX2RlZmF1bHRFeHBvcnQ7Iiwic2VhL3NoaW0uanMiOiJpbXBvcnQgX19yb290IGZyb20gJy4vcm9vdC5qcyc7XG5p
bXBvcnQgX19idWZmZXIgZnJvbSAnLi9idWZmZXIuanMnO1xuaW1wb3J0IF9fY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgX193ZWJjcnlwdG8gZnJv
bSAnQHBlY3VsaWFyL3dlYmNyeXB0byc7XG5pbXBvcnQgX190ZXh0X2VuY29kaW5nIGZyb20gJy4uL2xpYi90ZXh0LWVuY29kaW5nL2luZGV4LmpzJztcblxu
bGV0IF9fZGVmYXVsdEV4cG9ydDtcbihmdW5jdGlvbigpe1xuXG4gICAgY29uc3QgU0VBID0gX19yb290XG4gICAgY29uc3QgZ2xvYmFsU2NvcGUgPSAodHlw
ZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnKSA/IGdsb2JhbFRoaXMgOiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiAo
dHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB7fSkpO1xuICAgIGNvbnN0IGFwaSA9IHtCdWZmZXI6IF9fYnVmZmVyIHx8IGdsb2Jh
bFNjb3BlLkJ1ZmZlcn1cbiAgICB2YXIgbyA9IHt9LCB1O1xuXG4gICAgLy8gaWRlYWxseSB3ZSBjYW4gbW92ZSBhd2F5IGZyb20gSlNPTiBlbnRpcmVseT8g
dW5saWtlbHkgZHVlIHRvIGNvbXBhdGliaWxpdHkgaXNzdWVzLi4uIG9oIHdlbGwuXG4gICAgSlNPTi5wYXJzZUFzeW5jID0gSlNPTi5wYXJzZUFzeW5jIHx8
IGZ1bmN0aW9uKHQsY2Iscil7IHZhciB1OyB0cnl7IGNiKHUsIEpTT04ucGFyc2UodCxyKSkgfWNhdGNoKGUpeyBjYihlKSB9IH1cbiAgICBKU09OLnN0cmlu
Z2lmeUFzeW5jID0gSlNPTi5zdHJpbmdpZnlBc3luYyB8fCBmdW5jdGlvbih2LGNiLHIscyl7IHZhciB1OyB0cnl7IGNiKHUsIEpTT04uc3RyaW5naWZ5KHYs
cixzKSkgfWNhdGNoKGUpeyBjYihlKSB9IH1cblxuICAgIGFwaS5wYXJzZSA9IGZ1bmN0aW9uKHQscil7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihy
ZXMsIHJlail7XG4gICAgICBKU09OLnBhcnNlQXN5bmModCxmdW5jdGlvbihlcnIsIHJhdyl7IGVycj8gcmVqKGVycikgOiByZXMocmF3KSB9LHIpO1xuICAg
IH0pfVxuICAgIGFwaS5zdHJpbmdpZnkgPSBmdW5jdGlvbih2LHIscyl7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXMsIHJlail7XG4gICAgICBK
U09OLnN0cmluZ2lmeUFzeW5jKHYsZnVuY3Rpb24oZXJyLCByYXcpeyBlcnI/IHJlaihlcnIpIDogcmVzKHJhdykgfSxyLHMpO1xuICAgIH0pfVxuXG4gICAg
aWYoU0VBLndpbmRvdyl7XG4gICAgICBhcGkuY3J5cHRvID0gU0VBLndpbmRvdy5jcnlwdG8gfHwgU0VBLndpbmRvdy5tc0NyeXB0b1xuICAgICAgYXBpLnN1
YnRsZSA9IChhcGkuY3J5cHRvfHxvKS5zdWJ0bGUgfHwgKGFwaS5jcnlwdG98fG8pLndlYmtpdFN1YnRsZTtcbiAgICAgIGFwaS5UZXh0RW5jb2RlciA9IFNF
QS53aW5kb3cuVGV4dEVuY29kZXI7XG4gICAgICBhcGkuVGV4dERlY29kZXIgPSBTRUEud2luZG93LlRleHREZWNvZGVyO1xuICAgICAgYXBpLnJhbmRvbSA9
IChsZW4pID0+IGFwaS5CdWZmZXIuZnJvbShhcGkuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheShhcGkuQnVmZmVyLmFsbG9jKGxlbikp
KSk7XG4gICAgfVxuICAgIGlmKCFhcGkuY3J5cHRvICYmIGdsb2JhbFNjb3BlLmNyeXB0byl7XG4gICAgICBhcGkuY3J5cHRvID0gZ2xvYmFsU2NvcGUuY3J5
cHRvO1xuICAgICAgYXBpLnN1YnRsZSA9IChhcGkuY3J5cHRvfHxvKS5zdWJ0bGUgfHwgKGFwaS5jcnlwdG98fG8pLndlYmtpdFN1YnRsZTtcbiAgICAgIGFw
aS5yYW5kb20gPSAobGVuKSA9PiBhcGkuQnVmZmVyLmZyb20oYXBpLmNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoYXBpLkJ1ZmZlci5h
bGxvYyhsZW4pKSkpO1xuICAgIH1cbiAgICBpZighYXBpLlRleHRFbmNvZGVyKXsgYXBpLlRleHRFbmNvZGVyID0gZ2xvYmFsU2NvcGUuVGV4dEVuY29kZXIg
fVxuICAgIGlmKCFhcGkuVGV4dERlY29kZXIpeyBhcGkuVGV4dERlY29kZXIgPSBnbG9iYWxTY29wZS5UZXh0RGVjb2RlciB9XG4gICAgaWYoIWFwaS5UZXh0
RGVjb2RlcilcbiAgICB7XG4gICAgICBjb25zdCB7IFRleHRFbmNvZGVyLCBUZXh0RGVjb2RlciB9ID0gX190ZXh0X2VuY29kaW5nO1xuICAgICAgYXBpLlRl
eHREZWNvZGVyID0gVGV4dERlY29kZXI7XG4gICAgICBhcGkuVGV4dEVuY29kZXIgPSBUZXh0RW5jb2RlcjtcbiAgICB9XG4gICAgaWYoIWFwaS5jcnlwdG8p
XG4gICAge1xuICAgICAgdHJ5XG4gICAgICB7XG4gICAgICB2YXIgY3J5cHRvID0gX19jcnlwdG87XG4gICAgICBPYmplY3QuYXNzaWduKGFwaSwge1xuICAg
ICAgICBjcnlwdG8sXG4gICAgICAgIHJhbmRvbTogKGxlbikgPT4gYXBpLkJ1ZmZlci5mcm9tKGNyeXB0by5yYW5kb21CeXRlcyhsZW4pKVxuICAgICAgfSk7
ICAgICAgXG4gICAgICBjb25zdCB7IENyeXB0bzogV2ViQ3J5cHRvIH0gPSBfX3dlYmNyeXB0bztcbiAgICAgIGFwaS5vc3NsID0gYXBpLnN1YnRsZSA9IG5l
dyBXZWJDcnlwdG8oe2RpcmVjdG9yeTogJ29zc2wnfSkuc3VidGxlIC8vIEVDREhcbiAgICB9XG4gICAgY2F0Y2goZSl7XG4gICAgICBjb25zb2xlLmxvZyhc
IlBsZWFzZSBgbnBtIGluc3RhbGwgQHBlY3VsaWFyL3dlYmNyeXB0b2Agb3IgYWRkIGl0IHRvIHlvdXIgcGFja2FnZS5qc29uICFcIik7XG4gICAgfX1cblxu
ICAgIF9fZGVmYXVsdEV4cG9ydCA9IGFwaVxuICBcbn0oKSk7XG5leHBvcnQgZGVmYXVsdCBfX2RlZmF1bHRFeHBvcnQ7XG4iLCJzZWEvYmFzZTYyLmpzIjoi
aW1wb3J0IF9fcm9vdCBmcm9tICcuL3Jvb3QuanMnO1xuaW1wb3J0IF9fc2hpbSBmcm9tICcuL3NoaW0uanMnO1xuXG5sZXQgX19kZWZhdWx0RXhwb3J0O1xu
KGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgU0VBID0gX19yb290O1xuICAgIHZhciBzaGltID0gX19zaGltO1xuXG4gICAgLy8gQmFzZTYyIGFscGhhYmV0OiBk
aWdpdHMg4oaSIHVwcGVyY2FzZSDihpIgbG93ZXJjYXNlICg2MiBjaGFycywgYS16QS1aMC05IG9ubHkpXG4gICAgdmFyIEFMUEhBID0gJzAxMjM0NTY3ODlB
QkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6JztcbiAgICB2YXIgQUxQSEFfTUFQID0ge307XG4gICAgZm9yICh2
YXIgaSA9IDA7IGkgPCBBTFBIQS5sZW5ndGg7IGkrKykgeyBBTFBIQV9NQVBbQUxQSEFbaV1dID0gaTsgfVxuXG4gICAgLy8gRml4ZWQgb3V0cHV0IGxlbmd0
aCBmb3IgYSAyNTYtYml0ICgzMi1ieXRlKSB2YWx1ZSBpbiBiYXNlNjJcbiAgICAvLyA2Ml40NCA+IDJeMjU2IOKck1xuICAgIHZhciBQVUJfTEVOID0gNDQ7
XG5cbiAgICAvLyBCaWdJbnQg4oaSIGJhc2U2MiBzdHJpbmcsIHplcm8tcGFkZGVkIHRvIFBVQl9MRU4gKDQ0IGNoYXJzKVxuICAgIGZ1bmN0aW9uIGJpVG9C
NjIobikge1xuICAgICAgICBpZiAodHlwZW9mIG4gIT09ICdiaWdpbnQnIHx8IG4gPCAwbikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdiaVRv
QjYyOiBpbnB1dCBtdXN0IGJlIG5vbi1uZWdhdGl2ZSBCaWdJbnQnKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcyA9ICcnO1xuICAgICAgICB2YXIgdiA9
IG47XG4gICAgICAgIHdoaWxlICh2ID4gMG4pIHtcbiAgICAgICAgICAgIHMgPSBBTFBIQVtOdW1iZXIodiAlIDYybildICsgcztcbiAgICAgICAgICAgIHYg
PSB2IC8gNjJuO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlIChzLmxlbmd0aCA8IFBVQl9MRU4pIHsgcyA9ICcwJyArIHM7IH1cbiAgICAgICAgaWYgKHMu
bGVuZ3RoID4gUFVCX0xFTikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdiaVRvQjYyOiB2YWx1ZSB0b28gbGFyZ2UgZm9yICcgKyBQVUJfTEVO
ICsgJy1jaGFyIGJhc2U2MicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzO1xuICAgIH1cblxuICAgIC8vIGJhc2U2MiBzdHJpbmcg4oaSIEJpZ0lu
dCAoYWNjZXB0cyBleGFjdGx5IFBVQl9MRU4gY2hhcnMpXG4gICAgZnVuY3Rpb24gYjYyVG9CSShzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcyAhPT0gJ3N0
cmluZycgfHwgcy5sZW5ndGggIT09IFBVQl9MRU4pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignYjYyVG9CSTogZXhwZWN0ZWQgJyArIFBVQl9M
RU4gKyAnLWNoYXIgYmFzZTYyIHN0cmluZywgZ290ICcgKyAocyAmJiBzLmxlbmd0aCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghL15bQS1aYS16MC05
XSskLy50ZXN0KHMpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2I2MlRvQkk6IGludmFsaWQgYmFzZTYyIGNoYXJhY3RlcnMnKTtcbiAgICAg
ICAgfVxuICAgICAgICB2YXIgbiA9IDBuO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBj
ID0gQUxQSEFfTUFQW3NbaV1dO1xuICAgICAgICAgICAgaWYgKGMgPT09IHVuZGVmaW5lZCkgeyB0aHJvdyBuZXcgRXJyb3IoJ2I2MlRvQkk6IHVua25vd24g
Y2hhciAnICsgc1tpXSk7IH1cbiAgICAgICAgICAgIG4gPSBuICogNjJuICsgQmlnSW50KGMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuO1xuICAg
IH1cblxuICAgIC8vIGJhc2U2NHVybCBzdHJpbmcgKDQzIGNoYXJzLCBmcm9tIEpXSykg4oaSIGJhc2U2MiAoNDQgY2hhcnMpXG4gICAgZnVuY3Rpb24gYjY0
VG9CNjIocykge1xuICAgICAgICBpZiAodHlwZW9mIHMgIT09ICdzdHJpbmcnIHx8ICFzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2I2NFRv
QjYyOiBpbnB1dCBtdXN0IGJlIG5vbi1lbXB0eSBzdHJpbmcnKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaGV4ID0gc2hpbS5CdWZmZXIuZnJvbShhdG9i
KHMpLCAnYmluYXJ5JykudG9TdHJpbmcoJ2hleCcpO1xuICAgICAgICB2YXIgbiA9IEJpZ0ludCgnMHgnICsgKGhleCB8fCAnMCcpKTtcbiAgICAgICAgcmV0
dXJuIGJpVG9CNjIobik7XG4gICAgfVxuXG4gICAgLy8gYmFzZTYyICg0NCBjaGFycykg4oaSIGJhc2U2NHVybCBzdHJpbmcgKGZvciBKV0spXG4gICAgZnVu
Y3Rpb24gYjYyVG9CNjQocykge1xuICAgICAgICB2YXIgbiA9IGI2MlRvQkkocyk7XG4gICAgICAgIHZhciBoZXggPSBuLnRvU3RyaW5nKDE2KS5wYWRTdGFy
dCg2NCwgJzAnKTtcbiAgICAgICAgdmFyIGI2NCA9IHNoaW0uQnVmZmVyLmZyb20oaGV4LCAnaGV4JykudG9TdHJpbmcoJ2Jhc2U2NCcpXG4gICAgICAgICAg
ICAucmVwbGFjZSgvXFwrL2csICctJykucmVwbGFjZSgvXFwvL2csICdfJykucmVwbGFjZSgvPS9nLCAnJyk7XG4gICAgICAgIHJldHVybiBiNjQ7XG4gICAg
fVxuXG4gICAgLy8gUGFyc2UgcHViIChvbGQgb3IgbmV3IGZvcm1hdCkg4oaSIHsgeCwgeSB9IGFzIGJhc2U2NHVybCBzdHJpbmdzIChmb3IgSldLIGltcG9y
dEtleSlcbiAgICAvLyBPbGQgZm9ybWF0OiBbNDMgYmFzZTY0dXJsXS5bNDMgYmFzZTY0dXJsXSAgbGVuZ3RoPTg3XG4gICAgLy8gTmV3IGZvcm1hdDogWzQ0
IGJhc2U2Ml1bNDQgYmFzZTYyXSAgICAgICAgICBsZW5ndGg9ODhcbiAgICBmdW5jdGlvbiBwdWJUb0p3a1hZKHB1Yikge1xuICAgICAgICBpZiAodHlwZW9m
IHB1YiAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncHViVG9Kd2tYWTogcHViIG11c3QgYmUgYSBzdHJpbmcnKTtcbiAg
ICAgICAgfVxuICAgICAgICBpZiAocHViLmxlbmd0aCA9PT0gODcgJiYgcHViWzQzXSA9PT0gJy4nKSB7XG4gICAgICAgICAgICAvLyBPbGQgYmFzZTY0dXJs
IGZvcm1hdFxuICAgICAgICAgICAgdmFyIHBhcnRzID0gcHViLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICBpZiAocGFydHMubGVuZ3RoICE9PSAyKSB7IHRo
cm93IG5ldyBFcnJvcigncHViVG9Kd2tYWTogaW52YWxpZCBvbGQgcHViIGZvcm1hdCcpOyB9XG4gICAgICAgICAgICByZXR1cm4geyB4OiBwYXJ0c1swXSwg
eTogcGFydHNbMV0gfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHViLmxlbmd0aCA9PT0gODggJiYgL15bQS1aYS16MC05XXs4OH0kLy50ZXN0KHB1Yikp
IHtcbiAgICAgICAgICAgIC8vIE5ldyBiYXNlNjIgZm9ybWF0XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHg6IGI2MlRvQjY0KHB1
Yi5zbGljZSgwLCA0NCkpLFxuICAgICAgICAgICAgICAgIHk6IGI2MlRvQjY0KHB1Yi5zbGljZSg0NCkpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4g
ICAgICAgIHRocm93IG5ldyBFcnJvcigncHViVG9Kd2tYWTogdW5yZWNvZ25pc2VkIHB1YiBmb3JtYXQgKGxlbmd0aD0nICsgcHViLmxlbmd0aCArICcpJyk7
XG4gICAgfVxuXG4gICAgLy8gRW5jb2RlIGFyYml0cmFyeSBCdWZmZXIvVWludDhBcnJheSBhcyBiYXNlNjI6IGNodW5rcyBpbnRvIDMyLWJ5dGUgYmxvY2tz
LCBlYWNoIOKGkiA0NCBjaGFyc1xuICAgIC8vIGUuZy4gU0hBLTI1NiAoMzJCKSDihpIgNDQgY2hhcnMsIFBCS0RGMiAoNjRCKSDihpIgODggY2hhcnNcbiAg
ICBmdW5jdGlvbiBidWZUb0I2MihidWYpIHtcbiAgICAgICAgdmFyIG91dCA9ICcnO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1Zi5sZW5ndGg7
IGkgKz0gMzIpIHtcbiAgICAgICAgICAgIHZhciBlbmQgPSBNYXRoLm1pbihpICsgMzIsIGJ1Zi5sZW5ndGgpO1xuICAgICAgICAgICAgdmFyIGhleCA9ICcn
O1xuICAgICAgICAgICAgLy8gbGVmdC1wYWQgc2hvcnQgbGFzdCBjaHVuayB0byAzMiBieXRlc1xuICAgICAgICAgICAgZm9yICh2YXIgcCA9IDA7IHAgPCAz
MiAtIChlbmQgLSBpKTsgcCsrKSB7IGhleCArPSAnMDAnOyB9XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gaTsgaiA8IGVuZDsgaisrKSB7XG4gICAgICAg
ICAgICAgICAgaGV4ICs9ICgnMCcgKyBidWZbal0udG9TdHJpbmcoMTYpKS5zbGljZSgtMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXQgKz0g
YmlUb0I2MihCaWdJbnQoJzB4JyArIGhleCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgdmFyIGI2MiA9IHsgYmlU
b0I2MjogYmlUb0I2MiwgYjYyVG9CSTogYjYyVG9CSSwgYjY0VG9CNjI6IGI2NFRvQjYyLCBiNjJUb0I2NDogYjYyVG9CNjQsIHB1YlRvSndrWFk6IHB1YlRv
SndrWFksIGJ1ZlRvQjYyOiBidWZUb0I2MiwgUFVCX0xFTjogUFVCX0xFTiB9O1xuICAgIFNFQS5iYXNlNjIgPSBiNjI7XG4gICAgX19kZWZhdWx0RXhwb3J0
ID0gYjYyO1xuICBcbn0oKSk7XG5leHBvcnQgZGVmYXVsdCBfX2RlZmF1bHRFeHBvcnQ7Iiwic2VhL3NldHRpbmdzLmpzIjoiaW1wb3J0IF9fcm9vdCBmcm9t
ICcuL3Jvb3QuanMnO1xuaW1wb3J0IF9fc2hpbSBmcm9tICcuL3NoaW0uanMnO1xuXG5sZXQgX19kZWZhdWx0RXhwb3J0O1xuKGZ1bmN0aW9uKCl7XG5cbiAg
ICB2YXIgU0VBID0gX19yb290O1xuICAgIHZhciBzaGltID0gX19zaGltO1xuICAgIHZhciBzID0ge307XG4gICAgcy5wYmtkZjIgPSB7aGFzaDoge25hbWUg
OiAnU0hBLTI1Nid9LCBpdGVyOiAxMDAwMDAsIGtzOiA2NH07XG4gICAgcy5lY2RzYSA9IHtcbiAgICAgIHBhaXI6IHtuYW1lOiAnRUNEU0EnLCBuYW1lZEN1
cnZlOiAnc2VjcDI1NmsxJ30sXG4gICAgICBzaWduOiB7bmFtZTogJ0VDRFNBJywgaGFzaDoge25hbWU6ICdTSEEtMjU2J319XG4gICAgfTtcbiAgICBzLmVj
ZGggPSB7bmFtZTogJ0VDREgnLCBuYW1lZEN1cnZlOiAnc2VjcDI1NmsxJ307XG5cbiAgICAvLyBUaGlzIGNyZWF0ZXMgV2ViIENyeXB0b2dyYXBoeSBBUEkg
Y29tcGxpYW50IEpXSyBmb3Igc2lnbi92ZXJpZnkgcHVycG9zZXNcbiAgICBzLmp3ayA9IGZ1bmN0aW9uKHB1YiwgZCl7ICAvLyBkID09PSBwcml2XG4gICAg
ICB2YXIgYjYyID0gU0VBLmJhc2U2MjtcbiAgICAgIHZhciB4eSA9IGI2Mi5wdWJUb0p3a1hZKHB1Yik7IC8vIGhhbmRsZXMgb2xkICg4Ny1jaGFyIHgueSkg
YW5kIG5ldyAoODgtY2hhciBiYXNlNjIpXG4gICAgICB2YXIgeCA9IHh5LngsIHkgPSB4eS55O1xuICAgICAgdmFyIGp3ayA9IHtrdHk6IFwiRUNcIiwgY3J2
OiBcInNlY3AyNTZrMVwiLCB4OiB4LCB5OiB5LCBleHQ6IHRydWV9O1xuICAgICAgandrLmtleV9vcHMgPSBkID8gWydzaWduJ10gOiBbJ3ZlcmlmeSddO1xu
ICAgICAgLy8gQ29udmVydCBiYXNlNjIgcHJpdiAoNDQtY2hhcikgYmFjayB0byBiYXNlNjR1cmwgZm9yIFdlYkNyeXB0byBKV0sgaW1wb3J0S2V5XG4gICAg
ICBpZihkKXsgandrLmQgPSAoZC5sZW5ndGggPT09IDQ0ICYmIC9eW0EtWmEtejAtOV17NDR9JC8udGVzdChkKSkgPyBiNjIuYjYyVG9CNjQoZCkgOiBkIH1c
biAgICAgIHJldHVybiBqd2s7XG4gICAgfTtcblxuICAgIHMua2V5VG9Kd2sgPSBmdW5jdGlvbihrZXlCeXRlcykge1xuICAgICAgY29uc3Qga2V5QjY0ID0g
a2V5Qnl0ZXMudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgY29uc3QgayA9IGtleUI2NC5yZXBsYWNlKC9cXCsvZywgJy0nKS5yZXBsYWNlKC9cXC8vZywg
J18nKS5yZXBsYWNlKC9cXD0vZywgJycpO1xuICAgICAgcmV0dXJuIHsga3R5OiAnb2N0JywgazogaywgZXh0OiBmYWxzZSwgYWxnOiAnQTI1NkdDTScgfTtc
biAgICB9XG5cbiAgICBzLnJlY2FsbCA9IHtcbiAgICAgIHZhbGlkaXR5OiAxMiAqIDYwICogNjAsIC8vIGludGVybmFsbHkgaW4gc2Vjb25kcyA6IDEyIGhv
dXJzXG4gICAgICBob29rOiBmdW5jdGlvbihwcm9wcyl7IHJldHVybiBwcm9wcyB9IC8vIHsgaWF0LCBleHAsIGFsaWFzLCByZW1lbWJlciB9IC8vIG9yIHJl
dHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiByZXNvbHZlKHByb3BzKVxuICAgIH07XG5cbiAgICBzLmNoZWNrID0gZnVuY3Rpb24odCl7
XG4gICAgICBpZih0eXBlb2YgdCAhPT0gJ3N0cmluZycpeyByZXR1cm4gZmFsc2UgfVxuICAgICAgaWYoJ1NFQXsnID09PSB0LnNsaWNlKDAsNCkpeyByZXR1
cm4gdHJ1ZSB9XG4gICAgICBpZigneycgIT09IHQuc2xpY2UoMCwxKSl7IHJldHVybiBmYWxzZSB9XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgcGFyc2Vk
ID0gSlNPTi5wYXJzZSh0KTtcbiAgICAgICAgcmV0dXJuICEhKHBhcnNlZCAmJiAoXG4gICAgICAgICAgKHR5cGVvZiBwYXJzZWQucyA9PT0gJ3N0cmluZycg
JiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcnNlZCwgJ20nKSkgfHxcbiAgICAgICAgICAodHlwZW9mIHBhcnNlZC5jdCA9PT0g
J3N0cmluZycgJiYgdHlwZW9mIHBhcnNlZC5pdiA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIHBhcnNlZC5zID09PSAnc3RyaW5nJylcbiAgICAgICAgKSk7XG4g
ICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBzLnBhcnNlID0gYXN5bmMgZnVuY3Rpb24gcCh0KXsgdHJ5IHtc
biAgICAgIHZhciB5ZXMgPSAodHlwZW9mIHQgPT0gJ3N0cmluZycpO1xuICAgICAgaWYoeWVzICYmICdTRUF7JyA9PT0gdC5zbGljZSgwLDQpKXsgdCA9IHQu
c2xpY2UoMykgfVxuICAgICAgcmV0dXJuIHllcyA/IGF3YWl0IHNoaW0ucGFyc2UodCkgOiB0O1xuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgIHJldHVy
biB0O1xuICAgIH1cblxuICAgIFNFQS5vcHQgPSBzO1xuICAgIF9fZGVmYXVsdEV4cG9ydCA9IHNcbiAgXG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgX19kZWZh
dWx0RXhwb3J0O1xuIiwic2VhL3NoYTI1Ni5qcyI6ImltcG9ydCBfX3NoaW0gZnJvbSAnLi9zaGltLmpzJztcblxubGV0IF9fZGVmYXVsdEV4cG9ydDtcbihm
dW5jdGlvbigpe1xuXG4gICAgdmFyIHNoaW0gPSBfX3NoaW07XG4gICAgX19kZWZhdWx0RXhwb3J0ID0gYXN5bmMgZnVuY3Rpb24oZCwgbyl7XG4gICAgICB2
YXIgdCA9ICh0eXBlb2YgZCA9PSAnc3RyaW5nJyk/IGQgOiBhd2FpdCBzaGltLnN0cmluZ2lmeShkKTtcbiAgICAgIHZhciBoYXNoID0gYXdhaXQgc2hpbS5z
dWJ0bGUuZGlnZXN0KHtuYW1lOiBvfHwnU0hBLTI1Nid9LCBuZXcgc2hpbS5UZXh0RW5jb2RlcigpLmVuY29kZSh0KSk7XG4gICAgICByZXR1cm4gc2hpbS5C
dWZmZXIuZnJvbShoYXNoKTtcbiAgICB9XG4gIFxufSgpKTtcbmV4cG9ydCBkZWZhdWx0IF9fZGVmYXVsdEV4cG9ydDsiLCJzZWEvc2hhMS5qcyI6ImltcG9y
dCBfX3NoaW1fMiBmcm9tICcuL3NoaW0uanMnO1xuXG5sZXQgX19kZWZhdWx0RXhwb3J0O1xuKGZ1bmN0aW9uKCl7XG5cbiAgICAvLyBUaGlzIGludGVybmFs
IGZ1bmMgcmV0dXJucyBTSEEtMSBoYXNoZWQgZGF0YSBmb3IgS2V5SUQgZ2VuZXJhdGlvblxuICAgIGNvbnN0IF9fc2hpbSA9IF9fc2hpbV8yXG4gICAgY29u
c3Qgc3VidGxlID0gX19zaGltLnN1YnRsZVxuICAgIGNvbnN0IG9zc2wgPSBfX3NoaW0ub3NzbCA/IF9fc2hpbS5vc3NsIDogc3VidGxlXG4gICAgY29uc3Qg
c2hhMWhhc2ggPSAoYikgPT4gb3NzbC5kaWdlc3Qoe25hbWU6ICdTSEEtMSd9LCBuZXcgQXJyYXlCdWZmZXIoYikpXG4gICAgX19kZWZhdWx0RXhwb3J0ID0g
c2hhMWhhc2hcbiAgXG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgX19kZWZhdWx0RXhwb3J0OyIsInNlYS93b3JrLmpzIjoiaW1wb3J0IF9fcm9vdCBmcm9tICcu
L3Jvb3QuanMnO1xuaW1wb3J0IF9fc2hpbSBmcm9tICcuL3NoaW0uanMnO1xuaW1wb3J0IF9fc2V0dGluZ3MgZnJvbSAnLi9zZXR0aW5ncy5qcyc7XG5pbXBv
cnQgX19zaGEyNTYgZnJvbSAnLi9zaGEyNTYuanMnO1xuXG5sZXQgX19kZWZhdWx0RXhwb3J0O1xuKGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgU0VBID0gX19y
b290O1xuICAgIHZhciBzaGltID0gX19zaGltO1xuICAgIHZhciBTID0gX19zZXR0aW5ncztcbiAgICB2YXIgc2hhID0gX19zaGEyNTY7XG4gICAgdmFyIHU7
XG5cbiAgICBTRUEud29yayA9IFNFQS53b3JrIHx8IChhc3luYyAoZGF0YSwgcGFpciwgY2IsIG9wdCkgPT4geyB0cnkgeyAvLyB1c2VkIHRvIGJlIG5hbWVk
IGBwcm9vZmBcbiAgICAgIHZhciBzYWx0ID0gKHBhaXJ8fHt9KS5lcHViIHx8IHBhaXI7IC8vIGVwdWIgbm90IHJlY29tbWVuZGVkLCBzYWx0IHNob3VsZCBi
ZSByYW5kb20hXG4gICAgICBvcHQgPSBvcHQgfHwge307XG4gICAgICB2YXIgZW5jID0gb3B0LmVuY29kZSB8fCAnYmFzZTYyJztcbiAgICAgIHZhciBiNjIg
PSBTRUEuYmFzZTYyO1xuICAgICAgaWYoc2FsdCBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcbiAgICAgICAgY2IgPSBzYWx0O1xuICAgICAgICBzYWx0ID0gdTtc
biAgICAgIH1cbiAgICAgIC8vIENoZWNrIGlmIGRhdGEgaXMgYW4gQXJyYXlCdWZmZXIsIGlmIHNvIHVzZSBVaW50OEFycmF5IHRvIGFjY2VzcyB0aGUgZGF0
YVxuICAgICAgaWYoZGF0YSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKXtcbiAgICAgICAgZGF0YSA9IG5ldyBVaW50OEFycmF5KGRhdGEpO1xuICAgICAgICBk
YXRhID0gbmV3IHNoaW0uVGV4dERlY29kZXIoXCJ1dGYtOFwiKS5kZWNvZGUoZGF0YSk7XG4gICAgICB9XG4gICAgICBkYXRhID0gKHR5cGVvZiBkYXRhID09
ICdzdHJpbmcnKSA/IGRhdGEgOiBhd2FpdCBzaGltLnN0cmluZ2lmeShkYXRhKTtcbiAgICAgIGlmKCdzaGEnID09PSAob3B0Lm5hbWV8fCcnKS50b0xvd2Vy
Q2FzZSgpLnNsaWNlKDAsMykpe1xuICAgICAgICB2YXIgcnNoYSA9IHNoaW0uQnVmZmVyLmZyb20oYXdhaXQgc2hhKGRhdGEsIG9wdC5uYW1lKSwgJ2JpbmFy
eScpO1xuICAgICAgICByc2hhID0gKCdiYXNlNjInID09PSBlbmMpID8gYjYyLmJ1ZlRvQjYyKHJzaGEpIDogKCdiYXNlNjQnID09PSBlbmMpID8gYnRvYShT
dHJpbmcuZnJvbUNoYXJDb2RlKC4uLm5ldyBVaW50OEFycmF5KHJzaGEpKSkgOiByc2hhLnRvU3RyaW5nKGVuYyk7XG4gICAgICAgIGlmKGNiKXsgdHJ5eyBj
Yihyc2hhKSB9Y2F0Y2goZSl7Y29uc29sZS5sb2coZSl9IH1cbiAgICAgICAgcmV0dXJuIHJzaGE7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHNhbHQg
PT09IFwibnVtYmVyXCIpIHNhbHQgPSBzYWx0LnRvU3RyaW5nKCk7XG4gICAgICBpZiAodHlwZW9mIG9wdC5zYWx0ID09PSBcIm51bWJlclwiKSBvcHQuc2Fs
dCA9IG9wdC5zYWx0LnRvU3RyaW5nKCk7XG4gICAgICBzYWx0ID0gc2FsdCB8fCBzaGltLnJhbmRvbSg5KTtcbiAgICAgIHZhciBrZXkgPSBhd2FpdCAoc2hp
bS5vc3NsIHx8IHNoaW0uc3VidGxlKS5pbXBvcnRLZXkoJ3JhdycsIG5ldyBzaGltLlRleHRFbmNvZGVyKCkuZW5jb2RlKGRhdGEpLCB7bmFtZTogb3B0Lm5h
bWUgfHwgJ1BCS0RGMid9LCBmYWxzZSwgWydkZXJpdmVCaXRzJ10pO1xuICAgICAgdmFyIHdvcmsgPSBhd2FpdCAoc2hpbS5vc3NsIHx8IHNoaW0uc3VidGxl
KS5kZXJpdmVCaXRzKHtcbiAgICAgICAgbmFtZTogb3B0Lm5hbWUgfHwgJ1BCS0RGMicsXG4gICAgICAgIGl0ZXJhdGlvbnM6IG9wdC5pdGVyYXRpb25zIHx8
IFMucGJrZGYyLml0ZXIsXG4gICAgICAgIHNhbHQ6IG5ldyBzaGltLlRleHRFbmNvZGVyKCkuZW5jb2RlKG9wdC5zYWx0IHx8IHNhbHQpLFxuICAgICAgICBo
YXNoOiBvcHQuaGFzaCB8fCBTLnBia2RmMi5oYXNoLFxuICAgICAgfSwga2V5LCBvcHQubGVuZ3RoIHx8IChTLnBia2RmMi5rcyAqIDgpKVxuICAgICAgZGF0
YSA9IHNoaW0ucmFuZG9tKGRhdGEubGVuZ3RoKSAgLy8gRXJhc2UgZGF0YSBpbiBjYXNlIG9mIHBhc3NwaHJhc2VcbiAgICAgIHZhciByID0gc2hpbS5CdWZm
ZXIuZnJvbSh3b3JrLCAnYmluYXJ5Jyk7XG4gICAgICByID0gKCdiYXNlNjInID09PSBlbmMpID8gYjYyLmJ1ZlRvQjYyKHIpIDogKCdiYXNlNjQnID09PSBl
bmMpID8gYnRvYShTdHJpbmcuZnJvbUNoYXJDb2RlKC4uLm5ldyBVaW50OEFycmF5KHIpKSkgOiByLnRvU3RyaW5nKGVuYyk7XG4gICAgICBpZihjYil7IHRy
eXsgY2IocikgfWNhdGNoKGUpe2NvbnNvbGUubG9nKGUpfSB9XG4gICAgICByZXR1cm4gcjtcbiAgICB9IGNhdGNoKGUpIHsgXG4gICAgICBjb25zb2xlLmxv
ZyhlKTtcbiAgICAgIFNFQS5lcnIgPSBlO1xuICAgICAgaWYoU0VBLnRocm93KXsgdGhyb3cgZSB9XG4gICAgICBpZihjYil7IGNiKCkgfVxuICAgICAgcmV0
dXJuO1xuICAgIH19KTtcblxuICAgIF9fZGVmYXVsdEV4cG9ydCA9IFNFQS53b3JrO1xuICBcbn0oKSk7XG5leHBvcnQgZGVmYXVsdCBfX2RlZmF1bHRFeHBv
cnQ7XG4iLCJzZWEvcGFpci5qcyI6ImltcG9ydCBfX3Jvb3QgZnJvbSAnLi9yb290LmpzJztcbmltcG9ydCBfX3BhaXIgZnJvbSAnLi9zZWNwMjU2azEucGFp
ci5qcyc7XG5cbmxldCBfX2RlZmF1bHRFeHBvcnQ7XG4oZnVuY3Rpb24oKXtcblxuICAgIHZhciBTRUEgPSBfX3Jvb3Q7XG4gICAgU0VBLnBhaXIgPSBTRUEu
cGFpciB8fCAoYXN5bmMgKGNiLCBvcHQpID0+IHsgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBfX3BhaXIoY2IsIG9wdCk7XG4gICAgfSBjYXRjaChlKSB7
XG4gICAgICBTRUEuZXJyID0gZTtcbiAgICAgIGlmKFNFQS50aHJvdykgdGhyb3cgZTtcbiAgICAgIGlmKGNiKSB0cnkgeyBjYigpOyB9IGNhdGNoKGNiRXJy
KSB7fVxuICAgICAgcmV0dXJuO1xuICAgIH19KTtcblxuICAgIF9fZGVmYXVsdEV4cG9ydCA9IFNFQS5wYWlyO1xuICBcbn0oKSk7XG5leHBvcnQgZGVmYXVs
dCBfX2RlZmF1bHRFeHBvcnQ7XG4iLCJzZWEvc2lnbi5qcyI6ImltcG9ydCBfX3Jvb3QgZnJvbSAnLi9yb290LmpzJztcbmltcG9ydCBfX3NoaW0gZnJvbSAn
Li9zaGltLmpzJztcbmltcG9ydCBfX3NldHRpbmdzIGZyb20gJy4vc2V0dGluZ3MuanMnO1xuaW1wb3J0IF9fc2lnbiBmcm9tICcuL3NlY3AyNTZrMS5zaWdu
LmpzJztcblxubGV0IF9fZGVmYXVsdEV4cG9ydDtcbihmdW5jdGlvbigpe1xuXG4gICAgdmFyIFNFQSA9IF9fcm9vdDtcbiAgICB2YXIgc2hpbSA9IF9fc2hp
bTtcbiAgICB2YXIgUyA9IF9fc2V0dGluZ3M7XG4gICAgdmFyIHU7XG5cbiAgICBhc3luYyBmdW5jdGlvbiBuKHIsIG8sIGMpIHtcbiAgICAgIHRyeSB7XG4g
ICAgICAgIGlmKCFvLnJhdyl7IHIgPSBhd2FpdCBzaGltLnN0cmluZ2lmeShyKSB9XG4gICAgICAgIGlmKGMpeyB0cnl7IGMocikgfWNhdGNoKGUpe30gfVxu
ICAgICAgICByZXR1cm4gcjtcbiAgICAgIH0gY2F0Y2goZSkgeyByZXR1cm4gciB9XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gdyhyLCBqLCBvLCBj
KSB7XG4gICAgICB2YXIgeCA9IHtcbiAgICAgICAgbTogaixcbiAgICAgICAgczogci5zaWduYXR1cmUgPyBzaGltLkJ1ZmZlci5mcm9tKHIuc2lnbmF0dXJl
LCAnYmluYXJ5JykudG9TdHJpbmcoby5lbmNvZGUgfHwgJ2Jhc2U2NCcpIDogdSxcbiAgICAgICAgYTogc2hpbS5CdWZmZXIuZnJvbShyLmF1dGhlbnRpY2F0
b3JEYXRhLCAnYmluYXJ5JykudG9TdHJpbmcoJ2Jhc2U2NCcpLFxuICAgICAgICBjOiBzaGltLkJ1ZmZlci5mcm9tKHIuY2xpZW50RGF0YUpTT04sICdiaW5h
cnknKS50b1N0cmluZygnYmFzZTY0JylcbiAgICAgIH07XG4gICAgICBpZiAoIXgucyB8fCAheC5hIHx8ICF4LmMpIHRocm93IFwiV2ViQXV0aG4gc2lnbmF0
dXJlIGludmFsaWRcIjtcbiAgICAgIHJldHVybiBuKHgsIG8sIGMpO1xuICAgIH1cblxuICAgIFNFQS5zaWduID0gU0VBLnNpZ24gfHwgKGFzeW5jIChkYXRh
LCBwYWlyLCBjYiwgb3B0KSA9PiB7IHRyeSB7XG4gICAgICBvcHQgPSBvcHQgfHwge307XG4gICAgICBpZih1ID09PSBkYXRhKSB0aHJvdyAnYHVuZGVmaW5l
ZGAgbm90IGFsbG93ZWQuJztcbiAgICAgIGlmKCEocGFpcnx8b3B0KS5wcml2ICYmIHR5cGVvZiBwYWlyICE9PSAnZnVuY3Rpb24nKXtcbiAgICAgICAgaWYo
IVNFQS5JKSB0aHJvdyAnTm8gc2lnbmluZyBrZXkuJztcbiAgICAgICAgcGFpciA9IGF3YWl0IFNFQS5JKG51bGwsIHt3aGF0OiBkYXRhLCBob3c6ICdzaWdu
Jywgd2h5OiBvcHQud2h5fSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBqID0gYXdhaXQgUy5wYXJzZShkYXRhKTtcbiAgICAgIHZhciBjID0gb3B0LmNoZWNr
ID0gb3B0LmNoZWNrIHx8IGo7XG5cbiAgICAgIGlmKFNFQS52ZXJpZnkgJiYgKFMuY2hlY2soYykgfHwgKGMgJiYgYy5zICYmIGMubSkpXG4gICAgICAmJiB1
ICE9PSAoYXdhaXQgU0VBLnZlcmlmeShjLCBwYWlyKSkpe1xuICAgICAgICByZXR1cm4gbihhd2FpdCBTLnBhcnNlKGMpLCBvcHQsIGNiKTtcbiAgICAgIH1c
blxuICAgICAgaWYodHlwZW9mIHBhaXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFyIHIgPSBhd2FpdCBwYWlyKGRhdGEpO1xuICAgICAgICByZXR1
cm4gci5hdXRoZW50aWNhdG9yRGF0YSA/IHcociwgaiwgb3B0LCBjYikgOiBcbiAgICAgICAgICBuKHttOiBqLCBzOiB0eXBlb2YgciA9PT0gJ3N0cmluZycg
PyByIDogXG4gICAgICAgICAgICByLnNpZ25hdHVyZSAmJiBzaGltLkJ1ZmZlci5mcm9tKHIuc2lnbmF0dXJlLCAnYmluYXJ5JykudG9TdHJpbmcob3B0LmVu
Y29kZSB8fCAnYmFzZTY0Jyl9LCBvcHQsIGNiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9fc2lnbihqLCBwYWlyLCBjYiwgb3B0KTtcbiAgICB9IGNh
dGNoKGUpIHtcbiAgICAgIFNFQS5lcnIgPSBlO1xuICAgICAgaWYoU0VBLnRocm93KXsgdGhyb3cgZSB9XG4gICAgICBpZihjYil7IGNiKCkgfVxuICAgICAg
cmV0dXJuO1xuICAgIH19KTtcblxuICAgIF9fZGVmYXVsdEV4cG9ydCA9IFNFQS5zaWduO1xuICBcbn0oKSk7XG5leHBvcnQgZGVmYXVsdCBfX2RlZmF1bHRF
eHBvcnQ7XG4iLCJzZWEvdmVyaWZ5LmpzIjoiaW1wb3J0IF9fcm9vdCBmcm9tICcuL3Jvb3QuanMnO1xuaW1wb3J0IF9fc2hpbSBmcm9tICcuL3NoaW0uanMn
O1xuaW1wb3J0IF9fc2V0dGluZ3MgZnJvbSAnLi9zZXR0aW5ncy5qcyc7XG5pbXBvcnQgX192ZXJpZnkgZnJvbSAnLi9zZWNwMjU2azEudmVyaWZ5LmpzJztc
blxubGV0IF9fZGVmYXVsdEV4cG9ydDtcbihmdW5jdGlvbigpe1xuXG4gICAgdmFyIFNFQSA9IF9fcm9vdDtcbiAgICB2YXIgc2hpbSA9IF9fc2hpbTtcbiAg
ICB2YXIgUyA9IF9fc2V0dGluZ3M7XG4gICAgdmFyIHU7XG5cbiAgICBhc3luYyBmdW5jdGlvbiB3KGosIGssIHMpIHtcbiAgICAgIHZhciBhID0gbmV3IFVp
bnQ4QXJyYXkoc2hpbS5CdWZmZXIuZnJvbShqLmEsICdiYXNlNjQnKSk7XG4gICAgICB2YXIgYyA9IHNoaW0uQnVmZmVyLmZyb20oai5jLCAnYmFzZTY0Jyku
dG9TdHJpbmcoJ3V0ZjgnKTtcbiAgICAgIHZhciBtID0gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKGoubSk7XG4gICAgICB2YXIgZSA9IGJ0b2EoU3RyaW5n
LmZyb21DaGFyQ29kZSguLi5uZXcgVWludDhBcnJheShtKSkpLnJlcGxhY2UoL1xcKy9nLCAnLScpLnJlcGxhY2UoL1xcLy9nLCAnXycpLnJlcGxhY2UoLz0v
ZywgJycpO1xuICAgICAgaWYgKEpTT04ucGFyc2UoYykuY2hhbGxlbmdlICE9PSBlKSB0aHJvdyBcIkNoYWxsZW5nZSB2ZXJpZmljYXRpb24gZmFpbGVkXCI7
XG4gICAgICB2YXIgaCA9IGF3YWl0IChzaGltLm9zc2wgfHwgc2hpbS5zdWJ0bGUpLmRpZ2VzdChcbiAgICAgICAgICB7bmFtZTogJ1NIQS0yNTYnfSxcbiAg
ICAgICAgICBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUoYylcbiAgICAgICk7XG4gICAgICB2YXIgZCA9IG5ldyBVaW50OEFycmF5KGEubGVuZ3RoICsgaC5i
eXRlTGVuZ3RoKTtcbiAgICAgIGQuc2V0KGEpO1xuICAgICAgZC5zZXQobmV3IFVpbnQ4QXJyYXkoaCksIGEubGVuZ3RoKTtcbiAgICAgIGlmIChzWzBdICE9
PSAweDMwKSB0aHJvdyBcIkludmFsaWQgREVSIHNpZ25hdHVyZSBmb3JtYXRcIjtcbiAgICAgIHZhciBvID0gMiwgciA9IG5ldyBVaW50OEFycmF5KDY0KTtc
biAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAyOyBpKyspIHtcbiAgICAgICAgdmFyIGwgPSBzW28gKyAxXTtcbiAgICAgICAgbyArPSAyO1xuICAgICAgICBp
ZiAoc1tvXSA9PT0gMHgwMCkgeyBvKys7IGwtLTsgfVxuICAgICAgICB2YXIgcCA9IG5ldyBVaW50OEFycmF5KDMyKS5maWxsKDApO1xuICAgICAgICBwLnNl
dChzLnNsaWNlKG8sIG8gKyBsKSwgMzIgLSBsKTtcbiAgICAgICAgci5zZXQocCwgaSAqIDMyKTtcbiAgICAgICAgbyArPSBsO1xuICAgICAgfVxuICAgICAg
cmV0dXJuIChzaGltLm9zc2wgfHwgc2hpbS5zdWJ0bGUpLnZlcmlmeSh7IG5hbWU6ICdFQ0RTQScsIGhhc2g6IHtuYW1lOiAnU0hBLTI1Nid9IH0sIGssIHIs
IGQpO1xuICAgIH1cblxuICAgIFNFQS52ZXJpZnkgPSBTRUEudmVyaWZ5IHx8IChhc3luYyAoZCwgcCwgY2IsIG8pID0+IHsgdHJ5IHtcbiAgICAgIHZhciBq
ID0gYXdhaXQgUy5wYXJzZShkKTtcbiAgICAgIGlmKGZhbHNlID09PSBwKSByZXR1cm4gY2IgPyBjYihhd2FpdCBTLnBhcnNlKGoubSkpIDogYXdhaXQgUy5w
YXJzZShqLm0pO1xuXG4gICAgICBvID0gbyB8fCB7fTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYoaiAmJiBqLmEgJiYgai5jKXtcbiAgICAgICAgICB2
YXIgcHViID0gcC5wdWIgfHwgcDtcbiAgICAgICAgICB2YXIgYjYyID0gU0VBLmJhc2U2MjtcbiAgICAgICAgICB2YXIgeHkgPSBiNjIucHViVG9Kd2tYWShw
dWIpO1xuICAgICAgICAgIHZhciB4ID0geHkueCwgeSA9IHh5Lnk7XG4gICAgICAgICAgdmFyIGsgPSBhd2FpdCAoc2hpbS5vc3NsIHx8IHNoaW0uc3VidGxl
KS5pbXBvcnRLZXkoJ2p3aycsIHtcbiAgICAgICAgICAgICAga3R5OiAnRUMnLCBjcnY6ICdQLTI1NicsIHgsIHksIGV4dDogdHJ1ZSwga2V5X29wczogWyd2
ZXJpZnknXVxuICAgICAgICAgIH0sIHtuYW1lOiAnRUNEU0EnLCBuYW1lZEN1cnZlOiAnUC0yNTYnfSwgZmFsc2UsIFsndmVyaWZ5J10pO1xuICAgICAgICAg
IHZhciBzID0gbmV3IFVpbnQ4QXJyYXkoc2hpbS5CdWZmZXIuZnJvbShqLnMgfHwgJycsIG8uZW5jb2RlIHx8ICdiYXNlNjQnKSk7XG4gICAgICAgICAgdmFy
IGMgPSBhd2FpdCB3KGosIGssIHMpO1xuICAgICAgICAgIGlmKCFjKSB0aHJvdyBcIlNpZ25hdHVyZSBkaWQgbm90IG1hdGNoXCI7XG4gICAgICAgICAgdmFy
IHJhdyA9IGF3YWl0IFMucGFyc2Uoai5tKTtcbiAgICAgICAgICBpZihjYil7IHRyeXsgY2IocmF3KSB9Y2F0Y2goZSl7fSB9XG4gICAgICAgICAgcmV0dXJu
IHJhdztcbiAgICAgICAgfVxuICAgICAgICB2YXIgdmVyaWZpZWQgPSBhd2FpdCBfX3ZlcmlmeShkLCBwLCBudWxsLCBvKTtcbiAgICAgICAgdmFyIHNpZ25l
ZE1lc3NhZ2UgPSBqICYmIGoubTtcbiAgICAgICAgaWYodHlwZW9mIHNpZ25lZE1lc3NhZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdmFyIHBhcnNl
ZCA9IGF3YWl0IFMucGFyc2Uoc2lnbmVkTWVzc2FnZSk7XG4gICAgICAgICAgaWYocGFyc2VkICYmIHR5cGVvZiBwYXJzZWQgPT09ICdvYmplY3QnICYmXG4g
ICAgICAgICAgICAgdHlwZW9mIHBhcnNlZC5jdCA9PT0gJ3N0cmluZycgJiZcbiAgICAgICAgICAgICB0eXBlb2YgcGFyc2VkLml2ID09PSAnc3RyaW5nJyAm
JlxuICAgICAgICAgICAgIHR5cGVvZiBwYXJzZWQucyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmKGNiKXsgdHJ5eyBjYihzaWduZWRNZXNzYWdl
KSB9Y2F0Y2goZSl7fSB9XG4gICAgICAgICAgICByZXR1cm4gc2lnbmVkTWVzc2FnZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYoY2Ip
eyB0cnl7IGNiKHZlcmlmaWVkKSB9Y2F0Y2goZSl7fSB9XG4gICAgICAgIHJldHVybiB2ZXJpZmllZDtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBp
ZihjYil7IGNiKCkgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBTRUEuZXJyID0gZTtcbiAgICAgIGlmKFNF
QS50aHJvdyl7IHRocm93IGUgfVxuICAgICAgaWYoY2IpeyBjYigpIH1cbiAgICAgIHJldHVybjtcbiAgICB9fSk7XG5cbiAgICBfX2RlZmF1bHRFeHBvcnQg
PSBTRUEudmVyaWZ5O1xuXG4gICAgU0VBLm9wdC5mYWxsYmFjayA9IDA7XG4gIFxufSgpKTtcbmV4cG9ydCBkZWZhdWx0IF9fZGVmYXVsdEV4cG9ydDtcbiIs
InNlYS9hZXNrZXkuanMiOiJpbXBvcnQgX19zaGltIGZyb20gJy4vc2hpbS5qcyc7XG5pbXBvcnQgX19zZXR0aW5ncyBmcm9tICcuL3NldHRpbmdzLmpzJztc
bmltcG9ydCBfX3NoYTI1NiBmcm9tICcuL3NoYTI1Ni5qcyc7XG5cbmxldCBfX2RlZmF1bHRFeHBvcnQ7XG4oZnVuY3Rpb24oKXtcblxuICAgIHZhciBzaGlt
ID0gX19zaGltO1xuICAgIHZhciBTID0gX19zZXR0aW5ncztcbiAgICB2YXIgc2hhMjU2aGFzaCA9IF9fc2hhMjU2O1xuXG4gICAgY29uc3QgaW1wb3J0R2Vu
ID0gYXN5bmMgKGtleSwgc2FsdCwgb3B0KSA9PiB7XG4gICAgICAvL2NvbnN0IGNvbWJvID0gc2hpbS5CdWZmZXIuY29uY2F0KFtzaGltLkJ1ZmZlci5mcm9t
KGtleSwgJ3V0ZjgnKSwgc2FsdCB8fCBzaGltLnJhbmRvbSg4KV0pLnRvU3RyaW5nKCd1dGY4JykgLy8gb2xkXG4gICAgICBvcHQgPSBvcHQgfHwge307XG4g
ICAgICBjb25zdCBjb21ibyA9IGtleSArIChzYWx0IHx8IHNoaW0ucmFuZG9tKDgpKS50b1N0cmluZygndXRmOCcpOyAvLyBuZXdcbiAgICAgIGNvbnN0IGhh
c2ggPSBzaGltLkJ1ZmZlci5mcm9tKGF3YWl0IHNoYTI1Nmhhc2goY29tYm8pLCAnYmluYXJ5JylcblxuICAgICAgY29uc3QgandrS2V5ID0gUy5rZXlUb0p3
ayhoYXNoKSAgICAgIFxuICAgICAgcmV0dXJuIGF3YWl0IHNoaW0uc3VidGxlLmltcG9ydEtleSgnandrJywgandrS2V5LCB7bmFtZTonQUVTLUdDTSd9LCBm
YWxzZSwgWydlbmNyeXB0JywgJ2RlY3J5cHQnXSlcbiAgICB9XG4gICAgX19kZWZhdWx0RXhwb3J0ID0gaW1wb3J0R2VuO1xuICBcbn0oKSk7XG5leHBvcnQg
ZGVmYXVsdCBfX2RlZmF1bHRFeHBvcnQ7Iiwic2VhL2VuY3J5cHQuanMiOiJpbXBvcnQgX19yb290IGZyb20gJy4vcm9vdC5qcyc7XG5pbXBvcnQgX19lbmNy
eXB0IGZyb20gJy4vc2VjcDI1NmsxLmVuY3J5cHQuanMnO1xuXG5sZXQgX19kZWZhdWx0RXhwb3J0O1xuKGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgU0VBID0g
X19yb290O1xuICAgIHZhciB1O1xuXG4gICAgU0VBLmVuY3J5cHQgPSBTRUEuZW5jcnlwdCB8fCAoYXN5bmMgKGRhdGEsIHBhaXIsIGNiLCBvcHQpID0+IHsg
dHJ5IHtcbiAgICAgIG9wdCA9IG9wdCB8fCB7fTtcbiAgICAgIHZhciBrZXkgPSAocGFpcnx8b3B0KS5lcHJpdiB8fCBwYWlyO1xuICAgICAgaWYodSA9PT0g
ZGF0YSl7IHRocm93ICdgdW5kZWZpbmVkYCBub3QgYWxsb3dlZC4nIH1cbiAgICAgIGlmKCFrZXkpe1xuICAgICAgICBpZighU0VBLkkpeyB0aHJvdyAnTm8g
ZW5jcnlwdGlvbiBrZXkuJyB9XG4gICAgICAgIHBhaXIgPSBhd2FpdCBTRUEuSShudWxsLCB7d2hhdDogZGF0YSwgaG93OiAnZW5jcnlwdCcsIHdoeTogb3B0
LndoeX0pO1xuICAgICAgICBrZXkgPSBwYWlyLmVwcml2IHx8IHBhaXI7XG4gICAgICB9XG4gICAgICByZXR1cm4gYXdhaXQgX19lbmNyeXB0KGRhdGEsIGtl
eSwgY2IsIG9wdCk7XG4gICAgfSBjYXRjaChlKSB7IFxuICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICBTRUEuZXJyID0gZTtcbiAgICAgIGlmKFNFQS50
aHJvdyl7IHRocm93IGUgfVxuICAgICAgaWYoY2IpeyBjYigpIH1cbiAgICAgIHJldHVybjtcbiAgICB9fSk7XG5cbiAgICBfX2RlZmF1bHRFeHBvcnQgPSBT
RUEuZW5jcnlwdDtcbiAgXG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgX19kZWZhdWx0RXhwb3J0O1xuIiwic2VhL2RlY3J5cHQuanMiOiJpbXBvcnQgX19yb290
IGZyb20gJy4vcm9vdC5qcyc7XG5pbXBvcnQgX19kZWNyeXB0IGZyb20gJy4vc2VjcDI1NmsxLmRlY3J5cHQuanMnO1xuXG5sZXQgX19kZWZhdWx0RXhwb3J0
O1xuKGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgU0VBID0gX19yb290O1xuXG4gICAgU0VBLmRlY3J5cHQgPSBTRUEuZGVjcnlwdCB8fCAoYXN5bmMgKGRhdGEs
IHBhaXIsIGNiLCBvcHQpID0+IHsgdHJ5IHtcbiAgICAgIG9wdCA9IG9wdCB8fCB7fTtcbiAgICAgIHZhciBrZXkgPSAocGFpcnx8b3B0KS5lcHJpdiB8fCBw
YWlyO1xuICAgICAgaWYoIWtleSl7XG4gICAgICAgIGlmKCFTRUEuSSl7IHRocm93ICdObyBkZWNyeXB0aW9uIGtleS4nIH1cbiAgICAgICAgcGFpciA9IGF3
YWl0IFNFQS5JKG51bGwsIHt3aGF0OiBkYXRhLCBob3c6ICdkZWNyeXB0Jywgd2h5OiBvcHQud2h5fSk7XG4gICAgICAgIGtleSA9IHBhaXIuZXByaXYgfHwg
cGFpcjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhd2FpdCBfX2RlY3J5cHQoZGF0YSwga2V5LCBjYiwgb3B0KTtcbiAgICB9IGNhdGNoKGUpIHsgXG4gICAg
ICBTRUEuZXJyID0gZTtcbiAgICAgIGlmKFNFQS50aHJvdyl7IHRocm93IGUgfVxuICAgICAgaWYoY2IpeyBjYigpIH1cbiAgICAgIHJldHVybjtcbiAgICB9
fSk7XG5cbiAgICBfX2RlZmF1bHRFeHBvcnQgPSBTRUEuZGVjcnlwdDtcbiAgXG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgX19kZWZhdWx0RXhwb3J0O1xuIiwi
c2VhL3NlY3JldC5qcyI6ImltcG9ydCBfX3Jvb3QgZnJvbSAnLi9yb290LmpzJztcbmltcG9ydCBfX3NlY3JldCBmcm9tICcuL3NlY3AyNTZrMS5zZWNyZXQu
anMnO1xuXG5sZXQgX19kZWZhdWx0RXhwb3J0O1xuKGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgU0VBID0gX19yb290O1xuICAgIC8vIERlcml2ZSBzaGFyZWQg
c2VjcmV0IGZyb20gb3RoZXIncyBwdWIgYW5kIG15IGVwdWIvZXByaXYgXG4gICAgU0VBLnNlY3JldCA9IFNFQS5zZWNyZXQgfHwgKGFzeW5jIChrZXksIHBh
aXIsIGNiLCBvcHQpID0+IHsgdHJ5IHtcbiAgICAgIG9wdCA9IG9wdCB8fCB7fTtcbiAgICAgIGlmKCFwYWlyIHx8ICFwYWlyLmVwcml2IHx8ICFwYWlyLmVw
dWIpe1xuICAgICAgICBpZighU0VBLkkpeyB0aHJvdyAnTm8gc2VjcmV0IG1peC4nIH1cbiAgICAgICAgcGFpciA9IGF3YWl0IFNFQS5JKG51bGwsIHt3aGF0
OiBrZXksIGhvdzogJ3NlY3JldCcsIHdoeTogb3B0LndoeX0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGF3YWl0IF9fc2VjcmV0KGtleSwgcGFpciwgY2Is
IG9wdCk7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgIFNFQS5lcnIgPSBlO1xuICAgICAgaWYoU0VBLnRocm93KXsg
dGhyb3cgZSB9XG4gICAgICBpZihjYil7IGNiKCkgfVxuICAgICAgcmV0dXJuO1xuICAgIH19KTtcblxuICAgIF9fZGVmYXVsdEV4cG9ydCA9IFNFQS5zZWNy
ZXQ7XG4gIFxufSgpKTtcbmV4cG9ydCBkZWZhdWx0IF9fZGVmYXVsdEV4cG9ydDtcbiIsInNlYS9jZXJ0aWZ5LmpzIjoiaW1wb3J0IF9fcm9vdCBmcm9tICcu
L3Jvb3QuanMnO1xuXG5sZXQgX19kZWZhdWx0RXhwb3J0O1xuKGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgU0VBID0gX19yb290O1xuICAgIC8vIFRoaXMgaXMg
dG8gY2VydGlmeSB0aGF0IGEgZ3JvdXAgb2YgXCJjZXJ0aWZpY2FudHNcIiBjYW4gXCJwdXRcIiBhbnl0aGluZyBhdCBhIGdyb3VwIG9mIG1hdGNoZWQgXCJw
YXRoc1wiIHRvIHRoZSBjZXJ0aWZpY2F0ZSBhdXRob3JpdHkncyBncmFwaFxuICAgIFNFQS5jZXJ0aWZ5ID0gU0VBLmNlcnRpZnkgfHwgKGFzeW5jIChjZXJ0
aWZpY2FudHMsIHBvbGljeSA9IHt9LCBhdXRob3JpdHksIGNiLCBvcHQgPSB7fSkgPT4geyB0cnkge1xuICAgICAgLypcbiAgICAgIFRoZSBDZXJ0aWZ5IFBy
b3RvY29sIHdhcyBtYWRlIG91dCBvZiBsb3ZlIGJ5IGEgVmlldG5hbWVzZSBjb2RlIGVudGh1c2lhc3QuIFZpZXRuYW1lc2UgcGVvcGxlIGFyb3VuZCB0aGUg
d29ybGQgZGVzZXJ2ZSByZXNwZWN0IVxuICAgICAgSU1QT1JUQU5UOiBBIENlcnRpZmljYXRlIGlzIGxpa2UgYSBTaWduYXR1cmUuIE5vIG9uZSBrbm93cyB3
aG8gKGF1dGhvcml0eSkgY3JlYXRlZC9zaWduZWQgYSBjZXJ0IHVudGlsIHlvdSBwdXQgaXQgaW50byB0aGVpciBncmFwaC5cbiAgICAgIFwiY2VydGlmaWNh
bnRzXCI6ICcqJyBvciBhIFN0cmluZyAoQm9iLnB1YikgfHwgYW4gT2JqZWN0IHRoYXQgY29udGFpbnMgXCJwdWJcIiBhcyBhIGtleSB8fCBhbiBhcnJheSBv
ZiBbb2JqZWN0IHx8IHN0cmluZ10uIFRoZXNlIHBlb3BsZSB3aWxsIGhhdmUgdGhlIHJpZ2h0cy5cbiAgICAgIFwicG9saWN5XCI6IEEgc3RyaW5nICgnaW5i
b3gnKSwgb3IgYSBSQUQvTEVYIG9iamVjdCB7JyonOiAnaW5ib3gnfSwgb3IgYW4gQXJyYXkgb2YgUkFEL0xFWCBvYmplY3RzIG9yIHN0cmluZ3MuIFJBRC9M
RVggb2JqZWN0IGNhbiBjb250YWluIGtleSBcIj9cIiB3aXRoIGluZGV4T2YoXCIqXCIpID4gLTEgdG8gZm9yY2Uga2V5IGVxdWFscyBjZXJ0aWZpY2FudCBw
dWIuIFRoaXMgcnVsZSBpcyB1c2VkIHRvIGNoZWNrIGFnYWluc3Qgc291bCsnLycra2V5IHVzaW5nIEd1bi50ZXh0Lm1hdGNoIG9yIFN0cmluZy5tYXRjaC5c
biAgICAgIFwiYXV0aG9yaXR5XCI6IEtleSBwYWlyIG9yIHByaXYgb2YgdGhlIGNlcnRpZmljYXRlIGF1dGhvcml0eS5cbiAgICAgIFwiY2JcIjogQSBjYWxs
YmFjayBmdW5jdGlvbiBhZnRlciBhbGwgdGhpbmdzIGFyZSBkb25lLlxuICAgICAgXCJvcHRcIjogSWYgb3B0LmV4cGlyeSAoYSB0aW1lc3RhbXApIGlzIHNl
dCwgU0VBIHdvbid0IHN5bmMgZGF0YSBhZnRlciBvcHQuZXhwaXJ5LiBJZiBvcHQuYmxvY2sgaXMgc2V0LCBTRUEgd2lsbCBsb29rIGZvciBibG9jayBiZWZv
cmUgc3luY2luZy5cbiAgICAgICovXG5cbiAgICAgIGNlcnRpZmljYW50cyA9ICgoKSA9PiB7XG4gICAgICAgIHZhciBkYXRhID0gW11cbiAgICAgICAgaWYg
KGNlcnRpZmljYW50cykge1xuICAgICAgICAgIGlmICgodHlwZW9mIGNlcnRpZmljYW50cyA9PT0gJ3N0cmluZycgfHwgQXJyYXkuaXNBcnJheShjZXJ0aWZp
Y2FudHMpKSAmJiBjZXJ0aWZpY2FudHMuaW5kZXhPZignKicpID4gLTEpIHJldHVybiAnKidcbiAgICAgICAgICBpZiAodHlwZW9mIGNlcnRpZmljYW50cyA9
PT0gJ3N0cmluZycpIHJldHVybiBjZXJ0aWZpY2FudHNcbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjZXJ0aWZpY2FudHMpKSB7XG4gICAgICAgICAg
ICBpZiAoY2VydGlmaWNhbnRzLmxlbmd0aCA9PT0gMSAmJiBjZXJ0aWZpY2FudHNbMF0pIHJldHVybiB0eXBlb2YgY2VydGlmaWNhbnRzWzBdID09PSAnb2Jq
ZWN0JyAmJiBjZXJ0aWZpY2FudHNbMF0ucHViID8gY2VydGlmaWNhbnRzWzBdLnB1YiA6IHR5cGVvZiBjZXJ0aWZpY2FudHNbMF0gPT09ICdzdHJpbmcnID8g
Y2VydGlmaWNhbnRzWzBdIDogbnVsbFxuICAgICAgICAgICAgY2VydGlmaWNhbnRzLm1hcChjZXJ0aWZpY2FudCA9PiB7XG4gICAgICAgICAgICAgIGlmICh0
eXBlb2YgY2VydGlmaWNhbnQgPT09J3N0cmluZycpIGRhdGEucHVzaChjZXJ0aWZpY2FudClcbiAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGNlcnRp
ZmljYW50ID09PSAnb2JqZWN0JyAmJiBjZXJ0aWZpY2FudC5wdWIpIGRhdGEucHVzaChjZXJ0aWZpY2FudC5wdWIpXG4gICAgICAgICAgICB9KVxuICAgICAg
ICAgIH1cblxuICAgICAgICAgIGlmICh0eXBlb2YgY2VydGlmaWNhbnRzID09PSAnb2JqZWN0JyAmJiBjZXJ0aWZpY2FudHMucHViKSByZXR1cm4gY2VydGlm
aWNhbnRzLnB1YlxuICAgICAgICAgIHJldHVybiBkYXRhLmxlbmd0aCA+IDAgPyBkYXRhIDogbnVsbFxuICAgICAgICB9XG4gICAgICAgIHJldHVyblxuICAg
ICAgfSkoKVxuXG4gICAgICBpZiAoIWNlcnRpZmljYW50cykgcmV0dXJuIGNvbnNvbGUubG9nKFwiTm8gY2VydGlmaWNhbnQgZm91bmQuXCIpXG5cbiAgICAg
IGNvbnN0IGV4cGlyeSA9IG9wdC5leHBpcnkgJiYgKHR5cGVvZiBvcHQuZXhwaXJ5ID09PSAnbnVtYmVyJyB8fCB0eXBlb2Ygb3B0LmV4cGlyeSA9PT0gJ3N0
cmluZycpID8gcGFyc2VGbG9hdChvcHQuZXhwaXJ5KSA6IG51bGxcbiAgICAgIGNvbnN0IHJlYWRQb2xpY3kgPSAocG9saWN5IHx8IHt9KS5yZWFkID8gcG9s
aWN5LnJlYWQgOiBudWxsXG4gICAgICBjb25zdCB3cml0ZVBvbGljeSA9IChwb2xpY3kgfHwge30pLndyaXRlID8gcG9saWN5LndyaXRlIDogdHlwZW9mIHBv
bGljeSA9PT0gJ3N0cmluZycgfHwgQXJyYXkuaXNBcnJheShwb2xpY3kpIHx8IHBvbGljeVtcIitcIl0gfHwgcG9saWN5W1wiI1wiXSB8fCBwb2xpY3lbXCIu
XCJdIHx8IHBvbGljeVtcIj1cIl0gfHwgcG9saWN5W1wiKlwiXSB8fCBwb2xpY3lbXCI+XCJdIHx8IHBvbGljeVtcIjxcIl0gPyBwb2xpY3kgOiBudWxsXG4g
ICAgICAvLyBUaGUgXCJibGFja2xpc3RcIiBmZWF0dXJlIGlzIG5vdyByZW5hbWVkIHRvIFwiYmxvY2tcIi4gV2h5ID8gQkVDQVVTRSBCTEFDSyBMSVZFUyBN
QVRURVIhXG4gICAgICAvLyBXZSBjYW4gbm93IHVzZSAzIGtleXM6IGJsb2NrLCBibGFja2xpc3QsIGJhblxuICAgICAgY29uc3QgYmxvY2sgPSAob3B0IHx8
IHt9KS5ibG9jayB8fCAob3B0IHx8IHt9KS5ibGFja2xpc3QgfHwgKG9wdCB8fCB7fSkuYmFuIHx8IHt9XG4gICAgICBjb25zdCByZWFkQmxvY2sgPSBibG9j
ay5yZWFkICYmICh0eXBlb2YgYmxvY2sucmVhZCA9PT0gJ3N0cmluZycgfHwgKGJsb2NrLnJlYWQgfHwge30pWycjJ10pID8gYmxvY2sucmVhZCA6IG51bGxc
biAgICAgIGNvbnN0IHdyaXRlQmxvY2sgPSB0eXBlb2YgYmxvY2sgPT09ICdzdHJpbmcnID8gYmxvY2sgOiBibG9jay53cml0ZSAmJiAodHlwZW9mIGJsb2Nr
LndyaXRlID09PSAnc3RyaW5nJyB8fCBibG9jay53cml0ZVsnIyddKSA/IGJsb2NrLndyaXRlIDogbnVsbFxuXG4gICAgICBpZiAoIXJlYWRQb2xpY3kgJiYg
IXdyaXRlUG9saWN5KSByZXR1cm4gY29uc29sZS5sb2coXCJObyBwb2xpY3kgZm91bmQuXCIpXG5cbiAgICAgIC8vIHJlc2VydmVkIGtleXM6IGMsIGUsIHIs
IHcsIHJiLCB3YlxuICAgICAgY29uc3QgZGF0YSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgYzogY2VydGlmaWNhbnRzLFxuICAgICAgICAuLi4oZXhw
aXJ5ID8ge2U6IGV4cGlyeX0gOiB7fSksIC8vIGluamVjdCBleHBpcnkgaWYgcG9zc2libGVcbiAgICAgICAgLi4uKHJlYWRQb2xpY3kgPyB7cjogcmVhZFBv
bGljeSB9ICA6IHt9KSwgLy8gXCJyXCIgc3RhbmRzIGZvciByZWFkLCB3aGljaCBtZWFucyByZWFkIHBlcm1pc3Npb24uXG4gICAgICAgIC4uLih3cml0ZVBv
bGljeSA/IHt3OiB3cml0ZVBvbGljeX0gOiB7fSksIC8vIFwid1wiIHN0YW5kcyBmb3Igd3JpdGUsIHdoaWNoIG1lYW5zIHdyaXRlIHBlcm1pc3Npb24uXG4g
ICAgICAgIC4uLihyZWFkQmxvY2sgPyB7cmI6IHJlYWRCbG9ja30gOiB7fSksIC8vIGluamVjdCBSRUFEIGJsb2NrIGlmIHBvc3NpYmxlXG4gICAgICAgIC4u
Lih3cml0ZUJsb2NrID8ge3diOiB3cml0ZUJsb2NrfSA6IHt9KSwgLy8gaW5qZWN0IFdSSVRFIGJsb2NrIGlmIHBvc3NpYmxlXG4gICAgICB9KVxuXG4gICAg
ICBjb25zdCBjZXJ0aWZpY2F0ZSA9IGF3YWl0IFNFQS5zaWduKGRhdGEsIGF1dGhvcml0eSwgbnVsbCwge3JhdzoxfSlcblxuICAgICAgdmFyIHIgPSBjZXJ0
aWZpY2F0ZVxuICAgICAgaWYoIW9wdC5yYXcpeyByID0gJ1NFQScrSlNPTi5zdHJpbmdpZnkocikgfVxuICAgICAgaWYoY2IpeyB0cnl7IGNiKHIpIH1jYXRj
aChlKXtjb25zb2xlLmxvZyhlKX0gfVxuICAgICAgcmV0dXJuIHI7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBTRUEuZXJyID0gZTtcbiAgICAgIGlmKFNF
QS50aHJvdyl7IHRocm93IGUgfVxuICAgICAgaWYoY2IpeyBjYigpIH1cbiAgICAgIHJldHVybjtcbiAgICB9fSk7XG5cbiAgICBfX2RlZmF1bHRFeHBvcnQg
PSBTRUEuY2VydGlmeTtcbiAgXG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgX19kZWZhdWx0RXhwb3J0OyIsInNlYS9zZWEuanMiOiJpbXBvcnQgX19zaGltIGZy
b20gJy4vc2hpbS5qcyc7XG5pbXBvcnQgX19zaGExIGZyb20gJy4vc2hhMS5qcyc7XG5pbXBvcnQgX19yb290IGZyb20gJy4vcm9vdC5qcyc7XG5pbXBvcnQg
X193b3JrIGZyb20gJy4vd29yay5qcyc7XG5pbXBvcnQgX19zaWduIGZyb20gJy4vc2lnbi5qcyc7XG5pbXBvcnQgX192ZXJpZnkgZnJvbSAnLi92ZXJpZnku
anMnO1xuaW1wb3J0IF9fZW5jcnlwdCBmcm9tICcuL2VuY3J5cHQuanMnO1xuaW1wb3J0IF9fZGVjcnlwdCBmcm9tICcuL2RlY3J5cHQuanMnO1xuaW1wb3J0
IF9fY2VydGlmeSBmcm9tICcuL2NlcnRpZnkuanMnO1xuaW1wb3J0IF9fYnVmZmVyIGZyb20gJy4vYnVmZmVyLmpzJztcblxubGV0IF9fZGVmYXVsdEV4cG9y
dDtcbihmdW5jdGlvbigpe1xuXG4gICAgdmFyIHNoaW0gPSBfX3NoaW07XG4gICAgdmFyIHNoYTFoYXNoID0gX19zaGExO1xuICAgIC8vIFByYWN0aWNhbCBl
eGFtcGxlcyBhYm91dCB1c2FnZSBmb3VuZCBpbiB0ZXN0cy5cbiAgICB2YXIgU0VBID0gX19yb290O1xuICAgIFNFQS53b3JrID0gX193b3JrO1xuICAgIFNF
QS5zaWduID0gX19zaWduO1xuICAgIFNFQS52ZXJpZnkgPSBfX3ZlcmlmeTtcbiAgICBTRUEuZW5jcnlwdCA9IF9fZW5jcnlwdDtcbiAgICBTRUEuZGVjcnlw
dCA9IF9fZGVjcnlwdDtcbiAgICBTRUEuY2VydGlmeSA9IF9fY2VydGlmeTtcbiAgICAvLyBTRUEub3B0LmFlc2tleSBpcyBpbnRlbnRpb25hbGx5IGxlZnQg
ZGlzYWJsZWQ7IGl0IGNhdXNlZCBXZWJDcnlwdG8gaXNzdWVzIHVwc3RyZWFtLlxuXG4gICAgU0VBLnJhbmRvbSA9IFNFQS5yYW5kb20gfHwgc2hpbS5yYW5k
b207XG5cbiAgICAvLyBUaGlzIGlzIEJ1ZmZlciB1c2VkIGluIFNFQSBhbmQgdXNhYmxlIGZyb20gR3VuL1NFQSBhcHBsaWNhdGlvbiBhbHNvLlxuICAgIC8v
IEZvciBkb2N1bWVudGF0aW9uIHNlZSBodHRwczovL25vZGVqcy5vcmcvYXBpL2J1ZmZlci5odG1sXG4gICAgU0VBLkJ1ZmZlciA9IFNFQS5CdWZmZXIgfHwg
X19idWZmZXI7XG5cbiAgICAvLyBUaGVzZSBTRUEgZnVuY3Rpb25zIHN1cHBvcnQgbm93IG9ueSBQcm9taXNlcyBvclxuICAgIC8vIGFzeW5jL2F3YWl0IChj
b21wYXRpYmxlKSBjb2RlLCB1c2UgdGhvc2UgbGlrZSBQcm9taXNlcy5cbiAgICAvL1xuICAgIC8vIENyZWF0ZXMgYSB3cmFwcGVyIGxpYnJhcnkgYXJvdW5k
IFdlYiBDcnlwdG8gQVBJXG4gICAgLy8gZm9yIHZhcmlvdXMgQUVTLCBFQ0RTQSwgUEJLREYyIGZ1bmN0aW9ucyB3ZSBjYWxsZWQgYWJvdmUuXG4gICAgLy8g
Q2FsY3VsYXRlIHB1YmxpYyBrZXkgS2V5SUQgYWthIFBHUHY0IChyZXN1bHQ6IDggYnl0ZXMgYXMgaGV4IHN0cmluZylcbiAgICBTRUEua2V5aWQgPSBTRUEu
a2V5aWQgfHwgKGFzeW5jIChwdWIpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIERlY29kZSBwdWIga2V5IGNvb3JkaW5hdGVzIChoYW5kbGVzIG9s
ZCA4Ny1jaGFyIGJhc2U2NHVybCBhbmQgbmV3IDg4LWNoYXIgYmFzZTYyKVxuICAgICAgICB2YXIgeHkgPSBTRUEuYmFzZTYyLnB1YlRvSndrWFkocHViKTtc
biAgICAgICAgY29uc3QgcGIgPSBzaGltLkJ1ZmZlci5jb25jYXQoXG4gICAgICAgICAgW3h5LngsIHh5LnldLm1hcCgodCkgPT4gc2hpbS5CdWZmZXIuZnJv
bShhdG9iKHQucmVwbGFjZSgvLS9nLCcrJykucmVwbGFjZSgvXy9nLCcvJykpLCAnYmluYXJ5JykpXG4gICAgICAgIClcbiAgICAgICAgLy8gaWQgaXMgUEdQ
djQgY29tcGxpYW50IHJhdyBrZXlcbiAgICAgICAgY29uc3QgaWQgPSBzaGltLkJ1ZmZlci5jb25jYXQoW1xuICAgICAgICAgIHNoaW0uQnVmZmVyLmZyb20o
WzB4OTksIHBiLmxlbmd0aCAvIDB4MTAwLCBwYi5sZW5ndGggJSAweDEwMF0pLCBwYlxuICAgICAgICBdKVxuICAgICAgICBjb25zdCBzaGExID0gYXdhaXQg
c2hhMWhhc2goaWQpXG4gICAgICAgIGNvbnN0IGhhc2ggPSBzaGltLkJ1ZmZlci5mcm9tKHNoYTEsICdiaW5hcnknKVxuICAgICAgICByZXR1cm4gaGFzaC50
b1N0cmluZygnaGV4JywgaGFzaC5sZW5ndGggLSA4KSAgLy8gMTYtYml0IElEIGFzIGhleFxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xl
LmxvZyhlKVxuICAgICAgICB0aHJvdyBlXG4gICAgICB9XG4gICAgfSk7XG4gICAgLy8gYWxsIGRvbmUhXG4gICAgLy8gT2J2aW91c2x5IGl0IGlzIG1pc3Np
bmcgTUFOWSBuZWNlc3NhcnkgZmVhdHVyZXMuIFRoaXMgaXMgb25seSBhbiBhbHBoYSByZWxlYXNlLlxuICAgIC8vIFBsZWFzZSBleHBlcmltZW50IHdpdGgg
aXQsIGF1ZGl0IHdoYXQgSSd2ZSBkb25lIHNvIGZhciwgYW5kIGNvbXBsYWluIGFib3V0IHdoYXQgbmVlZHMgdG8gYmUgYWRkZWQuXG4gICAgLy8gU0VBIHNo
b3VsZCBiZSBhIGZ1bGwgc3VpdGUgdGhhdCBpcyBlYXN5IGFuZCBzZWFtbGVzcyB0byB1c2UuXG4gICAgLy8gQWdhaW4sIHNjcm9sbCBuYWVyIHRoZSB0b3As
IHdoZXJlIEkgcHJvdmlkZSBhbiBFWEFNUExFIG9mIGhvdyB0byBjcmVhdGUgYSB1c2VyIGFuZCBzaWduIGluLlxuICAgIC8vIE9uY2UgbG9nZ2VkIGluLCB0
aGUgcmVzdCBvZiB0aGUgY29kZSB5b3UganVzdCByZWFkIGhhbmRsZWQgYXV0b21hdGljYWxseSBzaWduaW5nL3ZhbGlkYXRpbmcgZGF0YS5cbiAgICAvLyBC
dXQgYWxsIG90aGVyIGJlaGF2aW9yIG5lZWRzIHRvIGJlIGVxdWFsbHkgZWFzeSwgbGlrZSBvcGluaW9uYXRlZCB3YXlzIG9mXG4gICAgLy8gQWRkaW5nIGZy
aWVuZHMgKHRydXN0ZWQgcHVibGljIGtleXMpLCBzZW5kaW5nIHByaXZhdGUgbWVzc2FnZXMsIGV0Yy5cbiAgICAvLyBDaGVlcnMhIFRlbGwgbWUgd2hhdCB5
b3UgdGhpbmsuXG4gICAgKChTRUEud2luZG93fHx7fSkuR1VOfHx7fSkuU0VBID0gU0VBO1xuXG4gICAgX19kZWZhdWx0RXhwb3J0ID0gU0VBXG4gICAgLy8g
LS0tLS0tLS0tLS0tLS0gRU5EIFNFQSBNT0RVTEVTIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gLS0gQkVHSU4gU0VBK0dVTiBNT0RVTEVTOiBCVU5E
TEVEIEJZIERFRkFVTFQgVU5USUwgT1RIRVJTIFVTRSBTRUEgT04gT1dOIC0tLS0tLS1cbiAgXG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgX19kZWZhdWx0RXhw
b3J0O1xuIiwic2VhL3RoZW4uanMiOiJpbXBvcnQgX19ndW4gZnJvbSAnLi4vZ3VuLmpzJztcblxuKGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgdSwgR3VuID0g
KCcnK3UgIT0gdHlwZW9mIEdVTik/IChHVU58fHtjaGFpbjp7fX0pIDogX19ndW47XG4gICAgR3VuLmNoYWluLnRoZW4gPSBmdW5jdGlvbihjYiwgb3B0KXtc
biAgICAgIHZhciBndW4gPSB0aGlzLCBwID0gKG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlcywgcmVqKXtcbiAgICAgICAgZ3VuLm9uY2UocmVzLCBvcHQpO1xu
ICAgICAgfSkpO1xuICAgICAgcmV0dXJuIGNiPyBwLnRoZW4oY2IpIDogcDtcbiAgICB9XG4gIFxufSgpKTtcbiIsInNlYS9pbmRleC5qcyI6ImltcG9ydCBf
X3NlYSBmcm9tICcuL3NlYS5qcyc7XG5pbXBvcnQgX19zZXR0aW5ncyBmcm9tICcuL3NldHRpbmdzLmpzJztcbmltcG9ydCBfX2d1biBmcm9tICcuLi9ndW4u
anMnO1xuKGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgU0VBID0gX19zZWEsIFMgPSBfX3NldHRpbmdzLCBub29wID0gZnVuY3Rpb24oKSB7fSwgdTtcbiAgICB2
YXIgR3VuID0gKFNFQS53aW5kb3d8fCcnKS5HVU4gfHwgX19ndW47XG4gICAgLy8gQWZ0ZXIgd2UgaGF2ZSBhIEdVTiBleHRlbnNpb24gdG8gbWFrZSB1c2Vy
IHJlZ2lzdHJhdGlvbi9sb2dpbiBlYXN5LCB3ZSB0aGVuIG5lZWQgdG8gaGFuZGxlIGV2ZXJ5dGhpbmcgZWxzZS5cblxuICAgIC8vIFdlIGRvIHRoaXMgd2l0
aCBhIEdVTiBhZGFwdGVyLCB3ZSBmaXJzdCBsaXN0ZW4gdG8gd2hlbiBhIGd1biBpbnN0YW5jZSBpcyBjcmVhdGVkIChhbmQgd2hlbiBpdHMgb3B0aW9ucyBj
aGFuZ2UpXG4gICAgR3VuLm9uKCdvcHQnLCBmdW5jdGlvbihhdCl7XG4gICAgICBpZighYXQuc2VhKXsgLy8gb25seSBhZGQgU0VBIG9uY2UgcGVyIGluc3Rh
bmNlLCBvbiB0aGUgXCJhdFwiIGNvbnRleHQuXG4gICAgICAgIGF0LnNlYSA9IHtvd246IHt9fTtcbiAgICAgICAgYXQub24oJ3B1dCcsIGNoZWNrLCBhdCk7
IC8vIFNFQSBub3cgcnVucyBpdHMgZmlyZXdhbGwgb24gSEFNIGRpZmZzLCBub3QgYWxsIGkvby5cbiAgICAgIH1cbiAgICAgIHRoaXMudG8ubmV4dChhdCk7
IC8vIG1ha2Ugc3VyZSB0byBjYWxsIHRoZSBcIm5leHRcIiBtaWRkbGV3YXJlIGFkYXB0ZXIuXG4gICAgfSk7XG5cbiAgICAvLyBBbHJpZ2h0LCB0aGlzIG5l
eHQgYWRhcHRlciBnZXRzIHJ1biBhdCB0aGUgcGVyIG5vZGUgbGV2ZWwgaW4gdGhlIGdyYXBoIGRhdGFiYXNlLlxuICAgIC8vIGNvcnJlY3Rpb246IDIwMjAg
aXQgZ2V0cyBydW4gb24gZWFjaCBrZXkvdmFsdWUgcGFpciBpbiBhIG5vZGUgdXBvbiBhIEhBTSBkaWZmLlxuICAgIC8vIFRoaXMgd2lsbCBsZXQgdXMgdmVy
aWZ5IHRoYXQgZXZlcnkgcHJvcGVydHkgb24gYSBub2RlIGhhcyBhIHZhbHVlIHNpZ25lZCBieSBhIHB1YmxpYyBrZXkgd2UgdHJ1c3QuXG4gICAgLy8gSWYg
dGhlIHNpZ25hdHVyZSBkb2VzIG5vdCBtYXRjaCwgdGhlIGRhdGEgaXMganVzdCBgdW5kZWZpbmVkYCBzbyBpdCBkb2Vzbid0IGdldCBwYXNzZWQgb24uXG4g
ICAgLy8gSWYgaXQgZG9lcyBtYXRjaCwgdGhlbiB3ZSB0cmFuc2Zvcm0gdGhlIGluLW1lbW9yeSBcInZpZXdcIiBvZiB0aGUgZGF0YSBpbnRvIGl0cyBwbGFp
biB2YWx1ZSAod2l0aG91dCB0aGUgc2lnbmF0dXJlKS5cbiAgICAvLyBOb3cgTk9URSEgU29tZSBkYXRhIGlzIFwic3lzdGVtXCIgZGF0YSwgbm90IHVzZXIg
ZGF0YS4gRXhhbXBsZTogTGlzdCBvZiBwdWJsaWMga2V5cywgYWxpYXNlcywgZXRjLlxuICAgIC8vIFRoaXMgZGF0YSBpcyBzZWxmLWVuZm9yY2VkICh0aGUg
dmFsdWUgY2FuIG9ubHkgbWF0Y2ggaXRzIElEKSwgYnV0IHRoYXQgaXMgaGFuZGxlZCBpbiB0aGUgYHNlY3VyaXR5YCBmdW5jdGlvbi5cbiAgICAvLyBGcm9t
IHRoZSBzZWxmLWVuZm9yY2VkIGRhdGEsIHdlIGNhbiBzZWUgYWxsIHRoZSBlZGdlcyBpbiB0aGUgZ3JhcGggdGhhdCBiZWxvbmcgdG8gYSBwdWJsaWMga2V5
LlxuICAgIC8vIEV4YW1wbGU6IH5BU0RGIGlzIHRoZSBJRCBvZiBhIG5vZGUgd2l0aCBBU0RGIGFzIGl0cyBwdWJsaWMga2V5LCBzaWduZWQgYWxpYXMgYW5k
IHNhbHQsIGFuZFxuICAgIC8vIGl0cyBlbmNyeXB0ZWQgcHJpdmF0ZSBrZXksIGJ1dCBpdCBtaWdodCBhbHNvIGhhdmUgb3RoZXIgc2lnbmVkIHZhbHVlcyBv
biBpdCBsaWtlIGBwcm9maWxlID0gPElEPmAgZWRnZS5cbiAgICAvLyBVc2luZyB0aGF0IGRpcmVjdGVkIGVkZ2UncyBJRCwgd2UgY2FuIHRoZW4gdHJhY2sg
KGluIG1lbW9yeSkgd2hpY2ggSURzIGJlbG9uZyB0byB3aGljaCBrZXlzLlxuICAgIC8vIEhlcmUgaXMgYSBwcm9ibGVtOiBNdWx0aXBsZSBwdWJsaWMga2V5
cyBjYW4gXCJjbGFpbVwiIGFueSBub2RlJ3MgSUQsIHNvIHRoaXMgaXMgZGFuZ2Vyb3VzIVxuICAgIC8vIFRoaXMgbWVhbnMgd2Ugc2hvdWxkIE9OTFkgdHJ1
c3Qgb3VyIFwiZnJpZW5kc1wiIChvdXIga2V5IHJpbmcpIHB1YmxpYyBrZXlzLCBub3QgYW55IG9uZXMuXG4gICAgLy8gSSBoYXZlIG5vdCB5ZXQgYWRkZWQg
dGhhdCB0byBTRUEgeWV0IGluIHRoaXMgYWxwaGEgcmVsZWFzZS4gVGhhdCBpcyBjb21pbmcgc29vbiwgYnV0IGJld2FyZSBpbiB0aGUgbWVhbndoaWxlIVxu
XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tIE1haW4gZGlzcGF0Y2hlciAtLS0tLS0tLS0tLS0tLS1cbiAgICBmdW5jdGlvbiBjaGVjayhtc2cpe1xuICAgICAg
dmFyIGV2ZSA9IHRoaXMsIGF0ID0gZXZlLmFzLCBwdXQgPSBtc2cucHV0LCBzb3VsID0gcHV0WycjJ10sIGtleSA9IHB1dFsnLiddLCB2YWwgPSBwdXRbJzon
XSwgc3RhdGUgPSBwdXRbJz4nXSwgaWQgPSBtc2dbJyMnXSwgdG1wO1xuICAgICAgaWYoIXNvdWwgfHwgIWtleSl7IHJldHVybiB9XG5cbiAgICAgIC8vIEZh
aXRoIGZhc3QtcGF0aCDigJQgYnlwYXNzIGFsbCB2YWxpZGF0aW9uXG4gICAgICBpZigobXNnLl98fCcnKS5mYWl0aCAmJiAoYXQub3B0fHwnJykuZmFpdGgg
JiYgJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgbXNnLl8pe1xuICAgICAgICBjaGVjay5waXBlLmZhaXRoKHsgZXZlOiBldmUsIG1zZzogbXNnLCBwdXQ6IHB1dCwg
YXQ6IGF0IH0pOyByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBubyA9IGZ1bmN0aW9uKHdoeSl7IGF0Lm9uKCdpbicsIHsnQCc6IGlkLCBlcnI6IG1z
Zy5lcnIgPSB3aHl9KSB9O1xuICAgICAgKG1zZy5ffHwnJykuREJHICYmICgobXNnLl98fCcnKS5EQkcuYyA9ICtuZXcgRGF0ZSk7XG5cbiAgICAgIC8vIEJ1
aWxkIGNvbnRleHQgb2JqZWN0IHNoYXJlZCBhY3Jvc3MgYWxsIHN0YWdlc1xuICAgICAgdmFyIGN0eCA9IHsgZXZlOiBldmUsIG1zZzogbXNnLCBhdDogYXQs
IHB1dDogcHV0LCBzb3VsOiBzb3VsLCBrZXk6IGtleSwgdmFsOiB2YWwsIHN0YXRlOiBzdGF0ZSwgaWQ6IGlkLCBubzogbm8sIHB1YjogbnVsbCB9O1xuXG4g
ICAgICAvLyBSb3V0ZTogZGV0ZXJtaW5lIHdoaWNoIGZlYXR1cmUgc3RhZ2UgdG8gcnVuIGFmdGVyIGZvcmdldFxuICAgICAgdmFyIHBpcGVsaW5lID0gW2No
ZWNrLnBpcGUuZm9yZ2V0XTtcblxuICAgICAgaWYoJ35AJyA9PT0gc291bCl7XG4gICAgICAgIHBpcGVsaW5lLnB1c2goY2hlY2sucGlwZS5hbGlhcyk7XG4g
ICAgICB9IGVsc2UgaWYoJ35AJyA9PT0gc291bC5zbGljZSgwLDIpKXtcbiAgICAgICAgcGlwZWxpbmUucHVzaChjaGVjay5waXBlLnB1YnMpO1xuICAgICAg
fSBlbHNlIGlmKCd+JyA9PT0gc291bCB8fCAnfi8nID09PSBzb3VsLnNsaWNlKDAsMikpe1xuICAgICAgICBwaXBlbGluZS5wdXNoKGNoZWNrLnBpcGUuc2hh
cmQpO1xuICAgICAgfSBlbHNlIGlmKHRtcCA9IFNFQS5vcHQucHViKHNvdWwpKXtcbiAgICAgICAgY3R4LnB1YiA9IHRtcDtcbiAgICAgICAgcGlwZWxpbmUu
cHVzaChjaGVjay5waXBlLnB1Yik7XG4gICAgICB9IGVsc2UgaWYoMCA8PSBzb3VsLmluZGV4T2YoJyMnKSl7XG4gICAgICAgIHBpcGVsaW5lLnB1c2goY2hl
Y2sucGlwZS5oYXNoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBpcGVsaW5lLnB1c2goY2hlY2sucGlwZS5hbnkpO1xuICAgICAgfVxuXG4gICAgICAv
LyBLZWVwIHJlZmVyZW5jZSB0byB0aGUgcmVxdWlyZWQgc2VjdXJpdHkgc3RhZ2UgYmVmb3JlIHBsdWdpbnMgY2FuIHRvdWNoIHRoZSBhcnJheVxuICAgICAg
dmFyIHJlcXVpcmVkID0gcGlwZWxpbmVbMV07XG5cbiAgICAgIC8vIEFsbG93IHBsdWdpbnMgdG8gYXVnbWVudC9yZW9yZGVyIHRoZSBwaXBlbGluZVxuICAg
ICAgZm9yKHZhciBwaSA9IDA7IHBpIDwgY2hlY2sucGx1Z2lucy5sZW5ndGg7IHBpKyspe1xuICAgICAgICBjaGVjay5wbHVnaW5zW3BpXShjdHgsIHBpcGVs
aW5lKTtcbiAgICAgIH1cblxuICAgICAgLy8gR3VhcmQ6IGVuc3VyZSB0aGUgcm91dGluZyBzZWN1cml0eSBzdGFnZSB3YXMgbm90IHJlbW92ZWQgYnkgYSBw
bHVnaW5cbiAgICAgIGlmKHJlcXVpcmVkICYmIHBpcGVsaW5lLmluZGV4T2YocmVxdWlyZWQpIDwgMCl7IHJldHVybiBubyhcIlNlY3VyaXR5IHN0YWdlIHJl
bW92ZWQuXCIpOyB9XG5cbiAgICAgIGNoZWNrLnJ1bihwaXBlbGluZSwgY3R4KTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0gUGlwZWxpbmUg
cnVubmVyIC0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEVhY2ggc3RhZ2UgaXMgZm4oY3R4LCBuZXh0LCByZWplY3QpIHdoZXJlOlxuICAgIC8vICAgbmV4dCgp
ICAgICAgID0gYWR2YW5jZSB0byB0aGUgbmV4dCBzdGFnZSAob3IgQ09NTUlUIGlmIGxhc3QpXG4gICAgLy8gICByZWplY3Qod2h5KSAgPSBjYWxsIG5vKHdo
eSkgYW5kIHN0b3BcbiAgICAvLyBBIHN0YWdlIHRoYXQgZG9lcyBOT1QgY2FsbCBuZXh0KCkgb3IgcmVqZWN0KCkgbXVzdCBoYW5kbGUgZm9yd2FyZGluZyBp
dHNlbGZcbiAgICAvLyAoZS5nLiBzdGFnZXMgdGhhdCBjYWxsIGV2ZS50by5uZXh0KG1zZykgZGlyZWN0bHkpLlxuICAgIGNoZWNrLnJ1biA9IGZ1bmN0aW9u
KHN0YWdlcywgY3R4KSB7XG4gICAgICB2YXIgbm8gPSBjdHgubm87IC8vIHNuYXBzaG90OiBwcmV2ZW50IGN0eC5ubyBtdXRhdGlvbiBmcm9tIGJ5cGFzc2lu
ZyByZWplY3Rpb25cbiAgICAgIHZhciBpID0gMDtcbiAgICAgIHZhciBuZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChpID49IHN0YWdlcy5sZW5n
dGgpIHJldHVybjsgLy8gYWxsIHN0YWdlcyBjb25zdW1lZCwgZG9uZVxuICAgICAgICB2YXIgc3RhZ2UgPSBzdGFnZXNbaSsrXTtcbiAgICAgICAgdmFyIHNw
ZW50ID0gZmFsc2U7IC8vIGd1YXJkOiBlYWNoIHN0YWdlIG1heSBhZHZhbmNlIHRoZSBwaXBlbGluZSBhdCBtb3N0IG9uY2VcbiAgICAgICAgdmFyIG9uY2Ug
PSBmdW5jdGlvbigpeyBpZighc3BlbnQpeyBzcGVudCA9IHRydWU7IG5leHQoKTsgfSB9O1xuICAgICAgICB0cnkgeyBzdGFnZShjdHgsIG9uY2UsIG5vKTsg
fSBjYXRjaChlKSB7IG5vKGUgJiYgZS5tZXNzYWdlIHx8IFN0cmluZyhlKSk7IH1cbiAgICAgIH07XG4gICAgICBuZXh0KCk7XG4gICAgfTtcblxuICAgIC8v
IC0tLS0tLS0tLS0tLS0tLSBQaXBlbGluZSBzdGFnZXMgKGNoZWNrLnBpcGUuPG5hbWU+KSAtLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBFYWNoIHN0YWdlOiBm
bihjdHgsIG5leHQsIHJlamVjdClcbiAgICBjaGVjay5waXBlID0ge1xuICAgICAgZmFpdGg6IGZ1bmN0aW9uKGN0eCwgbmV4dCwgcmVqZWN0KSB7XG4gICAg
ICAgIHZhciBldmUgPSBjdHguZXZlLCBtc2cgPSBjdHgubXNnLCBwdXQgPSBjdHgucHV0LCBhdCA9IGN0eC5hdDtcbiAgICAgICAgU0VBLm9wdC5wYWNrKHB1
dCwgZnVuY3Rpb24ocmF3KXtcbiAgICAgICAgICBTRUEudmVyaWZ5KHJhdywgZmFsc2UsIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgcHV0Wyc9J10g
PSBTRUEub3B0LnVucGFjayhkYXRhKTtcbiAgICAgICAgICAgIGV2ZS50by5uZXh0KG1zZyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAg
fSxcbiAgICAgIGZvcmdldDogZnVuY3Rpb24oY3R4LCBuZXh0LCByZWplY3QpIHtcbiAgICAgICAgdmFyIHNvdWwgPSBjdHguc291bCwgc3RhdGUgPSBjdHgu
c3RhdGUsIG1zZyA9IGN0eC5tc2csIHRtcDtcbiAgICAgICAgaWYoMCA8PSBzb3VsLmluZGV4T2YoJzw/Jykpe1xuICAgICAgICAgIC8vICdhfnB1Yi5rZXkv
Yjw/OSdcbiAgICAgICAgICB0bXAgPSBwYXJzZUZsb2F0KHNvdWwuc3BsaXQoJzw/JylbMV18fCcnKTtcbiAgICAgICAgICBpZih0bXAgJiYgKHN0YXRlIDwg
KEd1bi5zdGF0ZSgpIC0gKHRtcCAqIDEwMDApKSkpeyAvLyBzZWMgdG8gbXNcbiAgICAgICAgICAgICh0bXAgPSBtc2cuXykgJiYgKHRtcC5zdHVuKSAmJiAo
dG1wLnN0dW4tLSk7IC8vIFRISVMgSVMgQkFEIENPREUhIEl0IGFzc3VtZXMgR1VOIGludGVybmFscyBkbyBzb21ldGhpbmcgdGhhdCB3aWxsIHByb2JhYmx5
IGNoYW5nZSBpbiBmdXR1cmUsIGJ1dCBoYWNraW5nIGluIG5vdy5cbiAgICAgICAgICAgIHJldHVybjsgLy8gb21pdCDigJQgZG8gTk9UIGNhbGwgbmV4dCgp
XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG5leHQoKTtcbiAgICAgIH0sXG4gICAgICBhbGlhczogIGZ1bmN0aW9uKGN0eCwgbmV4dCwgcmVq
ZWN0KSB7IGNoZWNrLmFsaWFzKGN0eC5ldmUsIGN0eC5tc2csIGN0eC52YWwsIGN0eC5rZXksIGN0eC5zb3VsLCBjdHguYXQsIHJlamVjdCk7IH0sXG4gICAg
ICBwdWJzOiAgIGZ1bmN0aW9uKGN0eCwgbmV4dCwgcmVqZWN0KSB7IGNoZWNrLnB1YnMoY3R4LmV2ZSwgY3R4Lm1zZywgY3R4LnZhbCwgY3R4LmtleSwgY3R4
LnNvdWwsIGN0eC5hdCwgcmVqZWN0KTsgfSxcbiAgICAgIHNoYXJkOiAgZnVuY3Rpb24oY3R4LCBuZXh0LCByZWplY3QpIHsgY2hlY2suc2hhcmQoY3R4LmV2
ZSwgY3R4Lm1zZywgY3R4LnZhbCwgY3R4LmtleSwgY3R4LnNvdWwsIGN0eC5hdCwgcmVqZWN0LCBjdHguYXQudXNlcnx8JycpOyB9LFxuICAgICAgcHViOiAg
ICBmdW5jdGlvbihjdHgsIG5leHQsIHJlamVjdCkgeyBjaGVjay5wdWIoY3R4LmV2ZSwgY3R4Lm1zZywgY3R4LnZhbCwgY3R4LmtleSwgY3R4LnNvdWwsIGN0
eC5hdCwgcmVqZWN0LCBjdHguYXQudXNlcnx8JycsIGN0eC5wdWIpOyB9LFxuICAgICAgaGFzaDogICBmdW5jdGlvbihjdHgsIG5leHQsIHJlamVjdCkgeyBj
aGVjay5oYXNoKGN0eC5ldmUsIGN0eC5tc2csIGN0eC52YWwsIGN0eC5rZXksIGN0eC5zb3VsLCBjdHguYXQsIHJlamVjdCk7IH0sXG4gICAgICBhbnk6ICAg
IGZ1bmN0aW9uKGN0eCwgbmV4dCwgcmVqZWN0KSB7IGNoZWNrLmFueShjdHguZXZlLCBjdHgubXNnLCBjdHgudmFsLCBjdHgua2V5LCBjdHguc291bCwgY3R4
LmF0LCByZWplY3QsIGN0eC5hdC51c2VyfHwnJyk7IH1cbiAgICB9O1xuXG4gICAgT2JqZWN0LmZyZWV6ZShjaGVjay5waXBlKTsgLy8gcHJldmVudCByZXBs
YWNlbWVudCBvZiBidWlsdC1pbiBzZWN1cml0eSBzdGFnZXNcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLSBQbHVnaW4gcmVnaXN0cnkgLS0tLS0tLS0tLS0t
LS0tXG4gICAgLy8gUGx1Z2lucyByZWNlaXZlIChjdHgsIHBpcGVsaW5lKSBhbmQgbWF5IGluc2VydC9yZW9yZGVyIHN0YWdlcy5cbiAgICAvLyBOT1RFOiBw
bHVnaW5zIGNhbm5vdCByZW1vdmUgdGhlIHJvdXRpbmcgc2VjdXJpdHkgc3RhZ2UgKHZhbGlkYXRlZCBpbiBjaGVjaygpKS5cbiAgICBjaGVjay5wbHVnaW5z
ID0gW107XG4gICAgY2hlY2sudXNlID0gZnVuY3Rpb24oZm4pIHsgY2hlY2sucGx1Z2lucy5wdXNoKGZuKTsgfTtcbiAgICBTRUEuY2hlY2sgPSBjaGVjaztc
blxuICAgIC8vIFZlcmlmeSBjb250ZW50LWFkZHJlc3NlZCBkYXRhIG1hdGNoZXMgaXRzIGhhc2hcbiAgICBjaGVjay5oYXNoID0gZnVuY3Rpb24gKGV2ZSwg
bXNnLCB2YWwsIGtleSwgc291bCwgYXQsIG5vLCB5ZXMpIHtcbiAgICAgIGZ1bmN0aW9uIGJhc2U2NFRvSGV4KGRhdGEpIHtcbiAgICAgICAgdmFyIGJpbmFy
eVN0ciA9IGF0b2IoZGF0YSk7XG4gICAgICAgIHZhciBhID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmluYXJ5U3RyLmxlbmd0aDsgaSsr
KSB7XG4gICAgICAgICAgdmFyIGhleCA9IGJpbmFyeVN0ci5jaGFyQ29kZUF0KGkpLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgICBhLnB1c2goaGV4Lmxlbmd0
aCA9PT0gMSA/IFwiMFwiICsgaGV4IDogaGV4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYS5qb2luKFwiXCIpO1xuICAgICAgfVxuICAgICAgdmFy
IGhhc2ggPSBrZXkuc3BsaXQoJyMnKS5wb3AoKTtcbiAgICAgIHllcyA9IHllcyB8fCBmdW5jdGlvbigpeyBldmUudG8ubmV4dChtc2cpIH07XG4gICAgICBp
ZighaGFzaCB8fCBoYXNoID09PSBrZXkpeyByZXR1cm4geWVzKCkgfVxuICAgICAgU0VBLndvcmsodmFsLCBudWxsLCBmdW5jdGlvbiAoYjY0aGFzaCkge1xu
ICAgICAgICB2YXIgaGV4aGFzaCA9IGJhc2U2NFRvSGV4KGI2NGhhc2gpLCBiNjRzbGljZSA9IGI2NGhhc2guc2xpY2UoLTIwKSwgaGV4c2xpY2UgPSBoZXho
YXNoLnNsaWNlKC0yMCk7XG4gICAgICAgIGlmIChbYjY0aGFzaCwgYjY0c2xpY2UsIGhleGhhc2gsIGhleHNsaWNlXS5zb21lKGl0ZW0gPT4gaXRlbS5lbmRz
V2l0aChoYXNoKSkpIHJldHVybiB5ZXMoKTtcbiAgICAgICAgbm8oXCJEYXRhIGhhc2ggbm90IHNhbWUgYXMgaGFzaCFcIik7XG4gICAgICB9LCB7IG5hbWU6
ICdTSEEtMjU2JyB9KTtcbiAgICB9XG4gICAgY2hlY2suYWxpYXMgPSBmdW5jdGlvbihldmUsIG1zZywgdmFsLCBrZXksIHNvdWwsIGF0LCBubyl7IC8vIEV4
YW1wbGU6IHtfOiN+QCwgfkBhbGljZTogeyN+QGFsaWNlfX1cbiAgICAgIGlmKCF2YWwpeyByZXR1cm4gbm8oXCJEYXRhIG11c3QgZXhpc3QhXCIpIH0gLy8g
ZGF0YSBNVVNUIGV4aXN0XG4gICAgICBpZignfkAnK2tleSA9PT0gbGlua19pcyh2YWwpKXsgcmV0dXJuIGV2ZS50by5uZXh0KG1zZykgfSAvLyBpbiBmYWN0
LCBpdCBtdXN0IGJlIEVYQUNUTFkgZXF1YWwgdG8gaXRzZWxmXG4gICAgICBubyhcIkFsaWFzIG5vdCBzYW1lIVwiKTsgLy8gaWYgaXQgaXNuJ3QsIHJlamVj
dC5cbiAgICB9O1xuICAgIGNoZWNrLnB1YnMgPSBmdW5jdGlvbihldmUsIG1zZywgdmFsLCBrZXksIHNvdWwsIGF0LCBubyl7IC8vIEV4YW1wbGU6IHtfOiN+
QGFsaWNlLCB+YXNkZjogeyN+YXNkZn19XG4gICAgICBpZighdmFsKXsgcmV0dXJuIG5vKFwiQWxpYXMgbXVzdCBleGlzdCFcIikgfSAvLyBkYXRhIE1VU1Qg
ZXhpc3RcbiAgICAgIGlmKGtleSA9PT0gbGlua19pcyh2YWwpKXsgcmV0dXJuIGV2ZS50by5uZXh0KG1zZykgfSAvLyBhbmQgdGhlIElEIG11c3QgYmUgRVhB
Q1RMWSBlcXVhbCB0byBpdHMgcHJvcGVydHlcbiAgICAgIG5vKFwiQWxpYXMgbm90IHNhbWUhXCIpOyAvLyB0aGF0IHdheSBub2JvZHkgY2FuIHRhbXBlciB3
aXRoIHRoZSBsaXN0IG9mIHB1YmxpYyBrZXlzLlxuICAgIH07XG4gICAgY2hlY2suJHNoID0ge1xuICAgICAgcHViOiA4OCxcbiAgICAgIGN1dDogMixcbiAg
ICAgIG1pbjogMSxcbiAgICAgIHJvb3Q6ICd+JyxcbiAgICAgIHByZTogJ34vJyxcbiAgICAgIGJhZDogL1teMC05YS16QS1aXS9cbiAgICB9XG4gICAgY2hl
Y2suJHNoLm1heCA9IE1hdGguY2VpbChjaGVjay4kc2gucHViIC8gY2hlY2suJHNoLmN1dClcbiAgICBjaGVjay4kc2VnID0gZnVuY3Rpb24oc2VnLCBzaG9y
dCl7XG4gICAgICBpZignc3RyaW5nJyAhPSB0eXBlb2Ygc2VnIHx8ICFzZWcpeyByZXR1cm4gfVxuICAgICAgaWYoc2hvcnQpe1xuICAgICAgICBpZihzZWcu
bGVuZ3RoIDwgY2hlY2suJHNoLm1pbiB8fCBzZWcubGVuZ3RoID4gY2hlY2suJHNoLmN1dCl7IHJldHVybiB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBp
ZihzZWcubGVuZ3RoICE9PSBjaGVjay4kc2guY3V0KXsgcmV0dXJuIH1cbiAgICAgIH1cbiAgICAgIGlmKGNoZWNrLiRzaC5iYWQudGVzdChzZWcpKXsgcmV0
dXJuIH1cbiAgICAgIHJldHVybiAxXG4gICAgfVxuICAgIGNoZWNrLiRwYXRoID0gZnVuY3Rpb24oc291bCl7XG4gICAgICBpZihjaGVjay4kc2gucm9vdCA9
PT0gc291bCl7IHJldHVybiBbXSB9XG4gICAgICBpZihjaGVjay4kc2gucHJlICE9PSAoc291bHx8JycpLnNsaWNlKDAsMikpeyByZXR1cm4gfVxuICAgICAg
aWYoJy8nID09PSBzb3VsLnNsaWNlKC0xKSB8fCAwIDw9IHNvdWwuaW5kZXhPZignLy8nKSl7IHJldHVybiB9XG4gICAgICB2YXIgcGF0aCA9IHNvdWwuc2xp
Y2UoMikuc3BsaXQoJy8nKSwgaSA9IDAsIHNlZztcbiAgICAgIGZvcihpOyBpIDwgcGF0aC5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHNlZyA9IHBhdGhbaV07
XG4gICAgICAgIGlmKCFjaGVjay4kc2VnKHNlZykpeyByZXR1cm4gfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG4gICAgY2hlY2suJGtp
ZCA9IGZ1bmN0aW9uKHNvdWwsIGtleSl7XG4gICAgICBpZihjaGVjay4kc2gucm9vdCA9PT0gc291bCl7IHJldHVybiBjaGVjay4kc2gucHJlICsga2V5IH1c
biAgICAgIHJldHVybiBzb3VsICsgJy8nICsga2V5XG4gICAgfVxuICAgIGNoZWNrLiRwdWIgPSBmdW5jdGlvbihzb3VsLCBrZXkpe1xuICAgICAgdmFyIHBh
dGggPSBjaGVjay4kcGF0aChzb3VsKTtcbiAgICAgIGlmKCFwYXRoKXsgcmV0dXJuIH1cbiAgICAgIHJldHVybiBwYXRoLmpvaW4oJycpICsga2V5XG4gICAg
fVxuICAgIGNoZWNrLiRsZWFmID0gZnVuY3Rpb24oc291bCwga2V5KXtcbiAgICAgIHZhciBwdWIgPSBjaGVjay4kcHViKHNvdWwsIGtleSk7XG4gICAgICBp
ZighcHViIHx8IHB1Yi5sZW5ndGggIT09IGNoZWNrLiRzaC5wdWIpeyByZXR1cm4gfVxuICAgICAgaWYoU0VBLm9wdC5wdWIoJ34nICsgcHViKSAhPT0gcHVi
KXsgcmV0dXJuIH1cbiAgICAgIHJldHVybiBwdWJcbiAgICB9XG4gICAgY2hlY2suJHNlYSA9IGZ1bmN0aW9uKG1zZywgdXNlciwgcHViKXtcbiAgICAgIHZh
ciBjdHggPSAobXNnLl8ubXNnIHx8IHt9KS5vcHQgfHwge31cbiAgICAgIHZhciBvcHQgPSBtc2cuXy5zZWEgfHwgKGZ1bmN0aW9uKCl7XG4gICAgICAgIHZh
ciBvID0gT2JqZWN0LmFzc2lnbih7fSwgY3R4KVxuICAgICAgICB0cnl7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG1zZy5fLCAnc2VhJywg
e3ZhbHVlOiBvLCBlbnVtZXJhYmxlOiBmYWxzZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZX0pXG4gICAgICAgIH1jYXRjaChlKXsgbXNn
Ll8uc2VhID0gbyB9XG4gICAgICAgIHJldHVybiBvXG4gICAgICB9KCkpXG4gICAgICB2YXIgc2VhID0gKHVzZXIgJiYgdXNlci5fKSB8fCB7fVxuICAgICAg
dmFyIGlzID0gKHVzZXIgJiYgdXNlci5pcykgfHwge31cbiAgICAgIHZhciBhdXRoZW50aWNhdG9yID0gb3B0LmF1dGhlbnRpY2F0b3IgfHwgc2VhLnNlYVxu
ICAgICAgdmFyIHVwdWIgPSBvcHQucHViIHx8IChhdXRoZW50aWNhdG9yIHx8IHt9KS5wdWIgfHwgaXMucHViIHx8IHB1YlxuICAgICAgaWYgKCFtc2cuXy5k
b25lKSB7XG4gICAgICAgIGRlbGV0ZSBjdHguYXV0aGVudGljYXRvcjsgZGVsZXRlIGN0eC5wdWJcbiAgICAgICAgbXNnLl8uZG9uZSA9IHRydWVcbiAgICAg
IH1cbiAgICAgIHJldHVybiB7b3B0LCBhdXRoZW50aWNhdG9yLCB1cHVifVxuICAgIH1cbiAgICBjaGVjay5zaGFyZCA9IGFzeW5jIGZ1bmN0aW9uKGV2ZSwg
bXNnLCB2YWwsIGtleSwgc291bCwgYXQsIG5vLCB1c2VyKXtcbiAgICAgIHZhciBwYXRoID0gY2hlY2suJHBhdGgoc291bCksIGxpbmsgPSBsaW5rX2lzKHZh
bCksIGV4cGVjdGVkLCBsZWFmLCByYXcsIGNsYWltO1xuICAgICAgaWYoIXBhdGgpeyByZXR1cm4gbm8oXCJJbnZhbGlkIHNoYXJkIHNvdWwgcGF0aC5cIikg
fVxuICAgICAgaWYoIWNoZWNrLiRzZWcoa2V5LCAxKSl7IHJldHVybiBubyhcIkludmFsaWQgc2hhcmQga2V5LlwiKSB9XG4gICAgICBpZigocGF0aC5sZW5n
dGggKyAxKSA+IGNoZWNrLiRzaC5tYXgpeyByZXR1cm4gbm8oXCJJbnZhbGlkIHNoYXJkIGRlcHRoLlwiKSB9XG4gICAgICBsZWFmID0gY2hlY2suJGxlYWYo
c291bCwga2V5KVxuICAgICAgaWYobGVhZil7XG4gICAgICAgIGlmKCFsaW5rKXsgcmV0dXJuIG5vKFwiU2hhcmQgbGVhZiB2YWx1ZSBtdXN0IGJlIGEgbGlu
ay5cIikgfVxuICAgICAgICBpZihsaW5rICE9PSAnficgKyBsZWFmKXsgcmV0dXJuIG5vKFwiU2hhcmQgbGVhZiBsaW5rIG11c3QgcG9pbnQgdG8gfnB1Yi5c
IikgfVxuICAgICAgICAvLyBBbHdheXMgc2lnbiBmcmVzaCDigJQgYXV0aGVudGljYXRvciByZXF1aXJlZDsgc2lnIGNvdmVycyBzdGF0ZSwgcHJldmVudGlu
ZyBwcmUtc2lnbmVkIHdyaXRlc1xuICAgICAgICB2YXIgbHNlYyA9IGNoZWNrLiRzZWEobXNnLCB1c2VyLCBsZWFmKVxuICAgICAgICB2YXIgbGF1dGhlbnRp
Y2F0b3IgPSBsc2VjLmF1dGhlbnRpY2F0b3JcbiAgICAgICAgdmFyIGx1cHViID0gbHNlYy51cHViIHx8IChsYXV0aGVudGljYXRvcnx8e30pLnB1YlxuICAg
ICAgICBpZighbGF1dGhlbnRpY2F0b3IpeyByZXR1cm4gbm8oXCJTaGFyZCBsZWFmIHJlcXVpcmVzIGF1dGhlbnRpY2F0b3IuXCIpIH1cbiAgICAgICAgaWYo
bHVwdWIgIT09IGxlYWYpeyByZXR1cm4gbm8oXCJTaGFyZCBsZWFmIGF1dGhlbnRpY2F0b3IgcHViIG1pc21hdGNoLlwiKSB9XG4gICAgICAgIGNoZWNrLmF1
dGgobXNnLCBubywgbGF1dGhlbnRpY2F0b3IsIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgIGlmKGxpbmtfaXMoZGF0YSkgIT09IGxpbmspeyByZXR1cm4g
bm8oXCJTaGFyZCBsZWFmIHNpZ25lZCBwYXlsb2FkIG1pc21hdGNoLlwiKSB9XG4gICAgICAgICAgbXNnLnB1dFsnPSddID0geycjJzogbGlua31cbiAgICAg
ICAgICBjaGVjay5uZXh0KGV2ZSwgbXNnLCBubylcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICAvLyBJbnRlcm1lZGlhdGVc
biAgICAgIGV4cGVjdGVkID0gY2hlY2suJGtpZChzb3VsLCBrZXkpXG4gICAgICB2YXIgcHJlZml4ID0gY2hlY2suJHB1Yihzb3VsLCBrZXkpXG4gICAgICBy
YXcgPSBsaW5rID8ge30gOiAoKGF3YWl0IFMucGFyc2UodmFsKSkgfHwge30pXG4gICAgICBjbGFpbSA9IChyYXcgJiYgdHlwZW9mIHJhdyA9PT0gJ29iamVj
dCcpID8gcmF3WycqJ10gOiB1bmRlZmluZWRcbiAgICAgIGlmKCFjbGFpbSl7XG4gICAgICAgIC8vIEZyZXNoIGNsaWVudCB3cml0ZSDigJQgYXV0aGVudGlj
YXRvciByZXF1aXJlZDsgU0VBLm9wdC5wYWNrIGJpbmRzIHNpZyB0byBHdW4gc3RhdGVcbiAgICAgICAgaWYoIWxpbmspeyByZXR1cm4gbm8oXCJTaGFyZCBp
bnRlcm1lZGlhdGUgdmFsdWUgbXVzdCBiZSBsaW5rLlwiKSB9XG4gICAgICAgIGlmKGxpbmsgIT09IGV4cGVjdGVkKXsgcmV0dXJuIG5vKFwiSW52YWxpZCBz
aGFyZCBsaW5rIHRhcmdldC5cIikgfVxuICAgICAgICB2YXIgc2VjID0gY2hlY2suJHNlYShtc2csIHVzZXIpXG4gICAgICAgIHZhciBhdXRoZW50aWNhdG9y
ID0gc2VjLmF1dGhlbnRpY2F0b3JcbiAgICAgICAgY2xhaW0gPSBzZWMudXB1YiB8fCAoKGF1dGhlbnRpY2F0b3J8fHt9KS5wdWIpXG4gICAgICAgIGlmKCFh
dXRoZW50aWNhdG9yKXsgcmV0dXJuIG5vKFwiU2hhcmQgaW50ZXJtZWRpYXRlIHJlcXVpcmVzIGF1dGhlbnRpY2F0b3IuXCIpIH1cbiAgICAgICAgaWYoJ3N0
cmluZycgIT09IHR5cGVvZiBjbGFpbSB8fCBjbGFpbS5sZW5ndGggIT09IGNoZWNrLiRzaC5wdWIpeyByZXR1cm4gbm8oXCJJbnZhbGlkIHNoYXJkIGludGVy
bWVkaWF0ZSBwdWIuXCIpIH1cbiAgICAgICAgaWYoU0VBLm9wdC5wdWIoJ34nICsgY2xhaW0pICE9PSBjbGFpbSl7IHJldHVybiBubyhcIkludmFsaWQgc2hh
cmQgaW50ZXJtZWRpYXRlIHB1YiBmb3JtYXQuXCIpIH1cbiAgICAgICAgaWYoMCAhPT0gY2xhaW0uaW5kZXhPZihwcmVmaXgpKXsgcmV0dXJuIG5vKFwiU2hh
cmQgcHViIHByZWZpeCBtaXNtYXRjaC5cIikgfVxuICAgICAgICBjaGVjay5hdXRoKG1zZywgbm8sIGF1dGhlbnRpY2F0b3IsIGZ1bmN0aW9uKGRhdGEpe1xu
ICAgICAgICAgIGlmKGxpbmtfaXMoZGF0YSkgIT09IGV4cGVjdGVkKXsgcmV0dXJuIG5vKFwiU2hhcmQgaW50ZXJtZWRpYXRlIHNpZ25lZCBwYXlsb2FkIG1p
c21hdGNoLlwiKSB9XG4gICAgICAgICAgbXNnLnB1dFsnOiddWycqJ10gPSBjbGFpbSAgLy8gYXBwZW5kIGZ1bGxQdWIgdG8geyc6JzpsaW5rLCd+JzpzaWd9
IHNldCBieSBjaGVjay5hdXRoXG4gICAgICAgICAgbXNnLnB1dFsnPSddID0geycjJzogZXhwZWN0ZWR9XG4gICAgICAgICAgY2hlY2submV4dChldmUsIG1z
Zywgbm8pXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgLy8gUGVlciByZS1yZWFkOiBzdG9yZWQgZW52ZWxvcGUgeyc6Jzog
bGluaywgJ34nOiBzaWcsICcqJzogZnVsbFB1Yn1cbiAgICAgIC8vIFNraXAgaWYgbG9jYWwgZ3JhcGggYWxyZWFkeSBoYXMgYSB2YWxpZCBsaW5rIGZvciB0
aGlzIHNsb3Qg4oCUIGF2b2lkIHJlZHVuZGFudCB2ZXJpZnkrd3JpdGVcbiAgICAgIHZhciBleGlzdGluZyA9ICgoYXQuZ3JhcGh8fHt9KVtzb3VsXXx8e30p
W2tleV1cbiAgICAgIGlmKGV4aXN0aW5nKXtcbiAgICAgICAgdmFyIGV4aXN0aW5nUGFyc2VkID0gYXdhaXQgUy5wYXJzZShleGlzdGluZylcbiAgICAgICAg
aWYoZXhpc3RpbmdQYXJzZWQgJiYgbGlua19pcyhleGlzdGluZ1BhcnNlZFsnOiddKSA9PT0gZXhwZWN0ZWQpe1xuICAgICAgICAgIG1zZy5wdXRbJz0nXSA9
IHsnIyc6IGV4cGVjdGVkfVxuICAgICAgICAgIHJldHVybiBldmUudG8ubmV4dChtc2cpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmKCdzdHJpbmcn
ICE9PSB0eXBlb2YgY2xhaW0gfHwgY2xhaW0ubGVuZ3RoICE9PSBjaGVjay4kc2gucHViKXsgcmV0dXJuIG5vKFwiSW52YWxpZCBzaGFyZCBpbnRlcm1lZGlh
dGUgcHViLlwiKSB9XG4gICAgICBpZihTRUEub3B0LnB1YignficgKyBjbGFpbSkgIT09IGNsYWltKXsgcmV0dXJuIG5vKFwiSW52YWxpZCBzaGFyZCBpbnRl
cm1lZGlhdGUgcHViIGZvcm1hdC5cIikgfVxuICAgICAgaWYoMCAhPT0gY2xhaW0uaW5kZXhPZihwcmVmaXgpKXsgcmV0dXJuIG5vKFwiU2hhcmQgcHViIHBy
ZWZpeCBtaXNtYXRjaC5cIikgfVxuICAgICAgaWYobGlua19pcyhyYXdbJzonXSkgIT09IGV4cGVjdGVkKXsgcmV0dXJuIG5vKFwiSW52YWxpZCBzaGFyZCBs
aW5rIHRhcmdldC5cIikgfVxuICAgICAgU0VBLm9wdC5wYWNrKG1zZy5wdXQsIGZ1bmN0aW9uKHBhY2tlZCl7XG4gICAgICAgIFNFQS52ZXJpZnkocGFja2Vk
LCBjbGFpbSwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgZGF0YSA9IFNFQS5vcHQudW5wYWNrKGRhdGEpXG4gICAgICAgICAgaWYodSA9PT0gZGF0YSl7
IHJldHVybiBubyhcIkludmFsaWQgc2hhcmQgaW50ZXJtZWRpYXRlIHNpZ25hdHVyZS5cIikgfVxuICAgICAgICAgIGlmKGxpbmtfaXMoZGF0YSkgIT09IGV4
cGVjdGVkKXsgcmV0dXJuIG5vKFwiU2hhcmQgaW50ZXJtZWRpYXRlIHBheWxvYWQgbWlzbWF0Y2guXCIpIH1cbiAgICAgICAgICBtc2cucHV0Wyc9J10gPSBk
YXRhXG4gICAgICAgICAgZXZlLnRvLm5leHQobXNnKSAgLy8gdmFsIGFscmVhZHkgYSBKU09OIHN0cmluZyDigJQgZm9yd2FyZCBkaXJlY3RseVxuICAgICAg
ICB9KVxuICAgICAgfSlcbiAgICB9O1xuICAgIGNoZWNrLiR2ZnkgPSBmdW5jdGlvbihldmUsIG1zZywga2V5LCBzb3VsLCBwdWIsIG5vLCBjZXJ0aWZpY2F0
ZSwgY2VydGlmaWNhbnQsIGNiKXtcbiAgICAgIGlmICghKGNlcnRpZmljYXRlfHwnJykubSB8fCAhKGNlcnRpZmljYXRlfHwnJykucyB8fCAhY2VydGlmaWNh
bnQgfHwgIXB1YikgeyByZXR1cm4gfVxuICAgICAgcmV0dXJuIFNFQS52ZXJpZnkoY2VydGlmaWNhdGUsIHB1YiwgZGF0YSA9PiB7IC8vIGNoZWNrIGlmIFwi
cHViXCIgKG9mIHRoZSBncmFwaCBvd25lcikgcmVhbGx5IGlzc3VlZCB0aGlzIGNlcnRcbiAgICAgICAgaWYgKHUgIT09IGRhdGEgJiYgdSAhPT0gZGF0YS5l
ICYmIG1zZy5wdXRbJz4nXSAmJiBtc2cucHV0Wyc+J10gPiBwYXJzZUZsb2F0KGRhdGEuZSkpIHJldHVybiBubyhcIkNlcnRpZmljYXRlIGV4cGlyZWQuXCIp
IC8vIGNlcnRpZmljYXRlIGV4cGlyZWRcbiAgICAgICAgLy8gXCJkYXRhLmNcIiA9IGEgbGlzdCBvZiBjZXJ0aWZpY2FudHMvY2VydGlmaWVkIHVzZXJzXG4g
ICAgICAgIC8vIFwiZGF0YS53XCIgPSBsZXggV1JJVEUgcGVybWlzc2lvbiwgaW4gdGhlIGZ1dHVyZSwgdGhlcmUgd2lsbCBiZSBcImRhdGEuclwiIHdoaWNo
IG1lYW5zIGxleCBSRUFEIHBlcm1pc3Npb25cbiAgICAgICAgaWYgKHUgIT09IGRhdGEgJiYgZGF0YS5jICYmIGRhdGEudyAmJiAoZGF0YS5jID09PSBjZXJ0
aWZpY2FudCB8fCBkYXRhLmMuaW5kZXhPZignKicpID4gLTEgfHwgZGF0YS5jLmluZGV4T2YoY2VydGlmaWNhbnQpID4gLTEpKSB7XG4gICAgICAgICAgLy8g
b2ssIG5vdyBcImNlcnRpZmljYW50XCIgaXMgaW4gdGhlIFwiY2VydGlmaWNhbnRzXCIgbGlzdCwgYnV0IGlzIFwicGF0aFwiIGFsbG93ZWQ/IENoZWNrIHBh
dGhcbiAgICAgICAgICB2YXIgcGF0aCA9IHNvdWwuaW5kZXhPZignLycpID4gLTEgPyBzb3VsLnJlcGxhY2Uoc291bC5zdWJzdHJpbmcoMCwgc291bC5pbmRl
eE9mKCcvJykgKyAxKSwgJycpIDogJydcbiAgICAgICAgICBTdHJpbmcubWF0Y2ggPSBTdHJpbmcubWF0Y2ggfHwgR3VuLnRleHQubWF0Y2hcbiAgICAgICAg
ICB2YXIgdyA9IEFycmF5LmlzQXJyYXkoZGF0YS53KSA/IGRhdGEudyA6IHR5cGVvZiBkYXRhLncgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBkYXRhLncgPT09
ICdzdHJpbmcnID8gW2RhdGEud10gOiBbXVxuICAgICAgICAgIGZvciAoY29uc3QgbGV4IG9mIHcpIHtcbiAgICAgICAgICAgIGlmICgoU3RyaW5nLm1hdGNo
KHBhdGgsIGxleFsnIyddKSAmJiBTdHJpbmcubWF0Y2goa2V5LCBsZXhbJy4nXSkpIHx8ICghbGV4WycuJ10gJiYgU3RyaW5nLm1hdGNoKHBhdGgsIGxleFsn
IyddKSkgfHwgKCFsZXhbJyMnXSAmJiBTdHJpbmcubWF0Y2goa2V5LCBsZXhbJy4nXSkpIHx8IFN0cmluZy5tYXRjaCgocGF0aCA/IHBhdGggKyAnLycgKyBr
ZXkgOiBrZXkpLCBsZXhbJyMnXSB8fCBsZXgpKSB7XG4gICAgICAgICAgICAgIC8vIGlzIENlcnRpZmljYW50IGZvcmNlZCB0byBwcmVzZW50IGluIFBhdGhc
biAgICAgICAgICAgICAgaWYgKGxleFsnKyddICYmIGxleFsnKyddLmluZGV4T2YoJyonKSA+IC0xICYmIHBhdGggJiYgcGF0aC5pbmRleE9mKGNlcnRpZmlj
YW50KSA9PSAtMSAmJiBrZXkuaW5kZXhPZihjZXJ0aWZpY2FudCkgPT0gLTEpIHJldHVybiBubyhgUGF0aCBcIiR7cGF0aH1cIiBvciBrZXkgXCIke2tleX1c
IiBtdXN0IGNvbnRhaW4gc3RyaW5nIFwiJHtjZXJ0aWZpY2FudH1cIi5gKVxuICAgICAgICAgICAgICAvLyBwYXRoIGlzIGFsbG93ZWQsIGJ1dCBpcyB0aGVy
ZSBhbnkgV1JJVEUgYmxvY2s/IENoZWNrIGl0IG91dFxuICAgICAgICAgICAgICBpZiAoZGF0YS53YiAmJiAodHlwZW9mIGRhdGEud2IgPT09ICdzdHJpbmcn
IHx8ICgoZGF0YS53YiB8fCB7fSlbJyMnXSkpKSB7IC8vIFwiZGF0YS53YlwiID0gcGF0aCB0byB0aGUgV1JJVEUgYmxvY2tcbiAgICAgICAgICAgICAgICB2
YXIgcm9vdCA9IGV2ZS5hcy5yb290LiQuYmFjaygtMSlcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEud2IgPT09ICdzdHJpbmcnICYmICd+JyAh
PT0gZGF0YS53Yi5zbGljZSgwLCAxKSkgcm9vdCA9IHJvb3QuZ2V0KCd+JyArIHB1YilcbiAgICAgICAgICAgICAgICByZXR1cm4gcm9vdC5nZXQoZGF0YS53
YikuZ2V0KGNlcnRpZmljYW50KS5vbmNlKHZhbHVlID0+IHsgLy8gVE9ETzogSU5URU5UIFRPIERFUFJFQ0FURS5cbiAgICAgICAgICAgICAgICAgIGlmICh2
YWx1ZSAmJiAodmFsdWUgPT09IDEgfHwgdmFsdWUgPT09IHRydWUpKSByZXR1cm4gbm8oYENlcnRpZmljYW50ICR7Y2VydGlmaWNhbnR9IGJsb2NrZWQuYClc
biAgICAgICAgICAgICAgICAgIHJldHVybiBjYihkYXRhKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0
dXJuIGNiKGRhdGEpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBubyhcIkNlcnRpZmljYXRlIHZlcmlmaWNhdGlvbiBm
YWlsLlwiKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICBjaGVjay5uZXh0ID0gZnVuY3Rpb24oZXZlLCBtc2csIG5vKXtcbiAgICAgIEpTT04u
c3RyaW5naWZ5QXN5bmMobXNnLnB1dFsnOiddLCBmdW5jdGlvbihlcnIscyl7XG4gICAgICAgIGlmKGVycil7IHJldHVybiBubyhlcnIgfHwgXCJTdHJpbmdp
ZnkgZXJyb3IuXCIpIH1cbiAgICAgICAgbXNnLnB1dFsnOiddID0gcztcbiAgICAgICAgcmV0dXJuIGV2ZS50by5uZXh0KG1zZyk7XG4gICAgICB9KVxuICAg
IH1cbiAgICBjaGVjay5ndWFyZCA9IGZ1bmN0aW9uKGV2ZSwgbXNnLCBrZXksIHNvdWwsIGF0LCBubywgZGF0YSwgbmV4dCl7XG4gICAgICBpZigwID4ga2V5
LmluZGV4T2YoJyMnKSl7IHJldHVybiBuZXh0KCkgfVxuICAgICAgY2hlY2suaGFzaChldmUsIG1zZywgZGF0YSwga2V5LCBzb3VsLCBhdCwgbm8sIG5leHQp
XG4gICAgfVxuICAgIGNoZWNrLmF1dGggPSBmdW5jdGlvbihtc2csIG5vLCBhdXRoZW50aWNhdG9yLCBkb25lKXtcbiAgICAgIFNFQS5vcHQucGFjayhtc2cu
cHV0LCBwYWNrZWQgPT4ge1xuICAgICAgICBpZiAoIWF1dGhlbnRpY2F0b3IpIHJldHVybiBubyhcIk1pc3NpbmcgYXV0aGVudGljYXRvclwiKTtcbiAgICAg
ICAgU0VBLnNpZ24ocGFja2VkLCBhdXRoZW50aWNhdG9yLCBhc3luYyBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgaWYgKHUgPT09IGRhdGEpIHJldHVy
biBubyhTRUEuZXJyIHx8ICdTaWduYXR1cmUgZmFpbC4nKVxuICAgICAgICAgIGlmICghZGF0YS5tIHx8ICFkYXRhLnMpIHJldHVybiBubygnSW52YWxpZCBz
aWduYXR1cmUgZm9ybWF0JylcbiAgICAgICAgICB2YXIgcGFyc2VkID0gU0VBLm9wdC51bnBhY2soZGF0YS5tKVxuICAgICAgICAgIG1zZy5wdXRbJzonXSA9
IHsnOic6IHBhcnNlZCwgJ34nOiBkYXRhLnN9XG4gICAgICAgICAgbXNnLnB1dFsnPSddID0gcGFyc2VkXG4gICAgICAgICAgZG9uZShwYXJzZWQpXG4gICAg
ICAgIH0sIHtyYXc6IDF9KVxuICAgICAgfSlcbiAgICB9XG4gICAgY2hlY2suJHRhZyA9IGFzeW5jIGZ1bmN0aW9uKG1zZywgY2VydCwgdXB1YiwgdmVyaWZ5
LCBuZXh0KXtcbiAgICAgIGNvbnN0IF9jZXJ0ID0gYXdhaXQgUy5wYXJzZShjZXJ0KVxuICAgICAgaWYgKF9jZXJ0ICYmIF9jZXJ0Lm0gJiYgX2NlcnQucykg
dmVyaWZ5KF9jZXJ0LCB1cHViLCBfID0+IHtcbiAgICAgICAgbXNnLnB1dFsnOiddWycrJ10gPSBfY2VydCAvLyAnKycgaXMgYSBjZXJ0aWZpY2F0ZVxuICAg
ICAgICBtc2cucHV0Wyc6J11bJyonXSA9IHVwdWIgLy8gJyonIGlzIHB1YiBvZiB0aGUgdXNlciB3aG8gcHV0c1xuICAgICAgICBuZXh0KClcbiAgICAgICAg
cmV0dXJuXG4gICAgICB9KVxuICAgIH1cbiAgICBjaGVjay5wYXNzID0gZnVuY3Rpb24oZXZlLCBtc2csIHJhdywgZGF0YSwgdmVyaWZ5KXtcbiAgICAgIGlm
IChyYXdbJysnXSAmJiByYXdbJysnXVsnbSddICYmIHJhd1snKyddWydzJ10gJiYgcmF3WycqJ10pe1xuICAgICAgICByZXR1cm4gdmVyaWZ5KHJhd1snKydd
LCByYXdbJyonXSwgXyA9PiB7XG4gICAgICAgICAgbXNnLnB1dFsnPSddID0gZGF0YTtcbiAgICAgICAgICByZXR1cm4gZXZlLnRvLm5leHQobXNnKTtcbiAg
ICAgICAgfSlcbiAgICAgIH1cbiAgICAgIG1zZy5wdXRbJz0nXSA9IGRhdGE7XG4gICAgICByZXR1cm4gZXZlLnRvLm5leHQobXNnKTtcbiAgICB9XG4gICAg
Y2hlY2sucHViID0gYXN5bmMgZnVuY3Rpb24oZXZlLCBtc2csIHZhbCwga2V5LCBzb3VsLCBhdCwgbm8sIHVzZXIsIHB1YiwgY29uZil7IHZhciB0bXAgLy8g
RXhhbXBsZToge186I35hc2RmLCBoZWxsbzond29ybGQnfmZkc2F9fVxuICAgICAgY29uZiA9IGNvbmYgfHwge31cbiAgICAgIGNvbnN0IHZlcmlmeSA9IChj
ZXJ0aWZpY2F0ZSwgY2VydGlmaWNhbnQsIGNiKSA9PiBjaGVjay4kdmZ5KGV2ZSwgbXNnLCBrZXksIHNvdWwsIHB1Yiwgbm8sIGNlcnRpZmljYXRlLCBjZXJ0
aWZpY2FudCwgY2IpXG4gICAgICBjb25zdCAkbmV4dCA9ICgpID0+IGNoZWNrLm5leHQoZXZlLCBtc2csIG5vKVxuXG4gICAgICAvLyBMb2NhbGl6ZSBhdXRo
IG9wdGlvbnMgaW50byBtZXNzYWdlLXByaXZhdGUgU0VBIGNvbnRleHQuXG4gICAgICBjb25zdCBzZWMgPSBjaGVjay4kc2VhKG1zZywgdXNlciwgcHViKVxu
ICAgICAgY29uc3Qgb3B0ID0gc2VjLm9wdFxuICAgICAgY29uc3QgYXV0aGVudGljYXRvciA9IHNlYy5hdXRoZW50aWNhdG9yXG4gICAgICBjb25zdCB1cHVi
ID0gc2VjLnVwdWJcbiAgICAgIGNvbnN0IGNlcnQgPSBjb25mLm5vY2VydCA/IHUgOiBvcHQuY2VydDtcbiAgICAgIGNvbnN0ICRleHBlY3QgPSBmdW5jdGlv
bihkYXRhKXtcbiAgICAgICAgaWYodSA9PT0gY29uZi53YW50KXsgcmV0dXJuIDEgfVxuICAgICAgICBpZihkYXRhID09PSBjb25mLndhbnQpeyByZXR1cm4g
MSB9XG4gICAgICAgIG5vKGNvbmYuZXJyIHx8IFwiVW5leHBlY3RlZCBwYXlsb2FkLlwiKVxuICAgICAgfVxuICAgICAgY29uc3QgcmF3ID0gKGF3YWl0IFMu
cGFyc2UodmFsKSkgfHwge31cbiAgICAgIGNvbnN0ICRoYXNoID0gZnVuY3Rpb24oZGF0YSwgbmV4dCl7XG4gICAgICAgIGNoZWNrLmd1YXJkKGV2ZSwgbXNn
LCBrZXksIHNvdWwsIGF0LCBubywgZGF0YSwgbmV4dClcbiAgICAgIH1cbiAgICAgIGNvbnN0ICRzaWduID0gYXN5bmMgZnVuY3Rpb24oKXtcbiAgICAgICAg
Ly8gaWYgd3JpdGluZyB0byBvd24gZ3JhcGgsIGp1c3QgYWxsb3cgaXRcbiAgICAgICAgaWYgKHB1YiA9PT0gdXB1Yikge1xuICAgICAgICAgIGlmICh0bXAg
PSBsaW5rX2lzKHZhbCkpIChhdC5zZWEub3duW3RtcF0gPSBhdC5zZWEub3duW3RtcF0gfHwge30pW3B1Yl0gPSAxXG4gICAgICAgICAgJG5leHQoKVxuICAg
ICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgd3JpdGluZyB0byBvdGhlcidzIGdyYXBoLCBjaGVjayBpZiBjZXJ0IGV4aXN0cyB0
aGVuIHRyeSB0byBpbmplY3QgY2VydCBpbnRvIHB1dCwgYWxzbyBpbmplY3Qgc2VsZiBwdWIgc28gdGhhdCBldmVyeW9uZSBjYW4gdmVyaWZ5IHRoZSBwdXRc
biAgICAgICAgaWYgKHB1YiAhPT0gdXB1YiAmJiBjZXJ0KSB7XG4gICAgICAgICAgcmV0dXJuIGNoZWNrLiR0YWcobXNnLCBjZXJ0LCB1cHViLCB2ZXJpZnks
ICRuZXh0KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCAkcGFzcyA9IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICByZXR1cm4gY2hlY2sucGFz
cyhldmUsIG1zZywgcmF3LCBkYXRhLCB2ZXJpZnkpXG4gICAgICB9XG5cbiAgICAgIGlmICgncHViJyA9PT0ga2V5ICYmICd+JyArIHB1YiA9PT0gc291bCkg
e1xuICAgICAgICBpZiAodmFsID09PSBwdWIpIHJldHVybiBldmUudG8ubmV4dChtc2cpIC8vIHRoZSBhY2NvdW50IE1VU1QgbWF0Y2ggYHB1YmAgcHJvcGVy
dHkgdGhhdCBlcXVhbHMgdGhlIElEIG9mIHRoZSBwdWJsaWMga2V5LlxuICAgICAgICByZXR1cm4gbm8oXCJBY2NvdW50IG5vdCBzYW1lIVwiKVxuICAgICAg
fVxuXG4gICAgICBpZiAoKCh1c2VyICYmIHVzZXIuaXMpIHx8IGF1dGhlbnRpY2F0b3IpICYmIHVwdWIgJiYgIXJhd1snKiddICYmICFyYXdbJysnXSAmJiAo
cHViID09PSB1cHViIHx8IChwdWIgIT09IHVwdWIgJiYgY2VydCkpKXtcbiAgICAgICAgY2hlY2suYXV0aChtc2csIG5vLCBhdXRoZW50aWNhdG9yLCBmdW5j
dGlvbihkYXRhKXtcbiAgICAgICAgICBpZighJGV4cGVjdChkYXRhKSl7IHJldHVybiB9XG4gICAgICAgICAgJGhhc2goZGF0YSwgJHNpZ24pXG4gICAgICAg
IH0pXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgU0VBLm9wdC5wYWNrKG1zZy5wdXQsIHBhY2tlZCA9PiB7XG4gICAgICAgIFNFQS52ZXJp
ZnkocGFja2VkLCByYXdbJyonXSB8fCBwdWIsIGZ1bmN0aW9uKGRhdGEpeyB2YXIgdG1wO1xuICAgICAgICAgIGRhdGEgPSBTRUEub3B0LnVucGFjayhkYXRh
KTtcbiAgICAgICAgICBpZiAodSA9PT0gZGF0YSkgcmV0dXJuIG5vKFwiVW52ZXJpZmllZCBkYXRhLlwiKSAvLyBtYWtlIHN1cmUgdGhlIHNpZ25hdHVyZSBt
YXRjaGVzIHRoZSBhY2NvdW50IGl0IGNsYWltcyB0byBiZSBvbi4gLy8gcmVqZWN0IGFueSB1cGRhdGVzIHRoYXQgYXJlIHNpZ25lZCB3aXRoIGEgbWlzbWF0
Y2hlZCBhY2NvdW50LlxuICAgICAgICAgIGlmKCEkZXhwZWN0KGRhdGEpKXsgcmV0dXJuIH1cbiAgICAgICAgICBpZiAoKHRtcCA9IGxpbmtfaXMoZGF0YSkp
ICYmIHB1YiA9PT0gU0VBLm9wdC5wdWIodG1wKSkgKGF0LnNlYS5vd25bdG1wXSA9IGF0LnNlYS5vd25bdG1wXSB8fCB7fSlbcHViXSA9IDFcblxuICAgICAg
ICAgICRoYXNoKGRhdGEsIGZ1bmN0aW9uKCl7ICRwYXNzKGRhdGEpIH0pXG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICAgIHJldHVyblxuICAgIH07XG4g
ICAgY2hlY2suYW55ID0gZnVuY3Rpb24oZXZlLCBtc2csIHZhbCwga2V5LCBzb3VsLCBhdCwgbm8sIHVzZXIpeyB2YXIgdG1wLCBwdWI7XG4gICAgICBpZihh
dC5vcHQuc2VjdXJlKXsgcmV0dXJuIG5vKFwiU291bCBtaXNzaW5nIHB1YmxpYyBrZXkgYXQgJ1wiICsga2V5ICsgXCInLlwiKSB9XG4gICAgICAvLyBUT0RP
OiBBc2sgY29tbXVuaXR5IGlmIHNob3VsZCBhdXRvLXNpZ24gbm9uIHVzZXItZ3JhcGggZGF0YS5cbiAgICAgIGF0Lm9uKCdzZWN1cmUnLCBmdW5jdGlvbiht
c2cpeyB0aGlzLm9mZigpO1xuICAgICAgICBpZighYXQub3B0LnNlY3VyZSl7IHJldHVybiBldmUudG8ubmV4dChtc2cpIH1cbiAgICAgICAgbm8oXCJEYXRh
IGNhbm5vdCBiZSBjaGFuZ2VkLlwiKTtcbiAgICAgIH0pLm9uLm9uKCdzZWN1cmUnLCBtc2cpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciB2
YWxpZCA9IEd1bi52YWxpZCwgbGlua19pcyA9IGZ1bmN0aW9uKGQsbCl7IHJldHVybiAnc3RyaW5nJyA9PSB0eXBlb2YgKGwgPSB2YWxpZChkKSkgJiYgbCB9
LCBzdGF0ZV9pZnkgPSAoR3VuLnN0YXRlfHwnJykuaWZ5O1xuXG4gICAgdmFyIHB1YmN1dCA9IC9bXlxcd18tXS87IC8vIGtlcHQgZm9yIG9sZC1mb3JtYXQg
cGFyc2luZyBiZWxvd1xuICAgIFNFQS5vcHQucHViID0gZnVuY3Rpb24ocyl7XG4gICAgICBpZighcyl7IHJldHVybiB9XG4gICAgICBzID0gcy5zcGxpdCgn
ficpWzFdXG4gICAgICBpZighcyl7IHJldHVybiB9XG4gICAgICBpZignQCcgPT09IChzWzBdfHwnJylbMF0peyByZXR1cm4gfVxuICAgICAgLy8gTmV3IGZv
cm1hdDogODggYWxwaGFudW1lcmljIGNoYXJzIChiYXNlNjIpXG4gICAgICBpZigvXltBLVphLXowLTldezg4fS8udGVzdChzKSl7IHJldHVybiBzLnNsaWNl
KDAsIDg4KSB9XG4gICAgICAvLyBPbGQgZm9ybWF0OiB4LnkgKGJhc2U2NHVybCwgODcgY2hhcnMpIOKAlCBiYWNrd2FyZCBjb21wYXQgZm9yIGNoZWNrLnB1
YiByb3V0aW5nXG4gICAgICB2YXIgcGFydHMgPSBzLnNwbGl0KHB1YmN1dCkuc2xpY2UoMCwyKVxuICAgICAgaWYoIXBhcnRzIHx8IDIgIT09IHBhcnRzLmxl
bmd0aCl7IHJldHVybiB9XG4gICAgICByZXR1cm4gcGFydHMuc2xpY2UoMCwyKS5qb2luKCcuJylcbiAgICB9XG4gICAgU0VBLm9wdC5zdHJpbmd5ID0gZnVu
Y3Rpb24odCl7XG4gICAgICAvLyBUT0RPOiBlbmNyeXB0IGV0Yy4gbmVlZCB0byBjaGVjayBzdHJpbmcgcHJpbWl0aXZlLiBNYWtlIGFzIGJyZWFraW5nIGNo
YW5nZS5cbiAgICB9XG4gICAgU0VBLm9wdC5wYWNrID0gZnVuY3Rpb24oZCxjYixrLCBuLHMpeyB2YXIgdG1wLCBmOyAvLyBwYWNrIGZvciB2ZXJpZnlpbmdc
biAgICAgIGlmKFNFQS5vcHQuY2hlY2soZCkpeyByZXR1cm4gY2IoZCkgfVxuICAgICAgaWYoZCAmJiBkWycjJ10gJiYgZFsnLiddICYmIGRbJz4nXSl7IHRt
cCA9IGRbJzonXTsgZiA9IDEgfVxuICAgICAgSlNPTi5wYXJzZUFzeW5jKGY/IHRtcCA6IGQsIGZ1bmN0aW9uKGVyciwgbWV0YSl7XG4gICAgICAgIHZhciBz
aWcgPSAoKHUgIT09IChtZXRhfHwnJylbJzonXSkgJiYgKG1ldGF8fCcnKVsnfiddKTsgLy8gb3IganVzdCB+IGNoZWNrP1xuICAgICAgICBpZighc2lnKXsg
Y2IoZCk7IHJldHVybiB9XG4gICAgICAgIGNiKHttOiB7JyMnOnN8fGRbJyMnXSwnLic6a3x8ZFsnLiddLCc6JzoobWV0YXx8JycpWyc6J10sJz4nOmRbJz4n
XXx8R3VuLnN0YXRlLmlzKG4sIGspfSwgczogc2lnfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdmFyIE8gPSBTRUEub3B0O1xuICAgIFNFQS5vcHQudW5w
YWNrID0gZnVuY3Rpb24oZCwgaywgbil7IHZhciB0bXA7XG4gICAgICBpZih1ID09PSBkKXsgcmV0dXJuIH1cbiAgICAgIGlmKGQgJiYgKHUgIT09ICh0bXAg
PSBkWyc6J10pKSl7IHJldHVybiB0bXAgfVxuICAgICAgayA9IGsgfHwgTy5mYWxsX2tleTsgaWYoIW4gJiYgTy5mYWxsX3ZhbCl7IG4gPSB7fTsgbltrXSA9
IE8uZmFsbF92YWwgfVxuICAgICAgaWYoIWsgfHwgIW4peyByZXR1cm4gfVxuICAgICAgaWYoZCA9PT0gbltrXSl7IHJldHVybiBkIH1cbiAgICAgIGlmKCFT
RUEub3B0LmNoZWNrKG5ba10pKXsgcmV0dXJuIGQgfVxuICAgICAgdmFyIHNvdWwgPSAobiAmJiBuLl8gJiYgbi5fWycjJ10pIHx8IE8uZmFsbF9zb3VsLCBz
ID0gR3VuLnN0YXRlLmlzKG4sIGspIHx8IE8uZmFsbF9zdGF0ZTtcbiAgICAgIGlmKGQgJiYgNCA9PT0gZC5sZW5ndGggJiYgc291bCA9PT0gZFswXSAmJiBr
ID09PSBkWzFdICYmIGZsKHMpID09PSBmbChkWzNdKSl7XG4gICAgICAgIHJldHVybiBkWzJdO1xuICAgICAgfVxuICAgICAgaWYocyA8IFNFQS5vcHQuc2h1
ZmZsZV9hdHRhY2spe1xuICAgICAgICByZXR1cm4gZDtcbiAgICAgIH1cbiAgICB9XG4gICAgU0VBLm9wdC5zaHVmZmxlX2F0dGFjayA9IDE1NDYzMjk2MDAw
MDA7IC8vIEphbiAxLCAyMDE5XG4gICAgdmFyIGZsID0gTWF0aC5mbG9vcjsgLy8gVE9ETzogU3RpbGwgbmVlZCB0byBmaXggaW5jb25zaXN0ZW50IHN0YXRl
IGlzc3VlLlxuICAgIC8vIFRPRE86IFBvdGVudGlhbCBidWc/IElmIHB1Yi9wcml2IGtleSBzdGFydHMgd2l0aCBgLWA/IElESyBob3cgcG9zc2libGUuXG4g
IFxufSgpKTtcbiJ9fQ==
UNBUILD-SNAPSHOT-END */
