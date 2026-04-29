import os from "os";
import path from "path";
import fs from "fs";

function zenDir(xdgEnv) {
  var fallbacks = { XDG_CONFIG_HOME: [".config"], XDG_DATA_HOME: [".local", "share"], XDG_STATE_HOME: [".local", "state"] };
  var base = process.env[xdgEnv] || path.join.apply(path, [os.homedir()].concat(fallbacks[xdgEnv]));
  return path.join(base, "zen");
}

export function config() { return zenDir("XDG_CONFIG_HOME"); }
export function data()   { return zenDir("XDG_DATA_HOME"); }
export function state()  { return zenDir("XDG_STATE_HOME"); }

export function ensure(dirPath) {
  try { if (!fs.existsSync(dirPath)) { fs.mkdirSync(dirPath, { recursive: true }); } } catch (e) {}
  return dirPath;
}
