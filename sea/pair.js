import __root from './root.js';
import __pair from './secp256k1.pair.js';

let __defaultExport;
(function(){

    var SEA = __root;
    SEA.pair = SEA.pair || (async (cb, opt) => { try {
      return await __pair(cb, opt);
    } catch(e) {
      SEA.err = e;
      if(SEA.throw) throw e;
      if(cb) try { cb(); } catch(cbErr) {}
      return;
    }});

    __defaultExport = SEA.pair;
  
}());
export default __defaultExport;
