import fs from "fs";
import nodePath from "path";
import UglifyJS from "uglify-js";
import { fileURLToPath } from "node:url";
import { dirname as __dirnameOf } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = __dirnameOf(__filename);
const rootDir = nodePath.resolve(__dirname, "..");
const libDir = nodePath.join(rootDir, "lib");

function eachJs(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const absPath = nodePath.join(dir, name);
    const stat = fs.statSync(absPath);
    if (stat.isDirectory()) {
      eachJs(absPath, files);
      continue;
    }
    if (!name.endsWith(".js") || name.endsWith(".min.js")) {
      continue;
    }
    files.push(absPath);
  }
  return files;
}

function isModule(code) {
  return /^\s*(import|export)\s/m.test(code);
}

function minifyFile(absPath) {
  const code = fs.readFileSync(absPath, "utf8");
  const outPath = absPath.replace(/\.js$/, ".min.js");
  const result = UglifyJS.minify(code, {
    module: isModule(code),
    compress: true,
    mangle: true,
  });
  if (result.error) {
    console.warn(
      `Warning: copied unminified fallback for ${nodePath.relative(rootDir, absPath)} (${result.error.message || result.error})`,
    );
    fs.writeFileSync(outPath, code);
    return nodePath.relative(rootDir, outPath);
  }
  fs.writeFileSync(outPath, result.code);
  return nodePath.relative(rootDir, outPath);
}

const outputs = eachJs(libDir).map(minifyFile);
console.log(`Minified ${outputs.length} lib files`);
