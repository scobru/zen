import __shim from './shim.js';

let __defaultExport;
(function(){

    var shim = __shim;
    __defaultExport = async function(d, o){
      var t = (typeof d == 'string')? d : await shim.stringify(d);
      var hash = await shim.subtle.digest({name: o||'SHA-256'}, new shim.TextEncoder().encode(t));
      return shim.Buffer.from(hash);
    }

}());
export default __defaultExport;
