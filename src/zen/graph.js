import './book.js';
import './chain.js';
import './back.js';
import './put.js';
import './get.js';
import './on.js';
import './map.js';
import './set.js';
import './mesh.js';
import './websocket.js';
import './localStorage.js';
import ZEN from './root.js';

if (!ZEN.chain.then) {
  ZEN.chain.then = function(cb, opt) {
    var zen = this;
    var p = new Promise(function(res) { zen.once(res, opt); });
    return cb ? p.then(cb) : p;
  };
}

const graph = {
  core: ZEN,
  chain: ZEN.chain,
  create(opt = {}) {
    return ZEN(opt);
  },
  is(value) {
    return ZEN.is(value);
  }
};

export { graph };
export default graph;
