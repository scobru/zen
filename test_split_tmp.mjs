import Radisk from './lib/radisk.js';
import Radix from './lib/radix.js';

// Simple in-memory store
const files = {};

const store = {
  get: function(file, cb) {
    const data = files[file];
    cb(null, data || null);
  },
  put: function(file, data, cb) {
    files[file] = data;
    console.log('PUT file:', JSON.stringify(file), 'size:', (data||'').length, 'bytes');
    cb(null, 'ok');
  },
  list: function(cb) {
    const keys = Object.keys(files);
    keys.forEach(k => cb(k));
    cb(null);
  }
};

// Reset static cache
Radisk.has = {};

const opt = {
  file: '/tmp/test_radisk_split',
  chunk: 100, // Very small chunk - only 100 bytes
  store: store,
  log: console.log,
};

const r = Radisk(opt);

console.log('=== Test: File splitting with small chunk size ===');
console.log('chunk size:', opt.chunk, 'bytes');
console.log('');

// Write several keys with enough data to exceed 100 bytes per entry
const keys = ['aaa', 'bbb', 'ccc', 'ddd', 'eee'];
let pending = keys.length;

keys.forEach(function(k) {
  r(k, 'value_for_' + k + '_XXXXX_padding_to_exceed_chunk_size', function(err, ok) {
    if (err) {
      console.log('Write error for', k, ':', err);
    } else {
      console.log('Write ack for', k, ':', ok);
    }
    pending--;
    if (pending === 0) {
      setTimeout(checkResults, 500);
    }
  });
});

function checkResults() {
  console.log('');
  console.log('=== Files in store ===');
  const fileNames = Object.keys(files);
  console.log('Number of files:', fileNames.length);
  fileNames.forEach(f => {
    console.log('  file:', JSON.stringify(f), 'content:', JSON.stringify(files[f]));
  });
  
  if (fileNames.length <= 1) {
    console.log('');
    console.log('FAIL: Only 1 file found! File splitting DID NOT work.');
  } else {
    console.log('');
    console.log('PASS: Multiple files found! File splitting worked.');
  }
}
