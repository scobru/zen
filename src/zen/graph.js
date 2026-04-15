import GUN from '../../gun.js';

if (!GUN.chain.then) {
  GUN.chain.then = function(cb, opt) {
    var gun = this;
    var p = new Promise(function(res) { gun.once(res, opt); });
    return cb ? p.then(cb) : p;
  };
}

const graph = {
  core: GUN,
  chain: GUN.chain,
  create(opt = {}) {
    return GUN(opt);
  },
  is(value) {
    return GUN.is(value);
  }
};

export { graph };
export default graph;
