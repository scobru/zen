import core from './secp256k1.core.js';

async function secret(key, pairLike, cb, opt) {
  opt = opt || {};
  if (!pairLike || !pairLike.epriv) { throw new Error('No secret mix.'); }
  const peer = key && key.epub ? key.epub : key;
  const point = core.parsePub(peer);
  const priv = core.parseScalar(pairLike.epriv, 'Encryption key');
  const shared = core.pointMultiply(priv, point);
  if (!shared) { throw new Error('Could not derive shared secret'); }
  const digest = await core.shaBytes(core.compactPoint(shared));
  const out = core.base62.bufToB62(digest);
  if (cb) { try { cb(out); } catch (e) { console.log(e); } }
  return out;
}

export { secret };
export default secret;
