import zenbase from './zen.js';
import './lib/store.js';
import './lib/rfs.js';
import fs from 'fs';
import fsrm from './lib/fsrm.js';

const W = function(o) { return new zenbase(o); };
Object.setPrototypeOf(W, zenbase);
W.prototype = zenbase.prototype;
const ZEN = W;

// Clean up
try { fsrm('tmp/rad_test_debug'); } catch(e) {}

ZEN.TESTING = true;
ZEN.on('opt', function(root) {
  root.opt.localStorage = false;
  this.to.next(root);
});

const ochunk = 1000;
const zen = ZEN({ chunk: ochunk, file: 'tmp/rad_test_debug' });

const names = ['Madai', 'Maia', 'Malvina', 'Marcy', 'Maris', 'Martens', 'Mathilda', 'Maye',
               'Mclain', 'Melamie', 'Meras', 'Micco', 'Millburn', 'Mittel', 'Montfort', 'Moth', 'Mutz',
               'Adalard', 'Adora', 'Aia', 'Andy', 'Baker', 'Bee', 'Carlee', 'Ching', 'David', 'Edward',
               'Frank', 'George', 'Harry', 'Ivan', 'Jack', 'Kate', 'Larry', 'Nancy', 'Oliver', 'Peter',
               'Quinn', 'Rachel', 'Sam', 'Tom', 'Uma', 'Victor', 'Wanda', 'Xerxes', 'Yolanda', 'Zelda'];

console.log('Writing', names.length, 'contacts...');
let acks = 0;
names.forEach((v, i) => {
  zen.get('names').get(v.toLowerCase()).put({ name: v, age: i }, function(ack) {
    acks++;
    if (acks === names.length) {
      console.log('All contacts written. Now reading m* contacts...');
      setTimeout(readContacts, 500);
    }
  });
});

function readContacts() {
  // Check what files were created
  try {
    const files = fs.readdirSync('tmp/rad_test_debug');
    console.log('Files in radata dir:', files);
  } catch(e) {
    console.log('radata dir error:', e.message);
  }

  const all = {};
  names.forEach(v => {
    v = v.toLowerCase();
    if (v.startsWith('m')) all[v] = true;
  });
  console.log('Expected m* contacts:', Object.keys(all).sort());

  const found = {};
  zen.get('names').get({ '.': { '*': 'm' }, '%': 1000 * 100 }).map().on(function(data, key) {
    console.log('Found:', key, data ? 'has data' : 'NO DATA');
    found[key] = data;
  });

  setTimeout(() => {
    const missing = Object.keys(all).filter(k => !found[k]);
    console.log('\nMissing m* contacts:', missing);
    console.log('Found:', Object.keys(found).sort());
    process.exit(0);
  }, 3000);
}
