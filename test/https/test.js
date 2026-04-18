import __fs from "fs";
import __https from "https";
import __path from "path";
import __index from "../../index.js";
import { fileURLToPath } from "node:url";
import { dirname as __dirnameOf } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = __dirnameOf(__filename);

export default function (port, file, cb, inject) {
  port =
    port ||
    process.env.OPENSHIFT_NODEJS_PORT ||
    process.env.VCAP_APP_PORT ||
    process.env.PORT ||
    process.argv[2] ||
    8765;

  var fs = __fs;
  var Zen = __index;

  var server = __https.createServer(
    {
      key: fs.readFileSync(__dirname + "/server.key"),
      cert: fs.readFileSync(__dirname + "/server.crt"),
      ca: fs.readFileSync(__dirname + "/ca.crt"),
      requestCert: true,
      rejectUnauthorized: false,
    },
    function (req, res) {
      if (Zen.serve(req, res)) {
        return;
      } // filters zen requests!
      var file;
      try {
        file = __fs.readFileSync(
          __path.join(__dirname + "/../../examples", req.url),
        );
      } catch (e) {
        file = __fs.readFileSync(
          __path.join(__dirname + "/../../examples", "index.html"),
        );
      }
      if (inject) {
        file = inject(file, req, res) || file;
      }
      res.end(file);
    },
  );

  var zen = Zen({
    file: file || "data",
    web: server,
    localStorage: false,
  });

  server.listen(port, cb);

  console.log("Server started on port " + port + " with /zen");
}
