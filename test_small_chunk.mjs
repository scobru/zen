import Radisk from './lib/radisk.js';
import Radix from './lib/radix.js';

// In-memory store 
const files = {};
let putCalls = 0;

const store = {
  get: function(file, cb) { cb(null, files[file] || null); },
  put: function(file, data, cb) {
    files[file] = data;
    putCalls++;
    cb(null, 'ok');
  },
  list: function(cb) {
    Object.keys(files).forEach(k => cb(k));
    cb(null);
  }
};

Radisk.has = {};

// Use very small chunk
const CHUNK = 100;
const r = Radisk({
  file: '/tmp/chunk_test',
  chunk: CHUNK,
  until: 300, // wait 300ms before writing (default)
  store: store,
  log: function(){},
});

const numKeys = 20;
const values = {};
for (let i = 0; i < numKeys; i++) {
  const k = 'key' + String(i).padStart(3, '0');
  values[k] = 'value_' + k + '_X';
}

console.log('=== Test: Small chunk (' + CHUNK + ' bytes) with', numKeys, 'keys ===\n');

// Write all keys RAPIDLY (within 300ms batch window - all go into 1 batch)
const keys = Object.keys(values).sort();
let acks = 0;
keys.forEach(k => {
  r(k, values[k], function(err, ok) {
    if (err) { console.log('Write err', k, err); return; }
    acks++;
  });
});

// Wait for all writes to complete
setTimeout(function() {
  console.log('Write acks received:', acks, '/', numKeys);
  console.log('Files written:', Object.keys(files).length);
  console.log('Store put calls:', putCalls);
  
  const dataFiles = Object.keys(files).filter(f => f !== '%1C');
  if (dataFiles.length > 1) {
    console.log('SPLIT OCCURRED: ' + dataFiles.length + ' data files\n');
  } else {
    console.log('NO SPLIT - only 1 data file\n');
  }

  // Now read back all keys
  console.log('=== Reading back all keys ===');
  let readAcks = 0;
  let errors = 0;
  
  // Reset static cache to force fresh reads from store
  Radisk.has = {};
  const r2 = Radisk({
    file: '/tmp/chunk_test',
    chunk: CHUNK,
    until: 300,
    store: store,
    log: function(){},
  });
  
  keys.forEach(k => {
    r2(k, function(err, val) {
      readAcks++;
      const expected = values[k];
      if (err) {
        console.log('READ ERR:', k, err);
        errors++;
      } else if (val !== expected) {
        console.log('MISMATCH:', k, 'expected:', expected, 'got:', val);
        errors++;
      }
      if (readAcks === keys.length) {
        console.log('\nRead', readAcks, 'keys,', errors, 'errors');
        if (errors === 0) console.log('ALL READS OK!');
        else console.log('FAILURE: ' + errors + ' reads failed');
      }
    });
  });
}, 1000);
