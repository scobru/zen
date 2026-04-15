import __root from './root.js';
import __secret from './secp256k1.secret.js';

let __defaultExport;
(function(){

    var SEA = __root;
    // Derive shared secret from other's pub and my epub/epriv 
    SEA.secret = SEA.secret || (async (key, pair, cb, opt) => { try {
      opt = opt || {};
      if(!pair || !pair.epriv || !pair.epub){
        if(!SEA.I){ throw 'No secret mix.' }
        pair = await SEA.I(null, {what: key, how: 'secret', why: opt.why});
      }
      return await __secret(key, pair, cb, opt);
    } catch(e) {
      console.log(e);
      SEA.err = e;
      if(SEA.throw){ throw e }
      if(cb){ cb() }
      return;
    }});

    __defaultExport = SEA.secret;
  
}());
export default __defaultExport;
