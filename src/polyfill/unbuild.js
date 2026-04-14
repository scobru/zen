
  const MOD = { exports: {} };
function USE(arg, req){
    return req? USE[R(arg)] : arg.slice? USE[R(arg)] : function(mod, path){
      arg(mod = {exports: {}});
      USE[R(path)] = mod.exports;
    }
    function R(p){
      return p.split('/').slice(-1).toString().replace('.js','');
    }
  }
  var MODULE = MOD
  export default MOD.exports;
  
