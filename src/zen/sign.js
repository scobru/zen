import crv from './curves/curves.js';

async function sign(data, pair, cb, opt) {
  try {
    opt = opt || {};
    if (data === undefined) { throw new Error('`undefined` not allowed.'); }
    if (!pair || typeof pair === 'function' || !pair.priv) { throw new Error('No signing key.'); }
    const c = crv(pair.curve);
    const msg = await c.normalizeMessage(data);
    const h = await c.shaBytes(msg);
    const priv = c.parseScalar(pair.priv, 'Signing key');
    for (let i = 0; i < 16; i++) {
      const k = await c.deterministicK(priv, h, i);
      const pt = c.pointMultiply(k, c.G);
      if (!pt) { continue; }
      const r = c.mod(pt.x, c.N);
      if (!r) { continue; }
      let s = c.mod(c.modInv(k, c.N) * (c.mod(c.bytesToBigInt(h), c.N) + r * priv), c.N);
      if (!s) { continue; }
      if (s > c.HALF_N) { s = c.N - s; }
      const sig = c.concatBytes(c.bigIntToBytes(r, 32), c.bigIntToBytes(s, 32));
      const out = { m: msg, s: c.encodeBase64(sig, opt.encode || 'base64') };
      if (c.curve !== 'secp256k1') { out.c = c.curve; }
      return c.finalize(out, opt, cb);
    }
    throw new Error('Failed to sign');
  } catch (e) {
    if (cb) { try { cb(); } catch (x) { console.log(x); } return; }
    throw e;
  }
}

export { sign };
export default sign;
