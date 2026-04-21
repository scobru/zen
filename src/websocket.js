import __root from "./root.js";
import __mesh from "./mesh.js";

var Zen = __root;
Zen.Mesh = __mesh;

// TODO: resync upon reconnect online/offline
//window.ononline = window.onoffline = function(){ console.log('online?', navigator.onLine) }

Zen.on("opt", function (root) {
  this.to.next(root);
  if (root.once) {
    return;
  }
  var opt = root.opt;
  if (false === opt.WebSocket) {
    return;
  }

  var mesh = (opt.mesh = opt.mesh || Zen.Mesh(root));

  var env = Zen.window || {};
  var websocket =
    opt.WebSocket || env.WebSocket || env.webkitWebSocket || env.mozWebSocket;
  if (!websocket) {
    return;
  }
  opt.WebSocket = websocket;

  var wired = mesh.wire || opt.wire;
  mesh.wire = opt.wire = open;
  function open(peer) {
    try {
      if (!peer || !peer.url) {
        return wired && wired(peer);
      }
      var url = peer.url.replace(/^http/, "ws");
      var wire = (peer.wire = new opt.WebSocket(url));
      wire.onclose = function () {
        reconnect(peer);
        opt.mesh.bye(peer);
      };
      wire.onerror = function (err) {
        reconnect(peer);
      };
      wire.onopen = function () {
        opt.mesh.hi(peer);
      };
      wire.onmessage = function (msg) {
        if (!msg) {
          return;
        }
        opt.mesh.hear(msg.data || msg, peer);
      };
      return wire;
    } catch (e) {
      opt.mesh.bye(peer);
    }
  }

  setTimeout(function () {
    !opt.super && root.on("out", { dam: "hi" });
  }, 1); // it can take a while to open a socket, so maybe no longer lazy load for perf reasons?

  var wait = 2 * 999;
  function reconnect(peer) {
    clearTimeout(peer.defer);
    if (!opt.peers[peer.url]) {
      return;
    }
    if (doc && peer.retry <= 0) {
      return;
    }
    peer.retry =
      (peer.retry || opt.retry + 1 || 60) -
      (-peer.tried + (peer.tried = +new Date()) < wait * 4 ? 1 : 0);
    peer.defer = setTimeout(function to() {
      if (doc && doc.hidden) {
        return setTimeout(to, wait);
      }
      open(peer);
    }, wait);
  }
  var doc = "" + u !== typeof document && document;
});
var noop = function () {},
  u;
