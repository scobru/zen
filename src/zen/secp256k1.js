import shim from './shim.js';
import base62 from './base62.js';
import settings from './settings.js';
import aeskey from './aeskey.js';
import sha256 from './sha256.js';
import work from './work.js';

const P = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F');
const N = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141');
const A = 0n;
const B = 7n;
const G = {
  x: BigInt('0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798'),
  y: BigInt('0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8')
};
const HALF_N = N >> 1n;

function mod(a, m) {
  return ((a % m) + m) % m;
}

function modPow(base, exp, modn) {
  let result = 1n;
  let value = mod(base, modn);
  let power = exp;
  while (power > 0n) {
    if (power & 1n) {
      result = mod(result * value, modn);
    }
    value = mod(value * value, modn);
    power >>= 1n;
  }
  return result;
}

function modInv(a, modn) {
  if (!a) { throw new Error('Inverse does not exist'); }
  return modPow(mod(a, modn), modn - 2n, modn);
}

function isPoint(point) {
  return !!point && typeof point.x === 'bigint' && typeof point.y === 'bigint';
}

function isOnCurve(point) {
  if (!isPoint(point)) { return false; }
  if (point.x < 0n || point.x >= P || point.y < 0n || point.y >= P) { return false; }
  return mod(point.y * point.y - (point.x * point.x * point.x + A * point.x + B), P) === 0n;
}

function pointAdd(left, right) {
  if (!left) { return right; }
  if (!right) { return left; }
  if (left.x === right.x && mod(left.y + right.y, P) === 0n) { return null; }
  let slope;
  if (left.x === right.x && left.y === right.y) {
    slope = mod((3n * mod(left.x * left.x, P)) * modInv(2n * left.y, P), P);
  } else {
    slope = mod((right.y - left.y) * modInv(right.x - left.x, P), P);
  }
  const x = mod(slope * slope - left.x - right.x, P);
  const y = mod(slope * (left.x - x) - left.y, P);
  return { x, y };
}

function pointMultiply(scalar, point) {
  let n = mod(scalar, N);
  if (!n || !point) { return null; }
  let result = null;
  let addend = point;
  while (n > 0n) {
    if (n & 1n) {
      result = pointAdd(result, addend);
    }
    addend = pointAdd(addend, addend);
    n >>= 1n;
  }
  return result;
}

function bytesToBigInt(bytes) {
  const hex = Array.from(bytes).map(function(byte) {
    return byte.toString(16).padStart(2, '0');
  }).join('');
  return BigInt('0x' + (hex || '0'));
}

function bigIntToBytes(num, length) {
  let hex = num.toString(16);
  if (hex.length % 2) { hex = '0' + hex; }
  const raw = shim.Buffer.from(hex, 'hex');
  if (!length) { return new Uint8Array(raw); }
  if (raw.length > length) {
    return new Uint8Array(raw.slice(raw.length - length));
  }
  const out = new Uint8Array(length);
  out.set(raw, length - raw.length);
  return out;
}

function concatBytes() {
  const chunks = Array.prototype.slice.call(arguments).map(function(chunk) {
    if (chunk instanceof Uint8Array) { return chunk; }
    if (Array.isArray(chunk)) { return Uint8Array.from(chunk); }
    if (typeof chunk === 'number') { return Uint8Array.from([chunk]); }
    if (chunk && chunk.buffer instanceof ArrayBuffer) { return new Uint8Array(chunk.buffer, chunk.byteOffset || 0, chunk.byteLength); }
    return new Uint8Array(0);
  });
  const length = chunks.reduce(function(total, chunk) { return total + chunk.length; }, 0);
  const out = new Uint8Array(length);
  let offset = 0;
  chunks.forEach(function(chunk) {
    out.set(chunk, offset);
    offset += chunk.length;
  });
  return out;
}

function utf8Bytes(data) {
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

function decodeBase64Url(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(str.length / 4) * 4, '=');
  return new Uint8Array(shim.Buffer.from(padded, 'base64'));
}

function encodeBase64(bytes, encoding) {
  return shim.Buffer.from(bytes).toString(encoding || 'base64');
}

function assertScalar(value, name) {
  if (value <= 0n || value >= N) {
    throw new Error((name || 'Scalar') + ' out of range');
  }
  return value;
}

function parseScalar(value, name) {
  if (typeof value === 'bigint') { return assertScalar(value, name); }
  if (typeof value !== 'string' || !value) { throw new Error((name || 'Scalar') + ' must be a string'); }
  const scalar = (/^[A-Za-z0-9]{44}$/.test(value))
    ? base62.b62ToBI(value)
    : bytesToBigInt(decodeBase64Url(value));
  return assertScalar(scalar, name);
}

