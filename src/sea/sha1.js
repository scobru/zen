import __shim_2 from './shim.js';

let __defaultExport;
(function(){

    // This internal func returns SHA-1 hashed data for KeyID generation
    const __shim = __shim_2
    const subtle = __shim.subtle
    const ossl = __shim.ossl ? __shim.ossl : subtle
    const sha1hash = (b) => ossl.digest({name: 'SHA-1'}, new ArrayBuffer(b))
    __defaultExport = sha1hash

}());
export default __defaultExport;
