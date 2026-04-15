import './yson.js';
import './store.js';
import './rfs.js';
import './rs3.js';
import './wire.js';
import '../src/sea/index.js';
import '../axe.js';
import './multicast.js';
import './stats.js';
import __zen from '../zen.js';
import __serve from './serve.js';

let __defaultExport;
(function(){
    var Zen = __zen;
var u;
    Zen.serve = __serve;
    //process.env.GUN_ENV = process.env.GUN_ENV || 'debug';
    //console.LOG = {}; // only do this for dev.
    Zen.on('opt', function(root){
		if(u === root.opt.super){ root.opt.super = true }
		if(u === root.opt.faith){ root.opt.faith = true } // HNPERF: This should probably be off, but we're testing performance improvements, please audit.
		root.opt.log = root.opt.log || Zen.log;
		this.to.next(root);
	})

    try{}catch(e){}
    try{}catch(e){}
    __defaultExport = Zen;
}());
export default __defaultExport;
