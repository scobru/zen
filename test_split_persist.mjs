import Radisk from './lib/radisk.js';
import Radix from './lib/radix.js';

// Simulate persistent store
const files = {};

const store = {
  get: function(file, cb) {
    cb(null, files[file] || null);
  },
  put: function(file, data, cb) {
    files[file] = data;
    cb(null, 'ok');
  },
  list: function(cb) {
    Object.keys(files).forEach(k => cb(k));
    cb(null);
  }
};

Radisk.has = {};

const CHUNK = 50; // very small - 50 bytes

const opt = {
  file: '/tmp/test_persist',
  chunk: CHUNK,
  until: 5,
  store: store,
  log: function(){}, // silent
};

const r = Radisk(opt);

console.log('=== Testing persistence after split ===');
console.log('chunk:', CHUNK, 'bytes\n');

// Phase 1: Write data
const keys = [];
for (let i = 0; i < 8; i++) keys.push('key' + i);

let acks = 0;
keys.forEach(k => {
  r(k, 'data_' + k, err => {
    if (err) console.log('Write err:', err);
    acks++;
    if (acks === keys.length) {
      setTimeout(afterWrites, 100);
    }
  });
});

function afterWrites() {
  console.log('Files after writes:');
  Object.keys(files).forEach(f => {
    console.log(' ', JSON.stringify(f), ':', files[f]);
  });

  // Phase 2: Simulate restart - create new Radisk instance reading from same store
  Radisk.has = {};
  const r2 = Radisk({
    file: '/tmp/test_persist',
    chunk: CHUNK,
    until: 5,
    store: store,
    log: function(){},
  });

  console.log('\n=== Reading back from "restarted" instance ===');
  let rDone = 0;
  let fails = 0;
  keys.forEach(k => {
    r2(k, function(err, val) {
      const expected = 'data_' + k;
      if (err) {
        console.log('Read err for', k, ':', err);
        fails++;
      } else if (val !== expected) {
        console.log('MISMATCH for', k, ': expected', expected, 'got', val);
        fails++;
      } else {
        console.log('OK:', k, '=', val);
      }
      rDone++;
      if (rDone === keys.length) {
        console.log('\n' + (fails ? fails + ' FAILURES' : 'ALL READS OK'));
      }
    });
  });
}
