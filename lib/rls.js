import __zen from "../zen.js";

let __defaultExport;
{
  function Store(opt) {
    opt = opt || {};
    opt.file = String(opt.file || "radata");
    var store = function Store() {};

    var ls = localStorage;
    store.put = function (key, data, cb) {
      ls["" + key] = data;
      cb(null, 1);
    };
    store.get = function (key, cb) {
      cb(null, ls["" + key]);
    };

    return store;
  }

  try {
    __defaultExport = Store;
  } catch (e) {}

  try {
    var Zen = __zen;
    Zen.on("create", function (root) {
      this.to.next(root);
      root.opt.store = root.opt.store || Store(root.opt);
    });
  } catch (e) {}
}
export default __defaultExport;
