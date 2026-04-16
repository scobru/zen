import fs from 'fs';
import nodePath from 'path';
import { fileURLToPath } from 'node:url';
import { dirname as __dirnameOf } from 'node:path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = __dirnameOf(__filename);
const rootDir = nodePath.resolve(__dirname, '..');
const entryFile = nodePath.join(rootDir, 'src/zen/index.js');
const zenOutput = nodePath.join(rootDir, 'zen.js');
const penWasmSource = nodePath.join(rootDir, 'src/pen.wasm');
const penWasmOutput = nodePath.join(rootDir, 'pen.wasm');

function read(absPath) {
	return fs.readFileSync(absPath, 'utf8');
}

function write(absPath, data) {
	fs.writeFileSync(absPath, data);
}

function normalize(absPath) {
	return nodePath.resolve(absPath);
}

function relId(absPath) {
	return './' + nodePath.relative(rootDir, absPath).split(nodePath.sep).join('/');
}

function resolveImport(fromFile, spec) {
	if(spec.startsWith('.')){
		return normalize(nodePath.resolve(nodePath.dirname(fromFile), spec));
	}
	return spec;
}

function aliased(absPath) {
	return absPath;
}

function parseExportList(raw) {
	return raw.split(',').map(function(part){
		return part.trim();
	}).filter(Boolean).map(function(part){
		var bits = part.split(/\s+as\s+/);
		return {local: bits[0].trim(), exported: (bits[1] || bits[0]).trim()};
	});
}

function transformModule(source, absPath) {
	var exportLines = [];

	source = source.replace(/^\s*import\s+([A-Za-z_$][\w$]*)\s+from\s+['"]([^'"]+)['"];\s*$/gm, function(_, name, spec){
		if(spec.startsWith('.')){
			var target = relId(aliased(resolveImport(absPath, spec)));
			return "var " + name + " = __req('" + target + "').default;";
		}
		throw new Error('External import not supported in zen bundle: ' + spec + ' (in ' + absPath + ')');
	});

	source = source.replace(/^\s*import\s+['"]([^'"]+)['"];\s*$/gm, function(_, spec){
		if(spec.startsWith('.')){
			var target = relId(aliased(resolveImport(absPath, spec)));
			return "__req('" + target + "');";
		}
		throw new Error('External import not supported in zen bundle: ' + spec + ' (in ' + absPath + ')');
	});

	source = source.replace(/export\s*\{([\s\S]*?)\};?/gm, function(_, names){
		parseExportList(names).forEach(function(item){
			exportLines.push("__exp." + item.exported + " = " + item.local + ";");
		});
		return '';
	});

	source = source.replace(/export default async function\s+([A-Za-z_$][\w$]*)\s*\(/g, function(_, name){
		exportLines.push("__exp.default = " + name + ";");
		return "async function " + name + "(";
	});

	source = source.replace(/export default function\s+([A-Za-z_$][\w$]*)\s*\(/g, function(_, name){
		exportLines.push("__exp.default = " + name + ";");
		return "function " + name + "(";
	});

	source = source.replace(/export default\s+([^;]+);/g, function(_, expr){
		return "__exp.default = " + expr + ";";
	});

	if(exportLines.length){
		source += '\n' + exportLines.join('\n') + '\n';
	}
	return source.trim() + '\n';
}

function collect(file, seen, ordered) {
	var absPath = aliased(normalize(file));
	if(typeof seen[absPath] !== 'undefined'){ return }
	var source = read(absPath);
	seen[absPath] = source;
	source.replace(/^\s*import\s+(?:[A-Za-z_$][\w$]*\s+from\s+)?['"]([^'"]+)['"];\s*$/gm, function(_, spec){
		if(spec.startsWith('.')){
			collect(resolveImport(absPath, spec), seen, ordered);
		}
	});
	ordered.push(absPath);
}

function bundle() {
	var seen = {};
	var ordered = [];
	collect(entryFile, seen, ordered);

	var out = '';
	out += "const __mods = Object.create(null);\n";
	out += "function __def(id, fn){ __mods[id] = { fn: fn, exports: {}, loaded: false }; }\n";
	out += "function __req(id){ var mod = __mods[id]; if(!mod){ throw new Error('Missing module: ' + id); } if(!mod.loaded){ mod.loaded = true; mod.fn(mod, mod.exports); } return mod.exports; }\n\n";

	ordered.forEach(function(absPath){
		var id = relId(absPath);
		var source = transformModule(seen[absPath], absPath);
		out += "__def('" + id + "', function(module, __exp){\n";
		out += source.split('\n').map(function(line){
			return line ? '  ' + line : '';
		}).join('\n');
		out += "});\n\n";
	});

	out += "const __zen = __req('" + relId(entryFile) + "');\n";
	out += "const ZEN = __zen.default;\n";
	out += "export { ZEN };\n";
	out += "export default ZEN;\n";

	write(zenOutput, out);
	fs.copyFileSync(penWasmSource, penWasmOutput);
	console.log('Built zen.js');
	console.log('Copied pen.wasm');
}

if(process.argv[1] && nodePath.resolve(process.argv[1]) === __filename){
	bundle();
}

export default bundle;
