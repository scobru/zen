import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import nodePath from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname as __dirnameOf } from 'node:path';
import { binaryPath as zigBin } from '@ziglang/cli';

const __filename = fileURLToPath(import.meta.url);
const __dirname = __dirnameOf(__filename);
const rootDir = nodePath.resolve(__dirname, '..');
const src = nodePath.join(rootDir, 'src/zen/wasm.zig');
const out = nodePath.join(rootDir, 'src/pen.wasm');
const rootOut = nodePath.join(rootDir, 'pen.wasm');

function buildPEN() {
  const zig = process.env.ZIG || zigBin;
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

  fs.copyFileSync(out, rootOut);

  const size = fs.statSync(out).size;
  console.log(`pen.wasm built locally: ${size} bytes`);
}

if (process.argv[1] && nodePath.resolve(process.argv[1]) === __filename) {
  buildPEN();
}

export default buildPEN;
