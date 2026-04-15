import __shim from './shim.js';
import __sha1 from './sha1.js';
import __root from './root.js';
import __hash from './hash.js';
import __sign from './sign.js';
import __verify from './verify.js';
import __encrypt from './encrypt.js';
import __decrypt from './decrypt.js';
import __certify from './certify.js';
import __buffer from './buffer.js';

let __defaultExport;
(function(){

    var shim = __shim;
    var sha1hash = __sha1;
    // Practical examples about usage found in tests.
    var SEA = __root;
    SEA.hash = __hash;
    SEA.sign = __sign;
    SEA.verify = __verify;
    SEA.encrypt = __encrypt;
    SEA.decrypt = __decrypt;
    SEA.certify = __certify;
    // SEA.opt.aeskey is intentionally left disabled; it caused WebCrypto issues upstream.

    SEA.random = SEA.random || shim.random;

    // This is Buffer used in SEA and usable from Gun/SEA application also.
    // For documentation see https://nodejs.org/api/buffer.html
    SEA.Buffer = SEA.Buffer || __buffer;

    // These SEA functions support now ony Promises or
    // async/await (compatible) code, use those like Promises.
    //
    // Creates a wrapper library around Web Crypto API
    // for various AES, ECDSA, PBKDF2 functions we called above.
    // Calculate public key KeyID aka PGPv4 (result: 8 bytes as hex string)
    SEA.keyid = SEA.keyid || (async (pub) => {
      try {
        // Decode pub key coordinates (handles old 87-char base64url and new 88-char base62)
        var xy = SEA.base62.pubToJwkXY(pub);
        const pb = shim.Buffer.concat(
          [xy.x, xy.y].map((t) => shim.Buffer.from(atob(t.replace(/-/g,'+').replace(/_/g,'/')), 'binary'))
        )
        // id is PGPv4 compliant raw key
        const id = shim.Buffer.concat([
          shim.Buffer.from([0x99, pb.length / 0x100, pb.length % 0x100]), pb
        ])
        const sha1 = await sha1hash(id)
        const hash = shim.Buffer.from(sha1, 'binary')
        return hash.toString('hex', hash.length - 8)  // 16-bit ID as hex
      } catch (e) {
        console.log(e)
        throw e
      }
    });
    // all done!
    // Obviously it is missing MANY necessary features. This is only an alpha release.
    // Please experiment with it, audit what I've done so far, and complain about what needs to be added.
    // SEA should be a full suite that is easy and seamless to use.
    // Again, scroll naer the top, where I provide an EXAMPLE of how to create a user and sign in.
    // Once logged in, the rest of the code you just read handled automatically signing/validating data.
    // But all other behavior needs to be equally easy, like opinionated ways of
    // Adding friends (trusted public keys), sending private messages, etc.
    // Cheers! Tell me what you think.
    ((SEA.window||{}).GUN||{}).SEA = SEA;

    __defaultExport = SEA
    // -------------- END SEA MODULES --------------------
    // -- BEGIN SEA+GUN MODULES: BUNDLED BY DEFAULT UNTIL OTHERS USE SEA ON OWN -------
  
}());
export default __defaultExport;
