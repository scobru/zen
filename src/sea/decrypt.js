import __root from './root.js';
import __decrypt from './secp256k1.decrypt.js';

let __defaultExport;
(function(){

    var SEA = __root;

    SEA.decrypt = SEA.decrypt || (async (data, pair, cb, opt) => { try {
      opt = opt || {};
      var key = (pair||opt).epriv || pair;
      if(!key){
        if(!SEA.I){ throw 'No decryption key.' }
        pair = await SEA.I(null, {what: data, how: 'decrypt', why: opt.why});
        key = pair.epriv || pair;
      }
      return await __decrypt(data, key, cb, opt);
    } catch(e) { 
      SEA.err = e;
      if(SEA.throw){ throw e }
      if(cb){ cb() }
      return;
    }});

    __defaultExport = SEA.decrypt;

}());
export default __defaultExport;
