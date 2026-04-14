import __gun from '../gun.js';
import __open from './open.js';
var Gun = (typeof globalThis !== "undefined")? globalThis.Gun : __gun;
Gun.chain.open || __open;

Gun.chain.load = function(cb, opt, at){
	(opt = opt || {}).off = !0;
	return this.open(cb, opt, at);
}