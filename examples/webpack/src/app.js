import __index from './index.js';
define(function(require, exports, module) {

    var Gun = __index;

    var gun = new ZEN();

    gun.get("hello").get("world").put("from zen").on((data, key) => console.log(data, key));

});