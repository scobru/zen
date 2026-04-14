import path from 'node:path';

export default function tpath(file, fallback, testing){
	var tmp = ((typeof process !== 'undefined') && (process.env || {}).GUN_TMP_DIR) || 'tmp';
	var out = String(file || fallback || '');
	if(!out){ return out }
	if(!testing && '1' !== (((typeof process !== 'undefined') && (process.env || {}).GUN_TEST_TMP) || '')){ return out }
	if(path.isAbsolute(out)){ return out }
	out = out.replace(/\\/g, '/');
	if(out === tmp || out.indexOf(tmp + '/') === 0){ return out }
	return path.join(tmp, out);
}
