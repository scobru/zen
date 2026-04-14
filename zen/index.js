import GUN from '../gun.js';
import SEA from '../sea.js';
import PEN from '../lib/pen.js';

class ZEN {
  constructor(opt = {}) {
    this.opt = opt;
    this._GUN = opt.GUN || opt.gun || null;
    this._GUNOpt = this._GUN ? null : (opt.GUNOpt || opt.gunOpt || opt);
  }

  static pen(spec = {}) { return SEA.pen(spec) }
  static candle(opts = {}) { return SEA.candle(opts) }
  static pair(...args) { return SEA.pair(...args) }
  static sign(...args) { return SEA.sign(...args) }
  static verify(...args) { return SEA.verify(...args) }
  static encrypt(...args) { return SEA.encrypt(...args) }
  static decrypt(...args) { return SEA.decrypt(...args) }
  static secret(...args) { return SEA.secret(...args) }
  static certify(...args) { return SEA.certify(...args) }
  static work(...args) { return SEA.work(...args) }

  get GUN() {
    if (!this._GUN) {
      this._GUN = GUN(this._GUNOpt || {});
    }
    return this._GUN;
  }

  get PEN() { return PEN }
  get ready() { return PEN.ready }

  use(gun) {
    this._GUN = gun;
    return this;
  }

  chain() { return this.GUN }
  pen(spec = {}) { return this.constructor.pen(spec) }
  candle(opts = {}) { return this.constructor.candle(opts) }
  pair(...args) { return this.constructor.pair(...args) }
  sign(...args) { return this.constructor.sign(...args) }
  verify(...args) { return this.constructor.verify(...args) }
  encrypt(...args) { return this.constructor.encrypt(...args) }
  decrypt(...args) { return this.constructor.decrypt(...args) }
  secret(...args) { return this.constructor.secret(...args) }
  certify(...args) { return this.constructor.certify(...args) }
  work(...args) { return this.constructor.work(...args) }

  get(...args) { return this.GUN.get(...args) }
  put(...args) { return this.GUN.put(...args) }
  on(...args) { return this.GUN.on(...args) }
  once(...args) { return this.GUN.once(...args) }
  map(...args) { return this.GUN.map(...args) }
  set(...args) { return this.GUN.set(...args) }
  back(...args) { return this.GUN.back(...args) }
}

ZEN.GUN = GUN;
ZEN.SEA = SEA;
ZEN.PEN = PEN;

function createZEN(opt) {
  return new ZEN(opt);
}

export { ZEN, GUN, SEA, PEN, createZEN };
export default ZEN;
