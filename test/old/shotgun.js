import __fs from "fs";
import __path from "path";
import { fileURLToPath } from "node:url";
import { dirname as __dirnameOf } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = __dirnameOf(__filename);
var keys;
if (process.env.LIVE || process.env.NODE_ENV === "production") {
  // Keys are provided by environment configs on the server
} else {
  // Keys are hosted outside this public repo folder, you must provide your own with environment variables.
  if (
    (__fs.existsSync || __path.existsSync)(
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
