import fs from 'node:fs';
import path from 'node:path';

const targets = [
  'd:/shogun-2/tunecamp/node_modules/zen',
  'd:/shogun-2/shogun-relay/relay/node_modules/zen',
  'd:/shogun-2/shogun-wormhole/node_modules/zen',
  'd:/shogun-2/signal/node_modules/zen'
];

const filesToCopy = [
  { src: 'zen.js', dest: 'zen.js' },
  { src: 'zen.min.js', dest: 'zen.min.js' },
  { src: 'src/dup.js', dest: 'src/dup.js' }
];

for (const target of targets) {
  if (fs.existsSync(target)) {
    for (const file of filesToCopy) {
      const srcPath = path.resolve(file.src);
      const destPath = path.join(target, file.dest);
      
      // Ensure target subdir exists (e.g. src/)
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${file.src} to ${destPath}`);
    }
  } else {
    console.log(`Target not found: ${target}`);
  }
}
