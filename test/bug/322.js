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

    var opt = { file: 'radatatest' };

	describe('API - map', function(){
		it('Save example data', function(done) {
			var zen = Zen(opt);
			zen.get('users').set({u:1});
			zen.get('users').set({u:2});
			zen.get('users').set({u:2});
			zen.get('users').map().on(function(user) { user.index = 'someIndex'; });
			setTimeout(function() { done(); }, 200);
		});
		it('Make sure the value "someIndex" not be saved in storage', function(done) {
			var zen = Zen(opt), values=[];
			zen.get('users').map().once(function(v) { values.push(v.index); });
			setTimeout(function() {
				expect(values.indexOf('someIndex')===-1).to.be(true);
				done();
			}, 200);
		});
	});
});
