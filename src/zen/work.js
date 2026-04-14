import shim from './shim.js';
import settings from './settings.js';
import sha256 from './sha256.js';
import base62 from './base62.js';

export default async function work(data, pair, cb, opt) {
  try {
    opt = opt || {};
    let salt = (pair || {}).epub || pair;
    const enc = opt.encode || 'base62';

    if (salt instanceof Function) {
      cb = salt;
      salt = undefined;
    }
    if (data instanceof ArrayBuffer) {
      data = new Uint8Array(data);
      data = new shim.TextDecoder('utf-8').decode(data);
    }
    data = (typeof data === 'string') ? data : await shim.stringify(data);

    if ('sha' === (opt.name || '').toLowerCase().slice(0, 3)) {
      let hashed = shim.Buffer.from(await sha256(data, opt.name), 'binary');
      hashed = ('base62' === enc) ? base62.bufToB62(hashed) : ('base64' === enc) ? btoa(String.fromCharCode(...new Uint8Array(hashed))) : hashed.toString(enc);
      if (cb) { try { cb(hashed); } catch (e) { console.log(e); } }
      return hashed;
    }

    if (typeof salt === 'number') { salt = salt.toString(); }
    if (typeof opt.salt === 'number') { opt.salt = opt.salt.toString(); }
    salt = salt || shim.random(9);

    const key = await (shim.ossl || shim.subtle).importKey('raw', new shim.TextEncoder().encode(data), { name: opt.name || 'PBKDF2' }, false, ['deriveBits']);
    const bits = await (shim.ossl || shim.subtle).deriveBits({
      name: opt.name || 'PBKDF2',
      iterations: opt.iterations || settings.pbkdf2.iter,
      salt: new shim.TextEncoder().encode(opt.salt || salt),
      hash: opt.hash || settings.pbkdf2.hash
    }, key, opt.length || (settings.pbkdf2.ks * 8));
    data = shim.random(data.length);
    let out = shim.Buffer.from(bits, 'binary');
    out = ('base62' === enc) ? base62.bufToB62(out) : ('base64' === enc) ? btoa(String.fromCharCode(...new Uint8Array(out))) : out.toString(enc);
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
