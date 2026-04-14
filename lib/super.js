import __gun from '../gun.js';
import __radix from './radix.js';

let __defaultExport;
(function(){
	var Gun = (typeof globalThis !== "undefined")? globalThis.Gun : __gun;
	var Rad = (Gun.globalThis||{}).Radix || __radix;
	/// Store the subscribes
	Gun.subs = Rad();
	function input(msg){
		var at = this.as, to = this.to, peer = (msg._||empty).via;
		var get = msg.get, soul, key;
		if(!peer || !get){ return to.next(msg) }
		// console.log("super", msg);
		if(soul = get['#']){
			if(key = get['.']){

			} else {

			}
			if (!peer.id) {console.log('[*** WARN] no peer.id %s', soul);}
			var subs = Gun.subs(soul) || null;
			var tmp = subs ? subs.split(',') : [], p = at.opt.peers;
			if (subs) {
				Gun.obj.map(subs.split(','), function(peerid) {
					if (peerid in p) { tmp.push(peerid); }
				});
			}
			if (tmp.indexOf(peer.id) === -1) { tmp.push(peer.id);}
			tmp = tmp.join(',');
			Gun.subs(soul, tmp);
			var dht = {};
			dht[soul] = tmp;
			at.opt.mesh.say({dht:dht}, peer);
		}
		to.next(msg);
	}
	var empty = {}, u;
	if(Gun.globalThis){ return }
	try{__defaultExport = input}catch(e){}
}());
export default __defaultExport;
