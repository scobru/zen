import crv from "./curves.js";
import applyFormat from "./format.js";
import { cryptoErr, cbOk } from "./err.js";

async function derivepriv(c, priv, seed, label) {
  for (let i = 0; i < 100; i++) {
    const off = await c.hashToScalar(seed, label + (i ? i : ""));
    const d = c.mod(priv + off, c.N);
    if (d !== 0n) {
      return d;
    }
  }
  throw new Error("Failed to derive non-zero private key");
}

async function derivepub(c, pt, seed, label) {
  for (let i = 0; i < 100; i++) {
    const off = await c.hashToScalar(seed, label + (i ? i : ""));
    const d = c.pointAdd(pt, c.pointMultiply(off, c.G));
    if (d) {
      return d;
    }
  }
  throw new Error("Failed to derive valid public key");
}

async function pair(cb, opt) {
  try {
    opt = opt || {};
    const curveName = opt.curve || "secp256k1";
    const c = crv(curveName);
    if (opt.curve && c.curve !== curveName && curveName !== "secp256r1") {
      throw new Error("Unknown curve: " + curveName);
    }
    const format = opt.format || "zen";
    // Use c.curve as the canonical name for deterministic labels so that
    // aliases (secp256r1 → p256) produce the same key from the same seed.
    const labelCurve = c.curve;

    let spriv = null,
      spub = null,
      epriv = null,
      epub = null;

    if (opt.seed && (opt.priv || opt.epriv || opt.pub || opt.epub)) {
      // Additive derivation from existing key + seed
      if (opt.priv) {
        spriv = await derivepriv(
          c,
          c.parseScalar(opt.priv, "Signing key"),
          opt.seed,
          "ZEN.DERIVE|sign|",
        );
        spub = c.publicFromPrivate(spriv);
      }
      if (opt.epriv) {
        epriv = await derivepriv(
          c,
          c.parseScalar(opt.epriv, "Encryption key"),
          opt.seed,
          "ZEN.DERIVE|encrypt|",
        );
        epub = c.publicFromPrivate(epriv);
      }
      if (opt.pub) {
        spub = await derivepub(
          c,
          c.parsePub(opt.pub),
          opt.seed,
          "ZEN.DERIVE|sign|",
        );
      }
      if (opt.epub) {
        epub = await derivepub(
          c,
          c.parsePub(opt.epub),
          opt.seed,
          "ZEN.DERIVE|encrypt|",
        );
      }
    } else {
      // Generate fresh or restore from private / seed
      spriv = opt.priv ? c.parseScalar(opt.priv, "Signing key") : null;
      epriv = opt.epriv ? c.parseScalar(opt.epriv, "Encryption key") : null;

      // Seed labels use canonical c.curve so aliases (secp256r1 ≡ p256) share the same key.
      // For secp256k1: 'ZEN|secp256k1|sign|' matches the original hardcoded value — backward compat.
      if (!spriv && opt.seed) {
        spriv = await c.hashToScalar(opt.seed, "ZEN|" + labelCurve + "|sign|");
      }
      if (!spriv && opt.seed) {
        spriv = await c.hashToScalar(opt.seed, "ZEN|" + labelCurve + "|sign|");
      }
      if (!epriv && opt.seed) {
        epriv = await c.hashToScalar(
          opt.seed,
          "ZEN|" + labelCurve + "|encrypt|",
        );
      }
      if (!spriv && !opt.pub) {
        spriv = await c.randomScalar();
      }
      if (!epriv && !opt.epub) {
        epriv = await c.randomScalar();
      }

      if (spriv) {
        spub = c.publicFromPrivate(spriv);
      } else if (opt.pub) {
        spub = c.parsePub(opt.pub);
      }

      if (epriv) {
        epub = c.publicFromPrivate(epriv);
      } else if (opt.epub) {
        epub = c.parsePub(opt.epub);
      }
    }

    const out = await applyFormat(format, labelCurve, c, {
      signPriv: spriv,
      signPub: spub,
      encPriv: epriv,
      encPub: epub,
    });
    return cbOk(cb, out);
  } catch (e) {
    return cryptoErr(e, cb);
  }
}

export { pair };
export default pair;
