(function(){

    var u, root = (typeof globalThis !== "undefined") ? globalThis : (typeof global !== "undefined" ? global : (typeof window !== "undefined" ? window : this));
    var native = {}
    native.btoa = (u+'' != typeof root.btoa) && root.btoa && root.btoa.bind(root);
    native.atob = (u+'' != typeof root.atob) && root.atob && root.atob.bind(root);
    if(native.btoa){
      root.btoa = function(data){ return native.btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, ''); };
    }
    if(native.atob){
      root.atob = function(data){
        var tmp = data.replace(/-/g, '+').replace(/_/g, '/')
        while(tmp.length % 4){ tmp += '=' }
        return native.atob(tmp);
      };
    }

}());
