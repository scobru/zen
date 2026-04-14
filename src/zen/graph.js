import GUN from '../../gun.js';

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
