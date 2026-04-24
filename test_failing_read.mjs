import zenbase from './zen.js';
import './lib/store.js';
import './lib/rfs.js';
import fs from 'fs';
import fsrm from './lib/fsrm.js';

// Mimic exact test conditions
const W = function(o) { return new zenbase(o); };
Object.setPrototypeOf(W, zenbase);
W.prototype = zenbase.prototype;
const ZEN = W;

try { fsrm('tmp/rad_contact_test'); } catch(e) {}

ZEN.TESTING = true;
ZEN.on('opt', function(root) {
  root.opt.localStorage = false;
  this.to.next(root);
});

const ochunk = 1000;
const zen = ZEN({ chunk: ochunk, file: 'tmp/rad_contact_test' });

// Paste the names array from test
const names = ["Adalard","Adora","Aia","Albertina","Alfie","Allyn","Amabil","Ammamaria","Andy","Anselme","Ardeen","Armand","Ashelman","Aube","Averyl","Baker","Barger","Baten","Bee","Benia","Bernat","Bevers","Bittner","Bobbe","Bonny","Boyce","Breech","Brittaney","Bryn","Burkitt","Cadmann","Campagna","Carlee","Carver","Cavallaro","Chainey","Chaunce","Ching","Cianca","Claudina","Clyve","Colbert","Coppins","Corabel","Corliss","Corrine","Courtnay","Crabb","Cristen","Croshaw","Da","Daimon","David","Devinna","Diamantina","Dierdre","Dilks","Dorotea","Eadith","Ebon","Edna","Edy","Elga","Elisha","Elka","Elsi","Elsworth","Enrico","Esdras","Esme","Eulalie","Ezmeralda","Ferrel","Ferris","Flinn","Forster","Francene","Frants","Fred","Fredi","Freeland","Gabi","Garlind","Garson","Gaultiero","Geo","George","Gifford","Gilda","Goodrich","Grange","Greenwald","Griz","Groom","Gui","Gunner","Gustavus","Guy","Hallie","Hallsy","Hana","Handal","Hanford","Hany","Harl","Harms","Harold","Harrod","Hassi","Hatteras","Haymes","Heida","Henders","Henig","Henryson","Herrick","Higgins","Hinze","Hobie","Hola","Hollingsworth","Horatio","Hylas","Ignacius","Ike","Ilka","Ilyssa","Imelda","Ingrid","Isidor","Ives","Jacklyn","Jago","Jalbert","Jarvis","Jed","Jeffery","Jeri","Jermain","Joletta","Jordan","Josi","Kacy","Kam","Karim","Kean","Kecia","Keeley","Keller","Kermit","Kerry","Kile","Kimmy","Kirby","Larina","Lars","Laverna","Lazar","Lefty","Lenore","Leonidas","Lesley","Leston","Liane","Lindon","Lindsey","Linn","Livvyy","Lolita","Lonna","Lorinda","Lucie","Madai","Maia","Malvina","Marcy","Maris","Martens","Mathilda","Maye","Mclain","Melamie","Meras","Micco","Millburn","Mittel","Montfort","Moth","Mutz","Nanci","Nealson","Neda","Nels","Nichole","Nicky","Nicol","Nigel","Nils","Nissa","Norbert","Nuncia","Otha","Ozzy","Padget","Pammi","Panos","Paola","Pascal","Pate","Patty","Payton","Penrod","Peri","Philis","Poldi","Polly","Pow","Pryor","Querida","Quinlan","Raffarty","Randa","Raynell","Reagan","Redd","Renate","Rene","Renell","Repo","Rheba","Rhodia","Rica","Richardson","Risa","Robbie","Robin","Rodrick","Rosenblum","Roz","Ruby","Rudie","Rupert","Ruth","Sasha","Saunder","Savy","Sayres","Schell","Schuyler","Seumas","Sherr","Shira","Sigismondo","Simeon","Sisely","Skip","Sloan","Sly","Sparks","Speight","Spencer","Stanfield","Stanford","Starla","Stein","Stern","Stu","Suellen","Sullivan","Sunni","Susann","Susy","Swane","Tal","Tallie","Taryne","Tate","Tessi","Thaddeus","Thibaud","Tiebout","Tiffi","Tilden","Tod","Tom","Tomlin","Toulon","Tracie","Trilby","Trixy","Turner","Uriel","Val","Vannie","Vareck","Vasili","Vesna","Vicky","Viole","Virginie","Vivyanne","Wallas","Wally","Walton","Wes","West","Whittaker","Wil","Wilek","Wilfreda","Willard","Windy","Winn","Winona","Winsor","Wood","Wren","Wye","Wynnie","Yankee","Yorke","Yoshi","Yvon","Zachariah","Zak","Zelazny","Zena","Zenia","Zia","Zsa"];

console.log('Writing', names.length, 'contacts with chunk =', ochunk, '...');
const all_write = {};
names.forEach((v, i) => { all_write[i+1] = true; });

let acks = 0;
names.forEach((v, i) => {
  const tmp = v.toLowerCase();
  zen.get('names').get(tmp).put({ name: v, age: i+1 }, function(ack) {
    if (ack.err) { console.log('Write err:', ack.err); return; }
    acks++;
    if (acks === names.length) {
      console.log('Write done! Waiting to settle...');
      setTimeout(checkFiles, 1000);
    }
  });
});

function checkFiles() {
  console.log('Files created:');
  try {
    const files = fs.readdirSync('tmp/rad_contact_test');
    console.log('  count:', files.length);
    // Show a few files
    files.slice(0, 10).forEach(f => console.log('  ', f));
    if (files.length > 10) console.log('  ...');
  } catch(e) {}

  // Now do the range query
  const m_names = names.filter(v => v.toLowerCase().startsWith('m')).map(v => v.toLowerCase());
  console.log('\nExpected m* contacts:', m_names.length, 'total');

  const found = {};
  const missing = new Set(m_names);
  
  zen.get('names').get({ '.': { '*': 'm' }, '%': 1000*100 }).map().on(function(data, key) {
    if (!key.startsWith('m')) {
      console.log('UNEXPECTED key:', key);
      return;
    }
    found[key] = data;
    missing.delete(key);
  });

  setTimeout(() => {
    console.log('Found', Object.keys(found).length, 'of', m_names.length);
    if (missing.size > 0) {
      console.log('MISSING:', [...missing]);
    } else {
      console.log('ALL FOUND!');
    }
    process.exit(0);
  }, 5000);
}
