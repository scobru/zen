import shim from './shim.js';
import settings from './settings.js';
import sha256 from './sha256.js';
import keccak256 from './keccak256.js';
import base62 from './base62.js';

function normalizeHashName(name) {
  const raw = (name || '').toString();
  const slim = raw.toLowerCase().replace(/[\s_-]/g, '');
  if (!slim) { return ''; }
  if (slim === 'keccak' || slim === 'keccak256') { return 'KECCAK-256'; }
  if (slim === 'sha1') { return 'SHA-1'; }
  if (slim === 'sha256') { return 'SHA-256'; }
  if (slim === 'sha384') { return 'SHA-384'; }
  if (slim === 'sha512') { return 'SHA-512'; }
  return raw;
}

function isHashName(name) {
  const normalized = normalizeHashName(name);
  return normalized === 'KECCAK-256' || normalized.indexOf('SHA-') === 0;
}

function encodeBuffer(data, encoding) {
  if (encoding === 'base62') { return base62.bufToB62(data); }
  if (encoding === 'base64') { return shim.Buffer.from(data).toString('base64'); }
  return shim.Buffer.from(data).toString(encoding);
}

async function digest(data, name) {
  const normalized = normalizeHashName(name);
  if (normalized === 'KECCAK-256') {
    return keccak256(data);
  }
  return sha256(data, normalized || undefined);
}

export { normalizeHashName };

export default async function hash(data, pair, cb, opt) {
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

    if (isHashName(opt.name)) {
      let hashed = shim.Buffer.from(await digest(data, opt.name), 'binary');
      hashed = encodeBuffer(hashed, enc);
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
