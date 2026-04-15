import crv from './crv.js';

async function verify(data, pair, cb, opt) {
  try {
    opt = opt || {};
    const c0 = crv(); // secp256k1 — for settings.parse (curve-independent)
    const msg = await c0.settings.parse(data);
    if (pair === false) {
      const raw = await c0.settings.parse(msg.m);
      if (cb) { try { cb(raw); } catch (e) { console.log(e); } }
      return raw;
    }
    const pub = pair && pair.pub ? pair.pub : pair;
    // Curve priority: embedded in signed data → pair.curve → opt.curve → secp256k1
    const c = crv((msg && msg.c) || (pair && pair.curve) || opt.curve);
    const pt = c.parsePub(pub);
    const h = await c.shaBytes(msg.m);
    const sig = new Uint8Array(c.shim.Buffer.from(msg.s || '', opt.encode || 'base64'));
    if (sig.length !== 64) { throw new Error('Invalid signature length'); }
    const r = c.bytesToBigInt(sig.slice(0, 32));
    const s = c.bytesToBigInt(sig.slice(32));
    if (r <= 0n || r >= c.N || s <= 0n || s >= c.N) { throw new Error('Signature out of range'); }
    const z  = c.mod(c.bytesToBigInt(h), c.N);
    const w  = c.modInv(s, c.N);
    const u1 = c.mod(z * w, c.N);
    const u2 = c.mod(r * w, c.N);
    const res = c.pointAdd(c.pointMultiply(u1, c.G), c.pointMultiply(u2, pt));
    if (!res || c.mod(res.x, c.N) !== r) { throw new Error('Signature did not match'); }
    const out = (typeof msg.m === 'string' && c.settings.check(msg.m))
      ? msg.m
      : await c.settings.parse(msg.m);
    if (cb) { try { cb(out); } catch (e) { console.log(e); } }
    return out;
  } catch (e) {
    if (cb) { try { cb(); } catch (x) { console.log(x); } return; }
    throw e;
  }
}

export { verify };
export default verify;
