import Zen from "../../index.js";
var location = { host: "localhost" };
var gun = Zen({
  file: "read.json",
  peers: ["http://" + location.host + ":8765/zen"],
});

gun
  .get("data")
  .path("stuff")
  .map(function (val, field) {
    console.log(field, "=", val);
  });

console.log("done... wait forever?");
