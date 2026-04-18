import __os from "os";
import Zen from "../../index.js";
import hub from "../../lib/hub.js";
import { fileURLToPath } from "node:url";
import { dirname as __dirnameOf } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = __dirnameOf(__filename);
const zen = Zen();

zen.get("hub").on((data) => {
  console.log(data);
});

hub.watch(__dirname, {
  msg: true,
  hubignore: true,
  alias: __os.userInfo().username,
});
