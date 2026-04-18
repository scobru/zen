import theory from "theory";

export default theory(
  "interface",
  function (a) {
    return ":)";
  },
  ["../deps/discrete", "../deps/key/key"],
);

root.opts.key = { host: "/deps" };
