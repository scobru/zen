import fs from 'fs';
import nodePath from 'path';
import { fileURLToPath } from 'node:url';
import { dirname as __dirnameOf } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = __dirnameOf(__filename);
var dir = __dirname + '/../';

function read(path) {
	return fs.readFileSync(nodePath.join(dir, path)).toString();
}

function write(path, data) {
	return fs.writeFileSync(nodePath.join(dir, path), data);
}

function chunk(text, size) {
	var out = [];
	for(var i = 0; i < text.length; i += size){
		out.push(text.slice(i, i + size));
	}
	return out.join('\n');
}

var seaModules = [
	'root',
	'https',
	'base64',
	'array',
	'buffer',
	'shim',
	'base62',
	'settings',
	'sha256',
	'sha1',
	'work',
	'pair',
	'sign',
	'verify',
	'aeskey',
	'encrypt',
	'decrypt',
	'secret',
	'certify',
	'sea',
	'then',
	'index'
];

var gunModules = [
	'shim',
	'onto',
	'book',
	'valid',
	'state',
	'dup',
	'ask',
	'root',
	'back',
	'chain',
	'get',
	'put',
	'core',
	'index',
	'on',
	'map',
	'set',
	'mesh',
	'websocket',
	'localStorage'
];

var builds = {
	gun: {
		output: 'gun.js',
		baseDir: 'src/gun',
		modules: gunModules,
		unbuildPrelude: 'src/polyfill/unbuild.js',
		format: {outer: '\t', inner: '\t\t'}
	},
	sea: {
		output: 'sea.js',
		baseDir: 'sea',
		unbuildPrelude: 'src/polyfill/unbuild.js',
		modules: seaModules,
		format: {outer: '  ', inner: '    '}
	}
};

function normalizeContent(code) {
	var strippedWrapper = false;
	if(/^\s*;?\s*\(\s*function\s*\(\s*\)\s*\{/.test(code)){
		code = code.replace(/^\s*;?\s*\(\s*function\s*\(\s*\)\s*\{/, '');
		strippedWrapper = true;
	}
	if(strippedWrapper){
		code = code.replace(/\}\s*\(\s*\)\s*\)?\s*;?\s*$/, '');
	}
	var lines = code.split('\n');
	var minIndent = Infinity;
	lines.forEach(function(line){
		if(line.trim().length > 0){
			var indent = (line.match(/^\s*/) || [''])[0].length;
			minIndent = Math.min(minIndent, indent);
		}
	});
	if(minIndent === Infinity){ return '' }
	return lines.map(function(line){
		if(!line.trim().length){ return '' }
		return line.slice(minIndent);
	}).join('\n').trim();
}

function replaceRequires(code) {
	var inUnbuild = false;
	return code.split('\n').map(function(line){
		if(line.indexOf('/* UNBUILD */') >= 0){
			inUnbuild = !inUnbuild;
			return line;
		}
		if(inUnbuild){ return line }
		return line.replace(/require\(/g, 'USE(');
	}).join('\n');
}

function rewriteImportsExports(code) {
	return code.split('\n').map(function(line){
		var match = line.match(/^\s*import\s+([A-Za-z_$][\w$]*)\s+from\s+['"]([^'"]+)['"];\s*$/);
		if(match){
			var name = match[1];
			var spec = match[2];
			if(spec.startsWith('./')){
				return 'var ' + name + " = USE('" + spec + "', 1);";
			}
			if(spec === '../gun.js'){
				return "var " + name + " = (typeof GUN !== 'undefined') ? GUN : ((typeof Gun !== 'undefined') ? Gun : ((typeof require !== 'undefined') ? require('" + spec + "') : undefined));";
			}
			return "var " + name + " = (typeof require !== 'undefined') ? require('" + spec + "') : undefined;";
		}
		match = line.match(/^\s*import\s+['"]([^'"]+)['"];\s*$/);
		if(match){
			var sideEffect = match[1];
			if(sideEffect.startsWith('./')){
				return "USE('" + sideEffect + "', 1);";
			}
			return "(typeof require !== 'undefined') && require('" + sideEffect + "');";
		}
		match = line.match(/^\s*export\s+default\s+(.+);\s*$/);
		if(match){
			return 'module.exports = ' + match[1] + ';';
		}
		return line;
	}).join('\n');
}

function wrapModule(code, name, format) {
	var lines = replaceRequires(normalizeContent(rewriteImportsExports(code))).split('\n');
	var output = format.outer + ';USE(function(module){\n';
	output += lines.map(function(line){
		return line.length ? format.inner + line : '';
	}).join('\n');
	output += '\n' + format.outer + "})(USE, './" + name + "');\n\n";
	return output;
}

function snapshotFor(arg, config) {
	var files = {};
	if(arg === 'gun' && config.unbuildPrelude){
		files[config.unbuildPrelude] = read(config.unbuildPrelude);
	}
	config.modules.forEach(function(name){
		var rel = nodePath.posix.join(config.baseDir, name + '.js');
		files[rel] = read(rel);
	});
	var payload = JSON.stringify({kind: arg, files: files});
	return chunk(Buffer.from(payload, 'utf8').toString('base64'), 120);
}

function build(arg) {
	var config = builds[arg];
	if(!config){
		console.error('Supported arguments: ' + Object.keys(builds).join(', '));
		process.exit(1);
	}

	var output = 'let __bundleExport;\n;(function(){\n\n';
	if(config.unbuildPrelude){
		var prelude = read(config.unbuildPrelude)
			.replace(/^\s*export\s+default\s+MOD\.exports;\s*$/m, '')
			.replace(/\s+$/g, '');
		output += '  /* UNBUILD */\n';
		output += prelude + '\n';
		output += '  /* UNBUILD */\n\n';
	}

	config.modules.forEach(function(name){
		var code = read(nodePath.join(config.baseDir, name + '.js'));
		output += wrapModule(code, name, config.format);
	});

	output += '\n__bundleExport = MOD.exports;\n';
	output += '}());\n';
	output += 'export default __bundleExport;\n';
	output += '/* UNBUILD-SNAPSHOT-START\n';
	output += snapshotFor(arg, config) + '\n';
	output += 'UNBUILD-SNAPSHOT-END */\n';
	write(config.output, output);
	console.log('Built ' + config.output);
}

if(process.argv[1] && nodePath.resolve(process.argv[1]) === __filename){
	build(process.argv[2]);
}

export default build;
