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
    var u, root = (typeof globalThis !== "undefined") ? globalThis : (typeof global !== "undefined" ? global : (typeof window !== "undefined" ? window : this));
    var native = {}
    native.btoa = (u+'' != typeof root.btoa) && root.btoa && root.btoa.bind(root);
    native.atob = (u+'' != typeof root.atob) && root.atob && root.atob.bind(root);
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
    var __shim = USE('./shim.js', 1);

    let __defaultExport;
    (function(){

        var shim = __shim;
        var MASK64 = (1n << 64n) - 1n;
        var RATE = 136;
        var OUTPUT_BYTES = 32;
        var SUFFIX = 0x01;
        var ROT = [
          0, 1, 62, 28, 27,
          36, 44, 6, 55, 20,
          3, 10, 43, 25, 39,
          41, 45, 15, 21, 8,
          18, 2, 61, 56, 14
        ];
        var RC = [
          0x0000000000000001n, 0x0000000000008082n,
          0x800000000000808an, 0x8000000080008000n,
          0x000000000000808bn, 0x0000000080000001n,
          0x8000000080008081n, 0x8000000000008009n,
          0x000000000000008an, 0x0000000000000088n,
          0x0000000080008009n, 0x000000008000000an,
          0x000000008000808bn, 0x800000000000008bn,
          0x8000000000008089n, 0x8000000000008003n,
          0x8000000000008002n, 0x8000000000000080n,
          0x000000000000800an, 0x800000008000000an,
          0x8000000080008081n, 0x8000000000008080n,
          0x0000000080000001n, 0x8000000080008008n
        ];

        function rotl64(value, shift) {
          var amount = BigInt(shift & 63);
          if (!amount) { return value & MASK64; }
          return ((value << amount) | (value >> (64n - amount))) & MASK64;
        }

        function keccakF(state) {
          for (var round = 0; round < 24; round++) {
            var c = new Array(5);
            var d = new Array(5);
            var b = new Array(25);
            var x;
            var y;
            var idx;
            for (x = 0; x < 5; x++) {
              c[x] = state[x] ^ state[x + 5] ^ state[x + 10] ^ state[x + 15] ^ state[x + 20];
            }
            for (x = 0; x < 5; x++) {
              d[x] = c[(x + 4) % 5] ^ rotl64(c[(x + 1) % 5], 1);
            }
            for (y = 0; y < 5; y++) {
              for (x = 0; x < 5; x++) {
                state[x + (5 * y)] ^= d[x];
              }
            }
            for (y = 0; y < 5; y++) {
              for (x = 0; x < 5; x++) {
                idx = x + (5 * y);
                b[y + (5 * ((2 * x + 3 * y) % 5))] = rotl64(state[idx], ROT[idx]);
              }
            }
            for (y = 0; y < 5; y++) {
              for (x = 0; x < 5; x++) {
                state[x + (5 * y)] = b[x + (5 * y)] ^ ((~b[((x + 1) % 5) + (5 * y)]) & b[((x + 2) % 5) + (5 * y)]);
              }
            }
            state[0] ^= RC[round];
          }
        }

        function xorBlock(state, block) {
          for (var i = 0; i < block.length; i++) {
            var lane = Math.floor(i / 8);
            var shift = BigInt((i % 8) * 8);
            state[lane] ^= BigInt(block[i]) << shift;
          }
        }

        function toBytes(data) {
          if (typeof data === 'string') {
            return new shim.TextEncoder().encode(data);
          }
          if (data instanceof Uint8Array) { return data; }
          if (data instanceof ArrayBuffer) { return new Uint8Array(data); }
          if (data && data.buffer instanceof ArrayBuffer) {
            return new Uint8Array(data.buffer, data.byteOffset || 0, data.byteLength);
          }
          return new shim.TextEncoder().encode(String(data));
        }

        __defaultExport = async function keccak256(data){
          var bytes = toBytes(data);
          var state = new Array(25).fill(0n);
          var offset = 0;
          while ((offset + RATE) <= bytes.length) {
            xorBlock(state, bytes.subarray(offset, offset + RATE));
            keccakF(state);
            offset += RATE;
          }
          var finalBlock = new Uint8Array(RATE);
          finalBlock.set(bytes.subarray(offset));
          finalBlock[bytes.length - offset] ^= SUFFIX;
          finalBlock[RATE - 1] ^= 0x80;
          xorBlock(state, finalBlock);
          keccakF(state);

          var out = new Uint8Array(OUTPUT_BYTES);
          for (var i = 0; i < OUTPUT_BYTES; i++) {
            var lane = state[Math.floor(i / 8)];
            out[i] = Number((lane >> BigInt((i % 8) * 8)) & 0xffn);
          }
          return shim.Buffer.from(out);
        }

    }());
    module.exports = __defaultExport;
  })(USE, './keccak256');

  ;USE(function(module){
    var __shim = USE('./shim.js', 1);
    var __settings = USE('./settings.js', 1);
    var __sha256 = USE('./sha256.js', 1);
    var __keccak256 = USE('./keccak256.js', 1);
    var __base62 = USE('./base62.js', 1);

    let __defaultExport;
    (function(){

        var shim = __shim;
        var S = __settings;
        var sha = __sha256;
        var keccak = __keccak256;
        var base62 = __base62;

        function normalizeHashName(name) {
          var raw = (name || '').toString();
          var slim = raw.toLowerCase().replace(/[\s_-]/g, '');
          if (!slim) { return ''; }
          if (slim === 'keccak' || slim === 'keccak256') { return 'KECCAK-256'; }
          if (slim === 'sha1') { return 'SHA-1'; }
          if (slim === 'sha256') { return 'SHA-256'; }
          if (slim === 'sha384') { return 'SHA-384'; }
          if (slim === 'sha512') { return 'SHA-512'; }
          return raw;
        }

        function isHashName(name) {
          var normalized = normalizeHashName(name);
          return normalized === 'KECCAK-256' || normalized.indexOf('SHA-') === 0;
        }

        function encodeBuffer(data, enc) {
          if ('base62' === enc) { return base62.bufToB62(data); }
          if ('base64' === enc) { return shim.Buffer.from(data).toString('base64'); }
          return shim.Buffer.from(data).toString(enc);
        }

        async function digest(data, name) {
          var normalized = normalizeHashName(name);
          if (normalized === 'KECCAK-256') {
            return keccak(data);
          }
          return sha(data, normalized || u);
        }

        var u;
        __defaultExport = async function hash(data, pair, cb, opt) {
          try {
            opt = opt || {};
            var salt = (pair || {}).epub || pair;
            var enc = opt.encode || 'base62';
            if (salt instanceof Function) {
              cb = salt;
              salt = u;
            }
            if (data instanceof ArrayBuffer) {
              data = new Uint8Array(data);
              data = new shim.TextDecoder('utf-8').decode(data);
            }
            data = (typeof data === 'string') ? data : await shim.stringify(data);
            if (isHashName(opt.name)) {
              var hashed = shim.Buffer.from(await digest(data, opt.name), 'binary');
              hashed = encodeBuffer(hashed, enc);
              if (cb) { try { cb(hashed); } catch (e) { console.log(e); } }
              return hashed;
            }
            if (typeof salt === 'number') { salt = salt.toString(); }
            if (typeof opt.salt === 'number') { opt.salt = opt.salt.toString(); }
            salt = salt || shim.random(9);
            var key = await (shim.ossl || shim.subtle).importKey('raw', new shim.TextEncoder().encode(data), { name: opt.name || 'PBKDF2' }, false, ['deriveBits']);
            var bits = await (shim.ossl || shim.subtle).deriveBits({
              name: opt.name || 'PBKDF2',
              iterations: opt.iterations || S.pbkdf2.iter,
              salt: new shim.TextEncoder().encode(opt.salt || salt),
              hash: opt.hash || S.pbkdf2.hash
            }, key, opt.length || (S.pbkdf2.ks * 8));
            data = shim.random(data.length);
            var out = shim.Buffer.from(bits, 'binary');
            out = encodeBuffer(out, enc);
            if (cb) { try { cb(out); } catch (e) { console.log(e); } }
            return out;
          } catch (e) {
            if (cb) {
              try { cb(); } catch (cbErr) { console.log(cbErr); }
              return;
            }
            throw e;
          }
        }

    }());
    module.exports = __defaultExport;
  })(USE, './hash');

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
    var __hash = USE('./hash.js', 1);
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
        SEA.hash = __hash;
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
          SEA.hash(val, null, function (b64hash) {
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
