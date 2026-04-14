import shim from './shim.js';
import base62 from './base62.js';

async function sha1hash(bytes) {
  const crypto = shim.ossl || shim.subtle;
  return crypto.digest({ name: 'SHA-1' }, new Uint8Array(bytes));
}

export default async function keyid(pub) {
  const xy = base62.pubToJwkXY(pub);
  const pb = shim.Buffer.concat(
    [xy.x, xy.y].map(function(t) {
      return shim.Buffer.from(atob(t.replace(/-/g, '+').replace(/_/g, '/')), 'binary');
    })
  );
  const id = shim.Buffer.concat([
    shim.Buffer.from([0x99, pb.length / 0x100, pb.length % 0x100]),
    pb
  ]);
  const hash = shim.Buffer.from(await sha1hash(id), 'binary');
  return hash.toString('hex', hash.length - 8);
}
