import core from './secp256k1.js';

async function encrypt(data, pair, cb, opt) {
  try {
    opt = opt || {};
    const key = (pair || opt).epriv || pair;
    if (data === undefined) { throw new Error('`undefined` not allowed.'); }
    if (!key) { throw new Error('No encryption key.'); }
    const message = typeof data === 'string' ? data : await core.shim.stringify(data);
    const rand = { s: core.shim.random(9), iv: core.shim.random(15) };
    const aes = await core.aeskey(key, rand.s, opt);
    const ct = await core.shim.subtle.encrypt({
      name: opt.name || 'AES-GCM',
      iv: new Uint8Array(rand.iv)
    }, aes, new core.shim.TextEncoder().encode(message));
    const out = {
      ct: core.shim.Buffer.from(ct, 'binary').toString(opt.encode || 'base64'),
      iv: rand.iv.toString(opt.encode || 'base64'),
      s: rand.s.toString(opt.encode || 'base64')
    };
    return core.finalize(out, opt, cb);
  } catch (e) {
    if (cb) {
      try { cb(); } catch (cbErr) { console.log(cbErr); }
      return;
    }
    throw e;
  }
}

export { encrypt };
export default encrypt;
