import shim from "./shim.js";
import settings from "./settings.js";
import sha256 from "./sha256.js";

function rawSaltToString(s) {
  if (!s) return "";
  if (typeof s === "string") return s;
  if (s instanceof Uint8Array || Array.isArray(s)) {
    return Array.from(s, (b) => String.fromCharCode(b)).join("");
  }
  if (typeof s.toString === "function") {
    try {
      return s.toString("latin1");
    } catch (_) {
      return s.toString("utf8");
    }
  }
  return String(s);
}

export default async function aeskey(key, salt, opt) {
  opt = opt || {};
  const saltObj = salt || shim.random(8);
  const combo = key + rawSaltToString(saltObj);
  const hash = shim.Buffer.from(await sha256(combo), "binary");
  const jwkKey = settings.keyToJwk(hash);
  return await shim.subtle.importKey(
    "jwk",
    jwkKey,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"],
  );
}
