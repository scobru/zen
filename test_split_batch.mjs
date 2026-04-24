import Radisk from './lib/radisk.js';
import Radix from './lib/radix.js';

// In-memory store - simulates filesystem
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

Radisk.has = {};

const opt = {
  file: '/tmp/test_radisk_batch',
  chunk: 200, // 200 bytes chunk
  until: 10, // very short wait so keys batch together
  store: store,
  log: console.log,
};

const r = Radisk(opt);

console.log('=== Test: Batch write + split ===');
console.log('chunk size:', opt.chunk, 'bytes');
console.log('wait (batch delay):', opt.until, 'ms');
console.log('');

// Write many keys in rapid succession so they batch
const keys = [];
for(let i = 0; i < 10; i++) {
  keys.push('key' + i);
}

let acks = 0;
keys.forEach(function(k) {
  r(k, 'v' + k + '_data_padding_XXXXX', function(err, ok) {
    acks++;
    if (err) console.log('Err', k, err);
    if (acks === keys.length) {
      setTimeout(checkResults, 200);
    }
  });
});

function checkResults() {
  console.log('');
  console.log('=== Files in store ===');
  const fileNames = Object.keys(files);
  console.log('Number of files:', fileNames.length);
  fileNames.forEach(f => {
    console.log('  file:', JSON.stringify(f), 'size:', (files[f]||'').length, 'bytes');
  });
  
  const dataFiles = fileNames.filter(f => f !== '%1C');
  if (dataFiles.length > 1) {
    console.log('');
    console.log('PASS: Splitting worked! ' + dataFiles.length + ' data files.');
  } else {
    console.log('');
    console.log('FAIL: Only 1 data file. Splitting did not work.');
  }
  
  // Read all keys back
  console.log('');
  console.log('=== Reading back ===');
  let rPending = keys.length;
  let fails = 0;
  keys.forEach(function(k) {
    r(k, function(err, val) {
      const expected = 'v' + k + '_data_padding_XXXXX';
      if (err || val !== expected) {
        console.log('FAIL read', k, 'err:', err, 'val:', val);
        fails++;
      }
      rPending--;
      if (rPending === 0) {
        if (fails === 0) console.log('All reads OK!');
        else console.log(fails + ' reads FAILED');
      }
    });
  });
}
