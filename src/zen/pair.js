import core from './secp256k1.js';

async function deriveScalar(seed, label, attempt) {
  return core.hashToScalar(seed, label + (attempt ? attempt : ''));
}

async function derivePrivWithRetry(priv, seed, label) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const offset = await deriveScalar(seed, label, attempt);
    const derivedPriv = core.mod(priv + offset, core.N);
    if (derivedPriv !== 0n) {
      return derivedPriv;
    }
  }
  throw new Error('Failed to derive non-zero private key');
}

async function derivePubWithRetry(point, seed, label) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const offset = await deriveScalar(seed, label, attempt);
    const derivedPub = core.pointAdd(point, core.pointMultiply(offset, core.G));
    if (derivedPub) {
      return derivedPub;
    }
  }
  throw new Error('Failed to derive valid public key');
}

async function pair(cb, opt) {
  try {
    opt = opt || {};
    const out = { curve: core.curve };

    if (opt.seed && (opt.priv || opt.epriv || opt.pub || opt.epub)) {
      if (opt.priv) {
        const signPriv = await derivePrivWithRetry(core.parseScalar(opt.priv, 'Signing key'), opt.seed, 'ZEN.DERIVE|sign|');
        out.priv = core.scalarToString(signPriv);
        out.pub = core.pointToPub(core.publicFromPrivate(signPriv));
      }
      if (opt.epriv) {
        const encPriv = await derivePrivWithRetry(core.parseScalar(opt.epriv, 'Encryption key'), opt.seed, 'ZEN.DERIVE|encrypt|');
        out.epriv = core.scalarToString(encPriv);
        out.epub = core.pointToPub(core.publicFromPrivate(encPriv));
      }
      if (opt.pub) {
        const signPub = await derivePubWithRetry(core.parsePub(opt.pub), opt.seed, 'ZEN.DERIVE|sign|');
        out.pub = core.pointToPub(signPub);
      }
      if (opt.epub) {
        const encPub = await derivePubWithRetry(core.parsePub(opt.epub), opt.seed, 'ZEN.DERIVE|encrypt|');
        out.epub = core.pointToPub(encPub);
      }
      if (cb) { try { cb(out); } catch (e) { console.log(e); } }
      return out;
    }

    let signPriv = opt.priv ? core.parseScalar(opt.priv, 'Signing key') : null;
    let encPriv = opt.epriv ? core.parseScalar(opt.epriv, 'Encryption key') : null;

    if (!signPriv && opt.seed) { signPriv = await core.hashToScalar(opt.seed, 'ZEN|secp256k1|sign|'); }
    if (!encPriv && opt.seed) { encPriv = await core.hashToScalar(opt.seed, 'ZEN|secp256k1|encrypt|'); }
    if (!signPriv && !opt.pub) { signPriv = await core.randomScalar(); }
    if (!encPriv && !opt.epub) { encPriv = await core.randomScalar(); }

    if (signPriv) {
      out.priv = core.scalarToString(signPriv);
      out.pub = core.pointToPub(core.publicFromPrivate(signPriv));
    } else if (opt.pub) {
      out.pub = core.pointToPub(core.parsePub(opt.pub));
    }

    if (encPriv) {
      out.epriv = core.scalarToString(encPriv);
      out.epub = core.pointToPub(core.publicFromPrivate(encPriv));
    } else if (opt.epub) {
      out.epub = core.pointToPub(core.parsePub(opt.epub));
    }

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

export { pair };
export default pair;
