import __index from './index.js';
define(function(require, exports, module) {

    var Gun = __index;

    var gun = new Gun();

    gun.get("hello").get("world").put("from gun").on((data, key) => console.log(data, key));

});