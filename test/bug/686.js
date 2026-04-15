import __ZEN from '../../zen.js';
import '../../lib/store.js';
import '../../lib/rfs.js';
import '../../sea.js';
import __fs from 'fs';
import __fsrm from '../../lib/fsrm.js';
import __expect from '../expect.js';
var __gun = (function(){
  var W = function(o){return new __ZEN(o)};
  Object.setPrototypeOf(W, __ZEN);
  W.prototype = __ZEN.prototype;
  return W;
}());
import __serve from '../../lib/serve.js';
describe('ZEN', function(){
	var root;
	(function(){
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

		//root.Gun = root.Gun || load('../gun');
		if(root.Gun){
			root.Gun = root.Gun;
			root.Gun.TESTING = true;
		} else {
            root.Gun = __gun;
            root.Gun.TESTING = true;
            Gun.serve = __serve;
        }
	}(this));
	var opt = { file: 'radatatest' };
	describe('SEA', function() {
		it('put null string', function(done) {
			var gun = Gun(opt);
			gun.get('test').get('key').put('null', function(ack) {
				if (ack.err) { expect(!ack.err).to.be(true); done(); }
				gun.get('test').get('key').once(function(v) {
					expect(v === 'null').to.be(true);
					done();
				});
			});
		});
		it('put null string in user land', function(done) {
			var gun = Gun(opt);
			var user = gun.user();
			var u={a:'usr', p:'pass'};
			var value = 'null';
			user.create(u.a, u.p, function(ack) {
				usr = user.auth(u.a, u.p, function() {
					usr.get('test').get('key').put(value, function(ack) {
						if (ack.err) { expect(!ack.err).to.be(true); done(); }
						usr.get('test').get('key').once(function(v) {
							expect(v === value).to.be(true); /// must be null string.
							done();
						});
					});
				});
			});
		});
	});
});
