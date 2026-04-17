import __zen from "../zen.js";
import __open from "./open.js";
var Zen = __zen;
Zen.chain.open || __open;

Zen.chain.load = function (cb, opt, at) {
  (opt = opt || {}).off = !0;
  return this.open(cb, opt, at);
};
