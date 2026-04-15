// P-256 / secp256r1 curve — same Weierstrass math as secp256k1, different constants.
// A = P - 3 (i.e. -3 mod P), so the doubling formula includes the A term.
import shim from './shim.js';
import base62 from './base62.js';
import sha256 from './sha256.js';
import settings from './settings.js';

const P = BigInt('0xFFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF');
const N = BigInt('0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551');
const A = P - 3n; // -3 mod P
const B = BigInt('0x5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B');
const G = {
  x: BigInt('0x6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296'),
  y: BigInt('0x4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5')
};
const HALF_N = N >> 1n;
const curve = 'p256';

function mod(a, m) {
  return ((a % m) + m) % m;
}

function modPow(base, exp, modn) {
  let result = 1n, value = mod(base, modn), power = exp;
  while (power > 0n) {
    if (power & 1n) { result = mod(result * value, modn); }
    value = mod(value * value, modn);
    power >>= 1n;
  }
  return result;
}

function modInv(a, modn) {
  if (!a) { throw new Error('Inverse does not exist'); }
  return modPow(mod(a, modn), modn - 2n, modn);
}

function isPoint(pt) {
  return !!pt && typeof pt.x === 'bigint' && typeof pt.y === 'bigint';
}

function isOnCurve(pt) {
  if (!isPoint(pt)) { return false; }
  if (pt.x < 0n || pt.x >= P || pt.y < 0n || pt.y >= P) { return false; }
  // y² = x³ + Ax + B  (A ≠ 0 for P-256)
  return mod(pt.y * pt.y - (pt.x * pt.x * pt.x + A * pt.x + B), P) === 0n;
}

function pointAdd(left, right) {
  if (!left) { return right; }
  if (!right) { return left; }
  if (left.x === right.x && mod(left.y + right.y, P) === 0n) { return null; }
  let slope;
  if (left.x === right.x && left.y === right.y) {
    // Doubling: slope = (3x² + A) / (2y)  — P-256 has A = -3 ≠ 0
    slope = mod((3n * mod(left.x * left.x, P) + A) * modInv(2n * left.y, P), P);
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
  let result = null, addend = point;
  while (n > 0n) {
    if (n & 1n) { result = pointAdd(result, addend); }
    addend = pointAdd(addend, addend);
    n >>= 1n;
  }
  return result;
}

function bytesToBigInt(bytes) {
  return BigInt('0x' + (Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('') || '0'));
}

function bigIntToBytes(num, length) {
  let hex = num.toString(16);
  if (hex.length % 2) { hex = '0' + hex; }
  const raw = shim.Buffer.from(hex, 'hex');
  if (!length) { return new Uint8Array(raw); }
  if (raw.length > length) { return new Uint8Array(raw.slice(raw.length - length)); }
  const out = new Uint8Array(length);
  out.set(raw, length - raw.length);
  return out;
}

function concatBytes() {
  const chunks = Array.prototype.slice.call(arguments).map(function(c) {
    if (c instanceof Uint8Array) { return c; }
    if (Array.isArray(c)) { return Uint8Array.from(c); }
    if (typeof c === 'number') { return Uint8Array.from([c]); }
    if (c && c.buffer instanceof ArrayBuffer) { return new Uint8Array(c.buffer, c.byteOffset || 0, c.byteLength); }
    return new Uint8Array(0);
  });
  const len = chunks.reduce((t, c) => t + c.length, 0);
  const out = new Uint8Array(len);
  let off = 0;
  chunks.forEach(c => { out.set(c, off); off += c.length; });
  return out;
}

function utf8Bytes(data) {
  if (typeof data === 'string') { return new shim.TextEncoder().encode(data); }
  if (data instanceof Uint8Array) { return data; }
  if (data instanceof ArrayBuffer) { return new Uint8Array(data); }
  if (data && data.buffer instanceof ArrayBuffer) { return new Uint8Array(data.buffer, data.byteOffset || 0, data.byteLength); }
  return new shim.TextEncoder().encode(String(data));
}

function decodeBase64Url(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(str.length / 4) * 4, '=');
  return new Uint8Array(shim.Buffer.from(padded, 'base64'));
}

