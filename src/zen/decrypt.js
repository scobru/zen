import core from './secp256k1.js';

async function decrypt(data, pairLike, cb, opt) {
  try {
    opt = opt || {};
    const key = (pairLike || opt).epriv || pairLike;
    if (!key) { throw new Error('No decryption key.'); }
    const parsed = await core.settings.parse(data);
    const salt = core.shim.Buffer.from(parsed.s, opt.encode || 'base64');
    const iv = core.shim.Buffer.from(parsed.iv, opt.encode || 'base64');
    const ct = core.shim.Buffer.from(parsed.ct, opt.encode || 'base64');
    const aes = await core.aeskey(key, salt, opt);
    const decrypted = await core.shim.subtle.decrypt({
      name: opt.name || 'AES-GCM',
      iv: new Uint8Array(iv),
      tagLength: 128
    }, aes, new Uint8Array(ct));
    const out = await core.settings.parse(new core.shim.TextDecoder('utf8').decode(decrypted));
    if (cb) { try { cb(out); } catch (e) { console.log(e); } }
    return out;
  } catch (e) {
    if (cb) {
      try { cb(); } catch (cbErr) { console.log(cbErr); }
      return;
    }
    throw e;
  }
}

export { decrypt };
export default decrypt;
