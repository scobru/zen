import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import Gun from '../gun.js';
import SEA from '../sea.js';
import '../lib/file.js';
import serve from '../lib/server.js';

if (process.env.SEA) {
  Gun.SEA = SEA;
}

const myDir = dirname(fileURLToPath(import.meta.url));

export default serve(Gun, myDir);
