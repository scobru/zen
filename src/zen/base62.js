import shim from './shim.js';

const ALPHA = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const ALPHA_MAP = {};
for (let i = 0; i < ALPHA.length; i++) { ALPHA_MAP[ALPHA[i]] = i; }
const PUB_LEN = 44;

function biToB62(n) {
  if (typeof n !== 'bigint' || n < 0n) {
    throw new Error('biToB62: input must be non-negative BigInt');
  }
  let out = '';
  let value = n;
  while (value > 0n) {
    out = ALPHA[Number(value % 62n)] + out;
    value = value / 62n;
  }
  while (out.length < PUB_LEN) { out = '0' + out; }
  if (out.length > PUB_LEN) {
    throw new Error('biToB62: value too large for ' + PUB_LEN + '-char base62');
  }
  return out;
}

function b62ToBI(s) {
  if (typeof s !== 'string' || s.length !== PUB_LEN) {
    throw new Error('b62ToBI: expected ' + PUB_LEN + '-char base62 string');
  }
  if (!/^[A-Za-z0-9]+$/.test(s)) {
    throw new Error('b62ToBI: invalid base62 characters');
  }
  let n = 0n;
  for (let i = 0; i < s.length; i++) {
    const c = ALPHA_MAP[s[i]];
    if (c === undefined) { throw new Error('b62ToBI: unknown char ' + s[i]); }
    n = n * 62n + BigInt(c);
  }
  return n;
}

function b64ToB62(s) {
  const hex = shim.Buffer.from(atob(s), 'binary').toString('hex');
  return biToB62(BigInt('0x' + (hex || '0')));
}

function b62ToB64(s) {
  const n = b62ToBI(s);
  const hex = n.toString(16).padStart(64, '0');
  return shim.Buffer.from(hex, 'hex').toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function pubToJwkXY(pub) {
  if (typeof pub !== 'string') {
    throw new Error('pubToJwkXY: pub must be a string');
  }
  if (pub.length === 87 && pub[43] === '.') {
    const parts = pub.split('.');
    if (parts.length !== 2) { throw new Error('pubToJwkXY: invalid old pub format'); }
    return { x: parts[0], y: parts[1] };
  }
  if (pub.length === 88 && /^[A-Za-z0-9]{88}$/.test(pub)) {
    return {
      x: b62ToB64(pub.slice(0, 44)),
      y: b62ToB64(pub.slice(44))
    };
  }
  throw new Error('pubToJwkXY: unrecognised pub format');
}

function bufToB62(buf) {
  let out = '';
  for (let i = 0; i < buf.length; i += 32) {
    const end = Math.min(i + 32, buf.length);
    let hex = '';
    for (let p = 0; p < 32 - (end - i); p++) { hex += '00'; }
    for (let j = i; j < end; j++) {
      hex += ('0' + buf[j].toString(16)).slice(-2);
    }
    out += biToB62(BigInt('0x' + hex));
  }
  return out;
}

const base62 = { biToB62, b62ToBI, b64ToB62, b62ToB64, pubToJwkXY, bufToB62, PUB_LEN };
export default base62;
