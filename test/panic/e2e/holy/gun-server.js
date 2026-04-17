import panic from "panic-client";
import ports from "./ports";
import Gun from "../../../zen.js";
import http from "http";

var server = new http.Server();
var gun = new Gun({
  file: "delete-me.json",
  web: server,
});

server.listen(ports.gun);

panic.server("http://localhost:" + ports.panic);
