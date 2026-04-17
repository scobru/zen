import shim from './shim.js';
import base62 from './base62.js';

const settings = {};
settings.pbkdf2 = { hash: { name: 'SHA-256' }, iter: 100000, ks: 64 };
settings.ecdsa = {
  pair: { name: 'ECDSA', namedCurve: 'secp256k1' },
  sign: { name: 'ECDSA', hash: { name: 'SHA-256' } }
};
settings.ecdh = { name: 'ECDH', namedCurve: 'secp256k1' };

settings.jwk = function(pub, d) {
  const xy = base62.pubToJwkXY(pub);
  const jwk = { kty: 'EC', crv: 'secp256k1', x: xy.x, y: xy.y, ext: true };
  jwk.key_ops = d ? ['sign'] : ['verify'];
  if (d) { jwk.d = (d.length === 44 && /^[A-Za-z0-9]{44}$/.test(d)) ? base62.b62ToB64(d) : d; }
  return jwk;
};

settings.keyToJwk = function(keyBytes) {
  const keyB64 = keyBytes.toString('base64');
  return {
    kty: 'oct',
    k: keyB64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, ''),
    ext: false,
    alg: 'A256GCM'
  };
};

settings.check = function(t) {
  if (typeof t !== 'string') { return false; }
  if ('SEA{' === t.slice(0, 4)) { return true; }
  if ('{' !== t.slice(0, 1)) { return false; }
  try {
    const parsed = JSON.parse(t);
    return !!(parsed && (
      (typeof parsed.s === 'string' && Object.prototype.hasOwnProperty.call(parsed, 'm')) ||
      (typeof parsed.ct === 'string' && typeof parsed.iv === 'string' && typeof parsed.s === 'string')
    ));
  } catch (e) {}
  return false;
};

settings.parse = async function(t) {
  try {
    const yes = (typeof t === 'string');
    if (yes && 'SEA{' === t.slice(0, 4)) { t = t.slice(3); }
    return yes ? await shim.parse(t) : t;
  } catch (e) {}
  return t;
};

export default settings;
