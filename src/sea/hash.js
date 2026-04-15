import __shim from './shim.js';
import __settings from './settings.js';
import __sha256 from './sha256.js';
import __keccak256 from './keccak256.js';
import __base62 from './base62.js';

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
export default __defaultExport;
