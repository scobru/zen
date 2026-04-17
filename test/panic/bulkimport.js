import __ip from "ip";
import __fs from "fs";
import __panic_manager from "panic-manager";
import __fsrm from "./lib/fsrm";
import __http from "http";
import __index from "./index.js";
import __open from "./util/open.js";
import panic from "panic-server";
import { fileURLToPath } from "node:url";
import { dirname as __dirnameOf } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = __dirnameOf(__filename);

var config = {
  IP: __ip.address(),
  port: 8765,
  servers: 1,
  browsers: 2,
  puts: 1000,
  route: {
    "/": __dirname + "/index.html",
    "/zen.js": __dirname + "/../../zen.js",
    "/jquery.js": __dirname + "/../../examples/jquery.js",
  },
};

panic
  .server()
  .on("request", function (req, res) {
    config.route[req.url] &&
      __fs.createReadStream(config.route[req.url]).pipe(res);
  })
  .listen(config.port);

var clients = panic.clients;
var manager = __panic_manager();

manager.start({
  clients: Array(config.servers)
    .fill()
    .map(function (u, i) {
      return {
        type: "node",
        port: config.port + (i + 1),
      };
    }),
  panic: "http://" + config.IP + ":" + config.port,
});

var servers = clients.filter("Node.js");
var bob = servers.pluck(1);
var browsers = clients.excluding(servers);
var alice = browsers.pluck(1);
var carl = browsers.excluding(alice).pluck(1);

describe("Put ACK", function () {
  //this.timeout(5 * 60 * 1000);
  this.timeout(10 * 60 * 1000);

  it("Servers have joined!", function () {
    return servers.atLeast(config.servers);
  });

  it("GUN started!", function () {
    var tests = [],
      i = 0;
    servers.each(function (client) {
      tests.push(
        client.run(
          function (test) {
            var env = test.props;
            test.async();
            try {
              __fs.unlinkSync(env.i + "data");
            } catch (e) {}
            try {
              __fsrm(env.i + "data");
            } catch (e) {}
            var server = __http.createServer(function (req, res) {
              res.end("I am " + env.i + "!");
            });
            var port = env.config.port + env.i;
            var Gun = __index;
            var peers = [],
              i = env.config.servers;
            while (i--) {
              var tmp = env.config.port + (i + 1);
              if (port != tmp) {
                // ignore ourselves
                peers.push("http://" + env.config.IP + ":" + tmp + "/gun");
              }
            }
            console.log(port, " connect to ", peers);
            var gun = Gun({ file: env.i + "data", peers: peers, web: server });
            server.listen(port, function () {
              test.done();
            });
          },
          { i: (i += 1), config: config },
        ),
      );
    });
    return Promise.all(tests);
  });

  it(config.browsers + " browser(s) have joined!", function () {
    __open.web(config.browsers, "http://" + config.IP + ":" + config.port);
    return browsers.atLeast(config.browsers);
  });

  it("Browsers initialized gun!", function () {
    var tests = [],
      i = 0;
    browsers.each(function (client, id) {
      tests.push(
        client.run(
          function (test) {
            try {
              localStorage.clear();
            } catch (e) {}
            try {
              indexedDB.deleteDatabase("radata");
            } catch (e) {}
            var env = test.props;
            var gun = Gun(
              "http://" + env.config.IP + ":" + (env.config.port + 1) + "/gun",
            );
            window.ref = gun.get("test");
          },
          { i: (i += 1), config: config },
        ),
      );
    });
    return Promise.all(tests);
  });

  it("Puts", function () {
    return alice.run(
      function (test) {
        console.log("I AM ALICE");
        test.async();
        var i = test.props.puts,
          d = 0;
        while (i--) {
          go(i);
        }
        function go(i) {
          ref.get(i).put({ hello: "world" }, function (ack) {
            if (ack.err) {
              put_failed;
            }
            if (++d !== test.props.puts) {
              return;
            }
            console.log("all success", d);
            test.done();
          });
        }
      },
      { puts: config.puts },
    );
  });

  it("All finished!", function (done) {
    console.log("Done! Cleaning things up...");
    setTimeout(function () {
      done();
    }, 1000);
  });

  after("Everything shut down.", function () {
    __open.cleanup();
    return servers.run(function () {
      process.exit();
    });
  });
});
