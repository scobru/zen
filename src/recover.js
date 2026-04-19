import crv from "./curves.js";

async function recover(data, cb, opt) {
  try {
    opt = opt || {};
    const c0 = crv();
    const msg = await c0.settings.parse(data);
    if (!msg || msg.v === undefined || msg.v === null) {
      throw new Error("No recovery bit (v) in signature");
    }
    const c = crv((msg && msg.c) || opt.curve);
    const h = await c.shaBytes(msg.m);
    const sig = new Uint8Array(
      c.shim.Buffer.from(msg.s || "", opt.encode || "base64"),
    );
    if (sig.length !== 64) {
      throw new Error("Invalid signature length");
    }
    const r = c.bytesToBigInt(sig.slice(0, 32));
    const s = c.bytesToBigInt(sig.slice(32));
    if (r <= 0n || r >= c.N || s <= 0n || s >= c.N) {
      throw new Error("Signature out of range");
    }
    const point = c.recoverPub(msg.v, r, s, h);
    const pub = c.pointToPub(point);
    if (cb) {
      try {
        cb(pub);
      } catch (e) {
        console.log(e);
      }
    }
    return pub;
  } catch (e) {
    if (cb) {
      try {
        cb();
      } catch (x) {
        console.log(x);
      }
      return;
    }
    throw e;
  }
}

export { recover };
export default recover;
