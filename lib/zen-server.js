import './yson.js';
import './store.js';
import './rfs.js';
import './rs3.js';
import './wire.js';
// zen.js wires ZEN security on GUN at load time — no SEA import
import '../axe.js';
import './multicast.js';
import './stats.js';
import __gun from '../gun.js';
import __serve from './serve.js';
import ZEN from '../zen.js';

var Gun = __gun, u;
Gun.serve = __serve;
Gun.on('opt', function(root) {
    if (u === root.opt.super) { root.opt.super = true; }
    if (u === root.opt.faith) { root.opt.faith = true; }
    root.opt.log = root.opt.log || Gun.log;
    this.to.next(root);
});

export default ZEN;
