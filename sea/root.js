let __defaultExport;
(function(){

    // Security, Encryption, and Authorization: SEA.js
    // MANDATORY READING: https://gun.eco/explainers/data/security.html
    // IT IS IMPLEMENTED IN A POLYFILL/SHIM APPROACH.
    // THIS IS AN EARLY ALPHA!

    var root = {};
    root.window = (typeof globalThis !== "undefined" && typeof window === "undefined" && typeof WorkerGlobalScope !== "undefined") ? globalThis : (typeof window !== "undefined" ? window : undefined);

    var tmp = root.window || root, u;
    var SEA = tmp.SEA || {};

    if(SEA.window = root.window){ SEA.window.SEA = SEA }

    try{ if(u+'' !== typeof MODULE){ MODULE.exports = SEA } }catch(e){}
    __defaultExport = SEA;
  
}());
export default __defaultExport;
