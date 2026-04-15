import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import __ZEN from '../zen.js';
var __gun = (function(){
  var W = function(o){return new __ZEN(o)};
  Object.setPrototypeOf(W, __ZEN);
  W.prototype = __ZEN.prototype;
  Object.defineProperty(W.prototype, '_', {
    get: function(){ return this._graph._; },
    configurable: true
  });
  return W;
}());
var Gun = __gun;
import SEA from '../sea.js';
import '../lib/file.js';
import serve from '../lib/server.js';

if (process.env.SEA) {
  Gun.SEA = SEA;
}

const myDir = dirname(fileURLToPath(import.meta.url));

export default serve(Gun, myDir);
