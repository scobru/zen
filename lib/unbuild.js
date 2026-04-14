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
	return fs.writeFileSync(nodePath.join(dir, path), data);
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
	return nodePath.join('./'+(p||'src'), path);
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
		match = line.match(/^\s*\(typeof require !== 'undefined'\)\s*&&\s*require\(\s*['"]([^'"]+)['"]\s*\);\s*$/);
		if(match){
			return "import '" + match[1] + "';";
		}
		match = line.match(/^\s*module\.exports\s*=\s*(.+);\s*$/);
		if(match){
			return "export default " + match[1] + ";";
		}
		return line;
	}).join('\n').replace(/\s+$/g, '') + '\n';
};

(function(){

	var arg = process.argv[2] || 'gun';

	var g;
	if('gun' === arg){
		g = 'gun';
		rn('./src','./old_src');
		mk('./src');
		mk('./src/polyfill');
		mk('./src/adapters');
	} else {
		g = arg;
		rn('./'+arg,'./old_'+arg);
		mk('./'+arg);
	}
	console.log("unbuild:", arg+'.js')

	var f = read(arg+'.js');
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
	if('gun' === g){
		rm('./old_src');
	}else{
		rm('./old_'+g);
	}
	
}());
