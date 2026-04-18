
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
///// bug-783

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

	describe('erro sea', function(){
		it('verbose console.log debugging', function(done) {
			var zen = Zen({multicast:false, axe:false});
			var ref = zen.get('test').get('1');
			var vput = 'SEA{}';
			ref.put(vput, function(ack, yay){ console.log('ACK: ', ack); /// must ack all
		          ref.once(function(v,k) { console.log('SALVOU k:%s, v:', k, v);
                            expect(v===vput).to.be(true);
			    done();
			});
	            });
		});
	} );
});
