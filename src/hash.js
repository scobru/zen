import shim from "./shim.js";
import settings from "./settings.js";
import sha256 from "./sha256.js";
import keccak256 from "./keccak256.js";
import base62 from "./base62.js";
import { cryptoErr, cbOk } from "./err.js";

function normhash(name) {
  const raw = (name || "").toString();
  const slim = raw.toLowerCase().replace(/[\s_-]/g, "");
  if (!slim) {
    return "";
  }
  if (slim === "keccak" || slim === "keccak256") {
    return "KECCAK-256";
  }
  if (slim === "sha1") {
    return "SHA-1";
  }
  if (slim === "sha256") {
    return "SHA-256";
  }
  if (slim === "sha384") {
    return "SHA-384";
  }
  if (slim === "sha512") {
    return "SHA-512";
  }
  return raw;
}

function ishash(name) {
  const n = normhash(name);
  return n === "KECCAK-256" || n.indexOf("SHA-") === 0;
}

function encbuf(data, enc) {
  if (enc === "base62") {
    return base62.bufToB62(data);
  }
  if (enc === "base64") {
    return shim.Buffer.from(data).toString("base64");
  }
  return shim.Buffer.from(data).toString(enc);
}

async function digest(data, name) {
  const n = normhash(name);
  if (n === "KECCAK-256") {
    return keccak256(data);
  }
  return sha256(data, n || undefined);
}

export { normhash };

function intToB62(n) {
  const A = base62.ALPHA;
  if (n === 0) return A[0];
  let s = "";
  while (n > 0) {
    s = A[n % 62] + s;
    n = Math.floor(n / 62);
  }
  return s;
}

export default async function hash(data, pair, cb, opt) {
  try {
    opt = opt || {};
    let salt = (pair || {}).epub || pair;
    const enc = opt.encode || "base62";

    if (salt instanceof Function) {
      cb = salt;
      salt = undefined;
    }

    // Mining mode: loop with base62-encoded nonces until the hash meets pow requirements.
    // The nonce is embedded in the data (not opt.salt) so the proof is self-contained
    // and compatible with pen.js PoW verification, which hashes the field value directly
    // via SHA-256 with no salt.
    if (opt.pow) {
      const pow = opt.pow;
      const prefix = (pow.unit || "0").repeat(
        pow.difficulty != null ? pow.difficulty : 1,
      );
      const subOpt = Object.assign({}, opt);
      delete subOpt.pow;
      let counter = 0;
      while (true) {
        const nonce = intToB62(counter);
        const proof =
          typeof data === "function"
            ? String(data(nonce))
            : String(data) + ":" + nonce;
        const h = await hash(proof, salt, null, subOpt);
        if ((h || "").indexOf(prefix) === 0) {
          const result = { hash: h, nonce, proof };
          return cbOk(cb, result);
        }
        counter++;
        if (counter % 1000 === 0) {
          await new Promise((r) => setTimeout.turn(r));
        }
      }
    }

    if (data instanceof ArrayBuffer) {
      data = new Uint8Array(data);
      data = new shim.TextDecoder("utf-8").decode(data);
    }
    data = typeof data === "string" ? data : await shim.stringify(data);

    if (ishash(opt.name)) {
      let hashed = shim.Buffer.from(await digest(data, opt.name), "binary");
      hashed = encbuf(hashed, enc);
      return cbOk(cb, hashed);
    }

    if (typeof salt === "number") {
      salt = salt.toString();
    }
    if (typeof opt.salt === "number") {
      opt.salt = opt.salt.toString();
    }
    salt = salt || shim.random(9);

    // HKDF: fast key derivation for already-high-entropy key material.
    // Use when input is a strong seed (e.g. WebAuthn-derived), NOT a password.
    // ~1000x faster than PBKDF2 because there are no iterations.
    if ((opt.name || "").toUpperCase() === "HKDF") {
      const te = new shim.TextEncoder();
      const hkdfKey = await (shim.ossl || shim.subtle).importKey(
        "raw",
        te.encode(data),
        "HKDF",
        false,
        ["deriveBits"],
      );
      const hkdfBits = await (shim.ossl || shim.subtle).deriveBits(
        {
          name: "HKDF",
          hash: opt.hash || settings.pbkdf2.hash,
          salt: te.encode(opt.salt || salt),
          info: te.encode(opt.info || ""),
        },
        hkdfKey,
        opt.length || settings.pbkdf2.ks * 8,
      );
      data = shim.random(data.length);
      let hkdfOut = shim.Buffer.from(hkdfBits, "binary");
      hkdfOut = encbuf(hkdfOut, enc);
      return cbOk(cb, hkdfOut);
    }

    const key = await (shim.ossl || shim.subtle).importKey(
      "raw",
      new shim.TextEncoder().encode(data),
      { name: opt.name || "PBKDF2" },
      false,
      ["deriveBits"],
    );
    const bits = await (shim.ossl || shim.subtle).deriveBits(
      {
        name: opt.name || "PBKDF2",
        iterations: opt.iterations || settings.pbkdf2.iter,
        salt: new shim.TextEncoder().encode(opt.salt || salt),
        hash: opt.hash || settings.pbkdf2.hash,
      },
      key,
      opt.length || settings.pbkdf2.ks * 8,
    );
    data = shim.random(data.length);
    let out = shim.Buffer.from(bits, "binary");
    out = encbuf(out, enc);
    return cbOk(cb, out);
  } catch (e) {
    return cryptoErr(e, cb);
  }
}
