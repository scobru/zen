import http from "http";
import Zen from "../../index.js";

var server = http.createServer(function (req, res) {});
var zen = Zen({
  file: "http.json",
  web: server,
});
server.listen(8765);

console.log("Server started on port " + 8765 + " with /zen");
