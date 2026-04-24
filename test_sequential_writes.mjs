import Radisk from './lib/radisk.js';
import Radix from './lib/radix.js';

const files = {};
const store = {
  get(file, cb) { cb(null, files[file] || null); },
  put(file, data, cb) { files[file] = data; cb(null, 'ok'); },
  list(cb) { Object.keys(files).forEach(k => cb(k)); cb(null); }
};

Radisk.has = {};

const CHUNK = 100;
const r = Radisk({
  file: '/tmp/seq_test',
  chunk: CHUNK,
  until: 50, // very short batch window
  store,
  log: () => {},
});

// Write keys sequentially with 200ms gap (> 50ms until) - each is a separate batch
const keys = ['aaa', 'ccc', 'eee', 'ggg', 'bbb', 'ddd', 'fff'];
let idx = 0;

console.log('Writing keys sequentially (each 200ms apart):');

function writeNext() {
  if (idx >= keys.length) {
    console.log('\nAll written. Files:', Object.keys(files).length);
    const dataFiles = Object.keys(files).filter(f => f !== '%1C');
    console.log('Data files:', dataFiles);
    
    // Read them all back
    console.log('\nReading back:');
    let errors = 0;
    let done = 0;
    keys.forEach(k => {
      r(k, (err, val) => {
        if (err || val !== 'val_' + k) {
          console.log('FAIL', k, err, val);
          errors++;
        } else {
          console.log('OK', k, '=', val);
        }
        done++;
        if (done === keys.length) {
          console.log('\n' + (errors ? errors + ' ERRORS' : 'ALL OK'));
        }
      });
    });
    return;
  }
  
  const k = keys[idx++];
  const v = 'val_' + k;
  r(k, v, (err) => {
    if (err) console.log('Write err:', k, err);
    else console.log('Written:', k);
  });
  setTimeout(writeNext, 200);
}

writeNext();
