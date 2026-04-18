import fs from "fs";
import nodepath from "path";
import { fileURLToPath } from "node:url";
import { dirname as dirnameOf } from "node:path";
const filemodname = fileURLToPath(import.meta.url);
const __dirname = dirnameOf(filemodname);
var keys;
if (process.env.LIVE || process.env.NODE_ENV === "production") {
  // Keys are provided by environment configs on the server
} else {
  // Keys are hosted outside this public repo folder, you must provide your own with environment variables.
  if (
    (fs.existsSync || nodepath.existsSync)(
      (keys = __dirname + "/../../../linux/.ssh/keys-zen.js"),
    )
  ) {
    var loaded = await import(keys);
    keys = loaded.default || loaded;
  }
}

keys = keys || {};
keys.bucket = keys.bucket || "gunjs.herokuapp.com";

export default keys || {};
