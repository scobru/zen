var __gun = (typeof GUN !== 'undefined') ? GUN : ((typeof Gun !== 'undefined') ? Gun : ((typeof require !== 'undefined') ? USE('../zen.js') : undefined));

(function(){

    var u, Gun = (''+u != typeof GUN)? (GUN||{chain:{}}) : __gun;
    Gun.chain.then = function(cb, opt){
      var gun = this, p = (new Promise(function(res, rej){
        gun.once(res, opt);
      }));
      return cb? p.then(cb) : p;
    }

}());
