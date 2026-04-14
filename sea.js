import './sea/base62.js';
import SEA from './sea/sea.js';
import './sea/pair.js';
import './sea/secret.js';
import './sea/index.js';

if (typeof globalThis !== 'undefined') {
  globalThis.SEA = SEA;
}

export default SEA;
