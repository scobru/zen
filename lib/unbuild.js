import fs from 'fs';
import nodePath from 'path';
import rm from './fsrm.js';
import { fileURLToPath } from 'node:url';
import { dirname as __dirnameOf } from 'node:path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = __dirnameOf(__filename);
var dir = __dirname + '/../';

var read = function(path){
	return fs.readFileSync(nodePath.join(dir, path)).toString();
};

var write = function(path, data){
	path = nodePath.join(dir, path);
	fs.mkdirSync(nodePath.dirname(path), {recursive: true});
	return fs.writeFileSync(path, data);
};

var mk = function(path){
	path = nodePath.join(dir, path);
  if(fs.existsSync(path)){ return }
	fs.mkdirSync(path);
};

var rn = function(path, newPath){
	path = nodePath.join(dir, path)
	newPath = nodePath.join(dir, newPath)
  if(fs.existsSync(newPath)){ return }
	fs.renameSync(path, newPath);
};

var between = function(text, start, end){
	end = end || start;
	var s = text.indexOf(start);
	if(s < 0){ return ''}
	s += start.length;
	var e = text.indexOf(end, s);
	if(e < 0){ return '' }
	var code = text.slice(s, e);
	return {s: s, t: code, e: e};
};

var next = function(start, end){
	end = end || start;
	if(!next.text){
		next.text = start;
		return;
	}
	var code = between(next.text, start, end);
	next.text = next.text.slice(code.e + end.length);
	return code.t;
};

var path = function(p){
	var code = next(',', ')');
	var path;
	try{path = eval(code);
	}catch(e){console.log("fail", e)};
	if(!path){ return }
	if('.js' !== path.slice(-3)){
		path += '.js';
	}
	return nodePath.join('./'+(p||'src/gun'), path);
};

var undent = function(code){
	var lines = code.split('\n');
	var minIndent = Infinity;
	lines.forEach(function(line){
		if(!line.trim()){ return }
		var indent = (line.match(/^\s*/) || [''])[0].length;
		minIndent = Math.min(minIndent, indent);
	});
	if(minIndent === Infinity){ return '' }
	return lines.map(function(line){
		if(!line.trim()){ return '' }
		return line.slice(minIndent);
	}).join('\n');
};

var restoreESM = function(code){
	return code.split('\n').map(function(line){
		var match = line.match(/^\s*var\s+([A-Za-z_$][\w$]*)\s*=\s*USE\(\s*['"]([^'"]+)['"]\s*,\s*1\s*\);\s*$/);
		if(match){
			return "import " + match[1] + " from '" + match[2] + "';";
		}
		match = line.match(/^\s*USE\(\s*['"]([^'"]+)['"]\s*,\s*1\s*\);\s*$/);
		if(match){
			return "import '" + match[1] + "';";
		}
		match = line.match(/^\s*var\s+([A-Za-z_$][\w$]*)\s*=\s*\(typeof GUN !== 'undefined'\) \? GUN : \(\(typeof Gun !== 'undefined'\) \? Gun : \(\(typeof require !== 'undefined'\) \? require\('([^']+)'\) : undefined\)\);\s*$/);
		if(match){
			return "import " + match[1] + " from '" + match[2] + "';";
		}
		match = line.match(/^\s*var\s+([A-Za-z_$][\w$]*)\s*=\s*\(typeof require !== 'undefined'\)\s*\?\s*require\(\s*['"]([^'"]+)['"]\s*\)\s*:\s*undefined;\s*$/);
		if(match){
			return "import " + match[1] + " from '" + match[2] + "';";
		}
		match = line.match(/^\s*var\s+([A-Za-z_$][\w$]*)\s*=\s*\(typeof require !== 'undefined'\)\s*\?\s*USE\(\s*['"]([^'"]+)['"]\s*\)\s*:\s*undefined;\s*$/);
		if(match){
			return "import " + match[1] + " from '" + match[2] + "';";
		}
		match = line.match(/^\s*\(typeof require !== 'undefined'\)\s*&&\s*require\(\s*['"]([^'"]+)['"]\s*\);\s*$/);
		if(match){
			return "import '" + match[1] + "';";
		}
		match = line.match(/^\s*module\.exports\s*=\s*(.+);\s*$/);
		if(match){
			return "export default " + match[1] + ";";
		}
		return line;
	}).join('\n').replace(/^\n+/, '').replace(/\s+$/g, '') + '\n';
};

var snapshot = function(text){
	var match = text.match(/\/\* UNBUILD-SNAPSHOT-START\n([\s\S]*?)\nUNBUILD-SNAPSHOT-END \*\//);
	if(!match){ return }
	var raw = match[1].replace(/\s+/g, '');
	try{
		return JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
	}catch(e){
		console.log('unbuild snapshot parse fail', e);
	}
};

(function(){

	var bundle = process.argv[2] || 'gun';
	var arg = bundle;
	var f = read(bundle+'.js');
	var snap = snapshot(f);
	if(snap && snap.files){
		console.log("unbuild:", bundle+'.js');
		Object.keys(snap.files).forEach(function(file){
			var code = snap.files[file];
			var rcode;
			try{ rcode = read(file); } catch(e){}
			if(rcode != code){
				console.log("unbuild:","update",file);
			}
			write(file, code);
		});
		return;
	}

	var g;
	if('gun' === bundle){
		g = 'gun';
		mk('./old_src');
		rn('./src/gun','./old_src/gun');
		mk('./src');
		mk('./src/gun');
		mk('./src/polyfill');
		mk('./src/adapters');
	} else if('sea' === bundle){
		g = 'sea';
		mk('./old_src');
		rn('./src/sea','./old_src/sea');
		mk('./src');
		mk('./src/sea');
		arg = 'src/sea';
	} else {
		g = bundle;
		rn('./'+bundle,'./old_'+bundle);
		mk('./'+bundle);
	}
	console.log("unbuild:", bundle+'.js')

	var code = next(f);


	code = next("/* UNBUILD */");
	
	if('gun' === g){
		code = undent(code).replace(/\s+$/g, '');
		if(code.indexOf('export default MOD.exports;') < 0){
			code += '\nexport default MOD.exports;';
		}
		write('src/polyfill/unbuild.js', code + '\n');
		arg = '';
	}

	(function recurse(c){
		code = next(";USE(function(module){", "})(USE");
		if(!code){ return }
		var file = path(arg);
		if(!file){ return }
		code = restoreESM(undent(code));
		var rcode;
		try{ rcode = read('old_'+file); } catch(e){}
		// console.log(rcode);
		if(rcode != code){
			console.log("unbuild:","update",file);
		}
		write(file, code);
		recurse();
	}());
	if('gun' === g || 'sea' === g){
		rm('./old_src');
	}else{
		rm('./old_'+g);
	}
	
}());
