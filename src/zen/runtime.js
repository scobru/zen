import securityRoot from './security.js';
import pair from './pair.js';
import sign from './sign.js';
import verify from './verify.js';
import encrypt from './encrypt.js';
import decrypt from './decrypt.js';
import secret from './secret.js';
import work from './work.js';
import shim from './shim.js';
import keyid from './keyid.js';

securityRoot.pair = pair;
securityRoot.sign = sign;
securityRoot.verify = verify;
securityRoot.encrypt = encrypt;
securityRoot.decrypt = decrypt;
securityRoot.secret = secret;
securityRoot.work = work;
securityRoot.random = shim.random;
securityRoot.Buffer = shim.Buffer;
securityRoot.keyid = keyid;

const security = {
  check: securityRoot.check,
  opt: securityRoot.opt
};

export { security };
export default security;
