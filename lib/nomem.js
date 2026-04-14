let __defaultExport;
function Nomem(){
  var opt = {}, u;
  opt.put = function(file, data, cb){ cb(null, -9) }; // dev/null!
  opt.get = function(file, cb){ cb(null) };
  return opt;
}
if(typeof globalThis !== "undefined"){
  globalThis.Nomem = Nomem;
} else {
	try{ __defaultExport = Nomem }catch(e){}
}
export default __defaultExport;