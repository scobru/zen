import __zen from "../zen.js";
var Zen = __zen;
const rel_ = "#";
const node_ = "_";

Zen.chain.unset = function (node) {
  if (
    this &&
    node &&
    node[node_] &&
    node[node_].put &&
    node[node_].put[node_] &&
    node[node_].put[node_][rel_]
  ) {
    this.put({ [node[node_].put[node_][rel_]]: null });
  }
  return this;
};
