import core from './secp256k1.core.js';

async function verify(data, pairLike, cb, opt) {
  opt = opt || {};
  const parsed = await core.settings.parse(data);
  if (pairLike === false) {
    const raw = await core.settings.parse(parsed.m);
    if (cb) { try { cb(raw); } catch (e) { console.log(e); } }
    return raw;
  }
  const pub = pairLike && pairLike.pub ? pairLike.pub : pairLike;
  const point = core.parsePub(pub);
  const hashBytes = await core.shaBytes(parsed.m);
  const sig = new Uint8Array(core.shim.Buffer.from(parsed.s || '', opt.encode || 'base64'));
  if (sig.length !== 64) { throw new Error('Invalid signature length'); }
  const r = core.bytesToBigInt(sig.slice(0, 32));
  const s = core.bytesToBigInt(sig.slice(32));
  if (r <= 0n || r >= core.N || s <= 0n || s >= core.N) { throw new Error('Signature out of range'); }
  const z = core.mod(core.bytesToBigInt(hashBytes), core.N);
  const w = core.modInv(s, core.N);
  const u1 = core.mod(z * w, core.N);
  const u2 = core.mod(r * w, core.N);
  const check = core.pointAdd(core.pointMultiply(u1, core.G), core.pointMultiply(u2, point));
  if (!check || core.mod(check.x, core.N) !== r) {
    throw new Error('Signature did not match');
  }
  const message = await core.settings.parse(parsed.m);
  if (cb) { try { cb(message); } catch (e) { console.log(e); } }
  return message;
}

export { verify };
export default verify;
