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
          pair: {name: 'ECDSA', namedCurve: 'P-256'},
          sign: {name: 'ECDSA', hash: {name: 'SHA-256'}}
        };
        s.ecdh = {name: 'ECDH', namedCurve: 'P-256'};

        // This creates Web Cryptography API compliant JWK for sign/verify purposes
        s.jwk = function(pub, d){  // d === priv
          var b62 = SEA.base62;
          var xy = b62.pubToJwkXY(pub); // handles old (87-char x.y) and new (88-char base62)
          var x = xy.x, y = xy.y;
          var jwk = {kty: "EC", crv: "P-256", x: x, y: y, ext: true};
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

        s.check = function(t){ return (typeof t == 'string') && ('SEA{' === t.slice(0,4)) }
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
    var __shim = USE('./shim.js', 1);

    let __defaultExport;
    (function(){

        var SEA = __root;
        var shim = __shim;

        // P-256 curve constants
        const n = BigInt("0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551");
        const P = BigInt("0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff");
        const A = BigInt("0xffffffff00000001000000000000000000000000fffffffffffffffffffffffc");
        const B = BigInt("0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b"); // Curve coefficient b
        const G = {
          x: BigInt("0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296"),
          y: BigInt("0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5")
        };

        // Core ECC functions
        function mod(a, m) { return ((a % m) + m) % m; }

        // Modular inverse using Fermat's Little Theorem (p is prime)
        // WARNING: modPow must be constant-time to prevent timing attacks on secret keys
        function modInv(a, p) {
            // a^(p-2) mod p
            return modPow(a, p - BigInt(2), p);
        }

        // Constant-time modular exponentiation using binary exponentiation
        // Always performs all iterations to prevent timing attacks
        // Uses conditional assignment instead of branches
        function modPow(base, exponent, modulus) {
            if (modulus === BigInt(1)) return BigInt(0);
            base = mod(base, modulus);
            let result = BigInt(1);
            let exp = exponent;

            // Process all bits with constant execution time
            while (exp > BigInt(0)) {
                const bit = exp & BigInt(1);
                // Always perform multiplication
                const temp = mod(result * base, modulus);
                // Constant-time conditional assignment (no branch prediction leak)
                result = bit ? temp : result;
                exp >>= BigInt(1);
                base = mod(base * base, modulus);
            }
            return result;
        }

        // Verify a point is on the curve
        function isOnCurve(point) {
            if (!point) return false;
            // y² = x³ + ax + b (mod p)
            const { x, y } = point;
            const left = mod(y * y, P);
            const right = mod(mod(mod(x * x, P) * x, P) + mod(A * x, P) + B, P);
            return left === right;
        }

        function pointAdd(p1, p2) {
          if (p1 === null) return p2; if (p2 === null) return p1;
          if (p1.x === p2.x && mod(p1.y + p2.y, P) === 0n) return null;
          let lambda = p1.x === p2.x && p1.y === p2.y
            ? mod((3n * mod(p1.x ** 2n, P) + A) * modInv(2n * p1.y, P), P)
            : mod((mod(p2.y - p1.y, P)) * modInv(mod(p2.x - p1.x, P), P), P);
          const x3 = mod(lambda ** 2n - p1.x - p2.x, P);
          return { x: x3, y: mod(lambda * mod(p1.x - x3, P) - p1.y, P) };
        }

        function pointMult(k, point) {
          // Fixed-window scalar multiplication to reduce timing variance
          let r = null, a = point;
          for (let i = 0; i < 256; i++) {
            const bit = (k >> BigInt(i)) & 1n;
            const temp = pointAdd(r, a);
            r = bit ? temp : r;
            a = pointAdd(a, a);
          }
          return r;
        }

        SEA.pair = SEA.pair || (async (cb, opt) => { try {
          var b62 = SEA.base62;
          opt = opt || {};
          const subtle = shim.subtle, ecdhSubtle = shim.ossl || subtle;
          let r = {};

          // Helper functions
          const b64ToBI = s => {
            // Validate base64 input format
            if (typeof s !== 'string' || s.length === 0) {
              throw new Error("Invalid base64 input: must be non-empty string");
            }
            // Standard base64url validation
            if (!/^[A-Za-z0-9_-]*={0,2}$/.test(s)) {
              throw new Error("Invalid base64 characters detected");
            }

            try {
              const hex = shim.Buffer.from(atob(s), 'binary').toString('hex');

              // Validate result is within P-256 range (256 bits / 64 hex chars)
              if (hex.length > 64) {
                throw new Error("Decoded value exceeds 256 bits for P-256");
              }

              const value = BigInt('0x' + hex);
              return value;
            } catch (e) {
              if (e.message.includes("256 bits")) throw e;
              throw new Error("Invalid base64 decoding: " + e.message);
            }
          };
          // privToBI: parse priv/epriv accepting both old 43-char base64url and new 44-char base62
          const privToBI = s => {
            if (typeof s === 'string' && s.length === 44 && /^[A-Za-z0-9]{44}$/.test(s)) {
              return b62.b62ToBI(s);
            }
            return b64ToBI(s); // backward compat: old base64url 43-char
          };
          const biToB64 = n => {
            // Validate input is within valid range for P-256 (256 bits max)
            const max256bit = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
            if (n < 0n || n > max256bit) {
              throw new Error("Invalid BigInt: must be 0 <= n <= 2^256-1");
            }
            const hex = n.toString(16).padStart(64, '0');
            if (hex.length > 64) {
              throw new Error("BigInt too large for P-256: exceeds 256 bits");
            }
            const b64 = shim.Buffer.from(hex, 'hex').toString('base64')
              .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
            return b64;
          };
          const ensurePrivRange = (priv, name) => {
            if (priv <= 0n || priv >= n) {
              throw new Error((name || 'Private key') + " out of range");
            }
            return priv;
          };
          const pubFromPriv = priv => {
            ensurePrivRange(priv, 'Private key');
            const pub = pointMult(priv, G);
            if (!isOnCurve(pub)) throw new Error("Invalid point generated");
            return b62.biToB62(pub.x) + b62.biToB62(pub.y);
          };
          const parsePub = pubStr => {
            if (!pubStr || typeof pubStr !== 'string') {
              throw new Error("Invalid pub format: must be string");
            }
            const xy = b62.pubToJwkXY(pubStr); // handles both old (87) and new (88) format
            const point = { x: b64ToBI(xy.x), y: b64ToBI(xy.y) };
            if (point.x >= P || point.y >= P) {
              throw new Error("Invalid public key: out of range");
            }
            if (!isOnCurve(point)) {
              throw new Error("Invalid public key: not on curve");
            }
            return point;
          };
          const pointToPub = point => {
            if (!point || !isOnCurve(point)) {
              throw new Error("Invalid point: not on curve");
            }
            return b62.biToB62(point.x) + b62.biToB62(point.y);
          };
          const seedToBuffer = seed => {
            const enc = new shim.TextEncoder();
            if (typeof seed === 'string') {
              return enc.encode(seed).buffer;
            }
            if (seed instanceof ArrayBuffer) {
              return seed;
            }
            if (seed && seed.byteLength !== undefined) {
              return seed.buffer || seed;
            }
            return null;
          };
          const seedToKey = async (seed, salt) => {
            const enc = new shim.TextEncoder();
            const buf = seedToBuffer(seed);
            if (!buf) throw new Error("Invalid seed");
            const combined = new Uint8Array(buf.byteLength + enc.encode(salt).buffer.byteLength);
            combined.set(new Uint8Array(buf), 0);
            combined.set(new Uint8Array(enc.encode(salt).buffer), buf.byteLength);
            const hash = await subtle.digest("SHA-256", combined.buffer);

            // Use rejected resampling for uniform distribution
            // Keep hashing until we get a valid private key in range [1, n)
            let hashData = hash;
            let attemptCount = 0;
            const maxAttempts = 100; // Prevent infinite loops

            while (attemptCount < maxAttempts) {
              let priv = BigInt("0x" + Array.from(new Uint8Array(hashData))
                .map(b => b.toString(16).padStart(2, "0")).join(""));

              // Check if priv is in valid range [1, n)
              if (priv > 0n && priv < n) {
                return priv;
              }

              // Resample by hashing the previous result with counter
              const counterBuf = new Uint8Array(4);
              new DataView(counterBuf.buffer).setUint32(0, attemptCount, true);
              const combined2 = new Uint8Array(hashData.byteLength + counterBuf.byteLength);
              combined2.set(new Uint8Array(hashData), 0);
              combined2.set(counterBuf, hashData.byteLength);
              hashData = await subtle.digest("SHA-256", combined2.buffer);
              attemptCount++;
            }

            throw new Error("Failed to generate valid private key after " + maxAttempts + " attempts");
          };
          const hashToScalar = async (seed, label, counter) => {
            const enc = new shim.TextEncoder();
            const buf = seedToBuffer(seed);
            if (!buf) throw new Error("Invalid seed");
            const labelStr = counter !== undefined && counter !== null ? label + counter : label;
            const labelBuf = enc.encode(labelStr).buffer;
            const combined = new Uint8Array(buf.byteLength + labelBuf.byteLength);
            combined.set(new Uint8Array(labelBuf), 0);
            combined.set(new Uint8Array(buf), labelBuf.byteLength);
            const hash = await subtle.digest("SHA-256", combined.buffer);

            let hashData = hash;
            let attemptCount = 0;
            const maxAttempts = 100;
            while (attemptCount < maxAttempts) {
              const scalar = BigInt("0x" + Array.from(new Uint8Array(hashData))
                .map(b => b.toString(16).padStart(2, "0")).join(""));
              if (scalar > 0n && scalar < n) {
                return scalar;
              }
              const counterBuf = new Uint8Array(4);
              new DataView(counterBuf.buffer).setUint32(0, attemptCount, true);
              const combined2 = new Uint8Array(hashData.byteLength + counterBuf.byteLength);
              combined2.set(new Uint8Array(hashData), 0);
              combined2.set(counterBuf, hashData.byteLength);
              hashData = await subtle.digest("SHA-256", combined2.buffer);
              attemptCount++;
            }
            throw new Error("Failed to derive scalar after " + maxAttempts + " attempts");
          };

          const deriveScalar = async (seed, label, attempt) => {
            return hashToScalar(seed, label, attempt === 0 ? null : attempt);
          };
          const derivePrivWithRetry = async (priv, label) => {
            for (let attempt = 0; attempt < 100; attempt++) {
              const offset = await deriveScalar(opt.seed, label, attempt);
              const derivedPriv = mod(priv + offset, n);
              if (derivedPriv !== 0n) {
                return { derivedPriv, attempt };
              }
            }
            throw new Error("Failed to derive non-zero private key");
          };
          const derivePubWithRetry = async (pubPoint, label) => {
            for (let attempt = 0; attempt < 100; attempt++) {
              const offset = await deriveScalar(opt.seed, label, attempt);
              const derivedPub = pointAdd(pubPoint, pointMult(offset, G));
              if (derivedPub) {
                return derivedPub;
              }
            }
            throw new Error("Failed to derive valid public key");
          };

          if (opt.seed && (opt.priv || opt.epriv || opt.pub || opt.epub)) {
            r = {};
            if (opt.priv) {
              const priv = ensurePrivRange(privToBI(opt.priv), 'Private key');
              const signResult = await derivePrivWithRetry(priv, "SEA.DERIVE|sign|");
              const derivedPriv = signResult.derivedPriv;
              const derivedPub = pointMult(derivedPriv, G);
              r.priv = b62.biToB62(derivedPriv);
              r.pub = pointToPub(derivedPub);
            }
            if (opt.epriv) {
              const epriv = ensurePrivRange(privToBI(opt.epriv), 'Encryption private key');
              const encResult = await derivePrivWithRetry(epriv, "SEA.DERIVE|encrypt|");
              const derivedEpriv = encResult.derivedPriv;
              const derivedEpub = pointMult(derivedEpriv, G);
              r.epriv = b62.biToB62(derivedEpriv);
              r.epub = pointToPub(derivedEpub);
            }
            if (opt.pub) {
              const pubPoint = parsePub(opt.pub);
              const derivedPub = await derivePubWithRetry(pubPoint, "SEA.DERIVE|sign|");
              r.pub = pointToPub(derivedPub);
            }
            if (opt.epub) {
              const epubPoint = parsePub(opt.epub);
              const derivedEpub = await derivePubWithRetry(epubPoint, "SEA.DERIVE|encrypt|");
              r.epub = pointToPub(derivedEpub);
            }
          } else if (opt.priv) {
            const priv = ensurePrivRange(privToBI(opt.priv), 'Private key');
            r = { priv: opt.priv, pub: pubFromPriv(priv) };
            if (opt.epriv) {
              const epriv = ensurePrivRange(privToBI(opt.epriv), 'Encryption private key');
              r.epriv = opt.epriv;
              r.epub = pubFromPriv(epriv);
            } else {
              try {
                const dh = await ecdhSubtle.generateKey({name: 'ECDH', namedCurve: 'P-256'}, true, ['deriveKey'])
                .then(async k => ({ 
                  epriv: b62.b64ToB62((await ecdhSubtle.exportKey('jwk', k.privateKey)).d),
                  epub: b62.b64ToB62((await ecdhSubtle.exportKey('jwk', k.publicKey)).x) +
                        b62.b64ToB62((await ecdhSubtle.exportKey('jwk', k.publicKey)).y)
                }));
                r.epriv = dh.epriv; r.epub = dh.epub;
              } catch(e) {}
            }
          } else if (opt.epriv) {
            const epriv = ensurePrivRange(privToBI(opt.epriv), 'Encryption private key');
            r = { epriv: opt.epriv, epub: pubFromPriv(epriv) };
            if (opt.priv) {
              const priv = ensurePrivRange(privToBI(opt.priv), 'Private key');
              r.priv = opt.priv;
              r.pub = pubFromPriv(priv);
            } else {
              const sa = await subtle.generateKey({name: 'ECDSA', namedCurve: 'P-256'}, true, ['sign', 'verify'])
              .then(async k => ({ 
                priv: b62.b64ToB62((await subtle.exportKey('jwk', k.privateKey)).d),
                pub: b62.b64ToB62((await subtle.exportKey('jwk', k.publicKey)).x) +
                     b62.b64ToB62((await subtle.exportKey('jwk', k.publicKey)).y)
              }));
              r.priv = sa.priv; r.pub = sa.pub;
            }
          } else if (opt.seed) {
            const signPriv = await seedToKey(opt.seed, "-sign");
            const encPriv = await seedToKey(opt.seed, "-encrypt");
            r = {
              priv: b62.biToB62(signPriv), pub: pubFromPriv(signPriv),
              epriv: b62.biToB62(encPriv), epub: pubFromPriv(encPriv)
            };
          } else {
            const sa = await subtle.generateKey({name: 'ECDSA', namedCurve: 'P-256'}, true, ['sign', 'verify'])
            .then(async k => ({ 
              priv: b62.b64ToB62((await subtle.exportKey('jwk', k.privateKey)).d),
              pub: b62.b64ToB62((await subtle.exportKey('jwk', k.publicKey)).x) +
                   b62.b64ToB62((await subtle.exportKey('jwk', k.publicKey)).y)
            }));
            r = { pub: sa.pub, priv: sa.priv };
            try {
              const dh = await ecdhSubtle.generateKey({name: 'ECDH', namedCurve: 'P-256'}, true, ['deriveKey'])
              .then(async k => ({ 
                epriv: b62.b64ToB62((await ecdhSubtle.exportKey('jwk', k.privateKey)).d),
                epub: b62.b64ToB62((await ecdhSubtle.exportKey('jwk', k.publicKey)).x) +
                      b62.b64ToB62((await ecdhSubtle.exportKey('jwk', k.publicKey)).y)
              }));
              r.epub = dh.epub; r.epriv = dh.epriv;
            } catch(e) {}
          }

          if(cb) try{ cb(r) }catch(e){ /* Silently ignore callback errors to prevent leaking secrets */ }
          return r;
        } catch(e) {
          SEA.err = e;
          if(SEA.throw) throw e;
          if(cb) try { cb(); } catch(cbErr) { /* Ignore callback errors */ }
          throw new Error("Key generation failed: " + (e.message || "Unknown error"));
        }});

        __defaultExport = SEA.pair;

    }());
    module.exports = __defaultExport;
  })(USE, './pair');

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

        async function n(r, o, c) {
          try {
            if(!o.raw){ r = 'SEA' + (await shim.stringify(r)) }
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

        async function k(p, j, o, c) {
          var x = S.jwk(p.pub, p.priv);
          if (!x) throw "Invalid key pair";
          var h = await sha(j);
          var s = await (shim.ossl || shim.subtle).importKey('jwk', x, S.ecdsa.pair, false, ['sign'])
          .then((k) => (shim.ossl || shim.subtle).sign(S.ecdsa.sign, k, new Uint8Array(h)))
          .catch(() => { throw "SEA signature failed" });
          return n({m: j, s: shim.Buffer.from(s, 'binary').toString(o.encode || 'base64')}, o, c);
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

          return k(pair, j, opt, cb);
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
    var __sha256 = USE('./sha256.js', 1);

    let __defaultExport;
    (function(){

        var SEA = __root;
        var shim = __shim;
        var S = __settings;
        var sha = __sha256;
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

        async function v(j, k, s, h) {
          return (shim.ossl || shim.subtle).verify(
            {name: 'ECDSA', hash: {name: 'SHA-256'}}, 
            k, s, new Uint8Array(h)
          );
        }

        SEA.verify = SEA.verify || (async (d, p, cb, o) => { try {
          var j = await S.parse(d);
          if(false === p) return cb ? cb(await S.parse(j.m)) : await S.parse(j.m);

          o = o || {};
          var pub = p.pub || p;
          var b62 = SEA.base62;
          var xy = b62.pubToJwkXY(pub);
          var x = xy.x, y = xy.y;

          try {
            var k = await (shim.ossl || shim.subtle).importKey('jwk', {
                kty: 'EC', crv: 'P-256', x, y, ext: true, key_ops: ['verify']
            }, {name: 'ECDSA', namedCurve: 'P-256'}, false, ['verify']);

            var h = await sha(j.m);
            var s = new Uint8Array(shim.Buffer.from(j.s || '', o.encode || 'base64'));

            var c = j.a && j.c ? await w(j, k, s) : await v(j, k, s, h);

            if(!c) throw "Signature did not match";

            // Parse the message content
            var r = await S.parse(j.m);

            // Handle encrypted data consistently
            // SEA encrypted data can be in two formats:
            // 1. A string starting with 'SEA' followed by JSON (e.g., 'SEA{"ct":"...","iv":"...","s":"..."}')
            // 2. An object with ct, iv, and s properties

            // Case 1: Original message was already in SEA string format
            if(typeof j.m === 'string' && j.m.startsWith('SEA{')) {
              if(cb){ try{ cb(j.m) }catch(e){} }
              return j.m;
            }

            // Case 2: Result is an encrypted data object
            // This ensures consistent formatting of encrypted data as SEA strings
            if(r && typeof r === 'object' && 
               typeof r.ct === 'string' && 
               typeof r.iv === 'string' && 
               typeof r.s === 'string') {
              // Format as standard SEA encrypted string
              var seaStr = 'SEA' + JSON.stringify(r);
              if(cb){ try{ cb(seaStr) }catch(e){} }
              return seaStr;
            }

            // Default case: Return parsed result as is
            if(cb){ try{ cb(r) }catch(e){} }
            return r;
          } catch(e) {
            if(SEA.opt.fallback){
                return await SEA.opt.fall_verify(d, p, cb, o);
            }
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

        var knownKeys = {};
        SEA.opt.slow_leak = pair => {
          if (knownKeys[pair]) return knownKeys[pair];
          var jwk = S.jwk(pair);
          knownKeys[pair] = (shim.ossl || shim.subtle).importKey("jwk", jwk, {name: 'ECDSA', namedCurve: 'P-256'}, false, ["verify"]);
          return knownKeys[pair];
        };

        SEA.opt.fall_verify = async function(data, pair, cb, opt, f){
          if(f === SEA.opt.fallback){ throw "Signature did not match" }
          var tmp = data||'';
          data = SEA.opt.unpack(data) || data;
          var json = await S.parse(data), key = await SEA.opt.slow_leak(pair.pub || pair);
          var hash = (!f || f <= SEA.opt.fallback)? 
            shim.Buffer.from(await shim.subtle.digest({name: 'SHA-256'}, 
              new shim.TextEncoder().encode(await S.parse(json.m)))) : await sha(json.m);

          try {
            var buf = shim.Buffer.from(json.s, opt.encode || 'base64');
            var sig = new Uint8Array(buf);
            var check = await (shim.ossl || shim.subtle).verify(
              {name: 'ECDSA', hash: {name: 'SHA-256'}}, 
              key, sig, new Uint8Array(hash)
            );
            if(!check) throw "";
          } catch(e) {
            try {
              buf = shim.Buffer.from(json.s, 'utf8');
              sig = new Uint8Array(buf);
              check = await (shim.ossl || shim.subtle).verify(
                {name: 'ECDSA', hash: {name: 'SHA-256'}}, 
                key, sig, new Uint8Array(hash)
              );
              if(!check) throw "";
            } catch(e){ throw "Signature did not match." }
          }

          var r = check ? await S.parse(json.m) : u;
          SEA.opt.fall_soul = tmp['#']; SEA.opt.fall_key = tmp['.'];
          SEA.opt.fall_val = data; SEA.opt.fall_state = tmp['>'];
          if(cb){ try{ cb(r) }catch(e){console.log(e)} }
          return r;
        }
        SEA.opt.fallback = 2;

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
    var __shim = USE('./shim.js', 1);
    var __settings = USE('./settings.js', 1);
    var __aeskey = USE('./aeskey.js', 1);

    let __defaultExport;
    (function(){

        var SEA = __root;
        var shim = __shim;
        var S = __settings;
        var aeskey = __aeskey;
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
          var msg = (typeof data == 'string')? data : await shim.stringify(data);
          var rand = {s: shim.random(9), iv: shim.random(15)}; // consider making this 9 and 15 or 18 or 12 to reduce == padding.
          var ct = await aeskey(key, rand.s, opt).then((aes) => (/*shim.ossl ||*/ (shim.subtle)).encrypt({ // Keeping the AES key scope as private as possible...
            name: opt.name || 'AES-GCM', iv: new Uint8Array(rand.iv)
          }, aes, new shim.TextEncoder().encode(msg)));
          var r = {
            ct: shim.Buffer.from(ct, 'binary').toString(opt.encode || 'base64'),
            iv: rand.iv.toString(opt.encode || 'base64'),
            s: rand.s.toString(opt.encode || 'base64')
          }
          if(!opt.raw){ r = 'SEA' + (await shim.stringify(r)) }

          if(cb){ try{ cb(r) }catch(e){console.log(e)} }
          return r;
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
    var __shim = USE('./shim.js', 1);
    var __settings = USE('./settings.js', 1);
    var __aeskey = USE('./aeskey.js', 1);

    let __defaultExport;
    (function(){

        var SEA = __root;
        var shim = __shim;
        var S = __settings;
        var aeskey = __aeskey;

        SEA.decrypt = SEA.decrypt || (async (data, pair, cb, opt) => { try {
          opt = opt || {};
          var key = (pair||opt).epriv || pair;
          if(!key){
            if(!SEA.I){ throw 'No decryption key.' }
            pair = await SEA.I(null, {what: data, how: 'decrypt', why: opt.why});
            key = pair.epriv || pair;
          }
          var json = await S.parse(data);
          var buf, bufiv, bufct; try{
            buf = shim.Buffer.from(json.s, opt.encode || 'base64');
            bufiv = shim.Buffer.from(json.iv, opt.encode || 'base64');
            bufct = shim.Buffer.from(json.ct, opt.encode || 'base64');
            var ct = await aeskey(key, buf, opt).then((aes) => (/*shim.ossl ||*/ (shim.subtle)).decrypt({  // Keeping aesKey scope as private as possible...
              name: opt.name || 'AES-GCM', iv: new Uint8Array(bufiv), tagLength: 128
            }, aes, new Uint8Array(bufct)));
          }catch(e){
            if('utf8' === opt.encode){ throw "Could not decrypt" }
            if(SEA.opt.fallback){
              opt.encode = 'utf8';
              return await SEA.decrypt(data, pair, cb, opt);
            }
          }
          var r = await S.parse(new shim.TextDecoder('utf8').decode(ct));
          if(cb){ try{ cb(r) }catch(e){console.log(e)} }
          return r;
        } catch(e) { 
          console.log(e);
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
    var __shim = USE('./shim.js', 1);
    var __settings = USE('./settings.js', 1);

    let __defaultExport;
    (function(){

        var SEA = __root;
        var shim = __shim;
        var S = __settings;
        // Derive shared secret from other's pub and my epub/epriv 
        SEA.secret = SEA.secret || (async (key, pair, cb, opt) => { try {
          var b62 = SEA.base62;
          opt = opt || {};
          if(!pair || !pair.epriv || !pair.epub){
            if(!SEA.I){ throw 'No secret mix.' }
            pair = await SEA.I(null, {what: key, how: 'secret', why: opt.why});
          }
          var pub = key.epub || key;
          var epub = pair.epub;
          var epriv = pair.epriv;
          var ecdhSubtle = shim.ossl || shim.subtle;
          var pubKeyData = keysToEcdhJwk(pub);
          var props = Object.assign({ public: await ecdhSubtle.importKey(...pubKeyData, true, []) },{name: 'ECDH', namedCurve: 'P-256'}); // Thanks to @sirpy !
          var privKeyData = keysToEcdhJwk(epub, epriv);
          var derived = await ecdhSubtle.importKey(...privKeyData, false, ['deriveBits']).then(async (privKey) => {
            // privateKey scope doesn't leak out from here!
            var derivedBits = await ecdhSubtle.deriveBits(props, privKey, 256);
            var rawBits = new Uint8Array(derivedBits);
            var derivedKey = await ecdhSubtle.importKey('raw', rawBits,{ name: 'AES-GCM', length: 256 }, true, [ 'encrypt', 'decrypt' ]);
            return ecdhSubtle.exportKey('jwk', derivedKey).then(({ k }) => k);
          })
          var r = derived;
          if(cb){ try{ cb(r) }catch(e){console.log(e)} }
          return r;
        } catch(e) {
          console.log(e);
          SEA.err = e;
          if(SEA.throw){ throw e }
          if(cb){ cb() }
          return;
        }});

        // can this be replaced with settings.jwk?
        var keysToEcdhJwk = (pub, d) => { // d === epriv
          var b62 = SEA.base62;
          var xy = b62.pubToJwkXY(pub) // handles old (87) and new (88) format
          var x = xy.x, y = xy.y
          // Convert base62 epriv (44-char) back to base64url for WebCrypto JWK importKey
          var dJwk = d ? ((d.length === 44 && /^[A-Za-z0-9]{44}$/.test(d)) ? b62.b62ToB64(d) : d) : undefined
          var jwk = dJwk ? { d: dJwk } : {}
          return [  // Use with spread returned value...
            'jwk',
            Object.assign(
              jwk,
              { x: x, y: y, kty: 'EC', crv: 'P-256', ext: true }
            ), // ??? refactor
            {name: 'ECDH', namedCurve: 'P-256'}
          ]
        }

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
cnZlOiAnUC0yNTYnfSxcbiAgICAgIHNpZ246IHtuYW1lOiAnRUNEU0EnLCBoYXNoOiB7bmFtZTogJ1NIQS0yNTYnfX1cbiAgICB9O1xuICAgIHMuZWNkaCA9
IHtuYW1lOiAnRUNESCcsIG5hbWVkQ3VydmU6ICdQLTI1Nid9O1xuXG4gICAgLy8gVGhpcyBjcmVhdGVzIFdlYiBDcnlwdG9ncmFwaHkgQVBJIGNvbXBsaWFu
dCBKV0sgZm9yIHNpZ24vdmVyaWZ5IHB1cnBvc2VzXG4gICAgcy5qd2sgPSBmdW5jdGlvbihwdWIsIGQpeyAgLy8gZCA9PT0gcHJpdlxuICAgICAgdmFyIGI2
MiA9IFNFQS5iYXNlNjI7XG4gICAgICB2YXIgeHkgPSBiNjIucHViVG9Kd2tYWShwdWIpOyAvLyBoYW5kbGVzIG9sZCAoODctY2hhciB4LnkpIGFuZCBuZXcg
KDg4LWNoYXIgYmFzZTYyKVxuICAgICAgdmFyIHggPSB4eS54LCB5ID0geHkueTtcbiAgICAgIHZhciBqd2sgPSB7a3R5OiBcIkVDXCIsIGNydjogXCJQLTI1
NlwiLCB4OiB4LCB5OiB5LCBleHQ6IHRydWV9O1xuICAgICAgandrLmtleV9vcHMgPSBkID8gWydzaWduJ10gOiBbJ3ZlcmlmeSddO1xuICAgICAgLy8gQ29u
dmVydCBiYXNlNjIgcHJpdiAoNDQtY2hhcikgYmFjayB0byBiYXNlNjR1cmwgZm9yIFdlYkNyeXB0byBKV0sgaW1wb3J0S2V5XG4gICAgICBpZihkKXsgandr
LmQgPSAoZC5sZW5ndGggPT09IDQ0ICYmIC9eW0EtWmEtejAtOV17NDR9JC8udGVzdChkKSkgPyBiNjIuYjYyVG9CNjQoZCkgOiBkIH1cbiAgICAgIHJldHVy
biBqd2s7XG4gICAgfTtcblxuICAgIHMua2V5VG9Kd2sgPSBmdW5jdGlvbihrZXlCeXRlcykge1xuICAgICAgY29uc3Qga2V5QjY0ID0ga2V5Qnl0ZXMudG9T
dHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgY29uc3QgayA9IGtleUI2NC5yZXBsYWNlKC9cXCsvZywgJy0nKS5yZXBsYWNlKC9cXC8vZywgJ18nKS5yZXBsYWNl
KC9cXD0vZywgJycpO1xuICAgICAgcmV0dXJuIHsga3R5OiAnb2N0JywgazogaywgZXh0OiBmYWxzZSwgYWxnOiAnQTI1NkdDTScgfTtcbiAgICB9XG5cbiAg
ICBzLnJlY2FsbCA9IHtcbiAgICAgIHZhbGlkaXR5OiAxMiAqIDYwICogNjAsIC8vIGludGVybmFsbHkgaW4gc2Vjb25kcyA6IDEyIGhvdXJzXG4gICAgICBo
b29rOiBmdW5jdGlvbihwcm9wcyl7IHJldHVybiBwcm9wcyB9IC8vIHsgaWF0LCBleHAsIGFsaWFzLCByZW1lbWJlciB9IC8vIG9yIHJldHVybiBuZXcgUHJv
bWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiByZXNvbHZlKHByb3BzKVxuICAgIH07XG5cbiAgICBzLmNoZWNrID0gZnVuY3Rpb24odCl7IHJldHVybiAodHlw
ZW9mIHQgPT0gJ3N0cmluZycpICYmICgnU0VBeycgPT09IHQuc2xpY2UoMCw0KSkgfVxuICAgIHMucGFyc2UgPSBhc3luYyBmdW5jdGlvbiBwKHQpeyB0cnkg
e1xuICAgICAgdmFyIHllcyA9ICh0eXBlb2YgdCA9PSAnc3RyaW5nJyk7XG4gICAgICBpZih5ZXMgJiYgJ1NFQXsnID09PSB0LnNsaWNlKDAsNCkpeyB0ID0g
dC5zbGljZSgzKSB9XG4gICAgICByZXR1cm4geWVzID8gYXdhaXQgc2hpbS5wYXJzZSh0KSA6IHQ7XG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgcmV0
dXJuIHQ7XG4gICAgfVxuXG4gICAgU0VBLm9wdCA9IHM7XG4gICAgX19kZWZhdWx0RXhwb3J0ID0gc1xuICBcbn0oKSk7XG5leHBvcnQgZGVmYXVsdCBfX2Rl
ZmF1bHRFeHBvcnQ7XG4iLCJzZWEvc2hhMjU2LmpzIjoiaW1wb3J0IF9fc2hpbSBmcm9tICcuL3NoaW0uanMnO1xuXG5sZXQgX19kZWZhdWx0RXhwb3J0O1xu
KGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgc2hpbSA9IF9fc2hpbTtcbiAgICBfX2RlZmF1bHRFeHBvcnQgPSBhc3luYyBmdW5jdGlvbihkLCBvKXtcbiAgICAg
IHZhciB0ID0gKHR5cGVvZiBkID09ICdzdHJpbmcnKT8gZCA6IGF3YWl0IHNoaW0uc3RyaW5naWZ5KGQpO1xuICAgICAgdmFyIGhhc2ggPSBhd2FpdCBzaGlt
LnN1YnRsZS5kaWdlc3Qoe25hbWU6IG98fCdTSEEtMjU2J30sIG5ldyBzaGltLlRleHRFbmNvZGVyKCkuZW5jb2RlKHQpKTtcbiAgICAgIHJldHVybiBzaGlt
LkJ1ZmZlci5mcm9tKGhhc2gpO1xuICAgIH1cbiAgXG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgX19kZWZhdWx0RXhwb3J0OyIsInNlYS9zaGExLmpzIjoiaW1w
b3J0IF9fc2hpbV8yIGZyb20gJy4vc2hpbS5qcyc7XG5cbmxldCBfX2RlZmF1bHRFeHBvcnQ7XG4oZnVuY3Rpb24oKXtcblxuICAgIC8vIFRoaXMgaW50ZXJu
YWwgZnVuYyByZXR1cm5zIFNIQS0xIGhhc2hlZCBkYXRhIGZvciBLZXlJRCBnZW5lcmF0aW9uXG4gICAgY29uc3QgX19zaGltID0gX19zaGltXzJcbiAgICBj
b25zdCBzdWJ0bGUgPSBfX3NoaW0uc3VidGxlXG4gICAgY29uc3Qgb3NzbCA9IF9fc2hpbS5vc3NsID8gX19zaGltLm9zc2wgOiBzdWJ0bGVcbiAgICBjb25z
dCBzaGExaGFzaCA9IChiKSA9PiBvc3NsLmRpZ2VzdCh7bmFtZTogJ1NIQS0xJ30sIG5ldyBBcnJheUJ1ZmZlcihiKSlcbiAgICBfX2RlZmF1bHRFeHBvcnQg
PSBzaGExaGFzaFxuICBcbn0oKSk7XG5leHBvcnQgZGVmYXVsdCBfX2RlZmF1bHRFeHBvcnQ7Iiwic2VhL3dvcmsuanMiOiJpbXBvcnQgX19yb290IGZyb20g
Jy4vcm9vdC5qcyc7XG5pbXBvcnQgX19zaGltIGZyb20gJy4vc2hpbS5qcyc7XG5pbXBvcnQgX19zZXR0aW5ncyBmcm9tICcuL3NldHRpbmdzLmpzJztcbmlt
cG9ydCBfX3NoYTI1NiBmcm9tICcuL3NoYTI1Ni5qcyc7XG5cbmxldCBfX2RlZmF1bHRFeHBvcnQ7XG4oZnVuY3Rpb24oKXtcblxuICAgIHZhciBTRUEgPSBf
X3Jvb3Q7XG4gICAgdmFyIHNoaW0gPSBfX3NoaW07XG4gICAgdmFyIFMgPSBfX3NldHRpbmdzO1xuICAgIHZhciBzaGEgPSBfX3NoYTI1NjtcbiAgICB2YXIg
dTtcblxuICAgIFNFQS53b3JrID0gU0VBLndvcmsgfHwgKGFzeW5jIChkYXRhLCBwYWlyLCBjYiwgb3B0KSA9PiB7IHRyeSB7IC8vIHVzZWQgdG8gYmUgbmFt
ZWQgYHByb29mYFxuICAgICAgdmFyIHNhbHQgPSAocGFpcnx8e30pLmVwdWIgfHwgcGFpcjsgLy8gZXB1YiBub3QgcmVjb21tZW5kZWQsIHNhbHQgc2hvdWxk
IGJlIHJhbmRvbSFcbiAgICAgIG9wdCA9IG9wdCB8fCB7fTtcbiAgICAgIHZhciBlbmMgPSBvcHQuZW5jb2RlIHx8ICdiYXNlNjInO1xuICAgICAgdmFyIGI2
MiA9IFNFQS5iYXNlNjI7XG4gICAgICBpZihzYWx0IGluc3RhbmNlb2YgRnVuY3Rpb24pe1xuICAgICAgICBjYiA9IHNhbHQ7XG4gICAgICAgIHNhbHQgPSB1
O1xuICAgICAgfVxuICAgICAgLy8gQ2hlY2sgaWYgZGF0YSBpcyBhbiBBcnJheUJ1ZmZlciwgaWYgc28gdXNlIFVpbnQ4QXJyYXkgdG8gYWNjZXNzIHRoZSBk
YXRhXG4gICAgICBpZihkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpe1xuICAgICAgICBkYXRhID0gbmV3IFVpbnQ4QXJyYXkoZGF0YSk7XG4gICAgICAg
IGRhdGEgPSBuZXcgc2hpbS5UZXh0RGVjb2RlcihcInV0Zi04XCIpLmRlY29kZShkYXRhKTtcbiAgICAgIH1cbiAgICAgIGRhdGEgPSAodHlwZW9mIGRhdGEg
PT0gJ3N0cmluZycpID8gZGF0YSA6IGF3YWl0IHNoaW0uc3RyaW5naWZ5KGRhdGEpO1xuICAgICAgaWYoJ3NoYScgPT09IChvcHQubmFtZXx8JycpLnRvTG93
ZXJDYXNlKCkuc2xpY2UoMCwzKSl7XG4gICAgICAgIHZhciByc2hhID0gc2hpbS5CdWZmZXIuZnJvbShhd2FpdCBzaGEoZGF0YSwgb3B0Lm5hbWUpLCAnYmlu
YXJ5Jyk7XG4gICAgICAgIHJzaGEgPSAoJ2Jhc2U2MicgPT09IGVuYykgPyBiNjIuYnVmVG9CNjIocnNoYSkgOiAoJ2Jhc2U2NCcgPT09IGVuYykgPyBidG9h
KFN0cmluZy5mcm9tQ2hhckNvZGUoLi4ubmV3IFVpbnQ4QXJyYXkocnNoYSkpKSA6IHJzaGEudG9TdHJpbmcoZW5jKTtcbiAgICAgICAgaWYoY2IpeyB0cnl7
IGNiKHJzaGEpIH1jYXRjaChlKXtjb25zb2xlLmxvZyhlKX0gfVxuICAgICAgICByZXR1cm4gcnNoYTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2Ygc2Fs
dCA9PT0gXCJudW1iZXJcIikgc2FsdCA9IHNhbHQudG9TdHJpbmcoKTtcbiAgICAgIGlmICh0eXBlb2Ygb3B0LnNhbHQgPT09IFwibnVtYmVyXCIpIG9wdC5z
YWx0ID0gb3B0LnNhbHQudG9TdHJpbmcoKTtcbiAgICAgIHNhbHQgPSBzYWx0IHx8IHNoaW0ucmFuZG9tKDkpO1xuICAgICAgdmFyIGtleSA9IGF3YWl0IChz
aGltLm9zc2wgfHwgc2hpbS5zdWJ0bGUpLmltcG9ydEtleSgncmF3JywgbmV3IHNoaW0uVGV4dEVuY29kZXIoKS5lbmNvZGUoZGF0YSksIHtuYW1lOiBvcHQu
bmFtZSB8fCAnUEJLREYyJ30sIGZhbHNlLCBbJ2Rlcml2ZUJpdHMnXSk7XG4gICAgICB2YXIgd29yayA9IGF3YWl0IChzaGltLm9zc2wgfHwgc2hpbS5zdWJ0
bGUpLmRlcml2ZUJpdHMoe1xuICAgICAgICBuYW1lOiBvcHQubmFtZSB8fCAnUEJLREYyJyxcbiAgICAgICAgaXRlcmF0aW9uczogb3B0Lml0ZXJhdGlvbnMg
fHwgUy5wYmtkZjIuaXRlcixcbiAgICAgICAgc2FsdDogbmV3IHNoaW0uVGV4dEVuY29kZXIoKS5lbmNvZGUob3B0LnNhbHQgfHwgc2FsdCksXG4gICAgICAg
IGhhc2g6IG9wdC5oYXNoIHx8IFMucGJrZGYyLmhhc2gsXG4gICAgICB9LCBrZXksIG9wdC5sZW5ndGggfHwgKFMucGJrZGYyLmtzICogOCkpXG4gICAgICBk
YXRhID0gc2hpbS5yYW5kb20oZGF0YS5sZW5ndGgpICAvLyBFcmFzZSBkYXRhIGluIGNhc2Ugb2YgcGFzc3BocmFzZVxuICAgICAgdmFyIHIgPSBzaGltLkJ1
ZmZlci5mcm9tKHdvcmssICdiaW5hcnknKTtcbiAgICAgIHIgPSAoJ2Jhc2U2MicgPT09IGVuYykgPyBiNjIuYnVmVG9CNjIocikgOiAoJ2Jhc2U2NCcgPT09
IGVuYykgPyBidG9hKFN0cmluZy5mcm9tQ2hhckNvZGUoLi4ubmV3IFVpbnQ4QXJyYXkocikpKSA6IHIudG9TdHJpbmcoZW5jKTtcbiAgICAgIGlmKGNiKXsg
dHJ5eyBjYihyKSB9Y2F0Y2goZSl7Y29uc29sZS5sb2coZSl9IH1cbiAgICAgIHJldHVybiByO1xuICAgIH0gY2F0Y2goZSkgeyBcbiAgICAgIGNvbnNvbGUu
bG9nKGUpO1xuICAgICAgU0VBLmVyciA9IGU7XG4gICAgICBpZihTRUEudGhyb3cpeyB0aHJvdyBlIH1cbiAgICAgIGlmKGNiKXsgY2IoKSB9XG4gICAgICBy
ZXR1cm47XG4gICAgfX0pO1xuXG4gICAgX19kZWZhdWx0RXhwb3J0ID0gU0VBLndvcms7XG4gIFxufSgpKTtcbmV4cG9ydCBkZWZhdWx0IF9fZGVmYXVsdEV4
cG9ydDtcbiIsInNlYS9wYWlyLmpzIjoiaW1wb3J0IF9fcm9vdCBmcm9tICcuL3Jvb3QuanMnO1xuaW1wb3J0IF9fc2hpbSBmcm9tICcuL3NoaW0uanMnO1xu
XG5sZXQgX19kZWZhdWx0RXhwb3J0O1xuKGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgU0VBID0gX19yb290O1xuICAgIHZhciBzaGltID0gX19zaGltO1xuXG4g
ICAgLy8gUC0yNTYgY3VydmUgY29uc3RhbnRzXG4gICAgY29uc3QgbiA9IEJpZ0ludChcIjB4ZmZmZmZmZmYwMDAwMDAwMGZmZmZmZmZmZmZmZmZmZmZiY2U2
ZmFhZGE3MTc5ZTg0ZjNiOWNhYzJmYzYzMjU1MVwiKTtcbiAgICBjb25zdCBQID0gQmlnSW50KFwiMHhmZmZmZmZmZjAwMDAwMDAxMDAwMDAwMDAwMDAwMDAw
MDAwMDAwMDAwZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmXCIpO1xuICAgIGNvbnN0IEEgPSBCaWdJbnQoXCIweGZmZmZmZmZmMDAwMDAwMDEwMDAwMDAwMDAw
MDAwMDAwMDAwMDAwMDBmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmNcIik7XG4gICAgY29uc3QgQiA9IEJpZ0ludChcIjB4NWFjNjM1ZDhhYTNhOTNlN2IzZWJi
ZDU1NzY5ODg2YmM2NTFkMDZiMGNjNTNiMGY2M2JjZTNjM2UyN2QyNjA0YlwiKTsgLy8gQ3VydmUgY29lZmZpY2llbnQgYlxuICAgIGNvbnN0IEcgPSB7XG4g
ICAgICB4OiBCaWdJbnQoXCIweDZiMTdkMWYyZTEyYzQyNDdmOGJjZTZlNTYzYTQ0MGYyNzcwMzdkODEyZGViMzNhMGY0YTEzOTQ1ZDg5OGMyOTZcIiksXG4g
ICAgICB5OiBCaWdJbnQoXCIweDRmZTM0MmUyZmUxYTdmOWI4ZWU3ZWI0YTdjMGY5ZTE2MmJjZTMzNTc2YjMxNWVjZWNiYjY0MDY4MzdiZjUxZjVcIilcbiAg
ICB9O1xuXG4gICAgLy8gQ29yZSBFQ0MgZnVuY3Rpb25zXG4gICAgZnVuY3Rpb24gbW9kKGEsIG0pIHsgcmV0dXJuICgoYSAlIG0pICsgbSkgJSBtOyB9XG5c
biAgICAvLyBNb2R1bGFyIGludmVyc2UgdXNpbmcgRmVybWF0J3MgTGl0dGxlIFRoZW9yZW0gKHAgaXMgcHJpbWUpXG4gICAgLy8gV0FSTklORzogbW9kUG93
IG11c3QgYmUgY29uc3RhbnQtdGltZSB0byBwcmV2ZW50IHRpbWluZyBhdHRhY2tzIG9uIHNlY3JldCBrZXlzXG4gICAgZnVuY3Rpb24gbW9kSW52KGEsIHAp
IHtcbiAgICAgICAgLy8gYV4ocC0yKSBtb2QgcFxuICAgICAgICByZXR1cm4gbW9kUG93KGEsIHAgLSBCaWdJbnQoMiksIHApO1xuICAgIH1cblxuICAgIC8v
IENvbnN0YW50LXRpbWUgbW9kdWxhciBleHBvbmVudGlhdGlvbiB1c2luZyBiaW5hcnkgZXhwb25lbnRpYXRpb25cbiAgICAvLyBBbHdheXMgcGVyZm9ybXMg
YWxsIGl0ZXJhdGlvbnMgdG8gcHJldmVudCB0aW1pbmcgYXR0YWNrc1xuICAgIC8vIFVzZXMgY29uZGl0aW9uYWwgYXNzaWdubWVudCBpbnN0ZWFkIG9mIGJy
YW5jaGVzXG4gICAgZnVuY3Rpb24gbW9kUG93KGJhc2UsIGV4cG9uZW50LCBtb2R1bHVzKSB7XG4gICAgICAgIGlmIChtb2R1bHVzID09PSBCaWdJbnQoMSkp
IHJldHVybiBCaWdJbnQoMCk7XG4gICAgICAgIGJhc2UgPSBtb2QoYmFzZSwgbW9kdWx1cyk7XG4gICAgICAgIGxldCByZXN1bHQgPSBCaWdJbnQoMSk7XG4g
ICAgICAgIGxldCBleHAgPSBleHBvbmVudDtcblxuICAgICAgICAvLyBQcm9jZXNzIGFsbCBiaXRzIHdpdGggY29uc3RhbnQgZXhlY3V0aW9uIHRpbWVcbiAg
ICAgICAgd2hpbGUgKGV4cCA+IEJpZ0ludCgwKSkge1xuICAgICAgICAgICAgY29uc3QgYml0ID0gZXhwICYgQmlnSW50KDEpO1xuICAgICAgICAgICAgLy8g
QWx3YXlzIHBlcmZvcm0gbXVsdGlwbGljYXRpb25cbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBtb2QocmVzdWx0ICogYmFzZSwgbW9kdWx1cyk7XG4gICAg
ICAgICAgICAvLyBDb25zdGFudC10aW1lIGNvbmRpdGlvbmFsIGFzc2lnbm1lbnQgKG5vIGJyYW5jaCBwcmVkaWN0aW9uIGxlYWspXG4gICAgICAgICAgICBy
ZXN1bHQgPSBiaXQgPyB0ZW1wIDogcmVzdWx0O1xuICAgICAgICAgICAgZXhwID4+PSBCaWdJbnQoMSk7XG4gICAgICAgICAgICBiYXNlID0gbW9kKGJhc2Ug
KiBiYXNlLCBtb2R1bHVzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8vIFZlcmlmeSBhIHBvaW50IGlzIG9u
IHRoZSBjdXJ2ZVxuICAgIGZ1bmN0aW9uIGlzT25DdXJ2ZShwb2ludCkge1xuICAgICAgICBpZiAoIXBvaW50KSByZXR1cm4gZmFsc2U7XG4gICAgICAgIC8v
IHnCsiA9IHjCsyArIGF4ICsgYiAobW9kIHApXG4gICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gcG9pbnQ7XG4gICAgICAgIGNvbnN0IGxlZnQgPSBtb2QoeSAq
IHksIFApO1xuICAgICAgICBjb25zdCByaWdodCA9IG1vZChtb2QobW9kKHggKiB4LCBQKSAqIHgsIFApICsgbW9kKEEgKiB4LCBQKSArIEIsIFApO1xuICAg
ICAgICByZXR1cm4gbGVmdCA9PT0gcmlnaHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcG9pbnRBZGQocDEsIHAyKSB7XG4gICAgICBpZiAocDEgPT09IG51
bGwpIHJldHVybiBwMjsgaWYgKHAyID09PSBudWxsKSByZXR1cm4gcDE7XG4gICAgICBpZiAocDEueCA9PT0gcDIueCAmJiBtb2QocDEueSArIHAyLnksIFAp
ID09PSAwbikgcmV0dXJuIG51bGw7XG4gICAgICBsZXQgbGFtYmRhID0gcDEueCA9PT0gcDIueCAmJiBwMS55ID09PSBwMi55XG4gICAgICAgID8gbW9kKCgz
biAqIG1vZChwMS54ICoqIDJuLCBQKSArIEEpICogbW9kSW52KDJuICogcDEueSwgUCksIFApXG4gICAgICAgIDogbW9kKChtb2QocDIueSAtIHAxLnksIFAp
KSAqIG1vZEludihtb2QocDIueCAtIHAxLngsIFApLCBQKSwgUCk7XG4gICAgICBjb25zdCB4MyA9IG1vZChsYW1iZGEgKiogMm4gLSBwMS54IC0gcDIueCwg
UCk7XG4gICAgICByZXR1cm4geyB4OiB4MywgeTogbW9kKGxhbWJkYSAqIG1vZChwMS54IC0geDMsIFApIC0gcDEueSwgUCkgfTtcbiAgICB9XG5cbiAgICBm
dW5jdGlvbiBwb2ludE11bHQoaywgcG9pbnQpIHtcbiAgICAgIC8vIEZpeGVkLXdpbmRvdyBzY2FsYXIgbXVsdGlwbGljYXRpb24gdG8gcmVkdWNlIHRpbWlu
ZyB2YXJpYW5jZVxuICAgICAgbGV0IHIgPSBudWxsLCBhID0gcG9pbnQ7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI1NjsgaSsrKSB7XG4gICAgICAg
IGNvbnN0IGJpdCA9IChrID4+IEJpZ0ludChpKSkgJiAxbjtcbiAgICAgICAgY29uc3QgdGVtcCA9IHBvaW50QWRkKHIsIGEpO1xuICAgICAgICByID0gYml0
ID8gdGVtcCA6IHI7XG4gICAgICAgIGEgPSBwb2ludEFkZChhLCBhKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIFNFQS5wYWly
ID0gU0VBLnBhaXIgfHwgKGFzeW5jIChjYiwgb3B0KSA9PiB7IHRyeSB7XG4gICAgICB2YXIgYjYyID0gU0VBLmJhc2U2MjtcbiAgICAgIG9wdCA9IG9wdCB8
fCB7fTtcbiAgICAgIGNvbnN0IHN1YnRsZSA9IHNoaW0uc3VidGxlLCBlY2RoU3VidGxlID0gc2hpbS5vc3NsIHx8IHN1YnRsZTtcbiAgICAgIGxldCByID0g
e307XG5cbiAgICAgIC8vIEhlbHBlciBmdW5jdGlvbnNcbiAgICAgIGNvbnN0IGI2NFRvQkkgPSBzID0+IHtcbiAgICAgICAgLy8gVmFsaWRhdGUgYmFzZTY0
IGlucHV0IGZvcm1hdFxuICAgICAgICBpZiAodHlwZW9mIHMgIT09ICdzdHJpbmcnIHx8IHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3
IEVycm9yKFwiSW52YWxpZCBiYXNlNjQgaW5wdXQ6IG11c3QgYmUgbm9uLWVtcHR5IHN0cmluZ1wiKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTdGFuZGFy
ZCBiYXNlNjR1cmwgdmFsaWRhdGlvblxuICAgICAgICBpZiAoIS9eW0EtWmEtejAtOV8tXSo9ezAsMn0kLy50ZXN0KHMpKSB7XG4gICAgICAgICAgdGhyb3cg
bmV3IEVycm9yKFwiSW52YWxpZCBiYXNlNjQgY2hhcmFjdGVycyBkZXRlY3RlZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAg
Y29uc3QgaGV4ID0gc2hpbS5CdWZmZXIuZnJvbShhdG9iKHMpLCAnYmluYXJ5JykudG9TdHJpbmcoJ2hleCcpO1xuXG4gICAgICAgICAgLy8gVmFsaWRhdGUg
cmVzdWx0IGlzIHdpdGhpbiBQLTI1NiByYW5nZSAoMjU2IGJpdHMgLyA2NCBoZXggY2hhcnMpXG4gICAgICAgICAgaWYgKGhleC5sZW5ndGggPiA2NCkge1xu
ICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVjb2RlZCB2YWx1ZSBleGNlZWRzIDI1NiBiaXRzIGZvciBQLTI1NlwiKTtcbiAgICAgICAgICB9XG5c
biAgICAgICAgICBjb25zdCB2YWx1ZSA9IEJpZ0ludCgnMHgnICsgaGV4KTtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0gY2F0Y2ggKGUp
IHtcbiAgICAgICAgICBpZiAoZS5tZXNzYWdlLmluY2x1ZGVzKFwiMjU2IGJpdHNcIikpIHRocm93IGU7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwi
SW52YWxpZCBiYXNlNjQgZGVjb2Rpbmc6IFwiICsgZS5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIC8vIHByaXZUb0JJOiBwYXJzZSBw
cml2L2Vwcml2IGFjY2VwdGluZyBib3RoIG9sZCA0My1jaGFyIGJhc2U2NHVybCBhbmQgbmV3IDQ0LWNoYXIgYmFzZTYyXG4gICAgICBjb25zdCBwcml2VG9C
SSA9IHMgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHMgPT09ICdzdHJpbmcnICYmIHMubGVuZ3RoID09PSA0NCAmJiAvXltBLVphLXowLTldezQ0fSQvLnRl
c3QocykpIHtcbiAgICAgICAgICByZXR1cm4gYjYyLmI2MlRvQkkocyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGI2NFRvQkkocyk7IC8vIGJhY2t3
YXJkIGNvbXBhdDogb2xkIGJhc2U2NHVybCA0My1jaGFyXG4gICAgICB9O1xuICAgICAgY29uc3QgYmlUb0I2NCA9IG4gPT4ge1xuICAgICAgICAvLyBWYWxp
ZGF0ZSBpbnB1dCBpcyB3aXRoaW4gdmFsaWQgcmFuZ2UgZm9yIFAtMjU2ICgyNTYgYml0cyBtYXgpXG4gICAgICAgIGNvbnN0IG1heDI1NmJpdCA9IEJpZ0lu
dChcIjB4ZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZlwiKTtcbiAgICAgICAgaWYgKG4g
PCAwbiB8fCBuID4gbWF4MjU2Yml0KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBCaWdJbnQ6IG11c3QgYmUgMCA8PSBuIDw9IDJe
MjU2LTFcIik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaGV4ID0gbi50b1N0cmluZygxNikucGFkU3RhcnQoNjQsICcwJyk7XG4gICAgICAgIGlmICho
ZXgubGVuZ3RoID4gNjQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCaWdJbnQgdG9vIGxhcmdlIGZvciBQLTI1NjogZXhjZWVkcyAyNTYgYml0
c1wiKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBiNjQgPSBzaGltLkJ1ZmZlci5mcm9tKGhleCwgJ2hleCcpLnRvU3RyaW5nKCdiYXNlNjQnKVxuICAg
ICAgICAgIC5yZXBsYWNlKC9cXCsvZywgJy0nKS5yZXBsYWNlKC9cXC8vZywgJ18nKS5yZXBsYWNlKC89L2csICcnKTtcbiAgICAgICAgcmV0dXJuIGI2NDtc
biAgICAgIH07XG4gICAgICBjb25zdCBlbnN1cmVQcml2UmFuZ2UgPSAocHJpdiwgbmFtZSkgPT4ge1xuICAgICAgICBpZiAocHJpdiA8PSAwbiB8fCBwcml2
ID49IG4pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKG5hbWUgfHwgJ1ByaXZhdGUga2V5JykgKyBcIiBvdXQgb2YgcmFuZ2VcIik7XG4gICAgICAg
IH1cbiAgICAgICAgcmV0dXJuIHByaXY7XG4gICAgICB9O1xuICAgICAgY29uc3QgcHViRnJvbVByaXYgPSBwcml2ID0+IHtcbiAgICAgICAgZW5zdXJlUHJp
dlJhbmdlKHByaXYsICdQcml2YXRlIGtleScpO1xuICAgICAgICBjb25zdCBwdWIgPSBwb2ludE11bHQocHJpdiwgRyk7XG4gICAgICAgIGlmICghaXNPbkN1
cnZlKHB1YikpIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgcG9pbnQgZ2VuZXJhdGVkXCIpO1xuICAgICAgICByZXR1cm4gYjYyLmJpVG9CNjIocHViLngp
ICsgYjYyLmJpVG9CNjIocHViLnkpO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHBhcnNlUHViID0gcHViU3RyID0+IHtcbiAgICAgICAgaWYgKCFwdWJTdHIg
fHwgdHlwZW9mIHB1YlN0ciAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHB1YiBmb3JtYXQ6IG11c3QgYmUg
c3RyaW5nXCIpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHh5ID0gYjYyLnB1YlRvSndrWFkocHViU3RyKTsgLy8gaGFuZGxlcyBib3RoIG9sZCAoODcp
IGFuZCBuZXcgKDg4KSBmb3JtYXRcbiAgICAgICAgY29uc3QgcG9pbnQgPSB7IHg6IGI2NFRvQkkoeHkueCksIHk6IGI2NFRvQkkoeHkueSkgfTtcbiAgICAg
ICAgaWYgKHBvaW50LnggPj0gUCB8fCBwb2ludC55ID49IFApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHB1YmxpYyBrZXk6IG91
dCBvZiByYW5nZVwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzT25DdXJ2ZShwb2ludCkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJ
bnZhbGlkIHB1YmxpYyBrZXk6IG5vdCBvbiBjdXJ2ZVwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcG9pbnQ7XG4gICAgICB9O1xuICAgICAgY29u
c3QgcG9pbnRUb1B1YiA9IHBvaW50ID0+IHtcbiAgICAgICAgaWYgKCFwb2ludCB8fCAhaXNPbkN1cnZlKHBvaW50KSkge1xuICAgICAgICAgIHRocm93IG5l
dyBFcnJvcihcIkludmFsaWQgcG9pbnQ6IG5vdCBvbiBjdXJ2ZVwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYjYyLmJpVG9CNjIocG9pbnQueCkg
KyBiNjIuYmlUb0I2Mihwb2ludC55KTtcbiAgICAgIH07XG4gICAgICBjb25zdCBzZWVkVG9CdWZmZXIgPSBzZWVkID0+IHtcbiAgICAgICAgY29uc3QgZW5j
ID0gbmV3IHNoaW0uVGV4dEVuY29kZXIoKTtcbiAgICAgICAgaWYgKHR5cGVvZiBzZWVkID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHJldHVybiBlbmMu
ZW5jb2RlKHNlZWQpLmJ1ZmZlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VlZCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgcmV0
dXJuIHNlZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlZWQgJiYgc2VlZC5ieXRlTGVuZ3RoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXR1
cm4gc2VlZC5idWZmZXIgfHwgc2VlZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH07XG4gICAgICBjb25zdCBzZWVkVG9LZXkg
PSBhc3luYyAoc2VlZCwgc2FsdCkgPT4ge1xuICAgICAgICBjb25zdCBlbmMgPSBuZXcgc2hpbS5UZXh0RW5jb2RlcigpO1xuICAgICAgICBjb25zdCBidWYg
PSBzZWVkVG9CdWZmZXIoc2VlZCk7XG4gICAgICAgIGlmICghYnVmKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHNlZWRcIik7XG4gICAgICAgIGNvbnN0
IGNvbWJpbmVkID0gbmV3IFVpbnQ4QXJyYXkoYnVmLmJ5dGVMZW5ndGggKyBlbmMuZW5jb2RlKHNhbHQpLmJ1ZmZlci5ieXRlTGVuZ3RoKTtcbiAgICAgICAg
Y29tYmluZWQuc2V0KG5ldyBVaW50OEFycmF5KGJ1ZiksIDApO1xuICAgICAgICBjb21iaW5lZC5zZXQobmV3IFVpbnQ4QXJyYXkoZW5jLmVuY29kZShzYWx0
KS5idWZmZXIpLCBidWYuYnl0ZUxlbmd0aCk7XG4gICAgICAgIGNvbnN0IGhhc2ggPSBhd2FpdCBzdWJ0bGUuZGlnZXN0KFwiU0hBLTI1NlwiLCBjb21iaW5l
ZC5idWZmZXIpO1xuXG4gICAgICAgIC8vIFVzZSByZWplY3RlZCByZXNhbXBsaW5nIGZvciB1bmlmb3JtIGRpc3RyaWJ1dGlvblxuICAgICAgICAvLyBLZWVw
IGhhc2hpbmcgdW50aWwgd2UgZ2V0IGEgdmFsaWQgcHJpdmF0ZSBrZXkgaW4gcmFuZ2UgWzEsIG4pXG4gICAgICAgIGxldCBoYXNoRGF0YSA9IGhhc2g7XG4g
ICAgICAgIGxldCBhdHRlbXB0Q291bnQgPSAwO1xuICAgICAgICBjb25zdCBtYXhBdHRlbXB0cyA9IDEwMDsgLy8gUHJldmVudCBpbmZpbml0ZSBsb29wc1xu
XG4gICAgICAgIHdoaWxlIChhdHRlbXB0Q291bnQgPCBtYXhBdHRlbXB0cykge1xuICAgICAgICAgIGxldCBwcml2ID0gQmlnSW50KFwiMHhcIiArIEFycmF5
LmZyb20obmV3IFVpbnQ4QXJyYXkoaGFzaERhdGEpKVxuICAgICAgICAgICAgLm1hcChiID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsIFwiMFwiKSku
am9pbihcIlwiKSk7XG5cbiAgICAgICAgICAvLyBDaGVjayBpZiBwcml2IGlzIGluIHZhbGlkIHJhbmdlIFsxLCBuKVxuICAgICAgICAgIGlmIChwcml2ID4g
MG4gJiYgcHJpdiA8IG4pIHtcbiAgICAgICAgICAgIHJldHVybiBwcml2O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFJlc2FtcGxlIGJ5IGhhc2hp
bmcgdGhlIHByZXZpb3VzIHJlc3VsdCB3aXRoIGNvdW50ZXJcbiAgICAgICAgICBjb25zdCBjb3VudGVyQnVmID0gbmV3IFVpbnQ4QXJyYXkoNCk7XG4gICAg
ICAgICAgbmV3IERhdGFWaWV3KGNvdW50ZXJCdWYuYnVmZmVyKS5zZXRVaW50MzIoMCwgYXR0ZW1wdENvdW50LCB0cnVlKTtcbiAgICAgICAgICBjb25zdCBj
b21iaW5lZDIgPSBuZXcgVWludDhBcnJheShoYXNoRGF0YS5ieXRlTGVuZ3RoICsgY291bnRlckJ1Zi5ieXRlTGVuZ3RoKTtcbiAgICAgICAgICBjb21iaW5l
ZDIuc2V0KG5ldyBVaW50OEFycmF5KGhhc2hEYXRhKSwgMCk7XG4gICAgICAgICAgY29tYmluZWQyLnNldChjb3VudGVyQnVmLCBoYXNoRGF0YS5ieXRlTGVu
Z3RoKTtcbiAgICAgICAgICBoYXNoRGF0YSA9IGF3YWl0IHN1YnRsZS5kaWdlc3QoXCJTSEEtMjU2XCIsIGNvbWJpbmVkMi5idWZmZXIpO1xuICAgICAgICAg
IGF0dGVtcHRDb3VudCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGdlbmVyYXRlIHZhbGlkIHByaXZhdGUg
a2V5IGFmdGVyIFwiICsgbWF4QXR0ZW1wdHMgKyBcIiBhdHRlbXB0c1wiKTtcbiAgICAgIH07XG4gICAgICBjb25zdCBoYXNoVG9TY2FsYXIgPSBhc3luYyAo
c2VlZCwgbGFiZWwsIGNvdW50ZXIpID0+IHtcbiAgICAgICAgY29uc3QgZW5jID0gbmV3IHNoaW0uVGV4dEVuY29kZXIoKTtcbiAgICAgICAgY29uc3QgYnVm
ID0gc2VlZFRvQnVmZmVyKHNlZWQpO1xuICAgICAgICBpZiAoIWJ1ZikgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBzZWVkXCIpO1xuICAgICAgICBjb25z
dCBsYWJlbFN0ciA9IGNvdW50ZXIgIT09IHVuZGVmaW5lZCAmJiBjb3VudGVyICE9PSBudWxsID8gbGFiZWwgKyBjb3VudGVyIDogbGFiZWw7XG4gICAgICAg
IGNvbnN0IGxhYmVsQnVmID0gZW5jLmVuY29kZShsYWJlbFN0cikuYnVmZmVyO1xuICAgICAgICBjb25zdCBjb21iaW5lZCA9IG5ldyBVaW50OEFycmF5KGJ1
Zi5ieXRlTGVuZ3RoICsgbGFiZWxCdWYuYnl0ZUxlbmd0aCk7XG4gICAgICAgIGNvbWJpbmVkLnNldChuZXcgVWludDhBcnJheShsYWJlbEJ1ZiksIDApO1xu
ICAgICAgICBjb21iaW5lZC5zZXQobmV3IFVpbnQ4QXJyYXkoYnVmKSwgbGFiZWxCdWYuYnl0ZUxlbmd0aCk7XG4gICAgICAgIGNvbnN0IGhhc2ggPSBhd2Fp
dCBzdWJ0bGUuZGlnZXN0KFwiU0hBLTI1NlwiLCBjb21iaW5lZC5idWZmZXIpO1xuXG4gICAgICAgIGxldCBoYXNoRGF0YSA9IGhhc2g7XG4gICAgICAgIGxl
dCBhdHRlbXB0Q291bnQgPSAwO1xuICAgICAgICBjb25zdCBtYXhBdHRlbXB0cyA9IDEwMDtcbiAgICAgICAgd2hpbGUgKGF0dGVtcHRDb3VudCA8IG1heEF0
dGVtcHRzKSB7XG4gICAgICAgICAgY29uc3Qgc2NhbGFyID0gQmlnSW50KFwiMHhcIiArIEFycmF5LmZyb20obmV3IFVpbnQ4QXJyYXkoaGFzaERhdGEpKVxu
ICAgICAgICAgICAgLm1hcChiID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsIFwiMFwiKSkuam9pbihcIlwiKSk7XG4gICAgICAgICAgaWYgKHNjYWxh
ciA+IDBuICYmIHNjYWxhciA8IG4pIHtcbiAgICAgICAgICAgIHJldHVybiBzY2FsYXI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGNvdW50ZXJC
dWYgPSBuZXcgVWludDhBcnJheSg0KTtcbiAgICAgICAgICBuZXcgRGF0YVZpZXcoY291bnRlckJ1Zi5idWZmZXIpLnNldFVpbnQzMigwLCBhdHRlbXB0Q291
bnQsIHRydWUpO1xuICAgICAgICAgIGNvbnN0IGNvbWJpbmVkMiA9IG5ldyBVaW50OEFycmF5KGhhc2hEYXRhLmJ5dGVMZW5ndGggKyBjb3VudGVyQnVmLmJ5
dGVMZW5ndGgpO1xuICAgICAgICAgIGNvbWJpbmVkMi5zZXQobmV3IFVpbnQ4QXJyYXkoaGFzaERhdGEpLCAwKTtcbiAgICAgICAgICBjb21iaW5lZDIuc2V0
KGNvdW50ZXJCdWYsIGhhc2hEYXRhLmJ5dGVMZW5ndGgpO1xuICAgICAgICAgIGhhc2hEYXRhID0gYXdhaXQgc3VidGxlLmRpZ2VzdChcIlNIQS0yNTZcIiwg
Y29tYmluZWQyLmJ1ZmZlcik7XG4gICAgICAgICAgYXR0ZW1wdENvdW50Kys7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVk
IHRvIGRlcml2ZSBzY2FsYXIgYWZ0ZXIgXCIgKyBtYXhBdHRlbXB0cyArIFwiIGF0dGVtcHRzXCIpO1xuICAgICAgfTtcblxuICAgICAgY29uc3QgZGVyaXZl
U2NhbGFyID0gYXN5bmMgKHNlZWQsIGxhYmVsLCBhdHRlbXB0KSA9PiB7XG4gICAgICAgIHJldHVybiBoYXNoVG9TY2FsYXIoc2VlZCwgbGFiZWwsIGF0dGVt
cHQgPT09IDAgPyBudWxsIDogYXR0ZW1wdCk7XG4gICAgICB9O1xuICAgICAgY29uc3QgZGVyaXZlUHJpdldpdGhSZXRyeSA9IGFzeW5jIChwcml2LCBsYWJl
bCkgPT4ge1xuICAgICAgICBmb3IgKGxldCBhdHRlbXB0ID0gMDsgYXR0ZW1wdCA8IDEwMDsgYXR0ZW1wdCsrKSB7XG4gICAgICAgICAgY29uc3Qgb2Zmc2V0
ID0gYXdhaXQgZGVyaXZlU2NhbGFyKG9wdC5zZWVkLCBsYWJlbCwgYXR0ZW1wdCk7XG4gICAgICAgICAgY29uc3QgZGVyaXZlZFByaXYgPSBtb2QocHJpdiAr
IG9mZnNldCwgbik7XG4gICAgICAgICAgaWYgKGRlcml2ZWRQcml2ICE9PSAwbikge1xuICAgICAgICAgICAgcmV0dXJuIHsgZGVyaXZlZFByaXYsIGF0dGVt
cHQgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGRlcml2ZSBub24temVybyBwcml2YXRl
IGtleVwiKTtcbiAgICAgIH07XG4gICAgICBjb25zdCBkZXJpdmVQdWJXaXRoUmV0cnkgPSBhc3luYyAocHViUG9pbnQsIGxhYmVsKSA9PiB7XG4gICAgICAg
IGZvciAobGV0IGF0dGVtcHQgPSAwOyBhdHRlbXB0IDwgMTAwOyBhdHRlbXB0KyspIHtcbiAgICAgICAgICBjb25zdCBvZmZzZXQgPSBhd2FpdCBkZXJpdmVT
Y2FsYXIob3B0LnNlZWQsIGxhYmVsLCBhdHRlbXB0KTtcbiAgICAgICAgICBjb25zdCBkZXJpdmVkUHViID0gcG9pbnRBZGQocHViUG9pbnQsIHBvaW50TXVs
dChvZmZzZXQsIEcpKTtcbiAgICAgICAgICBpZiAoZGVyaXZlZFB1Yikge1xuICAgICAgICAgICAgcmV0dXJuIGRlcml2ZWRQdWI7XG4gICAgICAgICAgfVxu
ICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBkZXJpdmUgdmFsaWQgcHVibGljIGtleVwiKTtcbiAgICAgIH07XG5cbiAg
ICAgIGlmIChvcHQuc2VlZCAmJiAob3B0LnByaXYgfHwgb3B0LmVwcml2IHx8IG9wdC5wdWIgfHwgb3B0LmVwdWIpKSB7XG4gICAgICAgIHIgPSB7fTtcbiAg
ICAgICAgaWYgKG9wdC5wcml2KSB7XG4gICAgICAgICAgY29uc3QgcHJpdiA9IGVuc3VyZVByaXZSYW5nZShwcml2VG9CSShvcHQucHJpdiksICdQcml2YXRl
IGtleScpO1xuICAgICAgICAgIGNvbnN0IHNpZ25SZXN1bHQgPSBhd2FpdCBkZXJpdmVQcml2V2l0aFJldHJ5KHByaXYsIFwiU0VBLkRFUklWRXxzaWdufFwi
KTtcbiAgICAgICAgICBjb25zdCBkZXJpdmVkUHJpdiA9IHNpZ25SZXN1bHQuZGVyaXZlZFByaXY7XG4gICAgICAgICAgY29uc3QgZGVyaXZlZFB1YiA9IHBv
aW50TXVsdChkZXJpdmVkUHJpdiwgRyk7XG4gICAgICAgICAgci5wcml2ID0gYjYyLmJpVG9CNjIoZGVyaXZlZFByaXYpO1xuICAgICAgICAgIHIucHViID0g
cG9pbnRUb1B1YihkZXJpdmVkUHViKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0LmVwcml2KSB7XG4gICAgICAgICAgY29uc3QgZXByaXYgPSBlbnN1
cmVQcml2UmFuZ2UocHJpdlRvQkkob3B0LmVwcml2KSwgJ0VuY3J5cHRpb24gcHJpdmF0ZSBrZXknKTtcbiAgICAgICAgICBjb25zdCBlbmNSZXN1bHQgPSBh
d2FpdCBkZXJpdmVQcml2V2l0aFJldHJ5KGVwcml2LCBcIlNFQS5ERVJJVkV8ZW5jcnlwdHxcIik7XG4gICAgICAgICAgY29uc3QgZGVyaXZlZEVwcml2ID0g
ZW5jUmVzdWx0LmRlcml2ZWRQcml2O1xuICAgICAgICAgIGNvbnN0IGRlcml2ZWRFcHViID0gcG9pbnRNdWx0KGRlcml2ZWRFcHJpdiwgRyk7XG4gICAgICAg
ICAgci5lcHJpdiA9IGI2Mi5iaVRvQjYyKGRlcml2ZWRFcHJpdik7XG4gICAgICAgICAgci5lcHViID0gcG9pbnRUb1B1YihkZXJpdmVkRXB1Yik7XG4gICAg
ICAgIH1cbiAgICAgICAgaWYgKG9wdC5wdWIpIHtcbiAgICAgICAgICBjb25zdCBwdWJQb2ludCA9IHBhcnNlUHViKG9wdC5wdWIpO1xuICAgICAgICAgIGNv
bnN0IGRlcml2ZWRQdWIgPSBhd2FpdCBkZXJpdmVQdWJXaXRoUmV0cnkocHViUG9pbnQsIFwiU0VBLkRFUklWRXxzaWdufFwiKTtcbiAgICAgICAgICByLnB1
YiA9IHBvaW50VG9QdWIoZGVyaXZlZFB1Yik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdC5lcHViKSB7XG4gICAgICAgICAgY29uc3QgZXB1YlBvaW50
ID0gcGFyc2VQdWIob3B0LmVwdWIpO1xuICAgICAgICAgIGNvbnN0IGRlcml2ZWRFcHViID0gYXdhaXQgZGVyaXZlUHViV2l0aFJldHJ5KGVwdWJQb2ludCwg
XCJTRUEuREVSSVZFfGVuY3J5cHR8XCIpO1xuICAgICAgICAgIHIuZXB1YiA9IHBvaW50VG9QdWIoZGVyaXZlZEVwdWIpO1xuICAgICAgICB9XG4gICAgICB9
IGVsc2UgaWYgKG9wdC5wcml2KSB7XG4gICAgICAgIGNvbnN0IHByaXYgPSBlbnN1cmVQcml2UmFuZ2UocHJpdlRvQkkob3B0LnByaXYpLCAnUHJpdmF0ZSBr
ZXknKTtcbiAgICAgICAgciA9IHsgcHJpdjogb3B0LnByaXYsIHB1YjogcHViRnJvbVByaXYocHJpdikgfTtcbiAgICAgICAgaWYgKG9wdC5lcHJpdikge1xu
ICAgICAgICAgIGNvbnN0IGVwcml2ID0gZW5zdXJlUHJpdlJhbmdlKHByaXZUb0JJKG9wdC5lcHJpdiksICdFbmNyeXB0aW9uIHByaXZhdGUga2V5Jyk7XG4g
ICAgICAgICAgci5lcHJpdiA9IG9wdC5lcHJpdjtcbiAgICAgICAgICByLmVwdWIgPSBwdWJGcm9tUHJpdihlcHJpdik7XG4gICAgICAgIH0gZWxzZSB7XG4g
ICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGRoID0gYXdhaXQgZWNkaFN1YnRsZS5nZW5lcmF0ZUtleSh7bmFtZTogJ0VDREgnLCBuYW1lZEN1
cnZlOiAnUC0yNTYnfSwgdHJ1ZSwgWydkZXJpdmVLZXknXSlcbiAgICAgICAgICAgIC50aGVuKGFzeW5jIGsgPT4gKHsgXG4gICAgICAgICAgICAgIGVwcml2
OiBiNjIuYjY0VG9CNjIoKGF3YWl0IGVjZGhTdWJ0bGUuZXhwb3J0S2V5KCdqd2snLCBrLnByaXZhdGVLZXkpKS5kKSxcbiAgICAgICAgICAgICAgZXB1Yjog
YjYyLmI2NFRvQjYyKChhd2FpdCBlY2RoU3VidGxlLmV4cG9ydEtleSgnandrJywgay5wdWJsaWNLZXkpKS54KSArXG4gICAgICAgICAgICAgICAgICAgIGI2
Mi5iNjRUb0I2MigoYXdhaXQgZWNkaFN1YnRsZS5leHBvcnRLZXkoJ2p3aycsIGsucHVibGljS2V5KSkueSlcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAg
ICAgIHIuZXByaXYgPSBkaC5lcHJpdjsgci5lcHViID0gZGguZXB1YjtcbiAgICAgICAgICB9IGNhdGNoKGUpIHt9XG4gICAgICAgIH1cbiAgICAgIH0gZWxz
ZSBpZiAob3B0LmVwcml2KSB7XG4gICAgICAgIGNvbnN0IGVwcml2ID0gZW5zdXJlUHJpdlJhbmdlKHByaXZUb0JJKG9wdC5lcHJpdiksICdFbmNyeXB0aW9u
IHByaXZhdGUga2V5Jyk7XG4gICAgICAgIHIgPSB7IGVwcml2OiBvcHQuZXByaXYsIGVwdWI6IHB1YkZyb21Qcml2KGVwcml2KSB9O1xuICAgICAgICBpZiAo
b3B0LnByaXYpIHtcbiAgICAgICAgICBjb25zdCBwcml2ID0gZW5zdXJlUHJpdlJhbmdlKHByaXZUb0JJKG9wdC5wcml2KSwgJ1ByaXZhdGUga2V5Jyk7XG4g
ICAgICAgICAgci5wcml2ID0gb3B0LnByaXY7XG4gICAgICAgICAgci5wdWIgPSBwdWJGcm9tUHJpdihwcml2KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAg
ICAgICBjb25zdCBzYSA9IGF3YWl0IHN1YnRsZS5nZW5lcmF0ZUtleSh7bmFtZTogJ0VDRFNBJywgbmFtZWRDdXJ2ZTogJ1AtMjU2J30sIHRydWUsIFsnc2ln
bicsICd2ZXJpZnknXSlcbiAgICAgICAgICAudGhlbihhc3luYyBrID0+ICh7IFxuICAgICAgICAgICAgcHJpdjogYjYyLmI2NFRvQjYyKChhd2FpdCBzdWJ0
bGUuZXhwb3J0S2V5KCdqd2snLCBrLnByaXZhdGVLZXkpKS5kKSxcbiAgICAgICAgICAgIHB1YjogYjYyLmI2NFRvQjYyKChhd2FpdCBzdWJ0bGUuZXhwb3J0
S2V5KCdqd2snLCBrLnB1YmxpY0tleSkpLngpICtcbiAgICAgICAgICAgICAgICAgYjYyLmI2NFRvQjYyKChhd2FpdCBzdWJ0bGUuZXhwb3J0S2V5KCdqd2sn
LCBrLnB1YmxpY0tleSkpLnkpXG4gICAgICAgICAgfSkpO1xuICAgICAgICAgIHIucHJpdiA9IHNhLnByaXY7IHIucHViID0gc2EucHViO1xuICAgICAgICB9
XG4gICAgICB9IGVsc2UgaWYgKG9wdC5zZWVkKSB7XG4gICAgICAgIGNvbnN0IHNpZ25Qcml2ID0gYXdhaXQgc2VlZFRvS2V5KG9wdC5zZWVkLCBcIi1zaWdu
XCIpO1xuICAgICAgICBjb25zdCBlbmNQcml2ID0gYXdhaXQgc2VlZFRvS2V5KG9wdC5zZWVkLCBcIi1lbmNyeXB0XCIpO1xuICAgICAgICByID0ge1xuICAg
ICAgICAgIHByaXY6IGI2Mi5iaVRvQjYyKHNpZ25Qcml2KSwgcHViOiBwdWJGcm9tUHJpdihzaWduUHJpdiksXG4gICAgICAgICAgZXByaXY6IGI2Mi5iaVRv
QjYyKGVuY1ByaXYpLCBlcHViOiBwdWJGcm9tUHJpdihlbmNQcml2KVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc2EgPSBh
d2FpdCBzdWJ0bGUuZ2VuZXJhdGVLZXkoe25hbWU6ICdFQ0RTQScsIG5hbWVkQ3VydmU6ICdQLTI1Nid9LCB0cnVlLCBbJ3NpZ24nLCAndmVyaWZ5J10pXG4g
ICAgICAgIC50aGVuKGFzeW5jIGsgPT4gKHsgXG4gICAgICAgICAgcHJpdjogYjYyLmI2NFRvQjYyKChhd2FpdCBzdWJ0bGUuZXhwb3J0S2V5KCdqd2snLCBr
LnByaXZhdGVLZXkpKS5kKSxcbiAgICAgICAgICBwdWI6IGI2Mi5iNjRUb0I2MigoYXdhaXQgc3VidGxlLmV4cG9ydEtleSgnandrJywgay5wdWJsaWNLZXkp
KS54KSArXG4gICAgICAgICAgICAgICBiNjIuYjY0VG9CNjIoKGF3YWl0IHN1YnRsZS5leHBvcnRLZXkoJ2p3aycsIGsucHVibGljS2V5KSkueSlcbiAgICAg
ICAgfSkpO1xuICAgICAgICByID0geyBwdWI6IHNhLnB1YiwgcHJpdjogc2EucHJpdiB9O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGRoID0g
YXdhaXQgZWNkaFN1YnRsZS5nZW5lcmF0ZUtleSh7bmFtZTogJ0VDREgnLCBuYW1lZEN1cnZlOiAnUC0yNTYnfSwgdHJ1ZSwgWydkZXJpdmVLZXknXSlcbiAg
ICAgICAgICAudGhlbihhc3luYyBrID0+ICh7IFxuICAgICAgICAgICAgZXByaXY6IGI2Mi5iNjRUb0I2MigoYXdhaXQgZWNkaFN1YnRsZS5leHBvcnRLZXko
J2p3aycsIGsucHJpdmF0ZUtleSkpLmQpLFxuICAgICAgICAgICAgZXB1YjogYjYyLmI2NFRvQjYyKChhd2FpdCBlY2RoU3VidGxlLmV4cG9ydEtleSgnandr
Jywgay5wdWJsaWNLZXkpKS54KSArXG4gICAgICAgICAgICAgICAgICBiNjIuYjY0VG9CNjIoKGF3YWl0IGVjZGhTdWJ0bGUuZXhwb3J0S2V5KCdqd2snLCBr
LnB1YmxpY0tleSkpLnkpXG4gICAgICAgICAgfSkpO1xuICAgICAgICAgIHIuZXB1YiA9IGRoLmVwdWI7IHIuZXByaXYgPSBkaC5lcHJpdjtcbiAgICAgICAg
fSBjYXRjaChlKSB7fVxuICAgICAgfVxuXG4gICAgICBpZihjYikgdHJ5eyBjYihyKSB9Y2F0Y2goZSl7IC8qIFNpbGVudGx5IGlnbm9yZSBjYWxsYmFjayBl
cnJvcnMgdG8gcHJldmVudCBsZWFraW5nIHNlY3JldHMgKi8gfVxuICAgICAgcmV0dXJuIHI7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBTRUEuZXJyID0g
ZTtcbiAgICAgIGlmKFNFQS50aHJvdykgdGhyb3cgZTtcbiAgICAgIGlmKGNiKSB0cnkgeyBjYigpOyB9IGNhdGNoKGNiRXJyKSB7IC8qIElnbm9yZSBjYWxs
YmFjayBlcnJvcnMgKi8gfVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiS2V5IGdlbmVyYXRpb24gZmFpbGVkOiBcIiArIChlLm1lc3NhZ2UgfHwgXCJVbmtu
b3duIGVycm9yXCIpKTtcbiAgICB9fSk7XG5cbiAgICBfX2RlZmF1bHRFeHBvcnQgPSBTRUEucGFpcjtcbiAgXG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgX19k
ZWZhdWx0RXhwb3J0O1xuIiwic2VhL3NpZ24uanMiOiJpbXBvcnQgX19yb290IGZyb20gJy4vcm9vdC5qcyc7XG5pbXBvcnQgX19zaGltIGZyb20gJy4vc2hp
bS5qcyc7XG5pbXBvcnQgX19zZXR0aW5ncyBmcm9tICcuL3NldHRpbmdzLmpzJztcbmltcG9ydCBfX3NoYTI1NiBmcm9tICcuL3NoYTI1Ni5qcyc7XG5cbmxl
dCBfX2RlZmF1bHRFeHBvcnQ7XG4oZnVuY3Rpb24oKXtcblxuICAgIHZhciBTRUEgPSBfX3Jvb3Q7XG4gICAgdmFyIHNoaW0gPSBfX3NoaW07XG4gICAgdmFy
IFMgPSBfX3NldHRpbmdzO1xuICAgIHZhciBzaGEgPSBfX3NoYTI1NjtcbiAgICB2YXIgdTtcblxuICAgIGFzeW5jIGZ1bmN0aW9uIG4ociwgbywgYykge1xu
ICAgICAgdHJ5IHtcbiAgICAgICAgaWYoIW8ucmF3KXsgciA9ICdTRUEnICsgKGF3YWl0IHNoaW0uc3RyaW5naWZ5KHIpKSB9XG4gICAgICAgIGlmKGMpeyB0
cnl7IGMocikgfWNhdGNoKGUpe30gfVxuICAgICAgICByZXR1cm4gcjtcbiAgICAgIH0gY2F0Y2goZSkgeyByZXR1cm4gciB9XG4gICAgfVxuXG4gICAgYXN5
bmMgZnVuY3Rpb24gdyhyLCBqLCBvLCBjKSB7XG4gICAgICB2YXIgeCA9IHtcbiAgICAgICAgbTogaixcbiAgICAgICAgczogci5zaWduYXR1cmUgPyBzaGlt
LkJ1ZmZlci5mcm9tKHIuc2lnbmF0dXJlLCAnYmluYXJ5JykudG9TdHJpbmcoby5lbmNvZGUgfHwgJ2Jhc2U2NCcpIDogdSxcbiAgICAgICAgYTogc2hpbS5C
dWZmZXIuZnJvbShyLmF1dGhlbnRpY2F0b3JEYXRhLCAnYmluYXJ5JykudG9TdHJpbmcoJ2Jhc2U2NCcpLFxuICAgICAgICBjOiBzaGltLkJ1ZmZlci5mcm9t
KHIuY2xpZW50RGF0YUpTT04sICdiaW5hcnknKS50b1N0cmluZygnYmFzZTY0JylcbiAgICAgIH07XG4gICAgICBpZiAoIXgucyB8fCAheC5hIHx8ICF4LmMp
IHRocm93IFwiV2ViQXV0aG4gc2lnbmF0dXJlIGludmFsaWRcIjtcbiAgICAgIHJldHVybiBuKHgsIG8sIGMpO1xuICAgIH1cblxuICAgIGFzeW5jIGZ1bmN0
aW9uIGsocCwgaiwgbywgYykge1xuICAgICAgdmFyIHggPSBTLmp3ayhwLnB1YiwgcC5wcml2KTtcbiAgICAgIGlmICgheCkgdGhyb3cgXCJJbnZhbGlkIGtl
eSBwYWlyXCI7XG4gICAgICB2YXIgaCA9IGF3YWl0IHNoYShqKTtcbiAgICAgIHZhciBzID0gYXdhaXQgKHNoaW0ub3NzbCB8fCBzaGltLnN1YnRsZSkuaW1w
b3J0S2V5KCdqd2snLCB4LCBTLmVjZHNhLnBhaXIsIGZhbHNlLCBbJ3NpZ24nXSlcbiAgICAgIC50aGVuKChrKSA9PiAoc2hpbS5vc3NsIHx8IHNoaW0uc3Vi
dGxlKS5zaWduKFMuZWNkc2Euc2lnbiwgaywgbmV3IFVpbnQ4QXJyYXkoaCkpKVxuICAgICAgLmNhdGNoKCgpID0+IHsgdGhyb3cgXCJTRUEgc2lnbmF0dXJl
IGZhaWxlZFwiIH0pO1xuICAgICAgcmV0dXJuIG4oe206IGosIHM6IHNoaW0uQnVmZmVyLmZyb20ocywgJ2JpbmFyeScpLnRvU3RyaW5nKG8uZW5jb2RlIHx8
ICdiYXNlNjQnKX0sIG8sIGMpO1xuICAgIH1cblxuICAgIFNFQS5zaWduID0gU0VBLnNpZ24gfHwgKGFzeW5jIChkYXRhLCBwYWlyLCBjYiwgb3B0KSA9PiB7
IHRyeSB7XG4gICAgICBvcHQgPSBvcHQgfHwge307XG4gICAgICBpZih1ID09PSBkYXRhKSB0aHJvdyAnYHVuZGVmaW5lZGAgbm90IGFsbG93ZWQuJztcbiAg
ICAgIGlmKCEocGFpcnx8b3B0KS5wcml2ICYmIHR5cGVvZiBwYWlyICE9PSAnZnVuY3Rpb24nKXtcbiAgICAgICAgaWYoIVNFQS5JKSB0aHJvdyAnTm8gc2ln
bmluZyBrZXkuJztcbiAgICAgICAgcGFpciA9IGF3YWl0IFNFQS5JKG51bGwsIHt3aGF0OiBkYXRhLCBob3c6ICdzaWduJywgd2h5OiBvcHQud2h5fSk7XG4g
ICAgICB9XG5cbiAgICAgIHZhciBqID0gYXdhaXQgUy5wYXJzZShkYXRhKTtcbiAgICAgIHZhciBjID0gb3B0LmNoZWNrID0gb3B0LmNoZWNrIHx8IGo7XG5c
biAgICAgIGlmKFNFQS52ZXJpZnkgJiYgKFMuY2hlY2soYykgfHwgKGMgJiYgYy5zICYmIGMubSkpXG4gICAgICAmJiB1ICE9PSAoYXdhaXQgU0VBLnZlcmlm
eShjLCBwYWlyKSkpe1xuICAgICAgICByZXR1cm4gbihhd2FpdCBTLnBhcnNlKGMpLCBvcHQsIGNiKTtcbiAgICAgIH1cblxuICAgICAgaWYodHlwZW9mIHBh
aXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFyIHIgPSBhd2FpdCBwYWlyKGRhdGEpO1xuICAgICAgICByZXR1cm4gci5hdXRoZW50aWNhdG9yRGF0
YSA/IHcociwgaiwgb3B0LCBjYikgOiBcbiAgICAgICAgICBuKHttOiBqLCBzOiB0eXBlb2YgciA9PT0gJ3N0cmluZycgPyByIDogXG4gICAgICAgICAgICBy
LnNpZ25hdHVyZSAmJiBzaGltLkJ1ZmZlci5mcm9tKHIuc2lnbmF0dXJlLCAnYmluYXJ5JykudG9TdHJpbmcob3B0LmVuY29kZSB8fCAnYmFzZTY0Jyl9LCBv
cHQsIGNiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGsocGFpciwgaiwgb3B0LCBjYik7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBTRUEuZXJyID0g
ZTtcbiAgICAgIGlmKFNFQS50aHJvdyl7IHRocm93IGUgfVxuICAgICAgaWYoY2IpeyBjYigpIH1cbiAgICAgIHJldHVybjtcbiAgICB9fSk7XG5cbiAgICBf
X2RlZmF1bHRFeHBvcnQgPSBTRUEuc2lnbjtcbiAgXG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgX19kZWZhdWx0RXhwb3J0OyIsInNlYS92ZXJpZnkuanMiOiJp
bXBvcnQgX19yb290IGZyb20gJy4vcm9vdC5qcyc7XG5pbXBvcnQgX19zaGltIGZyb20gJy4vc2hpbS5qcyc7XG5pbXBvcnQgX19zZXR0aW5ncyBmcm9tICcu
L3NldHRpbmdzLmpzJztcbmltcG9ydCBfX3NoYTI1NiBmcm9tICcuL3NoYTI1Ni5qcyc7XG5cbmxldCBfX2RlZmF1bHRFeHBvcnQ7XG4oZnVuY3Rpb24oKXtc
blxuICAgIHZhciBTRUEgPSBfX3Jvb3Q7XG4gICAgdmFyIHNoaW0gPSBfX3NoaW07XG4gICAgdmFyIFMgPSBfX3NldHRpbmdzO1xuICAgIHZhciBzaGEgPSBf
X3NoYTI1NjtcbiAgICB2YXIgdTtcblxuICAgIGFzeW5jIGZ1bmN0aW9uIHcoaiwgaywgcykge1xuICAgICAgdmFyIGEgPSBuZXcgVWludDhBcnJheShzaGlt
LkJ1ZmZlci5mcm9tKGouYSwgJ2Jhc2U2NCcpKTtcbiAgICAgIHZhciBjID0gc2hpbS5CdWZmZXIuZnJvbShqLmMsICdiYXNlNjQnKS50b1N0cmluZygndXRm
OCcpO1xuICAgICAgdmFyIG0gPSBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUoai5tKTtcbiAgICAgIHZhciBlID0gYnRvYShTdHJpbmcuZnJvbUNoYXJDb2Rl
KC4uLm5ldyBVaW50OEFycmF5KG0pKSkucmVwbGFjZSgvXFwrL2csICctJykucmVwbGFjZSgvXFwvL2csICdfJykucmVwbGFjZSgvPS9nLCAnJyk7XG4gICAg
ICBpZiAoSlNPTi5wYXJzZShjKS5jaGFsbGVuZ2UgIT09IGUpIHRocm93IFwiQ2hhbGxlbmdlIHZlcmlmaWNhdGlvbiBmYWlsZWRcIjtcbiAgICAgIHZhciBo
ID0gYXdhaXQgKHNoaW0ub3NzbCB8fCBzaGltLnN1YnRsZSkuZGlnZXN0KFxuICAgICAgICAgIHtuYW1lOiAnU0hBLTI1Nid9LFxuICAgICAgICAgIG5ldyBU
ZXh0RW5jb2RlcigpLmVuY29kZShjKVxuICAgICAgKTtcbiAgICAgIHZhciBkID0gbmV3IFVpbnQ4QXJyYXkoYS5sZW5ndGggKyBoLmJ5dGVMZW5ndGgpO1xu
ICAgICAgZC5zZXQoYSk7XG4gICAgICBkLnNldChuZXcgVWludDhBcnJheShoKSwgYS5sZW5ndGgpO1xuICAgICAgaWYgKHNbMF0gIT09IDB4MzApIHRocm93
IFwiSW52YWxpZCBERVIgc2lnbmF0dXJlIGZvcm1hdFwiO1xuICAgICAgdmFyIG8gPSAyLCByID0gbmV3IFVpbnQ4QXJyYXkoNjQpO1xuICAgICAgZm9yKHZh
ciBpID0gMDsgaSA8IDI7IGkrKykge1xuICAgICAgICB2YXIgbCA9IHNbbyArIDFdO1xuICAgICAgICBvICs9IDI7XG4gICAgICAgIGlmIChzW29dID09PSAw
eDAwKSB7IG8rKzsgbC0tOyB9XG4gICAgICAgIHZhciBwID0gbmV3IFVpbnQ4QXJyYXkoMzIpLmZpbGwoMCk7XG4gICAgICAgIHAuc2V0KHMuc2xpY2Uobywg
byArIGwpLCAzMiAtIGwpO1xuICAgICAgICByLnNldChwLCBpICogMzIpO1xuICAgICAgICBvICs9IGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gKHNoaW0u
b3NzbCB8fCBzaGltLnN1YnRsZSkudmVyaWZ5KHsgbmFtZTogJ0VDRFNBJywgaGFzaDoge25hbWU6ICdTSEEtMjU2J30gfSwgaywgciwgZCk7XG4gICAgfVxu
XG4gICAgYXN5bmMgZnVuY3Rpb24gdihqLCBrLCBzLCBoKSB7XG4gICAgICByZXR1cm4gKHNoaW0ub3NzbCB8fCBzaGltLnN1YnRsZSkudmVyaWZ5KFxuICAg
ICAgICB7bmFtZTogJ0VDRFNBJywgaGFzaDoge25hbWU6ICdTSEEtMjU2J319LCBcbiAgICAgICAgaywgcywgbmV3IFVpbnQ4QXJyYXkoaClcbiAgICAgICk7
XG4gICAgfVxuXG4gICAgU0VBLnZlcmlmeSA9IFNFQS52ZXJpZnkgfHwgKGFzeW5jIChkLCBwLCBjYiwgbykgPT4geyB0cnkge1xuICAgICAgdmFyIGogPSBh
d2FpdCBTLnBhcnNlKGQpO1xuICAgICAgaWYoZmFsc2UgPT09IHApIHJldHVybiBjYiA/IGNiKGF3YWl0IFMucGFyc2Uoai5tKSkgOiBhd2FpdCBTLnBhcnNl
KGoubSk7XG5cbiAgICAgIG8gPSBvIHx8IHt9O1xuICAgICAgdmFyIHB1YiA9IHAucHViIHx8IHA7XG4gICAgICB2YXIgYjYyID0gU0VBLmJhc2U2MjtcbiAg
ICAgIHZhciB4eSA9IGI2Mi5wdWJUb0p3a1hZKHB1Yik7XG4gICAgICB2YXIgeCA9IHh5LngsIHkgPSB4eS55O1xuXG4gICAgICB0cnkge1xuICAgICAgICB2
YXIgayA9IGF3YWl0IChzaGltLm9zc2wgfHwgc2hpbS5zdWJ0bGUpLmltcG9ydEtleSgnandrJywge1xuICAgICAgICAgICAga3R5OiAnRUMnLCBjcnY6ICdQ
LTI1NicsIHgsIHksIGV4dDogdHJ1ZSwga2V5X29wczogWyd2ZXJpZnknXVxuICAgICAgICB9LCB7bmFtZTogJ0VDRFNBJywgbmFtZWRDdXJ2ZTogJ1AtMjU2
J30sIGZhbHNlLCBbJ3ZlcmlmeSddKTtcblxuICAgICAgICB2YXIgaCA9IGF3YWl0IHNoYShqLm0pO1xuICAgICAgICB2YXIgcyA9IG5ldyBVaW50OEFycmF5
KHNoaW0uQnVmZmVyLmZyb20oai5zIHx8ICcnLCBvLmVuY29kZSB8fCAnYmFzZTY0JykpO1xuXG4gICAgICAgIHZhciBjID0gai5hICYmIGouYyA/IGF3YWl0
IHcoaiwgaywgcykgOiBhd2FpdCB2KGosIGssIHMsIGgpO1xuXG4gICAgICAgIGlmKCFjKSB0aHJvdyBcIlNpZ25hdHVyZSBkaWQgbm90IG1hdGNoXCI7XG5c
biAgICAgICAgLy8gUGFyc2UgdGhlIG1lc3NhZ2UgY29udGVudFxuICAgICAgICB2YXIgciA9IGF3YWl0IFMucGFyc2Uoai5tKTtcblxuICAgICAgICAvLyBI
YW5kbGUgZW5jcnlwdGVkIGRhdGEgY29uc2lzdGVudGx5XG4gICAgICAgIC8vIFNFQSBlbmNyeXB0ZWQgZGF0YSBjYW4gYmUgaW4gdHdvIGZvcm1hdHM6XG4g
ICAgICAgIC8vIDEuIEEgc3RyaW5nIHN0YXJ0aW5nIHdpdGggJ1NFQScgZm9sbG93ZWQgYnkgSlNPTiAoZS5nLiwgJ1NFQXtcImN0XCI6XCIuLi5cIixcIml2
XCI6XCIuLi5cIixcInNcIjpcIi4uLlwifScpXG4gICAgICAgIC8vIDIuIEFuIG9iamVjdCB3aXRoIGN0LCBpdiwgYW5kIHMgcHJvcGVydGllc1xuXG4gICAg
ICAgIC8vIENhc2UgMTogT3JpZ2luYWwgbWVzc2FnZSB3YXMgYWxyZWFkeSBpbiBTRUEgc3RyaW5nIGZvcm1hdFxuICAgICAgICBpZih0eXBlb2Ygai5tID09
PSAnc3RyaW5nJyAmJiBqLm0uc3RhcnRzV2l0aCgnU0VBeycpKSB7XG4gICAgICAgICAgaWYoY2IpeyB0cnl7IGNiKGoubSkgfWNhdGNoKGUpe30gfVxuICAg
ICAgICAgIHJldHVybiBqLm07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDYXNlIDI6IFJlc3VsdCBpcyBhbiBlbmNyeXB0ZWQgZGF0YSBvYmplY3RcbiAg
ICAgICAgLy8gVGhpcyBlbnN1cmVzIGNvbnNpc3RlbnQgZm9ybWF0dGluZyBvZiBlbmNyeXB0ZWQgZGF0YSBhcyBTRUEgc3RyaW5nc1xuICAgICAgICBpZihy
ICYmIHR5cGVvZiByID09PSAnb2JqZWN0JyAmJiBcbiAgICAgICAgICAgdHlwZW9mIHIuY3QgPT09ICdzdHJpbmcnICYmIFxuICAgICAgICAgICB0eXBlb2Yg
ci5pdiA9PT0gJ3N0cmluZycgJiYgXG4gICAgICAgICAgIHR5cGVvZiByLnMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgLy8gRm9ybWF0IGFzIHN0YW5k
YXJkIFNFQSBlbmNyeXB0ZWQgc3RyaW5nXG4gICAgICAgICAgdmFyIHNlYVN0ciA9ICdTRUEnICsgSlNPTi5zdHJpbmdpZnkocik7XG4gICAgICAgICAgaWYo
Y2IpeyB0cnl7IGNiKHNlYVN0cikgfWNhdGNoKGUpe30gfVxuICAgICAgICAgIHJldHVybiBzZWFTdHI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEZWZh
dWx0IGNhc2U6IFJldHVybiBwYXJzZWQgcmVzdWx0IGFzIGlzXG4gICAgICAgIGlmKGNiKXsgdHJ5eyBjYihyKSB9Y2F0Y2goZSl7fSB9XG4gICAgICAgIHJl
dHVybiByO1xuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIGlmKFNFQS5vcHQuZmFsbGJhY2spe1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IFNFQS5v
cHQuZmFsbF92ZXJpZnkoZCwgcCwgY2IsIG8pO1xuICAgICAgICB9XG4gICAgICAgIGlmKGNiKXsgY2IoKSB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1c
biAgICB9IGNhdGNoKGUpIHtcbiAgICAgIFNFQS5lcnIgPSBlO1xuICAgICAgaWYoU0VBLnRocm93KXsgdGhyb3cgZSB9XG4gICAgICBpZihjYil7IGNiKCkg
fVxuICAgICAgcmV0dXJuO1xuICAgIH19KTtcblxuICAgIF9fZGVmYXVsdEV4cG9ydCA9IFNFQS52ZXJpZnk7XG5cbiAgICB2YXIga25vd25LZXlzID0ge307
XG4gICAgU0VBLm9wdC5zbG93X2xlYWsgPSBwYWlyID0+IHtcbiAgICAgIGlmIChrbm93bktleXNbcGFpcl0pIHJldHVybiBrbm93bktleXNbcGFpcl07XG4g
ICAgICB2YXIgandrID0gUy5qd2socGFpcik7XG4gICAgICBrbm93bktleXNbcGFpcl0gPSAoc2hpbS5vc3NsIHx8IHNoaW0uc3VidGxlKS5pbXBvcnRLZXko
XCJqd2tcIiwgandrLCB7bmFtZTogJ0VDRFNBJywgbmFtZWRDdXJ2ZTogJ1AtMjU2J30sIGZhbHNlLCBbXCJ2ZXJpZnlcIl0pO1xuICAgICAgcmV0dXJuIGtu
b3duS2V5c1twYWlyXTtcbiAgICB9O1xuXG4gICAgU0VBLm9wdC5mYWxsX3ZlcmlmeSA9IGFzeW5jIGZ1bmN0aW9uKGRhdGEsIHBhaXIsIGNiLCBvcHQsIGYp
e1xuICAgICAgaWYoZiA9PT0gU0VBLm9wdC5mYWxsYmFjayl7IHRocm93IFwiU2lnbmF0dXJlIGRpZCBub3QgbWF0Y2hcIiB9XG4gICAgICB2YXIgdG1wID0g
ZGF0YXx8Jyc7XG4gICAgICBkYXRhID0gU0VBLm9wdC51bnBhY2soZGF0YSkgfHwgZGF0YTtcbiAgICAgIHZhciBqc29uID0gYXdhaXQgUy5wYXJzZShkYXRh
KSwga2V5ID0gYXdhaXQgU0VBLm9wdC5zbG93X2xlYWsocGFpci5wdWIgfHwgcGFpcik7XG4gICAgICB2YXIgaGFzaCA9ICghZiB8fCBmIDw9IFNFQS5vcHQu
ZmFsbGJhY2spPyBcbiAgICAgICAgc2hpbS5CdWZmZXIuZnJvbShhd2FpdCBzaGltLnN1YnRsZS5kaWdlc3Qoe25hbWU6ICdTSEEtMjU2J30sIFxuICAgICAg
ICAgIG5ldyBzaGltLlRleHRFbmNvZGVyKCkuZW5jb2RlKGF3YWl0IFMucGFyc2UoanNvbi5tKSkpKSA6IGF3YWl0IHNoYShqc29uLm0pO1xuXG4gICAgICB0
cnkge1xuICAgICAgICB2YXIgYnVmID0gc2hpbS5CdWZmZXIuZnJvbShqc29uLnMsIG9wdC5lbmNvZGUgfHwgJ2Jhc2U2NCcpO1xuICAgICAgICB2YXIgc2ln
ID0gbmV3IFVpbnQ4QXJyYXkoYnVmKTtcbiAgICAgICAgdmFyIGNoZWNrID0gYXdhaXQgKHNoaW0ub3NzbCB8fCBzaGltLnN1YnRsZSkudmVyaWZ5KFxuICAg
ICAgICAgIHtuYW1lOiAnRUNEU0EnLCBoYXNoOiB7bmFtZTogJ1NIQS0yNTYnfX0sIFxuICAgICAgICAgIGtleSwgc2lnLCBuZXcgVWludDhBcnJheShoYXNo
KVxuICAgICAgICApO1xuICAgICAgICBpZighY2hlY2spIHRocm93IFwiXCI7XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAg
ICBidWYgPSBzaGltLkJ1ZmZlci5mcm9tKGpzb24ucywgJ3V0ZjgnKTtcbiAgICAgICAgICBzaWcgPSBuZXcgVWludDhBcnJheShidWYpO1xuICAgICAgICAg
IGNoZWNrID0gYXdhaXQgKHNoaW0ub3NzbCB8fCBzaGltLnN1YnRsZSkudmVyaWZ5KFxuICAgICAgICAgICAge25hbWU6ICdFQ0RTQScsIGhhc2g6IHtuYW1l
OiAnU0hBLTI1Nid9fSwgXG4gICAgICAgICAgICBrZXksIHNpZywgbmV3IFVpbnQ4QXJyYXkoaGFzaClcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmKCFj
aGVjaykgdGhyb3cgXCJcIjtcbiAgICAgICAgfSBjYXRjaChlKXsgdGhyb3cgXCJTaWduYXR1cmUgZGlkIG5vdCBtYXRjaC5cIiB9XG4gICAgICB9XG5cbiAg
ICAgIHZhciByID0gY2hlY2sgPyBhd2FpdCBTLnBhcnNlKGpzb24ubSkgOiB1O1xuICAgICAgU0VBLm9wdC5mYWxsX3NvdWwgPSB0bXBbJyMnXTsgU0VBLm9w
dC5mYWxsX2tleSA9IHRtcFsnLiddO1xuICAgICAgU0VBLm9wdC5mYWxsX3ZhbCA9IGRhdGE7IFNFQS5vcHQuZmFsbF9zdGF0ZSA9IHRtcFsnPiddO1xuICAg
ICAgaWYoY2IpeyB0cnl7IGNiKHIpIH1jYXRjaChlKXtjb25zb2xlLmxvZyhlKX0gfVxuICAgICAgcmV0dXJuIHI7XG4gICAgfVxuICAgIFNFQS5vcHQuZmFs
bGJhY2sgPSAyO1xuICBcbn0oKSk7XG5leHBvcnQgZGVmYXVsdCBfX2RlZmF1bHRFeHBvcnQ7XG4iLCJzZWEvYWVza2V5LmpzIjoiaW1wb3J0IF9fc2hpbSBm
cm9tICcuL3NoaW0uanMnO1xuaW1wb3J0IF9fc2V0dGluZ3MgZnJvbSAnLi9zZXR0aW5ncy5qcyc7XG5pbXBvcnQgX19zaGEyNTYgZnJvbSAnLi9zaGEyNTYu
anMnO1xuXG5sZXQgX19kZWZhdWx0RXhwb3J0O1xuKGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgc2hpbSA9IF9fc2hpbTtcbiAgICB2YXIgUyA9IF9fc2V0dGlu
Z3M7XG4gICAgdmFyIHNoYTI1Nmhhc2ggPSBfX3NoYTI1NjtcblxuICAgIGNvbnN0IGltcG9ydEdlbiA9IGFzeW5jIChrZXksIHNhbHQsIG9wdCkgPT4ge1xu
ICAgICAgLy9jb25zdCBjb21ibyA9IHNoaW0uQnVmZmVyLmNvbmNhdChbc2hpbS5CdWZmZXIuZnJvbShrZXksICd1dGY4JyksIHNhbHQgfHwgc2hpbS5yYW5k
b20oOCldKS50b1N0cmluZygndXRmOCcpIC8vIG9sZFxuICAgICAgb3B0ID0gb3B0IHx8IHt9O1xuICAgICAgY29uc3QgY29tYm8gPSBrZXkgKyAoc2FsdCB8
fCBzaGltLnJhbmRvbSg4KSkudG9TdHJpbmcoJ3V0ZjgnKTsgLy8gbmV3XG4gICAgICBjb25zdCBoYXNoID0gc2hpbS5CdWZmZXIuZnJvbShhd2FpdCBzaGEy
NTZoYXNoKGNvbWJvKSwgJ2JpbmFyeScpXG5cbiAgICAgIGNvbnN0IGp3a0tleSA9IFMua2V5VG9Kd2soaGFzaCkgICAgICBcbiAgICAgIHJldHVybiBhd2Fp
dCBzaGltLnN1YnRsZS5pbXBvcnRLZXkoJ2p3aycsIGp3a0tleSwge25hbWU6J0FFUy1HQ00nfSwgZmFsc2UsIFsnZW5jcnlwdCcsICdkZWNyeXB0J10pXG4g
ICAgfVxuICAgIF9fZGVmYXVsdEV4cG9ydCA9IGltcG9ydEdlbjtcbiAgXG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgX19kZWZhdWx0RXhwb3J0OyIsInNlYS9l
bmNyeXB0LmpzIjoiaW1wb3J0IF9fcm9vdCBmcm9tICcuL3Jvb3QuanMnO1xuaW1wb3J0IF9fc2hpbSBmcm9tICcuL3NoaW0uanMnO1xuaW1wb3J0IF9fc2V0
dGluZ3MgZnJvbSAnLi9zZXR0aW5ncy5qcyc7XG5pbXBvcnQgX19hZXNrZXkgZnJvbSAnLi9hZXNrZXkuanMnO1xuXG5sZXQgX19kZWZhdWx0RXhwb3J0O1xu
KGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgU0VBID0gX19yb290O1xuICAgIHZhciBzaGltID0gX19zaGltO1xuICAgIHZhciBTID0gX19zZXR0aW5ncztcbiAg
ICB2YXIgYWVza2V5ID0gX19hZXNrZXk7XG4gICAgdmFyIHU7XG5cbiAgICBTRUEuZW5jcnlwdCA9IFNFQS5lbmNyeXB0IHx8IChhc3luYyAoZGF0YSwgcGFp
ciwgY2IsIG9wdCkgPT4geyB0cnkge1xuICAgICAgb3B0ID0gb3B0IHx8IHt9O1xuICAgICAgdmFyIGtleSA9IChwYWlyfHxvcHQpLmVwcml2IHx8IHBhaXI7
XG4gICAgICBpZih1ID09PSBkYXRhKXsgdGhyb3cgJ2B1bmRlZmluZWRgIG5vdCBhbGxvd2VkLicgfVxuICAgICAgaWYoIWtleSl7XG4gICAgICAgIGlmKCFT
RUEuSSl7IHRocm93ICdObyBlbmNyeXB0aW9uIGtleS4nIH1cbiAgICAgICAgcGFpciA9IGF3YWl0IFNFQS5JKG51bGwsIHt3aGF0OiBkYXRhLCBob3c6ICdl
bmNyeXB0Jywgd2h5OiBvcHQud2h5fSk7XG4gICAgICAgIGtleSA9IHBhaXIuZXByaXYgfHwgcGFpcjtcbiAgICAgIH1cbiAgICAgIHZhciBtc2cgPSAodHlw
ZW9mIGRhdGEgPT0gJ3N0cmluZycpPyBkYXRhIDogYXdhaXQgc2hpbS5zdHJpbmdpZnkoZGF0YSk7XG4gICAgICB2YXIgcmFuZCA9IHtzOiBzaGltLnJhbmRv
bSg5KSwgaXY6IHNoaW0ucmFuZG9tKDE1KX07IC8vIGNvbnNpZGVyIG1ha2luZyB0aGlzIDkgYW5kIDE1IG9yIDE4IG9yIDEyIHRvIHJlZHVjZSA9PSBwYWRk
aW5nLlxuICAgICAgdmFyIGN0ID0gYXdhaXQgYWVza2V5KGtleSwgcmFuZC5zLCBvcHQpLnRoZW4oKGFlcykgPT4gKC8qc2hpbS5vc3NsIHx8Ki8gKHNoaW0u
c3VidGxlKSkuZW5jcnlwdCh7IC8vIEtlZXBpbmcgdGhlIEFFUyBrZXkgc2NvcGUgYXMgcHJpdmF0ZSBhcyBwb3NzaWJsZS4uLlxuICAgICAgICBuYW1lOiBv
cHQubmFtZSB8fCAnQUVTLUdDTScsIGl2OiBuZXcgVWludDhBcnJheShyYW5kLml2KVxuICAgICAgfSwgYWVzLCBuZXcgc2hpbS5UZXh0RW5jb2RlcigpLmVu
Y29kZShtc2cpKSk7XG4gICAgICB2YXIgciA9IHtcbiAgICAgICAgY3Q6IHNoaW0uQnVmZmVyLmZyb20oY3QsICdiaW5hcnknKS50b1N0cmluZyhvcHQuZW5j
b2RlIHx8ICdiYXNlNjQnKSxcbiAgICAgICAgaXY6IHJhbmQuaXYudG9TdHJpbmcob3B0LmVuY29kZSB8fCAnYmFzZTY0JyksXG4gICAgICAgIHM6IHJhbmQu
cy50b1N0cmluZyhvcHQuZW5jb2RlIHx8ICdiYXNlNjQnKVxuICAgICAgfVxuICAgICAgaWYoIW9wdC5yYXcpeyByID0gJ1NFQScgKyAoYXdhaXQgc2hpbS5z
dHJpbmdpZnkocikpIH1cblxuICAgICAgaWYoY2IpeyB0cnl7IGNiKHIpIH1jYXRjaChlKXtjb25zb2xlLmxvZyhlKX0gfVxuICAgICAgcmV0dXJuIHI7XG4g
ICAgfSBjYXRjaChlKSB7IFxuICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICBTRUEuZXJyID0gZTtcbiAgICAgIGlmKFNFQS50aHJvdyl7IHRocm93IGUg
fVxuICAgICAgaWYoY2IpeyBjYigpIH1cbiAgICAgIHJldHVybjtcbiAgICB9fSk7XG5cbiAgICBfX2RlZmF1bHRFeHBvcnQgPSBTRUEuZW5jcnlwdDtcbiAg
XG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgX19kZWZhdWx0RXhwb3J0OyIsInNlYS9kZWNyeXB0LmpzIjoiaW1wb3J0IF9fcm9vdCBmcm9tICcuL3Jvb3QuanMn
O1xuaW1wb3J0IF9fc2hpbSBmcm9tICcuL3NoaW0uanMnO1xuaW1wb3J0IF9fc2V0dGluZ3MgZnJvbSAnLi9zZXR0aW5ncy5qcyc7XG5pbXBvcnQgX19hZXNr
ZXkgZnJvbSAnLi9hZXNrZXkuanMnO1xuXG5sZXQgX19kZWZhdWx0RXhwb3J0O1xuKGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgU0VBID0gX19yb290O1xuICAg
IHZhciBzaGltID0gX19zaGltO1xuICAgIHZhciBTID0gX19zZXR0aW5ncztcbiAgICB2YXIgYWVza2V5ID0gX19hZXNrZXk7XG5cbiAgICBTRUEuZGVjcnlw
dCA9IFNFQS5kZWNyeXB0IHx8IChhc3luYyAoZGF0YSwgcGFpciwgY2IsIG9wdCkgPT4geyB0cnkge1xuICAgICAgb3B0ID0gb3B0IHx8IHt9O1xuICAgICAg
dmFyIGtleSA9IChwYWlyfHxvcHQpLmVwcml2IHx8IHBhaXI7XG4gICAgICBpZigha2V5KXtcbiAgICAgICAgaWYoIVNFQS5JKXsgdGhyb3cgJ05vIGRlY3J5
cHRpb24ga2V5LicgfVxuICAgICAgICBwYWlyID0gYXdhaXQgU0VBLkkobnVsbCwge3doYXQ6IGRhdGEsIGhvdzogJ2RlY3J5cHQnLCB3aHk6IG9wdC53aHl9
KTtcbiAgICAgICAga2V5ID0gcGFpci5lcHJpdiB8fCBwYWlyO1xuICAgICAgfVxuICAgICAgdmFyIGpzb24gPSBhd2FpdCBTLnBhcnNlKGRhdGEpO1xuICAg
ICAgdmFyIGJ1ZiwgYnVmaXYsIGJ1ZmN0OyB0cnl7XG4gICAgICAgIGJ1ZiA9IHNoaW0uQnVmZmVyLmZyb20oanNvbi5zLCBvcHQuZW5jb2RlIHx8ICdiYXNl
NjQnKTtcbiAgICAgICAgYnVmaXYgPSBzaGltLkJ1ZmZlci5mcm9tKGpzb24uaXYsIG9wdC5lbmNvZGUgfHwgJ2Jhc2U2NCcpO1xuICAgICAgICBidWZjdCA9
IHNoaW0uQnVmZmVyLmZyb20oanNvbi5jdCwgb3B0LmVuY29kZSB8fCAnYmFzZTY0Jyk7XG4gICAgICAgIHZhciBjdCA9IGF3YWl0IGFlc2tleShrZXksIGJ1
Ziwgb3B0KS50aGVuKChhZXMpID0+ICgvKnNoaW0ub3NzbCB8fCovIChzaGltLnN1YnRsZSkpLmRlY3J5cHQoeyAgLy8gS2VlcGluZyBhZXNLZXkgc2NvcGUg
YXMgcHJpdmF0ZSBhcyBwb3NzaWJsZS4uLlxuICAgICAgICAgIG5hbWU6IG9wdC5uYW1lIHx8ICdBRVMtR0NNJywgaXY6IG5ldyBVaW50OEFycmF5KGJ1Zml2
KSwgdGFnTGVuZ3RoOiAxMjhcbiAgICAgICAgfSwgYWVzLCBuZXcgVWludDhBcnJheShidWZjdCkpKTtcbiAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgaWYo
J3V0ZjgnID09PSBvcHQuZW5jb2RlKXsgdGhyb3cgXCJDb3VsZCBub3QgZGVjcnlwdFwiIH1cbiAgICAgICAgaWYoU0VBLm9wdC5mYWxsYmFjayl7XG4gICAg
ICAgICAgb3B0LmVuY29kZSA9ICd1dGY4JztcbiAgICAgICAgICByZXR1cm4gYXdhaXQgU0VBLmRlY3J5cHQoZGF0YSwgcGFpciwgY2IsIG9wdCk7XG4gICAg
ICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciByID0gYXdhaXQgUy5wYXJzZShuZXcgc2hpbS5UZXh0RGVjb2RlcigndXRmOCcpLmRlY29kZShjdCkpO1xuICAg
ICAgaWYoY2IpeyB0cnl7IGNiKHIpIH1jYXRjaChlKXtjb25zb2xlLmxvZyhlKX0gfVxuICAgICAgcmV0dXJuIHI7XG4gICAgfSBjYXRjaChlKSB7IFxuICAg
ICAgY29uc29sZS5sb2coZSk7XG4gICAgICBTRUEuZXJyID0gZTtcbiAgICAgIGlmKFNFQS50aHJvdyl7IHRocm93IGUgfVxuICAgICAgaWYoY2IpeyBjYigp
IH1cbiAgICAgIHJldHVybjtcbiAgICB9fSk7XG5cbiAgICBfX2RlZmF1bHRFeHBvcnQgPSBTRUEuZGVjcnlwdDtcbiAgXG59KCkpO1xuZXhwb3J0IGRlZmF1
bHQgX19kZWZhdWx0RXhwb3J0OyIsInNlYS9zZWNyZXQuanMiOiJpbXBvcnQgX19yb290IGZyb20gJy4vcm9vdC5qcyc7XG5pbXBvcnQgX19zaGltIGZyb20g
Jy4vc2hpbS5qcyc7XG5pbXBvcnQgX19zZXR0aW5ncyBmcm9tICcuL3NldHRpbmdzLmpzJztcblxubGV0IF9fZGVmYXVsdEV4cG9ydDtcbihmdW5jdGlvbigp
e1xuXG4gICAgdmFyIFNFQSA9IF9fcm9vdDtcbiAgICB2YXIgc2hpbSA9IF9fc2hpbTtcbiAgICB2YXIgUyA9IF9fc2V0dGluZ3M7XG4gICAgLy8gRGVyaXZl
IHNoYXJlZCBzZWNyZXQgZnJvbSBvdGhlcidzIHB1YiBhbmQgbXkgZXB1Yi9lcHJpdiBcbiAgICBTRUEuc2VjcmV0ID0gU0VBLnNlY3JldCB8fCAoYXN5bmMg
KGtleSwgcGFpciwgY2IsIG9wdCkgPT4geyB0cnkge1xuICAgICAgdmFyIGI2MiA9IFNFQS5iYXNlNjI7XG4gICAgICBvcHQgPSBvcHQgfHwge307XG4gICAg
ICBpZighcGFpciB8fCAhcGFpci5lcHJpdiB8fCAhcGFpci5lcHViKXtcbiAgICAgICAgaWYoIVNFQS5JKXsgdGhyb3cgJ05vIHNlY3JldCBtaXguJyB9XG4g
ICAgICAgIHBhaXIgPSBhd2FpdCBTRUEuSShudWxsLCB7d2hhdDoga2V5LCBob3c6ICdzZWNyZXQnLCB3aHk6IG9wdC53aHl9KTtcbiAgICAgIH1cbiAgICAg
IHZhciBwdWIgPSBrZXkuZXB1YiB8fCBrZXk7XG4gICAgICB2YXIgZXB1YiA9IHBhaXIuZXB1YjtcbiAgICAgIHZhciBlcHJpdiA9IHBhaXIuZXByaXY7XG4g
ICAgICB2YXIgZWNkaFN1YnRsZSA9IHNoaW0ub3NzbCB8fCBzaGltLnN1YnRsZTtcbiAgICAgIHZhciBwdWJLZXlEYXRhID0ga2V5c1RvRWNkaEp3ayhwdWIp
O1xuICAgICAgdmFyIHByb3BzID0gT2JqZWN0LmFzc2lnbih7IHB1YmxpYzogYXdhaXQgZWNkaFN1YnRsZS5pbXBvcnRLZXkoLi4ucHViS2V5RGF0YSwgdHJ1
ZSwgW10pIH0se25hbWU6ICdFQ0RIJywgbmFtZWRDdXJ2ZTogJ1AtMjU2J30pOyAvLyBUaGFua3MgdG8gQHNpcnB5ICFcbiAgICAgIHZhciBwcml2S2V5RGF0
YSA9IGtleXNUb0VjZGhKd2soZXB1YiwgZXByaXYpO1xuICAgICAgdmFyIGRlcml2ZWQgPSBhd2FpdCBlY2RoU3VidGxlLmltcG9ydEtleSguLi5wcml2S2V5
RGF0YSwgZmFsc2UsIFsnZGVyaXZlQml0cyddKS50aGVuKGFzeW5jIChwcml2S2V5KSA9PiB7XG4gICAgICAgIC8vIHByaXZhdGVLZXkgc2NvcGUgZG9lc24n
dCBsZWFrIG91dCBmcm9tIGhlcmUhXG4gICAgICAgIHZhciBkZXJpdmVkQml0cyA9IGF3YWl0IGVjZGhTdWJ0bGUuZGVyaXZlQml0cyhwcm9wcywgcHJpdktl
eSwgMjU2KTtcbiAgICAgICAgdmFyIHJhd0JpdHMgPSBuZXcgVWludDhBcnJheShkZXJpdmVkQml0cyk7XG4gICAgICAgIHZhciBkZXJpdmVkS2V5ID0gYXdh
aXQgZWNkaFN1YnRsZS5pbXBvcnRLZXkoJ3JhdycsIHJhd0JpdHMseyBuYW1lOiAnQUVTLUdDTScsIGxlbmd0aDogMjU2IH0sIHRydWUsIFsgJ2VuY3J5cHQn
LCAnZGVjcnlwdCcgXSk7XG4gICAgICAgIHJldHVybiBlY2RoU3VidGxlLmV4cG9ydEtleSgnandrJywgZGVyaXZlZEtleSkudGhlbigoeyBrIH0pID0+IGsp
O1xuICAgICAgfSlcbiAgICAgIHZhciByID0gZGVyaXZlZDtcbiAgICAgIGlmKGNiKXsgdHJ5eyBjYihyKSB9Y2F0Y2goZSl7Y29uc29sZS5sb2coZSl9IH1c
biAgICAgIHJldHVybiByO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICBTRUEuZXJyID0gZTtcbiAgICAgIGlmKFNF
QS50aHJvdyl7IHRocm93IGUgfVxuICAgICAgaWYoY2IpeyBjYigpIH1cbiAgICAgIHJldHVybjtcbiAgICB9fSk7XG5cbiAgICAvLyBjYW4gdGhpcyBiZSBy
ZXBsYWNlZCB3aXRoIHNldHRpbmdzLmp3az9cbiAgICB2YXIga2V5c1RvRWNkaEp3ayA9IChwdWIsIGQpID0+IHsgLy8gZCA9PT0gZXByaXZcbiAgICAgIHZh
ciBiNjIgPSBTRUEuYmFzZTYyO1xuICAgICAgdmFyIHh5ID0gYjYyLnB1YlRvSndrWFkocHViKSAvLyBoYW5kbGVzIG9sZCAoODcpIGFuZCBuZXcgKDg4KSBm
b3JtYXRcbiAgICAgIHZhciB4ID0geHkueCwgeSA9IHh5LnlcbiAgICAgIC8vIENvbnZlcnQgYmFzZTYyIGVwcml2ICg0NC1jaGFyKSBiYWNrIHRvIGJhc2U2
NHVybCBmb3IgV2ViQ3J5cHRvIEpXSyBpbXBvcnRLZXlcbiAgICAgIHZhciBkSndrID0gZCA/ICgoZC5sZW5ndGggPT09IDQ0ICYmIC9eW0EtWmEtejAtOV17
NDR9JC8udGVzdChkKSkgPyBiNjIuYjYyVG9CNjQoZCkgOiBkKSA6IHVuZGVmaW5lZFxuICAgICAgdmFyIGp3ayA9IGRKd2sgPyB7IGQ6IGRKd2sgfSA6IHt9
XG4gICAgICByZXR1cm4gWyAgLy8gVXNlIHdpdGggc3ByZWFkIHJldHVybmVkIHZhbHVlLi4uXG4gICAgICAgICdqd2snLFxuICAgICAgICBPYmplY3QuYXNz
aWduKFxuICAgICAgICAgIGp3ayxcbiAgICAgICAgICB7IHg6IHgsIHk6IHksIGt0eTogJ0VDJywgY3J2OiAnUC0yNTYnLCBleHQ6IHRydWUgfVxuICAgICAg
ICApLCAvLyA/Pz8gcmVmYWN0b3JcbiAgICAgICAge25hbWU6ICdFQ0RIJywgbmFtZWRDdXJ2ZTogJ1AtMjU2J31cbiAgICAgIF1cbiAgICB9XG5cbiAgICBf
X2RlZmF1bHRFeHBvcnQgPSBTRUEuc2VjcmV0O1xuICBcbn0oKSk7XG5leHBvcnQgZGVmYXVsdCBfX2RlZmF1bHRFeHBvcnQ7XG4iLCJzZWEvY2VydGlmeS5q
cyI6ImltcG9ydCBfX3Jvb3QgZnJvbSAnLi9yb290LmpzJztcblxubGV0IF9fZGVmYXVsdEV4cG9ydDtcbihmdW5jdGlvbigpe1xuXG4gICAgdmFyIFNFQSA9
IF9fcm9vdDtcbiAgICAvLyBUaGlzIGlzIHRvIGNlcnRpZnkgdGhhdCBhIGdyb3VwIG9mIFwiY2VydGlmaWNhbnRzXCIgY2FuIFwicHV0XCIgYW55dGhpbmcg
YXQgYSBncm91cCBvZiBtYXRjaGVkIFwicGF0aHNcIiB0byB0aGUgY2VydGlmaWNhdGUgYXV0aG9yaXR5J3MgZ3JhcGhcbiAgICBTRUEuY2VydGlmeSA9IFNF
QS5jZXJ0aWZ5IHx8IChhc3luYyAoY2VydGlmaWNhbnRzLCBwb2xpY3kgPSB7fSwgYXV0aG9yaXR5LCBjYiwgb3B0ID0ge30pID0+IHsgdHJ5IHtcbiAgICAg
IC8qXG4gICAgICBUaGUgQ2VydGlmeSBQcm90b2NvbCB3YXMgbWFkZSBvdXQgb2YgbG92ZSBieSBhIFZpZXRuYW1lc2UgY29kZSBlbnRodXNpYXN0LiBWaWV0
bmFtZXNlIHBlb3BsZSBhcm91bmQgdGhlIHdvcmxkIGRlc2VydmUgcmVzcGVjdCFcbiAgICAgIElNUE9SVEFOVDogQSBDZXJ0aWZpY2F0ZSBpcyBsaWtlIGEg
U2lnbmF0dXJlLiBObyBvbmUga25vd3Mgd2hvIChhdXRob3JpdHkpIGNyZWF0ZWQvc2lnbmVkIGEgY2VydCB1bnRpbCB5b3UgcHV0IGl0IGludG8gdGhlaXIg
Z3JhcGguXG4gICAgICBcImNlcnRpZmljYW50c1wiOiAnKicgb3IgYSBTdHJpbmcgKEJvYi5wdWIpIHx8IGFuIE9iamVjdCB0aGF0IGNvbnRhaW5zIFwicHVi
XCIgYXMgYSBrZXkgfHwgYW4gYXJyYXkgb2YgW29iamVjdCB8fCBzdHJpbmddLiBUaGVzZSBwZW9wbGUgd2lsbCBoYXZlIHRoZSByaWdodHMuXG4gICAgICBc
InBvbGljeVwiOiBBIHN0cmluZyAoJ2luYm94JyksIG9yIGEgUkFEL0xFWCBvYmplY3QgeycqJzogJ2luYm94J30sIG9yIGFuIEFycmF5IG9mIFJBRC9MRVgg
b2JqZWN0cyBvciBzdHJpbmdzLiBSQUQvTEVYIG9iamVjdCBjYW4gY29udGFpbiBrZXkgXCI/XCIgd2l0aCBpbmRleE9mKFwiKlwiKSA+IC0xIHRvIGZvcmNl
IGtleSBlcXVhbHMgY2VydGlmaWNhbnQgcHViLiBUaGlzIHJ1bGUgaXMgdXNlZCB0byBjaGVjayBhZ2FpbnN0IHNvdWwrJy8nK2tleSB1c2luZyBHdW4udGV4
dC5tYXRjaCBvciBTdHJpbmcubWF0Y2guXG4gICAgICBcImF1dGhvcml0eVwiOiBLZXkgcGFpciBvciBwcml2IG9mIHRoZSBjZXJ0aWZpY2F0ZSBhdXRob3Jp
dHkuXG4gICAgICBcImNiXCI6IEEgY2FsbGJhY2sgZnVuY3Rpb24gYWZ0ZXIgYWxsIHRoaW5ncyBhcmUgZG9uZS5cbiAgICAgIFwib3B0XCI6IElmIG9wdC5l
eHBpcnkgKGEgdGltZXN0YW1wKSBpcyBzZXQsIFNFQSB3b24ndCBzeW5jIGRhdGEgYWZ0ZXIgb3B0LmV4cGlyeS4gSWYgb3B0LmJsb2NrIGlzIHNldCwgU0VB
IHdpbGwgbG9vayBmb3IgYmxvY2sgYmVmb3JlIHN5bmNpbmcuXG4gICAgICAqL1xuXG4gICAgICBjZXJ0aWZpY2FudHMgPSAoKCkgPT4ge1xuICAgICAgICB2
YXIgZGF0YSA9IFtdXG4gICAgICAgIGlmIChjZXJ0aWZpY2FudHMpIHtcbiAgICAgICAgICBpZiAoKHR5cGVvZiBjZXJ0aWZpY2FudHMgPT09ICdzdHJpbmcn
IHx8IEFycmF5LmlzQXJyYXkoY2VydGlmaWNhbnRzKSkgJiYgY2VydGlmaWNhbnRzLmluZGV4T2YoJyonKSA+IC0xKSByZXR1cm4gJyonXG4gICAgICAgICAg
aWYgKHR5cGVvZiBjZXJ0aWZpY2FudHMgPT09ICdzdHJpbmcnKSByZXR1cm4gY2VydGlmaWNhbnRzXG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2Vy
dGlmaWNhbnRzKSkge1xuICAgICAgICAgICAgaWYgKGNlcnRpZmljYW50cy5sZW5ndGggPT09IDEgJiYgY2VydGlmaWNhbnRzWzBdKSByZXR1cm4gdHlwZW9m
IGNlcnRpZmljYW50c1swXSA9PT0gJ29iamVjdCcgJiYgY2VydGlmaWNhbnRzWzBdLnB1YiA/IGNlcnRpZmljYW50c1swXS5wdWIgOiB0eXBlb2YgY2VydGlm
aWNhbnRzWzBdID09PSAnc3RyaW5nJyA/IGNlcnRpZmljYW50c1swXSA6IG51bGxcbiAgICAgICAgICAgIGNlcnRpZmljYW50cy5tYXAoY2VydGlmaWNhbnQg
PT4ge1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIGNlcnRpZmljYW50ID09PSdzdHJpbmcnKSBkYXRhLnB1c2goY2VydGlmaWNhbnQpXG4gICAgICAgICAg
ICAgIGVsc2UgaWYgKHR5cGVvZiBjZXJ0aWZpY2FudCA9PT0gJ29iamVjdCcgJiYgY2VydGlmaWNhbnQucHViKSBkYXRhLnB1c2goY2VydGlmaWNhbnQucHVi
KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGNlcnRpZmljYW50cyA9PT0gJ29iamVjdCcgJiYgY2VydGlm
aWNhbnRzLnB1YikgcmV0dXJuIGNlcnRpZmljYW50cy5wdWJcbiAgICAgICAgICByZXR1cm4gZGF0YS5sZW5ndGggPiAwID8gZGF0YSA6IG51bGxcbiAgICAg
ICAgfVxuICAgICAgICByZXR1cm5cbiAgICAgIH0pKClcblxuICAgICAgaWYgKCFjZXJ0aWZpY2FudHMpIHJldHVybiBjb25zb2xlLmxvZyhcIk5vIGNlcnRp
ZmljYW50IGZvdW5kLlwiKVxuXG4gICAgICBjb25zdCBleHBpcnkgPSBvcHQuZXhwaXJ5ICYmICh0eXBlb2Ygb3B0LmV4cGlyeSA9PT0gJ251bWJlcicgfHwg
dHlwZW9mIG9wdC5leHBpcnkgPT09ICdzdHJpbmcnKSA/IHBhcnNlRmxvYXQob3B0LmV4cGlyeSkgOiBudWxsXG4gICAgICBjb25zdCByZWFkUG9saWN5ID0g
KHBvbGljeSB8fCB7fSkucmVhZCA/IHBvbGljeS5yZWFkIDogbnVsbFxuICAgICAgY29uc3Qgd3JpdGVQb2xpY3kgPSAocG9saWN5IHx8IHt9KS53cml0ZSA/
IHBvbGljeS53cml0ZSA6IHR5cGVvZiBwb2xpY3kgPT09ICdzdHJpbmcnIHx8IEFycmF5LmlzQXJyYXkocG9saWN5KSB8fCBwb2xpY3lbXCIrXCJdIHx8IHBv
bGljeVtcIiNcIl0gfHwgcG9saWN5W1wiLlwiXSB8fCBwb2xpY3lbXCI9XCJdIHx8IHBvbGljeVtcIipcIl0gfHwgcG9saWN5W1wiPlwiXSB8fCBwb2xpY3lb
XCI8XCJdID8gcG9saWN5IDogbnVsbFxuICAgICAgLy8gVGhlIFwiYmxhY2tsaXN0XCIgZmVhdHVyZSBpcyBub3cgcmVuYW1lZCB0byBcImJsb2NrXCIuIFdo
eSA/IEJFQ0FVU0UgQkxBQ0sgTElWRVMgTUFUVEVSIVxuICAgICAgLy8gV2UgY2FuIG5vdyB1c2UgMyBrZXlzOiBibG9jaywgYmxhY2tsaXN0LCBiYW5cbiAg
ICAgIGNvbnN0IGJsb2NrID0gKG9wdCB8fCB7fSkuYmxvY2sgfHwgKG9wdCB8fCB7fSkuYmxhY2tsaXN0IHx8IChvcHQgfHwge30pLmJhbiB8fCB7fVxuICAg
ICAgY29uc3QgcmVhZEJsb2NrID0gYmxvY2sucmVhZCAmJiAodHlwZW9mIGJsb2NrLnJlYWQgPT09ICdzdHJpbmcnIHx8IChibG9jay5yZWFkIHx8IHt9KVsn
IyddKSA/IGJsb2NrLnJlYWQgOiBudWxsXG4gICAgICBjb25zdCB3cml0ZUJsb2NrID0gdHlwZW9mIGJsb2NrID09PSAnc3RyaW5nJyA/IGJsb2NrIDogYmxv
Y2sud3JpdGUgJiYgKHR5cGVvZiBibG9jay53cml0ZSA9PT0gJ3N0cmluZycgfHwgYmxvY2sud3JpdGVbJyMnXSkgPyBibG9jay53cml0ZSA6IG51bGxcblxu
ICAgICAgaWYgKCFyZWFkUG9saWN5ICYmICF3cml0ZVBvbGljeSkgcmV0dXJuIGNvbnNvbGUubG9nKFwiTm8gcG9saWN5IGZvdW5kLlwiKVxuXG4gICAgICAv
LyByZXNlcnZlZCBrZXlzOiBjLCBlLCByLCB3LCByYiwgd2JcbiAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGM6IGNlcnRp
ZmljYW50cyxcbiAgICAgICAgLi4uKGV4cGlyeSA/IHtlOiBleHBpcnl9IDoge30pLCAvLyBpbmplY3QgZXhwaXJ5IGlmIHBvc3NpYmxlXG4gICAgICAgIC4u
LihyZWFkUG9saWN5ID8ge3I6IHJlYWRQb2xpY3kgfSAgOiB7fSksIC8vIFwiclwiIHN0YW5kcyBmb3IgcmVhZCwgd2hpY2ggbWVhbnMgcmVhZCBwZXJtaXNz
aW9uLlxuICAgICAgICAuLi4od3JpdGVQb2xpY3kgPyB7dzogd3JpdGVQb2xpY3l9IDoge30pLCAvLyBcIndcIiBzdGFuZHMgZm9yIHdyaXRlLCB3aGljaCBt
ZWFucyB3cml0ZSBwZXJtaXNzaW9uLlxuICAgICAgICAuLi4ocmVhZEJsb2NrID8ge3JiOiByZWFkQmxvY2t9IDoge30pLCAvLyBpbmplY3QgUkVBRCBibG9j
ayBpZiBwb3NzaWJsZVxuICAgICAgICAuLi4od3JpdGVCbG9jayA/IHt3Yjogd3JpdGVCbG9ja30gOiB7fSksIC8vIGluamVjdCBXUklURSBibG9jayBpZiBw
b3NzaWJsZVxuICAgICAgfSlcblxuICAgICAgY29uc3QgY2VydGlmaWNhdGUgPSBhd2FpdCBTRUEuc2lnbihkYXRhLCBhdXRob3JpdHksIG51bGwsIHtyYXc6
MX0pXG5cbiAgICAgIHZhciByID0gY2VydGlmaWNhdGVcbiAgICAgIGlmKCFvcHQucmF3KXsgciA9ICdTRUEnK0pTT04uc3RyaW5naWZ5KHIpIH1cbiAgICAg
IGlmKGNiKXsgdHJ5eyBjYihyKSB9Y2F0Y2goZSl7Y29uc29sZS5sb2coZSl9IH1cbiAgICAgIHJldHVybiByO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAg
U0VBLmVyciA9IGU7XG4gICAgICBpZihTRUEudGhyb3cpeyB0aHJvdyBlIH1cbiAgICAgIGlmKGNiKXsgY2IoKSB9XG4gICAgICByZXR1cm47XG4gICAgfX0p
O1xuXG4gICAgX19kZWZhdWx0RXhwb3J0ID0gU0VBLmNlcnRpZnk7XG4gIFxufSgpKTtcbmV4cG9ydCBkZWZhdWx0IF9fZGVmYXVsdEV4cG9ydDsiLCJzZWEv
c2VhLmpzIjoiaW1wb3J0IF9fc2hpbSBmcm9tICcuL3NoaW0uanMnO1xuaW1wb3J0IF9fc2hhMSBmcm9tICcuL3NoYTEuanMnO1xuaW1wb3J0IF9fcm9vdCBm
cm9tICcuL3Jvb3QuanMnO1xuaW1wb3J0IF9fd29yayBmcm9tICcuL3dvcmsuanMnO1xuaW1wb3J0IF9fc2lnbiBmcm9tICcuL3NpZ24uanMnO1xuaW1wb3J0
IF9fdmVyaWZ5IGZyb20gJy4vdmVyaWZ5LmpzJztcbmltcG9ydCBfX2VuY3J5cHQgZnJvbSAnLi9lbmNyeXB0LmpzJztcbmltcG9ydCBfX2RlY3J5cHQgZnJv
bSAnLi9kZWNyeXB0LmpzJztcbmltcG9ydCBfX2NlcnRpZnkgZnJvbSAnLi9jZXJ0aWZ5LmpzJztcbmltcG9ydCBfX2J1ZmZlciBmcm9tICcuL2J1ZmZlci5q
cyc7XG5cbmxldCBfX2RlZmF1bHRFeHBvcnQ7XG4oZnVuY3Rpb24oKXtcblxuICAgIHZhciBzaGltID0gX19zaGltO1xuICAgIHZhciBzaGExaGFzaCA9IF9f
c2hhMTtcbiAgICAvLyBQcmFjdGljYWwgZXhhbXBsZXMgYWJvdXQgdXNhZ2UgZm91bmQgaW4gdGVzdHMuXG4gICAgdmFyIFNFQSA9IF9fcm9vdDtcbiAgICBT
RUEud29yayA9IF9fd29yaztcbiAgICBTRUEuc2lnbiA9IF9fc2lnbjtcbiAgICBTRUEudmVyaWZ5ID0gX192ZXJpZnk7XG4gICAgU0VBLmVuY3J5cHQgPSBf
X2VuY3J5cHQ7XG4gICAgU0VBLmRlY3J5cHQgPSBfX2RlY3J5cHQ7XG4gICAgU0VBLmNlcnRpZnkgPSBfX2NlcnRpZnk7XG4gICAgLy8gU0VBLm9wdC5hZXNr
ZXkgaXMgaW50ZW50aW9uYWxseSBsZWZ0IGRpc2FibGVkOyBpdCBjYXVzZWQgV2ViQ3J5cHRvIGlzc3VlcyB1cHN0cmVhbS5cblxuICAgIFNFQS5yYW5kb20g
PSBTRUEucmFuZG9tIHx8IHNoaW0ucmFuZG9tO1xuXG4gICAgLy8gVGhpcyBpcyBCdWZmZXIgdXNlZCBpbiBTRUEgYW5kIHVzYWJsZSBmcm9tIEd1bi9TRUEg
YXBwbGljYXRpb24gYWxzby5cbiAgICAvLyBGb3IgZG9jdW1lbnRhdGlvbiBzZWUgaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9idWZmZXIuaHRtbFxuICAgIFNF
QS5CdWZmZXIgPSBTRUEuQnVmZmVyIHx8IF9fYnVmZmVyO1xuXG4gICAgLy8gVGhlc2UgU0VBIGZ1bmN0aW9ucyBzdXBwb3J0IG5vdyBvbnkgUHJvbWlzZXMg
b3JcbiAgICAvLyBhc3luYy9hd2FpdCAoY29tcGF0aWJsZSkgY29kZSwgdXNlIHRob3NlIGxpa2UgUHJvbWlzZXMuXG4gICAgLy9cbiAgICAvLyBDcmVhdGVz
IGEgd3JhcHBlciBsaWJyYXJ5IGFyb3VuZCBXZWIgQ3J5cHRvIEFQSVxuICAgIC8vIGZvciB2YXJpb3VzIEFFUywgRUNEU0EsIFBCS0RGMiBmdW5jdGlvbnMg
d2UgY2FsbGVkIGFib3ZlLlxuICAgIC8vIENhbGN1bGF0ZSBwdWJsaWMga2V5IEtleUlEIGFrYSBQR1B2NCAocmVzdWx0OiA4IGJ5dGVzIGFzIGhleCBzdHJp
bmcpXG4gICAgU0VBLmtleWlkID0gU0VBLmtleWlkIHx8IChhc3luYyAocHViKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBEZWNvZGUgcHViIGtl
eSBjb29yZGluYXRlcyAoaGFuZGxlcyBvbGQgODctY2hhciBiYXNlNjR1cmwgYW5kIG5ldyA4OC1jaGFyIGJhc2U2MilcbiAgICAgICAgdmFyIHh5ID0gU0VB
LmJhc2U2Mi5wdWJUb0p3a1hZKHB1Yik7XG4gICAgICAgIGNvbnN0IHBiID0gc2hpbS5CdWZmZXIuY29uY2F0KFxuICAgICAgICAgIFt4eS54LCB4eS55XS5t
YXAoKHQpID0+IHNoaW0uQnVmZmVyLmZyb20oYXRvYih0LnJlcGxhY2UoLy0vZywnKycpLnJlcGxhY2UoL18vZywnLycpKSwgJ2JpbmFyeScpKVxuICAgICAg
ICApXG4gICAgICAgIC8vIGlkIGlzIFBHUHY0IGNvbXBsaWFudCByYXcga2V5XG4gICAgICAgIGNvbnN0IGlkID0gc2hpbS5CdWZmZXIuY29uY2F0KFtcbiAg
ICAgICAgICBzaGltLkJ1ZmZlci5mcm9tKFsweDk5LCBwYi5sZW5ndGggLyAweDEwMCwgcGIubGVuZ3RoICUgMHgxMDBdKSwgcGJcbiAgICAgICAgXSlcbiAg
ICAgICAgY29uc3Qgc2hhMSA9IGF3YWl0IHNoYTFoYXNoKGlkKVxuICAgICAgICBjb25zdCBoYXNoID0gc2hpbS5CdWZmZXIuZnJvbShzaGExLCAnYmluYXJ5
JylcbiAgICAgICAgcmV0dXJuIGhhc2gudG9TdHJpbmcoJ2hleCcsIGhhc2gubGVuZ3RoIC0gOCkgIC8vIDE2LWJpdCBJRCBhcyBoZXhcbiAgICAgIH0gY2F0
Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgICAgdGhyb3cgZVxuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIGFsbCBkb25lIVxuICAg
IC8vIE9idmlvdXNseSBpdCBpcyBtaXNzaW5nIE1BTlkgbmVjZXNzYXJ5IGZlYXR1cmVzLiBUaGlzIGlzIG9ubHkgYW4gYWxwaGEgcmVsZWFzZS5cbiAgICAv
LyBQbGVhc2UgZXhwZXJpbWVudCB3aXRoIGl0LCBhdWRpdCB3aGF0IEkndmUgZG9uZSBzbyBmYXIsIGFuZCBjb21wbGFpbiBhYm91dCB3aGF0IG5lZWRzIHRv
IGJlIGFkZGVkLlxuICAgIC8vIFNFQSBzaG91bGQgYmUgYSBmdWxsIHN1aXRlIHRoYXQgaXMgZWFzeSBhbmQgc2VhbWxlc3MgdG8gdXNlLlxuICAgIC8vIEFn
YWluLCBzY3JvbGwgbmFlciB0aGUgdG9wLCB3aGVyZSBJIHByb3ZpZGUgYW4gRVhBTVBMRSBvZiBob3cgdG8gY3JlYXRlIGEgdXNlciBhbmQgc2lnbiBpbi5c
biAgICAvLyBPbmNlIGxvZ2dlZCBpbiwgdGhlIHJlc3Qgb2YgdGhlIGNvZGUgeW91IGp1c3QgcmVhZCBoYW5kbGVkIGF1dG9tYXRpY2FsbHkgc2lnbmluZy92
YWxpZGF0aW5nIGRhdGEuXG4gICAgLy8gQnV0IGFsbCBvdGhlciBiZWhhdmlvciBuZWVkcyB0byBiZSBlcXVhbGx5IGVhc3ksIGxpa2Ugb3BpbmlvbmF0ZWQg
d2F5cyBvZlxuICAgIC8vIEFkZGluZyBmcmllbmRzICh0cnVzdGVkIHB1YmxpYyBrZXlzKSwgc2VuZGluZyBwcml2YXRlIG1lc3NhZ2VzLCBldGMuXG4gICAg
Ly8gQ2hlZXJzISBUZWxsIG1lIHdoYXQgeW91IHRoaW5rLlxuICAgICgoU0VBLndpbmRvd3x8e30pLkdVTnx8e30pLlNFQSA9IFNFQTtcblxuICAgIF9fZGVm
YXVsdEV4cG9ydCA9IFNFQVxuICAgIC8vIC0tLS0tLS0tLS0tLS0tIEVORCBTRUEgTU9EVUxFUyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIC0tIEJF
R0lOIFNFQStHVU4gTU9EVUxFUzogQlVORExFRCBCWSBERUZBVUxUIFVOVElMIE9USEVSUyBVU0UgU0VBIE9OIE9XTiAtLS0tLS0tXG4gIFxufSgpKTtcbmV4
cG9ydCBkZWZhdWx0IF9fZGVmYXVsdEV4cG9ydDtcbiIsInNlYS90aGVuLmpzIjoiaW1wb3J0IF9fZ3VuIGZyb20gJy4uL2d1bi5qcyc7XG5cbihmdW5jdGlv
bigpe1xuXG4gICAgdmFyIHUsIEd1biA9ICgnJyt1ICE9IHR5cGVvZiBHVU4pPyAoR1VOfHx7Y2hhaW46e319KSA6IF9fZ3VuO1xuICAgIEd1bi5jaGFpbi50
aGVuID0gZnVuY3Rpb24oY2IsIG9wdCl7XG4gICAgICB2YXIgZ3VuID0gdGhpcywgcCA9IChuZXcgUHJvbWlzZShmdW5jdGlvbihyZXMsIHJlail7XG4gICAg
ICAgIGd1bi5vbmNlKHJlcywgb3B0KTtcbiAgICAgIH0pKTtcbiAgICAgIHJldHVybiBjYj8gcC50aGVuKGNiKSA6IHA7XG4gICAgfVxuICBcbn0oKSk7XG4i
LCJzZWEvaW5kZXguanMiOiJpbXBvcnQgX19zZWEgZnJvbSAnLi9zZWEuanMnO1xuaW1wb3J0IF9fc2V0dGluZ3MgZnJvbSAnLi9zZXR0aW5ncy5qcyc7XG5p
bXBvcnQgX19ndW4gZnJvbSAnLi4vZ3VuLmpzJztcbihmdW5jdGlvbigpe1xuXG4gICAgdmFyIFNFQSA9IF9fc2VhLCBTID0gX19zZXR0aW5ncywgbm9vcCA9
IGZ1bmN0aW9uKCkge30sIHU7XG4gICAgdmFyIEd1biA9IChTRUEud2luZG93fHwnJykuR1VOIHx8IF9fZ3VuO1xuICAgIC8vIEFmdGVyIHdlIGhhdmUgYSBH
VU4gZXh0ZW5zaW9uIHRvIG1ha2UgdXNlciByZWdpc3RyYXRpb24vbG9naW4gZWFzeSwgd2UgdGhlbiBuZWVkIHRvIGhhbmRsZSBldmVyeXRoaW5nIGVsc2Uu
XG5cbiAgICAvLyBXZSBkbyB0aGlzIHdpdGggYSBHVU4gYWRhcHRlciwgd2UgZmlyc3QgbGlzdGVuIHRvIHdoZW4gYSBndW4gaW5zdGFuY2UgaXMgY3JlYXRl
ZCAoYW5kIHdoZW4gaXRzIG9wdGlvbnMgY2hhbmdlKVxuICAgIEd1bi5vbignb3B0JywgZnVuY3Rpb24oYXQpe1xuICAgICAgaWYoIWF0LnNlYSl7IC8vIG9u
bHkgYWRkIFNFQSBvbmNlIHBlciBpbnN0YW5jZSwgb24gdGhlIFwiYXRcIiBjb250ZXh0LlxuICAgICAgICBhdC5zZWEgPSB7b3duOiB7fX07XG4gICAgICAg
IGF0Lm9uKCdwdXQnLCBjaGVjaywgYXQpOyAvLyBTRUEgbm93IHJ1bnMgaXRzIGZpcmV3YWxsIG9uIEhBTSBkaWZmcywgbm90IGFsbCBpL28uXG4gICAgICB9
XG4gICAgICB0aGlzLnRvLm5leHQoYXQpOyAvLyBtYWtlIHN1cmUgdG8gY2FsbCB0aGUgXCJuZXh0XCIgbWlkZGxld2FyZSBhZGFwdGVyLlxuICAgIH0pO1xu
XG4gICAgLy8gQWxyaWdodCwgdGhpcyBuZXh0IGFkYXB0ZXIgZ2V0cyBydW4gYXQgdGhlIHBlciBub2RlIGxldmVsIGluIHRoZSBncmFwaCBkYXRhYmFzZS5c
biAgICAvLyBjb3JyZWN0aW9uOiAyMDIwIGl0IGdldHMgcnVuIG9uIGVhY2gga2V5L3ZhbHVlIHBhaXIgaW4gYSBub2RlIHVwb24gYSBIQU0gZGlmZi5cbiAg
ICAvLyBUaGlzIHdpbGwgbGV0IHVzIHZlcmlmeSB0aGF0IGV2ZXJ5IHByb3BlcnR5IG9uIGEgbm9kZSBoYXMgYSB2YWx1ZSBzaWduZWQgYnkgYSBwdWJsaWMg
a2V5IHdlIHRydXN0LlxuICAgIC8vIElmIHRoZSBzaWduYXR1cmUgZG9lcyBub3QgbWF0Y2gsIHRoZSBkYXRhIGlzIGp1c3QgYHVuZGVmaW5lZGAgc28gaXQg
ZG9lc24ndCBnZXQgcGFzc2VkIG9uLlxuICAgIC8vIElmIGl0IGRvZXMgbWF0Y2gsIHRoZW4gd2UgdHJhbnNmb3JtIHRoZSBpbi1tZW1vcnkgXCJ2aWV3XCIg
b2YgdGhlIGRhdGEgaW50byBpdHMgcGxhaW4gdmFsdWUgKHdpdGhvdXQgdGhlIHNpZ25hdHVyZSkuXG4gICAgLy8gTm93IE5PVEUhIFNvbWUgZGF0YSBpcyBc
InN5c3RlbVwiIGRhdGEsIG5vdCB1c2VyIGRhdGEuIEV4YW1wbGU6IExpc3Qgb2YgcHVibGljIGtleXMsIGFsaWFzZXMsIGV0Yy5cbiAgICAvLyBUaGlzIGRh
dGEgaXMgc2VsZi1lbmZvcmNlZCAodGhlIHZhbHVlIGNhbiBvbmx5IG1hdGNoIGl0cyBJRCksIGJ1dCB0aGF0IGlzIGhhbmRsZWQgaW4gdGhlIGBzZWN1cml0
eWAgZnVuY3Rpb24uXG4gICAgLy8gRnJvbSB0aGUgc2VsZi1lbmZvcmNlZCBkYXRhLCB3ZSBjYW4gc2VlIGFsbCB0aGUgZWRnZXMgaW4gdGhlIGdyYXBoIHRo
YXQgYmVsb25nIHRvIGEgcHVibGljIGtleS5cbiAgICAvLyBFeGFtcGxlOiB+QVNERiBpcyB0aGUgSUQgb2YgYSBub2RlIHdpdGggQVNERiBhcyBpdHMgcHVi
bGljIGtleSwgc2lnbmVkIGFsaWFzIGFuZCBzYWx0LCBhbmRcbiAgICAvLyBpdHMgZW5jcnlwdGVkIHByaXZhdGUga2V5LCBidXQgaXQgbWlnaHQgYWxzbyBo
YXZlIG90aGVyIHNpZ25lZCB2YWx1ZXMgb24gaXQgbGlrZSBgcHJvZmlsZSA9IDxJRD5gIGVkZ2UuXG4gICAgLy8gVXNpbmcgdGhhdCBkaXJlY3RlZCBlZGdl
J3MgSUQsIHdlIGNhbiB0aGVuIHRyYWNrIChpbiBtZW1vcnkpIHdoaWNoIElEcyBiZWxvbmcgdG8gd2hpY2gga2V5cy5cbiAgICAvLyBIZXJlIGlzIGEgcHJv
YmxlbTogTXVsdGlwbGUgcHVibGljIGtleXMgY2FuIFwiY2xhaW1cIiBhbnkgbm9kZSdzIElELCBzbyB0aGlzIGlzIGRhbmdlcm91cyFcbiAgICAvLyBUaGlz
IG1lYW5zIHdlIHNob3VsZCBPTkxZIHRydXN0IG91ciBcImZyaWVuZHNcIiAob3VyIGtleSByaW5nKSBwdWJsaWMga2V5cywgbm90IGFueSBvbmVzLlxuICAg
IC8vIEkgaGF2ZSBub3QgeWV0IGFkZGVkIHRoYXQgdG8gU0VBIHlldCBpbiB0aGlzIGFscGhhIHJlbGVhc2UuIFRoYXQgaXMgY29taW5nIHNvb24sIGJ1dCBi
ZXdhcmUgaW4gdGhlIG1lYW53aGlsZSFcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLSBNYWluIGRpc3BhdGNoZXIgLS0tLS0tLS0tLS0tLS0tXG4gICAgZnVu
Y3Rpb24gY2hlY2sobXNnKXtcbiAgICAgIHZhciBldmUgPSB0aGlzLCBhdCA9IGV2ZS5hcywgcHV0ID0gbXNnLnB1dCwgc291bCA9IHB1dFsnIyddLCBrZXkg
PSBwdXRbJy4nXSwgdmFsID0gcHV0Wyc6J10sIHN0YXRlID0gcHV0Wyc+J10sIGlkID0gbXNnWycjJ10sIHRtcDtcbiAgICAgIGlmKCFzb3VsIHx8ICFrZXkp
eyByZXR1cm4gfVxuXG4gICAgICAvLyBGYWl0aCBmYXN0LXBhdGgg4oCUIGJ5cGFzcyBhbGwgdmFsaWRhdGlvblxuICAgICAgaWYoKG1zZy5ffHwnJykuZmFp
dGggJiYgKGF0Lm9wdHx8JycpLmZhaXRoICYmICdmdW5jdGlvbicgPT0gdHlwZW9mIG1zZy5fKXtcbiAgICAgICAgY2hlY2sucGlwZS5mYWl0aCh7IGV2ZTog
ZXZlLCBtc2c6IG1zZywgcHV0OiBwdXQsIGF0OiBhdCB9KTsgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgbm8gPSBmdW5jdGlvbih3aHkpeyBhdC5v
bignaW4nLCB7J0AnOiBpZCwgZXJyOiBtc2cuZXJyID0gd2h5fSkgfTtcbiAgICAgIChtc2cuX3x8JycpLkRCRyAmJiAoKG1zZy5ffHwnJykuREJHLmMgPSAr
bmV3IERhdGUpO1xuXG4gICAgICAvLyBCdWlsZCBjb250ZXh0IG9iamVjdCBzaGFyZWQgYWNyb3NzIGFsbCBzdGFnZXNcbiAgICAgIHZhciBjdHggPSB7IGV2
ZTogZXZlLCBtc2c6IG1zZywgYXQ6IGF0LCBwdXQ6IHB1dCwgc291bDogc291bCwga2V5OiBrZXksIHZhbDogdmFsLCBzdGF0ZTogc3RhdGUsIGlkOiBpZCwg
bm86IG5vLCBwdWI6IG51bGwgfTtcblxuICAgICAgLy8gUm91dGU6IGRldGVybWluZSB3aGljaCBmZWF0dXJlIHN0YWdlIHRvIHJ1biBhZnRlciBmb3JnZXRc
biAgICAgIHZhciBwaXBlbGluZSA9IFtjaGVjay5waXBlLmZvcmdldF07XG5cbiAgICAgIGlmKCd+QCcgPT09IHNvdWwpe1xuICAgICAgICBwaXBlbGluZS5w
dXNoKGNoZWNrLnBpcGUuYWxpYXMpO1xuICAgICAgfSBlbHNlIGlmKCd+QCcgPT09IHNvdWwuc2xpY2UoMCwyKSl7XG4gICAgICAgIHBpcGVsaW5lLnB1c2go
Y2hlY2sucGlwZS5wdWJzKTtcbiAgICAgIH0gZWxzZSBpZignficgPT09IHNvdWwgfHwgJ34vJyA9PT0gc291bC5zbGljZSgwLDIpKXtcbiAgICAgICAgcGlw
ZWxpbmUucHVzaChjaGVjay5waXBlLnNoYXJkKTtcbiAgICAgIH0gZWxzZSBpZih0bXAgPSBTRUEub3B0LnB1Yihzb3VsKSl7XG4gICAgICAgIGN0eC5wdWIg
PSB0bXA7XG4gICAgICAgIHBpcGVsaW5lLnB1c2goY2hlY2sucGlwZS5wdWIpO1xuICAgICAgfSBlbHNlIGlmKDAgPD0gc291bC5pbmRleE9mKCcjJykpe1xu
ICAgICAgICBwaXBlbGluZS5wdXNoKGNoZWNrLnBpcGUuaGFzaCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwaXBlbGluZS5wdXNoKGNoZWNrLnBpcGUu
YW55KTtcbiAgICAgIH1cblxuICAgICAgLy8gS2VlcCByZWZlcmVuY2UgdG8gdGhlIHJlcXVpcmVkIHNlY3VyaXR5IHN0YWdlIGJlZm9yZSBwbHVnaW5zIGNh
biB0b3VjaCB0aGUgYXJyYXlcbiAgICAgIHZhciByZXF1aXJlZCA9IHBpcGVsaW5lWzFdO1xuXG4gICAgICAvLyBBbGxvdyBwbHVnaW5zIHRvIGF1Z21lbnQv
cmVvcmRlciB0aGUgcGlwZWxpbmVcbiAgICAgIGZvcih2YXIgcGkgPSAwOyBwaSA8IGNoZWNrLnBsdWdpbnMubGVuZ3RoOyBwaSsrKXtcbiAgICAgICAgY2hl
Y2sucGx1Z2luc1twaV0oY3R4LCBwaXBlbGluZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEd1YXJkOiBlbnN1cmUgdGhlIHJvdXRpbmcgc2VjdXJpdHkgc3Rh
Z2Ugd2FzIG5vdCByZW1vdmVkIGJ5IGEgcGx1Z2luXG4gICAgICBpZihyZXF1aXJlZCAmJiBwaXBlbGluZS5pbmRleE9mKHJlcXVpcmVkKSA8IDApeyByZXR1
cm4gbm8oXCJTZWN1cml0eSBzdGFnZSByZW1vdmVkLlwiKTsgfVxuXG4gICAgICBjaGVjay5ydW4ocGlwZWxpbmUsIGN0eCk7XG4gICAgfVxuXG4gICAgLy8g
LS0tLS0tLS0tLS0tLS0tIFBpcGVsaW5lIHJ1bm5lciAtLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBFYWNoIHN0YWdlIGlzIGZuKGN0eCwgbmV4dCwgcmVqZWN0
KSB3aGVyZTpcbiAgICAvLyAgIG5leHQoKSAgICAgICA9IGFkdmFuY2UgdG8gdGhlIG5leHQgc3RhZ2UgKG9yIENPTU1JVCBpZiBsYXN0KVxuICAgIC8vICAg
cmVqZWN0KHdoeSkgID0gY2FsbCBubyh3aHkpIGFuZCBzdG9wXG4gICAgLy8gQSBzdGFnZSB0aGF0IGRvZXMgTk9UIGNhbGwgbmV4dCgpIG9yIHJlamVjdCgp
IG11c3QgaGFuZGxlIGZvcndhcmRpbmcgaXRzZWxmXG4gICAgLy8gKGUuZy4gc3RhZ2VzIHRoYXQgY2FsbCBldmUudG8ubmV4dChtc2cpIGRpcmVjdGx5KS5c
biAgICBjaGVjay5ydW4gPSBmdW5jdGlvbihzdGFnZXMsIGN0eCkge1xuICAgICAgdmFyIG5vID0gY3R4Lm5vOyAvLyBzbmFwc2hvdDogcHJldmVudCBjdHgu
bm8gbXV0YXRpb24gZnJvbSBieXBhc3NpbmcgcmVqZWN0aW9uXG4gICAgICB2YXIgaSA9IDA7XG4gICAgICB2YXIgbmV4dCA9IGZ1bmN0aW9uKCkge1xuICAg
ICAgICBpZiAoaSA+PSBzdGFnZXMubGVuZ3RoKSByZXR1cm47IC8vIGFsbCBzdGFnZXMgY29uc3VtZWQsIGRvbmVcbiAgICAgICAgdmFyIHN0YWdlID0gc3Rh
Z2VzW2krK107XG4gICAgICAgIHZhciBzcGVudCA9IGZhbHNlOyAvLyBndWFyZDogZWFjaCBzdGFnZSBtYXkgYWR2YW5jZSB0aGUgcGlwZWxpbmUgYXQgbW9z
dCBvbmNlXG4gICAgICAgIHZhciBvbmNlID0gZnVuY3Rpb24oKXsgaWYoIXNwZW50KXsgc3BlbnQgPSB0cnVlOyBuZXh0KCk7IH0gfTtcbiAgICAgICAgdHJ5
IHsgc3RhZ2UoY3R4LCBvbmNlLCBubyk7IH0gY2F0Y2goZSkgeyBubyhlICYmIGUubWVzc2FnZSB8fCBTdHJpbmcoZSkpOyB9XG4gICAgICB9O1xuICAgICAg
bmV4dCgpO1xuICAgIH07XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0gUGlwZWxpbmUgc3RhZ2VzIChjaGVjay5waXBlLjxuYW1lPikgLS0tLS0tLS0tLS0t
LS0tXG4gICAgLy8gRWFjaCBzdGFnZTogZm4oY3R4LCBuZXh0LCByZWplY3QpXG4gICAgY2hlY2sucGlwZSA9IHtcbiAgICAgIGZhaXRoOiBmdW5jdGlvbihj
dHgsIG5leHQsIHJlamVjdCkge1xuICAgICAgICB2YXIgZXZlID0gY3R4LmV2ZSwgbXNnID0gY3R4Lm1zZywgcHV0ID0gY3R4LnB1dCwgYXQgPSBjdHguYXQ7
XG4gICAgICAgIFNFQS5vcHQucGFjayhwdXQsIGZ1bmN0aW9uKHJhdyl7XG4gICAgICAgICAgU0VBLnZlcmlmeShyYXcsIGZhbHNlLCBmdW5jdGlvbihkYXRh
KXtcbiAgICAgICAgICAgIHB1dFsnPSddID0gU0VBLm9wdC51bnBhY2soZGF0YSk7XG4gICAgICAgICAgICBldmUudG8ubmV4dChtc2cpO1xuICAgICAgICAg
IH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBmb3JnZXQ6IGZ1bmN0aW9uKGN0eCwgbmV4dCwgcmVqZWN0KSB7XG4gICAgICAgIHZhciBzb3Vs
ID0gY3R4LnNvdWwsIHN0YXRlID0gY3R4LnN0YXRlLCBtc2cgPSBjdHgubXNnLCB0bXA7XG4gICAgICAgIGlmKDAgPD0gc291bC5pbmRleE9mKCc8PycpKXtc
biAgICAgICAgICAvLyAnYX5wdWIua2V5L2I8PzknXG4gICAgICAgICAgdG1wID0gcGFyc2VGbG9hdChzb3VsLnNwbGl0KCc8PycpWzFdfHwnJyk7XG4gICAg
ICAgICAgaWYodG1wICYmIChzdGF0ZSA8IChHdW4uc3RhdGUoKSAtICh0bXAgKiAxMDAwKSkpKXsgLy8gc2VjIHRvIG1zXG4gICAgICAgICAgICAodG1wID0g
bXNnLl8pICYmICh0bXAuc3R1bikgJiYgKHRtcC5zdHVuLS0pOyAvLyBUSElTIElTIEJBRCBDT0RFISBJdCBhc3N1bWVzIEdVTiBpbnRlcm5hbHMgZG8gc29t
ZXRoaW5nIHRoYXQgd2lsbCBwcm9iYWJseSBjaGFuZ2UgaW4gZnV0dXJlLCBidXQgaGFja2luZyBpbiBub3cuXG4gICAgICAgICAgICByZXR1cm47IC8vIG9t
aXQg4oCUIGRvIE5PVCBjYWxsIG5leHQoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBuZXh0KCk7XG4gICAgICB9LFxuICAgICAgYWxpYXM6
ICBmdW5jdGlvbihjdHgsIG5leHQsIHJlamVjdCkgeyBjaGVjay5hbGlhcyhjdHguZXZlLCBjdHgubXNnLCBjdHgudmFsLCBjdHgua2V5LCBjdHguc291bCwg
Y3R4LmF0LCByZWplY3QpOyB9LFxuICAgICAgcHViczogICBmdW5jdGlvbihjdHgsIG5leHQsIHJlamVjdCkgeyBjaGVjay5wdWJzKGN0eC5ldmUsIGN0eC5t
c2csIGN0eC52YWwsIGN0eC5rZXksIGN0eC5zb3VsLCBjdHguYXQsIHJlamVjdCk7IH0sXG4gICAgICBzaGFyZDogIGZ1bmN0aW9uKGN0eCwgbmV4dCwgcmVq
ZWN0KSB7IGNoZWNrLnNoYXJkKGN0eC5ldmUsIGN0eC5tc2csIGN0eC52YWwsIGN0eC5rZXksIGN0eC5zb3VsLCBjdHguYXQsIHJlamVjdCwgY3R4LmF0LnVz
ZXJ8fCcnKTsgfSxcbiAgICAgIHB1YjogICAgZnVuY3Rpb24oY3R4LCBuZXh0LCByZWplY3QpIHsgY2hlY2sucHViKGN0eC5ldmUsIGN0eC5tc2csIGN0eC52
YWwsIGN0eC5rZXksIGN0eC5zb3VsLCBjdHguYXQsIHJlamVjdCwgY3R4LmF0LnVzZXJ8fCcnLCBjdHgucHViKTsgfSxcbiAgICAgIGhhc2g6ICAgZnVuY3Rp
b24oY3R4LCBuZXh0LCByZWplY3QpIHsgY2hlY2suaGFzaChjdHguZXZlLCBjdHgubXNnLCBjdHgudmFsLCBjdHgua2V5LCBjdHguc291bCwgY3R4LmF0LCBy
ZWplY3QpOyB9LFxuICAgICAgYW55OiAgICBmdW5jdGlvbihjdHgsIG5leHQsIHJlamVjdCkgeyBjaGVjay5hbnkoY3R4LmV2ZSwgY3R4Lm1zZywgY3R4LnZh
bCwgY3R4LmtleSwgY3R4LnNvdWwsIGN0eC5hdCwgcmVqZWN0LCBjdHguYXQudXNlcnx8JycpOyB9XG4gICAgfTtcblxuICAgIE9iamVjdC5mcmVlemUoY2hl
Y2sucGlwZSk7IC8vIHByZXZlbnQgcmVwbGFjZW1lbnQgb2YgYnVpbHQtaW4gc2VjdXJpdHkgc3RhZ2VzXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0gUGx1
Z2luIHJlZ2lzdHJ5IC0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFBsdWdpbnMgcmVjZWl2ZSAoY3R4LCBwaXBlbGluZSkgYW5kIG1heSBpbnNlcnQvcmVvcmRl
ciBzdGFnZXMuXG4gICAgLy8gTk9URTogcGx1Z2lucyBjYW5ub3QgcmVtb3ZlIHRoZSByb3V0aW5nIHNlY3VyaXR5IHN0YWdlICh2YWxpZGF0ZWQgaW4gY2hl
Y2soKSkuXG4gICAgY2hlY2sucGx1Z2lucyA9IFtdO1xuICAgIGNoZWNrLnVzZSA9IGZ1bmN0aW9uKGZuKSB7IGNoZWNrLnBsdWdpbnMucHVzaChmbik7IH07
XG4gICAgU0VBLmNoZWNrID0gY2hlY2s7XG5cbiAgICAvLyBWZXJpZnkgY29udGVudC1hZGRyZXNzZWQgZGF0YSBtYXRjaGVzIGl0cyBoYXNoXG4gICAgY2hl
Y2suaGFzaCA9IGZ1bmN0aW9uIChldmUsIG1zZywgdmFsLCBrZXksIHNvdWwsIGF0LCBubywgeWVzKSB7XG4gICAgICBmdW5jdGlvbiBiYXNlNjRUb0hleChk
YXRhKSB7XG4gICAgICAgIHZhciBiaW5hcnlTdHIgPSBhdG9iKGRhdGEpO1xuICAgICAgICB2YXIgYSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsg
aSA8IGJpbmFyeVN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBoZXggPSBiaW5hcnlTdHIuY2hhckNvZGVBdChpKS50b1N0cmluZygxNik7XG4g
ICAgICAgICAgYS5wdXNoKGhleC5sZW5ndGggPT09IDEgPyBcIjBcIiArIGhleCA6IGhleCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGEuam9pbihc
IlwiKTtcbiAgICAgIH1cbiAgICAgIHZhciBoYXNoID0ga2V5LnNwbGl0KCcjJykucG9wKCk7XG4gICAgICB5ZXMgPSB5ZXMgfHwgZnVuY3Rpb24oKXsgZXZl
LnRvLm5leHQobXNnKSB9O1xuICAgICAgaWYoIWhhc2ggfHwgaGFzaCA9PT0ga2V5KXsgcmV0dXJuIHllcygpIH1cbiAgICAgIFNFQS53b3JrKHZhbCwgbnVs
bCwgZnVuY3Rpb24gKGI2NGhhc2gpIHtcbiAgICAgICAgdmFyIGhleGhhc2ggPSBiYXNlNjRUb0hleChiNjRoYXNoKSwgYjY0c2xpY2UgPSBiNjRoYXNoLnNs
aWNlKC0yMCksIGhleHNsaWNlID0gaGV4aGFzaC5zbGljZSgtMjApO1xuICAgICAgICBpZiAoW2I2NGhhc2gsIGI2NHNsaWNlLCBoZXhoYXNoLCBoZXhzbGlj
ZV0uc29tZShpdGVtID0+IGl0ZW0uZW5kc1dpdGgoaGFzaCkpKSByZXR1cm4geWVzKCk7XG4gICAgICAgIG5vKFwiRGF0YSBoYXNoIG5vdCBzYW1lIGFzIGhh
c2ghXCIpO1xuICAgICAgfSwgeyBuYW1lOiAnU0hBLTI1NicgfSk7XG4gICAgfVxuICAgIGNoZWNrLmFsaWFzID0gZnVuY3Rpb24oZXZlLCBtc2csIHZhbCwg
a2V5LCBzb3VsLCBhdCwgbm8peyAvLyBFeGFtcGxlOiB7XzojfkAsIH5AYWxpY2U6IHsjfkBhbGljZX19XG4gICAgICBpZighdmFsKXsgcmV0dXJuIG5vKFwi
RGF0YSBtdXN0IGV4aXN0IVwiKSB9IC8vIGRhdGEgTVVTVCBleGlzdFxuICAgICAgaWYoJ35AJytrZXkgPT09IGxpbmtfaXModmFsKSl7IHJldHVybiBldmUu
dG8ubmV4dChtc2cpIH0gLy8gaW4gZmFjdCwgaXQgbXVzdCBiZSBFWEFDVExZIGVxdWFsIHRvIGl0c2VsZlxuICAgICAgbm8oXCJBbGlhcyBub3Qgc2FtZSFc
Iik7IC8vIGlmIGl0IGlzbid0LCByZWplY3QuXG4gICAgfTtcbiAgICBjaGVjay5wdWJzID0gZnVuY3Rpb24oZXZlLCBtc2csIHZhbCwga2V5LCBzb3VsLCBh
dCwgbm8peyAvLyBFeGFtcGxlOiB7XzojfkBhbGljZSwgfmFzZGY6IHsjfmFzZGZ9fVxuICAgICAgaWYoIXZhbCl7IHJldHVybiBubyhcIkFsaWFzIG11c3Qg
ZXhpc3QhXCIpIH0gLy8gZGF0YSBNVVNUIGV4aXN0XG4gICAgICBpZihrZXkgPT09IGxpbmtfaXModmFsKSl7IHJldHVybiBldmUudG8ubmV4dChtc2cpIH0g
Ly8gYW5kIHRoZSBJRCBtdXN0IGJlIEVYQUNUTFkgZXF1YWwgdG8gaXRzIHByb3BlcnR5XG4gICAgICBubyhcIkFsaWFzIG5vdCBzYW1lIVwiKTsgLy8gdGhh
dCB3YXkgbm9ib2R5IGNhbiB0YW1wZXIgd2l0aCB0aGUgbGlzdCBvZiBwdWJsaWMga2V5cy5cbiAgICB9O1xuICAgIGNoZWNrLiRzaCA9IHtcbiAgICAgIHB1
YjogODgsXG4gICAgICBjdXQ6IDIsXG4gICAgICBtaW46IDEsXG4gICAgICByb290OiAnficsXG4gICAgICBwcmU6ICd+LycsXG4gICAgICBiYWQ6IC9bXjAt
OWEtekEtWl0vXG4gICAgfVxuICAgIGNoZWNrLiRzaC5tYXggPSBNYXRoLmNlaWwoY2hlY2suJHNoLnB1YiAvIGNoZWNrLiRzaC5jdXQpXG4gICAgY2hlY2su
JHNlZyA9IGZ1bmN0aW9uKHNlZywgc2hvcnQpe1xuICAgICAgaWYoJ3N0cmluZycgIT0gdHlwZW9mIHNlZyB8fCAhc2VnKXsgcmV0dXJuIH1cbiAgICAgIGlm
KHNob3J0KXtcbiAgICAgICAgaWYoc2VnLmxlbmd0aCA8IGNoZWNrLiRzaC5taW4gfHwgc2VnLmxlbmd0aCA+IGNoZWNrLiRzaC5jdXQpeyByZXR1cm4gfVxu
ICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYoc2VnLmxlbmd0aCAhPT0gY2hlY2suJHNoLmN1dCl7IHJldHVybiB9XG4gICAgICB9XG4gICAgICBpZihjaGVj
ay4kc2guYmFkLnRlc3Qoc2VnKSl7IHJldHVybiB9XG4gICAgICByZXR1cm4gMVxuICAgIH1cbiAgICBjaGVjay4kcGF0aCA9IGZ1bmN0aW9uKHNvdWwpe1xu
ICAgICAgaWYoY2hlY2suJHNoLnJvb3QgPT09IHNvdWwpeyByZXR1cm4gW10gfVxuICAgICAgaWYoY2hlY2suJHNoLnByZSAhPT0gKHNvdWx8fCcnKS5zbGlj
ZSgwLDIpKXsgcmV0dXJuIH1cbiAgICAgIGlmKCcvJyA9PT0gc291bC5zbGljZSgtMSkgfHwgMCA8PSBzb3VsLmluZGV4T2YoJy8vJykpeyByZXR1cm4gfVxu
ICAgICAgdmFyIHBhdGggPSBzb3VsLnNsaWNlKDIpLnNwbGl0KCcvJyksIGkgPSAwLCBzZWc7XG4gICAgICBmb3IoaTsgaSA8IHBhdGgubGVuZ3RoOyBpKysp
e1xuICAgICAgICBzZWcgPSBwYXRoW2ldO1xuICAgICAgICBpZighY2hlY2suJHNlZyhzZWcpKXsgcmV0dXJuIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBw
YXRoXG4gICAgfVxuICAgIGNoZWNrLiRraWQgPSBmdW5jdGlvbihzb3VsLCBrZXkpe1xuICAgICAgaWYoY2hlY2suJHNoLnJvb3QgPT09IHNvdWwpeyByZXR1
cm4gY2hlY2suJHNoLnByZSArIGtleSB9XG4gICAgICByZXR1cm4gc291bCArICcvJyArIGtleVxuICAgIH1cbiAgICBjaGVjay4kcHViID0gZnVuY3Rpb24o
c291bCwga2V5KXtcbiAgICAgIHZhciBwYXRoID0gY2hlY2suJHBhdGgoc291bCk7XG4gICAgICBpZighcGF0aCl7IHJldHVybiB9XG4gICAgICByZXR1cm4g
cGF0aC5qb2luKCcnKSArIGtleVxuICAgIH1cbiAgICBjaGVjay4kbGVhZiA9IGZ1bmN0aW9uKHNvdWwsIGtleSl7XG4gICAgICB2YXIgcHViID0gY2hlY2su
JHB1Yihzb3VsLCBrZXkpO1xuICAgICAgaWYoIXB1YiB8fCBwdWIubGVuZ3RoICE9PSBjaGVjay4kc2gucHViKXsgcmV0dXJuIH1cbiAgICAgIGlmKFNFQS5v
cHQucHViKCd+JyArIHB1YikgIT09IHB1Yil7IHJldHVybiB9XG4gICAgICByZXR1cm4gcHViXG4gICAgfVxuICAgIGNoZWNrLiRzZWEgPSBmdW5jdGlvbiht
c2csIHVzZXIsIHB1Yil7XG4gICAgICB2YXIgY3R4ID0gKG1zZy5fLm1zZyB8fCB7fSkub3B0IHx8IHt9XG4gICAgICB2YXIgb3B0ID0gbXNnLl8uc2VhIHx8
IChmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbyA9IE9iamVjdC5hc3NpZ24oe30sIGN0eClcbiAgICAgICAgdHJ5e1xuICAgICAgICAgIE9iamVjdC5kZWZp
bmVQcm9wZXJ0eShtc2cuXywgJ3NlYScsIHt2YWx1ZTogbywgZW51bWVyYWJsZTogZmFsc2UsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWV9
KVxuICAgICAgICB9Y2F0Y2goZSl7IG1zZy5fLnNlYSA9IG8gfVxuICAgICAgICByZXR1cm4gb1xuICAgICAgfSgpKVxuICAgICAgdmFyIHNlYSA9ICh1c2Vy
ICYmIHVzZXIuXykgfHwge31cbiAgICAgIHZhciBpcyA9ICh1c2VyICYmIHVzZXIuaXMpIHx8IHt9XG4gICAgICB2YXIgYXV0aGVudGljYXRvciA9IG9wdC5h
dXRoZW50aWNhdG9yIHx8IHNlYS5zZWFcbiAgICAgIHZhciB1cHViID0gb3B0LnB1YiB8fCAoYXV0aGVudGljYXRvciB8fCB7fSkucHViIHx8IGlzLnB1YiB8
fCBwdWJcbiAgICAgIGlmICghbXNnLl8uZG9uZSkge1xuICAgICAgICBkZWxldGUgY3R4LmF1dGhlbnRpY2F0b3I7IGRlbGV0ZSBjdHgucHViXG4gICAgICAg
IG1zZy5fLmRvbmUgPSB0cnVlXG4gICAgICB9XG4gICAgICByZXR1cm4ge29wdCwgYXV0aGVudGljYXRvciwgdXB1Yn1cbiAgICB9XG4gICAgY2hlY2suc2hh
cmQgPSBhc3luYyBmdW5jdGlvbihldmUsIG1zZywgdmFsLCBrZXksIHNvdWwsIGF0LCBubywgdXNlcil7XG4gICAgICB2YXIgcGF0aCA9IGNoZWNrLiRwYXRo
KHNvdWwpLCBsaW5rID0gbGlua19pcyh2YWwpLCBleHBlY3RlZCwgbGVhZiwgcmF3LCBjbGFpbTtcbiAgICAgIGlmKCFwYXRoKXsgcmV0dXJuIG5vKFwiSW52
YWxpZCBzaGFyZCBzb3VsIHBhdGguXCIpIH1cbiAgICAgIGlmKCFjaGVjay4kc2VnKGtleSwgMSkpeyByZXR1cm4gbm8oXCJJbnZhbGlkIHNoYXJkIGtleS5c
IikgfVxuICAgICAgaWYoKHBhdGgubGVuZ3RoICsgMSkgPiBjaGVjay4kc2gubWF4KXsgcmV0dXJuIG5vKFwiSW52YWxpZCBzaGFyZCBkZXB0aC5cIikgfVxu
ICAgICAgbGVhZiA9IGNoZWNrLiRsZWFmKHNvdWwsIGtleSlcbiAgICAgIGlmKGxlYWYpe1xuICAgICAgICBpZighbGluayl7IHJldHVybiBubyhcIlNoYXJk
IGxlYWYgdmFsdWUgbXVzdCBiZSBhIGxpbmsuXCIpIH1cbiAgICAgICAgaWYobGluayAhPT0gJ34nICsgbGVhZil7IHJldHVybiBubyhcIlNoYXJkIGxlYWYg
bGluayBtdXN0IHBvaW50IHRvIH5wdWIuXCIpIH1cbiAgICAgICAgLy8gQWx3YXlzIHNpZ24gZnJlc2gg4oCUIGF1dGhlbnRpY2F0b3IgcmVxdWlyZWQ7IHNp
ZyBjb3ZlcnMgc3RhdGUsIHByZXZlbnRpbmcgcHJlLXNpZ25lZCB3cml0ZXNcbiAgICAgICAgdmFyIGxzZWMgPSBjaGVjay4kc2VhKG1zZywgdXNlciwgbGVh
ZilcbiAgICAgICAgdmFyIGxhdXRoZW50aWNhdG9yID0gbHNlYy5hdXRoZW50aWNhdG9yXG4gICAgICAgIHZhciBsdXB1YiA9IGxzZWMudXB1YiB8fCAobGF1
dGhlbnRpY2F0b3J8fHt9KS5wdWJcbiAgICAgICAgaWYoIWxhdXRoZW50aWNhdG9yKXsgcmV0dXJuIG5vKFwiU2hhcmQgbGVhZiByZXF1aXJlcyBhdXRoZW50
aWNhdG9yLlwiKSB9XG4gICAgICAgIGlmKGx1cHViICE9PSBsZWFmKXsgcmV0dXJuIG5vKFwiU2hhcmQgbGVhZiBhdXRoZW50aWNhdG9yIHB1YiBtaXNtYXRj
aC5cIikgfVxuICAgICAgICBjaGVjay5hdXRoKG1zZywgbm8sIGxhdXRoZW50aWNhdG9yLCBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICBpZihsaW5rX2lz
KGRhdGEpICE9PSBsaW5rKXsgcmV0dXJuIG5vKFwiU2hhcmQgbGVhZiBzaWduZWQgcGF5bG9hZCBtaXNtYXRjaC5cIikgfVxuICAgICAgICAgIG1zZy5wdXRb
Jz0nXSA9IHsnIyc6IGxpbmt9XG4gICAgICAgICAgY2hlY2submV4dChldmUsIG1zZywgbm8pXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVyblxuICAgICAg
fVxuICAgICAgLy8gSW50ZXJtZWRpYXRlXG4gICAgICBleHBlY3RlZCA9IGNoZWNrLiRraWQoc291bCwga2V5KVxuICAgICAgdmFyIHByZWZpeCA9IGNoZWNr
LiRwdWIoc291bCwga2V5KVxuICAgICAgcmF3ID0gbGluayA/IHt9IDogKChhd2FpdCBTLnBhcnNlKHZhbCkpIHx8IHt9KVxuICAgICAgY2xhaW0gPSAocmF3
ICYmIHR5cGVvZiByYXcgPT09ICdvYmplY3QnKSA/IHJhd1snKiddIDogdW5kZWZpbmVkXG4gICAgICBpZighY2xhaW0pe1xuICAgICAgICAvLyBGcmVzaCBj
bGllbnQgd3JpdGUg4oCUIGF1dGhlbnRpY2F0b3IgcmVxdWlyZWQ7IFNFQS5vcHQucGFjayBiaW5kcyBzaWcgdG8gR3VuIHN0YXRlXG4gICAgICAgIGlmKCFs
aW5rKXsgcmV0dXJuIG5vKFwiU2hhcmQgaW50ZXJtZWRpYXRlIHZhbHVlIG11c3QgYmUgbGluay5cIikgfVxuICAgICAgICBpZihsaW5rICE9PSBleHBlY3Rl
ZCl7IHJldHVybiBubyhcIkludmFsaWQgc2hhcmQgbGluayB0YXJnZXQuXCIpIH1cbiAgICAgICAgdmFyIHNlYyA9IGNoZWNrLiRzZWEobXNnLCB1c2VyKVxu
ICAgICAgICB2YXIgYXV0aGVudGljYXRvciA9IHNlYy5hdXRoZW50aWNhdG9yXG4gICAgICAgIGNsYWltID0gc2VjLnVwdWIgfHwgKChhdXRoZW50aWNhdG9y
fHx7fSkucHViKVxuICAgICAgICBpZighYXV0aGVudGljYXRvcil7IHJldHVybiBubyhcIlNoYXJkIGludGVybWVkaWF0ZSByZXF1aXJlcyBhdXRoZW50aWNh
dG9yLlwiKSB9XG4gICAgICAgIGlmKCdzdHJpbmcnICE9PSB0eXBlb2YgY2xhaW0gfHwgY2xhaW0ubGVuZ3RoICE9PSBjaGVjay4kc2gucHViKXsgcmV0dXJu
IG5vKFwiSW52YWxpZCBzaGFyZCBpbnRlcm1lZGlhdGUgcHViLlwiKSB9XG4gICAgICAgIGlmKFNFQS5vcHQucHViKCd+JyArIGNsYWltKSAhPT0gY2xhaW0p
eyByZXR1cm4gbm8oXCJJbnZhbGlkIHNoYXJkIGludGVybWVkaWF0ZSBwdWIgZm9ybWF0LlwiKSB9XG4gICAgICAgIGlmKDAgIT09IGNsYWltLmluZGV4T2Yo
cHJlZml4KSl7IHJldHVybiBubyhcIlNoYXJkIHB1YiBwcmVmaXggbWlzbWF0Y2guXCIpIH1cbiAgICAgICAgY2hlY2suYXV0aChtc2csIG5vLCBhdXRoZW50
aWNhdG9yLCBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICBpZihsaW5rX2lzKGRhdGEpICE9PSBleHBlY3RlZCl7IHJldHVybiBubyhcIlNoYXJkIGludGVy
bWVkaWF0ZSBzaWduZWQgcGF5bG9hZCBtaXNtYXRjaC5cIikgfVxuICAgICAgICAgIG1zZy5wdXRbJzonXVsnKiddID0gY2xhaW0gIC8vIGFwcGVuZCBmdWxs
UHViIHRvIHsnOic6bGluaywnfic6c2lnfSBzZXQgYnkgY2hlY2suYXV0aFxuICAgICAgICAgIG1zZy5wdXRbJz0nXSA9IHsnIyc6IGV4cGVjdGVkfVxuICAg
ICAgICAgIGNoZWNrLm5leHQoZXZlLCBtc2csIG5vKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIC8vIFBlZXIgcmUtcmVh
ZDogc3RvcmVkIGVudmVsb3BlIHsnOic6IGxpbmssICd+Jzogc2lnLCAnKic6IGZ1bGxQdWJ9XG4gICAgICAvLyBTa2lwIGlmIGxvY2FsIGdyYXBoIGFscmVh
ZHkgaGFzIGEgdmFsaWQgbGluayBmb3IgdGhpcyBzbG90IOKAlCBhdm9pZCByZWR1bmRhbnQgdmVyaWZ5K3dyaXRlXG4gICAgICB2YXIgZXhpc3RpbmcgPSAo
KGF0LmdyYXBofHx7fSlbc291bF18fHt9KVtrZXldXG4gICAgICBpZihleGlzdGluZyl7XG4gICAgICAgIHZhciBleGlzdGluZ1BhcnNlZCA9IGF3YWl0IFMu
cGFyc2UoZXhpc3RpbmcpXG4gICAgICAgIGlmKGV4aXN0aW5nUGFyc2VkICYmIGxpbmtfaXMoZXhpc3RpbmdQYXJzZWRbJzonXSkgPT09IGV4cGVjdGVkKXtc
biAgICAgICAgICBtc2cucHV0Wyc9J10gPSB7JyMnOiBleHBlY3RlZH1cbiAgICAgICAgICByZXR1cm4gZXZlLnRvLm5leHQobXNnKVxuICAgICAgICB9XG4g
ICAgICB9XG4gICAgICBpZignc3RyaW5nJyAhPT0gdHlwZW9mIGNsYWltIHx8IGNsYWltLmxlbmd0aCAhPT0gY2hlY2suJHNoLnB1Yil7IHJldHVybiBubyhc
IkludmFsaWQgc2hhcmQgaW50ZXJtZWRpYXRlIHB1Yi5cIikgfVxuICAgICAgaWYoU0VBLm9wdC5wdWIoJ34nICsgY2xhaW0pICE9PSBjbGFpbSl7IHJldHVy
biBubyhcIkludmFsaWQgc2hhcmQgaW50ZXJtZWRpYXRlIHB1YiBmb3JtYXQuXCIpIH1cbiAgICAgIGlmKDAgIT09IGNsYWltLmluZGV4T2YocHJlZml4KSl7
IHJldHVybiBubyhcIlNoYXJkIHB1YiBwcmVmaXggbWlzbWF0Y2guXCIpIH1cbiAgICAgIGlmKGxpbmtfaXMocmF3Wyc6J10pICE9PSBleHBlY3RlZCl7IHJl
dHVybiBubyhcIkludmFsaWQgc2hhcmQgbGluayB0YXJnZXQuXCIpIH1cbiAgICAgIFNFQS5vcHQucGFjayhtc2cucHV0LCBmdW5jdGlvbihwYWNrZWQpe1xu
ICAgICAgICBTRUEudmVyaWZ5KHBhY2tlZCwgY2xhaW0sIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgIGRhdGEgPSBTRUEub3B0LnVucGFjayhkYXRhKVxu
ICAgICAgICAgIGlmKHUgPT09IGRhdGEpeyByZXR1cm4gbm8oXCJJbnZhbGlkIHNoYXJkIGludGVybWVkaWF0ZSBzaWduYXR1cmUuXCIpIH1cbiAgICAgICAg
ICBpZihsaW5rX2lzKGRhdGEpICE9PSBleHBlY3RlZCl7IHJldHVybiBubyhcIlNoYXJkIGludGVybWVkaWF0ZSBwYXlsb2FkIG1pc21hdGNoLlwiKSB9XG4g
ICAgICAgICAgbXNnLnB1dFsnPSddID0gZGF0YVxuICAgICAgICAgIGV2ZS50by5uZXh0KG1zZykgIC8vIHZhbCBhbHJlYWR5IGEgSlNPTiBzdHJpbmcg4oCU
IGZvcndhcmQgZGlyZWN0bHlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfTtcbiAgICBjaGVjay4kdmZ5ID0gZnVuY3Rpb24oZXZlLCBtc2csIGtleSwg
c291bCwgcHViLCBubywgY2VydGlmaWNhdGUsIGNlcnRpZmljYW50LCBjYil7XG4gICAgICBpZiAoIShjZXJ0aWZpY2F0ZXx8JycpLm0gfHwgIShjZXJ0aWZp
Y2F0ZXx8JycpLnMgfHwgIWNlcnRpZmljYW50IHx8ICFwdWIpIHsgcmV0dXJuIH1cbiAgICAgIHJldHVybiBTRUEudmVyaWZ5KGNlcnRpZmljYXRlLCBwdWIs
IGRhdGEgPT4geyAvLyBjaGVjayBpZiBcInB1YlwiIChvZiB0aGUgZ3JhcGggb3duZXIpIHJlYWxseSBpc3N1ZWQgdGhpcyBjZXJ0XG4gICAgICAgIGlmICh1
ICE9PSBkYXRhICYmIHUgIT09IGRhdGEuZSAmJiBtc2cucHV0Wyc+J10gJiYgbXNnLnB1dFsnPiddID4gcGFyc2VGbG9hdChkYXRhLmUpKSByZXR1cm4gbm8o
XCJDZXJ0aWZpY2F0ZSBleHBpcmVkLlwiKSAvLyBjZXJ0aWZpY2F0ZSBleHBpcmVkXG4gICAgICAgIC8vIFwiZGF0YS5jXCIgPSBhIGxpc3Qgb2YgY2VydGlm
aWNhbnRzL2NlcnRpZmllZCB1c2Vyc1xuICAgICAgICAvLyBcImRhdGEud1wiID0gbGV4IFdSSVRFIHBlcm1pc3Npb24sIGluIHRoZSBmdXR1cmUsIHRoZXJl
IHdpbGwgYmUgXCJkYXRhLnJcIiB3aGljaCBtZWFucyBsZXggUkVBRCBwZXJtaXNzaW9uXG4gICAgICAgIGlmICh1ICE9PSBkYXRhICYmIGRhdGEuYyAmJiBk
YXRhLncgJiYgKGRhdGEuYyA9PT0gY2VydGlmaWNhbnQgfHwgZGF0YS5jLmluZGV4T2YoJyonKSA+IC0xIHx8IGRhdGEuYy5pbmRleE9mKGNlcnRpZmljYW50
KSA+IC0xKSkge1xuICAgICAgICAgIC8vIG9rLCBub3cgXCJjZXJ0aWZpY2FudFwiIGlzIGluIHRoZSBcImNlcnRpZmljYW50c1wiIGxpc3QsIGJ1dCBpcyBc
InBhdGhcIiBhbGxvd2VkPyBDaGVjayBwYXRoXG4gICAgICAgICAgdmFyIHBhdGggPSBzb3VsLmluZGV4T2YoJy8nKSA+IC0xID8gc291bC5yZXBsYWNlKHNv
dWwuc3Vic3RyaW5nKDAsIHNvdWwuaW5kZXhPZignLycpICsgMSksICcnKSA6ICcnXG4gICAgICAgICAgU3RyaW5nLm1hdGNoID0gU3RyaW5nLm1hdGNoIHx8
IEd1bi50ZXh0Lm1hdGNoXG4gICAgICAgICAgdmFyIHcgPSBBcnJheS5pc0FycmF5KGRhdGEudykgPyBkYXRhLncgOiB0eXBlb2YgZGF0YS53ID09PSAnb2Jq
ZWN0JyB8fCB0eXBlb2YgZGF0YS53ID09PSAnc3RyaW5nJyA/IFtkYXRhLnddIDogW11cbiAgICAgICAgICBmb3IgKGNvbnN0IGxleCBvZiB3KSB7XG4gICAg
ICAgICAgICBpZiAoKFN0cmluZy5tYXRjaChwYXRoLCBsZXhbJyMnXSkgJiYgU3RyaW5nLm1hdGNoKGtleSwgbGV4WycuJ10pKSB8fCAoIWxleFsnLiddICYm
IFN0cmluZy5tYXRjaChwYXRoLCBsZXhbJyMnXSkpIHx8ICghbGV4WycjJ10gJiYgU3RyaW5nLm1hdGNoKGtleSwgbGV4WycuJ10pKSB8fCBTdHJpbmcubWF0
Y2goKHBhdGggPyBwYXRoICsgJy8nICsga2V5IDoga2V5KSwgbGV4WycjJ10gfHwgbGV4KSkge1xuICAgICAgICAgICAgICAvLyBpcyBDZXJ0aWZpY2FudCBm
b3JjZWQgdG8gcHJlc2VudCBpbiBQYXRoXG4gICAgICAgICAgICAgIGlmIChsZXhbJysnXSAmJiBsZXhbJysnXS5pbmRleE9mKCcqJykgPiAtMSAmJiBwYXRo
ICYmIHBhdGguaW5kZXhPZihjZXJ0aWZpY2FudCkgPT0gLTEgJiYga2V5LmluZGV4T2YoY2VydGlmaWNhbnQpID09IC0xKSByZXR1cm4gbm8oYFBhdGggXCIk
e3BhdGh9XCIgb3Iga2V5IFwiJHtrZXl9XCIgbXVzdCBjb250YWluIHN0cmluZyBcIiR7Y2VydGlmaWNhbnR9XCIuYClcbiAgICAgICAgICAgICAgLy8gcGF0
aCBpcyBhbGxvd2VkLCBidXQgaXMgdGhlcmUgYW55IFdSSVRFIGJsb2NrPyBDaGVjayBpdCBvdXRcbiAgICAgICAgICAgICAgaWYgKGRhdGEud2IgJiYgKHR5
cGVvZiBkYXRhLndiID09PSAnc3RyaW5nJyB8fCAoKGRhdGEud2IgfHwge30pWycjJ10pKSkgeyAvLyBcImRhdGEud2JcIiA9IHBhdGggdG8gdGhlIFdSSVRF
IGJsb2NrXG4gICAgICAgICAgICAgICAgdmFyIHJvb3QgPSBldmUuYXMucm9vdC4kLmJhY2soLTEpXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRh
LndiID09PSAnc3RyaW5nJyAmJiAnficgIT09IGRhdGEud2Iuc2xpY2UoMCwgMSkpIHJvb3QgPSByb290LmdldCgnficgKyBwdWIpXG4gICAgICAgICAgICAg
ICAgcmV0dXJuIHJvb3QuZ2V0KGRhdGEud2IpLmdldChjZXJ0aWZpY2FudCkub25jZSh2YWx1ZSA9PiB7IC8vIFRPRE86IElOVEVOVCBUTyBERVBSRUNBVEUu
XG4gICAgICAgICAgICAgICAgICBpZiAodmFsdWUgJiYgKHZhbHVlID09PSAxIHx8IHZhbHVlID09PSB0cnVlKSkgcmV0dXJuIG5vKGBDZXJ0aWZpY2FudCAk
e2NlcnRpZmljYW50fSBibG9ja2VkLmApXG4gICAgICAgICAgICAgICAgICByZXR1cm4gY2IoZGF0YSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAg
ICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBjYihkYXRhKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbm8oXCJD
ZXJ0aWZpY2F0ZSB2ZXJpZmljYXRpb24gZmFpbC5cIilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgY2hlY2submV4dCA9IGZ1bmN0aW9uKGV2
ZSwgbXNnLCBubyl7XG4gICAgICBKU09OLnN0cmluZ2lmeUFzeW5jKG1zZy5wdXRbJzonXSwgZnVuY3Rpb24oZXJyLHMpe1xuICAgICAgICBpZihlcnIpeyBy
ZXR1cm4gbm8oZXJyIHx8IFwiU3RyaW5naWZ5IGVycm9yLlwiKSB9XG4gICAgICAgIG1zZy5wdXRbJzonXSA9IHM7XG4gICAgICAgIHJldHVybiBldmUudG8u
bmV4dChtc2cpO1xuICAgICAgfSlcbiAgICB9XG4gICAgY2hlY2suZ3VhcmQgPSBmdW5jdGlvbihldmUsIG1zZywga2V5LCBzb3VsLCBhdCwgbm8sIGRhdGEs
IG5leHQpe1xuICAgICAgaWYoMCA+IGtleS5pbmRleE9mKCcjJykpeyByZXR1cm4gbmV4dCgpIH1cbiAgICAgIGNoZWNrLmhhc2goZXZlLCBtc2csIGRhdGEs
IGtleSwgc291bCwgYXQsIG5vLCBuZXh0KVxuICAgIH1cbiAgICBjaGVjay5hdXRoID0gZnVuY3Rpb24obXNnLCBubywgYXV0aGVudGljYXRvciwgZG9uZSl7
XG4gICAgICBTRUEub3B0LnBhY2sobXNnLnB1dCwgcGFja2VkID0+IHtcbiAgICAgICAgaWYgKCFhdXRoZW50aWNhdG9yKSByZXR1cm4gbm8oXCJNaXNzaW5n
IGF1dGhlbnRpY2F0b3JcIik7XG4gICAgICAgIFNFQS5zaWduKHBhY2tlZCwgYXV0aGVudGljYXRvciwgYXN5bmMgZnVuY3Rpb24oZGF0YSkge1xuICAgICAg
ICAgIGlmICh1ID09PSBkYXRhKSByZXR1cm4gbm8oU0VBLmVyciB8fCAnU2lnbmF0dXJlIGZhaWwuJylcbiAgICAgICAgICBpZiAoIWRhdGEubSB8fCAhZGF0
YS5zKSByZXR1cm4gbm8oJ0ludmFsaWQgc2lnbmF0dXJlIGZvcm1hdCcpXG4gICAgICAgICAgdmFyIHBhcnNlZCA9IFNFQS5vcHQudW5wYWNrKGRhdGEubSlc
biAgICAgICAgICBtc2cucHV0Wyc6J10gPSB7JzonOiBwYXJzZWQsICd+JzogZGF0YS5zfVxuICAgICAgICAgIG1zZy5wdXRbJz0nXSA9IHBhcnNlZFxuICAg
ICAgICAgIGRvbmUocGFyc2VkKVxuICAgICAgICB9LCB7cmF3OiAxfSlcbiAgICAgIH0pXG4gICAgfVxuICAgIGNoZWNrLiR0YWcgPSBhc3luYyBmdW5jdGlv
bihtc2csIGNlcnQsIHVwdWIsIHZlcmlmeSwgbmV4dCl7XG4gICAgICBjb25zdCBfY2VydCA9IGF3YWl0IFMucGFyc2UoY2VydClcbiAgICAgIGlmIChfY2Vy
dCAmJiBfY2VydC5tICYmIF9jZXJ0LnMpIHZlcmlmeShfY2VydCwgdXB1YiwgXyA9PiB7XG4gICAgICAgIG1zZy5wdXRbJzonXVsnKyddID0gX2NlcnQgLy8g
JysnIGlzIGEgY2VydGlmaWNhdGVcbiAgICAgICAgbXNnLnB1dFsnOiddWycqJ10gPSB1cHViIC8vICcqJyBpcyBwdWIgb2YgdGhlIHVzZXIgd2hvIHB1dHNc
biAgICAgICAgbmV4dCgpXG4gICAgICAgIHJldHVyblxuICAgICAgfSlcbiAgICB9XG4gICAgY2hlY2sucGFzcyA9IGZ1bmN0aW9uKGV2ZSwgbXNnLCByYXcs
IGRhdGEsIHZlcmlmeSl7XG4gICAgICBpZiAocmF3WycrJ10gJiYgcmF3WycrJ11bJ20nXSAmJiByYXdbJysnXVsncyddICYmIHJhd1snKiddKXtcbiAgICAg
ICAgcmV0dXJuIHZlcmlmeShyYXdbJysnXSwgcmF3WycqJ10sIF8gPT4ge1xuICAgICAgICAgIG1zZy5wdXRbJz0nXSA9IGRhdGE7XG4gICAgICAgICAgcmV0
dXJuIGV2ZS50by5uZXh0KG1zZyk7XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBtc2cucHV0Wyc9J10gPSBkYXRhO1xuICAgICAgcmV0dXJuIGV2ZS50
by5uZXh0KG1zZyk7XG4gICAgfVxuICAgIGNoZWNrLnB1YiA9IGFzeW5jIGZ1bmN0aW9uKGV2ZSwgbXNnLCB2YWwsIGtleSwgc291bCwgYXQsIG5vLCB1c2Vy
LCBwdWIsIGNvbmYpeyB2YXIgdG1wIC8vIEV4YW1wbGU6IHtfOiN+YXNkZiwgaGVsbG86J3dvcmxkJ35mZHNhfX1cbiAgICAgIGNvbmYgPSBjb25mIHx8IHt9
XG4gICAgICBjb25zdCB2ZXJpZnkgPSAoY2VydGlmaWNhdGUsIGNlcnRpZmljYW50LCBjYikgPT4gY2hlY2suJHZmeShldmUsIG1zZywga2V5LCBzb3VsLCBw
dWIsIG5vLCBjZXJ0aWZpY2F0ZSwgY2VydGlmaWNhbnQsIGNiKVxuICAgICAgY29uc3QgJG5leHQgPSAoKSA9PiBjaGVjay5uZXh0KGV2ZSwgbXNnLCBubylc
blxuICAgICAgLy8gTG9jYWxpemUgYXV0aCBvcHRpb25zIGludG8gbWVzc2FnZS1wcml2YXRlIFNFQSBjb250ZXh0LlxuICAgICAgY29uc3Qgc2VjID0gY2hl
Y2suJHNlYShtc2csIHVzZXIsIHB1YilcbiAgICAgIGNvbnN0IG9wdCA9IHNlYy5vcHRcbiAgICAgIGNvbnN0IGF1dGhlbnRpY2F0b3IgPSBzZWMuYXV0aGVu
dGljYXRvclxuICAgICAgY29uc3QgdXB1YiA9IHNlYy51cHViXG4gICAgICBjb25zdCBjZXJ0ID0gY29uZi5ub2NlcnQgPyB1IDogb3B0LmNlcnQ7XG4gICAg
ICBjb25zdCAkZXhwZWN0ID0gZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgIGlmKHUgPT09IGNvbmYud2FudCl7IHJldHVybiAxIH1cbiAgICAgICAgaWYoZGF0
YSA9PT0gY29uZi53YW50KXsgcmV0dXJuIDEgfVxuICAgICAgICBubyhjb25mLmVyciB8fCBcIlVuZXhwZWN0ZWQgcGF5bG9hZC5cIilcbiAgICAgIH1cbiAg
ICAgIGNvbnN0IHJhdyA9IChhd2FpdCBTLnBhcnNlKHZhbCkpIHx8IHt9XG4gICAgICBjb25zdCAkaGFzaCA9IGZ1bmN0aW9uKGRhdGEsIG5leHQpe1xuICAg
ICAgICBjaGVjay5ndWFyZChldmUsIG1zZywga2V5LCBzb3VsLCBhdCwgbm8sIGRhdGEsIG5leHQpXG4gICAgICB9XG4gICAgICBjb25zdCAkc2lnbiA9IGFz
eW5jIGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIGlmIHdyaXRpbmcgdG8gb3duIGdyYXBoLCBqdXN0IGFsbG93IGl0XG4gICAgICAgIGlmIChwdWIgPT09IHVw
dWIpIHtcbiAgICAgICAgICBpZiAodG1wID0gbGlua19pcyh2YWwpKSAoYXQuc2VhLm93blt0bXBdID0gYXQuc2VhLm93blt0bXBdIHx8IHt9KVtwdWJdID0g
MVxuICAgICAgICAgICRuZXh0KClcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHdyaXRpbmcgdG8gb3RoZXIncyBncmFw
aCwgY2hlY2sgaWYgY2VydCBleGlzdHMgdGhlbiB0cnkgdG8gaW5qZWN0IGNlcnQgaW50byBwdXQsIGFsc28gaW5qZWN0IHNlbGYgcHViIHNvIHRoYXQgZXZl
cnlvbmUgY2FuIHZlcmlmeSB0aGUgcHV0XG4gICAgICAgIGlmIChwdWIgIT09IHVwdWIgJiYgY2VydCkge1xuICAgICAgICAgIHJldHVybiBjaGVjay4kdGFn
KG1zZywgY2VydCwgdXB1YiwgdmVyaWZ5LCAkbmV4dClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgJHBhc3MgPSBmdW5jdGlvbihkYXRhKXtc
biAgICAgICAgcmV0dXJuIGNoZWNrLnBhc3MoZXZlLCBtc2csIHJhdywgZGF0YSwgdmVyaWZ5KVxuICAgICAgfVxuXG4gICAgICBpZiAoJ3B1YicgPT09IGtl
eSAmJiAnficgKyBwdWIgPT09IHNvdWwpIHtcbiAgICAgICAgaWYgKHZhbCA9PT0gcHViKSByZXR1cm4gZXZlLnRvLm5leHQobXNnKSAvLyB0aGUgYWNjb3Vu
dCBNVVNUIG1hdGNoIGBwdWJgIHByb3BlcnR5IHRoYXQgZXF1YWxzIHRoZSBJRCBvZiB0aGUgcHVibGljIGtleS5cbiAgICAgICAgcmV0dXJuIG5vKFwiQWNj
b3VudCBub3Qgc2FtZSFcIilcbiAgICAgIH1cblxuICAgICAgaWYgKCgodXNlciAmJiB1c2VyLmlzKSB8fCBhdXRoZW50aWNhdG9yKSAmJiB1cHViICYmICFy
YXdbJyonXSAmJiAhcmF3WycrJ10gJiYgKHB1YiA9PT0gdXB1YiB8fCAocHViICE9PSB1cHViICYmIGNlcnQpKSl7XG4gICAgICAgIGNoZWNrLmF1dGgobXNn
LCBubywgYXV0aGVudGljYXRvciwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgaWYoISRleHBlY3QoZGF0YSkpeyByZXR1cm4gfVxuICAgICAgICAgICRo
YXNoKGRhdGEsICRzaWduKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIFNFQS5vcHQucGFjayhtc2cucHV0LCBwYWNr
ZWQgPT4ge1xuICAgICAgICBTRUEudmVyaWZ5KHBhY2tlZCwgcmF3WycqJ10gfHwgcHViLCBmdW5jdGlvbihkYXRhKXsgdmFyIHRtcDtcbiAgICAgICAgICBk
YXRhID0gU0VBLm9wdC51bnBhY2soZGF0YSk7XG4gICAgICAgICAgaWYgKHUgPT09IGRhdGEpIHJldHVybiBubyhcIlVudmVyaWZpZWQgZGF0YS5cIikgLy8g
bWFrZSBzdXJlIHRoZSBzaWduYXR1cmUgbWF0Y2hlcyB0aGUgYWNjb3VudCBpdCBjbGFpbXMgdG8gYmUgb24uIC8vIHJlamVjdCBhbnkgdXBkYXRlcyB0aGF0
IGFyZSBzaWduZWQgd2l0aCBhIG1pc21hdGNoZWQgYWNjb3VudC5cbiAgICAgICAgICBpZighJGV4cGVjdChkYXRhKSl7IHJldHVybiB9XG4gICAgICAgICAg
aWYgKCh0bXAgPSBsaW5rX2lzKGRhdGEpKSAmJiBwdWIgPT09IFNFQS5vcHQucHViKHRtcCkpIChhdC5zZWEub3duW3RtcF0gPSBhdC5zZWEub3duW3RtcF0g
fHwge30pW3B1Yl0gPSAxXG5cbiAgICAgICAgICAkaGFzaChkYXRhLCBmdW5jdGlvbigpeyAkcGFzcyhkYXRhKSB9KVxuICAgICAgICB9KTtcbiAgICAgIH0p
XG4gICAgICByZXR1cm5cbiAgICB9O1xuICAgIGNoZWNrLmFueSA9IGZ1bmN0aW9uKGV2ZSwgbXNnLCB2YWwsIGtleSwgc291bCwgYXQsIG5vLCB1c2VyKXsg
dmFyIHRtcCwgcHViO1xuICAgICAgaWYoYXQub3B0LnNlY3VyZSl7IHJldHVybiBubyhcIlNvdWwgbWlzc2luZyBwdWJsaWMga2V5IGF0ICdcIiArIGtleSAr
IFwiJy5cIikgfVxuICAgICAgLy8gVE9ETzogQXNrIGNvbW11bml0eSBpZiBzaG91bGQgYXV0by1zaWduIG5vbiB1c2VyLWdyYXBoIGRhdGEuXG4gICAgICBh
dC5vbignc2VjdXJlJywgZnVuY3Rpb24obXNnKXsgdGhpcy5vZmYoKTtcbiAgICAgICAgaWYoIWF0Lm9wdC5zZWN1cmUpeyByZXR1cm4gZXZlLnRvLm5leHQo
bXNnKSB9XG4gICAgICAgIG5vKFwiRGF0YSBjYW5ub3QgYmUgY2hhbmdlZC5cIik7XG4gICAgICB9KS5vbi5vbignc2VjdXJlJywgbXNnKTtcbiAgICAgIHJl
dHVybjtcbiAgICB9XG5cbiAgICB2YXIgdmFsaWQgPSBHdW4udmFsaWQsIGxpbmtfaXMgPSBmdW5jdGlvbihkLGwpeyByZXR1cm4gJ3N0cmluZycgPT0gdHlw
ZW9mIChsID0gdmFsaWQoZCkpICYmIGwgfSwgc3RhdGVfaWZ5ID0gKEd1bi5zdGF0ZXx8JycpLmlmeTtcblxuICAgIHZhciBwdWJjdXQgPSAvW15cXHdfLV0v
OyAvLyBrZXB0IGZvciBvbGQtZm9ybWF0IHBhcnNpbmcgYmVsb3dcbiAgICBTRUEub3B0LnB1YiA9IGZ1bmN0aW9uKHMpe1xuICAgICAgaWYoIXMpeyByZXR1
cm4gfVxuICAgICAgcyA9IHMuc3BsaXQoJ34nKVsxXVxuICAgICAgaWYoIXMpeyByZXR1cm4gfVxuICAgICAgaWYoJ0AnID09PSAoc1swXXx8JycpWzBdKXsg
cmV0dXJuIH1cbiAgICAgIC8vIE5ldyBmb3JtYXQ6IDg4IGFscGhhbnVtZXJpYyBjaGFycyAoYmFzZTYyKVxuICAgICAgaWYoL15bQS1aYS16MC05XXs4OH0v
LnRlc3QocykpeyByZXR1cm4gcy5zbGljZSgwLCA4OCkgfVxuICAgICAgLy8gT2xkIGZvcm1hdDogeC55IChiYXNlNjR1cmwsIDg3IGNoYXJzKSDigJQgYmFj
a3dhcmQgY29tcGF0IGZvciBjaGVjay5wdWIgcm91dGluZ1xuICAgICAgdmFyIHBhcnRzID0gcy5zcGxpdChwdWJjdXQpLnNsaWNlKDAsMilcbiAgICAgIGlm
KCFwYXJ0cyB8fCAyICE9PSBwYXJ0cy5sZW5ndGgpeyByZXR1cm4gfVxuICAgICAgcmV0dXJuIHBhcnRzLnNsaWNlKDAsMikuam9pbignLicpXG4gICAgfVxu
ICAgIFNFQS5vcHQuc3RyaW5neSA9IGZ1bmN0aW9uKHQpe1xuICAgICAgLy8gVE9ETzogZW5jcnlwdCBldGMuIG5lZWQgdG8gY2hlY2sgc3RyaW5nIHByaW1p
dGl2ZS4gTWFrZSBhcyBicmVha2luZyBjaGFuZ2UuXG4gICAgfVxuICAgIFNFQS5vcHQucGFjayA9IGZ1bmN0aW9uKGQsY2IsaywgbixzKXsgdmFyIHRtcCwg
ZjsgLy8gcGFjayBmb3IgdmVyaWZ5aW5nXG4gICAgICBpZihTRUEub3B0LmNoZWNrKGQpKXsgcmV0dXJuIGNiKGQpIH1cbiAgICAgIGlmKGQgJiYgZFsnIydd
ICYmIGRbJy4nXSAmJiBkWyc+J10peyB0bXAgPSBkWyc6J107IGYgPSAxIH1cbiAgICAgIEpTT04ucGFyc2VBc3luYyhmPyB0bXAgOiBkLCBmdW5jdGlvbihl
cnIsIG1ldGEpe1xuICAgICAgICB2YXIgc2lnID0gKCh1ICE9PSAobWV0YXx8JycpWyc6J10pICYmIChtZXRhfHwnJylbJ34nXSk7IC8vIG9yIGp1c3QgfiBj
aGVjaz9cbiAgICAgICAgaWYoIXNpZyl7IGNiKGQpOyByZXR1cm4gfVxuICAgICAgICBjYih7bTogeycjJzpzfHxkWycjJ10sJy4nOmt8fGRbJy4nXSwnOic6
KG1ldGF8fCcnKVsnOiddLCc+JzpkWyc+J118fEd1bi5zdGF0ZS5pcyhuLCBrKX0sIHM6IHNpZ30pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHZhciBPID0g
U0VBLm9wdDtcbiAgICBTRUEub3B0LnVucGFjayA9IGZ1bmN0aW9uKGQsIGssIG4peyB2YXIgdG1wO1xuICAgICAgaWYodSA9PT0gZCl7IHJldHVybiB9XG4g
ICAgICBpZihkICYmICh1ICE9PSAodG1wID0gZFsnOiddKSkpeyByZXR1cm4gdG1wIH1cbiAgICAgIGsgPSBrIHx8IE8uZmFsbF9rZXk7IGlmKCFuICYmIE8u
ZmFsbF92YWwpeyBuID0ge307IG5ba10gPSBPLmZhbGxfdmFsIH1cbiAgICAgIGlmKCFrIHx8ICFuKXsgcmV0dXJuIH1cbiAgICAgIGlmKGQgPT09IG5ba10p
eyByZXR1cm4gZCB9XG4gICAgICBpZighU0VBLm9wdC5jaGVjayhuW2tdKSl7IHJldHVybiBkIH1cbiAgICAgIHZhciBzb3VsID0gKG4gJiYgbi5fICYmIG4u
X1snIyddKSB8fCBPLmZhbGxfc291bCwgcyA9IEd1bi5zdGF0ZS5pcyhuLCBrKSB8fCBPLmZhbGxfc3RhdGU7XG4gICAgICBpZihkICYmIDQgPT09IGQubGVu
Z3RoICYmIHNvdWwgPT09IGRbMF0gJiYgayA9PT0gZFsxXSAmJiBmbChzKSA9PT0gZmwoZFszXSkpe1xuICAgICAgICByZXR1cm4gZFsyXTtcbiAgICAgIH1c
biAgICAgIGlmKHMgPCBTRUEub3B0LnNodWZmbGVfYXR0YWNrKXtcbiAgICAgICAgcmV0dXJuIGQ7XG4gICAgICB9XG4gICAgfVxuICAgIFNFQS5vcHQuc2h1
ZmZsZV9hdHRhY2sgPSAxNTQ2MzI5NjAwMDAwOyAvLyBKYW4gMSwgMjAxOVxuICAgIHZhciBmbCA9IE1hdGguZmxvb3I7IC8vIFRPRE86IFN0aWxsIG5lZWQg
dG8gZml4IGluY29uc2lzdGVudCBzdGF0ZSBpc3N1ZS5cbiAgICAvLyBUT0RPOiBQb3RlbnRpYWwgYnVnPyBJZiBwdWIvcHJpdiBrZXkgc3RhcnRzIHdpdGgg
YC1gPyBJREsgaG93IHBvc3NpYmxlLlxuICBcbn0oKSk7XG4ifX0=
UNBUILD-SNAPSHOT-END */
