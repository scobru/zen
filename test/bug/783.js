
import '../../lib/store.js';
import '../../lib/rfs.js';
import '../../sea.js';
import __fs from 'fs';
import __fsrm from '../../lib/fsrm.js';
import __expect from '../expect.js';
import __gun from '../../gun.js';
import __serve from '../../lib/serve.js';
///// bug-783

describe('Gun', function(){
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

	describe('erro sea', function(){
		it('verbose console.log debugging', function(done) {
			var gun = Gun({multicast:false, axe:false});
			var ref = gun.get('test').get('1');
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
