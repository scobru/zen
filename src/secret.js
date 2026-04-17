import crv from './curves/curves.js';

async function secret(epub, pair, cb, opt) {
  try {
    opt = opt || {};
    if (!pair || !pair.epriv) { throw new Error('No secret mix.'); }
    const c = crv(pair.curve);
    const peer = epub && epub.epub ? epub.epub : epub;
    const pt  = c.parsePub(peer);
    const priv = c.parseScalar(pair.epriv, 'Encryption key');
    const shared = c.pointMultiply(priv, pt);
    if (!shared) { throw new Error('Could not derive shared secret'); }
    const h = await c.shaBytes(c.compactPoint(shared));
    const out = c.base62.bufToB62(h);
    if (cb) { try { cb(out); } catch (e) { console.log(e); } }
    return out;
  } catch (e) {
    if (cb) { try { cb(); } catch (x) { console.log(x); } return; }
    throw e;
  }
}

export { secret };
export default secret;
