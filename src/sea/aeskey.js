import __shim from './shim.js';
import __settings from './settings.js';
import __sha256 from './sha256.js';

let __defaultExport;
(function(){

    var shim = __shim;
    var S = __settings;
    var sha256hash = __sha256;

    const importGen = async (key, salt, opt) => {
      //const combo = shim.Buffer.concat([shim.Buffer.from(key, 'utf8'), salt || shim.random(8)]).toString('utf8') // old
      opt = opt || {};
      const combo = key + (salt || shim.random(8)).toString('utf8'); // new
      const hash = shim.Buffer.from(await sha256hash(combo), 'binary')

      const jwkKey = S.keyToJwk(hash)      
      return await shim.subtle.importKey('jwk', jwkKey, {name:'AES-GCM'}, false, ['encrypt', 'decrypt'])
    }
    __defaultExport = importGen;

}());
export default __defaultExport;
