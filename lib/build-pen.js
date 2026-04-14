import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import nodePath from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname as __dirnameOf } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = __dirnameOf(__filename);
const rootDir = nodePath.resolve(__dirname, '..');
const src = nodePath.join(rootDir, 'src/zen/wasm.zig');
const out = nodePath.join(rootDir, 'src/pen.wasm');
const libOut = nodePath.join(rootDir, 'lib/pen.wasm');
const rootOut = nodePath.join(rootDir, 'pen.wasm');

function resolveZig() {
  if (process.env.ZIG) { return process.env.ZIG; }
  const probe = spawnSync('zig', ['version'], { encoding: 'utf8' });
  if (!probe.error && probe.status === 0) { return 'zig'; }
  throw new Error('zig compiler not found. Install zig or set the ZIG environment variable.');
}

function buildPEN() {
  const zig = resolveZig();
  const args = [
    'build-exe',
    src,
    '-target', 'wasm32-freestanding',
    '-O', 'ReleaseSmall',
    '-fno-entry',
    '-rdynamic',
    '--export=run',
    '--export=alloc',
    '--export=free',
    '--export=mem',
    '-femit-bin=' + out,
  ];

  console.log('building pen.wasm...');
  const result = spawnSync(zig, args, { stdio: 'inherit', cwd: rootDir });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }

  fs.copyFileSync(out, libOut);
  fs.copyFileSync(out, rootOut);

  const size = fs.statSync(out).size;
  console.log(`pen.wasm built locally: ${size} bytes`);
}

if (process.argv[1] && nodePath.resolve(process.argv[1]) === __filename) {
  buildPEN();
}

export default buildPEN;
