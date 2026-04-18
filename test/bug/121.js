import __ZEN from '../../zen.js';
import '../../lib/store.js';
import '../../lib/rfs.js';
import __fs from 'fs';
import __fsrm from '../../lib/fsrm.js';
import __expect from '../expect.js';
var __gun;
{
  var W = function(o){return new __ZEN(o)};
  Object.setPrototypeOf(W, __ZEN);
  W.prototype = __ZEN.prototype;
  __gun = W;
}
import __serve from '../../lib/serve.js';
/// bug-121
describe('ZEN', function(){
	var root;
	{
		var env;
		if(typeof global !== 'undefined'){ env = global }
		if(typeof window !== 'undefined'){ env = window }
		root = env.window? env.window : global;
		try{ env.window && root.localStorage && root.localStorage.clear() }catch(e){}
		try{ localStorage.clear() }catch(e){}
		try{ indexedDB.deleteDatabase('radatatest') }catch(e){}
		try{ __fs.unlinkSync('tmp/data.json') }catch(e){}
 		try{ __fsrm('tmp/radatatest') }catch(e){}
		try{ var expect = global.expect = __expect }catch(e){}

		//root.Zen = root.Zen || load('../zen');
		if(root.Zen){
			root.Zen = root.Zen;
			root.Zen.TESTING = true;
		} else {
            root.Zen = __gun;
            root.Zen.TESTING = true;
            Zen.serve = __serve;
        }
	}(this));

	describe('API - map', function(){
		it('map and put', function(done) {
			var zen = Zen();
			var ref = zen.get('test');
			var value = {1:{v:11},2:{v:22},3:{v:33},4:{v:44},5:{v:55}};
			ref.put(value, function(ack) {
				if (ack.err) { expect(!ack.err).to.be(true); done(); return; }
				var vput = 100;
				ref.map().get('v').put(vput /*, function(ack) { console.log('MAP ACK:!!!!!!! ', ack); }*/);
				var total = 0;
				setTimeout(function() {
					ref.map().get('v').once(function(v, k) {
						expect(v === vput).to.be(true);
						if (++total === 5) { done(); }
					});
				}, 1000); 
			});
		});
	});
});
