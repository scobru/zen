import __root from './root.js';
import __buffer from './buffer.js';
import __crypto from 'crypto';
import __webcrypto from '@peculiar/webcrypto';
import __text_encoding from '../lib/text-encoding/index.js';

let __defaultExport;
(function(){

    const SEA = __root
    const globalScope = (typeof globalThis !== 'undefined') ? globalThis : (typeof global !== 'undefined' ? global : (typeof window !== 'undefined' ? window : {}));
    const api = {Buffer: __buffer || globalScope.Buffer}
    var o = {}, u;

    // ideally we can move away from JSON entirely? unlikely due to compatibility issues... oh well.
    JSON.parseAsync = JSON.parseAsync || function(t,cb,r){ var u; try{ cb(u, JSON.parse(t,r)) }catch(e){ cb(e) } }
    JSON.stringifyAsync = JSON.stringifyAsync || function(v,cb,r,s){ var u; try{ cb(u, JSON.stringify(v,r,s)) }catch(e){ cb(e) } }

    api.parse = function(t,r){ return new Promise(function(res, rej){
      JSON.parseAsync(t,function(err, raw){ err? rej(err) : res(raw) },r);
    })}
    api.stringify = function(v,r,s){ return new Promise(function(res, rej){
      JSON.stringifyAsync(v,function(err, raw){ err? rej(err) : res(raw) },r,s);
    })}

    if(SEA.window){
      api.crypto = SEA.window.crypto || SEA.window.msCrypto
      api.subtle = (api.crypto||o).subtle || (api.crypto||o).webkitSubtle;
      api.TextEncoder = SEA.window.TextEncoder;
      api.TextDecoder = SEA.window.TextDecoder;
      api.random = (len) => api.Buffer.from(api.crypto.getRandomValues(new Uint8Array(api.Buffer.alloc(len))));
    }
    if(!api.crypto && globalScope.crypto){
      api.crypto = globalScope.crypto;
      api.subtle = (api.crypto||o).subtle || (api.crypto||o).webkitSubtle;
      api.random = (len) => api.Buffer.from(api.crypto.getRandomValues(new Uint8Array(api.Buffer.alloc(len))));
    }
    if(!api.TextEncoder){ api.TextEncoder = globalScope.TextEncoder }
    if(!api.TextDecoder){ api.TextDecoder = globalScope.TextDecoder }
    if(!api.TextDecoder)
    {
      const { TextEncoder, TextDecoder } = __text_encoding;
      api.TextDecoder = TextDecoder;
      api.TextEncoder = TextEncoder;
    }
    if(!api.crypto)
    {
      try
      {
      var crypto = __crypto;
      Object.assign(api, {
        crypto,
        random: (len) => api.Buffer.from(crypto.randomBytes(len))
      });      
      const { Crypto: WebCrypto } = __webcrypto;
      api.ossl = api.subtle = new WebCrypto({directory: 'ossl'}).subtle // ECDH
    }
    catch(e){
      console.log("Please `npm install @peculiar/webcrypto` or add it to your package.json !");
    }}

    __defaultExport = api
  
}());
export default __defaultExport;
