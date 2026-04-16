import __path from 'path';
import __fs from 'fs';
import __zen from '../zen.js';
import tpath from './tpath.js';
function Store(opt){
	opt = opt || {};
	opt.log = opt.log || console.log;
	opt.file = tpath(opt.file, 'radata', Zen && Zen.TESTING);
	var fs = __fs, u;

	var store = function Store(){};
	if(Store[opt.file]){
		console.log("Warning: reusing same fs store and options as 1st.");
		return Store[opt.file];
	}
	Store[opt.file] = store;
	var puts = {};
	function ensureDir(){
		if(!fs.existsSync(opt.file)){ fs.mkdirSync(opt.file, {recursive: true}) }
	}

	// TODO!!! ADD ZLIB INFLATE / DEFLATE COMPRESSION!
	store.put = function(file, data, cb){
		ensureDir();
		var random = Math.random().toString(36).slice(-3);
		puts[file] = {id: random, data: data};
		var dir = __path.dirname(opt.file), base = __path.basename(opt.file);
		var tmp = __path.join('.' === dir ? '' : dir, base+'-'+file+'-'+random+'.tmp');
		fs.writeFile(tmp, data, function(err, ok){
			if(err){
				if(random === (puts[file]||'').id){ delete puts[file] }
				return cb(err);
			}
			move(tmp, opt.file+'/'+file, function(err, ok){
				if(random === (puts[file]||'').id){ delete puts[file] }
				cb(err, ok || !err);
			});
		});
	};
	store.get = function(file, cb){ var tmp; // this took 3s+?
		if(tmp = puts[file]){ cb(u, tmp.data); return }
		if(!fs.existsSync(opt.file)){ cb(); return }
		fs.readFile(opt.file+'/'+file, function(err, data){
			if(err){
				if('ENOENT' === (err.code||'').toUpperCase()){
					return cb();
				}
				opt.log("ERROR:", err);
			}
			cb(err, data);
		});
	};

	ensureDir();

	function move(oldPath, newPath, cb) {
		var retry = 0, max = 12;
		function again(){
			fs.rename(oldPath, newPath, function (err) {
				if(!err){ return cb() }
				if (err.code === 'EXDEV') {
					var readStream = fs.createReadStream(oldPath);
					var writeStream = fs.createWriteStream(newPath);

					readStream.on('error', cb);
					writeStream.on('error', cb);

					readStream.on('close', function () {
						fs.unlink(oldPath, cb);
					});

					readStream.pipe(writeStream);
					return;
				}
				if('EEXIST' === err.code || 'EPERM' === err.code || 'EACCES' === err.code || 'EBUSY' === err.code){
					return fs.unlink(newPath, function(unlinkErr){
						if(unlinkErr && 'ENOENT' !== unlinkErr.code){
							if(++retry > max){ return cb(err) }
							return setTimeout(again, 10 * retry);
						}
						if(++retry > max){ return cb(err) }
						setTimeout(again, 5 * retry);
					});
				}
				cb(err);
			});
		}
		again();
	};

	store.list = function(cb, match, params, cbs){
		ensureDir();
		var dir;
		try{
			dir = fs.readdirSync(opt.file);
		}catch(err){
			if('ENOENT' === (err.code || '').toUpperCase()){ cb(); return }
			throw err;
		}
		dir.forEach(function(file){
			cb(file);
		})
		cb();
	};
	
	return store;
}

var Zen = __zen;
Zen.on('create', function(root){
	this.to.next(root);
	var opt = root.opt;
	if(opt.rfs === false){ return }
	opt.store = opt.store || ((!Zen.window || opt.rfs === true) && Store(opt));
});

export default Store;
