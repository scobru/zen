import Zen from "../../index.js";
import { fileURLToPath } from "node:url";
import { dirname as __dirnameOf } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = __dirnameOf(__filename);
var zen = Zen({ file: __dirname + "/old2020json" });

zen.get("test").once(function (data, key) {
  console.log(key, data);
  if (!data) {
    throw "not compatible!";
  }
});
