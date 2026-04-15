import core from './secp256k1.core.js';

async function sign(data, pairLike, cb, opt) {
  opt = opt || {};
  if (data === undefined) { throw new Error('`undefined` not allowed.'); }
  if (!pairLike || typeof pairLike === 'function' || !pairLike.priv) { throw new Error('No signing key.'); }
  const message = await core.normalizeMessage(data);
  const hashBytes = await core.shaBytes(message);
  const priv = core.parseScalar(pairLike.priv, 'Signing key');

  for (let attempt = 0; attempt < 16; attempt++) {
    const k = await core.deterministicK(priv, hashBytes, attempt);
    const point = core.pointMultiply(k, core.G);
    if (!point) { continue; }
    const r = core.mod(point.x, core.N);
    if (!r) { continue; }
    let s = core.mod(core.modInv(k, core.N) * (core.mod(core.bytesToBigInt(hashBytes), core.N) + r * priv), core.N);
    if (!s) { continue; }
    if (s > core.HALF_N) { s = core.N - s; }
    const sig = core.concatBytes(core.bigIntToBytes(r, 32), core.bigIntToBytes(s, 32));
    return core.finalize({ m: message, s: core.encodeBase64(sig, opt.encode || 'base64') }, opt, cb);
  }
  throw new Error('Failed to sign message');
}

export { sign };
export default sign;