function assertScalar(value, name) {
  if (value <= 0n || value >= N) { throw new Error((name || 'Scalar') + ' out of range'); }
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

function pointToPub(pt) {
  if (!isOnCurve(pt)) { throw new Error('Invalid public point'); }
  return base62.biToB62(pt.x) + base62.biToB62(pt.y);
}

function parsePub(pub) {
  if (typeof pub !== 'string') { throw new Error('Public key must be a string'); }
  let point;
  if (pub.length === 88 && /^[A-Za-z0-9]{88}$/.test(pub)) {
    point = { x: base62.b62ToBI(pub.slice(0, 44)), y: base62.b62ToBI(pub.slice(44)) };
  } else if (pub.length === 87 && pub[43] === '.') {
    const parts = pub.split('.');
    point = { x: bytesToBigInt(decodeBase64Url(parts[0])), y: bytesToBigInt(decodeBase64Url(parts[1])) };
  } else {
    throw new Error('Unrecognized public key format');
  }
  if (!isOnCurve(point)) { throw new Error('Public key is not on p256'); }
  return point;
}

function publicFromPrivate(priv) {
  const point = pointMultiply(assertScalar(priv, 'Private key'), G);
  if (!point || !isOnCurve(point)) { throw new Error('Could not derive public key'); }
  return point;
}

async function shaBytes(data) {
  return new Uint8Array(await sha256(data));
}

async function hashToScalar(seed, label) {
  const digest = await shaBytes(concatBytes(utf8Bytes(label), utf8Bytes(seed)));
  return (bytesToBigInt(digest) % (N - 1n)) + 1n;
}

async function randomScalar() {
  return (bytesToBigInt(shim.random(32)) % (N - 1n)) + 1n;
}

// ── parity with secp256k1 API ─────────────────────────────────────────────────

async function hmacSha256(kbytes, dbytes) {
  const key = await shim.subtle.importKey('raw', kbytes, { name: 'HMAC', hash: { name: 'SHA-256' } }, false, ['sign']);
  return new Uint8Array(await shim.subtle.sign('HMAC', key, dbytes));
}

async function deterministicK(priv, hbytes, attempt) {
  const x  = bigIntToBytes(priv, 32);
  const h1 = bigIntToBytes(bytesToBigInt(hbytes) % N, 32);
  const extra = attempt ? Uint8Array.from([attempt & 255]) : new Uint8Array(0);
  let K = new Uint8Array(32);
  let V = new Uint8Array(32).fill(1);
  K = await hmacSha256(K, concatBytes(V, [0], x, h1, extra));
  V = await hmacSha256(K, V);
  K = await hmacSha256(K, concatBytes(V, [1], x, h1, extra));
  V = await hmacSha256(K, V);
  while (true) {
    V = await hmacSha256(K, V);
    const k = bytesToBigInt(V);
    if (k > 0n && k < N) { return k; }
    K = await hmacSha256(K, concatBytes(V, [0]));
    V = await hmacSha256(K, V);
  }
}

function compactPoint(pt) {
  return concatBytes([pt.y & 1n ? 0x03 : 0x02], bigIntToBytes(pt.x, 32));
}

function encodeBase64(bytes, enc) {
  return shim.Buffer.from(bytes).toString(enc || 'base64');
}

async function normalizeMessage(data) {
  if (typeof data === 'string') { return settings.check(data) ? data : await settings.parse(data); }
  return data;
}

async function finalize(result, opt, cb) {
  const out = opt && opt.raw ? result : (await shim.stringify(result));
  if (cb) { try { cb(out); } catch (e) { console.log(e); } }
  return out;
}

export default {
  curve, P, N, A, B, G, HALF_N,
  mod, modInv,
  isPoint, isOnCurve,
  pointAdd, pointMultiply,
  bytesToBigInt, bigIntToBytes, concatBytes, utf8Bytes,
  assertScalar, parseScalar, scalarToString, decodeBase64Url,
  pointToPub, parsePub, publicFromPrivate,
  hashToScalar, randomScalar,
  shaBytes, hmacSha256, deterministicK,
  compactPoint, encodeBase64,
  normalizeMessage, finalize,
  shim, base62, settings
};
