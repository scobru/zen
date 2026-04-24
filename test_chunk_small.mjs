// Test with very small chunk size (few 100 bytes) as suggested by user
import Radisk from './lib/radisk.js';
import Radix from './lib/radix.js';

const files = {};
const store = {
  get(file, cb) { cb(null, files[file] || null); },
  put(file, data, cb) { files[file] = data; cb(null, 'ok'); },
  list(cb) { Object.keys(files).forEach(k => cb(k)); cb(null); }
};

Radisk.has = {};
const CHUNK = 150; // Few hundred bytes as described

const r = Radisk({ file: '/tmp/small_chunk', chunk: CHUNK, store, log: () => {} });

console.log('Chunk size:', CHUNK, 'bytes');

// Put data - values that are each about 50 bytes
const pairs = {};
for (let i = 0; i < 20; i++) {
  pairs['key' + String(i).padStart(3, '0')] = 'value_for_key' + String(i).padStart(3, '0') + '_test_data';
}

let pending = Object.keys(pairs).length;
let errors = 0;

console.log('Writing', pending, 'pairs...');
Object.entries(pairs).forEach(([k, v]) => {
  r(k, v, (err, ok) => {
    if (err) { console.log('Write err:', k, err); errors++; }
    pending--;
    if (pending === 0) {
      setTimeout(verify, 300);
    }
  });
});

function verify() {
  console.log('Files created:', Object.keys(files).length, '(including %1C dir)');
  
  // Try reading all keys back
  let readPending = Object.keys(pairs).length;
  let readErrors = 0;
  
  // Fresh instance to test from disk
  Radisk.has = {};
  const r2 = Radisk({ file: '/tmp/small_chunk', chunk: CHUNK, store, log: () => {} });
  
  Object.entries(pairs).forEach(([k, v]) => {
    r2(k, (err, val) => {
      if (err || val !== v) {
        console.log('Read FAIL:', k, 'expected:', v, 'got:', val, 'err:', err);
        readErrors++;
      }
      readPending--;
      if (readPending === 0) {
        console.log('Read errors:', readErrors, '/', Object.keys(pairs).length);
        console.log(readErrors === 0 ? 'ALL OK!' : 'FAILURES FOUND');
        process.exit(readErrors > 0 ? 1 : 0);
      }
    });
  });
}