function scalarToString(value) {
  return base62.biToB62(assertScalar(value));
}

function pointToPub(point) {
  if (!isOnCurve(point)) { throw new Error('Invalid public point'); }
  return base62.biToB62(point.x) + base62.biToB62(point.y);
}

function parsePub(pub) {
  if (typeof pub !== 'string') { throw new Error('Public key must be a string'); }
  let point;
  if (pub.length === 88 && /^[A-Za-z0-9]{88}$/.test(pub)) {
    point = {
      x: base62.b62ToBI(pub.slice(0, 44)),
      y: base62.b62ToBI(pub.slice(44))
    };
  } else if (pub.length === 87 && pub[43] === '.') {
    const parts = pub.split('.');
    point = {
      x: bytesToBigInt(decodeBase64Url(parts[0])),
      y: bytesToBigInt(decodeBase64Url(parts[1]))
    };
  } else {
    throw new Error('Unrecognized public key format');
  }
  if (!isOnCurve(point)) { throw new Error('Public key is not on secp256k1'); }
  return point;
}

function publicFromPrivate(priv) {
  const point = pointMultiply(assertScalar(priv, 'Private key'), G);
  if (!point || !isOnCurve(point)) { throw new Error('Could not derive public key'); }
  return point;
}

function compactPoint(point) {
  const prefix = point.y & 1n ? 0x03 : 0x02;
  return concatBytes([prefix], bigIntToBytes(point.x, 32));
}

async function shaBytes(data) {
  return new Uint8Array(await sha256(data));
}

async function hmacSha256(keyBytes, dataBytes) {
  const key = await shim.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['sign']
  );
  return new Uint8Array(await shim.subtle.sign('HMAC', key, dataBytes));
}

async function deterministicK(priv, hashBytes, attempt) {
  const x = bigIntToBytes(priv, 32);
  const h1 = bigIntToBytes(bytesToBigInt(hashBytes) % N, 32);
  const extra = attempt ? Uint8Array.from([attempt & 255]) : new Uint8Array(0);
  let K = new Uint8Array(32);
  let V = new Uint8Array(32).fill(1);
  K = await hmacSha256(K, concatBytes(V, [0], x, h1, extra));
  V = await hmacSha256(K, V);
  K = await hmacSha256(K, concatBytes(V, [1], x, h1, extra));
  V = await hmacSha256(K, V);
  while (true) {
    V = await hmacSha256(K, V);
    const candidate = bytesToBigInt(V);
    if (candidate > 0n && candidate < N) { return candidate; }
    K = await hmacSha256(K, concatBytes(V, [0]));
    V = await hmacSha256(K, V);
  }
}

async function hashToScalar(seed, label) {
  const digest = await shaBytes(concatBytes(utf8Bytes(label), utf8Bytes(seed)));
  return (bytesToBigInt(digest) % (N - 1n)) + 1n;
}

async function randomScalar() {
  return (bytesToBigInt(shim.random(32)) % (N - 1n)) + 1n;
}

async function normalizeMessage(data) {
  if (typeof data === 'string') {
    return settings.check(data) ? data : await settings.parse(data);
  }
  return data;
}

async function finalize(result, opt, cb) {
  const output = opt && opt.raw ? result : (await shim.stringify(result));
  if (cb) { try { cb(output); } catch (e) { console.log(e); } }
  return output;
}

const core = {
  curve: 'secp256k1',
  P,
  N,
  A,
  B,
  G,
  HALF_N,
  shim,
  base62,
  settings,
  aeskey,
  work,
  mod,
  modPow,
  modInv,
  isPoint,
  isOnCurve,
  pointAdd,
  pointMultiply,
  bytesToBigInt,
  bigIntToBytes,
  concatBytes,
  utf8Bytes,
  decodeBase64Url,
  encodeBase64,
  parseScalar,
  assertScalar,
  scalarToString,
  pointToPub,
  parsePub,
  publicFromPrivate,
  compactPoint,
  shaBytes,
  hmacSha256,
  deterministicK,
  hashToScalar,
  randomScalar,
  normalizeMessage,
  finalize
};

export {
  P, N, A, B, G, HALF_N,
  mod, modPow, modInv,
  isPoint, isOnCurve,
  pointAdd, pointMultiply,
  bytesToBigInt, bigIntToBytes, concatBytes, utf8Bytes,
  decodeBase64Url, encodeBase64,
  parseScalar, assertScalar, scalarToString,
  pointToPub, parsePub, publicFromPrivate, compactPoint,
  shaBytes, hmacSha256, deterministicK, hashToScalar, randomScalar,
  normalizeMessage, finalize,
  shim, base62, settings, aeskey, work
};
export default core;
