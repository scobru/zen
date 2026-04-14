let __bundleExport;
;(function(){

  /* UNBUILD */

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
  /* UNBUILD */

	;USE(function(module){
		// Shim for generic javascript utilities.
		String.random = function(l, c){
			var s = '';
			l = l || 24; // you are not going to make a 0 length random number, so no need to check type
			c = c || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXZabcdefghijklmnopqrstuvwxyz';
			while(l-- > 0){ s += c.charAt(Math.floor(Math.random() * c.length)) }
			return s;
		}
		String.match = function(t, o){ var tmp, u;
			if('string' !== typeof t){ return false }
			if('string' == typeof o){ o = {'=': o} }
			o = o || {};
			tmp = (o['='] || o['*'] || o['>'] || o['<']);
			if(t === tmp){ return true }
			if(u !== o['=']){ return false }
			tmp = (o['*'] || o['>']);
			if(t.slice(0, (tmp||'').length) === tmp){ return true }
			if(u !== o['*']){ return false }
			if(u !== o['>'] && u !== o['<']){
				return (t >= o['>'] && t <= o['<'])? true : false;
			}
			if(u !== o['>'] && t >= o['>']){ return true }
			if(u !== o['<'] && t <= o['<']){ return true }
			return false;
		}
		String.hash = function(s, c){ // via SO
			if(typeof s !== 'string'){ return }
			    c = c || 0; // CPU schedule hashing by
			    if(!s.length){ return c }
			    for(var i=0,l=s.length,n; i<l; ++i){
			      n = s.charCodeAt(i);
			      c = ((c<<5)-c)+n;
			      c |= 0;
			    }
			    return c;
			  }
		var has = Object.prototype.hasOwnProperty;
		Object.plain = function(o){ return o? (o instanceof Object && o.constructor === Object) || Object.prototype.toString.call(o).match(/^\[object (\w+)\]$/)[1] === 'Object' : false }
		Object.empty = function(o, n){
			for(var k in o){ if(has.call(o, k) && (!n || -1==n.indexOf(k))){ return false } }
			return true;
		}
		Object.keys = Object.keys || function(o){
			var l = [];
			for(var k in o){ if(has.call(o, k)){ l.push(k) } }
			return l;
		}
		;(function(){
			var u, sT = setTimeout, l = 0, c = 0, active = 0
			, sI = (typeof setImmediate !== ''+u && setImmediate) || (function(c,f){
				if(typeof MessageChannel == ''+u){ return sT }
				(c = new MessageChannel()).port1.onmessage = function(e){ ''==e.data && f() }
				return function(q){ f=q;c.port2.postMessage('') }
			}()), check = sT.check = sT.check || (typeof performance !== ''+u && performance)
			|| {now: function(){ return +new Date }};
			sT.hold = sT.hold || 9; // half a frame benchmarks faster than < 1ms?
			sT.poll = sT.poll || function(f){
				if(active){
					sI(function(){ l = check.now(); active = 1; try{ f() } finally { active = 0 } }, c=0);
					return;
				}
				if((sT.hold >= (check.now() - l)) && c++ < 3333){
					active = 1;
					try{ f() } finally { active = 0 }
					return;
				}
				sI(function(){ l = check.now(); active = 1; try{ f() } finally { active = 0 } },c=0)
			}
		}());
		;(function(){ // Too many polls block, this "threads" them in turns over a single thread in time.
			var sT = setTimeout, t = sT.turn = sT.turn || function(f){ 1 == s.push(f) && p(T) }
			, s = t.s = [], p = sT.poll, i = 0, f, T = function(){
				if(f = s[i++]){ f() }
				if(i == s.length || 99 == i){
					s = t.s = s.slice(i);
					i = 0;
				}
				if(s.length){ p(T) }
			}
		}());
		;(function(){
			var u, sT = setTimeout, T = sT.turn;
			(sT.each = sT.each || function(l,f,e,S){ S = S || 9; (function t(s,L,r){
			  if(L = (s = (l||[]).splice(0,S)).length){
			  	for(var i = 0; i < L; i++){
			  		if(u !== (r = f(s[i]))){ break }
			  	}
			  	if(u === r){ T(t); return }
			  } e && e(r);
			}())})();
		}());
	})(USE, './shim');

	;USE(function(module){
		let __defaultExport;
		(function(){

		// On event emitter generic javascript utility.
		__defaultExport = function onto(tag, arg, as){
			if(!tag){ return {to: onto} }
			var u, f = 'function' == typeof arg, tag = (this.tag || (this.tag = {}))[tag] || f && (
				this.tag[tag] = {tag: tag, to: onto._ = { next: function(arg){ var tmp;
					if(tmp = this.to){ tmp.next(arg) }
			}}});
			if(f){
				var be = {
					off: onto.off ||
					(onto.off = function(){
						if(this.next === onto._.next){ return !0 }
						if(this === this.the.last){
							this.the.last = this.back;
						}
						this.to.back = this.back;
						this.next = onto._.next;
						this.back.to = this.to;
						if(this.the.last === this.the){
							delete this.on.tag[this.the.tag];
						}
					}),
					to: onto._,
					next: arg,
					the: tag,
					on: this,
					as: as,
				};
				(be.back = tag.last || tag).to = be;
				return tag.last = be;
			}
			if((tag = tag.to) && u !== arg){ tag.next(arg) }
			return tag;
		};

		}());
		module.exports = __defaultExport;
	})(USE, './onto');

	;USE(function(module){
		let __defaultExport;
		(function(){

		// TODO: BUG! Unbuild will make these globals... CHANGE unbuild to wrap files in a function.
		// Book is a replacement for JS objects, maps, dictionaries.
		var sT = setTimeout, B = sT.Book || (sT.Book = function(text){
			var b = function book(word, is){
				var has = b.all[word], p;
				if(is === undefined){ return (has && has.is) || b.get(has || word) }
				if(has){
					if(p = has.page){
						p.size += size(is) - size(has.is);
						p.text = '';
					}
					has.text = '';
					has.is = is;
					return b;
				}
				//b.all[word] = {is: word}; return b;
				return b.set(word, is);
			};
			// TODO: if from text, preserve the separator symbol.
			b.list = [{from: text, size: (text||'').length, substring: sub, toString: to, book: b, get: b, read: list}];
			b.page = page;
			b.set = set;
			b.get = get;
			b.all = {};
			return b;
		}), PAGE = 2**12;

		function page(word){
			var b = this, l = b.list, i = spot(word, l, b.parse), p = l[i];
			if('string' == typeof p){ l[i] = p = {size: -1, first: b.parse? b.parse(p) : p, substring: sub, toString: to, book: b, get: b, read: list} } // TODO: test, how do we arrive at this condition again?
			//p.i = i;
			return p;
			// TODO: BUG! What if we get the page, it turns out to be too big & split, we must then RE get the page!
		}
		function get(word){
			if(!word){ return }
			if(undefined !== word.is){ return word.is } // JS falsey values!
			var b = this, has = b.all[word];
			if(has){ return has.is }
			// get does an exact match, so we would have found it already, unless parseless page:
			var page = b.page(word), l, has, a, i;
			if(!page || !page.from){ return } // no parseless data
			return got(word, page);
		}
		function got(word, page){
			var b = page.book, l, has, a, i;
			if(l = from(page)){ has = l[got.i = i = spot(word, l, B.decode)]; } // TODO: POTENTIAL BUG! This assumes that each word on a page uses the same serializer/formatter/structure. // TOOD: BUG!!! Not actually, but if we want to do non-exact radix-like closest-word lookups on a page, we need to check limbo & potentially sort first.
			// parseless may return -1 from actual value, so we may need to test both. // TODO: Double check? I think this is correct.
			if(has && word == has.word){ return (b.all[word] = has).is }
			if('string' != typeof has){ has = l[got.i = i+=1] }
			if(has && word == has.word){ return (b.all[word] = has).is }
			a = slot(has) // Escape!
			if(word != B.decode(a[0])){
				has = l[got.i = i+=1]; // edge case bug?
				a = slot(has); // edge case bug?
				if(word != B.decode(a[0])){ return }
			}
			has = l[i] = b.all[word] = {word: ''+word, is: B.decode(a[1]), page: page, substring: subt, toString: tot}; // TODO: convert to a JS value!!! Maybe index! TODO: BUG word needs a page!!!! TODO: Check for other types!!!
			return has.is;
		}

		function spot(word, sorted, parse){ parse = parse || spot.no || (spot.no = function(t){ return t }); // TODO: BUG???? Why is there substring()||0 ? // TODO: PERF!!! .toString() is +33% faster, can we combine it with the export?
			var L = sorted, min = 0, page, found, l = (word=''+word).length, max = L.length, i = max/2;
			while(((word < (page = (parse(L[i=i>>0])||'').substring())) || ((parse(L[i+1])||'').substring() <= word)) && i != min){ // L[i] <= word < L[i+1]
				i += (page <= word)? (max - (min = i))/2 : -((max = i) - min)/2;
			}
			return i;
		}

		function from(a, t, l){
			if('string' != typeof a.from){ return a.from }
			//(l = a.from = (t = a.from||'').substring(1, t.length-1).split(t[0])); // slot
			(l = a.from = slot(t = t||a.from||''));
			return l;
		}
		function list(each){ each = each || function(x){return x} 
			var i = 0, l = sort(this), w, r = [], p = this.book.parse || function(){};
			//while(w = l[i++]){ r.push(each(slot(w)[1], p(w)||w, this)) }
			while(w = l[i++]){ r.push(each(this.get(w = w.word||p(w)||w), w, this)) } // TODO: BUG! PERF?
			return r;
		}

		function set(word, is){
			// TODO: Perf on random write is decent, but short keys or seq seems significantly slower.
			var b = this, has = b.all[word];
			if(has){ return b(word, is) } // updates to in-memory items will always match exactly.
			var page = b.page(word=''+word), tmp; // before we assume this is an insert tho, we need to check
			if(page && page.from){ // if it could be an update to an existing word from parseless.
				b.get(word);
				if(b.all[word]){ return b(word, is) }
			}
			// MUST be an insert:
			has = b.all[word] = {word: word, is: is, page: page, substring: subt, toString: tot};
			page.first = (page.first < word)? page.first : word;
			if(!page.limbo){ (page.limbo = []) }
			page.limbo.push(has);
			b(word, is);
			page.size += size(word) + size(is);
			if((b.PAGE || PAGE) < page.size){ split(page, b) }
			return b;
		}

		function split(p, b){ // TODO: use closest hash instead of half.
			//console.time();
			//var S = performance.now();
			var L = sort(p), l = L.length, i = l/2 >> 0, j = i, half = L[j], tmp;
			//console.timeEnd();
			var next = {first: half.substring(), size: 0, substring: sub, toString: to, book: b, get: b, read: list}, f = next.from = [];
			while(tmp = L[i++]){
				f.push(tmp);
				next.size += (tmp.is||'').length||1;
				tmp.page = next;
			}
			p.from = p.from.slice(0, j);
			p.size -= next.size;
			b.list.splice(spot(next.first, b.list)+1, 0, next); // TODO: BUG! Make sure next.first is decoded text. // TODO: BUG! spot may need parse too?
			//console.timeEnd();
			if(b.split){ b.split(next, p) }
			//console.log(S = (performance.now() - S), 'split');
			//console.BIG = console.BIG > S? console.BIG : S;
		}

		function slot(t){ return heal((t=t||'').substring(1, t.length-1).split(t[0]), t[0]) } B.slot = slot; // TODO: check first=last & pass `s`.
		function heal(l, s){ var i, e;
			if(0 > (i = l.indexOf(''))){ return l } // ~700M ops/sec on 4KB of Math.random()s, even faster if escape does exist.
			if('' == l[0] && 1 == l.length){ return [] } // annoying edge cases! how much does this slow us down?
			//if((c=i+2+parseInt(l[i+1])) != c){ return [] } // maybe still faster than below?
			if((e=i+2+parseInt((e=l[i+1]).substring(0, e.indexOf('"'))||e)) != e){ return [] } // NaN check in JS is weird.
			l[i] = l.slice(i, e).join(s||'|'); // rejoin the escaped value
			return l.slice(0,i+1).concat(heal(l.slice(e), s)); // merge left with checked right.
		}

		function size(t){ return (t||'').length||1 } // bits/numbers less size? Bug or feature?
		function subt(i,j){ return this.word }
		//function tot(){ return this.text = this.text || "'"+(this.word)+"'"+(this.is)+"'" }
		function tot(){ var tmp = {};
			//if((tmp = this.page) && tmp.saving){ delete tmp.book.all[this.word]; } // TODO: BUG! Book can't know about RAD, this was from RAD, so this MIGHT be correct but we need to refactor. Make sure to add tests that will re-trigger this.
			return this.text = this.text || ":"+B.encode(this.word)+":"+B.encode(this.is)+":";
			tmp[this.word] = this.is;
			return this.text = this.text || B.encode(tmp,'|',':').slice(1,-1);
			//return this.text = this.text || "'"+(this.word)+"'"+(this.is)+"'";
		}
		function sub(i,j){ return (this.first||this.word||B.decode((from(this)||'')[0]||'')).substring(i,j) }
		function to(){ return this.text = this.text || text(this) }
		function text(p){ // PERF: read->[*] : text->"*" no edit waste 1 time perf.
			if(p.limbo){ sort(p) } // TODO: BUG? Empty page meaning? undef, '', '||'?
			return ('string' == typeof p.from)? p.from : '|'+(p.from||[]).join('|')+'|';
		}

		function sort(p, l){
			var f = p.from = ('string' == typeof p.from)? slot(p.from) : p.from||[];
			if(!(l = l || p.limbo)){ return f }
			return mix(p).sort(function(a,b){
				return (a.word||B.decode(''+a)) < (b.word||B.decode(''+b))? -1:1;
			});
		}
		function mix(p, l){ // TODO: IMPROVE PERFORMANCE!!!! l[j] = i is 5X+ faster than .push(
			l = l || p.limbo || []; p.limbo = null;
			var j = 0, i, f = p.from;
			while(i = l[j++]){
				if(got(i.word, p)){
					f[got.i] = i; // TODO: Trick: allow for a GUN'S HAM CRDT hook here.
				} else {
					f.push(i); 
				}
			}
			return f;
		}

		B.encode = function(d, s, u){ s = s || "|"; u = u || String.fromCharCode(32);
			switch(typeof d){
				case 'string': // text
					var i = d.indexOf(s), c = 0;
					while(i != -1){ c++; i = d.indexOf(s, i+1) }
					return (c?s+c:'')+ '"' + d;
				case 'number': return (d < 0)? ''+d : '+'+d;
				case 'boolean': return d? '+' : '-';
				case 'object': if(!d){ return ' ' } // TODO: BUG!!! Nested objects don't slot correctly
					var l = Object.keys(d).sort(), i = 0, t = s, k, v;
					while(k = l[i++]){ t += u+B.encode(k,s,u)+u+B.encode(d[k],s,u)+u+s }
					return t;
			}
		}
		B.decode = function(t, s){ s = s || "|";
			if('string' != typeof t){ return }
			switch(t){ case ' ': return null; case '-': return false; case '+': return true; }
			switch(t[0]){
				case '-': case '+': return parseFloat(t);
				case '"': return t.slice(1);
			}
			return t.slice(t.indexOf('"')+1);
		}

		B.hash = function(s, c){ // via SO
			if(typeof s !== 'string'){ return }
		  c = c || 0; // CPU schedule hashing by
		  if(!s.length){ return c }
		  for(var i=0,l=s.length,n; i<l; ++i){
		    n = s.charCodeAt(i);
		    c = ((c<<5)-c)+n;
		    c |= 0;
		  }
		  return c;
		}

		function record(key, val){ return key+B.encode(val)+"%"+key.length }
		function decord(t){
			var o = {}, i = t.lastIndexOf("%"), c = parseFloat(t.slice(i+1));
			o[t.slice(0,c)] = B.decode(t.slice(c,i));
			return o;
		}

		try{__defaultExport =B}catch(e){}

		}());
		module.exports = __defaultExport;
	})(USE, './book');

	;USE(function(module){
		let __defaultExport;
		(function(){

		// Valid values are a subset of JSON: null, binary, number (!Infinity), text,
		// or a soul relation. Arrays need special algorithms to handle concurrency,
		// so they are not supported directly. Use an extension that supports them if
		// needed but research their problems first.
		__defaultExport = function(v){
		  // "deletes", nulling out keys.
		  return v === null ||
			"string" === typeof v ||
			"boolean" === typeof v ||
			// we want +/- Infinity to be, but JSON does not support it, sad face.
			// can you guess what v === v checks for? ;)
			("number" === typeof v && v != Infinity && v != -Infinity && v === v) ||
			(!!v && "string" == typeof v["#"] && Object.keys(v).length === 1 && v["#"]);
		}

		}());
		module.exports = __defaultExport;
	})(USE, './valid');

	;USE(function(module){
		USE('./shim.js', 1);

		let __defaultExport;
		(function(){
		    function State(){
		        var t = +new Date;
		        if(last < t){
		            return N = 0, last = t + State.drift;
		        }
		        return last = t + ((N += 1) / D) + State.drift;
		    }
		    State.drift = 0;
		    var NI = -Infinity, N = 0, D = 999, last = NI, u; // WARNING! In the future, on machines that are D times faster than 2016AD machines, you will want to increase D by another several orders of magnitude so the processing speed never out paces the decimal resolution (increasing an integer effects the state accuracy).
		    State.is = function(n, k, o){ // convenience function to get the state on a key on a node and return it.
		        var tmp = (k && n && n._ && n._['>']) || o;
		        if(!tmp){ return }
		        return ('number' == typeof (tmp = tmp[k]))? tmp : NI;
		    }
		    State.ify = function(n, k, s, v, soul){ // put a key's state on a node.
		        (n = n || {})._ = n._ || {}; // safety check or init.
		        if(soul){ n._['#'] = soul } // set a soul if specified.
		        var tmp = n._['>'] || (n._['>'] = {}); // grab the states data.
		        if(u !== k && k !== '_'){
		            if('number' == typeof s){ tmp[k] = s } // add the valid state.
		            if(u !== v){ n[k] = v } // Note: Not its job to check for valid values!
		        }
		        return n;
		    }
		    __defaultExport = State;
		}());
		module.exports = __defaultExport;
	})(USE, './state');

	;USE(function(module){
		USE('./shim.js', 1);

		let __defaultExport;
		(function(){
		    function Dup(opt){
		        var dup = {s:{}}, s = dup.s;
		        opt = opt || {max: 999, age: 1000 * 9};//*/ 1000 * 9 * 3};
		        dup.check = function(id){
		            if(!s[id]){ return false }
		            return dt(id);
		        }
		        var dt = dup.track = function(id){
		            var it = s[id] || (s[id] = {});
		            it.was = dup.now = +new Date;
		            if(!dup.to){ dup.to = setTimeout(dup.drop, opt.age + 9) }
		            if(dt.ed){ dt.ed(id) }
		            return it;
		        }
		        dup.drop = function(age){
		            dup.to = null;
		            dup.now = +new Date;
		            var l = Object.keys(s);
		            console.STAT && console.STAT(dup.now, +new Date - dup.now, 'dup drop keys'); // prev ~20% CPU 7% RAM 300MB // now ~25% CPU 7% RAM 500MB
		            setTimeout.each(l, function(id){ var it = s[id]; // TODO: .keys( is slow?
		                if(it && (age || opt.age) > (dup.now - it.was)){ return }
		                delete s[id];
		            },0,99);
		        }
		        return dup;
		    }
		    __defaultExport = Dup;
		}());
		module.exports = __defaultExport;
	})(USE, './dup');

	;USE(function(module){
		USE('./onto.js', 1);

		let __defaultExport;
		(function(){
		    __defaultExport = function ask(cb, as){
		        if(!this.on){ return }
		        var lack = (this.opt||{}).lack || 9000;
		        if(!('function' == typeof cb)){
		            if(!cb){ return }
		            var id = cb['#'] || cb, tmp = (this.tag||'')[id];
		            if(!tmp){ return }
		            if(as){
		                tmp = this.on(id, as);
		                clearTimeout(tmp.err);
		                tmp.err = setTimeout(function(){ tmp.off() }, lack);
		            }
		            return true;
		        }
		        var id = (as && as['#']) || random(9);
		        if(!cb){ return id }
		        var to = this.on(id, cb, as);
		        to.err = to.err || setTimeout(function(){ to.off();
		            to.next({err: "Error: No ACK yet.", lack: true});
		        }, lack);
		        return id;
		    }
		    var random = String.random || function(){ return Math.random().toString(36).slice(2) }
		}());
		module.exports = __defaultExport;
	})(USE, './ask');

	;USE(function(module){
		USE('./shim.js', 1);
		var __valid = USE('./valid.js', 1);
		var __state = USE('./state.js', 1);
		var __onto = USE('./onto.js', 1);
		var __dup = USE('./dup.js', 1);
		var __ask = USE('./ask.js', 1);

		let __defaultExport;
		(function(){
		    function Gun(o){
		        if(o instanceof Gun){ return (this._ = {$: this}).$ }
		        if(!(this instanceof Gun)){ return new Gun(o) }
		        return Gun.create(this._ = {$: this, opt: o});
		    }

		    Gun.is = function($){ return ($ instanceof Gun) || ($ && $._ && ($ === $._.$)) || false }

		    Gun.version = 0.2020;

		    Gun.chain = Gun.prototype;
		    Gun.chain.toJSON = function(){};

		    Gun.valid = __valid;
		    Gun.state = __state;
		    Gun.on = __onto;
		    Gun.dup = __dup;
		    Gun.ask = __ask;

		    (function(){
		        Gun.create = function(at){
		            at.root = at.root || at;
		            at.graph = at.graph || {};
		            at.on = at.on || Gun.on;
		            at.ask = at.ask || Gun.ask;
		            at.dup = at.dup || Gun.dup();
		            var gun = at.$.opt(at.opt);
		            if(!at.once){
		                at.on('in', universe, at);
		                at.on('out', universe, at);
		                at.on('put', map, at);
		                Gun.on('create', at);
		                at.on('create', at);
		            }
		            at.once = 1;
		            return gun;
		        }
		        function universe(msg){
		            // TODO: BUG! msg.out = null being set!
		            //if(!F){ var eve = this; setTimeout(function(){ universe.call(eve, msg,1) },Math.random() * 100);return; } // ADD F TO PARAMS!
		            if(!msg){ return }
		            if(msg.out === universe){ this.to.next(msg); return }
		            var eve = this, as = eve.as, at = as.at || as, gun = at.$, dup = at.dup, tmp, DBG = msg.DBG;
		            (tmp = msg['#']) || (tmp = msg['#'] = text_rand(9));
		            if(dup.check(tmp)){ return } dup.track(tmp);
		            tmp = msg._; msg._ = ('function' == typeof tmp)? tmp : function(){};
		            (msg.$ && (msg.$ === (msg.$._||'').$)) || (msg.$ = gun);
		            if(msg['@'] && !msg.put){ ack(msg) }
		            if(!at.ask(msg['@'], msg)){ // is this machine listening for an ack?
		                DBG && (DBG.u = +new Date);
		                if(msg.put){ put(msg); return } else
		                if(msg.get){ Gun.on.get(msg, gun) }
		            }
		            DBG && (DBG.uc = +new Date);
		            eve.to.next(msg);
		            DBG && (DBG.ua = +new Date);
		            if(msg.nts || msg.NTS){ return } // TODO: This shouldn't be in core, but fast way to prevent NTS spread. Delete this line after all peers have upgraded to newer versions.
		            msg.out = universe; at.on('out', msg);
		            DBG && (DBG.ue = +new Date);
		        }
		        function put(msg){
		            if(!msg){ return }
		            var ctx = msg._||'', root = ctx.root = ((ctx.$ = msg.$||'')._||'').root;
		            if(msg['@'] && ctx.faith && !ctx.miss){ // TODO: AXE may split/route based on 'put' what should we do here? Detect @ in AXE? I think we don't have to worry, as DAM will route it on @.
		                msg.out = universe;
		                root.on('out', msg);
		                return;
		            }
		            ctx.latch = root.hatch; ctx.match = root.hatch = [];
		            var put = msg.put;
		            var DBG = ctx.DBG = msg.DBG, S = +new Date; CT = CT || S;
		            if(put['#'] && put['.']){ /*root && root.on('put', msg);*/ return } // TODO: BUG! This needs to call HAM instead.
		            DBG && (DBG.p = S);
		            ctx['#'] = msg['#'];
		            ctx.msg = msg;
		            ctx.all = 0;
		            ctx.stun = 1;
		            var nl = Object.keys(put);//.sort(); // TODO: This is unbounded operation, large graphs will be slower. Write our own CPU scheduled sort? Or somehow do it in below? Keys itself is not O(1) either, create ES5 shim over ?weak map? or custom which is constant.
		            console.STAT && console.STAT(S, ((DBG||ctx).pk = +new Date) - S, 'put sort');
		            var ni = 0, nj, kl, soul, node, states, err, tmp;
		            (function pop(o){
		                if(nj != ni){ nj = ni;
		                    if(!(soul = nl[ni])){
		                        console.STAT && console.STAT(S, ((DBG||ctx).pd = +new Date) - S, 'put');
		                        fire(ctx);
		                        return;
		                    }
		                    if(!(node = put[soul])){ err = ERR+cut(soul)+"no node." } else
		                    if(!(tmp = node._)){ err = ERR+cut(soul)+"no meta." } else
		                    if(soul !== tmp['#']){ err = ERR+cut(soul)+"soul not same." } else
		                    if(!(states = tmp['>'])){ err = ERR+cut(soul)+"no state." }
		                    kl = Object.keys(node||{}); // TODO: .keys( is slow
		                }
		                if(err){
		                    msg.err = ctx.err = err; // invalid data should error and stun the message.
		                    fire(ctx);
		                    //console.log("handle error!", err) // handle!
		                    return;
		                }
		                var i = 0, key; o = o || 0;
		                while(o++ < 9 && (key = kl[i++])){
		                    if('_' === key){ continue }
		                    var val = node[key], state = states[key];
		                    if(u === state){ err = ERR+cut(key)+"on"+cut(soul)+"no state."; break }
		                    if(!valid(val)){ err = ERR+cut(key)+"on"+cut(soul)+"bad "+(typeof val)+cut(val); break }
		                    //ctx.all++; //ctx.ack[soul+key] = '';
		                    ham(val, key, soul, state, msg);
		                    ++C; // courtesy count;
		                }
		                if((kl = kl.slice(i)).length){ turn(pop); return }
		                ++ni; kl = null; pop(o);
		            }());
		        } Gun.on.put = put;
		        // TODO: MARK!!! clock below, reconnect sync, SEA certify wire merge, User.auth taking multiple times, // msg put, put, say ack, hear loop...
		        // WASIS BUG! local peer not ack. .off other people: .open
		        function ham(val, key, soul, state, msg){
		            var ctx = msg._||'', root = ctx.root, graph = root.graph, lot, tmp;
		            var vertex = graph[soul] || empty, was = state_is(vertex, key, 1), known = vertex[key];

		            var DBG = ctx.DBG; if(tmp = console.STAT){ if(!graph[soul] || !known){ tmp.has = (tmp.has || 0) + 1 } }

		            var now = State(), u;
		            if(state > now){
		                if((tmp = state - now) > Ham.max){
		                    msg.err = ctx.err = ERR+cut(key)+"on"+cut(soul)+"state too far in future."; fire(ctx); back(ctx); return;
		                }
		                setTimeout(function(){ ham(val, key, soul, state, msg) }, tmp > MD? MD : tmp); // Max Defer 32bit. :(
		                console.STAT && console.STAT(((DBG||ctx).Hf = +new Date), tmp, 'future');
		                return;
		            }
		            if(state < was){ /*old;*/ if(true || !ctx.miss){ return } } // but some chains have a cache miss that need to re-fire. // TODO: Improve in future. // for AXE this would reduce rebroadcast, but GUN does it on message forwarding. // TURNS OUT CACHE MISS WAS NOT NEEDED FOR NEW CHAINS ANYMORE!!! DANGER DANGER DANGER, ALWAYS RETURN! (or am I missing something?)
		            if(!ctx.faith){ // TODO: BUG? Can this be used for cache miss as well? // Yes this was a bug, need to check cache miss for RAD tests, but should we care about the faith check now? Probably not.
		                if(state === was && (val === known || L(val) <= L(known))){ /*console.log("same");*/ /*same;*/ if(!ctx.miss){ return } } // same
		            }
		            ctx.stun++; // TODO: 'forget' feature in SEA tied to this, bad approach, but hacked in for now. Any changes here must update there.
		            var aid = msg['#']+ctx.all++, id = {toString: function(){ return aid }, _: ctx}; id.toJSON = id.toString; // this *trick* makes it compatible between old & new versions.
		            root.dup.track(id)['#'] = msg['#']; // fixes new OK acks for RPC like RTC.
		            DBG && (DBG.ph = DBG.ph || +new Date);
		            root.on('put', {'#': id, '@': msg['@'], put: {'#': soul, '.': key, ':': val, '>': state}, ok: msg.ok, _: ctx});
		        }
		        function map(msg){
		            var DBG; if(DBG = (msg._||'').DBG){ DBG.pa = +new Date; DBG.pm = DBG.pm || +new Date}
		            var eve = this, root = eve.as, graph = root.graph, ctx = msg._, put = msg.put, soul = put['#'], key = put['.'], val = put[':'], state = put['>'], id = msg['#'], tmp;
		            if((tmp = ctx.msg) && (tmp = tmp.put) && (tmp = tmp[soul])){ state_ify(tmp, key, state, val, soul) } // necessary! or else out messages do not get SEA transforms.
		            //var bytes = ((graph[soul]||'')[key]||'').length||1;
		            graph[soul] = state_ify(graph[soul], key, state, val, soul);
		            if(tmp = (root.next||'')[soul]){
		                //tmp.bytes = (tmp.bytes||0) + ((val||'').length||1) - bytes;
		                //if(tmp.bytes > 2**13){ Gun.log.once('byte-limit', "Note: In the future, GUN peers will enforce a ~4KB query limit. Please see https://gun.eco/docs/Page") }
		                tmp.on('in', msg)
		            }
		            fire(ctx);
		            eve.to.next(msg);
		        }
		        function fire(ctx, msg){ var root;
		            if(ctx.stop){ return }
		            if(0 < --ctx.stun && !ctx.err){ return } // decrement always runs; early-return only if stun still positive AND no error.
		            ctx.stop = 1;
		            if(!(root = ctx.root)){ return }
		            var tmp = ctx.match; tmp.end = 1;
		            if(tmp === root.hatch){ if(!(tmp = ctx.latch) || tmp.end){ delete root.hatch } else { root.hatch = tmp } }
		            ctx.hatch && ctx.hatch(); // TODO: rename/rework how put & this interact.
		            setTimeout.each(ctx.match, function(cb){cb && cb()}); 
		            if(!(msg = ctx.msg) || ctx.err || msg.err){ return }
		            msg.out = universe;
		            ctx.root.on('out', msg);

		            CF(); // courtesy check;
		        }
		        function ack(msg){ // aggregate ACKs.
		            var id = msg['@'] || '', ctx, ok, tmp;
		            if(!(ctx = id._)){
		                var dup = (dup = msg.$) && (dup = dup._) && (dup = dup.root) && (dup = dup.dup);
		                if(!(dup = dup.check(id))){ return }
		                msg['@'] = dup['#'] || msg['@']; // This doesn't do anything anymore, backtrack it to something else?
		                return;
		            }
		            ctx.acks = (ctx.acks||0) + 1;
		            if(ctx.err = msg.err){
		                msg['@'] = ctx['#'];
		                fire(ctx); // TODO: BUG? How it skips/stops propagation of msg if any 1 item is error, this would assume a whole batch/resync has same malicious intent.
		            }
		            ctx.ok = msg.ok || ctx.ok;
		            if(!ctx.stop && !ctx.crack){ ctx.crack = ctx.match && ctx.match.push(function(){back(ctx)}) } // handle synchronous acks. NOTE: If a storage peer ACKs synchronously then the PUT loop has not even counted up how many items need to be processed, so ctx.STOP flags this and adds only 1 callback to the end of the PUT loop.
		            back(ctx);
		        }
		        function back(ctx){
		            if(!ctx || !ctx.root){ return }
		            if(ctx.stun || (ctx.acks||0) !== ctx.all){ return } // normalize acks: undefined treated as 0 before first storage ack arrives.
		            ctx.root.on('in', {'@': ctx['#'], err: ctx.err, ok: ctx.err? u : ctx.ok || {'':1}});
		        }

		        var ERR = "Error: Invalid graph!";
		        var cut = function(s){ return " '"+(''+s).slice(0,9)+"...' " }
		        var L = JSON.stringify, MD = 2147483647, State = Gun.state;
		        var Ham = ham; Ham.max = 1000 * 60 * 60 * 24 * 7; // 1 week: legit clock skew is seconds, not days.
		        var C = 0, CT, CF = function(){if(C>999 && (C/-(CT - (CT = +new Date))>1)){Gun.window && console.log("Warning: You're syncing 1K+ records a second, faster than DOM can update - consider limiting query.");CF=function(){C=0}}};

		    }());

		    (function(){
		        Gun.on.get = function(msg, gun){
		            var root = gun._, get = msg.get, soul = get['#'], node = root.graph[soul], has = get['.'];
		            var next = root.next || (root.next = {}), at = next[soul];

		            // TODO: Azarattum bug, what is in graph is not same as what is in next. Fix!

		            // queue concurrent GETs?
		            // TODO: consider tagging original message into dup for DAM.
		            // TODO: ^ above? In chat app, 12 messages resulted in same peer asking for `#user.pub` 12 times. (same with #user GET too, yipes!) // DAM note: This also resulted in 12 replies from 1 peer which all had same ##hash but none of them deduped because each get was different.
		            // TODO: Moving quick hacks fixing these things to axe for now.
		            // TODO: a lot of GET #foo then GET #foo."" happening, why?
		            // TODO: DAM's ## hash check, on same get ACK, producing multiple replies still, maybe JSON vs YSON?
		            // TMP note for now: viMZq1slG was chat LEX query #.
		            /*if(gun !== (tmp = msg.$) && (tmp = (tmp||'')._)){
		                if(tmp.Q){ tmp.Q[msg['#']] = ''; return } // chain does not need to ask for it again.
		                tmp.Q = {};
		            }*/
		            /*if(u === has){
		                if(at.Q){
		                    //at.Q[msg['#']] = '';
		                    //return;
		                }
		                at.Q = {};
		            }*/
		            var ctx = msg._||{}, DBG = ctx.DBG = msg.DBG;
		            DBG && (DBG.g = +new Date);
		            //console.log("GET:", get, node, has, at);
		            //if(!node && !at){ return root.on('get', msg) }
		            //if(has && node){ // replace 2 below lines to continue dev?
		            if(!node){ return root.on('get', msg) }
		            if(has){
		                if('string' != typeof has || u === node[has]){
		                    if(!((at||'').next||'')[has]){ root.on('get', msg); return }
		                }
		                node = state_ify({}, has, state_is(node, has), node[has], soul);
		                // If we have a key in-memory, do we really need to fetch?
		                // Maybe... in case the in-memory key we have is a local write
		                // we still need to trigger a pull/merge from peers.
		            }
		            //Gun.window? Gun.obj.copy(node) : node; // HNPERF: If !browser bump Performance? Is this too dangerous to reference root graph? Copy / shallow copy too expensive for big nodes. Gun.obj.to(node); // 1 layer deep copy // Gun.obj.copy(node); // too slow on big nodes
		            node && ack(msg, node);
		            root.on('get', msg); // send GET to storage adapters.
		        }
		        function ack(msg, node){
		            var S = +new Date, ctx = msg._||{}, DBG = ctx.DBG = msg.DBG;
		            var to = msg['#'], id = text_rand(9), keys = Object.keys(node||'').sort(), soul = ((node||'')._||'')['#'], kl = keys.length, j = 0, root = msg.$._.root, F = (node === root.graph[soul]);
		            console.STAT && console.STAT(S, ((DBG||ctx).gk = +new Date) - S, 'got keys');
		            // PERF: Consider commenting this out to force disk-only reads for perf testing? // TODO: .keys( is slow
		            node && (function go(){
		                S = +new Date;
		                var i = 0, k, put = {}, tmp;
		                while(i < 9 && (k = keys[i++])){
		                    state_ify(put, k, state_is(node, k), node[k], soul);
		                }
		                keys = keys.slice(i);
		                (tmp = {})[soul] = put; put = tmp;
		                var faith; if(F){ faith = function(){}; faith.ram = faith.faith = true; } // HNPERF: We're testing performance improvement by skipping going through security again, but this should be audited.
		                tmp = keys.length;
		                console.STAT && console.STAT(S, -(S - (S = +new Date)), 'got copied some');
		                DBG && (DBG.ga = +new Date);
		                root.on('in', {'@': to, '#': id, put: put, '%': (tmp? (id = text_rand(9)) : u), $: root.$, _: faith, DBG: DBG});
		                console.STAT && console.STAT(S, +new Date - S, 'got in');
		                if(!tmp){ return }
		                setTimeout.turn(go);
		            }());
		            if(!node){ root.on('in', {'@': msg['#']}) } // TODO: I don't think I like this, the default lS adapter uses this but "not found" is a sensitive issue, so should probably be handled more carefully/individually.
		        } Gun.on.get.ack = ack;
		    }());

		    (function(){
		        Gun.chain.opt = function(opt){
		            opt = opt || {};
		            var gun = this, at = gun._, tmp = opt.peers || opt;
		            if(!Object.plain(opt)){ opt = {} }
		            if(!Object.plain(at.opt)){ at.opt = opt }
		            if('string' == typeof tmp){ tmp = [tmp] }
		            if(!Object.plain(at.opt.peers)){ at.opt.peers = {}}
		            if(tmp instanceof Array){
		                opt.peers = {};
		                tmp.forEach(function(url){
		                    var p = {}; p.id = p.url = url;
		                    opt.peers[url] = at.opt.peers[url] = at.opt.peers[url] || p;
		                })
		            }
		            obj_each(opt, function each(k){ var v = this[k];
		                if((this && this.hasOwnProperty(k)) || 'string' == typeof v || Object.empty(v)){ this[k] = v; return }
		                if(v && v.constructor !== Object && !(v instanceof Array)){ return }
		                obj_each(v, each);
		            });
		            at.opt.from = opt;
		            Gun.on('opt', at);
		            at.opt.uuid = at.opt.uuid || function uuid(l){ return Gun.state().toString(36).replace('.','') + String.random(l||12) }
		            return gun;
		        }
		    }());

		    var obj_each = function(o,f){ Object.keys(o).forEach(f,o) }, text_rand = String.random, turn = setTimeout.turn, valid = Gun.valid, state_is = Gun.state.is, state_ify = Gun.state.ify, u, empty = {}, C;

		    Gun.log = function(){ return (!Gun.log.off && C.log.apply(C, arguments)), [].slice.call(arguments).join(' ') };
		    Gun.log.once = function(w,s,o){ return (o = Gun.log.once)[w] = o[w] || 0, o[w]++ || Gun.log(s) };

		    ((typeof globalThis !== "undefined" && typeof window === "undefined" && typeof WorkerGlobalScope !== "undefined") ? ((globalThis.GUN = globalThis.Gun = Gun).window = globalThis) : (typeof window !== "undefined" ? ((window.GUN = window.Gun = Gun).window = window) : undefined));
		    ((globalThis.GUN = globalThis.Gun = Gun).globalThis = globalThis);
		    try{ if(typeof MODULE !== "undefined"){ MODULE.exports = Gun } }catch(e){}
		    __defaultExport = Gun;

		    (Gun.window||{}).console = (Gun.window||{}).console || {log: function(){}};
		    (C = console).only = function(i, s){ return (C.only.i && i === C.only.i && C.only.i++) && (C.log.apply(C, arguments) || s) };
		}());
		module.exports = __defaultExport;
	})(USE, './root');

	;USE(function(module){
		var __root = USE('./root.js', 1);
		(function(){

		var Gun = __root;
		Gun.chain.back = function(n, opt){ var tmp;
			n = n || 1;
			if(-1 === n || Infinity === n){
				return this._.root.$;
			} else
			if(1 === n){
				return (this._.back || this._).$;
			}
			var gun = this, at = gun._;
			if(typeof n === 'string'){
				n = n.split('.');
			}
			if(n instanceof Array){
				var i = 0, l = n.length, tmp = at;
				for(i; i < l; i++){
					tmp = (tmp||empty)[n[i]];
				}
				if(u !== tmp){
					return opt? gun : tmp;
				} else
				if((tmp = at.back)){
					return tmp.$.back(n, opt);
				}
				return;
			}
			if('function' == typeof n){
				var yes, tmp = {back: at};
				while((tmp = tmp.back)
				&& u === (yes = n(tmp, opt))){}
				return yes;
			}
			if('number' == typeof n){
				return (at.back || at).$.back(n - 1);
			}
			return this;
		}
		var empty = {}, u;

		}());
	})(USE, './back');

	;USE(function(module){
		var __root = USE('./root.js', 1);
		(function(){

		// WARNING: GUN is very simple, but the JavaScript chaining API around GUN
		// is complicated and was extremely hard to build. If you port GUN to another
		// language, consider implementing an easier API to build.
		var Gun = __root;
		Gun.chain.chain = function(sub){
			var gun = this, at = gun._, chain = new (sub || gun).constructor(gun), cat = chain._, root;
			cat.root = root = at.root;
			cat.id = ++root.once;
			cat.back = gun._;
			cat.on = Gun.on;
			cat.on('in', Gun.on.in, cat); // For 'in' if I add my own listeners to each then I MUST do it before in gets called. If I listen globally for all incoming data instead though, regardless of individual listeners, I can transform the data there and then as well.
			cat.on('out', Gun.on.out, cat); // However for output, there isn't really the global option. I must listen by adding my own listener individually BEFORE this one is ever called.
			return chain;
		}

		function output(msg){
			var put, get, at = this.as, back = at.back, root = at.root, tmp;
			if(!msg.$){ msg.$ = at.$ }
			this.to.next(msg);
			if(at.err){ at.on('in', {put: at.put = u, $: at.$}); return }
			if(get = msg.get){
				/*if(u !== at.put){
					at.on('in', at);
					return;
				}*/
				if(root.pass){ root.pass[at.id] = at; } // will this make for buggy behavior elsewhere?
				if(at.lex){ Object.keys(at.lex).forEach(function(k){ tmp[k] = at.lex[k] }, tmp = msg.get = msg.get || {}) }
				if(get['#'] || at.soul){
					get['#'] = get['#'] || at.soul;
					//root.graph[get['#']] = root.graph[get['#']] || {_:{'#':get['#'],'>':{}}};
					msg['#'] || (msg['#'] = text_rand(9)); // A3120 ?
					back = (sget(root, get['#'])._);
					if(!(get = get['.'])){ // soul
						tmp = back.ask && back.ask['']; // check if we have already asked for the full node
						(back.ask || (back.ask = {}))[''] = back; // add a flag that we are now.
						if(u !== back.put){ // if we already have data,
							back.on('in', back); // send what is cached down the chain
							if(tmp){ return } // and don't ask for it again.
						}
						msg.$ = back.$;
					} else
					if(obj_has(back.put, get)){ // TODO: support #LEX !
						tmp = back.ask && back.ask[get];
						(back.ask || (back.ask = {}))[get] = back.$.get(get)._;
						back.on('in', {get: get, put: {'#': back.soul, '.': get, ':': back.put[get], '>': state_is(root.graph[back.soul], get)}});
						if(tmp){ return }
					}
						/*put = (back.$.get(get)._);
						if(!(tmp = put.ack)){ put.ack = -1 }
						back.on('in', {
							$: back.$,
							put: Gun.state.ify({}, get, Gun.state(back.put, get), back.put[get]),
							get: back.get
						});
						if(tmp){ return }
					} else
					if('string' != typeof get){
						var put = {}, meta = (back.put||{})._;
						Gun.obj.map(back.put, function(v,k){
							if(!Gun.text.match(k, get)){ return }
							put[k] = v;
						})
						if(!Gun.obj.empty(put)){
							put._ = meta;
							back.on('in', {$: back.$, put: put, get: back.get})
						}
						if(tmp = at.lex){
							tmp = (tmp._) || (tmp._ = function(){});
							if(back.ack < tmp.ask){ tmp.ask = back.ack }
							if(tmp.ask){ return }
							tmp.ask = 1;
						}
					}
					*/
					root.ask(ack, msg); // A3120 ?
					return root.on('in', msg);
				}
				//if(root.now){ root.now[at.id] = root.now[at.id] || true; at.pass = {} }
				if(get['.']){
					if(at.get){
						msg = {get: {'.': at.get}, $: at.$};
						(back.ask || (back.ask = {}))[at.get] = msg.$._; // TODO: PERFORMANCE? More elegant way?
						return back.on('out', msg);
					}
					msg = {get: at.lex? msg.get : {}, $: at.$};
					return back.on('out', msg);
				}
				(at.ask || (at.ask = {}))[''] = at;	 //at.ack = at.ack || -1;
				if(at.get){
					get['.'] = at.get;
					(back.ask || (back.ask = {}))[at.get] = msg.$._; // TODO: PERFORMANCE? More elegant way?
					return back.on('out', msg);
				}
			}
			return back.on('out', msg);
		}; Gun.on.out = output;

		function input(msg, cat){ cat = cat || this.as; // TODO: V8 may not be able to optimize functions with different parameter calls, so try to do benchmark to see if there is any actual difference.
			var root = cat.root, gun = msg.$ || (msg.$ = cat.$), at = (gun||'')._ || empty, tmp = msg.put||'', soul = tmp['#'], key = tmp['.'], change = (u !== tmp['='])? tmp['='] : tmp[':'], state = tmp['>'] || -Infinity, sat; // eve = event, at = data at, cat = chain at, sat = sub at (children chains).
			if(u !== msg.put && (u === tmp['#'] || u === tmp['.'] || (u === tmp[':'] && u === tmp['=']) || u === tmp['>'])){ // convert from old format
				if(!valid(tmp)){
					if(!(soul = ((tmp||'')._||'')['#'])){ console.log("chain not yet supported for", tmp, '...', msg, cat); return; }
					gun = sget(cat.root, soul);
					return setTimeout.each(Object.keys(tmp).sort(), function(k){ // TODO: .keys( is slow // BUG? ?Some re-in logic may depend on this being sync?
						if('_' == k || u === (state = state_is(tmp, k))){ return }
						cat.on('in', {$: gun, put: {'#': soul, '.': k, '=': tmp[k], '>': state}, VIA: msg});
					});
				}
				cat.on('in', {$: at.back.$, put: {'#': soul = at.back.soul, '.': key = at.has || at.get, '=': tmp, '>': state_is(at.back.put, key)}, via: msg}); // TODO: This could be buggy! It assumes/approxes data, other stuff could have corrupted it.
				return;
			}
			if((msg.seen||'')[cat.id]){ return } (msg.seen || (msg.seen = function(){}))[cat.id] = cat; // help stop some infinite loops

			if(cat !== at){ // don't worry about this when first understanding the code, it handles changing contexts on a message. A soul chain will never have a different context.
				Object.keys(msg).forEach(function(k){ tmp[k] = msg[k] }, tmp = {}); // make copy of message
				tmp.get = cat.get || tmp.get;
				if(!cat.soul && !cat.has){ // if we do not recognize the chain type
					tmp.$$$ = tmp.$$$ || cat.$; // make a reference to wherever it came from.
				} else
				if(at.soul){ // a has (property) chain will have a different context sometimes if it is linked (to a soul chain). Anything that is not a soul or has chain, will always have different contexts.
					tmp.$ = cat.$;
					tmp.$$ = tmp.$$ || at.$;
				}
				msg = tmp; // use the message with the new context instead;
			}
			unlink(msg, cat);

			if((((cat.soul)/* && (cat.ask||'')['']*/) || msg.$$) && state >= state_is(root.graph[soul], key)){ // The root has an in-memory cache of the graph, but if our peer has asked for the data then we want a per deduplicated chain copy of the data that might have local edits on it.
				(tmp = sget(root, soul)._).put = state_ify(tmp.put, key, state, change, soul);
			}
			if(!at.soul /*&& (at.ask||'')['']*/ && state >= state_is(root.graph[soul], key) && (sat = (sget(root, soul)._.next||'')[key])){ // Same as above here, but for other types of chains. // TODO: Improve perf by preventing echoes recaching.
				sat.put = change; // update cache
				if('string' == typeof (tmp = valid(change))){
					sat.put = sget(root, tmp)._.put || change; // share same cache as what we're linking to.
				}
			}

			this.to && this.to.next(msg); // 1st API job is to call all chain listeners.
			// TODO: Make input more reusable by only doing these (some?) calls if we are a chain we recognize? This means each input listener would be responsible for when listeners need to be called, which makes sense, as they might want to filter.
			cat.any && setTimeout.each(Object.keys(cat.any), function(any){ (any = cat.any[any]) && any(msg) },0,99); // 1st API job is to call all chain listeners. // TODO: .keys( is slow // BUG: Some re-in logic may depend on this being sync.
			cat.echo && setTimeout.each(Object.keys(cat.echo), function(lat){ (lat = cat.echo[lat]) && lat.on('in', msg) },0,99); // & linked at chains // TODO: .keys( is slow // BUG: Some re-in logic may depend on this being sync.

			if(((msg.$$||'')._||at).soul){ // comments are linear, but this line of code is non-linear, so if I were to comment what it does, you'd have to read 42 other comments first... but you can't read any of those comments until you first read this comment. What!? // shouldn't this match link's check?
				// is there cases where it is a $$ that we do NOT want to do the following? 
				if((sat = cat.next) && (sat = sat[key])){ // TODO: possible trick? Maybe have `ionmap` code set a sat? // TODO: Maybe we should do `cat.ask` instead? I guess does not matter.
					tmp = {}; Object.keys(msg).forEach(function(k){ tmp[k] = msg[k] });
					tmp.$ = (msg.$$||msg.$).get(tmp.get = key); delete tmp.$$; delete tmp.$$$;
					sat.on('in', tmp);
				}
			}

			link(msg, cat);
		}; Gun.on.in = input;

		function link(msg, cat){ cat = cat || this.as || msg.$._;
			if(msg.$$ && this !== Gun.on){ return } // $$ means we came from a link, so we are at the wrong level, thus ignore it unless overruled manually by being called directly.
			if(!msg.put || cat.soul){ return } // But you cannot overrule being linked to nothing, or trying to link a soul chain - that must never happen.
			var put = msg.put||'', link = put['=']||put[':'], tmp;
			var root = cat.root, tat = sget(root, put['#']).get(put['.'])._;
			if('string' != typeof (link = valid(link))){
				if(this === Gun.on){ (tat.echo || (tat.echo = {}))[cat.id] = cat } // allow some chain to explicitly force linking to simple data.
				return; // by default do not link to data that is not a link.
			}
			if((tat.echo || (tat.echo = {}))[cat.id] // we've already linked ourselves so we do not need to do it again. Except... (annoying implementation details)
				&& !(root.pass||'')[cat.id]){ return } // if a new event listener was added, we need to make a pass through for it. The pass will be on the chain, not always the chain passed down. 
			if(tmp = root.pass){ if(tmp[link+cat.id]){ return } tmp[link+cat.id] = 1 } // But the above edge case may "pass through" on a circular graph causing infinite passes, so we hackily add a temporary check for that.

			(tat.echo||(tat.echo={}))[cat.id] = cat; // set ourself up for the echo! // TODO: BUG? Echo to self no longer causes problems? Confirm.

			if(cat.has){ cat.link = link }
			var sat = sget(root, tat.link = link)._; // grab what we're linking to.
			(sat.echo || (sat.echo = {}))[tat.id] = tat; // link it.
			var tmp = cat.ask||''; // ask the chain for what needs to be loaded next!
			if(tmp[''] || cat.lex){ // we might need to load the whole thing // TODO: cat.lex probably has edge case bugs to it, need more test coverage.
				sat.on('out', {get: {'#': link}});
			}
			setTimeout.each(Object.keys(tmp), function(get, sat){ // if sub chains are asking for data. // TODO: .keys( is slow // BUG? ?Some re-in logic may depend on this being sync?
				if(!get || !(sat = tmp[get])){ return }
				sat.on('out', {get: {'#': link, '.': get}}); // go get it.
			},0,99);
		}; Gun.on.link = link;

		function unlink(msg, cat){ // ugh, so much code for seemingly edge case behavior.
			var put = msg.put||'', change = (u !== put['='])? put['='] : put[':'], root = cat.root, link, tmp;
			if(u === change){ // 1st edge case: If we have a brand new database, no data will be found.
				// TODO: BUG! because emptying cache could be async from below, make sure we are not emptying a newer cache. So maybe pass an Async ID to check against?
				// TODO: BUG! What if this is a map? // Warning! Clearing things out needs to be robust against sync/async ops, or else you'll see `map val get put` test catastrophically fail because map attempts to link when parent graph is streamed before child value gets set. Need to differentiate between lack acks and force clearing.
				if(cat.soul && u !== cat.put){ return } // data may not be found on a soul, but if a soul already has data, then nothing can clear the soul as a whole.
				//if(!cat.has){ return }
				tmp = (msg.$$||msg.$||'')._||'';
				if(msg['@'] && (u !== tmp.put || u !== cat.put)){ return } // a "not found" from other peers should not clear out data if we have already found it.
				//if(cat.has && u === cat.put && !(root.pass||'')[cat.id]){ return } // if we are already unlinked, do not call again, unless edge case. // TODO: BUG! This line should be deleted for "unlink deeply nested".
				if(link = cat.link || msg.linked){
					delete (sget(root, link)._.echo||'')[cat.id];
				}
				if(cat.has){ // TODO: Empty out links, maps, echos, acks/asks, etc.?
					cat.link = null;
				}
				cat.put = u; // empty out the cache if, for example, alice's car's color no longer exists (relative to alice) if alice no longer has a car.
				// TODO: BUG! For maps, proxy this so the individual sub is triggered, not all subs.
				setTimeout.each(Object.keys(cat.next||''), function(get, sat){ // empty out all sub chains. // TODO: .keys( is slow // BUG? ?Some re-in logic may depend on this being sync? // TODO: BUG? This will trigger deeper put first, does put logic depend on nested order? // TODO: BUG! For map, this needs to be the isolated child, not all of them.
					if(!(sat = cat.next[get])){ return }
					//if(cat.has && u === sat.put && !(root.pass||'')[sat.id]){ return } // if we are already unlinked, do not call again, unless edge case. // TODO: BUG! This line should be deleted for "unlink deeply nested".
					if(link){ delete (sget(root, link).get(get)._.echo||'')[sat.id] }
					sat.on('in', {get: get, put: u, $: sat.$}); // TODO: BUG? Add recursive seen check?
				},0,99);
				return;
			}
			if(cat.soul){ return } // a soul cannot unlink itself.
			if(msg.$$){ return } // a linked chain does not do the unlinking, the sub chain does. // TODO: BUG? Will this cancel maps?
			link = valid(change); // need to unlink anytime we are not the same link, though only do this once per unlink (and not on init).
			tmp = msg.$._||'';
			if(link === tmp.link || (cat.has && !tmp.link)){
				if((root.pass||'')[cat.id] && 'string' !== typeof link){

				} else {
					return;
				}
			}
			delete (tmp.echo||'')[cat.id];
			unlink({get: cat.get, put: u, $: msg.$, linked: msg.linked = msg.linked || tmp.link}, cat); // unlink our sub chains.
		}; Gun.on.unlink = unlink;

		function ack(msg, ev){
			//if(!msg['%'] && (this||'').off){ this.off() } // do NOT memory leak, turn off listeners! Now handled by .ask itself
			// manhattan:
			var as = this.as, at = as.$._, root = at.root, get = as.get||'', tmp = (msg.put||'')[get['#']]||'';
			if(!msg.put || ('string' == typeof get['.'] && u === tmp[get['.']])){
				if(u !== at.put){ return }
				if(!at.soul && !at.has){ return } // TODO: BUG? For now, only core-chains will handle not-founds, because bugs creep in if non-core chains are used as $ but we can revisit this later for more powerful extensions.
				at.ack = (at.ack || 0) + 1;
				at.on('in', {
					get: at.get,
					put: at.put = u,
					$: at.$,
					'@': msg['@']
				});
				/*(tmp = at.Q) && setTimeout.each(Object.keys(tmp), function(id){ // TODO: Temporary testing, not integrated or being used, probably delete.
					Object.keys(msg).forEach(function(k){ tmp[k] = msg[k] }, tmp = {}); tmp['@'] = id; // copy message
					root.on('in', tmp);
				}); delete at.Q;*/
				return;
			}
			(msg._||{}).miss = 1;
			Gun.on.put(msg);
			return; // eom
		}

		var empty = {}, u, text_rand = String.random, valid = Gun.valid, obj_has = function(o, k){ return o && Object.prototype.hasOwnProperty.call(o, k) }, state = Gun.state, state_is = state.is, state_ify = state.ify;
		function sget(root, soul){ root._sl = 1; var g = root.$.get(soul); root._sl = 0; return g }

		}());
	})(USE, './chain');

	;USE(function(module){
		var __root = USE('./root.js', 1);
		(function(){

		var Gun = __root;
		Gun.chain.get = function(key, cb, as){
			var gun, tmp;
			if(typeof key === 'string'){
				if(key.length == 0) {	
					(gun = this.chain())._.err = {err: Gun.log('0 length key!', key)};
					if(cb){ cb.call(gun, gun._.err) }
					return gun;
				}
				var back = this, cat = back._;
				var next = cat.next || empty;
				if(back === cat.root.$ && key.indexOf('/') >= 0 && !cat.root._sl && !cat.root.graph[key]){
					var parts = key.split('/'), i = 0, cur = back._, ok = 1;
					while(i < parts.length){
						if(!((cur.next||{})[parts[i]])){ ok = 0; break }
						cur = cur.next[parts[i++]].$._; 
					}
					if(ok){
						var nav = back; i = 0;
						while(i < parts.length){ nav = nav.get(parts[i++]) }
						return nav;
					}
				}
				if(!(gun = next[key])){
					gun = key && cache(key, back);
				}
				gun = gun && gun.$;
			} else
			if('function' == typeof key){
				if(true === cb){ return soul(this, key, cb, as), this }
				gun = this;
				var cat = gun._, opt = cb || {}, root = cat.root, id;
				opt.at = cat;
				opt.ok = key;
				var wait = {}; // can we assign this to the at instead, like in once?
				//var path = []; cat.$.back(at => { at.get && path.push(at.get.slice(0,9))}); path = path.reverse().join('.');
				function any(msg, eve, f){
					if(any.stun){ return }
					if((tmp = root.pass) && !tmp[id]){ return }
					var at = msg.$._, sat = (msg.$$||'')._, data = (sat||at).put, odd = (!at.has && !at.soul), test = {}, link, tmp;
					if(odd || u === data){ // handles non-core
						data = (u === ((tmp = msg.put)||'')['='])? (u === (tmp||'')[':'])? tmp : tmp[':'] : tmp['='];
					}
					if(link = ('string' == typeof (tmp = Gun.valid(data)))){
						data = (u === (tmp = root.$.get(tmp)._.put))? opt.not? u : data : tmp;
					}
					if(opt.not && u === data){ return }
					if(u === opt.stun){
						if((tmp = root.stun) && tmp.on){
							cat.$.back(function(a){ // our chain stunned?
								tmp.on(''+a.id, test = {});
								if((test.run || 0) < any.id){ return test } // if there is an earlier stun on gapless parents/self.
							});
							!test.run && tmp.on(''+at.id, test = {}); // this node stunned?
							!test.run && sat && tmp.on(''+sat.id, test = {}); // linked node stunned?
							if(any.id > test.run){
								if(!test.stun || test.stun.end){
									test.stun = tmp.on('stun');
									test.stun = test.stun && test.stun.last;
								}
								if(test.stun && !test.stun.end){
									//if(odd && u === data){ return }
									//if(u === msg.put){ return } // "not found" acks will be found if there is stun, so ignore these.
									(test.stun.add || (test.stun.add = {}))[id] = function(){ any(msg,eve,1) } // add ourself to the stun callback list that is called at end of the write.
									return;
								}
							}
						}
						if(/*odd &&*/ u === data){ f = 0 } // if data not found, keep waiting/trying.
						/*if(f && u === data){
							cat.on('out', opt.out);
							return;
						}*/
						if((tmp = root.hatch) && !tmp.end && u === opt.hatch && !f){ // quick hack! // What's going on here? Because data is streamed, we get things one by one, but a lot of developers would rather get a callback after each batch instead, so this does that by creating a wait list per chain id that is then called at the end of the batch by the hatch code in the root put listener.
							if(wait[at.$._.id]){ return } wait[at.$._.id] = 1;
							tmp.push(function(){any(msg,eve,1)});
							return;
						}; wait = {}; // end quick hack.
					}
					// call:
					if(root.pass){ if(root.pass[id+at.id]){ return } root.pass[id+at.id] = 1 }
					if(opt.on){ opt.ok.call(at.$, data, at.get, msg, eve || any); return } // TODO: Also consider breaking `this` since a lot of people do `=>` these days and `.call(` has slower performance.
					if(opt.v2020){ opt.ok(msg, eve || any); return }
					Object.keys(msg).forEach(function(k){ tmp[k] = msg[k] }, tmp = {}); msg = tmp; msg.put = data; // 2019 COMPATIBILITY! TODO: GET RID OF THIS!
					opt.ok.call(opt.as, msg, eve || any); // is this the right
				};
				any.at = cat;
				//(cat.any||(cat.any=function(msg){ setTimeout.each(Object.keys(cat.any||''), function(act){ (act = cat.any[act]) && act(msg) },0,99) }))[id = String.random(7)] = any; // maybe switch to this in future?
				(cat.any||(cat.any={}))[id = String.random(7)] = any;
				any.off = function(){ any.stun = 1; if(!cat.any){ return } delete cat.any[id] }
				any.rid = rid; // logic from old version, can we clean it up now?
				any.id = opt.run || ++root.once; // used in callback to check if we are earlier than a write. // will this ever cause an integer overflow?
				tmp = root.pass; (root.pass = {})[id] = 1; // Explanation: test trade-offs want to prevent recursion so we add/remove pass flag as it gets fulfilled to not repeat, however map map needs many pass flags - how do we reconcile?
				opt.out = opt.out || {get: {}};
				cat.on('out', opt.out);
				root.pass = tmp;
				return gun;
			} else
			if('number' == typeof key){
				return this.get(''+key, cb, as);
			} else
			if('string' == typeof (tmp = valid(key))){
				return this.get(tmp, cb, as);
			} else
			if(tmp = this.get.next){
				gun = tmp(this, key);
			}
			if(!gun){
				(gun = this.chain())._.err = {err: Gun.log('Invalid get request!', key)}; // CLEAN UP
				if(cb){ cb.call(gun, gun._.err) }
				return gun;
			}
			if(cb && 'function' == typeof cb){
				gun.get(cb, as);
			}
			return gun;
		}
		function cache(key, back){
			var cat = back._, next = cat.next, gun = back.chain(), at = gun._;
			if(!next){ next = cat.next = {} }
			next[at.get = key] = at;
			if(back === cat.root.$){
				at.soul = key;
				//at.put = {};
			} else
			if(cat.soul || cat.has){
				at.has = key;
				//if(obj_has(cat.put, key)){
					//at.put = cat.put[key];
				//}
			}
			return at;
		}
		function soul(gun, cb, opt, as){
			var cat = gun._, acks = 0, tmp;
			if(tmp = cat.soul || cat.link){ return cb(tmp, as, cat) }
			if(cat.jam){ return cat.jam.push([cb, as]) }
			cat.jam = [[cb,as]];
			gun.get(function go(msg, eve){
				if(u === msg.put && !cat.root.opt.super && (tmp = Object.keys(cat.root.opt.peers).length) && ++acks <= tmp){ // TODO: super should not be in core code, bring AXE up into core instead to fix? // TODO: .keys( is slow
					return;
				}
				eve.rid(msg);
				var at = ((at = msg.$) && at._) || {}, i = 0, as;
				tmp = cat.jam; delete cat.jam; // tmp = cat.jam.splice(0, 100);
				//if(tmp.length){ process.nextTick(function(){ go(msg, eve) }) }
				while(as = tmp[i++]){ //Gun.obj.map(tmp, function(as, cb){
					var cb = as[0], id; as = as[1];
					cb && cb(id = at.link || at.soul || Gun.valid(msg.put) || ((msg.put||{})._||{})['#'], as, msg, eve);
				} //);
			}, {out: {get: {'.':true}}});
			return gun;
		}
		function rid(at){
			var cat = this.at || this.on;
			if(!at || cat.soul || cat.has){ return this.off() }
			if(!(at = (at = (at = at.$ || at)._ || at).id)){ return }
			var map = cat.map, tmp, seen;
			//if(!map || !(tmp = map[at]) || !(tmp = tmp.at)){ return }
			if(tmp = (seen = this.seen || (this.seen = {}))[at]){ return true }
			seen[at] = true;
			//tmp.echo[cat.id] = {}; // TODO: Warning: This unsubscribes ALL of this chain's listeners from this link, not just the one callback event.
			//obj.del(map, at); // TODO: Warning: This unsubscribes ALL of this chain's listeners from this link, not just the one callback event.
			return;
		}
		var empty = {}, valid = Gun.valid, u;

		}());
	})(USE, './get');

	;USE(function(module){
		var __root = USE('./root.js', 1);
		(function(){

		var Gun = __root;
		Gun.chain.put = function(data, cb, as){ // I rewrote it :)
			var gun = this, at = gun._, root = at.root;
			as = as || {};
			as.root = at.root;
			as.run || (as.run = root.once);
			stun(as, at.id); // set a flag for reads to check if this chain is writing.
			as.ack = as.ack || cb;
			as.via = as.via || gun;
			as.data = as.data || data;
			as.soul || (as.soul = at.soul || ('string' == typeof cb && cb));
			var s = as.state = as.state || Gun.state();
			if('function' == typeof data){ data(function(d){ as.data = d; gun.put(u,u,as) }); return gun }
			if(!as.soul){ return get(as), gun }
			as.$ = root.$.get(as.soul); // TODO: This may not allow user chaining and similar?
			as.todo = [{it: as.data, ref: as.$}];
			as.turn = as.turn || turn;
			as.ran = as.ran || ran;
			//var path = []; as.via.back(at => { at.get && path.push(at.get.slice(0,9)) }); path = path.reverse().join('.');
			// TODO: Perf! We only need to stun chains that are being modified, not necessarily written to.
			(function walk(){
				var to = as.todo, at = to.pop(), d = at.it, cid = at.ref && at.ref._.id, v, k, cat, tmp, g;
				stun(as, at.ref);
				if(tmp = at.todo){
					k = tmp.pop(); d = d[k];
					if(tmp.length){ to.push(at) }
				}
				k && (to.path || (to.path = [])).push(k);
				if(!(v = valid(d)) && !(g = Gun.is(d))){
					if(!Object.plain(d)){ ran.err(as, "Invalid data: "+ check(d) +" at " + (as.via.back(function(at){at.get && tmp.push(at.get)}, tmp = []) || tmp.join('.'))+'.'+(to.path||[]).join('.')); return }
					var seen = as.seen || (as.seen = []), i = seen.length;
					while(i--){ if(d === (tmp = seen[i]).it){ v = d = tmp.link; break } }
				}
				if(k && v){ at.node = state_ify(at.node, k, s, d) } // handle soul later.
				else {
					if(!as.seen){ ran.err(as, "Data at root of graph must be a node (an object)."); return }
					as.seen.push(cat = {it: d, link: {}, todo: g? [] : Object.keys(d).sort().reverse(), path: (to.path||[]).slice(), up: at}); // Any perf reasons to CPU schedule this .keys( ?
					at.node = state_ify(at.node, k, s, cat.link);
					!g && cat.todo.length && to.push(cat);
					// ---------------
					var id = as.seen.length;
					(as.wait || (as.wait = {}))[id] = '';
					tmp = (cat.ref = (g? d : k? at.ref.get(k) : at.ref))._;
					(tmp = (d && (d._||'')['#']) || tmp.soul || tmp.link)? resolve({soul: tmp}) : cat.ref.get(resolve, {run: as.run, /*hatch: 0,*/ v2020:1, out:{get:{'.':' '}}}); // TODO: BUG! This should be resolve ONLY soul to prevent full data from being loaded. // Fixed now?
					//setTimeout(function(){ if(F){ return } console.log("I HAVE NOT BEEN CALLED!", path, id, cat.ref._.id, k) }, 9000); var F; // MAKE SURE TO ADD F = 1 below!
					function resolve(msg, eve){
						var end = cat.link['#'];
						if(eve){ eve.off(); eve.rid(msg) } // TODO: Too early! Check all peers ack not found.
						// TODO: BUG maybe? Make sure this does not pick up a link change wipe, that it uses the changign link instead.
						var soul = end || msg.soul || (tmp = (msg.$$||msg.$)._||'').soul || tmp.link || ((tmp = tmp.put||'')._||'')['#'] || tmp['#'] || (((tmp = msg.put||'') && msg.$$)? tmp['#'] : (tmp['=']||tmp[':']||'')['#']);
						!end && stun(as, msg.$);
						if(!soul && !at.link['#']){ // check soul link above us
							(at.wait || (at.wait = [])).push(function(){ resolve(msg, eve) }) // wait
							return;
						}
						if(!soul){
							soul = [];
							(msg.$$||msg.$).back(function(at){
								if(tmp = at.soul || at.link){ return soul.push(tmp) }
								soul.push(at.get);
							});
							soul = soul.reverse().join('/');
						}
						cat.link['#'] = soul;
						!g && (((as.graph || (as.graph = {}))[soul] = (cat.node || (cat.node = {_:{}})))._['#'] = soul);
						delete as.wait[id];
						cat.wait && setTimeout.each(cat.wait, function(cb){ cb && cb() });
						as.ran(as);
					};
					// ---------------
				}
				if(!to.length){ return as.ran(as) }
				as.turn(walk);
			}());
			return gun;
		}

		function stun(as, id){
			if(!id){ return } id = (id._||'').id||id;
			var run = as.root.stun || (as.root.stun = {on: Gun.on}), test = {}, tmp;
			as.stun || (as.stun = run.on('stun', function(){ }));
			if(tmp = run.on(''+id)){ tmp.the.last.next(test) }
			if(test.run >= as.run){ return }
			run.on(''+id, function(test){
				if(as.stun.end){
					this.off();
					this.to.next(test);
					return;
				}
				test.run = test.run || as.run;
				test.stun = test.stun || as.stun; return;
				if(this.to.to){
					this.the.last.next(test);
					return;
				}
				test.stun = as.stun;
			});
		}

		function ran(as){
			if(as.err){ ran.end(as.stun, as.root); return } // move log handle here.
			if(as.todo.length || as.end || !Object.empty(as.wait)){ return } as.end = 1;
			//(as.retry = function(){ as.acks = 0;
			var cat = (as.$.back(-1)._), root = cat.root, ask = cat.ask(function(ack){
				root.on('ack', ack);
				if(ack.err && !ack.lack){ Gun.log(ack) }
				if(++acks > (as.acks || 0)){ this.off() } // Adjustable ACKs! Only 1 by default.
				if(!as.ack){ return }
				as.ack(ack, this);
			}, as.opt), acks = 0, stun = as.stun, tmp;
			(tmp = function(){ // this is not official yet, but quick solution to hack in for now.
				if(!stun){ return }
				ran.end(stun, root);
				setTimeout.each(Object.keys(stun = stun.add||''), function(cb){ if(cb = stun[cb]){cb()} }); // resume the stunned reads // Any perf reasons to CPU schedule this .keys( ?
			}).hatch = tmp; // this is not official yet ^
			//console.log(1, "PUT", as.run, as.graph);
			if(as.ack && !as.ok){ as.ok = as.acks || 9 } // TODO: In future! Remove this! This is just old API support.
			(as.via._).on('out', {put: as.out = as.graph, ok: as.ok && {'@': as.ok+1}, opt: as.opt, '#': ask, _: tmp});
			//})();
		}; ran.end = function(stun,root){
			stun.end = noop; // like with the earlier id, cheaper to make this flag a function so below callbacks do not have to do an extra type check.
			if(stun.the.to === stun && stun === stun.the.last){ delete root.stun }
			stun.off();
		}; ran.err = function(as, err){
			(as.ack||noop).call(as, as.out = { err: as.err = Gun.log(err) });
			as.ran(as);
		}

		function get(as){
			var at = as.via._, tmp;
			as.via = as.via.back(function(at){
				if(at.soul || !at.get){ return at.$ }
				tmp = as.data; (as.data = {})[at.get] = tmp;
			});
			if(!as.via || !as.via._.soul){
				as.via = at.root.$.get(((as.data||'')._||'')['#'] || at.$.back('opt.uuid')())
			}
			as.via.put(as.data, as.ack, as);


			return;
			if(at.get && at.back.soul){
				tmp = as.data;
				as.via = at.back.$;
				(as.data = {})[at.get] = tmp; 
				as.via.put(as.data, as.ack, as);
				return;
			}
		}
		function check(d, tmp){ return ((d && (tmp = d.constructor) && tmp.name) || typeof d) }

		var u, empty = {}, noop = function(){}, turn = setTimeout.turn, valid = Gun.valid, state_ify = Gun.state.ify;
		var iife = function(fn,as){fn.call(as||empty)}

		}());
	})(USE, './put');

	;USE(function(module){
		USE('./chain.js', 1);
		USE('./back.js', 1);
		USE('./put.js', 1);
		USE('./get.js', 1);
		var __root = USE('./root.js', 1);

		let __defaultExport;
		(function(){
		  var Gun = __root;
		  __defaultExport = Gun;
		}());
		module.exports = __defaultExport;
	})(USE, './core');

	;USE(function(module){
		USE('./shim.js', 1);
		USE('./onto.js', 1);
		USE('./book.js', 1);
		USE('./valid.js', 1);
		USE('./state.js', 1);
		USE('./dup.js', 1);
		USE('./ask.js', 1);
		USE('./core.js', 1);
		USE('./on.js', 1);
		USE('./map.js', 1);
		USE('./set.js', 1);
		USE('./mesh.js', 1);
		USE('./websocket.js', 1);
		USE('./localStorage.js', 1);
		var __root = USE('./root.js', 1);

		let __defaultExport;
		(function(){
		  var Gun = __root;
		  __defaultExport = Gun;
		}());
		module.exports = __defaultExport;
	})(USE, './index');

	;USE(function(module){
		var __root = USE('./root.js', 1);
		(function(){

		var Gun = __root;
		Gun.chain.on = function(tag, arg, eas, as){ // don't rewrite!
			var gun = this, cat = gun._, root = cat.root, act, off, id, tmp;
			if(typeof tag === 'string'){
				if(!arg){ return cat.on(tag) }
				act = cat.on(tag, arg, eas || cat, as);
				if(eas && eas.$){
					(eas.subs || (eas.subs = [])).push(act);
				}
				return gun;
			}
			var opt = arg;
			(opt = (true === opt)? {change: true} : opt || {}).not = 1; opt.on = 1;
			//opt.at = cat;
			//opt.ok = tag;
			//opt.last = {};
			var wait = {}; // can we assign this to the at instead, like in once?
			gun.get(tag, opt);
			/*gun.get(function on(data,key,msg,eve){ var $ = this;
				if(tmp = root.hatch){ // quick hack!
					if(wait[$._.id]){ return } wait[$._.id] = 1;
					tmp.push(function(){on.call($, data,key,msg,eve)});
					return;
				}; wait = {}; // end quick hack.
				tag.call($, data,key,msg,eve);
			}, opt); // TODO: PERF! Event listener leak!!!?*/
			/*
			function one(msg, eve){
				if(one.stun){ return }
				var at = msg.$._, data = at.put, tmp;
				if(tmp = at.link){ data = root.$.get(tmp)._.put }
				if(opt.not===u && u === data){ return }
				if(opt.stun===u && (tmp = root.stun) && (tmp = tmp[at.id] || tmp[at.back.id]) && !tmp.end){ // Remember! If you port this into `.get(cb` make sure you allow stun:0 skip option for `.put(`.
					tmp[id] = function(){one(msg,eve)};
					return;
				}
				//tmp = one.wait || (one.wait = {}); console.log(tmp[at.id] === ''); if(tmp[at.id] !== ''){ tmp[at.id] = tmp[at.id] || setTimeout(function(){tmp[at.id]='';one(msg,eve)},1); return } delete tmp[at.id];
				// call:
				if(opt.as){
					opt.ok.call(opt.as, msg, eve || one);
				} else {
					opt.ok.call(at.$, data, msg.get || at.get, msg, eve || one);
				}
			};
			one.at = cat;
			(cat.act||(cat.act={}))[id = String.random(7)] = one;
			one.off = function(){ one.stun = 1; if(!cat.act){ return } delete cat.act[id] }
			cat.on('out', {get: {}});*/
			return gun;
		}
		// Rules:
		// 1. If cached, should be fast, but not read while write.
		// 2. Should not retrigger other listeners, should get triggered even if nothing found.
		// 3. If the same callback passed to many different once chains, each should resolve - an unsubscribe from the same callback should not effect the state of the other resolving chains, if you do want to cancel them all early you should mutate the callback itself with a flag & check for it at top of callback
		Gun.chain.once = function(cb, opt){ opt = opt || {}; // avoid rewriting
			if(!cb){ return none(this,opt) }
			var gun = this, cat = gun._, root = cat.root, data = cat.put, id = String.random(7), one, tmp;
			gun.get(function(data,key,msg,eve){
				var $ = this, at = $._, one = (at.one||(at.one={}));
				if(eve.stun){ return } if('' === one[id]){ return }
				if(true === (tmp = Gun.valid(data))){ once(); return }
				if('string' == typeof tmp){ return }
				clearTimeout((cat.one||'')[id]); // clear "not found" since they only get set on cat.
				clearTimeout(one[id]); one[id] = setTimeout(once, opt.wait||99); // TODO: Bug? This doesn't handle plural chains.
				function once(f){
					if(!at.has && !at.soul){ at = {put: data, get: key} } // handles non-core messages.
					if(u === (tmp = at.put)){ tmp = ((msg.$$||'')._||'').put }
					if('string' == typeof Gun.valid(tmp)){
						tmp = root.$.get(tmp)._.put;
						if(tmp === u && !f){
							one[id] = setTimeout(function(){ once(1) }, opt.wait||99); // TODO: Quick fix. Maybe use ack count for more predictable control?
							return
						}
					}
					//console.log("AND VANISHED", data);
					if(eve.stun){ return } if('' === one[id]){ return } one[id] = '';
					if(cat.soul || cat.has){ eve.off() } // TODO: Plural chains? // else { ?.off() } // better than one check?
					cb.call($, tmp, at.get);
					clearTimeout(one[id]); // clear "not found" since they only get set on cat. // TODO: This was hackily added, is it necessary or important? Probably not, in future try removing this. Was added just as a safety for the `&& !f` check.
				};
			}, {on: 1});
			return gun;
		}
		function none(gun,opt,chain){
			Gun.log.once("valonce", "Chainable val is experimental, its behavior and API may change moving forward. Please play with it and report bugs and ideas on how to improve it.");
			(chain = gun.chain())._.nix = gun.once(function(data, key){ chain._.on('in', this._) });
			chain._.lex = gun._.lex; // TODO: Better approach in future? This is quick for now.
			return chain;
		}

		Gun.chain.off = function(){
			// make off more aggressive. Warning, it might backfire!
			var gun = this, at = gun._, tmp;
			var cat = at.back;
			if(!cat){ return }
			at.ack = 0; // so can resubscribe.
			if(tmp = cat.next){
				if(tmp[at.get]){
					delete tmp[at.get];
				} else {

				}
			}
			// TODO: delete cat.one[map.id]?
			if (tmp = cat.any) {
				delete cat.any;
				cat.any = {};
			}
			if(tmp = cat.ask){
				delete tmp[at.get];
			}
			if(tmp = cat.put){
				delete tmp[at.get];
			}
			if(tmp = at.soul){
				delete cat.root.graph[tmp];
			}
			if(tmp = at.map){
				Object.keys(tmp).forEach(function(i,at){ at = tmp[i]; //obj_map(tmp, function(at){
					if(at.link){
						cat.root.$.get(at.link).off();
					}
				});
			}
			if(tmp = at.next){
				Object.keys(tmp).forEach(function(i,neat){ neat = tmp[i]; //obj_map(tmp, function(neat){
					neat.$.off();
				});
			}
			at.on('off', {});
			return gun;
		}
		var empty = {}, noop = function(){}, u;

		}());
	})(USE, './on');

	;USE(function(module){
		var __root = USE('./root.js', 1);
		(function(){

		var Gun = __root, next = Gun.chain.get.next;
		Gun.chain.get.next = function(gun, lex){ var tmp;
			if(!Object.plain(lex)){ return (next||noop)(gun, lex) }
			if(tmp = ((tmp = lex['#'])||'')['='] || tmp){ return gun.get(tmp) }
			(tmp = gun.chain()._).lex = lex; // LEX!
			gun.on('in', function(eve){
				if(String.match(eve.get|| (eve.put||'')['.'], lex['.'] || lex['#'] || lex)){
					tmp.on('in', eve);
				}
				this.to.next(eve);
			});
			return tmp.$;
		}
		Gun.chain.map = function(cb, opt, t){
			var gun = this, cat = gun._, lex, chain;
			if(Object.plain(cb)){ lex = cb['.']? cb : {'.': cb}; cb = u }
			if(!cb){
				if(chain = cat.each){ return chain }
				(cat.each = chain = gun.chain())._.lex = lex || chain._.lex || cat.lex;
				chain._.nix = gun.back('nix');
				gun.on('in', map, chain._);
				return chain;
			}
			Gun.log.once("mapfn", "Map functions are experimental, their behavior and API may change moving forward. Please play with it and report bugs and ideas on how to improve it.");
			chain = gun.chain();
			gun.map().on(function(data, key, msg, eve){
				var next = (cb||noop).call(this, data, key, msg, eve);
				if(u === next){ return }
				if(data === next){ return chain._.on('in', msg) }
				if(Gun.is(next)){ return chain._.on('in', next._) }
				var tmp = {}; Object.keys(msg.put).forEach(function(k){ tmp[k] = msg.put[k] }, tmp); tmp['='] = next; 
				chain._.on('in', {get: key, put: tmp});
			});
			return chain;
		}
		function map(msg){ this.to.next(msg);
			var cat = this.as, gun = msg.$, at = gun._, put = msg.put, tmp;
			if(!at.soul && !msg.$$){ return } // this line took hundreds of tries to figure out. It only works if core checks to filter out above chains during link tho. This says "only bother to map on a node" for this layer of the chain. If something is not a node, map should not work.
			if((tmp = cat.lex) && !String.match(msg.get|| (put||'')['.'], tmp['.'] || tmp['#'] || tmp)){ return }
			Gun.on.link(msg, cat);
		}
		var noop = function(){}, event = {stun: noop, off: noop}, u;

		}());
	})(USE, './map');

	;USE(function(module){
		var __root = USE('./root.js', 1);
		(function(){

		var Gun = __root;
		Gun.chain.set = function(item, cb, opt){
			var gun = this, root = gun.back(-1), soul, tmp;
			cb = cb || function(){};
			opt = opt || {}; opt.item = opt.item || item;
			if(soul = ((item||'')._||'')['#']){ (item = {})['#'] = soul } // check if node, make link.
			if('string' == typeof (tmp = Gun.valid(item))){ return gun.get(soul = tmp).put(item, cb, opt) } // check if link
			if(!Gun.is(item)){
				if(Object.plain(item)){
					item = root.get(soul = gun.back('opt.uuid')()).put(item);
				}
				return gun.get(soul || root.back('opt.uuid')(7)).put(item, cb, opt);
			}
			gun.put(function(go){
				item.get(function(soul, o, msg){ // TODO: BUG! We no longer have this option? & go error not handled?
					if(!soul){ return cb.call(gun, {err: Gun.log('Only a node can be linked! Not "' + msg.put + '"!')}) }
					(tmp = {})[soul] = {'#': soul}; go(tmp);
				},true);
			})
			return item;
		}

		}());
	})(USE, './set');

	;USE(function(module){
		USE('./shim.js', 1);

		let __defaultExport;
		(function(){
		    var noop = function(){}
		    var parse = JSON.parseAsync || function(t,cb,r){ var u, d = +new Date; try{ cb(u, JSON.parse(t,r), json.sucks(+new Date - d)) }catch(e){ cb(e) } }
		    var json = JSON.stringifyAsync || function(v,cb,r,s){ var u, d = +new Date; try{ cb(u, JSON.stringify(v,r,s), json.sucks(+new Date - d)) }catch(e){ cb(e) } }
		    json.sucks = function(d){ if(d > 99){ console.log("Warning: JSON blocking CPU detected. Add `gun/lib/yson.js` to fix."); json.sucks = noop } }

		    function Mesh(root){
		        var mesh = function(){};
		        var opt = root.opt || {};
		        opt.log = opt.log || console.log;
		        opt.gap = opt.gap || opt.wait || 0;
		        opt.max = opt.max || (opt.memory? (opt.memory * 999 * 999) : 300000000) * 0.3;
		        opt.pack = opt.pack || (opt.max * 0.01 * 0.01);
		        opt.puff = opt.puff || 9; // IDEA: do a start/end benchmark, divide ops/result.
		        var puff = setTimeout.turn || setTimeout;

		        var dup = root.dup, dup_check = dup.check, dup_track = dup.track;

		        var ST = +new Date, LT = ST;

		        var hear = mesh.hear = function(raw, peer){
		            if(!raw){ return }
		            if(opt.max <= raw.length){ return mesh.say({dam: '!', err: "Message too big!"}, peer) }
		            if(mesh === this){
		                /*if('string' == typeof raw){ try{
		                    var stat = console.STAT || {};
		                    //console.log('HEAR:', peer.id, (raw||'').slice(0,250), ((raw||'').length / 1024 / 1024).toFixed(4));

		                    //console.log(setTimeout.turn.s.length, 'stacks', parseFloat((-(LT - (LT = +new Date))/1000).toFixed(3)), 'sec', parseFloat(((LT-ST)/1000 / 60).toFixed(1)), 'up', stat.peers||0, 'peers', stat.has||0, 'has', stat.memhused||0, stat.memused||0, stat.memax||0, 'heap mem max');
		                }catch(e){ console.log('DBG err', e) }}*/
		                hear.d += raw.length||0 ; ++hear.c } // STATS!
		            var S = peer.SH = +new Date;
		            var tmp = raw[0], msg;
		            //raw && raw.slice && console.log("hear:", ((peer.wire||'').headers||'').origin, raw.length, raw.slice && raw.slice(0,50)); //tc-iamunique-tc-package-ds1
		            if('[' === tmp){
		                parse(raw, function(err, msg){
		                    if(err || !msg){ return mesh.say({dam: '!', err: "DAM JSON parse error."}, peer) }
		                    console.STAT && console.STAT(+new Date, msg.length, '# on hear batch');
		                    var P = opt.puff;
		                    (function go(){
		                        var S = +new Date;
		                        var i = 0, m; while(i < P && (m = msg[i++])){ mesh.hear(m, peer) }
		                        msg = msg.slice(i); // slicing after is faster than shifting during.
		                        console.STAT && console.STAT(S, +new Date - S, 'hear loop');
		                        flush(peer); // force send all synchronously batched acks.
		                        if(!msg.length){ return }
		                        puff(go, 0);
		                    }());
		                });
		                raw = ''; // 
		                return;
		            }
		            if('{' === tmp || ((raw['#'] || Object.plain(raw)) && (msg = raw))){
		                if(msg){ return hear.one(msg, peer, S) }
		                parse(raw, function(err, msg){
		                    if(err || !msg){ return mesh.say({dam: '!', err: "DAM JSON parse error."}, peer) }
		                    hear.one(msg, peer, S);
		                });
		                return;
		            }
		        }
		        hear.one = function(msg, peer, S){ // S here is temporary! Undo.
		            var id, hash, tmp, ash, DBG;
		            if(msg.DBG){ msg.DBG = DBG = {DBG: msg.DBG} }
		            DBG && (DBG.h = S);
		            DBG && (DBG.hp = +new Date);
		            if(!(id = msg['#'])){ id = msg['#'] = String.random(9) }
		            if(tmp = dup_check(id)){ return }
		            // DAM logic:
		            if(!(hash = msg['##']) && false && u !== msg.put){ /*hash = msg['##'] = Type.obj.hash(msg.put)*/ } // disable hashing for now // TODO: impose warning/penalty instead (?)
		            if(hash && (tmp = msg['@'] || (msg.get && id)) && dup.check(ash = tmp+hash)){ return } // Imagine A <-> B <=> (C & D), C & D reply with same ACK but have different IDs, B can use hash to dedup. Or if a GET has a hash already, we shouldn't ACK if same.
		            (msg._ = function(){}).via = mesh.leap = peer;
		            if((tmp = msg['><']) && 'string' == typeof tmp){ tmp.slice(0,99).split(',').forEach(function(k){ this[k] = 1 }, (msg._).yo = {}) } // Peers already sent to, do not resend.
		            // DAM ^
		            if(tmp = msg.dam){
		                (dup_track(id)||{}).via = peer;
		                if(tmp = mesh.hear[tmp]){
		                    tmp(msg, peer, root);
		                }
		                return;
		            }
		            if(tmp = msg.ok){ msg._.near = tmp['/'] }
		            var S = +new Date;
		            DBG && (DBG.is = S); peer.SI = id;
		            dup_track.ed = function(d){
		                if(id !== d){ return }
		                dup_track.ed = 0;
		                if(!(d = dup.s[id])){ return }
		                d.via = peer;
		                if(msg.get){ d.it = msg }
		            }
		            root.on('in', mesh.last = msg);
		            DBG && (DBG.hd = +new Date);
		            console.STAT && console.STAT(S, +new Date - S, msg.get? 'msg get' : msg.put? 'msg put' : 'msg');
		            dup_track(id); // in case 'in' does not call track.
		            if(ash){ dup_track(ash) } //dup.track(tmp+hash, true).it = it(msg);
		            mesh.leap = mesh.last = null; // warning! mesh.leap could be buggy.
		        }
		        var tomap = function(k,i,m){m(k,true)};
		        hear.c = hear.d = 0;

		        ;(function(){
		            var SMIA = 0;
		            var loop;
		            mesh.hash = function(msg, peer){ var h, s, t;
		                var S = +new Date;
		                json(msg.put, function hash(err, text){
		                    var ss = (s || (s = t = text||'')).slice(0, 32768); // 1024 * 32
		                  h = String.hash(ss, h); s = s.slice(32768);
		                  if(s){ puff(hash, 0); return }
		                    console.STAT && console.STAT(S, +new Date - S, 'say json+hash');
		                  msg._.$put = t;
		                  msg['##'] = h;
		                  mesh.say(msg, peer);
		                  delete msg._.$put;
		                }, sort);
		            }
		            function sort(k, v){ var tmp;
		                if(!(v instanceof Object)){ return v }
		                Object.keys(v).sort().forEach(sorta, {to: tmp = {}, on: v});
		                return tmp;
		            } function sorta(k){ this.to[k] = this.on[k] }

		            var say = mesh.say = function(msg, peer){ var tmp;
		                if((tmp = this) && (tmp = tmp.to) && tmp.next){ tmp.next(msg) } // compatible with middleware adapters.
		                if(!msg){ return false }
		                var id, hash, raw, ack = msg['@'];
		    //if(opt.super && (!ack || !msg.put)){ return } // TODO: MANHATTAN STUB //OBVIOUSLY BUG! But squelch relay. // :( get only is 100%+ CPU usage :(
		                var meta = msg._||(msg._=function(){});
		                var DBG = msg.DBG, S = +new Date; meta.y = meta.y || S; if(!peer){ DBG && (DBG.y = S) }
		                if(!(id = msg['#'])){ id = msg['#'] = String.random(9) }
		                !loop && dup_track(id);//.it = it(msg); // track for 9 seconds, default. Earth<->Mars would need more! // always track, maybe move this to the 'after' logic if we split function.
		                //if(msg.put && (msg.err || (dup.s[id]||'').err)){ return false } // TODO: in theory we should not be able to stun a message, but for now going to check if it can help network performance preventing invalid data to relay.
		                if(!(hash = msg['##']) && u !== msg.put && !meta.via && ack){ mesh.hash(msg, peer); return } // TODO: Should broadcasts be hashed?
		                if(!peer && ack){ peer = ((tmp = dup.s[ack]) && (tmp.via || ((tmp = tmp.it) && (tmp = tmp._) && tmp.via))) || ((tmp = mesh.last) && ack === tmp['#'] && mesh.leap) } // warning! mesh.leap could be buggy! mesh last check reduces this. // TODO: CLEAN UP THIS LINE NOW? `.it` should be reliable.
		                if(!peer && ack){ // still no peer, then ack daisy chain 'tunnel' got lost.
		                    if(dup.s[ack]){ return } // in dups but no peer hints that this was ack to ourself, ignore.
		                    console.STAT && console.STAT(+new Date, ++SMIA, 'total no peer to ack to'); // TODO: Delete this now. Dropping lost ACKs is protocol fine now.
		                    return false;
		                } // TODO: Temporary? If ack via trace has been lost, acks will go to all peers, which trashes browser bandwidth. Not relaying the ack will force sender to ask for ack again. Note, this is technically wrong for mesh behavior.
		                if(ack && !msg.put && !hash && ((dup.s[ack]||'').it||'')['##']){ return false } // If we're saying 'not found' but a relay had data, do not bother sending our not found. // Is this correct, return false? // NOTE: ADD PANIC TEST FOR THIS!
		                if(!peer && mesh.way){ return mesh.way(msg) }
		                DBG && (DBG.yh = +new Date);
		                if(!(raw = meta.raw)){ mesh.raw(msg, peer); return }
		                DBG && (DBG.yr = +new Date);
		                if(!peer || !peer.id){
		                    if(!Object.plain(peer || opt.peers)){ return false }
		                    var S = +new Date;
		                    var P = opt.puff, ps = opt.peers, pl = Object.keys(peer || opt.peers || {}); // TODO: .keys( is slow
		                    console.STAT && console.STAT(S, +new Date - S, 'peer keys');
		                    ;(function go(){
		                        var S = +new Date;
		                        //Type.obj.map(peer || opt.peers, each); // in case peer is a peer list.
		                        loop = 1; var wr = meta.raw; meta.raw = raw; // quick perf hack
		                        var i = 0, p; while(i < 9 && (p = (pl||'')[i++])){
		                            if(!(p = ps[p] || (peer||'')[p])){ continue }
		                            mesh.say(msg, p);
		                        }
		                        meta.raw = wr; loop = 0;
		                        pl = pl.slice(i); // slicing after is faster than shifting during.
		                        console.STAT && console.STAT(S, +new Date - S, 'say loop');
		                        if(!pl.length){ return }
		                        puff(go, 0);
		                        ack && dup_track(ack); // keep for later
		                    }());
		                    return;
		                }
		                // TODO: PERF: consider splitting function here, so say loops do less work.
		                if(!peer.wire && mesh.wire){ mesh.wire(peer) }
		                if(id === peer.last){ return } peer.last = id;  // was it just sent?
		                if(peer === meta.via){ return false } // don't send back to self.
		                if((tmp = meta.yo) && (tmp[peer.url] || tmp[peer.pid] || tmp[peer.id]) /*&& !o*/){ return false }
		                console.STAT && console.STAT(S, ((DBG||meta).yp = +new Date) - (meta.y || S), 'say prep');
		                !loop && ack && dup_track(ack); // streaming long responses needs to keep alive the ack.
		                if(peer.batch){
		                    peer.tail = (tmp = peer.tail || 0) + raw.length;
		                    if(peer.tail <= opt.pack){
		                        peer.batch += (tmp?',':'')+raw;
		                        return;
		                    }
		                    flush(peer);
		                }
		                peer.batch = '['; // Prevents double JSON!
		                var ST = +new Date;
		                setTimeout(function(){
		                    console.STAT && console.STAT(ST, +new Date - ST, '0ms TO');
		                    flush(peer);
		                }, opt.gap); // TODO: queuing/batching might be bad for low-latency video game performance! Allow opt out?
		                send(raw, peer);
		                console.STAT && (ack === peer.SI) && console.STAT(S, +new Date - peer.SH, 'say ack');
		            }
		            mesh.say.c = mesh.say.d = 0;
		            // TODO: this caused a out-of-memory crash!
		            mesh.raw = function(msg, peer){ // TODO: Clean this up / delete it / move logic out!
		                if(!msg){ return '' }
		                var meta = (msg._) || {}, put, tmp;
		                if(tmp = meta.raw){ return tmp }
		                if('string' == typeof msg){ return msg }
		                var hash = msg['##'], ack = msg['@'];
		                if(hash && ack){
		                    if(!meta.via && dup_check(ack+hash)){ return false } // for our own out messages, memory & storage may ack the same thing, so dedup that. Tho if via another peer, we already tracked it upon hearing, so this will always trigger false positives, so don't do that!
		                    if(tmp = (dup.s[ack]||'').it){
		                        if(hash === tmp['##']){ return false } // if ask has a matching hash, acking is optional.
		                        if(!tmp['##']){ tmp['##'] = hash } // if none, add our hash to ask so anyone we relay to can dedup. // NOTE: May only check against 1st ack chunk, 2nd+ won't know and still stream back to relaying peers which may then dedup. Any way to fix this wasted bandwidth? I guess force rate limiting breaking change, that asking peer has to ask for next lexical chunk.
		                    }
		                }
		                if(!msg.dam && !msg['@']){
		                    var i = 0, to = []; tmp = opt.peers;
		                    for(var k in tmp){ var p = tmp[k]; // TODO: Make it up peers instead!
		                        to.push(p.url || p.pid || p.id);
		                        if(++i > 6){ break }
		                    }
		                    if(i > 1){ msg['><'] = to.join() } // TODO: BUG! This gets set regardless of peers sent to! Detect?
		                }
		                if(msg.put && (tmp = msg.ok)){ msg.ok = {'@':(tmp['@']||1)-1, '/': (tmp['/']==msg._.near)? mesh.near : tmp['/']}; }
		                if(put = meta.$put){
		                    tmp = {}; Object.keys(msg).forEach(function(k){ tmp[k] = msg[k] });
		                    tmp.put = ':])([:';
		                    json(tmp, function(err, raw){
		                        if(err){ return } // TODO: Handle!!
		                        var S = +new Date;
		                        tmp = raw.indexOf('"put":":])([:"');
		                        res(u, raw = raw.slice(0, tmp+6) + put + raw.slice(tmp + 14));
		                        console.STAT && console.STAT(S, +new Date - S, 'say slice');
		                    });
		                    return;
		                }
		                json(msg, res);
		                function res(err, raw){
		                    if(err){ return } // TODO: Handle!!
		                    meta.raw = raw; //if(meta && (raw||'').length < (999 * 99)){ meta.raw = raw } // HNPERF: If string too big, don't keep in memory.
		                    mesh.say(msg, peer);
		                }
		            }
		        }());

		        function flush(peer){
		            var tmp = peer.batch, t = 'string' == typeof tmp, l;
		            if(t){ tmp += ']' }// TODO: Prevent double JSON!
		            peer.batch = peer.tail = null;
		            if(!tmp){ return }
		            if(t? 3 > tmp.length : !tmp.length){ return } // TODO: ^
		            if(!t){try{tmp = (1 === tmp.length? tmp[0] : JSON.stringify(tmp));
		            }catch(e){return opt.log('DAM JSON stringify error', e)}}
		            if(!tmp){ return }
		            send(tmp, peer);
		        }
		        // for now - find better place later.
		        function send(raw, peer){ try{
		            var wire = peer.wire;
		            if(peer.say){
		                peer.say(raw);
		            } else
		            if(wire.send){
		                wire.send(raw);
		            }
		            mesh.say.d += raw.length||0; ++mesh.say.c; // STATS!
		        }catch(e){
		            (peer.queue = peer.queue || []).push(raw);
		        }}

		        mesh.near = 0;
		        mesh.hi = function(peer){
		            var wire = peer.wire, tmp;
		            if(!wire){ mesh.wire((peer.length && {url: peer, id: peer}) || peer); return }
		            if(peer.id){
		                opt.peers[peer.url || peer.id] = peer;
		            } else {
		                tmp = peer.id = peer.id || peer.url || String.random(9);
		                mesh.say({dam: '?', pid: root.opt.pid}, opt.peers[tmp] = peer);
		                delete dup.s[peer.last]; // IMPORTANT: see https://gun.eco/docs/DAM#self
		            }
		            if(!peer.met){
		                mesh.near++;
		                peer.met = +(new Date);
		                root.on('hi', peer)
		            }
		            // @rogowski I need this here by default for now to fix go1dfish's bug
		            tmp = peer.queue; peer.queue = [];
		            setTimeout.each(tmp||[],function(msg){
		                send(msg, peer);
		            },0,9);
		            //Type.obj.native && Type.obj.native(); // dirty place to check if other JS polluted.
		        }
		        mesh.bye = function(peer){
		            peer.met && --mesh.near;
		            delete peer.met;
		            root.on('bye', peer);
		            var tmp = +(new Date); tmp = (tmp - (peer.met||tmp));
		            mesh.bye.time = ((mesh.bye.time || tmp) + tmp) / 2;
		        }
		        mesh.hear['!'] = function(msg, peer){ opt.log('Error:', msg.err) }
		        mesh.hear['?'] = function(msg, peer){
		            if(msg.pid){
		                if(!peer.pid){ peer.pid = msg.pid }
		                if(msg['@']){ return }
		            }
		            mesh.say({dam: '?', pid: opt.pid, '@': msg['#']}, peer);
		            delete dup.s[peer.last]; // IMPORTANT: see https://gun.eco/docs/DAM#self
		        }
		        mesh.hear['mob'] = function(msg, peer){ // NOTE: AXE will overload this with better logic.
		            if(!msg.peers){ return }
		            var peers = Object.keys(msg.peers), one = peers[(Math.random()*peers.length) >> 0];
		            if(!one){ return }
		            mesh.bye(peer);
		            mesh.hi(one);
		        }

		        root.on('create', function(root){
		            root.opt.pid = root.opt.pid || String.random(9);
		            this.to.next(root);
		            root.on('out', mesh.say);
		        });

		        root.on('bye', function(peer, tmp){
		            peer = opt.peers[peer.id || peer] || peer;
		            this.to.next(peer);
		            peer.bye? peer.bye() : (tmp = peer.wire) && tmp.close && tmp.close();
		            delete opt.peers[peer.id];
		            peer.wire = null;
		        });

		        var gets = {};
		        root.on('bye', function(peer, tmp){ this.to.next(peer);
		            if(tmp = console.STAT){ tmp.peers = mesh.near; }
		            if(!(tmp = peer.url)){ return } gets[tmp] = true;
		            setTimeout(function(){ delete gets[tmp] },opt.lack || 9000);
		        });
		        root.on('hi', function(peer, tmp){ this.to.next(peer);
		            if(tmp = console.STAT){ tmp.peers = mesh.near }
		            if(opt.super){ return } // temporary (?) until we have better fix/solution?
		            var souls = Object.keys(root.next||''); // TODO: .keys( is slow
		            if(souls.length > 9999 && !console.SUBS){ console.log(console.SUBS = "Warning: You have more than 10K live GETs, which might use more bandwidth than your screen can show - consider `.off()`.") }
		            setTimeout.each(souls, function(soul){ var node = root.next[soul];
		                if(opt.super || (node.ask||'')['']){ mesh.say({get: {'#': soul}}, peer); return }
		                setTimeout.each(Object.keys(node.ask||''), function(key){ if(!key){ return }
		                    // is the lack of ## a !onion hint?
		                    mesh.say({'##': String.hash((root.graph[soul]||'')[key]), get: {'#': soul, '.': key}}, peer);
		                    // TODO: Switch this so Book could route?
		                })
		            });
		        });

		        return mesh;
		    }
		    var empty = {}, ok = true, u;

		    try{ __defaultExport = Mesh }catch(e){}
		}());
		module.exports = __defaultExport;
	})(USE, './mesh');

	;USE(function(module){
		var __root = USE('./root.js', 1);
		var __mesh = USE('./mesh.js', 1);
		(function(){

		var Gun = __root;
		Gun.Mesh = __mesh;

		// TODO: resync upon reconnect online/offline
		//window.ononline = window.onoffline = function(){ console.log('online?', navigator.onLine) }

		Gun.on('opt', function(root){
			this.to.next(root);
			if(root.once){ return }
			var opt = root.opt;
			if(false === opt.WebSocket){ return }

			var env = Gun.window || {};
			var websocket = opt.WebSocket || env.WebSocket || env.webkitWebSocket || env.mozWebSocket;
			if(!websocket){ return }
			opt.WebSocket = websocket;

			var mesh = opt.mesh = opt.mesh || Gun.Mesh(root);

			var wired = mesh.wire || opt.wire;
			mesh.wire = opt.wire = open;
			function open(peer){ try{
				if(!peer || !peer.url){ return wired && wired(peer) }
				var url = peer.url.replace(/^http/, 'ws');
				var wire = peer.wire = new opt.WebSocket(url);
				wire.onclose = function(){
					reconnect(peer);
					opt.mesh.bye(peer);
				};
				wire.onerror = function(err){
					reconnect(peer);
				};
				wire.onopen = function(){
					opt.mesh.hi(peer);
				}
				wire.onmessage = function(msg){
					if(!msg){ return }
					opt.mesh.hear(msg.data || msg, peer);
				};
				return wire;
			}catch(e){ opt.mesh.bye(peer) }}

			setTimeout(function(){ !opt.super && root.on('out', {dam:'hi'}) },1); // it can take a while to open a socket, so maybe no longer lazy load for perf reasons?

			var wait = 2 * 999;
			function reconnect(peer){
				clearTimeout(peer.defer);
				if(!opt.peers[peer.url]){ return }
				if(doc && peer.retry <= 0){ return }
				peer.retry = (peer.retry || opt.retry+1 || 60) - ((-peer.tried + (peer.tried = +new Date) < wait*4)?1:0);
				peer.defer = setTimeout(function to(){
					if(doc && doc.hidden){ return setTimeout(to,wait) }
					open(peer);
				}, wait);
			}
			var doc = (''+u !== typeof document) && document;
		});
		var noop = function(){}, u;

		}());
	})(USE, './websocket');

	;USE(function(module){
		if(typeof Gun === 'undefined'){ return }

		var noop = function(){}, store, u;
		try{store = (Gun.window||noop).localStorage}catch(e){}
		if(!store){
			Gun.log("Warning: No localStorage exists to persist data to!");
			store = {setItem: function(k,v){this[k]=v}, removeItem: function(k){delete this[k]}, getItem: function(k){return this[k]}};
		}

		var parse = JSON.parseAsync || function(t,cb,r){ var u; try{ cb(u, JSON.parse(t,r)) }catch(e){ cb(e) } }
		var json = JSON.stringifyAsync || function(v,cb,r,s){ var u; try{ cb(u, JSON.stringify(v,r,s)) }catch(e){ cb(e) } }

		Gun.on('create', function lg(root){
			this.to.next(root);
			var opt = root.opt, graph = root.graph, acks = [], disk, to, size, stop;
			if(false === opt.localStorage){
				// Memory-only mode: no disk writes but still ack puts so callbacks fire.
				root.on('put', function(msg){
					this.to.next(msg);
					if(!msg['@']){ root.on('in', {'@': msg['#'], ok: 1}) }
				});
				return;
			}
			opt.prefix = opt.file || 'gun/';
			try{ disk = lg[opt.prefix] = lg[opt.prefix] || JSON.parse(size = store.getItem(opt.prefix)) || {}; // TODO: Perf! This will block, should we care, since limited to 5MB anyways?
			}catch(e){ disk = lg[opt.prefix] = {}; }
			size = (size||'').length;

			root.on('get', function(msg){
				this.to.next(msg);
				var lex = msg.get, soul, data, tmp, u;
				if(!lex || !(soul = lex['#'])){ return }
				data = disk[soul] || u;
				if(data && (tmp = lex['.']) && !Object.plain(tmp)){ // pluck!
					data = Gun.state.ify({}, tmp, Gun.state.is(data, tmp), data[tmp], soul);
				}
				//if(data){ (tmp = {})[soul] = data } // back into a graph.
				//setTimeout(function(){
				Gun.on.get.ack(msg, data); //root.on('in', {'@': msg['#'], put: tmp, lS:1});// || root.$});
				//}, Math.random() * 10); // FOR TESTING PURPOSES!
			});

			root.on('put', function(msg){
				this.to.next(msg); // remember to call next middleware adapter
				var put = msg.put, soul = put['#'], key = put['.'], id = msg['#'], ok = msg.ok||'', tmp; // pull data off wire envelope
				disk[soul] = Gun.state.ify(disk[soul], key, put['>'], put[':'], soul); // merge into disk object
				if(stop && size > (4999880)){ root.on('in', {'@': id, err: "localStorage max!"}); return; }
				//if(!msg['@']){ acks.push(id) } // then ack any non-ack write. // TODO: use batch id.
				if(!msg['@'] && (!msg._.via || Math.random() < (ok['@'] / ok['/']))){ acks.push(id) } // then ack any non-ack write. // TODO: use batch id.
				if(to){ return }
				to = setTimeout(flush, 9+(size / 333)); // 0.1MB = 0.3s, 5MB = 15s 
			});
			function flush(){
				if(!acks.length && ((setTimeout.turn||'').s||'').length){ setTimeout(flush,99); return; } // defer if "busy" && no saves.
				var err, ack = acks; clearTimeout(to); to = false; acks = [];
				json(disk, function(err, tmp){
					try{!err && store.setItem(opt.prefix, tmp);
					}catch(e){ err = stop = e || "localStorage failure" }
					if(err){
						Gun.log(err + " Consider using GUN's IndexedDB plugin for RAD for more storage space, https://gun.eco/docs/RAD#install");
						root.on('localStorage:error', {err: err, get: opt.prefix, put: disk});
					}
					size = tmp.length;

					//if(!err && !Object.empty(opt.peers)){ return } // only ack if there are no peers. // Switch this to probabilistic mode
					setTimeout.each(ack, function(id){
						root.on('in', {'@': id, err: err, ok: 0}); // localStorage isn't reliable, so make its `ok` code be a low number.
					},0,99);
				})
			}

		});
	})(USE, './localStorage');


__bundleExport = MOD.exports;
}());
export default __bundleExport;
/* UNBUILD-SNAPSHOT-START
eyJraW5kIjoiZ3VuIiwiZmlsZXMiOnsic3JjL3BvbHlmaWxsL3VuYnVpbGQuanMiOiJcbiAgY29uc3QgTU9EID0geyBleHBvcnRzOiB7fSB9O1xuZnVuY3Rp
b24gVVNFKGFyZywgcmVxKXtcbiAgICByZXR1cm4gcmVxPyBVU0VbUihhcmcpXSA6IGFyZy5zbGljZT8gVVNFW1IoYXJnKV0gOiBmdW5jdGlvbihtb2QsIHBh
dGgpe1xuICAgICAgYXJnKG1vZCA9IHtleHBvcnRzOiB7fX0pO1xuICAgICAgVVNFW1IocGF0aCldID0gbW9kLmV4cG9ydHM7XG4gICAgfVxuICAgIGZ1bmN0
aW9uIFIocCl7XG4gICAgICByZXR1cm4gcC5zcGxpdCgnLycpLnNsaWNlKC0xKS50b1N0cmluZygpLnJlcGxhY2UoJy5qcycsJycpO1xuICAgIH1cbiAgfVxu
ICB2YXIgTU9EVUxFID0gTU9EXG4gIGV4cG9ydCBkZWZhdWx0IE1PRC5leHBvcnRzO1xuICBcbiIsInNyYy9zaGltLmpzIjoiOyhmdW5jdGlvbigpe1xuXG4v
LyBTaGltIGZvciBnZW5lcmljIGphdmFzY3JpcHQgdXRpbGl0aWVzLlxuU3RyaW5nLnJhbmRvbSA9IGZ1bmN0aW9uKGwsIGMpe1xuXHR2YXIgcyA9ICcnO1xu
XHRsID0gbCB8fCAyNDsgLy8geW91IGFyZSBub3QgZ29pbmcgdG8gbWFrZSBhIDAgbGVuZ3RoIHJhbmRvbSBudW1iZXIsIHNvIG5vIG5lZWQgdG8gY2hlY2sg
dHlwZVxuXHRjID0gYyB8fCAnMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eic7XG5cdHdoaWxl
KGwtLSA+IDApeyBzICs9IGMuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGMubGVuZ3RoKSkgfVxuXHRyZXR1cm4gcztcbn1cblN0cmluZy5t
YXRjaCA9IGZ1bmN0aW9uKHQsIG8peyB2YXIgdG1wLCB1O1xuXHRpZignc3RyaW5nJyAhPT0gdHlwZW9mIHQpeyByZXR1cm4gZmFsc2UgfVxuXHRpZignc3Ry
aW5nJyA9PSB0eXBlb2Ygbyl7IG8gPSB7Jz0nOiBvfSB9XG5cdG8gPSBvIHx8IHt9O1xuXHR0bXAgPSAob1snPSddIHx8IG9bJyonXSB8fCBvWyc+J10gfHwg
b1snPCddKTtcblx0aWYodCA9PT0gdG1wKXsgcmV0dXJuIHRydWUgfVxuXHRpZih1ICE9PSBvWyc9J10peyByZXR1cm4gZmFsc2UgfVxuXHR0bXAgPSAob1sn
KiddIHx8IG9bJz4nXSk7XG5cdGlmKHQuc2xpY2UoMCwgKHRtcHx8JycpLmxlbmd0aCkgPT09IHRtcCl7IHJldHVybiB0cnVlIH1cblx0aWYodSAhPT0gb1sn
KiddKXsgcmV0dXJuIGZhbHNlIH1cblx0aWYodSAhPT0gb1snPiddICYmIHUgIT09IG9bJzwnXSl7XG5cdFx0cmV0dXJuICh0ID49IG9bJz4nXSAmJiB0IDw9
IG9bJzwnXSk/IHRydWUgOiBmYWxzZTtcblx0fVxuXHRpZih1ICE9PSBvWyc+J10gJiYgdCA+PSBvWyc+J10peyByZXR1cm4gdHJ1ZSB9XG5cdGlmKHUgIT09
IG9bJzwnXSAmJiB0IDw9IG9bJzwnXSl7IHJldHVybiB0cnVlIH1cblx0cmV0dXJuIGZhbHNlO1xufVxuU3RyaW5nLmhhc2ggPSBmdW5jdGlvbihzLCBjKXsg
Ly8gdmlhIFNPXG5cdGlmKHR5cGVvZiBzICE9PSAnc3RyaW5nJyl7IHJldHVybiB9XG5cdCAgICBjID0gYyB8fCAwOyAvLyBDUFUgc2NoZWR1bGUgaGFzaGlu
ZyBieVxuXHQgICAgaWYoIXMubGVuZ3RoKXsgcmV0dXJuIGMgfVxuXHQgICAgZm9yKHZhciBpPTAsbD1zLmxlbmd0aCxuOyBpPGw7ICsraSl7XG5cdCAgICAg
IG4gPSBzLmNoYXJDb2RlQXQoaSk7XG5cdCAgICAgIGMgPSAoKGM8PDUpLWMpK247XG5cdCAgICAgIGMgfD0gMDtcblx0ICAgIH1cblx0ICAgIHJldHVybiBj
O1xuXHQgIH1cbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuT2JqZWN0LnBsYWluID0gZnVuY3Rpb24obyl7IHJldHVybiBv
PyAobyBpbnN0YW5jZW9mIE9iamVjdCAmJiBvLmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5t
YXRjaCgvXlxcW29iamVjdCAoXFx3KylcXF0kLylbMV0gPT09ICdPYmplY3QnIDogZmFsc2UgfVxuT2JqZWN0LmVtcHR5ID0gZnVuY3Rpb24obywgbil7XG5c
dGZvcih2YXIgayBpbiBvKXsgaWYoaGFzLmNhbGwobywgaykgJiYgKCFuIHx8IC0xPT1uLmluZGV4T2YoaykpKXsgcmV0dXJuIGZhbHNlIH0gfVxuXHRyZXR1
cm4gdHJ1ZTtcbn1cbk9iamVjdC5rZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24obyl7XG5cdHZhciBsID0gW107XG5cdGZvcih2YXIgayBpbiBvKXsg
aWYoaGFzLmNhbGwobywgaykpeyBsLnB1c2goaykgfSB9XG5cdHJldHVybiBsO1xufVxuOyhmdW5jdGlvbigpe1xuXHR2YXIgdSwgc1QgPSBzZXRUaW1lb3V0
LCBsID0gMCwgYyA9IDAsIGFjdGl2ZSA9IDBcblx0LCBzSSA9ICh0eXBlb2Ygc2V0SW1tZWRpYXRlICE9PSAnJyt1ICYmIHNldEltbWVkaWF0ZSkgfHwgKGZ1
bmN0aW9uKGMsZil7XG5cdFx0aWYodHlwZW9mIE1lc3NhZ2VDaGFubmVsID09ICcnK3UpeyByZXR1cm4gc1QgfVxuXHRcdChjID0gbmV3IE1lc3NhZ2VDaGFu
bmVsKCkpLnBvcnQxLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGUpeyAnJz09ZS5kYXRhICYmIGYoKSB9XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKHEpeyBmPXE7Yy5w
b3J0Mi5wb3N0TWVzc2FnZSgnJykgfVxuXHR9KCkpLCBjaGVjayA9IHNULmNoZWNrID0gc1QuY2hlY2sgfHwgKHR5cGVvZiBwZXJmb3JtYW5jZSAhPT0gJycr
dSAmJiBwZXJmb3JtYW5jZSlcblx0fHwge25vdzogZnVuY3Rpb24oKXsgcmV0dXJuICtuZXcgRGF0ZSB9fTtcblx0c1QuaG9sZCA9IHNULmhvbGQgfHwgOTsg
Ly8gaGFsZiBhIGZyYW1lIGJlbmNobWFya3MgZmFzdGVyIHRoYW4gPCAxbXM/XG5cdHNULnBvbGwgPSBzVC5wb2xsIHx8IGZ1bmN0aW9uKGYpe1xuXHRcdGlm
KGFjdGl2ZSl7XG5cdFx0XHRzSShmdW5jdGlvbigpeyBsID0gY2hlY2subm93KCk7IGFjdGl2ZSA9IDE7IHRyeXsgZigpIH0gZmluYWxseSB7IGFjdGl2ZSA9
IDAgfSB9LCBjPTApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZigoc1QuaG9sZCA+PSAoY2hlY2subm93KCkgLSBsKSkgJiYgYysrIDwgMzMzMyl7
XG5cdFx0XHRhY3RpdmUgPSAxO1xuXHRcdFx0dHJ5eyBmKCkgfSBmaW5hbGx5IHsgYWN0aXZlID0gMCB9XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHNJ
KGZ1bmN0aW9uKCl7IGwgPSBjaGVjay5ub3coKTsgYWN0aXZlID0gMTsgdHJ5eyBmKCkgfSBmaW5hbGx5IHsgYWN0aXZlID0gMCB9IH0sYz0wKVxuXHR9XG59
KCkpO1xuOyhmdW5jdGlvbigpeyAvLyBUb28gbWFueSBwb2xscyBibG9jaywgdGhpcyBcInRocmVhZHNcIiB0aGVtIGluIHR1cm5zIG92ZXIgYSBzaW5nbGUg
dGhyZWFkIGluIHRpbWUuXG5cdHZhciBzVCA9IHNldFRpbWVvdXQsIHQgPSBzVC50dXJuID0gc1QudHVybiB8fCBmdW5jdGlvbihmKXsgMSA9PSBzLnB1c2go
ZikgJiYgcChUKSB9XG5cdCwgcyA9IHQucyA9IFtdLCBwID0gc1QucG9sbCwgaSA9IDAsIGYsIFQgPSBmdW5jdGlvbigpe1xuXHRcdGlmKGYgPSBzW2krK10p
eyBmKCkgfVxuXHRcdGlmKGkgPT0gcy5sZW5ndGggfHwgOTkgPT0gaSl7XG5cdFx0XHRzID0gdC5zID0gcy5zbGljZShpKTtcblx0XHRcdGkgPSAwO1xuXHRc
dH1cblx0XHRpZihzLmxlbmd0aCl7IHAoVCkgfVxuXHR9XG59KCkpO1xuOyhmdW5jdGlvbigpe1xuXHR2YXIgdSwgc1QgPSBzZXRUaW1lb3V0LCBUID0gc1Qu
dHVybjtcblx0KHNULmVhY2ggPSBzVC5lYWNoIHx8IGZ1bmN0aW9uKGwsZixlLFMpeyBTID0gUyB8fCA5OyAoZnVuY3Rpb24gdChzLEwscil7XG5cdCAgaWYo
TCA9IChzID0gKGx8fFtdKS5zcGxpY2UoMCxTKSkubGVuZ3RoKXtcblx0ICBcdGZvcih2YXIgaSA9IDA7IGkgPCBMOyBpKyspe1xuXHQgIFx0XHRpZih1ICE9
PSAociA9IGYoc1tpXSkpKXsgYnJlYWsgfVxuXHQgIFx0fVxuXHQgIFx0aWYodSA9PT0gcil7IFQodCk7IHJldHVybiB9XG5cdCAgfSBlICYmIGUocik7XG5c
dH0oKSl9KSgpO1xufSgpKTtcblx0XG59KCkpO1xuIiwic3JjL29udG8uanMiOiJsZXQgX19kZWZhdWx0RXhwb3J0O1xuKGZ1bmN0aW9uKCl7XG5cbi8vIE9u
IGV2ZW50IGVtaXR0ZXIgZ2VuZXJpYyBqYXZhc2NyaXB0IHV0aWxpdHkuXG5fX2RlZmF1bHRFeHBvcnQgPSBmdW5jdGlvbiBvbnRvKHRhZywgYXJnLCBhcyl7
XG5cdGlmKCF0YWcpeyByZXR1cm4ge3RvOiBvbnRvfSB9XG5cdHZhciB1LCBmID0gJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgYXJnLCB0YWcgPSAodGhpcy50YWcg
fHwgKHRoaXMudGFnID0ge30pKVt0YWddIHx8IGYgJiYgKFxuXHRcdHRoaXMudGFnW3RhZ10gPSB7dGFnOiB0YWcsIHRvOiBvbnRvLl8gPSB7IG5leHQ6IGZ1
bmN0aW9uKGFyZyl7IHZhciB0bXA7XG5cdFx0XHRpZih0bXAgPSB0aGlzLnRvKXsgdG1wLm5leHQoYXJnKSB9XG5cdH19fSk7XG5cdGlmKGYpe1xuXHRcdHZh
ciBiZSA9IHtcblx0XHRcdG9mZjogb250by5vZmYgfHxcblx0XHRcdChvbnRvLm9mZiA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmKHRoaXMubmV4dCA9PT0g
b250by5fLm5leHQpeyByZXR1cm4gITAgfVxuXHRcdFx0XHRpZih0aGlzID09PSB0aGlzLnRoZS5sYXN0KXtcblx0XHRcdFx0XHR0aGlzLnRoZS5sYXN0ID0g
dGhpcy5iYWNrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMudG8uYmFjayA9IHRoaXMuYmFjaztcblx0XHRcdFx0dGhpcy5uZXh0ID0gb250by5fLm5leHQ7
XG5cdFx0XHRcdHRoaXMuYmFjay50byA9IHRoaXMudG87XG5cdFx0XHRcdGlmKHRoaXMudGhlLmxhc3QgPT09IHRoaXMudGhlKXtcblx0XHRcdFx0XHRkZWxl
dGUgdGhpcy5vbi50YWdbdGhpcy50aGUudGFnXTtcblx0XHRcdFx0fVxuXHRcdFx0fSksXG5cdFx0XHR0bzogb250by5fLFxuXHRcdFx0bmV4dDogYXJnLFxu
XHRcdFx0dGhlOiB0YWcsXG5cdFx0XHRvbjogdGhpcyxcblx0XHRcdGFzOiBhcyxcblx0XHR9O1xuXHRcdChiZS5iYWNrID0gdGFnLmxhc3QgfHwgdGFnKS50
byA9IGJlO1xuXHRcdHJldHVybiB0YWcubGFzdCA9IGJlO1xuXHR9XG5cdGlmKCh0YWcgPSB0YWcudG8pICYmIHUgIT09IGFyZyl7IHRhZy5uZXh0KGFyZykg
fVxuXHRyZXR1cm4gdGFnO1xufTtcblx0XG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgX19kZWZhdWx0RXhwb3J0OyIsInNyYy9ib29rLmpzIjoibGV0IF9fZGVm
YXVsdEV4cG9ydDtcbihmdW5jdGlvbigpe1xuXG4vLyBUT0RPOiBCVUchIFVuYnVpbGQgd2lsbCBtYWtlIHRoZXNlIGdsb2JhbHMuLi4gQ0hBTkdFIHVuYnVp
bGQgdG8gd3JhcCBmaWxlcyBpbiBhIGZ1bmN0aW9uLlxuLy8gQm9vayBpcyBhIHJlcGxhY2VtZW50IGZvciBKUyBvYmplY3RzLCBtYXBzLCBkaWN0aW9uYXJp
ZXMuXG52YXIgc1QgPSBzZXRUaW1lb3V0LCBCID0gc1QuQm9vayB8fCAoc1QuQm9vayA9IGZ1bmN0aW9uKHRleHQpe1xuXHR2YXIgYiA9IGZ1bmN0aW9uIGJv
b2sod29yZCwgaXMpe1xuXHRcdHZhciBoYXMgPSBiLmFsbFt3b3JkXSwgcDtcblx0XHRpZihpcyA9PT0gdW5kZWZpbmVkKXsgcmV0dXJuIChoYXMgJiYgaGFz
LmlzKSB8fCBiLmdldChoYXMgfHwgd29yZCkgfVxuXHRcdGlmKGhhcyl7XG5cdFx0XHRpZihwID0gaGFzLnBhZ2Upe1xuXHRcdFx0XHRwLnNpemUgKz0gc2l6
ZShpcykgLSBzaXplKGhhcy5pcyk7XG5cdFx0XHRcdHAudGV4dCA9ICcnO1xuXHRcdFx0fVxuXHRcdFx0aGFzLnRleHQgPSAnJztcblx0XHRcdGhhcy5pcyA9
IGlzO1xuXHRcdFx0cmV0dXJuIGI7XG5cdFx0fVxuXHRcdC8vYi5hbGxbd29yZF0gPSB7aXM6IHdvcmR9OyByZXR1cm4gYjtcblx0XHRyZXR1cm4gYi5zZXQo
d29yZCwgaXMpO1xuXHR9O1xuXHQvLyBUT0RPOiBpZiBmcm9tIHRleHQsIHByZXNlcnZlIHRoZSBzZXBhcmF0b3Igc3ltYm9sLlxuXHRiLmxpc3QgPSBbe2Zy
b206IHRleHQsIHNpemU6ICh0ZXh0fHwnJykubGVuZ3RoLCBzdWJzdHJpbmc6IHN1YiwgdG9TdHJpbmc6IHRvLCBib29rOiBiLCBnZXQ6IGIsIHJlYWQ6IGxp
c3R9XTtcblx0Yi5wYWdlID0gcGFnZTtcblx0Yi5zZXQgPSBzZXQ7XG5cdGIuZ2V0ID0gZ2V0O1xuXHRiLmFsbCA9IHt9O1xuXHRyZXR1cm4gYjtcbn0pLCBQ
QUdFID0gMioqMTI7XG5cbmZ1bmN0aW9uIHBhZ2Uod29yZCl7XG5cdHZhciBiID0gdGhpcywgbCA9IGIubGlzdCwgaSA9IHNwb3Qod29yZCwgbCwgYi5wYXJz
ZSksIHAgPSBsW2ldO1xuXHRpZignc3RyaW5nJyA9PSB0eXBlb2YgcCl7IGxbaV0gPSBwID0ge3NpemU6IC0xLCBmaXJzdDogYi5wYXJzZT8gYi5wYXJzZShw
KSA6IHAsIHN1YnN0cmluZzogc3ViLCB0b1N0cmluZzogdG8sIGJvb2s6IGIsIGdldDogYiwgcmVhZDogbGlzdH0gfSAvLyBUT0RPOiB0ZXN0LCBob3cgZG8g
d2UgYXJyaXZlIGF0IHRoaXMgY29uZGl0aW9uIGFnYWluP1xuXHQvL3AuaSA9IGk7XG5cdHJldHVybiBwO1xuXHQvLyBUT0RPOiBCVUchIFdoYXQgaWYgd2Ug
Z2V0IHRoZSBwYWdlLCBpdCB0dXJucyBvdXQgdG8gYmUgdG9vIGJpZyAmIHNwbGl0LCB3ZSBtdXN0IHRoZW4gUkUgZ2V0IHRoZSBwYWdlIVxufVxuZnVuY3Rp
b24gZ2V0KHdvcmQpe1xuXHRpZighd29yZCl7IHJldHVybiB9XG5cdGlmKHVuZGVmaW5lZCAhPT0gd29yZC5pcyl7IHJldHVybiB3b3JkLmlzIH0gLy8gSlMg
ZmFsc2V5IHZhbHVlcyFcblx0dmFyIGIgPSB0aGlzLCBoYXMgPSBiLmFsbFt3b3JkXTtcblx0aWYoaGFzKXsgcmV0dXJuIGhhcy5pcyB9XG5cdC8vIGdldCBk
b2VzIGFuIGV4YWN0IG1hdGNoLCBzbyB3ZSB3b3VsZCBoYXZlIGZvdW5kIGl0IGFscmVhZHksIHVubGVzcyBwYXJzZWxlc3MgcGFnZTpcblx0dmFyIHBhZ2Ug
PSBiLnBhZ2Uod29yZCksIGwsIGhhcywgYSwgaTtcblx0aWYoIXBhZ2UgfHwgIXBhZ2UuZnJvbSl7IHJldHVybiB9IC8vIG5vIHBhcnNlbGVzcyBkYXRhXG5c
dHJldHVybiBnb3Qod29yZCwgcGFnZSk7XG59XG5mdW5jdGlvbiBnb3Qod29yZCwgcGFnZSl7XG5cdHZhciBiID0gcGFnZS5ib29rLCBsLCBoYXMsIGEsIGk7
XG5cdGlmKGwgPSBmcm9tKHBhZ2UpKXsgaGFzID0gbFtnb3QuaSA9IGkgPSBzcG90KHdvcmQsIGwsIEIuZGVjb2RlKV07IH0gLy8gVE9ETzogUE9URU5USUFM
IEJVRyEgVGhpcyBhc3N1bWVzIHRoYXQgZWFjaCB3b3JkIG9uIGEgcGFnZSB1c2VzIHRoZSBzYW1lIHNlcmlhbGl6ZXIvZm9ybWF0dGVyL3N0cnVjdHVyZS4g
Ly8gVE9PRDogQlVHISEhIE5vdCBhY3R1YWxseSwgYnV0IGlmIHdlIHdhbnQgdG8gZG8gbm9uLWV4YWN0IHJhZGl4LWxpa2UgY2xvc2VzdC13b3JkIGxvb2t1
cHMgb24gYSBwYWdlLCB3ZSBuZWVkIHRvIGNoZWNrIGxpbWJvICYgcG90ZW50aWFsbHkgc29ydCBmaXJzdC5cblx0Ly8gcGFyc2VsZXNzIG1heSByZXR1cm4g
LTEgZnJvbSBhY3R1YWwgdmFsdWUsIHNvIHdlIG1heSBuZWVkIHRvIHRlc3QgYm90aC4gLy8gVE9ETzogRG91YmxlIGNoZWNrPyBJIHRoaW5rIHRoaXMgaXMg
Y29ycmVjdC5cblx0aWYoaGFzICYmIHdvcmQgPT0gaGFzLndvcmQpeyByZXR1cm4gKGIuYWxsW3dvcmRdID0gaGFzKS5pcyB9XG5cdGlmKCdzdHJpbmcnICE9
IHR5cGVvZiBoYXMpeyBoYXMgPSBsW2dvdC5pID0gaSs9MV0gfVxuXHRpZihoYXMgJiYgd29yZCA9PSBoYXMud29yZCl7IHJldHVybiAoYi5hbGxbd29yZF0g
PSBoYXMpLmlzIH1cblx0YSA9IHNsb3QoaGFzKSAvLyBFc2NhcGUhXG5cdGlmKHdvcmQgIT0gQi5kZWNvZGUoYVswXSkpe1xuXHRcdGhhcyA9IGxbZ290Lmkg
PSBpKz0xXTsgLy8gZWRnZSBjYXNlIGJ1Zz9cblx0XHRhID0gc2xvdChoYXMpOyAvLyBlZGdlIGNhc2UgYnVnP1xuXHRcdGlmKHdvcmQgIT0gQi5kZWNvZGUo
YVswXSkpeyByZXR1cm4gfVxuXHR9XG5cdGhhcyA9IGxbaV0gPSBiLmFsbFt3b3JkXSA9IHt3b3JkOiAnJyt3b3JkLCBpczogQi5kZWNvZGUoYVsxXSksIHBh
Z2U6IHBhZ2UsIHN1YnN0cmluZzogc3VidCwgdG9TdHJpbmc6IHRvdH07IC8vIFRPRE86IGNvbnZlcnQgdG8gYSBKUyB2YWx1ZSEhISBNYXliZSBpbmRleCEg
VE9ETzogQlVHIHdvcmQgbmVlZHMgYSBwYWdlISEhISBUT0RPOiBDaGVjayBmb3Igb3RoZXIgdHlwZXMhISFcblx0cmV0dXJuIGhhcy5pcztcbn1cblxuZnVu
Y3Rpb24gc3BvdCh3b3JkLCBzb3J0ZWQsIHBhcnNlKXsgcGFyc2UgPSBwYXJzZSB8fCBzcG90Lm5vIHx8IChzcG90Lm5vID0gZnVuY3Rpb24odCl7IHJldHVy
biB0IH0pOyAvLyBUT0RPOiBCVUc/Pz8/IFdoeSBpcyB0aGVyZSBzdWJzdHJpbmcoKXx8MCA/IC8vIFRPRE86IFBFUkYhISEgLnRvU3RyaW5nKCkgaXMgKzMz
JSBmYXN0ZXIsIGNhbiB3ZSBjb21iaW5lIGl0IHdpdGggdGhlIGV4cG9ydD9cblx0dmFyIEwgPSBzb3J0ZWQsIG1pbiA9IDAsIHBhZ2UsIGZvdW5kLCBsID0g
KHdvcmQ9Jycrd29yZCkubGVuZ3RoLCBtYXggPSBMLmxlbmd0aCwgaSA9IG1heC8yO1xuXHR3aGlsZSgoKHdvcmQgPCAocGFnZSA9IChwYXJzZShMW2k9aT4+
MF0pfHwnJykuc3Vic3RyaW5nKCkpKSB8fCAoKHBhcnNlKExbaSsxXSl8fCcnKS5zdWJzdHJpbmcoKSA8PSB3b3JkKSkgJiYgaSAhPSBtaW4peyAvLyBMW2ld
IDw9IHdvcmQgPCBMW2krMV1cblx0XHRpICs9IChwYWdlIDw9IHdvcmQpPyAobWF4IC0gKG1pbiA9IGkpKS8yIDogLSgobWF4ID0gaSkgLSBtaW4pLzI7XG5c
dH1cblx0cmV0dXJuIGk7XG59XG5cbmZ1bmN0aW9uIGZyb20oYSwgdCwgbCl7XG5cdGlmKCdzdHJpbmcnICE9IHR5cGVvZiBhLmZyb20peyByZXR1cm4gYS5m
cm9tIH1cblx0Ly8obCA9IGEuZnJvbSA9ICh0ID0gYS5mcm9tfHwnJykuc3Vic3RyaW5nKDEsIHQubGVuZ3RoLTEpLnNwbGl0KHRbMF0pKTsgLy8gc2xvdFxu
XHQobCA9IGEuZnJvbSA9IHNsb3QodCA9IHR8fGEuZnJvbXx8JycpKTtcblx0cmV0dXJuIGw7XG59XG5mdW5jdGlvbiBsaXN0KGVhY2gpeyBlYWNoID0gZWFj
aCB8fCBmdW5jdGlvbih4KXtyZXR1cm4geH0gXG5cdHZhciBpID0gMCwgbCA9IHNvcnQodGhpcyksIHcsIHIgPSBbXSwgcCA9IHRoaXMuYm9vay5wYXJzZSB8
fCBmdW5jdGlvbigpe307XG5cdC8vd2hpbGUodyA9IGxbaSsrXSl7IHIucHVzaChlYWNoKHNsb3QodylbMV0sIHAodyl8fHcsIHRoaXMpKSB9XG5cdHdoaWxl
KHcgPSBsW2krK10peyByLnB1c2goZWFjaCh0aGlzLmdldCh3ID0gdy53b3JkfHxwKHcpfHx3KSwgdywgdGhpcykpIH0gLy8gVE9ETzogQlVHISBQRVJGP1xu
XHRyZXR1cm4gcjtcbn1cblxuZnVuY3Rpb24gc2V0KHdvcmQsIGlzKXtcblx0Ly8gVE9ETzogUGVyZiBvbiByYW5kb20gd3JpdGUgaXMgZGVjZW50LCBidXQg
c2hvcnQga2V5cyBvciBzZXEgc2VlbXMgc2lnbmlmaWNhbnRseSBzbG93ZXIuXG5cdHZhciBiID0gdGhpcywgaGFzID0gYi5hbGxbd29yZF07XG5cdGlmKGhh
cyl7IHJldHVybiBiKHdvcmQsIGlzKSB9IC8vIHVwZGF0ZXMgdG8gaW4tbWVtb3J5IGl0ZW1zIHdpbGwgYWx3YXlzIG1hdGNoIGV4YWN0bHkuXG5cdHZhciBw
YWdlID0gYi5wYWdlKHdvcmQ9Jycrd29yZCksIHRtcDsgLy8gYmVmb3JlIHdlIGFzc3VtZSB0aGlzIGlzIGFuIGluc2VydCB0aG8sIHdlIG5lZWQgdG8gY2hl
Y2tcblx0aWYocGFnZSAmJiBwYWdlLmZyb20peyAvLyBpZiBpdCBjb3VsZCBiZSBhbiB1cGRhdGUgdG8gYW4gZXhpc3Rpbmcgd29yZCBmcm9tIHBhcnNlbGVz
cy5cblx0XHRiLmdldCh3b3JkKTtcblx0XHRpZihiLmFsbFt3b3JkXSl7IHJldHVybiBiKHdvcmQsIGlzKSB9XG5cdH1cblx0Ly8gTVVTVCBiZSBhbiBpbnNl
cnQ6XG5cdGhhcyA9IGIuYWxsW3dvcmRdID0ge3dvcmQ6IHdvcmQsIGlzOiBpcywgcGFnZTogcGFnZSwgc3Vic3RyaW5nOiBzdWJ0LCB0b1N0cmluZzogdG90
fTtcblx0cGFnZS5maXJzdCA9IChwYWdlLmZpcnN0IDwgd29yZCk/IHBhZ2UuZmlyc3QgOiB3b3JkO1xuXHRpZighcGFnZS5saW1ibyl7IChwYWdlLmxpbWJv
ID0gW10pIH1cblx0cGFnZS5saW1iby5wdXNoKGhhcyk7XG5cdGIod29yZCwgaXMpO1xuXHRwYWdlLnNpemUgKz0gc2l6ZSh3b3JkKSArIHNpemUoaXMpO1xu
XHRpZigoYi5QQUdFIHx8IFBBR0UpIDwgcGFnZS5zaXplKXsgc3BsaXQocGFnZSwgYikgfVxuXHRyZXR1cm4gYjtcbn1cblxuZnVuY3Rpb24gc3BsaXQocCwg
Yil7IC8vIFRPRE86IHVzZSBjbG9zZXN0IGhhc2ggaW5zdGVhZCBvZiBoYWxmLlxuXHQvL2NvbnNvbGUudGltZSgpO1xuXHQvL3ZhciBTID0gcGVyZm9ybWFu
Y2Uubm93KCk7XG5cdHZhciBMID0gc29ydChwKSwgbCA9IEwubGVuZ3RoLCBpID0gbC8yID4+IDAsIGogPSBpLCBoYWxmID0gTFtqXSwgdG1wO1xuXHQvL2Nv
bnNvbGUudGltZUVuZCgpO1xuXHR2YXIgbmV4dCA9IHtmaXJzdDogaGFsZi5zdWJzdHJpbmcoKSwgc2l6ZTogMCwgc3Vic3RyaW5nOiBzdWIsIHRvU3RyaW5n
OiB0bywgYm9vazogYiwgZ2V0OiBiLCByZWFkOiBsaXN0fSwgZiA9IG5leHQuZnJvbSA9IFtdO1xuXHR3aGlsZSh0bXAgPSBMW2krK10pe1xuXHRcdGYucHVz
aCh0bXApO1xuXHRcdG5leHQuc2l6ZSArPSAodG1wLmlzfHwnJykubGVuZ3RofHwxO1xuXHRcdHRtcC5wYWdlID0gbmV4dDtcblx0fVxuXHRwLmZyb20gPSBw
LmZyb20uc2xpY2UoMCwgaik7XG5cdHAuc2l6ZSAtPSBuZXh0LnNpemU7XG5cdGIubGlzdC5zcGxpY2Uoc3BvdChuZXh0LmZpcnN0LCBiLmxpc3QpKzEsIDAs
IG5leHQpOyAvLyBUT0RPOiBCVUchIE1ha2Ugc3VyZSBuZXh0LmZpcnN0IGlzIGRlY29kZWQgdGV4dC4gLy8gVE9ETzogQlVHISBzcG90IG1heSBuZWVkIHBh
cnNlIHRvbz9cblx0Ly9jb25zb2xlLnRpbWVFbmQoKTtcblx0aWYoYi5zcGxpdCl7IGIuc3BsaXQobmV4dCwgcCkgfVxuXHQvL2NvbnNvbGUubG9nKFMgPSAo
cGVyZm9ybWFuY2Uubm93KCkgLSBTKSwgJ3NwbGl0Jyk7XG5cdC8vY29uc29sZS5CSUcgPSBjb25zb2xlLkJJRyA+IFM/IGNvbnNvbGUuQklHIDogUztcbn1c
blxuZnVuY3Rpb24gc2xvdCh0KXsgcmV0dXJuIGhlYWwoKHQ9dHx8JycpLnN1YnN0cmluZygxLCB0Lmxlbmd0aC0xKS5zcGxpdCh0WzBdKSwgdFswXSkgfSBC
LnNsb3QgPSBzbG90OyAvLyBUT0RPOiBjaGVjayBmaXJzdD1sYXN0ICYgcGFzcyBgc2AuXG5mdW5jdGlvbiBoZWFsKGwsIHMpeyB2YXIgaSwgZTtcblx0aWYo
MCA+IChpID0gbC5pbmRleE9mKCcnKSkpeyByZXR1cm4gbCB9IC8vIH43MDBNIG9wcy9zZWMgb24gNEtCIG9mIE1hdGgucmFuZG9tKClzLCBldmVuIGZhc3Rl
ciBpZiBlc2NhcGUgZG9lcyBleGlzdC5cblx0aWYoJycgPT0gbFswXSAmJiAxID09IGwubGVuZ3RoKXsgcmV0dXJuIFtdIH0gLy8gYW5ub3lpbmcgZWRnZSBj
YXNlcyEgaG93IG11Y2ggZG9lcyB0aGlzIHNsb3cgdXMgZG93bj9cblx0Ly9pZigoYz1pKzIrcGFyc2VJbnQobFtpKzFdKSkgIT0gYyl7IHJldHVybiBbXSB9
IC8vIG1heWJlIHN0aWxsIGZhc3RlciB0aGFuIGJlbG93P1xuXHRpZigoZT1pKzIrcGFyc2VJbnQoKGU9bFtpKzFdKS5zdWJzdHJpbmcoMCwgZS5pbmRleE9m
KCdcIicpKXx8ZSkpICE9IGUpeyByZXR1cm4gW10gfSAvLyBOYU4gY2hlY2sgaW4gSlMgaXMgd2VpcmQuXG5cdGxbaV0gPSBsLnNsaWNlKGksIGUpLmpvaW4o
c3x8J3wnKTsgLy8gcmVqb2luIHRoZSBlc2NhcGVkIHZhbHVlXG5cdHJldHVybiBsLnNsaWNlKDAsaSsxKS5jb25jYXQoaGVhbChsLnNsaWNlKGUpLCBzKSk7
IC8vIG1lcmdlIGxlZnQgd2l0aCBjaGVja2VkIHJpZ2h0LlxufVxuXG5mdW5jdGlvbiBzaXplKHQpeyByZXR1cm4gKHR8fCcnKS5sZW5ndGh8fDEgfSAvLyBi
aXRzL251bWJlcnMgbGVzcyBzaXplPyBCdWcgb3IgZmVhdHVyZT9cbmZ1bmN0aW9uIHN1YnQoaSxqKXsgcmV0dXJuIHRoaXMud29yZCB9XG4vL2Z1bmN0aW9u
IHRvdCgpeyByZXR1cm4gdGhpcy50ZXh0ID0gdGhpcy50ZXh0IHx8IFwiJ1wiKyh0aGlzLndvcmQpK1wiJ1wiKyh0aGlzLmlzKStcIidcIiB9XG5mdW5jdGlv
biB0b3QoKXsgdmFyIHRtcCA9IHt9O1xuXHQvL2lmKCh0bXAgPSB0aGlzLnBhZ2UpICYmIHRtcC5zYXZpbmcpeyBkZWxldGUgdG1wLmJvb2suYWxsW3RoaXMu
d29yZF07IH0gLy8gVE9ETzogQlVHISBCb29rIGNhbid0IGtub3cgYWJvdXQgUkFELCB0aGlzIHdhcyBmcm9tIFJBRCwgc28gdGhpcyBNSUdIVCBiZSBjb3Jy
ZWN0IGJ1dCB3ZSBuZWVkIHRvIHJlZmFjdG9yLiBNYWtlIHN1cmUgdG8gYWRkIHRlc3RzIHRoYXQgd2lsbCByZS10cmlnZ2VyIHRoaXMuXG5cdHJldHVybiB0
aGlzLnRleHQgPSB0aGlzLnRleHQgfHwgXCI6XCIrQi5lbmNvZGUodGhpcy53b3JkKStcIjpcIitCLmVuY29kZSh0aGlzLmlzKStcIjpcIjtcblx0dG1wW3Ro
aXMud29yZF0gPSB0aGlzLmlzO1xuXHRyZXR1cm4gdGhpcy50ZXh0ID0gdGhpcy50ZXh0IHx8IEIuZW5jb2RlKHRtcCwnfCcsJzonKS5zbGljZSgxLC0xKTtc
blx0Ly9yZXR1cm4gdGhpcy50ZXh0ID0gdGhpcy50ZXh0IHx8IFwiJ1wiKyh0aGlzLndvcmQpK1wiJ1wiKyh0aGlzLmlzKStcIidcIjtcbn1cbmZ1bmN0aW9u
IHN1YihpLGopeyByZXR1cm4gKHRoaXMuZmlyc3R8fHRoaXMud29yZHx8Qi5kZWNvZGUoKGZyb20odGhpcyl8fCcnKVswXXx8JycpKS5zdWJzdHJpbmcoaSxq
KSB9XG5mdW5jdGlvbiB0bygpeyByZXR1cm4gdGhpcy50ZXh0ID0gdGhpcy50ZXh0IHx8IHRleHQodGhpcykgfVxuZnVuY3Rpb24gdGV4dChwKXsgLy8gUEVS
RjogcmVhZC0+WypdIDogdGV4dC0+XCIqXCIgbm8gZWRpdCB3YXN0ZSAxIHRpbWUgcGVyZi5cblx0aWYocC5saW1ibyl7IHNvcnQocCkgfSAvLyBUT0RPOiBC
VUc/IEVtcHR5IHBhZ2UgbWVhbmluZz8gdW5kZWYsICcnLCAnfHwnP1xuXHRyZXR1cm4gKCdzdHJpbmcnID09IHR5cGVvZiBwLmZyb20pPyBwLmZyb20gOiAn
fCcrKHAuZnJvbXx8W10pLmpvaW4oJ3wnKSsnfCc7XG59XG5cbmZ1bmN0aW9uIHNvcnQocCwgbCl7XG5cdHZhciBmID0gcC5mcm9tID0gKCdzdHJpbmcnID09
IHR5cGVvZiBwLmZyb20pPyBzbG90KHAuZnJvbSkgOiBwLmZyb218fFtdO1xuXHRpZighKGwgPSBsIHx8IHAubGltYm8pKXsgcmV0dXJuIGYgfVxuXHRyZXR1
cm4gbWl4KHApLnNvcnQoZnVuY3Rpb24oYSxiKXtcblx0XHRyZXR1cm4gKGEud29yZHx8Qi5kZWNvZGUoJycrYSkpIDwgKGIud29yZHx8Qi5kZWNvZGUoJycr
YikpPyAtMToxO1xuXHR9KTtcbn1cbmZ1bmN0aW9uIG1peChwLCBsKXsgLy8gVE9ETzogSU1QUk9WRSBQRVJGT1JNQU5DRSEhISEgbFtqXSA9IGkgaXMgNVgr
IGZhc3RlciB0aGFuIC5wdXNoKFxuXHRsID0gbCB8fCBwLmxpbWJvIHx8IFtdOyBwLmxpbWJvID0gbnVsbDtcblx0dmFyIGogPSAwLCBpLCBmID0gcC5mcm9t
O1xuXHR3aGlsZShpID0gbFtqKytdKXtcblx0XHRpZihnb3QoaS53b3JkLCBwKSl7XG5cdFx0XHRmW2dvdC5pXSA9IGk7IC8vIFRPRE86IFRyaWNrOiBhbGxv
dyBmb3IgYSBHVU4nUyBIQU0gQ1JEVCBob29rIGhlcmUuXG5cdFx0fSBlbHNlIHtcblx0XHRcdGYucHVzaChpKTsgXG5cdFx0fVxuXHR9XG5cdHJldHVybiBm
O1xufVxuXG5CLmVuY29kZSA9IGZ1bmN0aW9uKGQsIHMsIHUpeyBzID0gcyB8fCBcInxcIjsgdSA9IHUgfHwgU3RyaW5nLmZyb21DaGFyQ29kZSgzMik7XG5c
dHN3aXRjaCh0eXBlb2YgZCl7XG5cdFx0Y2FzZSAnc3RyaW5nJzogLy8gdGV4dFxuXHRcdFx0dmFyIGkgPSBkLmluZGV4T2YocyksIGMgPSAwO1xuXHRcdFx0
d2hpbGUoaSAhPSAtMSl7IGMrKzsgaSA9IGQuaW5kZXhPZihzLCBpKzEpIH1cblx0XHRcdHJldHVybiAoYz9zK2M6JycpKyAnXCInICsgZDtcblx0XHRjYXNl
ICdudW1iZXInOiByZXR1cm4gKGQgPCAwKT8gJycrZCA6ICcrJytkO1xuXHRcdGNhc2UgJ2Jvb2xlYW4nOiByZXR1cm4gZD8gJysnIDogJy0nO1xuXHRcdGNh
c2UgJ29iamVjdCc6IGlmKCFkKXsgcmV0dXJuICcgJyB9IC8vIFRPRE86IEJVRyEhISBOZXN0ZWQgb2JqZWN0cyBkb24ndCBzbG90IGNvcnJlY3RseVxuXHRc
dFx0dmFyIGwgPSBPYmplY3Qua2V5cyhkKS5zb3J0KCksIGkgPSAwLCB0ID0gcywgaywgdjtcblx0XHRcdHdoaWxlKGsgPSBsW2krK10peyB0ICs9IHUrQi5l
bmNvZGUoayxzLHUpK3UrQi5lbmNvZGUoZFtrXSxzLHUpK3UrcyB9XG5cdFx0XHRyZXR1cm4gdDtcblx0fVxufVxuQi5kZWNvZGUgPSBmdW5jdGlvbih0LCBz
KXsgcyA9IHMgfHwgXCJ8XCI7XG5cdGlmKCdzdHJpbmcnICE9IHR5cGVvZiB0KXsgcmV0dXJuIH1cblx0c3dpdGNoKHQpeyBjYXNlICcgJzogcmV0dXJuIG51
bGw7IGNhc2UgJy0nOiByZXR1cm4gZmFsc2U7IGNhc2UgJysnOiByZXR1cm4gdHJ1ZTsgfVxuXHRzd2l0Y2godFswXSl7XG5cdFx0Y2FzZSAnLSc6IGNhc2Ug
JysnOiByZXR1cm4gcGFyc2VGbG9hdCh0KTtcblx0XHRjYXNlICdcIic6IHJldHVybiB0LnNsaWNlKDEpO1xuXHR9XG5cdHJldHVybiB0LnNsaWNlKHQuaW5k
ZXhPZignXCInKSsxKTtcbn1cblxuQi5oYXNoID0gZnVuY3Rpb24ocywgYyl7IC8vIHZpYSBTT1xuXHRpZih0eXBlb2YgcyAhPT0gJ3N0cmluZycpeyByZXR1
cm4gfVxuICBjID0gYyB8fCAwOyAvLyBDUFUgc2NoZWR1bGUgaGFzaGluZyBieVxuICBpZighcy5sZW5ndGgpeyByZXR1cm4gYyB9XG4gIGZvcih2YXIgaT0w
LGw9cy5sZW5ndGgsbjsgaTxsOyArK2kpe1xuICAgIG4gPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgYyA9ICgoYzw8NSktYykrbjtcbiAgICBjIHw9IDA7XG4g
IH1cbiAgcmV0dXJuIGM7XG59XG5cbmZ1bmN0aW9uIHJlY29yZChrZXksIHZhbCl7IHJldHVybiBrZXkrQi5lbmNvZGUodmFsKStcIiVcIitrZXkubGVuZ3Ro
IH1cbmZ1bmN0aW9uIGRlY29yZCh0KXtcblx0dmFyIG8gPSB7fSwgaSA9IHQubGFzdEluZGV4T2YoXCIlXCIpLCBjID0gcGFyc2VGbG9hdCh0LnNsaWNlKGkr
MSkpO1xuXHRvW3Quc2xpY2UoMCxjKV0gPSBCLmRlY29kZSh0LnNsaWNlKGMsaSkpO1xuXHRyZXR1cm4gbztcbn1cblxudHJ5e19fZGVmYXVsdEV4cG9ydCA9
Qn1jYXRjaChlKXt9XG5cdFxufSgpKTtcbmV4cG9ydCBkZWZhdWx0IF9fZGVmYXVsdEV4cG9ydDsiLCJzcmMvdmFsaWQuanMiOiJsZXQgX19kZWZhdWx0RXhw
b3J0O1xuKGZ1bmN0aW9uKCl7XG5cbi8vIFZhbGlkIHZhbHVlcyBhcmUgYSBzdWJzZXQgb2YgSlNPTjogbnVsbCwgYmluYXJ5LCBudW1iZXIgKCFJbmZpbml0
eSksIHRleHQsXG4vLyBvciBhIHNvdWwgcmVsYXRpb24uIEFycmF5cyBuZWVkIHNwZWNpYWwgYWxnb3JpdGhtcyB0byBoYW5kbGUgY29uY3VycmVuY3ksXG4v
LyBzbyB0aGV5IGFyZSBub3Qgc3VwcG9ydGVkIGRpcmVjdGx5LiBVc2UgYW4gZXh0ZW5zaW9uIHRoYXQgc3VwcG9ydHMgdGhlbSBpZlxuLy8gbmVlZGVkIGJ1
dCByZXNlYXJjaCB0aGVpciBwcm9ibGVtcyBmaXJzdC5cbl9fZGVmYXVsdEV4cG9ydCA9IGZ1bmN0aW9uKHYpe1xuICAvLyBcImRlbGV0ZXNcIiwgbnVsbGlu
ZyBvdXQga2V5cy5cbiAgcmV0dXJuIHYgPT09IG51bGwgfHxcblx0XCJzdHJpbmdcIiA9PT0gdHlwZW9mIHYgfHxcblx0XCJib29sZWFuXCIgPT09IHR5cGVv
ZiB2IHx8XG5cdC8vIHdlIHdhbnQgKy8tIEluZmluaXR5IHRvIGJlLCBidXQgSlNPTiBkb2VzIG5vdCBzdXBwb3J0IGl0LCBzYWQgZmFjZS5cblx0Ly8gY2Fu
IHlvdSBndWVzcyB3aGF0IHYgPT09IHYgY2hlY2tzIGZvcj8gOylcblx0KFwibnVtYmVyXCIgPT09IHR5cGVvZiB2ICYmIHYgIT0gSW5maW5pdHkgJiYgdiAh
PSAtSW5maW5pdHkgJiYgdiA9PT0gdikgfHxcblx0KCEhdiAmJiBcInN0cmluZ1wiID09IHR5cGVvZiB2W1wiI1wiXSAmJiBPYmplY3Qua2V5cyh2KS5sZW5n
dGggPT09IDEgJiYgdltcIiNcIl0pO1xufVxuXHRcbn0oKSk7XG5leHBvcnQgZGVmYXVsdCBfX2RlZmF1bHRFeHBvcnQ7Iiwic3JjL3N0YXRlLmpzIjoiaW1w
b3J0ICcuL3NoaW0uanMnO1xuXG5sZXQgX19kZWZhdWx0RXhwb3J0O1xuKGZ1bmN0aW9uKCl7XG4gICAgZnVuY3Rpb24gU3RhdGUoKXtcbiAgICAgICAgdmFy
IHQgPSArbmV3IERhdGU7XG4gICAgICAgIGlmKGxhc3QgPCB0KXtcbiAgICAgICAgICAgIHJldHVybiBOID0gMCwgbGFzdCA9IHQgKyBTdGF0ZS5kcmlmdDtc
biAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGFzdCA9IHQgKyAoKE4gKz0gMSkgLyBEKSArIFN0YXRlLmRyaWZ0O1xuICAgIH1cbiAgICBTdGF0ZS5kcmlm
dCA9IDA7XG4gICAgdmFyIE5JID0gLUluZmluaXR5LCBOID0gMCwgRCA9IDk5OSwgbGFzdCA9IE5JLCB1OyAvLyBXQVJOSU5HISBJbiB0aGUgZnV0dXJlLCBv
biBtYWNoaW5lcyB0aGF0IGFyZSBEIHRpbWVzIGZhc3RlciB0aGFuIDIwMTZBRCBtYWNoaW5lcywgeW91IHdpbGwgd2FudCB0byBpbmNyZWFzZSBEIGJ5IGFu
b3RoZXIgc2V2ZXJhbCBvcmRlcnMgb2YgbWFnbml0dWRlIHNvIHRoZSBwcm9jZXNzaW5nIHNwZWVkIG5ldmVyIG91dCBwYWNlcyB0aGUgZGVjaW1hbCByZXNv
bHV0aW9uIChpbmNyZWFzaW5nIGFuIGludGVnZXIgZWZmZWN0cyB0aGUgc3RhdGUgYWNjdXJhY3kpLlxuICAgIFN0YXRlLmlzID0gZnVuY3Rpb24obiwgaywg
byl7IC8vIGNvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGdldCB0aGUgc3RhdGUgb24gYSBrZXkgb24gYSBub2RlIGFuZCByZXR1cm4gaXQuXG4gICAgICAgIHZh
ciB0bXAgPSAoayAmJiBuICYmIG4uXyAmJiBuLl9bJz4nXSkgfHwgbztcbiAgICAgICAgaWYoIXRtcCl7IHJldHVybiB9XG4gICAgICAgIHJldHVybiAoJ251
bWJlcicgPT0gdHlwZW9mICh0bXAgPSB0bXBba10pKT8gdG1wIDogTkk7XG4gICAgfVxuICAgIFN0YXRlLmlmeSA9IGZ1bmN0aW9uKG4sIGssIHMsIHYsIHNv
dWwpeyAvLyBwdXQgYSBrZXkncyBzdGF0ZSBvbiBhIG5vZGUuXG4gICAgICAgIChuID0gbiB8fCB7fSkuXyA9IG4uXyB8fCB7fTsgLy8gc2FmZXR5IGNoZWNr
IG9yIGluaXQuXG4gICAgICAgIGlmKHNvdWwpeyBuLl9bJyMnXSA9IHNvdWwgfSAvLyBzZXQgYSBzb3VsIGlmIHNwZWNpZmllZC5cbiAgICAgICAgdmFyIHRt
cCA9IG4uX1snPiddIHx8IChuLl9bJz4nXSA9IHt9KTsgLy8gZ3JhYiB0aGUgc3RhdGVzIGRhdGEuXG4gICAgICAgIGlmKHUgIT09IGsgJiYgayAhPT0gJ18n
KXtcbiAgICAgICAgICAgIGlmKCdudW1iZXInID09IHR5cGVvZiBzKXsgdG1wW2tdID0gcyB9IC8vIGFkZCB0aGUgdmFsaWQgc3RhdGUuXG4gICAgICAgICAg
ICBpZih1ICE9PSB2KXsgbltrXSA9IHYgfSAvLyBOb3RlOiBOb3QgaXRzIGpvYiB0byBjaGVjayBmb3IgdmFsaWQgdmFsdWVzIVxuICAgICAgICB9XG4gICAg
ICAgIHJldHVybiBuO1xuICAgIH1cbiAgICBfX2RlZmF1bHRFeHBvcnQgPSBTdGF0ZTtcbn0oKSk7XG5leHBvcnQgZGVmYXVsdCBfX2RlZmF1bHRFeHBvcnQ7
Iiwic3JjL2R1cC5qcyI6ImltcG9ydCAnLi9zaGltLmpzJztcblxubGV0IF9fZGVmYXVsdEV4cG9ydDtcbihmdW5jdGlvbigpe1xuICAgIGZ1bmN0aW9uIER1
cChvcHQpe1xuICAgICAgICB2YXIgZHVwID0ge3M6e319LCBzID0gZHVwLnM7XG4gICAgICAgIG9wdCA9IG9wdCB8fCB7bWF4OiA5OTksIGFnZTogMTAwMCAq
IDl9Oy8vKi8gMTAwMCAqIDkgKiAzfTtcbiAgICAgICAgZHVwLmNoZWNrID0gZnVuY3Rpb24oaWQpe1xuICAgICAgICAgICAgaWYoIXNbaWRdKXsgcmV0dXJu
IGZhbHNlIH1cbiAgICAgICAgICAgIHJldHVybiBkdChpZCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGR0ID0gZHVwLnRyYWNrID0gZnVuY3Rpb24oaWQp
e1xuICAgICAgICAgICAgdmFyIGl0ID0gc1tpZF0gfHwgKHNbaWRdID0ge30pO1xuICAgICAgICAgICAgaXQud2FzID0gZHVwLm5vdyA9ICtuZXcgRGF0ZTtc
biAgICAgICAgICAgIGlmKCFkdXAudG8peyBkdXAudG8gPSBzZXRUaW1lb3V0KGR1cC5kcm9wLCBvcHQuYWdlICsgOSkgfVxuICAgICAgICAgICAgaWYoZHQu
ZWQpeyBkdC5lZChpZCkgfVxuICAgICAgICAgICAgcmV0dXJuIGl0O1xuICAgICAgICB9XG4gICAgICAgIGR1cC5kcm9wID0gZnVuY3Rpb24oYWdlKXtcbiAg
ICAgICAgICAgIGR1cC50byA9IG51bGw7XG4gICAgICAgICAgICBkdXAubm93ID0gK25ldyBEYXRlO1xuICAgICAgICAgICAgdmFyIGwgPSBPYmplY3Qua2V5
cyhzKTtcbiAgICAgICAgICAgIGNvbnNvbGUuU1RBVCAmJiBjb25zb2xlLlNUQVQoZHVwLm5vdywgK25ldyBEYXRlIC0gZHVwLm5vdywgJ2R1cCBkcm9wIGtl
eXMnKTsgLy8gcHJldiB+MjAlIENQVSA3JSBSQU0gMzAwTUIgLy8gbm93IH4yNSUgQ1BVIDclIFJBTSA1MDBNQlxuICAgICAgICAgICAgc2V0VGltZW91dC5l
YWNoKGwsIGZ1bmN0aW9uKGlkKXsgdmFyIGl0ID0gc1tpZF07IC8vIFRPRE86IC5rZXlzKCBpcyBzbG93P1xuICAgICAgICAgICAgICAgIGlmKGl0ICYmIChh
Z2UgfHwgb3B0LmFnZSkgPiAoZHVwLm5vdyAtIGl0LndhcykpeyByZXR1cm4gfVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBzW2lkXTtcbiAgICAgICAgICAg
IH0sMCw5OSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGR1cDtcbiAgICB9XG4gICAgX19kZWZhdWx0RXhwb3J0ID0gRHVwO1xufSgpKTtcbmV4cG9y
dCBkZWZhdWx0IF9fZGVmYXVsdEV4cG9ydDsiLCJzcmMvYXNrLmpzIjoiaW1wb3J0ICcuL29udG8uanMnO1xuXG5sZXQgX19kZWZhdWx0RXhwb3J0O1xuKGZ1
bmN0aW9uKCl7XG4gICAgX19kZWZhdWx0RXhwb3J0ID0gZnVuY3Rpb24gYXNrKGNiLCBhcyl7XG4gICAgICAgIGlmKCF0aGlzLm9uKXsgcmV0dXJuIH1cbiAg
ICAgICAgdmFyIGxhY2sgPSAodGhpcy5vcHR8fHt9KS5sYWNrIHx8IDkwMDA7XG4gICAgICAgIGlmKCEoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgY2IpKXtcbiAg
ICAgICAgICAgIGlmKCFjYil7IHJldHVybiB9XG4gICAgICAgICAgICB2YXIgaWQgPSBjYlsnIyddIHx8IGNiLCB0bXAgPSAodGhpcy50YWd8fCcnKVtpZF07
XG4gICAgICAgICAgICBpZighdG1wKXsgcmV0dXJuIH1cbiAgICAgICAgICAgIGlmKGFzKXtcbiAgICAgICAgICAgICAgICB0bXAgPSB0aGlzLm9uKGlkLCBh
cyk7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRtcC5lcnIpO1xuICAgICAgICAgICAgICAgIHRtcC5lcnIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9u
KCl7IHRtcC5vZmYoKSB9LCBsYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBp
ZCA9IChhcyAmJiBhc1snIyddKSB8fCByYW5kb20oOSk7XG4gICAgICAgIGlmKCFjYil7IHJldHVybiBpZCB9XG4gICAgICAgIHZhciB0byA9IHRoaXMub24o
aWQsIGNiLCBhcyk7XG4gICAgICAgIHRvLmVyciA9IHRvLmVyciB8fCBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IHRvLm9mZigpO1xuICAgICAgICAgICAgdG8u
bmV4dCh7ZXJyOiBcIkVycm9yOiBObyBBQ0sgeWV0LlwiLCBsYWNrOiB0cnVlfSk7XG4gICAgICAgIH0sIGxhY2spO1xuICAgICAgICByZXR1cm4gaWQ7XG4g
ICAgfVxuICAgIHZhciByYW5kb20gPSBTdHJpbmcucmFuZG9tIHx8IGZ1bmN0aW9uKCl7IHJldHVybiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGlj
ZSgyKSB9XG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgX19kZWZhdWx0RXhwb3J0OyIsInNyYy9yb290LmpzIjoiaW1wb3J0ICcuL3NoaW0uanMnO1xuaW1wb3J0
IF9fdmFsaWQgZnJvbSAnLi92YWxpZC5qcyc7XG5pbXBvcnQgX19zdGF0ZSBmcm9tICcuL3N0YXRlLmpzJztcbmltcG9ydCBfX29udG8gZnJvbSAnLi9vbnRv
LmpzJztcbmltcG9ydCBfX2R1cCBmcm9tICcuL2R1cC5qcyc7XG5pbXBvcnQgX19hc2sgZnJvbSAnLi9hc2suanMnO1xuXG5sZXQgX19kZWZhdWx0RXhwb3J0
O1xuKGZ1bmN0aW9uKCl7XG4gICAgZnVuY3Rpb24gR3VuKG8pe1xuICAgICAgICBpZihvIGluc3RhbmNlb2YgR3VuKXsgcmV0dXJuICh0aGlzLl8gPSB7JDog
dGhpc30pLiQgfVxuICAgICAgICBpZighKHRoaXMgaW5zdGFuY2VvZiBHdW4pKXsgcmV0dXJuIG5ldyBHdW4obykgfVxuICAgICAgICByZXR1cm4gR3VuLmNy
ZWF0ZSh0aGlzLl8gPSB7JDogdGhpcywgb3B0OiBvfSk7XG4gICAgfVxuXG4gICAgR3VuLmlzID0gZnVuY3Rpb24oJCl7IHJldHVybiAoJCBpbnN0YW5jZW9m
IEd1bikgfHwgKCQgJiYgJC5fICYmICgkID09PSAkLl8uJCkpIHx8IGZhbHNlIH1cblxuICAgIEd1bi52ZXJzaW9uID0gMC4yMDIwO1xuXG4gICAgR3VuLmNo
YWluID0gR3VuLnByb3RvdHlwZTtcbiAgICBHdW4uY2hhaW4udG9KU09OID0gZnVuY3Rpb24oKXt9O1xuXG4gICAgR3VuLnZhbGlkID0gX192YWxpZDtcbiAg
ICBHdW4uc3RhdGUgPSBfX3N0YXRlO1xuICAgIEd1bi5vbiA9IF9fb250bztcbiAgICBHdW4uZHVwID0gX19kdXA7XG4gICAgR3VuLmFzayA9IF9fYXNrO1xu
XG4gICAgKGZ1bmN0aW9uKCl7XG4gICAgICAgIEd1bi5jcmVhdGUgPSBmdW5jdGlvbihhdCl7XG4gICAgICAgICAgICBhdC5yb290ID0gYXQucm9vdCB8fCBh
dDtcbiAgICAgICAgICAgIGF0LmdyYXBoID0gYXQuZ3JhcGggfHwge307XG4gICAgICAgICAgICBhdC5vbiA9IGF0Lm9uIHx8IEd1bi5vbjtcbiAgICAgICAg
ICAgIGF0LmFzayA9IGF0LmFzayB8fCBHdW4uYXNrO1xuICAgICAgICAgICAgYXQuZHVwID0gYXQuZHVwIHx8IEd1bi5kdXAoKTtcbiAgICAgICAgICAgIHZh
ciBndW4gPSBhdC4kLm9wdChhdC5vcHQpO1xuICAgICAgICAgICAgaWYoIWF0Lm9uY2Upe1xuICAgICAgICAgICAgICAgIGF0Lm9uKCdpbicsIHVuaXZlcnNl
LCBhdCk7XG4gICAgICAgICAgICAgICAgYXQub24oJ291dCcsIHVuaXZlcnNlLCBhdCk7XG4gICAgICAgICAgICAgICAgYXQub24oJ3B1dCcsIG1hcCwgYXQp
O1xuICAgICAgICAgICAgICAgIEd1bi5vbignY3JlYXRlJywgYXQpO1xuICAgICAgICAgICAgICAgIGF0Lm9uKCdjcmVhdGUnLCBhdCk7XG4gICAgICAgICAg
ICB9XG4gICAgICAgICAgICBhdC5vbmNlID0gMTtcbiAgICAgICAgICAgIHJldHVybiBndW47XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdW5pdmVy
c2UobXNnKXtcbiAgICAgICAgICAgIC8vIFRPRE86IEJVRyEgbXNnLm91dCA9IG51bGwgYmVpbmcgc2V0IVxuICAgICAgICAgICAgLy9pZighRil7IHZhciBl
dmUgPSB0aGlzOyBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IHVuaXZlcnNlLmNhbGwoZXZlLCBtc2csMSkgfSxNYXRoLnJhbmRvbSgpICogMTAwKTtyZXR1cm47
IH0gLy8gQUREIEYgVE8gUEFSQU1TIVxuICAgICAgICAgICAgaWYoIW1zZyl7IHJldHVybiB9XG4gICAgICAgICAgICBpZihtc2cub3V0ID09PSB1bml2ZXJz
ZSl7IHRoaXMudG8ubmV4dChtc2cpOyByZXR1cm4gfVxuICAgICAgICAgICAgdmFyIGV2ZSA9IHRoaXMsIGFzID0gZXZlLmFzLCBhdCA9IGFzLmF0IHx8IGFz
LCBndW4gPSBhdC4kLCBkdXAgPSBhdC5kdXAsIHRtcCwgREJHID0gbXNnLkRCRztcbiAgICAgICAgICAgICh0bXAgPSBtc2dbJyMnXSkgfHwgKHRtcCA9IG1z
Z1snIyddID0gdGV4dF9yYW5kKDkpKTtcbiAgICAgICAgICAgIGlmKGR1cC5jaGVjayh0bXApKXsgcmV0dXJuIH0gZHVwLnRyYWNrKHRtcCk7XG4gICAgICAg
ICAgICB0bXAgPSBtc2cuXzsgbXNnLl8gPSAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgdG1wKT8gdG1wIDogZnVuY3Rpb24oKXt9O1xuICAgICAgICAgICAgKG1z
Zy4kICYmIChtc2cuJCA9PT0gKG1zZy4kLl98fCcnKS4kKSkgfHwgKG1zZy4kID0gZ3VuKTtcbiAgICAgICAgICAgIGlmKG1zZ1snQCddICYmICFtc2cucHV0
KXsgYWNrKG1zZykgfVxuICAgICAgICAgICAgaWYoIWF0LmFzayhtc2dbJ0AnXSwgbXNnKSl7IC8vIGlzIHRoaXMgbWFjaGluZSBsaXN0ZW5pbmcgZm9yIGFu
IGFjaz9cbiAgICAgICAgICAgICAgICBEQkcgJiYgKERCRy51ID0gK25ldyBEYXRlKTtcbiAgICAgICAgICAgICAgICBpZihtc2cucHV0KXsgcHV0KG1zZyk7
IHJldHVybiB9IGVsc2VcbiAgICAgICAgICAgICAgICBpZihtc2cuZ2V0KXsgR3VuLm9uLmdldChtc2csIGd1bikgfVxuICAgICAgICAgICAgfVxuICAgICAg
ICAgICAgREJHICYmIChEQkcudWMgPSArbmV3IERhdGUpO1xuICAgICAgICAgICAgZXZlLnRvLm5leHQobXNnKTtcbiAgICAgICAgICAgIERCRyAmJiAoREJH
LnVhID0gK25ldyBEYXRlKTtcbiAgICAgICAgICAgIGlmKG1zZy5udHMgfHwgbXNnLk5UUyl7IHJldHVybiB9IC8vIFRPRE86IFRoaXMgc2hvdWxkbid0IGJl
IGluIGNvcmUsIGJ1dCBmYXN0IHdheSB0byBwcmV2ZW50IE5UUyBzcHJlYWQuIERlbGV0ZSB0aGlzIGxpbmUgYWZ0ZXIgYWxsIHBlZXJzIGhhdmUgdXBncmFk
ZWQgdG8gbmV3ZXIgdmVyc2lvbnMuXG4gICAgICAgICAgICBtc2cub3V0ID0gdW5pdmVyc2U7IGF0Lm9uKCdvdXQnLCBtc2cpO1xuICAgICAgICAgICAgREJH
ICYmIChEQkcudWUgPSArbmV3IERhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHB1dChtc2cpe1xuICAgICAgICAgICAgaWYoIW1zZyl7IHJl
dHVybiB9XG4gICAgICAgICAgICB2YXIgY3R4ID0gbXNnLl98fCcnLCByb290ID0gY3R4LnJvb3QgPSAoKGN0eC4kID0gbXNnLiR8fCcnKS5ffHwnJykucm9v
dDtcbiAgICAgICAgICAgIGlmKG1zZ1snQCddICYmIGN0eC5mYWl0aCAmJiAhY3R4Lm1pc3MpeyAvLyBUT0RPOiBBWEUgbWF5IHNwbGl0L3JvdXRlIGJhc2Vk
IG9uICdwdXQnIHdoYXQgc2hvdWxkIHdlIGRvIGhlcmU/IERldGVjdCBAIGluIEFYRT8gSSB0aGluayB3ZSBkb24ndCBoYXZlIHRvIHdvcnJ5LCBhcyBEQU0g
d2lsbCByb3V0ZSBpdCBvbiBALlxuICAgICAgICAgICAgICAgIG1zZy5vdXQgPSB1bml2ZXJzZTtcbiAgICAgICAgICAgICAgICByb290Lm9uKCdvdXQnLCBt
c2cpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN0eC5sYXRjaCA9IHJvb3QuaGF0Y2g7IGN0eC5tYXRj
aCA9IHJvb3QuaGF0Y2ggPSBbXTtcbiAgICAgICAgICAgIHZhciBwdXQgPSBtc2cucHV0O1xuICAgICAgICAgICAgdmFyIERCRyA9IGN0eC5EQkcgPSBtc2cu
REJHLCBTID0gK25ldyBEYXRlOyBDVCA9IENUIHx8IFM7XG4gICAgICAgICAgICBpZihwdXRbJyMnXSAmJiBwdXRbJy4nXSl7IC8qcm9vdCAmJiByb290Lm9u
KCdwdXQnLCBtc2cpOyovIHJldHVybiB9IC8vIFRPRE86IEJVRyEgVGhpcyBuZWVkcyB0byBjYWxsIEhBTSBpbnN0ZWFkLlxuICAgICAgICAgICAgREJHICYm
IChEQkcucCA9IFMpO1xuICAgICAgICAgICAgY3R4WycjJ10gPSBtc2dbJyMnXTtcbiAgICAgICAgICAgIGN0eC5tc2cgPSBtc2c7XG4gICAgICAgICAgICBj
dHguYWxsID0gMDtcbiAgICAgICAgICAgIGN0eC5zdHVuID0gMTtcbiAgICAgICAgICAgIHZhciBubCA9IE9iamVjdC5rZXlzKHB1dCk7Ly8uc29ydCgpOyAv
LyBUT0RPOiBUaGlzIGlzIHVuYm91bmRlZCBvcGVyYXRpb24sIGxhcmdlIGdyYXBocyB3aWxsIGJlIHNsb3dlci4gV3JpdGUgb3VyIG93biBDUFUgc2NoZWR1
bGVkIHNvcnQ/IE9yIHNvbWVob3cgZG8gaXQgaW4gYmVsb3c/IEtleXMgaXRzZWxmIGlzIG5vdCBPKDEpIGVpdGhlciwgY3JlYXRlIEVTNSBzaGltIG92ZXIg
P3dlYWsgbWFwPyBvciBjdXN0b20gd2hpY2ggaXMgY29uc3RhbnQuXG4gICAgICAgICAgICBjb25zb2xlLlNUQVQgJiYgY29uc29sZS5TVEFUKFMsICgoREJH
fHxjdHgpLnBrID0gK25ldyBEYXRlKSAtIFMsICdwdXQgc29ydCcpO1xuICAgICAgICAgICAgdmFyIG5pID0gMCwgbmosIGtsLCBzb3VsLCBub2RlLCBzdGF0
ZXMsIGVyciwgdG1wO1xuICAgICAgICAgICAgKGZ1bmN0aW9uIHBvcChvKXtcbiAgICAgICAgICAgICAgICBpZihuaiAhPSBuaSl7IG5qID0gbmk7XG4gICAg
ICAgICAgICAgICAgICAgIGlmKCEoc291bCA9IG5sW25pXSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5TVEFUICYmIGNvbnNvbGUuU1RB
VChTLCAoKERCR3x8Y3R4KS5wZCA9ICtuZXcgRGF0ZSkgLSBTLCAncHV0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJlKGN0eCk7XG4gICAgICAg
ICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYoIShub2RlID0gcHV0W3NvdWxd
KSl7IGVyciA9IEVSUitjdXQoc291bCkrXCJubyBub2RlLlwiIH0gZWxzZVxuICAgICAgICAgICAgICAgICAgICBpZighKHRtcCA9IG5vZGUuXykpeyBlcnIg
PSBFUlIrY3V0KHNvdWwpK1wibm8gbWV0YS5cIiB9IGVsc2VcbiAgICAgICAgICAgICAgICAgICAgaWYoc291bCAhPT0gdG1wWycjJ10peyBlcnIgPSBFUlIr
Y3V0KHNvdWwpK1wic291bCBub3Qgc2FtZS5cIiB9IGVsc2VcbiAgICAgICAgICAgICAgICAgICAgaWYoIShzdGF0ZXMgPSB0bXBbJz4nXSkpeyBlcnIgPSBF
UlIrY3V0KHNvdWwpK1wibm8gc3RhdGUuXCIgfVxuICAgICAgICAgICAgICAgICAgICBrbCA9IE9iamVjdC5rZXlzKG5vZGV8fHt9KTsgLy8gVE9ETzogLmtl
eXMoIGlzIHNsb3dcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgbXNnLmVyciA9IGN0
eC5lcnIgPSBlcnI7IC8vIGludmFsaWQgZGF0YSBzaG91bGQgZXJyb3IgYW5kIHN0dW4gdGhlIG1lc3NhZ2UuXG4gICAgICAgICAgICAgICAgICAgIGZpcmUo
Y3R4KTtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImhhbmRsZSBlcnJvciFcIiwgZXJyKSAvLyBoYW5kbGUhXG4gICAgICAgICAgICAg
ICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGkgPSAwLCBrZXk7IG8gPSBvIHx8IDA7XG4gICAgICAgICAg
ICAgICAgd2hpbGUobysrIDwgOSAmJiAoa2V5ID0ga2xbaSsrXSkpe1xuICAgICAgICAgICAgICAgICAgICBpZignXycgPT09IGtleSl7IGNvbnRpbnVlIH1c
biAgICAgICAgICAgICAgICAgICAgdmFyIHZhbCA9IG5vZGVba2V5XSwgc3RhdGUgPSBzdGF0ZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgaWYodSA9
PT0gc3RhdGUpeyBlcnIgPSBFUlIrY3V0KGtleSkrXCJvblwiK2N1dChzb3VsKStcIm5vIHN0YXRlLlwiOyBicmVhayB9XG4gICAgICAgICAgICAgICAgICAg
IGlmKCF2YWxpZCh2YWwpKXsgZXJyID0gRVJSK2N1dChrZXkpK1wib25cIitjdXQoc291bCkrXCJiYWQgXCIrKHR5cGVvZiB2YWwpK2N1dCh2YWwpOyBicmVh
ayB9XG4gICAgICAgICAgICAgICAgICAgIC8vY3R4LmFsbCsrOyAvL2N0eC5hY2tbc291bCtrZXldID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGhhbSh2
YWwsIGtleSwgc291bCwgc3RhdGUsIG1zZyk7XG4gICAgICAgICAgICAgICAgICAgICsrQzsgLy8gY291cnRlc3kgY291bnQ7XG4gICAgICAgICAgICAgICAg
fVxuICAgICAgICAgICAgICAgIGlmKChrbCA9IGtsLnNsaWNlKGkpKS5sZW5ndGgpeyB0dXJuKHBvcCk7IHJldHVybiB9XG4gICAgICAgICAgICAgICAgKytu
aTsga2wgPSBudWxsOyBwb3Aobyk7XG4gICAgICAgICAgICB9KCkpO1xuICAgICAgICB9IEd1bi5vbi5wdXQgPSBwdXQ7XG4gICAgICAgIC8vIFRPRE86IE1B
UkshISEgY2xvY2sgYmVsb3csIHJlY29ubmVjdCBzeW5jLCBTRUEgY2VydGlmeSB3aXJlIG1lcmdlLCBVc2VyLmF1dGggdGFraW5nIG11bHRpcGxlIHRpbWVz
LCAvLyBtc2cgcHV0LCBwdXQsIHNheSBhY2ssIGhlYXIgbG9vcC4uLlxuICAgICAgICAvLyBXQVNJUyBCVUchIGxvY2FsIHBlZXIgbm90IGFjay4gLm9mZiBv
dGhlciBwZW9wbGU6IC5vcGVuXG4gICAgICAgIGZ1bmN0aW9uIGhhbSh2YWwsIGtleSwgc291bCwgc3RhdGUsIG1zZyl7XG4gICAgICAgICAgICB2YXIgY3R4
ID0gbXNnLl98fCcnLCByb290ID0gY3R4LnJvb3QsIGdyYXBoID0gcm9vdC5ncmFwaCwgbG90LCB0bXA7XG4gICAgICAgICAgICB2YXIgdmVydGV4ID0gZ3Jh
cGhbc291bF0gfHwgZW1wdHksIHdhcyA9IHN0YXRlX2lzKHZlcnRleCwga2V5LCAxKSwga25vd24gPSB2ZXJ0ZXhba2V5XTtcbiAgICAgICAgICAgIFxuICAg
ICAgICAgICAgdmFyIERCRyA9IGN0eC5EQkc7IGlmKHRtcCA9IGNvbnNvbGUuU1RBVCl7IGlmKCFncmFwaFtzb3VsXSB8fCAha25vd24peyB0bXAuaGFzID0g
KHRtcC5oYXMgfHwgMCkgKyAxIH0gfVxuXG4gICAgICAgICAgICB2YXIgbm93ID0gU3RhdGUoKSwgdTtcbiAgICAgICAgICAgIGlmKHN0YXRlID4gbm93KXtc
biAgICAgICAgICAgICAgICBpZigodG1wID0gc3RhdGUgLSBub3cpID4gSGFtLm1heCl7XG4gICAgICAgICAgICAgICAgICAgIG1zZy5lcnIgPSBjdHguZXJy
ID0gRVJSK2N1dChrZXkpK1wib25cIitjdXQoc291bCkrXCJzdGF0ZSB0b28gZmFyIGluIGZ1dHVyZS5cIjsgZmlyZShjdHgpOyBiYWNrKGN0eCk7IHJldHVy
bjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpeyBoYW0odmFsLCBrZXksIHNvdWwsIHN0YXRlLCBt
c2cpIH0sIHRtcCA+IE1EPyBNRCA6IHRtcCk7IC8vIE1heCBEZWZlciAzMmJpdC4gOihcbiAgICAgICAgICAgICAgICBjb25zb2xlLlNUQVQgJiYgY29uc29s
ZS5TVEFUKCgoREJHfHxjdHgpLkhmID0gK25ldyBEYXRlKSwgdG1wLCAnZnV0dXJlJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAg
fVxuICAgICAgICAgICAgaWYoc3RhdGUgPCB3YXMpeyAvKm9sZDsqLyBpZih0cnVlIHx8ICFjdHgubWlzcyl7IHJldHVybiB9IH0gLy8gYnV0IHNvbWUgY2hh
aW5zIGhhdmUgYSBjYWNoZSBtaXNzIHRoYXQgbmVlZCB0byByZS1maXJlLiAvLyBUT0RPOiBJbXByb3ZlIGluIGZ1dHVyZS4gLy8gZm9yIEFYRSB0aGlzIHdv
dWxkIHJlZHVjZSByZWJyb2FkY2FzdCwgYnV0IEdVTiBkb2VzIGl0IG9uIG1lc3NhZ2UgZm9yd2FyZGluZy4gLy8gVFVSTlMgT1VUIENBQ0hFIE1JU1MgV0FT
IE5PVCBORUVERUQgRk9SIE5FVyBDSEFJTlMgQU5ZTU9SRSEhISBEQU5HRVIgREFOR0VSIERBTkdFUiwgQUxXQVlTIFJFVFVSTiEgKG9yIGFtIEkgbWlzc2lu
ZyBzb21ldGhpbmc/KVxuICAgICAgICAgICAgaWYoIWN0eC5mYWl0aCl7IC8vIFRPRE86IEJVRz8gQ2FuIHRoaXMgYmUgdXNlZCBmb3IgY2FjaGUgbWlzcyBh
cyB3ZWxsPyAvLyBZZXMgdGhpcyB3YXMgYSBidWcsIG5lZWQgdG8gY2hlY2sgY2FjaGUgbWlzcyBmb3IgUkFEIHRlc3RzLCBidXQgc2hvdWxkIHdlIGNhcmUg
YWJvdXQgdGhlIGZhaXRoIGNoZWNrIG5vdz8gUHJvYmFibHkgbm90LlxuICAgICAgICAgICAgICAgIGlmKHN0YXRlID09PSB3YXMgJiYgKHZhbCA9PT0ga25v
d24gfHwgTCh2YWwpIDw9IEwoa25vd24pKSl7IC8qY29uc29sZS5sb2coXCJzYW1lXCIpOyovIC8qc2FtZTsqLyBpZighY3R4Lm1pc3MpeyByZXR1cm4gfSB9
IC8vIHNhbWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN0eC5zdHVuKys7IC8vIFRPRE86ICdmb3JnZXQnIGZlYXR1cmUgaW4gU0VBIHRpZWQgdG8g
dGhpcywgYmFkIGFwcHJvYWNoLCBidXQgaGFja2VkIGluIGZvciBub3cuIEFueSBjaGFuZ2VzIGhlcmUgbXVzdCB1cGRhdGUgdGhlcmUuXG4gICAgICAgICAg
ICB2YXIgYWlkID0gbXNnWycjJ10rY3R4LmFsbCsrLCBpZCA9IHt0b1N0cmluZzogZnVuY3Rpb24oKXsgcmV0dXJuIGFpZCB9LCBfOiBjdHh9OyBpZC50b0pT
T04gPSBpZC50b1N0cmluZzsgLy8gdGhpcyAqdHJpY2sqIG1ha2VzIGl0IGNvbXBhdGlibGUgYmV0d2VlbiBvbGQgJiBuZXcgdmVyc2lvbnMuXG4gICAgICAg
ICAgICByb290LmR1cC50cmFjayhpZClbJyMnXSA9IG1zZ1snIyddOyAvLyBmaXhlcyBuZXcgT0sgYWNrcyBmb3IgUlBDIGxpa2UgUlRDLlxuICAgICAgICAg
ICAgREJHICYmIChEQkcucGggPSBEQkcucGggfHwgK25ldyBEYXRlKTtcbiAgICAgICAgICAgIHJvb3Qub24oJ3B1dCcsIHsnIyc6IGlkLCAnQCc6IG1zZ1sn
QCddLCBwdXQ6IHsnIyc6IHNvdWwsICcuJzoga2V5LCAnOic6IHZhbCwgJz4nOiBzdGF0ZX0sIG9rOiBtc2cub2ssIF86IGN0eH0pO1xuICAgICAgICB9XG4g
ICAgICAgIGZ1bmN0aW9uIG1hcChtc2cpe1xuICAgICAgICAgICAgdmFyIERCRzsgaWYoREJHID0gKG1zZy5ffHwnJykuREJHKXsgREJHLnBhID0gK25ldyBE
YXRlOyBEQkcucG0gPSBEQkcucG0gfHwgK25ldyBEYXRlfVxuICAgICAgICAgICAgdmFyIGV2ZSA9IHRoaXMsIHJvb3QgPSBldmUuYXMsIGdyYXBoID0gcm9v
dC5ncmFwaCwgY3R4ID0gbXNnLl8sIHB1dCA9IG1zZy5wdXQsIHNvdWwgPSBwdXRbJyMnXSwga2V5ID0gcHV0WycuJ10sIHZhbCA9IHB1dFsnOiddLCBzdGF0
ZSA9IHB1dFsnPiddLCBpZCA9IG1zZ1snIyddLCB0bXA7XG4gICAgICAgICAgICBpZigodG1wID0gY3R4Lm1zZykgJiYgKHRtcCA9IHRtcC5wdXQpICYmICh0
bXAgPSB0bXBbc291bF0pKXsgc3RhdGVfaWZ5KHRtcCwga2V5LCBzdGF0ZSwgdmFsLCBzb3VsKSB9IC8vIG5lY2Vzc2FyeSEgb3IgZWxzZSBvdXQgbWVzc2Fn
ZXMgZG8gbm90IGdldCBTRUEgdHJhbnNmb3Jtcy5cbiAgICAgICAgICAgIC8vdmFyIGJ5dGVzID0gKChncmFwaFtzb3VsXXx8JycpW2tleV18fCcnKS5sZW5n
dGh8fDE7XG4gICAgICAgICAgICBncmFwaFtzb3VsXSA9IHN0YXRlX2lmeShncmFwaFtzb3VsXSwga2V5LCBzdGF0ZSwgdmFsLCBzb3VsKTtcbiAgICAgICAg
ICAgIGlmKHRtcCA9IChyb290Lm5leHR8fCcnKVtzb3VsXSl7XG4gICAgICAgICAgICAgICAgLy90bXAuYnl0ZXMgPSAodG1wLmJ5dGVzfHwwKSArICgodmFs
fHwnJykubGVuZ3RofHwxKSAtIGJ5dGVzO1xuICAgICAgICAgICAgICAgIC8vaWYodG1wLmJ5dGVzID4gMioqMTMpeyBHdW4ubG9nLm9uY2UoJ2J5dGUtbGlt
aXQnLCBcIk5vdGU6IEluIHRoZSBmdXR1cmUsIEdVTiBwZWVycyB3aWxsIGVuZm9yY2UgYSB+NEtCIHF1ZXJ5IGxpbWl0LiBQbGVhc2Ugc2VlIGh0dHBzOi8v
Z3VuLmVjby9kb2NzL1BhZ2VcIikgfVxuICAgICAgICAgICAgICAgIHRtcC5vbignaW4nLCBtc2cpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaXJl
KGN0eCk7XG4gICAgICAgICAgICBldmUudG8ubmV4dChtc2cpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGZpcmUoY3R4LCBtc2cpeyB2YXIgcm9v
dDtcbiAgICAgICAgICAgIGlmKGN0eC5zdG9wKXsgcmV0dXJuIH1cbiAgICAgICAgICAgIGlmKDAgPCAtLWN0eC5zdHVuICYmICFjdHguZXJyKXsgcmV0dXJu
IH0gLy8gZGVjcmVtZW50IGFsd2F5cyBydW5zOyBlYXJseS1yZXR1cm4gb25seSBpZiBzdHVuIHN0aWxsIHBvc2l0aXZlIEFORCBubyBlcnJvci5cbiAgICAg
ICAgICAgIGN0eC5zdG9wID0gMTtcbiAgICAgICAgICAgIGlmKCEocm9vdCA9IGN0eC5yb290KSl7IHJldHVybiB9XG4gICAgICAgICAgICB2YXIgdG1wID0g
Y3R4Lm1hdGNoOyB0bXAuZW5kID0gMTtcbiAgICAgICAgICAgIGlmKHRtcCA9PT0gcm9vdC5oYXRjaCl7IGlmKCEodG1wID0gY3R4LmxhdGNoKSB8fCB0bXAu
ZW5kKXsgZGVsZXRlIHJvb3QuaGF0Y2ggfSBlbHNlIHsgcm9vdC5oYXRjaCA9IHRtcCB9IH1cbiAgICAgICAgICAgIGN0eC5oYXRjaCAmJiBjdHguaGF0Y2go
KTsgLy8gVE9ETzogcmVuYW1lL3Jld29yayBob3cgcHV0ICYgdGhpcyBpbnRlcmFjdC5cbiAgICAgICAgICAgIHNldFRpbWVvdXQuZWFjaChjdHgubWF0Y2gs
IGZ1bmN0aW9uKGNiKXtjYiAmJiBjYigpfSk7IFxuICAgICAgICAgICAgaWYoIShtc2cgPSBjdHgubXNnKSB8fCBjdHguZXJyIHx8IG1zZy5lcnIpeyByZXR1
cm4gfVxuICAgICAgICAgICAgbXNnLm91dCA9IHVuaXZlcnNlO1xuICAgICAgICAgICAgY3R4LnJvb3Qub24oJ291dCcsIG1zZyk7XG5cbiAgICAgICAgICAg
IENGKCk7IC8vIGNvdXJ0ZXN5IGNoZWNrO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGFjayhtc2cpeyAvLyBhZ2dyZWdhdGUgQUNLcy5cbiAgICAg
ICAgICAgIHZhciBpZCA9IG1zZ1snQCddIHx8ICcnLCBjdHgsIG9rLCB0bXA7XG4gICAgICAgICAgICBpZighKGN0eCA9IGlkLl8pKXtcbiAgICAgICAgICAg
ICAgICB2YXIgZHVwID0gKGR1cCA9IG1zZy4kKSAmJiAoZHVwID0gZHVwLl8pICYmIChkdXAgPSBkdXAucm9vdCkgJiYgKGR1cCA9IGR1cC5kdXApO1xuICAg
ICAgICAgICAgICAgIGlmKCEoZHVwID0gZHVwLmNoZWNrKGlkKSkpeyByZXR1cm4gfVxuICAgICAgICAgICAgICAgIG1zZ1snQCddID0gZHVwWycjJ10gfHwg
bXNnWydAJ107IC8vIFRoaXMgZG9lc24ndCBkbyBhbnl0aGluZyBhbnltb3JlLCBiYWNrdHJhY2sgaXQgdG8gc29tZXRoaW5nIGVsc2U/XG4gICAgICAgICAg
ICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3R4LmFja3MgPSAoY3R4LmFja3N8fDApICsgMTtcbiAgICAgICAgICAgIGlmKGN0
eC5lcnIgPSBtc2cuZXJyKXtcbiAgICAgICAgICAgICAgICBtc2dbJ0AnXSA9IGN0eFsnIyddO1xuICAgICAgICAgICAgICAgIGZpcmUoY3R4KTsgLy8gVE9E
TzogQlVHPyBIb3cgaXQgc2tpcHMvc3RvcHMgcHJvcGFnYXRpb24gb2YgbXNnIGlmIGFueSAxIGl0ZW0gaXMgZXJyb3IsIHRoaXMgd291bGQgYXNzdW1lIGEg
d2hvbGUgYmF0Y2gvcmVzeW5jIGhhcyBzYW1lIG1hbGljaW91cyBpbnRlbnQuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdHgub2sgPSBtc2cub2sg
fHwgY3R4Lm9rO1xuICAgICAgICAgICAgaWYoIWN0eC5zdG9wICYmICFjdHguY3JhY2speyBjdHguY3JhY2sgPSBjdHgubWF0Y2ggJiYgY3R4Lm1hdGNoLnB1
c2goZnVuY3Rpb24oKXtiYWNrKGN0eCl9KSB9IC8vIGhhbmRsZSBzeW5jaHJvbm91cyBhY2tzLiBOT1RFOiBJZiBhIHN0b3JhZ2UgcGVlciBBQ0tzIHN5bmNo
cm9ub3VzbHkgdGhlbiB0aGUgUFVUIGxvb3AgaGFzIG5vdCBldmVuIGNvdW50ZWQgdXAgaG93IG1hbnkgaXRlbXMgbmVlZCB0byBiZSBwcm9jZXNzZWQsIHNv
IGN0eC5TVE9QIGZsYWdzIHRoaXMgYW5kIGFkZHMgb25seSAxIGNhbGxiYWNrIHRvIHRoZSBlbmQgb2YgdGhlIFBVVCBsb29wLlxuICAgICAgICAgICAgYmFj
ayhjdHgpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGJhY2soY3R4KXtcbiAgICAgICAgICAgIGlmKCFjdHggfHwgIWN0eC5yb290KXsgcmV0dXJu
IH1cbiAgICAgICAgICAgIGlmKGN0eC5zdHVuIHx8IChjdHguYWNrc3x8MCkgIT09IGN0eC5hbGwpeyByZXR1cm4gfSAvLyBub3JtYWxpemUgYWNrczogdW5k
ZWZpbmVkIHRyZWF0ZWQgYXMgMCBiZWZvcmUgZmlyc3Qgc3RvcmFnZSBhY2sgYXJyaXZlcy5cbiAgICAgICAgICAgIGN0eC5yb290Lm9uKCdpbicsIHsnQCc6
IGN0eFsnIyddLCBlcnI6IGN0eC5lcnIsIG9rOiBjdHguZXJyPyB1IDogY3R4Lm9rIHx8IHsnJzoxfX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIEVS
UiA9IFwiRXJyb3I6IEludmFsaWQgZ3JhcGghXCI7XG4gICAgICAgIHZhciBjdXQgPSBmdW5jdGlvbihzKXsgcmV0dXJuIFwiICdcIisoJycrcykuc2xpY2Uo
MCw5KStcIi4uLicgXCIgfVxuICAgICAgICB2YXIgTCA9IEpTT04uc3RyaW5naWZ5LCBNRCA9IDIxNDc0ODM2NDcsIFN0YXRlID0gR3VuLnN0YXRlO1xuICAg
ICAgICB2YXIgSGFtID0gaGFtOyBIYW0ubWF4ID0gMTAwMCAqIDYwICogNjAgKiAyNCAqIDc7IC8vIDEgd2VlazogbGVnaXQgY2xvY2sgc2tldyBpcyBzZWNv
bmRzLCBub3QgZGF5cy5cbiAgICAgICAgdmFyIEMgPSAwLCBDVCwgQ0YgPSBmdW5jdGlvbigpe2lmKEM+OTk5ICYmIChDLy0oQ1QgLSAoQ1QgPSArbmV3IERh
dGUpKT4xKSl7R3VuLndpbmRvdyAmJiBjb25zb2xlLmxvZyhcIldhcm5pbmc6IFlvdSdyZSBzeW5jaW5nIDFLKyByZWNvcmRzIGEgc2Vjb25kLCBmYXN0ZXIg
dGhhbiBET00gY2FuIHVwZGF0ZSAtIGNvbnNpZGVyIGxpbWl0aW5nIHF1ZXJ5LlwiKTtDRj1mdW5jdGlvbigpe0M9MH19fTtcblxuICAgIH0oKSk7XG5cbiAg
ICAoZnVuY3Rpb24oKXtcbiAgICAgICAgR3VuLm9uLmdldCA9IGZ1bmN0aW9uKG1zZywgZ3VuKXtcbiAgICAgICAgICAgIHZhciByb290ID0gZ3VuLl8sIGdl
dCA9IG1zZy5nZXQsIHNvdWwgPSBnZXRbJyMnXSwgbm9kZSA9IHJvb3QuZ3JhcGhbc291bF0sIGhhcyA9IGdldFsnLiddO1xuICAgICAgICAgICAgdmFyIG5l
eHQgPSByb290Lm5leHQgfHwgKHJvb3QubmV4dCA9IHt9KSwgYXQgPSBuZXh0W3NvdWxdO1xuXG4gICAgICAgICAgICAvLyBUT0RPOiBBemFyYXR0dW0gYnVn
LCB3aGF0IGlzIGluIGdyYXBoIGlzIG5vdCBzYW1lIGFzIHdoYXQgaXMgaW4gbmV4dC4gRml4IVxuXG4gICAgICAgICAgICAvLyBxdWV1ZSBjb25jdXJyZW50
IEdFVHM/XG4gICAgICAgICAgICAvLyBUT0RPOiBjb25zaWRlciB0YWdnaW5nIG9yaWdpbmFsIG1lc3NhZ2UgaW50byBkdXAgZm9yIERBTS5cbiAgICAgICAg
ICAgIC8vIFRPRE86IF4gYWJvdmU/IEluIGNoYXQgYXBwLCAxMiBtZXNzYWdlcyByZXN1bHRlZCBpbiBzYW1lIHBlZXIgYXNraW5nIGZvciBgI3VzZXIucHVi
YCAxMiB0aW1lcy4gKHNhbWUgd2l0aCAjdXNlciBHRVQgdG9vLCB5aXBlcyEpIC8vIERBTSBub3RlOiBUaGlzIGFsc28gcmVzdWx0ZWQgaW4gMTIgcmVwbGll
cyBmcm9tIDEgcGVlciB3aGljaCBhbGwgaGFkIHNhbWUgIyNoYXNoIGJ1dCBub25lIG9mIHRoZW0gZGVkdXBlZCBiZWNhdXNlIGVhY2ggZ2V0IHdhcyBkaWZm
ZXJlbnQuXG4gICAgICAgICAgICAvLyBUT0RPOiBNb3ZpbmcgcXVpY2sgaGFja3MgZml4aW5nIHRoZXNlIHRoaW5ncyB0byBheGUgZm9yIG5vdy5cbiAgICAg
ICAgICAgIC8vIFRPRE86IGEgbG90IG9mIEdFVCAjZm9vIHRoZW4gR0VUICNmb28uXCJcIiBoYXBwZW5pbmcsIHdoeT9cbiAgICAgICAgICAgIC8vIFRPRE86
IERBTSdzICMjIGhhc2ggY2hlY2ssIG9uIHNhbWUgZ2V0IEFDSywgcHJvZHVjaW5nIG11bHRpcGxlIHJlcGxpZXMgc3RpbGwsIG1heWJlIEpTT04gdnMgWVNP
Tj9cbiAgICAgICAgICAgIC8vIFRNUCBub3RlIGZvciBub3c6IHZpTVpxMXNsRyB3YXMgY2hhdCBMRVggcXVlcnkgIy5cbiAgICAgICAgICAgIC8qaWYoZ3Vu
ICE9PSAodG1wID0gbXNnLiQpICYmICh0bXAgPSAodG1wfHwnJykuXykpe1xuICAgICAgICAgICAgICAgIGlmKHRtcC5RKXsgdG1wLlFbbXNnWycjJ11dID0g
Jyc7IHJldHVybiB9IC8vIGNoYWluIGRvZXMgbm90IG5lZWQgdG8gYXNrIGZvciBpdCBhZ2Fpbi5cbiAgICAgICAgICAgICAgICB0bXAuUSA9IHt9O1xuICAg
ICAgICAgICAgfSovXG4gICAgICAgICAgICAvKmlmKHUgPT09IGhhcyl7XG4gICAgICAgICAgICAgICAgaWYoYXQuUSl7XG4gICAgICAgICAgICAgICAgICAg
IC8vYXQuUVttc2dbJyMnXV0gPSAnJztcbiAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAg
IGF0LlEgPSB7fTtcbiAgICAgICAgICAgIH0qL1xuICAgICAgICAgICAgdmFyIGN0eCA9IG1zZy5ffHx7fSwgREJHID0gY3R4LkRCRyA9IG1zZy5EQkc7XG4g
ICAgICAgICAgICBEQkcgJiYgKERCRy5nID0gK25ldyBEYXRlKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJHRVQ6XCIsIGdldCwgbm9kZSwgaGFz
LCBhdCk7XG4gICAgICAgICAgICAvL2lmKCFub2RlICYmICFhdCl7IHJldHVybiByb290Lm9uKCdnZXQnLCBtc2cpIH1cbiAgICAgICAgICAgIC8vaWYoaGFz
ICYmIG5vZGUpeyAvLyByZXBsYWNlIDIgYmVsb3cgbGluZXMgdG8gY29udGludWUgZGV2P1xuICAgICAgICAgICAgaWYoIW5vZGUpeyByZXR1cm4gcm9vdC5v
bignZ2V0JywgbXNnKSB9XG4gICAgICAgICAgICBpZihoYXMpe1xuICAgICAgICAgICAgICAgIGlmKCdzdHJpbmcnICE9IHR5cGVvZiBoYXMgfHwgdSA9PT0g
bm9kZVtoYXNdKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoISgoYXR8fCcnKS5uZXh0fHwnJylbaGFzXSl7IHJvb3Qub24oJ2dldCcsIG1zZyk7IHJldHVy
biB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG5vZGUgPSBzdGF0ZV9pZnkoe30sIGhhcywgc3RhdGVfaXMobm9kZSwgaGFzKSwgbm9k
ZVtoYXNdLCBzb3VsKTtcbiAgICAgICAgICAgICAgICAvLyBJZiB3ZSBoYXZlIGEga2V5IGluLW1lbW9yeSwgZG8gd2UgcmVhbGx5IG5lZWQgdG8gZmV0Y2g/
XG4gICAgICAgICAgICAgICAgLy8gTWF5YmUuLi4gaW4gY2FzZSB0aGUgaW4tbWVtb3J5IGtleSB3ZSBoYXZlIGlzIGEgbG9jYWwgd3JpdGVcbiAgICAgICAg
ICAgICAgICAvLyB3ZSBzdGlsbCBuZWVkIHRvIHRyaWdnZXIgYSBwdWxsL21lcmdlIGZyb20gcGVlcnMuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAv
L0d1bi53aW5kb3c/IEd1bi5vYmouY29weShub2RlKSA6IG5vZGU7IC8vIEhOUEVSRjogSWYgIWJyb3dzZXIgYnVtcCBQZXJmb3JtYW5jZT8gSXMgdGhpcyB0
b28gZGFuZ2Vyb3VzIHRvIHJlZmVyZW5jZSByb290IGdyYXBoPyBDb3B5IC8gc2hhbGxvdyBjb3B5IHRvbyBleHBlbnNpdmUgZm9yIGJpZyBub2Rlcy4gR3Vu
Lm9iai50byhub2RlKTsgLy8gMSBsYXllciBkZWVwIGNvcHkgLy8gR3VuLm9iai5jb3B5KG5vZGUpOyAvLyB0b28gc2xvdyBvbiBiaWcgbm9kZXNcbiAgICAg
ICAgICAgIG5vZGUgJiYgYWNrKG1zZywgbm9kZSk7XG4gICAgICAgICAgICByb290Lm9uKCdnZXQnLCBtc2cpOyAvLyBzZW5kIEdFVCB0byBzdG9yYWdlIGFk
YXB0ZXJzLlxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGFjayhtc2csIG5vZGUpe1xuICAgICAgICAgICAgdmFyIFMgPSArbmV3IERhdGUsIGN0eCA9
IG1zZy5ffHx7fSwgREJHID0gY3R4LkRCRyA9IG1zZy5EQkc7XG4gICAgICAgICAgICB2YXIgdG8gPSBtc2dbJyMnXSwgaWQgPSB0ZXh0X3JhbmQoOSksIGtl
eXMgPSBPYmplY3Qua2V5cyhub2RlfHwnJykuc29ydCgpLCBzb3VsID0gKChub2RlfHwnJykuX3x8JycpWycjJ10sIGtsID0ga2V5cy5sZW5ndGgsIGogPSAw
LCByb290ID0gbXNnLiQuXy5yb290LCBGID0gKG5vZGUgPT09IHJvb3QuZ3JhcGhbc291bF0pO1xuICAgICAgICAgICAgY29uc29sZS5TVEFUICYmIGNvbnNv
bGUuU1RBVChTLCAoKERCR3x8Y3R4KS5nayA9ICtuZXcgRGF0ZSkgLSBTLCAnZ290IGtleXMnKTtcbiAgICAgICAgICAgIC8vIFBFUkY6IENvbnNpZGVyIGNv
bW1lbnRpbmcgdGhpcyBvdXQgdG8gZm9yY2UgZGlzay1vbmx5IHJlYWRzIGZvciBwZXJmIHRlc3Rpbmc/IC8vIFRPRE86IC5rZXlzKCBpcyBzbG93XG4gICAg
ICAgICAgICBub2RlICYmIChmdW5jdGlvbiBnbygpe1xuICAgICAgICAgICAgICAgIFMgPSArbmV3IERhdGU7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSAw
LCBrLCBwdXQgPSB7fSwgdG1wO1xuICAgICAgICAgICAgICAgIHdoaWxlKGkgPCA5ICYmIChrID0ga2V5c1tpKytdKSl7XG4gICAgICAgICAgICAgICAgICAg
IHN0YXRlX2lmeShwdXQsIGssIHN0YXRlX2lzKG5vZGUsIGspLCBub2RlW2tdLCBzb3VsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAg
a2V5cyA9IGtleXMuc2xpY2UoaSk7XG4gICAgICAgICAgICAgICAgKHRtcCA9IHt9KVtzb3VsXSA9IHB1dDsgcHV0ID0gdG1wO1xuICAgICAgICAgICAgICAg
IHZhciBmYWl0aDsgaWYoRil7IGZhaXRoID0gZnVuY3Rpb24oKXt9OyBmYWl0aC5yYW0gPSBmYWl0aC5mYWl0aCA9IHRydWU7IH0gLy8gSE5QRVJGOiBXZSdy
ZSB0ZXN0aW5nIHBlcmZvcm1hbmNlIGltcHJvdmVtZW50IGJ5IHNraXBwaW5nIGdvaW5nIHRocm91Z2ggc2VjdXJpdHkgYWdhaW4sIGJ1dCB0aGlzIHNob3Vs
ZCBiZSBhdWRpdGVkLlxuICAgICAgICAgICAgICAgIHRtcCA9IGtleXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuU1RBVCAmJiBjb25zb2xl
LlNUQVQoUywgLShTIC0gKFMgPSArbmV3IERhdGUpKSwgJ2dvdCBjb3BpZWQgc29tZScpO1xuICAgICAgICAgICAgICAgIERCRyAmJiAoREJHLmdhID0gK25l
dyBEYXRlKTtcbiAgICAgICAgICAgICAgICByb290Lm9uKCdpbicsIHsnQCc6IHRvLCAnIyc6IGlkLCBwdXQ6IHB1dCwgJyUnOiAodG1wPyAoaWQgPSB0ZXh0
X3JhbmQoOSkpIDogdSksICQ6IHJvb3QuJCwgXzogZmFpdGgsIERCRzogREJHfSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5TVEFUICYmIGNvbnNvbGUu
U1RBVChTLCArbmV3IERhdGUgLSBTLCAnZ290IGluJyk7XG4gICAgICAgICAgICAgICAgaWYoIXRtcCl7IHJldHVybiB9XG4gICAgICAgICAgICAgICAgc2V0
VGltZW91dC50dXJuKGdvKTtcbiAgICAgICAgICAgIH0oKSk7XG4gICAgICAgICAgICBpZighbm9kZSl7IHJvb3Qub24oJ2luJywgeydAJzogbXNnWycjJ119
KSB9IC8vIFRPRE86IEkgZG9uJ3QgdGhpbmsgSSBsaWtlIHRoaXMsIHRoZSBkZWZhdWx0IGxTIGFkYXB0ZXIgdXNlcyB0aGlzIGJ1dCBcIm5vdCBmb3VuZFwi
IGlzIGEgc2Vuc2l0aXZlIGlzc3VlLCBzbyBzaG91bGQgcHJvYmFibHkgYmUgaGFuZGxlZCBtb3JlIGNhcmVmdWxseS9pbmRpdmlkdWFsbHkuXG4gICAgICAg
IH0gR3VuLm9uLmdldC5hY2sgPSBhY2s7XG4gICAgfSgpKTtcblxuICAgIChmdW5jdGlvbigpe1xuICAgICAgICBHdW4uY2hhaW4ub3B0ID0gZnVuY3Rpb24o
b3B0KXtcbiAgICAgICAgICAgIG9wdCA9IG9wdCB8fCB7fTtcbiAgICAgICAgICAgIHZhciBndW4gPSB0aGlzLCBhdCA9IGd1bi5fLCB0bXAgPSBvcHQucGVl
cnMgfHwgb3B0O1xuICAgICAgICAgICAgaWYoIU9iamVjdC5wbGFpbihvcHQpKXsgb3B0ID0ge30gfVxuICAgICAgICAgICAgaWYoIU9iamVjdC5wbGFpbihh
dC5vcHQpKXsgYXQub3B0ID0gb3B0IH1cbiAgICAgICAgICAgIGlmKCdzdHJpbmcnID09IHR5cGVvZiB0bXApeyB0bXAgPSBbdG1wXSB9XG4gICAgICAgICAg
ICBpZighT2JqZWN0LnBsYWluKGF0Lm9wdC5wZWVycykpeyBhdC5vcHQucGVlcnMgPSB7fX1cbiAgICAgICAgICAgIGlmKHRtcCBpbnN0YW5jZW9mIEFycmF5
KXtcbiAgICAgICAgICAgICAgICBvcHQucGVlcnMgPSB7fTtcbiAgICAgICAgICAgICAgICB0bXAuZm9yRWFjaChmdW5jdGlvbih1cmwpe1xuICAgICAgICAg
ICAgICAgICAgICB2YXIgcCA9IHt9OyBwLmlkID0gcC51cmwgPSB1cmw7XG4gICAgICAgICAgICAgICAgICAgIG9wdC5wZWVyc1t1cmxdID0gYXQub3B0LnBl
ZXJzW3VybF0gPSBhdC5vcHQucGVlcnNbdXJsXSB8fCBwO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvYmpfZWFj
aChvcHQsIGZ1bmN0aW9uIGVhY2goayl7IHZhciB2ID0gdGhpc1trXTtcbiAgICAgICAgICAgICAgICBpZigodGhpcyAmJiB0aGlzLmhhc093blByb3BlcnR5
KGspKSB8fCAnc3RyaW5nJyA9PSB0eXBlb2YgdiB8fCBPYmplY3QuZW1wdHkodikpeyB0aGlzW2tdID0gdjsgcmV0dXJuIH1cbiAgICAgICAgICAgICAgICBp
Zih2ICYmIHYuY29uc3RydWN0b3IgIT09IE9iamVjdCAmJiAhKHYgaW5zdGFuY2VvZiBBcnJheSkpeyByZXR1cm4gfVxuICAgICAgICAgICAgICAgIG9ial9l
YWNoKHYsIGVhY2gpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhdC5vcHQuZnJvbSA9IG9wdDtcbiAgICAgICAgICAgIEd1bi5vbignb3B0Jywg
YXQpO1xuICAgICAgICAgICAgYXQub3B0LnV1aWQgPSBhdC5vcHQudXVpZCB8fCBmdW5jdGlvbiB1dWlkKGwpeyByZXR1cm4gR3VuLnN0YXRlKCkudG9TdHJp
bmcoMzYpLnJlcGxhY2UoJy4nLCcnKSArIFN0cmluZy5yYW5kb20obHx8MTIpIH1cbiAgICAgICAgICAgIHJldHVybiBndW47XG4gICAgICAgIH1cbiAgICB9
KCkpO1xuXG4gICAgdmFyIG9ial9lYWNoID0gZnVuY3Rpb24obyxmKXsgT2JqZWN0LmtleXMobykuZm9yRWFjaChmLG8pIH0sIHRleHRfcmFuZCA9IFN0cmlu
Zy5yYW5kb20sIHR1cm4gPSBzZXRUaW1lb3V0LnR1cm4sIHZhbGlkID0gR3VuLnZhbGlkLCBzdGF0ZV9pcyA9IEd1bi5zdGF0ZS5pcywgc3RhdGVfaWZ5ID0g
R3VuLnN0YXRlLmlmeSwgdSwgZW1wdHkgPSB7fSwgQztcblxuICAgIEd1bi5sb2cgPSBmdW5jdGlvbigpeyByZXR1cm4gKCFHdW4ubG9nLm9mZiAmJiBDLmxv
Zy5hcHBseShDLCBhcmd1bWVudHMpKSwgW10uc2xpY2UuY2FsbChhcmd1bWVudHMpLmpvaW4oJyAnKSB9O1xuICAgIEd1bi5sb2cub25jZSA9IGZ1bmN0aW9u
KHcscyxvKXsgcmV0dXJuIChvID0gR3VuLmxvZy5vbmNlKVt3XSA9IG9bd10gfHwgMCwgb1t3XSsrIHx8IEd1bi5sb2cocykgfTtcblxuICAgICgodHlwZW9m
IGdsb2JhbFRoaXMgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgV29ya2VyR2xvYmFsU2Nv
cGUgIT09IFwidW5kZWZpbmVkXCIpID8gKChnbG9iYWxUaGlzLkdVTiA9IGdsb2JhbFRoaXMuR3VuID0gR3VuKS53aW5kb3cgPSBnbG9iYWxUaGlzKSA6ICh0
eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gKCh3aW5kb3cuR1VOID0gd2luZG93Lkd1biA9IEd1bikud2luZG93ID0gd2luZG93KSA6IHVuZGVm
aW5lZCkpO1xuICAgICgoZ2xvYmFsVGhpcy5HVU4gPSBnbG9iYWxUaGlzLkd1biA9IEd1bikuZ2xvYmFsVGhpcyA9IGdsb2JhbFRoaXMpO1xuICAgIHRyeXsg
aWYodHlwZW9mIE1PRFVMRSAhPT0gXCJ1bmRlZmluZWRcIil7IE1PRFVMRS5leHBvcnRzID0gR3VuIH0gfWNhdGNoKGUpe31cbiAgICBfX2RlZmF1bHRFeHBv
cnQgPSBHdW47XG5cbiAgICAoR3VuLndpbmRvd3x8e30pLmNvbnNvbGUgPSAoR3VuLndpbmRvd3x8e30pLmNvbnNvbGUgfHwge2xvZzogZnVuY3Rpb24oKXt9
fTtcbiAgICAoQyA9IGNvbnNvbGUpLm9ubHkgPSBmdW5jdGlvbihpLCBzKXsgcmV0dXJuIChDLm9ubHkuaSAmJiBpID09PSBDLm9ubHkuaSAmJiBDLm9ubHku
aSsrKSAmJiAoQy5sb2cuYXBwbHkoQywgYXJndW1lbnRzKSB8fCBzKSB9O1xufSgpKTtcbmV4cG9ydCBkZWZhdWx0IF9fZGVmYXVsdEV4cG9ydDsiLCJzcmMv
YmFjay5qcyI6ImltcG9ydCBfX3Jvb3QgZnJvbSAnLi9yb290LmpzJztcbihmdW5jdGlvbigpe1xuXG52YXIgR3VuID0gX19yb290O1xuR3VuLmNoYWluLmJh
Y2sgPSBmdW5jdGlvbihuLCBvcHQpeyB2YXIgdG1wO1xuXHRuID0gbiB8fCAxO1xuXHRpZigtMSA9PT0gbiB8fCBJbmZpbml0eSA9PT0gbil7XG5cdFx0cmV0
dXJuIHRoaXMuXy5yb290LiQ7XG5cdH0gZWxzZVxuXHRpZigxID09PSBuKXtcblx0XHRyZXR1cm4gKHRoaXMuXy5iYWNrIHx8IHRoaXMuXykuJDtcblx0fVxu
XHR2YXIgZ3VuID0gdGhpcywgYXQgPSBndW4uXztcblx0aWYodHlwZW9mIG4gPT09ICdzdHJpbmcnKXtcblx0XHRuID0gbi5zcGxpdCgnLicpO1xuXHR9XG5c
dGlmKG4gaW5zdGFuY2VvZiBBcnJheSl7XG5cdFx0dmFyIGkgPSAwLCBsID0gbi5sZW5ndGgsIHRtcCA9IGF0O1xuXHRcdGZvcihpOyBpIDwgbDsgaSsrKXtc
blx0XHRcdHRtcCA9ICh0bXB8fGVtcHR5KVtuW2ldXTtcblx0XHR9XG5cdFx0aWYodSAhPT0gdG1wKXtcblx0XHRcdHJldHVybiBvcHQ/IGd1biA6IHRtcDtc
blx0XHR9IGVsc2Vcblx0XHRpZigodG1wID0gYXQuYmFjaykpe1xuXHRcdFx0cmV0dXJuIHRtcC4kLmJhY2sobiwgb3B0KTtcblx0XHR9XG5cdFx0cmV0dXJu
O1xuXHR9XG5cdGlmKCdmdW5jdGlvbicgPT0gdHlwZW9mIG4pe1xuXHRcdHZhciB5ZXMsIHRtcCA9IHtiYWNrOiBhdH07XG5cdFx0d2hpbGUoKHRtcCA9IHRt
cC5iYWNrKVxuXHRcdCYmIHUgPT09ICh5ZXMgPSBuKHRtcCwgb3B0KSkpe31cblx0XHRyZXR1cm4geWVzO1xuXHR9XG5cdGlmKCdudW1iZXInID09IHR5cGVv
ZiBuKXtcblx0XHRyZXR1cm4gKGF0LmJhY2sgfHwgYXQpLiQuYmFjayhuIC0gMSk7XG5cdH1cblx0cmV0dXJuIHRoaXM7XG59XG52YXIgZW1wdHkgPSB7fSwg
dTtcblx0XG59KCkpOyIsInNyYy9jaGFpbi5qcyI6ImltcG9ydCBfX3Jvb3QgZnJvbSAnLi9yb290LmpzJztcbihmdW5jdGlvbigpe1xuXG4vLyBXQVJOSU5H
OiBHVU4gaXMgdmVyeSBzaW1wbGUsIGJ1dCB0aGUgSmF2YVNjcmlwdCBjaGFpbmluZyBBUEkgYXJvdW5kIEdVTlxuLy8gaXMgY29tcGxpY2F0ZWQgYW5kIHdh
cyBleHRyZW1lbHkgaGFyZCB0byBidWlsZC4gSWYgeW91IHBvcnQgR1VOIHRvIGFub3RoZXJcbi8vIGxhbmd1YWdlLCBjb25zaWRlciBpbXBsZW1lbnRpbmcg
YW4gZWFzaWVyIEFQSSB0byBidWlsZC5cbnZhciBHdW4gPSBfX3Jvb3Q7XG5HdW4uY2hhaW4uY2hhaW4gPSBmdW5jdGlvbihzdWIpe1xuXHR2YXIgZ3VuID0g
dGhpcywgYXQgPSBndW4uXywgY2hhaW4gPSBuZXcgKHN1YiB8fCBndW4pLmNvbnN0cnVjdG9yKGd1biksIGNhdCA9IGNoYWluLl8sIHJvb3Q7XG5cdGNhdC5y
b290ID0gcm9vdCA9IGF0LnJvb3Q7XG5cdGNhdC5pZCA9ICsrcm9vdC5vbmNlO1xuXHRjYXQuYmFjayA9IGd1bi5fO1xuXHRjYXQub24gPSBHdW4ub247XG5c
dGNhdC5vbignaW4nLCBHdW4ub24uaW4sIGNhdCk7IC8vIEZvciAnaW4nIGlmIEkgYWRkIG15IG93biBsaXN0ZW5lcnMgdG8gZWFjaCB0aGVuIEkgTVVTVCBk
byBpdCBiZWZvcmUgaW4gZ2V0cyBjYWxsZWQuIElmIEkgbGlzdGVuIGdsb2JhbGx5IGZvciBhbGwgaW5jb21pbmcgZGF0YSBpbnN0ZWFkIHRob3VnaCwgcmVn
YXJkbGVzcyBvZiBpbmRpdmlkdWFsIGxpc3RlbmVycywgSSBjYW4gdHJhbnNmb3JtIHRoZSBkYXRhIHRoZXJlIGFuZCB0aGVuIGFzIHdlbGwuXG5cdGNhdC5v
bignb3V0JywgR3VuLm9uLm91dCwgY2F0KTsgLy8gSG93ZXZlciBmb3Igb3V0cHV0LCB0aGVyZSBpc24ndCByZWFsbHkgdGhlIGdsb2JhbCBvcHRpb24uIEkg
bXVzdCBsaXN0ZW4gYnkgYWRkaW5nIG15IG93biBsaXN0ZW5lciBpbmRpdmlkdWFsbHkgQkVGT1JFIHRoaXMgb25lIGlzIGV2ZXIgY2FsbGVkLlxuXHRyZXR1
cm4gY2hhaW47XG59XG5cbmZ1bmN0aW9uIG91dHB1dChtc2cpe1xuXHR2YXIgcHV0LCBnZXQsIGF0ID0gdGhpcy5hcywgYmFjayA9IGF0LmJhY2ssIHJvb3Qg
PSBhdC5yb290LCB0bXA7XG5cdGlmKCFtc2cuJCl7IG1zZy4kID0gYXQuJCB9XG5cdHRoaXMudG8ubmV4dChtc2cpO1xuXHRpZihhdC5lcnIpeyBhdC5vbign
aW4nLCB7cHV0OiBhdC5wdXQgPSB1LCAkOiBhdC4kfSk7IHJldHVybiB9XG5cdGlmKGdldCA9IG1zZy5nZXQpe1xuXHRcdC8qaWYodSAhPT0gYXQucHV0KXtc
blx0XHRcdGF0Lm9uKCdpbicsIGF0KTtcblx0XHRcdHJldHVybjtcblx0XHR9Ki9cblx0XHRpZihyb290LnBhc3MpeyByb290LnBhc3NbYXQuaWRdID0gYXQ7
IH0gLy8gd2lsbCB0aGlzIG1ha2UgZm9yIGJ1Z2d5IGJlaGF2aW9yIGVsc2V3aGVyZT9cblx0XHRpZihhdC5sZXgpeyBPYmplY3Qua2V5cyhhdC5sZXgpLmZv
ckVhY2goZnVuY3Rpb24oayl7IHRtcFtrXSA9IGF0LmxleFtrXSB9LCB0bXAgPSBtc2cuZ2V0ID0gbXNnLmdldCB8fCB7fSkgfVxuXHRcdGlmKGdldFsnIydd
IHx8IGF0LnNvdWwpe1xuXHRcdFx0Z2V0WycjJ10gPSBnZXRbJyMnXSB8fCBhdC5zb3VsO1xuXHRcdFx0Ly9yb290LmdyYXBoW2dldFsnIyddXSA9IHJvb3Qu
Z3JhcGhbZ2V0WycjJ11dIHx8IHtfOnsnIyc6Z2V0WycjJ10sJz4nOnt9fX07XG5cdFx0XHRtc2dbJyMnXSB8fCAobXNnWycjJ10gPSB0ZXh0X3JhbmQoOSkp
OyAvLyBBMzEyMCA/XG5cdFx0XHRiYWNrID0gKHNnZXQocm9vdCwgZ2V0WycjJ10pLl8pO1xuXHRcdFx0aWYoIShnZXQgPSBnZXRbJy4nXSkpeyAvLyBzb3Vs
XG5cdFx0XHRcdHRtcCA9IGJhY2suYXNrICYmIGJhY2suYXNrWycnXTsgLy8gY2hlY2sgaWYgd2UgaGF2ZSBhbHJlYWR5IGFza2VkIGZvciB0aGUgZnVsbCBu
b2RlXG5cdFx0XHRcdChiYWNrLmFzayB8fCAoYmFjay5hc2sgPSB7fSkpWycnXSA9IGJhY2s7IC8vIGFkZCBhIGZsYWcgdGhhdCB3ZSBhcmUgbm93LlxuXHRc
dFx0XHRpZih1ICE9PSBiYWNrLnB1dCl7IC8vIGlmIHdlIGFscmVhZHkgaGF2ZSBkYXRhLFxuXHRcdFx0XHRcdGJhY2sub24oJ2luJywgYmFjayk7IC8vIHNl
bmQgd2hhdCBpcyBjYWNoZWQgZG93biB0aGUgY2hhaW5cblx0XHRcdFx0XHRpZih0bXApeyByZXR1cm4gfSAvLyBhbmQgZG9uJ3QgYXNrIGZvciBpdCBhZ2Fp
bi5cblx0XHRcdFx0fVxuXHRcdFx0XHRtc2cuJCA9IGJhY2suJDtcblx0XHRcdH0gZWxzZVxuXHRcdFx0aWYob2JqX2hhcyhiYWNrLnB1dCwgZ2V0KSl7IC8v
IFRPRE86IHN1cHBvcnQgI0xFWCAhXG5cdFx0XHRcdHRtcCA9IGJhY2suYXNrICYmIGJhY2suYXNrW2dldF07XG5cdFx0XHRcdChiYWNrLmFzayB8fCAoYmFj
ay5hc2sgPSB7fSkpW2dldF0gPSBiYWNrLiQuZ2V0KGdldCkuXztcblx0XHRcdFx0YmFjay5vbignaW4nLCB7Z2V0OiBnZXQsIHB1dDogeycjJzogYmFjay5z
b3VsLCAnLic6IGdldCwgJzonOiBiYWNrLnB1dFtnZXRdLCAnPic6IHN0YXRlX2lzKHJvb3QuZ3JhcGhbYmFjay5zb3VsXSwgZ2V0KX19KTtcblx0XHRcdFx0
aWYodG1wKXsgcmV0dXJuIH1cblx0XHRcdH1cblx0XHRcdFx0LypwdXQgPSAoYmFjay4kLmdldChnZXQpLl8pO1xuXHRcdFx0XHRpZighKHRtcCA9IHB1dC5h
Y2spKXsgcHV0LmFjayA9IC0xIH1cblx0XHRcdFx0YmFjay5vbignaW4nLCB7XG5cdFx0XHRcdFx0JDogYmFjay4kLFxuXHRcdFx0XHRcdHB1dDogR3VuLnN0
YXRlLmlmeSh7fSwgZ2V0LCBHdW4uc3RhdGUoYmFjay5wdXQsIGdldCksIGJhY2sucHV0W2dldF0pLFxuXHRcdFx0XHRcdGdldDogYmFjay5nZXRcblx0XHRc
dFx0fSk7XG5cdFx0XHRcdGlmKHRtcCl7IHJldHVybiB9XG5cdFx0XHR9IGVsc2Vcblx0XHRcdGlmKCdzdHJpbmcnICE9IHR5cGVvZiBnZXQpe1xuXHRcdFx0
XHR2YXIgcHV0ID0ge30sIG1ldGEgPSAoYmFjay5wdXR8fHt9KS5fO1xuXHRcdFx0XHRHdW4ub2JqLm1hcChiYWNrLnB1dCwgZnVuY3Rpb24odixrKXtcblx0
XHRcdFx0XHRpZighR3VuLnRleHQubWF0Y2goaywgZ2V0KSl7IHJldHVybiB9XG5cdFx0XHRcdFx0cHV0W2tdID0gdjtcblx0XHRcdFx0fSlcblx0XHRcdFx0
aWYoIUd1bi5vYmouZW1wdHkocHV0KSl7XG5cdFx0XHRcdFx0cHV0Ll8gPSBtZXRhO1xuXHRcdFx0XHRcdGJhY2sub24oJ2luJywgeyQ6IGJhY2suJCwgcHV0
OiBwdXQsIGdldDogYmFjay5nZXR9KVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKHRtcCA9IGF0LmxleCl7XG5cdFx0XHRcdFx0dG1wID0gKHRtcC5fKSB8fCAo
dG1wLl8gPSBmdW5jdGlvbigpe30pO1xuXHRcdFx0XHRcdGlmKGJhY2suYWNrIDwgdG1wLmFzayl7IHRtcC5hc2sgPSBiYWNrLmFjayB9XG5cdFx0XHRcdFx0
aWYodG1wLmFzayl7IHJldHVybiB9XG5cdFx0XHRcdFx0dG1wLmFzayA9IDE7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdCovXG5cdFx0XHRyb290LmFz
ayhhY2ssIG1zZyk7IC8vIEEzMTIwID9cblx0XHRcdHJldHVybiByb290Lm9uKCdpbicsIG1zZyk7XG5cdFx0fVxuXHRcdC8vaWYocm9vdC5ub3cpeyByb290
Lm5vd1thdC5pZF0gPSByb290Lm5vd1thdC5pZF0gfHwgdHJ1ZTsgYXQucGFzcyA9IHt9IH1cblx0XHRpZihnZXRbJy4nXSl7XG5cdFx0XHRpZihhdC5nZXQp
e1xuXHRcdFx0XHRtc2cgPSB7Z2V0OiB7Jy4nOiBhdC5nZXR9LCAkOiBhdC4kfTtcblx0XHRcdFx0KGJhY2suYXNrIHx8IChiYWNrLmFzayA9IHt9KSlbYXQu
Z2V0XSA9IG1zZy4kLl87IC8vIFRPRE86IFBFUkZPUk1BTkNFPyBNb3JlIGVsZWdhbnQgd2F5P1xuXHRcdFx0XHRyZXR1cm4gYmFjay5vbignb3V0JywgbXNn
KTtcblx0XHRcdH1cblx0XHRcdG1zZyA9IHtnZXQ6IGF0LmxleD8gbXNnLmdldCA6IHt9LCAkOiBhdC4kfTtcblx0XHRcdHJldHVybiBiYWNrLm9uKCdvdXQn
LCBtc2cpO1xuXHRcdH1cblx0XHQoYXQuYXNrIHx8IChhdC5hc2sgPSB7fSkpWycnXSA9IGF0O1x0IC8vYXQuYWNrID0gYXQuYWNrIHx8IC0xO1xuXHRcdGlm
KGF0LmdldCl7XG5cdFx0XHRnZXRbJy4nXSA9IGF0LmdldDtcblx0XHRcdChiYWNrLmFzayB8fCAoYmFjay5hc2sgPSB7fSkpW2F0LmdldF0gPSBtc2cuJC5f
OyAvLyBUT0RPOiBQRVJGT1JNQU5DRT8gTW9yZSBlbGVnYW50IHdheT9cblx0XHRcdHJldHVybiBiYWNrLm9uKCdvdXQnLCBtc2cpO1xuXHRcdH1cblx0fVxu
XHRyZXR1cm4gYmFjay5vbignb3V0JywgbXNnKTtcbn07IEd1bi5vbi5vdXQgPSBvdXRwdXQ7XG5cbmZ1bmN0aW9uIGlucHV0KG1zZywgY2F0KXsgY2F0ID0g
Y2F0IHx8IHRoaXMuYXM7IC8vIFRPRE86IFY4IG1heSBub3QgYmUgYWJsZSB0byBvcHRpbWl6ZSBmdW5jdGlvbnMgd2l0aCBkaWZmZXJlbnQgcGFyYW1ldGVy
IGNhbGxzLCBzbyB0cnkgdG8gZG8gYmVuY2htYXJrIHRvIHNlZSBpZiB0aGVyZSBpcyBhbnkgYWN0dWFsIGRpZmZlcmVuY2UuXG5cdHZhciByb290ID0gY2F0
LnJvb3QsIGd1biA9IG1zZy4kIHx8IChtc2cuJCA9IGNhdC4kKSwgYXQgPSAoZ3VufHwnJykuXyB8fCBlbXB0eSwgdG1wID0gbXNnLnB1dHx8JycsIHNvdWwg
PSB0bXBbJyMnXSwga2V5ID0gdG1wWycuJ10sIGNoYW5nZSA9ICh1ICE9PSB0bXBbJz0nXSk/IHRtcFsnPSddIDogdG1wWyc6J10sIHN0YXRlID0gdG1wWyc+
J10gfHwgLUluZmluaXR5LCBzYXQ7IC8vIGV2ZSA9IGV2ZW50LCBhdCA9IGRhdGEgYXQsIGNhdCA9IGNoYWluIGF0LCBzYXQgPSBzdWIgYXQgKGNoaWxkcmVu
IGNoYWlucykuXG5cdGlmKHUgIT09IG1zZy5wdXQgJiYgKHUgPT09IHRtcFsnIyddIHx8IHUgPT09IHRtcFsnLiddIHx8ICh1ID09PSB0bXBbJzonXSAmJiB1
ID09PSB0bXBbJz0nXSkgfHwgdSA9PT0gdG1wWyc+J10pKXsgLy8gY29udmVydCBmcm9tIG9sZCBmb3JtYXRcblx0XHRpZighdmFsaWQodG1wKSl7XG5cdFx0
XHRpZighKHNvdWwgPSAoKHRtcHx8JycpLl98fCcnKVsnIyddKSl7IGNvbnNvbGUubG9nKFwiY2hhaW4gbm90IHlldCBzdXBwb3J0ZWQgZm9yXCIsIHRtcCwg
Jy4uLicsIG1zZywgY2F0KTsgcmV0dXJuOyB9XG5cdFx0XHRndW4gPSBzZ2V0KGNhdC5yb290LCBzb3VsKTtcblx0XHRcdHJldHVybiBzZXRUaW1lb3V0LmVh
Y2goT2JqZWN0LmtleXModG1wKS5zb3J0KCksIGZ1bmN0aW9uKGspeyAvLyBUT0RPOiAua2V5cyggaXMgc2xvdyAvLyBCVUc/ID9Tb21lIHJlLWluIGxvZ2lj
IG1heSBkZXBlbmQgb24gdGhpcyBiZWluZyBzeW5jP1xuXHRcdFx0XHRpZignXycgPT0gayB8fCB1ID09PSAoc3RhdGUgPSBzdGF0ZV9pcyh0bXAsIGspKSl7
IHJldHVybiB9XG5cdFx0XHRcdGNhdC5vbignaW4nLCB7JDogZ3VuLCBwdXQ6IHsnIyc6IHNvdWwsICcuJzogaywgJz0nOiB0bXBba10sICc+Jzogc3RhdGV9
LCBWSUE6IG1zZ30pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGNhdC5vbignaW4nLCB7JDogYXQuYmFjay4kLCBwdXQ6IHsnIyc6IHNvdWwgPSBhdC5iYWNr
LnNvdWwsICcuJzoga2V5ID0gYXQuaGFzIHx8IGF0LmdldCwgJz0nOiB0bXAsICc+Jzogc3RhdGVfaXMoYXQuYmFjay5wdXQsIGtleSl9LCB2aWE6IG1zZ30p
OyAvLyBUT0RPOiBUaGlzIGNvdWxkIGJlIGJ1Z2d5ISBJdCBhc3N1bWVzL2FwcHJveGVzIGRhdGEsIG90aGVyIHN0dWZmIGNvdWxkIGhhdmUgY29ycnVwdGVk
IGl0LlxuXHRcdHJldHVybjtcblx0fVxuXHRpZigobXNnLnNlZW58fCcnKVtjYXQuaWRdKXsgcmV0dXJuIH0gKG1zZy5zZWVuIHx8IChtc2cuc2VlbiA9IGZ1
bmN0aW9uKCl7fSkpW2NhdC5pZF0gPSBjYXQ7IC8vIGhlbHAgc3RvcCBzb21lIGluZmluaXRlIGxvb3BzXG5cblx0aWYoY2F0ICE9PSBhdCl7IC8vIGRvbid0
IHdvcnJ5IGFib3V0IHRoaXMgd2hlbiBmaXJzdCB1bmRlcnN0YW5kaW5nIHRoZSBjb2RlLCBpdCBoYW5kbGVzIGNoYW5naW5nIGNvbnRleHRzIG9uIGEgbWVz
c2FnZS4gQSBzb3VsIGNoYWluIHdpbGwgbmV2ZXIgaGF2ZSBhIGRpZmZlcmVudCBjb250ZXh0LlxuXHRcdE9iamVjdC5rZXlzKG1zZykuZm9yRWFjaChmdW5j
dGlvbihrKXsgdG1wW2tdID0gbXNnW2tdIH0sIHRtcCA9IHt9KTsgLy8gbWFrZSBjb3B5IG9mIG1lc3NhZ2Vcblx0XHR0bXAuZ2V0ID0gY2F0LmdldCB8fCB0
bXAuZ2V0O1xuXHRcdGlmKCFjYXQuc291bCAmJiAhY2F0Lmhhcyl7IC8vIGlmIHdlIGRvIG5vdCByZWNvZ25pemUgdGhlIGNoYWluIHR5cGVcblx0XHRcdHRt
cC4kJCQgPSB0bXAuJCQkIHx8IGNhdC4kOyAvLyBtYWtlIGEgcmVmZXJlbmNlIHRvIHdoZXJldmVyIGl0IGNhbWUgZnJvbS5cblx0XHR9IGVsc2Vcblx0XHRp
ZihhdC5zb3VsKXsgLy8gYSBoYXMgKHByb3BlcnR5KSBjaGFpbiB3aWxsIGhhdmUgYSBkaWZmZXJlbnQgY29udGV4dCBzb21ldGltZXMgaWYgaXQgaXMgbGlu
a2VkICh0byBhIHNvdWwgY2hhaW4pLiBBbnl0aGluZyB0aGF0IGlzIG5vdCBhIHNvdWwgb3IgaGFzIGNoYWluLCB3aWxsIGFsd2F5cyBoYXZlIGRpZmZlcmVu
dCBjb250ZXh0cy5cblx0XHRcdHRtcC4kID0gY2F0LiQ7XG5cdFx0XHR0bXAuJCQgPSB0bXAuJCQgfHwgYXQuJDtcblx0XHR9XG5cdFx0bXNnID0gdG1wOyAv
LyB1c2UgdGhlIG1lc3NhZ2Ugd2l0aCB0aGUgbmV3IGNvbnRleHQgaW5zdGVhZDtcblx0fVxuXHR1bmxpbmsobXNnLCBjYXQpO1xuXG5cdGlmKCgoKGNhdC5z
b3VsKS8qICYmIChjYXQuYXNrfHwnJylbJyddKi8pIHx8IG1zZy4kJCkgJiYgc3RhdGUgPj0gc3RhdGVfaXMocm9vdC5ncmFwaFtzb3VsXSwga2V5KSl7IC8v
IFRoZSByb290IGhhcyBhbiBpbi1tZW1vcnkgY2FjaGUgb2YgdGhlIGdyYXBoLCBidXQgaWYgb3VyIHBlZXIgaGFzIGFza2VkIGZvciB0aGUgZGF0YSB0aGVu
IHdlIHdhbnQgYSBwZXIgZGVkdXBsaWNhdGVkIGNoYWluIGNvcHkgb2YgdGhlIGRhdGEgdGhhdCBtaWdodCBoYXZlIGxvY2FsIGVkaXRzIG9uIGl0LlxuXHRc
dCh0bXAgPSBzZ2V0KHJvb3QsIHNvdWwpLl8pLnB1dCA9IHN0YXRlX2lmeSh0bXAucHV0LCBrZXksIHN0YXRlLCBjaGFuZ2UsIHNvdWwpO1xuXHR9XG5cdGlm
KCFhdC5zb3VsIC8qJiYgKGF0LmFza3x8JycpWycnXSovICYmIHN0YXRlID49IHN0YXRlX2lzKHJvb3QuZ3JhcGhbc291bF0sIGtleSkgJiYgKHNhdCA9IChz
Z2V0KHJvb3QsIHNvdWwpLl8ubmV4dHx8JycpW2tleV0pKXsgLy8gU2FtZSBhcyBhYm92ZSBoZXJlLCBidXQgZm9yIG90aGVyIHR5cGVzIG9mIGNoYWlucy4g
Ly8gVE9ETzogSW1wcm92ZSBwZXJmIGJ5IHByZXZlbnRpbmcgZWNob2VzIHJlY2FjaGluZy5cblx0XHRzYXQucHV0ID0gY2hhbmdlOyAvLyB1cGRhdGUgY2Fj
aGVcblx0XHRpZignc3RyaW5nJyA9PSB0eXBlb2YgKHRtcCA9IHZhbGlkKGNoYW5nZSkpKXtcblx0XHRcdHNhdC5wdXQgPSBzZ2V0KHJvb3QsIHRtcCkuXy5w
dXQgfHwgY2hhbmdlOyAvLyBzaGFyZSBzYW1lIGNhY2hlIGFzIHdoYXQgd2UncmUgbGlua2luZyB0by5cblx0XHR9XG5cdH1cblxuXHR0aGlzLnRvICYmIHRo
aXMudG8ubmV4dChtc2cpOyAvLyAxc3QgQVBJIGpvYiBpcyB0byBjYWxsIGFsbCBjaGFpbiBsaXN0ZW5lcnMuXG5cdC8vIFRPRE86IE1ha2UgaW5wdXQgbW9y
ZSByZXVzYWJsZSBieSBvbmx5IGRvaW5nIHRoZXNlIChzb21lPykgY2FsbHMgaWYgd2UgYXJlIGEgY2hhaW4gd2UgcmVjb2duaXplPyBUaGlzIG1lYW5zIGVh
Y2ggaW5wdXQgbGlzdGVuZXIgd291bGQgYmUgcmVzcG9uc2libGUgZm9yIHdoZW4gbGlzdGVuZXJzIG5lZWQgdG8gYmUgY2FsbGVkLCB3aGljaCBtYWtlcyBz
ZW5zZSwgYXMgdGhleSBtaWdodCB3YW50IHRvIGZpbHRlci5cblx0Y2F0LmFueSAmJiBzZXRUaW1lb3V0LmVhY2goT2JqZWN0LmtleXMoY2F0LmFueSksIGZ1
bmN0aW9uKGFueSl7IChhbnkgPSBjYXQuYW55W2FueV0pICYmIGFueShtc2cpIH0sMCw5OSk7IC8vIDFzdCBBUEkgam9iIGlzIHRvIGNhbGwgYWxsIGNoYWlu
IGxpc3RlbmVycy4gLy8gVE9ETzogLmtleXMoIGlzIHNsb3cgLy8gQlVHOiBTb21lIHJlLWluIGxvZ2ljIG1heSBkZXBlbmQgb24gdGhpcyBiZWluZyBzeW5j
LlxuXHRjYXQuZWNobyAmJiBzZXRUaW1lb3V0LmVhY2goT2JqZWN0LmtleXMoY2F0LmVjaG8pLCBmdW5jdGlvbihsYXQpeyAobGF0ID0gY2F0LmVjaG9bbGF0
XSkgJiYgbGF0Lm9uKCdpbicsIG1zZykgfSwwLDk5KTsgLy8gJiBsaW5rZWQgYXQgY2hhaW5zIC8vIFRPRE86IC5rZXlzKCBpcyBzbG93IC8vIEJVRzogU29t
ZSByZS1pbiBsb2dpYyBtYXkgZGVwZW5kIG9uIHRoaXMgYmVpbmcgc3luYy5cblxuXHRpZigoKG1zZy4kJHx8JycpLl98fGF0KS5zb3VsKXsgLy8gY29tbWVu
dHMgYXJlIGxpbmVhciwgYnV0IHRoaXMgbGluZSBvZiBjb2RlIGlzIG5vbi1saW5lYXIsIHNvIGlmIEkgd2VyZSB0byBjb21tZW50IHdoYXQgaXQgZG9lcywg
eW91J2QgaGF2ZSB0byByZWFkIDQyIG90aGVyIGNvbW1lbnRzIGZpcnN0Li4uIGJ1dCB5b3UgY2FuJ3QgcmVhZCBhbnkgb2YgdGhvc2UgY29tbWVudHMgdW50
aWwgeW91IGZpcnN0IHJlYWQgdGhpcyBjb21tZW50LiBXaGF0IT8gLy8gc2hvdWxkbid0IHRoaXMgbWF0Y2ggbGluaydzIGNoZWNrP1xuXHRcdC8vIGlzIHRo
ZXJlIGNhc2VzIHdoZXJlIGl0IGlzIGEgJCQgdGhhdCB3ZSBkbyBOT1Qgd2FudCB0byBkbyB0aGUgZm9sbG93aW5nPyBcblx0XHRpZigoc2F0ID0gY2F0Lm5l
eHQpICYmIChzYXQgPSBzYXRba2V5XSkpeyAvLyBUT0RPOiBwb3NzaWJsZSB0cmljaz8gTWF5YmUgaGF2ZSBgaW9ubWFwYCBjb2RlIHNldCBhIHNhdD8gLy8g
VE9ETzogTWF5YmUgd2Ugc2hvdWxkIGRvIGBjYXQuYXNrYCBpbnN0ZWFkPyBJIGd1ZXNzIGRvZXMgbm90IG1hdHRlci5cblx0XHRcdHRtcCA9IHt9OyBPYmpl
Y3Qua2V5cyhtc2cpLmZvckVhY2goZnVuY3Rpb24oayl7IHRtcFtrXSA9IG1zZ1trXSB9KTtcblx0XHRcdHRtcC4kID0gKG1zZy4kJHx8bXNnLiQpLmdldCh0
bXAuZ2V0ID0ga2V5KTsgZGVsZXRlIHRtcC4kJDsgZGVsZXRlIHRtcC4kJCQ7XG5cdFx0XHRzYXQub24oJ2luJywgdG1wKTtcblx0XHR9XG5cdH1cblxuXHRs
aW5rKG1zZywgY2F0KTtcbn07IEd1bi5vbi5pbiA9IGlucHV0O1xuXG5mdW5jdGlvbiBsaW5rKG1zZywgY2F0KXsgY2F0ID0gY2F0IHx8IHRoaXMuYXMgfHwg
bXNnLiQuXztcblx0aWYobXNnLiQkICYmIHRoaXMgIT09IEd1bi5vbil7IHJldHVybiB9IC8vICQkIG1lYW5zIHdlIGNhbWUgZnJvbSBhIGxpbmssIHNvIHdl
IGFyZSBhdCB0aGUgd3JvbmcgbGV2ZWwsIHRodXMgaWdub3JlIGl0IHVubGVzcyBvdmVycnVsZWQgbWFudWFsbHkgYnkgYmVpbmcgY2FsbGVkIGRpcmVjdGx5
LlxuXHRpZighbXNnLnB1dCB8fCBjYXQuc291bCl7IHJldHVybiB9IC8vIEJ1dCB5b3UgY2Fubm90IG92ZXJydWxlIGJlaW5nIGxpbmtlZCB0byBub3RoaW5n
LCBvciB0cnlpbmcgdG8gbGluayBhIHNvdWwgY2hhaW4gLSB0aGF0IG11c3QgbmV2ZXIgaGFwcGVuLlxuXHR2YXIgcHV0ID0gbXNnLnB1dHx8JycsIGxpbmsg
PSBwdXRbJz0nXXx8cHV0Wyc6J10sIHRtcDtcblx0dmFyIHJvb3QgPSBjYXQucm9vdCwgdGF0ID0gc2dldChyb290LCBwdXRbJyMnXSkuZ2V0KHB1dFsnLidd
KS5fO1xuXHRpZignc3RyaW5nJyAhPSB0eXBlb2YgKGxpbmsgPSB2YWxpZChsaW5rKSkpe1xuXHRcdGlmKHRoaXMgPT09IEd1bi5vbil7ICh0YXQuZWNobyB8
fCAodGF0LmVjaG8gPSB7fSkpW2NhdC5pZF0gPSBjYXQgfSAvLyBhbGxvdyBzb21lIGNoYWluIHRvIGV4cGxpY2l0bHkgZm9yY2UgbGlua2luZyB0byBzaW1w
bGUgZGF0YS5cblx0XHRyZXR1cm47IC8vIGJ5IGRlZmF1bHQgZG8gbm90IGxpbmsgdG8gZGF0YSB0aGF0IGlzIG5vdCBhIGxpbmsuXG5cdH1cblx0aWYoKHRh
dC5lY2hvIHx8ICh0YXQuZWNobyA9IHt9KSlbY2F0LmlkXSAvLyB3ZSd2ZSBhbHJlYWR5IGxpbmtlZCBvdXJzZWx2ZXMgc28gd2UgZG8gbm90IG5lZWQgdG8g
ZG8gaXQgYWdhaW4uIEV4Y2VwdC4uLiAoYW5ub3lpbmcgaW1wbGVtZW50YXRpb24gZGV0YWlscylcblx0XHQmJiAhKHJvb3QucGFzc3x8JycpW2NhdC5pZF0p
eyByZXR1cm4gfSAvLyBpZiBhIG5ldyBldmVudCBsaXN0ZW5lciB3YXMgYWRkZWQsIHdlIG5lZWQgdG8gbWFrZSBhIHBhc3MgdGhyb3VnaCBmb3IgaXQuIFRo
ZSBwYXNzIHdpbGwgYmUgb24gdGhlIGNoYWluLCBub3QgYWx3YXlzIHRoZSBjaGFpbiBwYXNzZWQgZG93bi4gXG5cdGlmKHRtcCA9IHJvb3QucGFzcyl7IGlm
KHRtcFtsaW5rK2NhdC5pZF0peyByZXR1cm4gfSB0bXBbbGluaytjYXQuaWRdID0gMSB9IC8vIEJ1dCB0aGUgYWJvdmUgZWRnZSBjYXNlIG1heSBcInBhc3Mg
dGhyb3VnaFwiIG9uIGEgY2lyY3VsYXIgZ3JhcGggY2F1c2luZyBpbmZpbml0ZSBwYXNzZXMsIHNvIHdlIGhhY2tpbHkgYWRkIGEgdGVtcG9yYXJ5IGNoZWNr
IGZvciB0aGF0LlxuXG5cdCh0YXQuZWNob3x8KHRhdC5lY2hvPXt9KSlbY2F0LmlkXSA9IGNhdDsgLy8gc2V0IG91cnNlbGYgdXAgZm9yIHRoZSBlY2hvISAv
LyBUT0RPOiBCVUc/IEVjaG8gdG8gc2VsZiBubyBsb25nZXIgY2F1c2VzIHByb2JsZW1zPyBDb25maXJtLlxuXG5cdGlmKGNhdC5oYXMpeyBjYXQubGluayA9
IGxpbmsgfVxuXHR2YXIgc2F0ID0gc2dldChyb290LCB0YXQubGluayA9IGxpbmspLl87IC8vIGdyYWIgd2hhdCB3ZSdyZSBsaW5raW5nIHRvLlxuXHQoc2F0
LmVjaG8gfHwgKHNhdC5lY2hvID0ge30pKVt0YXQuaWRdID0gdGF0OyAvLyBsaW5rIGl0LlxuXHR2YXIgdG1wID0gY2F0LmFza3x8Jyc7IC8vIGFzayB0aGUg
Y2hhaW4gZm9yIHdoYXQgbmVlZHMgdG8gYmUgbG9hZGVkIG5leHQhXG5cdGlmKHRtcFsnJ10gfHwgY2F0LmxleCl7IC8vIHdlIG1pZ2h0IG5lZWQgdG8gbG9h
ZCB0aGUgd2hvbGUgdGhpbmcgLy8gVE9ETzogY2F0LmxleCBwcm9iYWJseSBoYXMgZWRnZSBjYXNlIGJ1Z3MgdG8gaXQsIG5lZWQgbW9yZSB0ZXN0IGNvdmVy
YWdlLlxuXHRcdHNhdC5vbignb3V0Jywge2dldDogeycjJzogbGlua319KTtcblx0fVxuXHRzZXRUaW1lb3V0LmVhY2goT2JqZWN0LmtleXModG1wKSwgZnVu
Y3Rpb24oZ2V0LCBzYXQpeyAvLyBpZiBzdWIgY2hhaW5zIGFyZSBhc2tpbmcgZm9yIGRhdGEuIC8vIFRPRE86IC5rZXlzKCBpcyBzbG93IC8vIEJVRz8gP1Nv
bWUgcmUtaW4gbG9naWMgbWF5IGRlcGVuZCBvbiB0aGlzIGJlaW5nIHN5bmM/XG5cdFx0aWYoIWdldCB8fCAhKHNhdCA9IHRtcFtnZXRdKSl7IHJldHVybiB9
XG5cdFx0c2F0Lm9uKCdvdXQnLCB7Z2V0OiB7JyMnOiBsaW5rLCAnLic6IGdldH19KTsgLy8gZ28gZ2V0IGl0LlxuXHR9LDAsOTkpO1xufTsgR3VuLm9uLmxp
bmsgPSBsaW5rO1xuXG5mdW5jdGlvbiB1bmxpbmsobXNnLCBjYXQpeyAvLyB1Z2gsIHNvIG11Y2ggY29kZSBmb3Igc2VlbWluZ2x5IGVkZ2UgY2FzZSBiZWhh
dmlvci5cblx0dmFyIHB1dCA9IG1zZy5wdXR8fCcnLCBjaGFuZ2UgPSAodSAhPT0gcHV0Wyc9J10pPyBwdXRbJz0nXSA6IHB1dFsnOiddLCByb290ID0gY2F0
LnJvb3QsIGxpbmssIHRtcDtcblx0aWYodSA9PT0gY2hhbmdlKXsgLy8gMXN0IGVkZ2UgY2FzZTogSWYgd2UgaGF2ZSBhIGJyYW5kIG5ldyBkYXRhYmFzZSwg
bm8gZGF0YSB3aWxsIGJlIGZvdW5kLlxuXHRcdC8vIFRPRE86IEJVRyEgYmVjYXVzZSBlbXB0eWluZyBjYWNoZSBjb3VsZCBiZSBhc3luYyBmcm9tIGJlbG93
LCBtYWtlIHN1cmUgd2UgYXJlIG5vdCBlbXB0eWluZyBhIG5ld2VyIGNhY2hlLiBTbyBtYXliZSBwYXNzIGFuIEFzeW5jIElEIHRvIGNoZWNrIGFnYWluc3Q/
XG5cdFx0Ly8gVE9ETzogQlVHISBXaGF0IGlmIHRoaXMgaXMgYSBtYXA/IC8vIFdhcm5pbmchIENsZWFyaW5nIHRoaW5ncyBvdXQgbmVlZHMgdG8gYmUgcm9i
dXN0IGFnYWluc3Qgc3luYy9hc3luYyBvcHMsIG9yIGVsc2UgeW91J2xsIHNlZSBgbWFwIHZhbCBnZXQgcHV0YCB0ZXN0IGNhdGFzdHJvcGhpY2FsbHkgZmFp
bCBiZWNhdXNlIG1hcCBhdHRlbXB0cyB0byBsaW5rIHdoZW4gcGFyZW50IGdyYXBoIGlzIHN0cmVhbWVkIGJlZm9yZSBjaGlsZCB2YWx1ZSBnZXRzIHNldC4g
TmVlZCB0byBkaWZmZXJlbnRpYXRlIGJldHdlZW4gbGFjayBhY2tzIGFuZCBmb3JjZSBjbGVhcmluZy5cblx0XHRpZihjYXQuc291bCAmJiB1ICE9PSBjYXQu
cHV0KXsgcmV0dXJuIH0gLy8gZGF0YSBtYXkgbm90IGJlIGZvdW5kIG9uIGEgc291bCwgYnV0IGlmIGEgc291bCBhbHJlYWR5IGhhcyBkYXRhLCB0aGVuIG5v
dGhpbmcgY2FuIGNsZWFyIHRoZSBzb3VsIGFzIGEgd2hvbGUuXG5cdFx0Ly9pZighY2F0Lmhhcyl7IHJldHVybiB9XG5cdFx0dG1wID0gKG1zZy4kJHx8bXNn
LiR8fCcnKS5ffHwnJztcblx0XHRpZihtc2dbJ0AnXSAmJiAodSAhPT0gdG1wLnB1dCB8fCB1ICE9PSBjYXQucHV0KSl7IHJldHVybiB9IC8vIGEgXCJub3Qg
Zm91bmRcIiBmcm9tIG90aGVyIHBlZXJzIHNob3VsZCBub3QgY2xlYXIgb3V0IGRhdGEgaWYgd2UgaGF2ZSBhbHJlYWR5IGZvdW5kIGl0LlxuXHRcdC8vaWYo
Y2F0LmhhcyAmJiB1ID09PSBjYXQucHV0ICYmICEocm9vdC5wYXNzfHwnJylbY2F0LmlkXSl7IHJldHVybiB9IC8vIGlmIHdlIGFyZSBhbHJlYWR5IHVubGlu
a2VkLCBkbyBub3QgY2FsbCBhZ2FpbiwgdW5sZXNzIGVkZ2UgY2FzZS4gLy8gVE9ETzogQlVHISBUaGlzIGxpbmUgc2hvdWxkIGJlIGRlbGV0ZWQgZm9yIFwi
dW5saW5rIGRlZXBseSBuZXN0ZWRcIi5cblx0XHRpZihsaW5rID0gY2F0LmxpbmsgfHwgbXNnLmxpbmtlZCl7XG5cdFx0XHRkZWxldGUgKHNnZXQocm9vdCwg
bGluaykuXy5lY2hvfHwnJylbY2F0LmlkXTtcblx0XHR9XG5cdFx0aWYoY2F0Lmhhcyl7IC8vIFRPRE86IEVtcHR5IG91dCBsaW5rcywgbWFwcywgZWNob3Ms
IGFja3MvYXNrcywgZXRjLj9cblx0XHRcdGNhdC5saW5rID0gbnVsbDtcblx0XHR9XG5cdFx0Y2F0LnB1dCA9IHU7IC8vIGVtcHR5IG91dCB0aGUgY2FjaGUg
aWYsIGZvciBleGFtcGxlLCBhbGljZSdzIGNhcidzIGNvbG9yIG5vIGxvbmdlciBleGlzdHMgKHJlbGF0aXZlIHRvIGFsaWNlKSBpZiBhbGljZSBubyBsb25n
ZXIgaGFzIGEgY2FyLlxuXHRcdC8vIFRPRE86IEJVRyEgRm9yIG1hcHMsIHByb3h5IHRoaXMgc28gdGhlIGluZGl2aWR1YWwgc3ViIGlzIHRyaWdnZXJlZCwg
bm90IGFsbCBzdWJzLlxuXHRcdHNldFRpbWVvdXQuZWFjaChPYmplY3Qua2V5cyhjYXQubmV4dHx8JycpLCBmdW5jdGlvbihnZXQsIHNhdCl7IC8vIGVtcHR5
IG91dCBhbGwgc3ViIGNoYWlucy4gLy8gVE9ETzogLmtleXMoIGlzIHNsb3cgLy8gQlVHPyA/U29tZSByZS1pbiBsb2dpYyBtYXkgZGVwZW5kIG9uIHRoaXMg
YmVpbmcgc3luYz8gLy8gVE9ETzogQlVHPyBUaGlzIHdpbGwgdHJpZ2dlciBkZWVwZXIgcHV0IGZpcnN0LCBkb2VzIHB1dCBsb2dpYyBkZXBlbmQgb24gbmVz
dGVkIG9yZGVyPyAvLyBUT0RPOiBCVUchIEZvciBtYXAsIHRoaXMgbmVlZHMgdG8gYmUgdGhlIGlzb2xhdGVkIGNoaWxkLCBub3QgYWxsIG9mIHRoZW0uXG5c
dFx0XHRpZighKHNhdCA9IGNhdC5uZXh0W2dldF0pKXsgcmV0dXJuIH1cblx0XHRcdC8vaWYoY2F0LmhhcyAmJiB1ID09PSBzYXQucHV0ICYmICEocm9vdC5w
YXNzfHwnJylbc2F0LmlkXSl7IHJldHVybiB9IC8vIGlmIHdlIGFyZSBhbHJlYWR5IHVubGlua2VkLCBkbyBub3QgY2FsbCBhZ2FpbiwgdW5sZXNzIGVkZ2Ug
Y2FzZS4gLy8gVE9ETzogQlVHISBUaGlzIGxpbmUgc2hvdWxkIGJlIGRlbGV0ZWQgZm9yIFwidW5saW5rIGRlZXBseSBuZXN0ZWRcIi5cblx0XHRcdGlmKGxp
bmspeyBkZWxldGUgKHNnZXQocm9vdCwgbGluaykuZ2V0KGdldCkuXy5lY2hvfHwnJylbc2F0LmlkXSB9XG5cdFx0XHRzYXQub24oJ2luJywge2dldDogZ2V0
LCBwdXQ6IHUsICQ6IHNhdC4kfSk7IC8vIFRPRE86IEJVRz8gQWRkIHJlY3Vyc2l2ZSBzZWVuIGNoZWNrP1xuXHRcdH0sMCw5OSk7XG5cdFx0cmV0dXJuO1xu
XHR9XG5cdGlmKGNhdC5zb3VsKXsgcmV0dXJuIH0gLy8gYSBzb3VsIGNhbm5vdCB1bmxpbmsgaXRzZWxmLlxuXHRpZihtc2cuJCQpeyByZXR1cm4gfSAvLyBh
IGxpbmtlZCBjaGFpbiBkb2VzIG5vdCBkbyB0aGUgdW5saW5raW5nLCB0aGUgc3ViIGNoYWluIGRvZXMuIC8vIFRPRE86IEJVRz8gV2lsbCB0aGlzIGNhbmNl
bCBtYXBzP1xuXHRsaW5rID0gdmFsaWQoY2hhbmdlKTsgLy8gbmVlZCB0byB1bmxpbmsgYW55dGltZSB3ZSBhcmUgbm90IHRoZSBzYW1lIGxpbmssIHRob3Vn
aCBvbmx5IGRvIHRoaXMgb25jZSBwZXIgdW5saW5rIChhbmQgbm90IG9uIGluaXQpLlxuXHR0bXAgPSBtc2cuJC5ffHwnJztcblx0aWYobGluayA9PT0gdG1w
LmxpbmsgfHwgKGNhdC5oYXMgJiYgIXRtcC5saW5rKSl7XG5cdFx0aWYoKHJvb3QucGFzc3x8JycpW2NhdC5pZF0gJiYgJ3N0cmluZycgIT09IHR5cGVvZiBs
aW5rKXtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHR9XG5cdGRlbGV0ZSAodG1wLmVjaG98fCcnKVtjYXQuaWRdO1xuXHR1bmxp
bmsoe2dldDogY2F0LmdldCwgcHV0OiB1LCAkOiBtc2cuJCwgbGlua2VkOiBtc2cubGlua2VkID0gbXNnLmxpbmtlZCB8fCB0bXAubGlua30sIGNhdCk7IC8v
IHVubGluayBvdXIgc3ViIGNoYWlucy5cbn07IEd1bi5vbi51bmxpbmsgPSB1bmxpbms7XG5cbmZ1bmN0aW9uIGFjayhtc2csIGV2KXtcblx0Ly9pZighbXNn
WyclJ10gJiYgKHRoaXN8fCcnKS5vZmYpeyB0aGlzLm9mZigpIH0gLy8gZG8gTk9UIG1lbW9yeSBsZWFrLCB0dXJuIG9mZiBsaXN0ZW5lcnMhIE5vdyBoYW5k
bGVkIGJ5IC5hc2sgaXRzZWxmXG5cdC8vIG1hbmhhdHRhbjpcblx0dmFyIGFzID0gdGhpcy5hcywgYXQgPSBhcy4kLl8sIHJvb3QgPSBhdC5yb290LCBnZXQg
PSBhcy5nZXR8fCcnLCB0bXAgPSAobXNnLnB1dHx8JycpW2dldFsnIyddXXx8Jyc7XG5cdGlmKCFtc2cucHV0IHx8ICgnc3RyaW5nJyA9PSB0eXBlb2YgZ2V0
WycuJ10gJiYgdSA9PT0gdG1wW2dldFsnLiddXSkpe1xuXHRcdGlmKHUgIT09IGF0LnB1dCl7IHJldHVybiB9XG5cdFx0aWYoIWF0LnNvdWwgJiYgIWF0Lmhh
cyl7IHJldHVybiB9IC8vIFRPRE86IEJVRz8gRm9yIG5vdywgb25seSBjb3JlLWNoYWlucyB3aWxsIGhhbmRsZSBub3QtZm91bmRzLCBiZWNhdXNlIGJ1Z3Mg
Y3JlZXAgaW4gaWYgbm9uLWNvcmUgY2hhaW5zIGFyZSB1c2VkIGFzICQgYnV0IHdlIGNhbiByZXZpc2l0IHRoaXMgbGF0ZXIgZm9yIG1vcmUgcG93ZXJmdWwg
ZXh0ZW5zaW9ucy5cblx0XHRhdC5hY2sgPSAoYXQuYWNrIHx8IDApICsgMTtcblx0XHRhdC5vbignaW4nLCB7XG5cdFx0XHRnZXQ6IGF0LmdldCxcblx0XHRc
dHB1dDogYXQucHV0ID0gdSxcblx0XHRcdCQ6IGF0LiQsXG5cdFx0XHQnQCc6IG1zZ1snQCddXG5cdFx0fSk7XG5cdFx0LyoodG1wID0gYXQuUSkgJiYgc2V0
VGltZW91dC5lYWNoKE9iamVjdC5rZXlzKHRtcCksIGZ1bmN0aW9uKGlkKXsgLy8gVE9ETzogVGVtcG9yYXJ5IHRlc3RpbmcsIG5vdCBpbnRlZ3JhdGVkIG9y
IGJlaW5nIHVzZWQsIHByb2JhYmx5IGRlbGV0ZS5cblx0XHRcdE9iamVjdC5rZXlzKG1zZykuZm9yRWFjaChmdW5jdGlvbihrKXsgdG1wW2tdID0gbXNnW2td
IH0sIHRtcCA9IHt9KTsgdG1wWydAJ10gPSBpZDsgLy8gY29weSBtZXNzYWdlXG5cdFx0XHRyb290Lm9uKCdpbicsIHRtcCk7XG5cdFx0fSk7IGRlbGV0ZSBh
dC5ROyovXG5cdFx0cmV0dXJuO1xuXHR9XG5cdChtc2cuX3x8e30pLm1pc3MgPSAxO1xuXHRHdW4ub24ucHV0KG1zZyk7XG5cdHJldHVybjsgLy8gZW9tXG59
XG5cbnZhciBlbXB0eSA9IHt9LCB1LCB0ZXh0X3JhbmQgPSBTdHJpbmcucmFuZG9tLCB2YWxpZCA9IEd1bi52YWxpZCwgb2JqX2hhcyA9IGZ1bmN0aW9uKG8s
IGspeyByZXR1cm4gbyAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgaykgfSwgc3RhdGUgPSBHdW4uc3RhdGUsIHN0YXRlX2lz
ID0gc3RhdGUuaXMsIHN0YXRlX2lmeSA9IHN0YXRlLmlmeTtcbmZ1bmN0aW9uIHNnZXQocm9vdCwgc291bCl7IHJvb3QuX3NsID0gMTsgdmFyIGcgPSByb290
LiQuZ2V0KHNvdWwpOyByb290Ll9zbCA9IDA7IHJldHVybiBnIH1cblx0XG59KCkpOyIsInNyYy9nZXQuanMiOiJpbXBvcnQgX19yb290IGZyb20gJy4vcm9v
dC5qcyc7XG4oZnVuY3Rpb24oKXtcblxudmFyIEd1biA9IF9fcm9vdDtcbkd1bi5jaGFpbi5nZXQgPSBmdW5jdGlvbihrZXksIGNiLCBhcyl7XG5cdHZhciBn
dW4sIHRtcDtcblx0aWYodHlwZW9mIGtleSA9PT0gJ3N0cmluZycpe1xuXHRcdGlmKGtleS5sZW5ndGggPT0gMCkge1x0XG5cdFx0XHQoZ3VuID0gdGhpcy5j
aGFpbigpKS5fLmVyciA9IHtlcnI6IEd1bi5sb2coJzAgbGVuZ3RoIGtleSEnLCBrZXkpfTtcblx0XHRcdGlmKGNiKXsgY2IuY2FsbChndW4sIGd1bi5fLmVy
cikgfVxuXHRcdFx0cmV0dXJuIGd1bjtcblx0XHR9XG5cdFx0dmFyIGJhY2sgPSB0aGlzLCBjYXQgPSBiYWNrLl87XG5cdFx0dmFyIG5leHQgPSBjYXQubmV4
dCB8fCBlbXB0eTtcblx0XHRpZihiYWNrID09PSBjYXQucm9vdC4kICYmIGtleS5pbmRleE9mKCcvJykgPj0gMCAmJiAhY2F0LnJvb3QuX3NsICYmICFjYXQu
cm9vdC5ncmFwaFtrZXldKXtcblx0XHRcdHZhciBwYXJ0cyA9IGtleS5zcGxpdCgnLycpLCBpID0gMCwgY3VyID0gYmFjay5fLCBvayA9IDE7XG5cdFx0XHR3
aGlsZShpIDwgcGFydHMubGVuZ3RoKXtcblx0XHRcdFx0aWYoISgoY3VyLm5leHR8fHt9KVtwYXJ0c1tpXV0pKXsgb2sgPSAwOyBicmVhayB9XG5cdFx0XHRc
dGN1ciA9IGN1ci5uZXh0W3BhcnRzW2krK11dLiQuXzsgXG5cdFx0XHR9XG5cdFx0XHRpZihvayl7XG5cdFx0XHRcdHZhciBuYXYgPSBiYWNrOyBpID0gMDtc
blx0XHRcdFx0d2hpbGUoaSA8IHBhcnRzLmxlbmd0aCl7IG5hdiA9IG5hdi5nZXQocGFydHNbaSsrXSkgfVxuXHRcdFx0XHRyZXR1cm4gbmF2O1xuXHRcdFx0
fVxuXHRcdH1cblx0XHRpZighKGd1biA9IG5leHRba2V5XSkpe1xuXHRcdFx0Z3VuID0ga2V5ICYmIGNhY2hlKGtleSwgYmFjayk7XG5cdFx0fVxuXHRcdGd1
biA9IGd1biAmJiBndW4uJDtcblx0fSBlbHNlXG5cdGlmKCdmdW5jdGlvbicgPT0gdHlwZW9mIGtleSl7XG5cdFx0aWYodHJ1ZSA9PT0gY2IpeyByZXR1cm4g
c291bCh0aGlzLCBrZXksIGNiLCBhcyksIHRoaXMgfVxuXHRcdGd1biA9IHRoaXM7XG5cdFx0dmFyIGNhdCA9IGd1bi5fLCBvcHQgPSBjYiB8fCB7fSwgcm9v
dCA9IGNhdC5yb290LCBpZDtcblx0XHRvcHQuYXQgPSBjYXQ7XG5cdFx0b3B0Lm9rID0ga2V5O1xuXHRcdHZhciB3YWl0ID0ge307IC8vIGNhbiB3ZSBhc3Np
Z24gdGhpcyB0byB0aGUgYXQgaW5zdGVhZCwgbGlrZSBpbiBvbmNlP1xuXHRcdC8vdmFyIHBhdGggPSBbXTsgY2F0LiQuYmFjayhhdCA9PiB7IGF0LmdldCAm
JiBwYXRoLnB1c2goYXQuZ2V0LnNsaWNlKDAsOSkpfSk7IHBhdGggPSBwYXRoLnJldmVyc2UoKS5qb2luKCcuJyk7XG5cdFx0ZnVuY3Rpb24gYW55KG1zZywg
ZXZlLCBmKXtcblx0XHRcdGlmKGFueS5zdHVuKXsgcmV0dXJuIH1cblx0XHRcdGlmKCh0bXAgPSByb290LnBhc3MpICYmICF0bXBbaWRdKXsgcmV0dXJuIH1c
blx0XHRcdHZhciBhdCA9IG1zZy4kLl8sIHNhdCA9IChtc2cuJCR8fCcnKS5fLCBkYXRhID0gKHNhdHx8YXQpLnB1dCwgb2RkID0gKCFhdC5oYXMgJiYgIWF0
LnNvdWwpLCB0ZXN0ID0ge30sIGxpbmssIHRtcDtcblx0XHRcdGlmKG9kZCB8fCB1ID09PSBkYXRhKXsgLy8gaGFuZGxlcyBub24tY29yZVxuXHRcdFx0XHRk
YXRhID0gKHUgPT09ICgodG1wID0gbXNnLnB1dCl8fCcnKVsnPSddKT8gKHUgPT09ICh0bXB8fCcnKVsnOiddKT8gdG1wIDogdG1wWyc6J10gOiB0bXBbJz0n
XTtcblx0XHRcdH1cblx0XHRcdGlmKGxpbmsgPSAoJ3N0cmluZycgPT0gdHlwZW9mICh0bXAgPSBHdW4udmFsaWQoZGF0YSkpKSl7XG5cdFx0XHRcdGRhdGEg
PSAodSA9PT0gKHRtcCA9IHJvb3QuJC5nZXQodG1wKS5fLnB1dCkpPyBvcHQubm90PyB1IDogZGF0YSA6IHRtcDtcblx0XHRcdH1cblx0XHRcdGlmKG9wdC5u
b3QgJiYgdSA9PT0gZGF0YSl7IHJldHVybiB9XG5cdFx0XHRpZih1ID09PSBvcHQuc3R1bil7XG5cdFx0XHRcdGlmKCh0bXAgPSByb290LnN0dW4pICYmIHRt
cC5vbil7XG5cdFx0XHRcdFx0Y2F0LiQuYmFjayhmdW5jdGlvbihhKXsgLy8gb3VyIGNoYWluIHN0dW5uZWQ/XG5cdFx0XHRcdFx0XHR0bXAub24oJycrYS5p
ZCwgdGVzdCA9IHt9KTtcblx0XHRcdFx0XHRcdGlmKCh0ZXN0LnJ1biB8fCAwKSA8IGFueS5pZCl7IHJldHVybiB0ZXN0IH0gLy8gaWYgdGhlcmUgaXMgYW4g
ZWFybGllciBzdHVuIG9uIGdhcGxlc3MgcGFyZW50cy9zZWxmLlxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdCF0ZXN0LnJ1biAmJiB0bXAub24oJycrYXQu
aWQsIHRlc3QgPSB7fSk7IC8vIHRoaXMgbm9kZSBzdHVubmVkP1xuXHRcdFx0XHRcdCF0ZXN0LnJ1biAmJiBzYXQgJiYgdG1wLm9uKCcnK3NhdC5pZCwgdGVz
dCA9IHt9KTsgLy8gbGlua2VkIG5vZGUgc3R1bm5lZD9cblx0XHRcdFx0XHRpZihhbnkuaWQgPiB0ZXN0LnJ1bil7XG5cdFx0XHRcdFx0XHRpZighdGVzdC5z
dHVuIHx8IHRlc3Quc3R1bi5lbmQpe1xuXHRcdFx0XHRcdFx0XHR0ZXN0LnN0dW4gPSB0bXAub24oJ3N0dW4nKTtcblx0XHRcdFx0XHRcdFx0dGVzdC5zdHVu
ID0gdGVzdC5zdHVuICYmIHRlc3Quc3R1bi5sYXN0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYodGVzdC5zdHVuICYmICF0ZXN0LnN0dW4uZW5k
KXtcblx0XHRcdFx0XHRcdFx0Ly9pZihvZGQgJiYgdSA9PT0gZGF0YSl7IHJldHVybiB9XG5cdFx0XHRcdFx0XHRcdC8vaWYodSA9PT0gbXNnLnB1dCl7IHJl
dHVybiB9IC8vIFwibm90IGZvdW5kXCIgYWNrcyB3aWxsIGJlIGZvdW5kIGlmIHRoZXJlIGlzIHN0dW4sIHNvIGlnbm9yZSB0aGVzZS5cblx0XHRcdFx0XHRc
dFx0KHRlc3Quc3R1bi5hZGQgfHwgKHRlc3Quc3R1bi5hZGQgPSB7fSkpW2lkXSA9IGZ1bmN0aW9uKCl7IGFueShtc2csZXZlLDEpIH0gLy8gYWRkIG91cnNl
bGYgdG8gdGhlIHN0dW4gY2FsbGJhY2sgbGlzdCB0aGF0IGlzIGNhbGxlZCBhdCBlbmQgb2YgdGhlIHdyaXRlLlxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5c
dFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKC8qb2RkICYmKi8gdSA9PT0gZGF0YSl7IGYgPSAwIH0gLy8gaWYgZGF0
YSBub3QgZm91bmQsIGtlZXAgd2FpdGluZy90cnlpbmcuXG5cdFx0XHRcdC8qaWYoZiAmJiB1ID09PSBkYXRhKXtcblx0XHRcdFx0XHRjYXQub24oJ291dCcs
IG9wdC5vdXQpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fSovXG5cdFx0XHRcdGlmKCh0bXAgPSByb290LmhhdGNoKSAmJiAhdG1wLmVuZCAmJiB1
ID09PSBvcHQuaGF0Y2ggJiYgIWYpeyAvLyBxdWljayBoYWNrISAvLyBXaGF0J3MgZ29pbmcgb24gaGVyZT8gQmVjYXVzZSBkYXRhIGlzIHN0cmVhbWVkLCB3
ZSBnZXQgdGhpbmdzIG9uZSBieSBvbmUsIGJ1dCBhIGxvdCBvZiBkZXZlbG9wZXJzIHdvdWxkIHJhdGhlciBnZXQgYSBjYWxsYmFjayBhZnRlciBlYWNoIGJh
dGNoIGluc3RlYWQsIHNvIHRoaXMgZG9lcyB0aGF0IGJ5IGNyZWF0aW5nIGEgd2FpdCBsaXN0IHBlciBjaGFpbiBpZCB0aGF0IGlzIHRoZW4gY2FsbGVkIGF0
IHRoZSBlbmQgb2YgdGhlIGJhdGNoIGJ5IHRoZSBoYXRjaCBjb2RlIGluIHRoZSByb290IHB1dCBsaXN0ZW5lci5cblx0XHRcdFx0XHRpZih3YWl0W2F0LiQu
Xy5pZF0peyByZXR1cm4gfSB3YWl0W2F0LiQuXy5pZF0gPSAxO1xuXHRcdFx0XHRcdHRtcC5wdXNoKGZ1bmN0aW9uKCl7YW55KG1zZyxldmUsMSl9KTtcblx0
XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH07IHdhaXQgPSB7fTsgLy8gZW5kIHF1aWNrIGhhY2suXG5cdFx0XHR9XG5cdFx0XHQvLyBjYWxsOlxuXHRcdFx0
aWYocm9vdC5wYXNzKXsgaWYocm9vdC5wYXNzW2lkK2F0LmlkXSl7IHJldHVybiB9IHJvb3QucGFzc1tpZCthdC5pZF0gPSAxIH1cblx0XHRcdGlmKG9wdC5v
bil7IG9wdC5vay5jYWxsKGF0LiQsIGRhdGEsIGF0LmdldCwgbXNnLCBldmUgfHwgYW55KTsgcmV0dXJuIH0gLy8gVE9ETzogQWxzbyBjb25zaWRlciBicmVh
a2luZyBgdGhpc2Agc2luY2UgYSBsb3Qgb2YgcGVvcGxlIGRvIGA9PmAgdGhlc2UgZGF5cyBhbmQgYC5jYWxsKGAgaGFzIHNsb3dlciBwZXJmb3JtYW5jZS5c
blx0XHRcdGlmKG9wdC52MjAyMCl7IG9wdC5vayhtc2csIGV2ZSB8fCBhbnkpOyByZXR1cm4gfVxuXHRcdFx0T2JqZWN0LmtleXMobXNnKS5mb3JFYWNoKGZ1
bmN0aW9uKGspeyB0bXBba10gPSBtc2dba10gfSwgdG1wID0ge30pOyBtc2cgPSB0bXA7IG1zZy5wdXQgPSBkYXRhOyAvLyAyMDE5IENPTVBBVElCSUxJVFkh
IFRPRE86IEdFVCBSSUQgT0YgVEhJUyFcblx0XHRcdG9wdC5vay5jYWxsKG9wdC5hcywgbXNnLCBldmUgfHwgYW55KTsgLy8gaXMgdGhpcyB0aGUgcmlnaHRc
blx0XHR9O1xuXHRcdGFueS5hdCA9IGNhdDtcblx0XHQvLyhjYXQuYW55fHwoY2F0LmFueT1mdW5jdGlvbihtc2cpeyBzZXRUaW1lb3V0LmVhY2goT2JqZWN0
LmtleXMoY2F0LmFueXx8JycpLCBmdW5jdGlvbihhY3QpeyAoYWN0ID0gY2F0LmFueVthY3RdKSAmJiBhY3QobXNnKSB9LDAsOTkpIH0pKVtpZCA9IFN0cmlu
Zy5yYW5kb20oNyldID0gYW55OyAvLyBtYXliZSBzd2l0Y2ggdG8gdGhpcyBpbiBmdXR1cmU/XG5cdFx0KGNhdC5hbnl8fChjYXQuYW55PXt9KSlbaWQgPSBT
dHJpbmcucmFuZG9tKDcpXSA9IGFueTtcblx0XHRhbnkub2ZmID0gZnVuY3Rpb24oKXsgYW55LnN0dW4gPSAxOyBpZighY2F0LmFueSl7IHJldHVybiB9IGRl
bGV0ZSBjYXQuYW55W2lkXSB9XG5cdFx0YW55LnJpZCA9IHJpZDsgLy8gbG9naWMgZnJvbSBvbGQgdmVyc2lvbiwgY2FuIHdlIGNsZWFuIGl0IHVwIG5vdz9c
blx0XHRhbnkuaWQgPSBvcHQucnVuIHx8ICsrcm9vdC5vbmNlOyAvLyB1c2VkIGluIGNhbGxiYWNrIHRvIGNoZWNrIGlmIHdlIGFyZSBlYXJsaWVyIHRoYW4g
YSB3cml0ZS4gLy8gd2lsbCB0aGlzIGV2ZXIgY2F1c2UgYW4gaW50ZWdlciBvdmVyZmxvdz9cblx0XHR0bXAgPSByb290LnBhc3M7IChyb290LnBhc3MgPSB7
fSlbaWRdID0gMTsgLy8gRXhwbGFuYXRpb246IHRlc3QgdHJhZGUtb2ZmcyB3YW50IHRvIHByZXZlbnQgcmVjdXJzaW9uIHNvIHdlIGFkZC9yZW1vdmUgcGFz
cyBmbGFnIGFzIGl0IGdldHMgZnVsZmlsbGVkIHRvIG5vdCByZXBlYXQsIGhvd2V2ZXIgbWFwIG1hcCBuZWVkcyBtYW55IHBhc3MgZmxhZ3MgLSBob3cgZG8g
d2UgcmVjb25jaWxlP1xuXHRcdG9wdC5vdXQgPSBvcHQub3V0IHx8IHtnZXQ6IHt9fTtcblx0XHRjYXQub24oJ291dCcsIG9wdC5vdXQpO1xuXHRcdHJvb3Qu
cGFzcyA9IHRtcDtcblx0XHRyZXR1cm4gZ3VuO1xuXHR9IGVsc2Vcblx0aWYoJ251bWJlcicgPT0gdHlwZW9mIGtleSl7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0
KCcnK2tleSwgY2IsIGFzKTtcblx0fSBlbHNlXG5cdGlmKCdzdHJpbmcnID09IHR5cGVvZiAodG1wID0gdmFsaWQoa2V5KSkpe1xuXHRcdHJldHVybiB0aGlz
LmdldCh0bXAsIGNiLCBhcyk7XG5cdH0gZWxzZVxuXHRpZih0bXAgPSB0aGlzLmdldC5uZXh0KXtcblx0XHRndW4gPSB0bXAodGhpcywga2V5KTtcblx0fVxu
XHRpZighZ3VuKXtcblx0XHQoZ3VuID0gdGhpcy5jaGFpbigpKS5fLmVyciA9IHtlcnI6IEd1bi5sb2coJ0ludmFsaWQgZ2V0IHJlcXVlc3QhJywga2V5KX07
IC8vIENMRUFOIFVQXG5cdFx0aWYoY2IpeyBjYi5jYWxsKGd1biwgZ3VuLl8uZXJyKSB9XG5cdFx0cmV0dXJuIGd1bjtcblx0fVxuXHRpZihjYiAmJiAnZnVu
Y3Rpb24nID09IHR5cGVvZiBjYil7XG5cdFx0Z3VuLmdldChjYiwgYXMpO1xuXHR9XG5cdHJldHVybiBndW47XG59XG5mdW5jdGlvbiBjYWNoZShrZXksIGJh
Y2spe1xuXHR2YXIgY2F0ID0gYmFjay5fLCBuZXh0ID0gY2F0Lm5leHQsIGd1biA9IGJhY2suY2hhaW4oKSwgYXQgPSBndW4uXztcblx0aWYoIW5leHQpeyBu
ZXh0ID0gY2F0Lm5leHQgPSB7fSB9XG5cdG5leHRbYXQuZ2V0ID0ga2V5XSA9IGF0O1xuXHRpZihiYWNrID09PSBjYXQucm9vdC4kKXtcblx0XHRhdC5zb3Vs
ID0ga2V5O1xuXHRcdC8vYXQucHV0ID0ge307XG5cdH0gZWxzZVxuXHRpZihjYXQuc291bCB8fCBjYXQuaGFzKXtcblx0XHRhdC5oYXMgPSBrZXk7XG5cdFx0
Ly9pZihvYmpfaGFzKGNhdC5wdXQsIGtleSkpe1xuXHRcdFx0Ly9hdC5wdXQgPSBjYXQucHV0W2tleV07XG5cdFx0Ly99XG5cdH1cblx0cmV0dXJuIGF0O1xu
fVxuZnVuY3Rpb24gc291bChndW4sIGNiLCBvcHQsIGFzKXtcblx0dmFyIGNhdCA9IGd1bi5fLCBhY2tzID0gMCwgdG1wO1xuXHRpZih0bXAgPSBjYXQuc291
bCB8fCBjYXQubGluayl7IHJldHVybiBjYih0bXAsIGFzLCBjYXQpIH1cblx0aWYoY2F0LmphbSl7IHJldHVybiBjYXQuamFtLnB1c2goW2NiLCBhc10pIH1c
blx0Y2F0LmphbSA9IFtbY2IsYXNdXTtcblx0Z3VuLmdldChmdW5jdGlvbiBnbyhtc2csIGV2ZSl7XG5cdFx0aWYodSA9PT0gbXNnLnB1dCAmJiAhY2F0LnJv
b3Qub3B0LnN1cGVyICYmICh0bXAgPSBPYmplY3Qua2V5cyhjYXQucm9vdC5vcHQucGVlcnMpLmxlbmd0aCkgJiYgKythY2tzIDw9IHRtcCl7IC8vIFRPRE86
IHN1cGVyIHNob3VsZCBub3QgYmUgaW4gY29yZSBjb2RlLCBicmluZyBBWEUgdXAgaW50byBjb3JlIGluc3RlYWQgdG8gZml4PyAvLyBUT0RPOiAua2V5cygg
aXMgc2xvd1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRldmUucmlkKG1zZyk7XG5cdFx0dmFyIGF0ID0gKChhdCA9IG1zZy4kKSAmJiBhdC5fKSB8fCB7
fSwgaSA9IDAsIGFzO1xuXHRcdHRtcCA9IGNhdC5qYW07IGRlbGV0ZSBjYXQuamFtOyAvLyB0bXAgPSBjYXQuamFtLnNwbGljZSgwLCAxMDApO1xuXHRcdC8v
aWYodG1wLmxlbmd0aCl7IHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKXsgZ28obXNnLCBldmUpIH0pIH1cblx0XHR3aGlsZShhcyA9IHRtcFtpKytdKXsg
Ly9HdW4ub2JqLm1hcCh0bXAsIGZ1bmN0aW9uKGFzLCBjYil7XG5cdFx0XHR2YXIgY2IgPSBhc1swXSwgaWQ7IGFzID0gYXNbMV07XG5cdFx0XHRjYiAmJiBj
YihpZCA9IGF0LmxpbmsgfHwgYXQuc291bCB8fCBHdW4udmFsaWQobXNnLnB1dCkgfHwgKChtc2cucHV0fHx7fSkuX3x8e30pWycjJ10sIGFzLCBtc2csIGV2
ZSk7XG5cdFx0fSAvLyk7XG5cdH0sIHtvdXQ6IHtnZXQ6IHsnLic6dHJ1ZX19fSk7XG5cdHJldHVybiBndW47XG59XG5mdW5jdGlvbiByaWQoYXQpe1xuXHR2
YXIgY2F0ID0gdGhpcy5hdCB8fCB0aGlzLm9uO1xuXHRpZighYXQgfHwgY2F0LnNvdWwgfHwgY2F0Lmhhcyl7IHJldHVybiB0aGlzLm9mZigpIH1cblx0aWYo
IShhdCA9IChhdCA9IChhdCA9IGF0LiQgfHwgYXQpLl8gfHwgYXQpLmlkKSl7IHJldHVybiB9XG5cdHZhciBtYXAgPSBjYXQubWFwLCB0bXAsIHNlZW47XG5c
dC8vaWYoIW1hcCB8fCAhKHRtcCA9IG1hcFthdF0pIHx8ICEodG1wID0gdG1wLmF0KSl7IHJldHVybiB9XG5cdGlmKHRtcCA9IChzZWVuID0gdGhpcy5zZWVu
IHx8ICh0aGlzLnNlZW4gPSB7fSkpW2F0XSl7IHJldHVybiB0cnVlIH1cblx0c2VlblthdF0gPSB0cnVlO1xuXHQvL3RtcC5lY2hvW2NhdC5pZF0gPSB7fTsg
Ly8gVE9ETzogV2FybmluZzogVGhpcyB1bnN1YnNjcmliZXMgQUxMIG9mIHRoaXMgY2hhaW4ncyBsaXN0ZW5lcnMgZnJvbSB0aGlzIGxpbmssIG5vdCBqdXN0
IHRoZSBvbmUgY2FsbGJhY2sgZXZlbnQuXG5cdC8vb2JqLmRlbChtYXAsIGF0KTsgLy8gVE9ETzogV2FybmluZzogVGhpcyB1bnN1YnNjcmliZXMgQUxMIG9m
IHRoaXMgY2hhaW4ncyBsaXN0ZW5lcnMgZnJvbSB0aGlzIGxpbmssIG5vdCBqdXN0IHRoZSBvbmUgY2FsbGJhY2sgZXZlbnQuXG5cdHJldHVybjtcbn1cbnZh
ciBlbXB0eSA9IHt9LCB2YWxpZCA9IEd1bi52YWxpZCwgdTtcblx0XG59KCkpOyIsInNyYy9wdXQuanMiOiJpbXBvcnQgX19yb290IGZyb20gJy4vcm9vdC5q
cyc7XG4oZnVuY3Rpb24oKXtcblxudmFyIEd1biA9IF9fcm9vdDtcbkd1bi5jaGFpbi5wdXQgPSBmdW5jdGlvbihkYXRhLCBjYiwgYXMpeyAvLyBJIHJld3Jv
dGUgaXQgOilcblx0dmFyIGd1biA9IHRoaXMsIGF0ID0gZ3VuLl8sIHJvb3QgPSBhdC5yb290O1xuXHRhcyA9IGFzIHx8IHt9O1xuXHRhcy5yb290ID0gYXQu
cm9vdDtcblx0YXMucnVuIHx8IChhcy5ydW4gPSByb290Lm9uY2UpO1xuXHRzdHVuKGFzLCBhdC5pZCk7IC8vIHNldCBhIGZsYWcgZm9yIHJlYWRzIHRvIGNo
ZWNrIGlmIHRoaXMgY2hhaW4gaXMgd3JpdGluZy5cblx0YXMuYWNrID0gYXMuYWNrIHx8IGNiO1xuXHRhcy52aWEgPSBhcy52aWEgfHwgZ3VuO1xuXHRhcy5k
YXRhID0gYXMuZGF0YSB8fCBkYXRhO1xuXHRhcy5zb3VsIHx8IChhcy5zb3VsID0gYXQuc291bCB8fCAoJ3N0cmluZycgPT0gdHlwZW9mIGNiICYmIGNiKSk7
XG5cdHZhciBzID0gYXMuc3RhdGUgPSBhcy5zdGF0ZSB8fCBHdW4uc3RhdGUoKTtcblx0aWYoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSl7IGRhdGEoZnVu
Y3Rpb24oZCl7IGFzLmRhdGEgPSBkOyBndW4ucHV0KHUsdSxhcykgfSk7IHJldHVybiBndW4gfVxuXHRpZighYXMuc291bCl7IHJldHVybiBnZXQoYXMpLCBn
dW4gfVxuXHRhcy4kID0gcm9vdC4kLmdldChhcy5zb3VsKTsgLy8gVE9ETzogVGhpcyBtYXkgbm90IGFsbG93IHVzZXIgY2hhaW5pbmcgYW5kIHNpbWlsYXI/
XG5cdGFzLnRvZG8gPSBbe2l0OiBhcy5kYXRhLCByZWY6IGFzLiR9XTtcblx0YXMudHVybiA9IGFzLnR1cm4gfHwgdHVybjtcblx0YXMucmFuID0gYXMucmFu
IHx8IHJhbjtcblx0Ly92YXIgcGF0aCA9IFtdOyBhcy52aWEuYmFjayhhdCA9PiB7IGF0LmdldCAmJiBwYXRoLnB1c2goYXQuZ2V0LnNsaWNlKDAsOSkpIH0p
OyBwYXRoID0gcGF0aC5yZXZlcnNlKCkuam9pbignLicpO1xuXHQvLyBUT0RPOiBQZXJmISBXZSBvbmx5IG5lZWQgdG8gc3R1biBjaGFpbnMgdGhhdCBhcmUg
YmVpbmcgbW9kaWZpZWQsIG5vdCBuZWNlc3NhcmlseSB3cml0dGVuIHRvLlxuXHQoZnVuY3Rpb24gd2Fsaygpe1xuXHRcdHZhciB0byA9IGFzLnRvZG8sIGF0
ID0gdG8ucG9wKCksIGQgPSBhdC5pdCwgY2lkID0gYXQucmVmICYmIGF0LnJlZi5fLmlkLCB2LCBrLCBjYXQsIHRtcCwgZztcblx0XHRzdHVuKGFzLCBhdC5y
ZWYpO1xuXHRcdGlmKHRtcCA9IGF0LnRvZG8pe1xuXHRcdFx0ayA9IHRtcC5wb3AoKTsgZCA9IGRba107XG5cdFx0XHRpZih0bXAubGVuZ3RoKXsgdG8ucHVz
aChhdCkgfVxuXHRcdH1cblx0XHRrICYmICh0by5wYXRoIHx8ICh0by5wYXRoID0gW10pKS5wdXNoKGspO1xuXHRcdGlmKCEodiA9IHZhbGlkKGQpKSAmJiAh
KGcgPSBHdW4uaXMoZCkpKXtcblx0XHRcdGlmKCFPYmplY3QucGxhaW4oZCkpeyByYW4uZXJyKGFzLCBcIkludmFsaWQgZGF0YTogXCIrIGNoZWNrKGQpICtc
IiBhdCBcIiArIChhcy52aWEuYmFjayhmdW5jdGlvbihhdCl7YXQuZ2V0ICYmIHRtcC5wdXNoKGF0LmdldCl9LCB0bXAgPSBbXSkgfHwgdG1wLmpvaW4oJy4n
KSkrJy4nKyh0by5wYXRofHxbXSkuam9pbignLicpKTsgcmV0dXJuIH1cblx0XHRcdHZhciBzZWVuID0gYXMuc2VlbiB8fCAoYXMuc2VlbiA9IFtdKSwgaSA9
IHNlZW4ubGVuZ3RoO1xuXHRcdFx0d2hpbGUoaS0tKXsgaWYoZCA9PT0gKHRtcCA9IHNlZW5baV0pLml0KXsgdiA9IGQgPSB0bXAubGluazsgYnJlYWsgfSB9
XG5cdFx0fVxuXHRcdGlmKGsgJiYgdil7IGF0Lm5vZGUgPSBzdGF0ZV9pZnkoYXQubm9kZSwgaywgcywgZCkgfSAvLyBoYW5kbGUgc291bCBsYXRlci5cblx0
XHRlbHNlIHtcblx0XHRcdGlmKCFhcy5zZWVuKXsgcmFuLmVycihhcywgXCJEYXRhIGF0IHJvb3Qgb2YgZ3JhcGggbXVzdCBiZSBhIG5vZGUgKGFuIG9iamVj
dCkuXCIpOyByZXR1cm4gfVxuXHRcdFx0YXMuc2Vlbi5wdXNoKGNhdCA9IHtpdDogZCwgbGluazoge30sIHRvZG86IGc/IFtdIDogT2JqZWN0LmtleXMoZCku
c29ydCgpLnJldmVyc2UoKSwgcGF0aDogKHRvLnBhdGh8fFtdKS5zbGljZSgpLCB1cDogYXR9KTsgLy8gQW55IHBlcmYgcmVhc29ucyB0byBDUFUgc2NoZWR1
bGUgdGhpcyAua2V5cyggP1xuXHRcdFx0YXQubm9kZSA9IHN0YXRlX2lmeShhdC5ub2RlLCBrLCBzLCBjYXQubGluayk7XG5cdFx0XHQhZyAmJiBjYXQudG9k
by5sZW5ndGggJiYgdG8ucHVzaChjYXQpO1xuXHRcdFx0Ly8gLS0tLS0tLS0tLS0tLS0tXG5cdFx0XHR2YXIgaWQgPSBhcy5zZWVuLmxlbmd0aDtcblx0XHRc
dChhcy53YWl0IHx8IChhcy53YWl0ID0ge30pKVtpZF0gPSAnJztcblx0XHRcdHRtcCA9IChjYXQucmVmID0gKGc/IGQgOiBrPyBhdC5yZWYuZ2V0KGspIDog
YXQucmVmKSkuXztcblx0XHRcdCh0bXAgPSAoZCAmJiAoZC5ffHwnJylbJyMnXSkgfHwgdG1wLnNvdWwgfHwgdG1wLmxpbmspPyByZXNvbHZlKHtzb3VsOiB0
bXB9KSA6IGNhdC5yZWYuZ2V0KHJlc29sdmUsIHtydW46IGFzLnJ1biwgLypoYXRjaDogMCwqLyB2MjAyMDoxLCBvdXQ6e2dldDp7Jy4nOicgJ319fSk7IC8v
IFRPRE86IEJVRyEgVGhpcyBzaG91bGQgYmUgcmVzb2x2ZSBPTkxZIHNvdWwgdG8gcHJldmVudCBmdWxsIGRhdGEgZnJvbSBiZWluZyBsb2FkZWQuIC8vIEZp
eGVkIG5vdz9cblx0XHRcdC8vc2V0VGltZW91dChmdW5jdGlvbigpeyBpZihGKXsgcmV0dXJuIH0gY29uc29sZS5sb2coXCJJIEhBVkUgTk9UIEJFRU4gQ0FM
TEVEIVwiLCBwYXRoLCBpZCwgY2F0LnJlZi5fLmlkLCBrKSB9LCA5MDAwKTsgdmFyIEY7IC8vIE1BS0UgU1VSRSBUTyBBREQgRiA9IDEgYmVsb3chXG5cdFx0
XHRmdW5jdGlvbiByZXNvbHZlKG1zZywgZXZlKXtcblx0XHRcdFx0dmFyIGVuZCA9IGNhdC5saW5rWycjJ107XG5cdFx0XHRcdGlmKGV2ZSl7IGV2ZS5vZmYo
KTsgZXZlLnJpZChtc2cpIH0gLy8gVE9ETzogVG9vIGVhcmx5ISBDaGVjayBhbGwgcGVlcnMgYWNrIG5vdCBmb3VuZC5cblx0XHRcdFx0Ly8gVE9ETzogQlVH
IG1heWJlPyBNYWtlIHN1cmUgdGhpcyBkb2VzIG5vdCBwaWNrIHVwIGEgbGluayBjaGFuZ2Ugd2lwZSwgdGhhdCBpdCB1c2VzIHRoZSBjaGFuZ2lnbiBsaW5r
IGluc3RlYWQuXG5cdFx0XHRcdHZhciBzb3VsID0gZW5kIHx8IG1zZy5zb3VsIHx8ICh0bXAgPSAobXNnLiQkfHxtc2cuJCkuX3x8JycpLnNvdWwgfHwgdG1w
LmxpbmsgfHwgKCh0bXAgPSB0bXAucHV0fHwnJykuX3x8JycpWycjJ10gfHwgdG1wWycjJ10gfHwgKCgodG1wID0gbXNnLnB1dHx8JycpICYmIG1zZy4kJCk/
IHRtcFsnIyddIDogKHRtcFsnPSddfHx0bXBbJzonXXx8JycpWycjJ10pO1xuXHRcdFx0XHQhZW5kICYmIHN0dW4oYXMsIG1zZy4kKTtcblx0XHRcdFx0aWYo
IXNvdWwgJiYgIWF0LmxpbmtbJyMnXSl7IC8vIGNoZWNrIHNvdWwgbGluayBhYm92ZSB1c1xuXHRcdFx0XHRcdChhdC53YWl0IHx8IChhdC53YWl0ID0gW10p
KS5wdXNoKGZ1bmN0aW9uKCl7IHJlc29sdmUobXNnLCBldmUpIH0pIC8vIHdhaXRcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYo
IXNvdWwpe1xuXHRcdFx0XHRcdHNvdWwgPSBbXTtcblx0XHRcdFx0XHQobXNnLiQkfHxtc2cuJCkuYmFjayhmdW5jdGlvbihhdCl7XG5cdFx0XHRcdFx0XHRp
Zih0bXAgPSBhdC5zb3VsIHx8IGF0LmxpbmspeyByZXR1cm4gc291bC5wdXNoKHRtcCkgfVxuXHRcdFx0XHRcdFx0c291bC5wdXNoKGF0LmdldCk7XG5cdFx0
XHRcdFx0fSk7XG5cdFx0XHRcdFx0c291bCA9IHNvdWwucmV2ZXJzZSgpLmpvaW4oJy8nKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXQubGlua1snIyddID0g
c291bDtcblx0XHRcdFx0IWcgJiYgKCgoYXMuZ3JhcGggfHwgKGFzLmdyYXBoID0ge30pKVtzb3VsXSA9IChjYXQubm9kZSB8fCAoY2F0Lm5vZGUgPSB7Xzp7
fX0pKSkuX1snIyddID0gc291bCk7XG5cdFx0XHRcdGRlbGV0ZSBhcy53YWl0W2lkXTtcblx0XHRcdFx0Y2F0LndhaXQgJiYgc2V0VGltZW91dC5lYWNoKGNh
dC53YWl0LCBmdW5jdGlvbihjYil7IGNiICYmIGNiKCkgfSk7XG5cdFx0XHRcdGFzLnJhbihhcyk7XG5cdFx0XHR9O1xuXHRcdFx0Ly8gLS0tLS0tLS0tLS0t
LS0tXG5cdFx0fVxuXHRcdGlmKCF0by5sZW5ndGgpeyByZXR1cm4gYXMucmFuKGFzKSB9XG5cdFx0YXMudHVybih3YWxrKTtcblx0fSgpKTtcblx0cmV0dXJu
IGd1bjtcbn1cblxuZnVuY3Rpb24gc3R1bihhcywgaWQpe1xuXHRpZighaWQpeyByZXR1cm4gfSBpZCA9IChpZC5ffHwnJykuaWR8fGlkO1xuXHR2YXIgcnVu
ID0gYXMucm9vdC5zdHVuIHx8IChhcy5yb290LnN0dW4gPSB7b246IEd1bi5vbn0pLCB0ZXN0ID0ge30sIHRtcDtcblx0YXMuc3R1biB8fCAoYXMuc3R1biA9
IHJ1bi5vbignc3R1bicsIGZ1bmN0aW9uKCl7IH0pKTtcblx0aWYodG1wID0gcnVuLm9uKCcnK2lkKSl7IHRtcC50aGUubGFzdC5uZXh0KHRlc3QpIH1cblx0
aWYodGVzdC5ydW4gPj0gYXMucnVuKXsgcmV0dXJuIH1cblx0cnVuLm9uKCcnK2lkLCBmdW5jdGlvbih0ZXN0KXtcblx0XHRpZihhcy5zdHVuLmVuZCl7XG5c
dFx0XHR0aGlzLm9mZigpO1xuXHRcdFx0dGhpcy50by5uZXh0KHRlc3QpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0ZXN0LnJ1biA9IHRlc3QucnVu
IHx8IGFzLnJ1bjtcblx0XHR0ZXN0LnN0dW4gPSB0ZXN0LnN0dW4gfHwgYXMuc3R1bjsgcmV0dXJuO1xuXHRcdGlmKHRoaXMudG8udG8pe1xuXHRcdFx0dGhp
cy50aGUubGFzdC5uZXh0KHRlc3QpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0ZXN0LnN0dW4gPSBhcy5zdHVuO1xuXHR9KTtcbn1cblxuZnVuY3Rp
b24gcmFuKGFzKXtcblx0aWYoYXMuZXJyKXsgcmFuLmVuZChhcy5zdHVuLCBhcy5yb290KTsgcmV0dXJuIH0gLy8gbW92ZSBsb2cgaGFuZGxlIGhlcmUuXG5c
dGlmKGFzLnRvZG8ubGVuZ3RoIHx8IGFzLmVuZCB8fCAhT2JqZWN0LmVtcHR5KGFzLndhaXQpKXsgcmV0dXJuIH0gYXMuZW5kID0gMTtcblx0Ly8oYXMucmV0
cnkgPSBmdW5jdGlvbigpeyBhcy5hY2tzID0gMDtcblx0dmFyIGNhdCA9IChhcy4kLmJhY2soLTEpLl8pLCByb290ID0gY2F0LnJvb3QsIGFzayA9IGNhdC5h
c2soZnVuY3Rpb24oYWNrKXtcblx0XHRyb290Lm9uKCdhY2snLCBhY2spO1xuXHRcdGlmKGFjay5lcnIgJiYgIWFjay5sYWNrKXsgR3VuLmxvZyhhY2spIH1c
blx0XHRpZigrK2Fja3MgPiAoYXMuYWNrcyB8fCAwKSl7IHRoaXMub2ZmKCkgfSAvLyBBZGp1c3RhYmxlIEFDS3MhIE9ubHkgMSBieSBkZWZhdWx0LlxuXHRc
dGlmKCFhcy5hY2speyByZXR1cm4gfVxuXHRcdGFzLmFjayhhY2ssIHRoaXMpO1xuXHR9LCBhcy5vcHQpLCBhY2tzID0gMCwgc3R1biA9IGFzLnN0dW4sIHRt
cDtcblx0KHRtcCA9IGZ1bmN0aW9uKCl7IC8vIHRoaXMgaXMgbm90IG9mZmljaWFsIHlldCwgYnV0IHF1aWNrIHNvbHV0aW9uIHRvIGhhY2sgaW4gZm9yIG5v
dy5cblx0XHRpZighc3R1bil7IHJldHVybiB9XG5cdFx0cmFuLmVuZChzdHVuLCByb290KTtcblx0XHRzZXRUaW1lb3V0LmVhY2goT2JqZWN0LmtleXMoc3R1
biA9IHN0dW4uYWRkfHwnJyksIGZ1bmN0aW9uKGNiKXsgaWYoY2IgPSBzdHVuW2NiXSl7Y2IoKX0gfSk7IC8vIHJlc3VtZSB0aGUgc3R1bm5lZCByZWFkcyAv
LyBBbnkgcGVyZiByZWFzb25zIHRvIENQVSBzY2hlZHVsZSB0aGlzIC5rZXlzKCA/XG5cdH0pLmhhdGNoID0gdG1wOyAvLyB0aGlzIGlzIG5vdCBvZmZpY2lh
bCB5ZXQgXlxuXHQvL2NvbnNvbGUubG9nKDEsIFwiUFVUXCIsIGFzLnJ1biwgYXMuZ3JhcGgpO1xuXHRpZihhcy5hY2sgJiYgIWFzLm9rKXsgYXMub2sgPSBh
cy5hY2tzIHx8IDkgfSAvLyBUT0RPOiBJbiBmdXR1cmUhIFJlbW92ZSB0aGlzISBUaGlzIGlzIGp1c3Qgb2xkIEFQSSBzdXBwb3J0LlxuXHQoYXMudmlhLl8p
Lm9uKCdvdXQnLCB7cHV0OiBhcy5vdXQgPSBhcy5ncmFwaCwgb2s6IGFzLm9rICYmIHsnQCc6IGFzLm9rKzF9LCBvcHQ6IGFzLm9wdCwgJyMnOiBhc2ssIF86
IHRtcH0pO1xuXHQvL30pKCk7XG59OyByYW4uZW5kID0gZnVuY3Rpb24oc3R1bixyb290KXtcblx0c3R1bi5lbmQgPSBub29wOyAvLyBsaWtlIHdpdGggdGhl
IGVhcmxpZXIgaWQsIGNoZWFwZXIgdG8gbWFrZSB0aGlzIGZsYWcgYSBmdW5jdGlvbiBzbyBiZWxvdyBjYWxsYmFja3MgZG8gbm90IGhhdmUgdG8gZG8gYW4g
ZXh0cmEgdHlwZSBjaGVjay5cblx0aWYoc3R1bi50aGUudG8gPT09IHN0dW4gJiYgc3R1biA9PT0gc3R1bi50aGUubGFzdCl7IGRlbGV0ZSByb290LnN0dW4g
fVxuXHRzdHVuLm9mZigpO1xufTsgcmFuLmVyciA9IGZ1bmN0aW9uKGFzLCBlcnIpe1xuXHQoYXMuYWNrfHxub29wKS5jYWxsKGFzLCBhcy5vdXQgPSB7IGVy
cjogYXMuZXJyID0gR3VuLmxvZyhlcnIpIH0pO1xuXHRhcy5yYW4oYXMpO1xufVxuXG5mdW5jdGlvbiBnZXQoYXMpe1xuXHR2YXIgYXQgPSBhcy52aWEuXywg
dG1wO1xuXHRhcy52aWEgPSBhcy52aWEuYmFjayhmdW5jdGlvbihhdCl7XG5cdFx0aWYoYXQuc291bCB8fCAhYXQuZ2V0KXsgcmV0dXJuIGF0LiQgfVxuXHRc
dHRtcCA9IGFzLmRhdGE7IChhcy5kYXRhID0ge30pW2F0LmdldF0gPSB0bXA7XG5cdH0pO1xuXHRpZighYXMudmlhIHx8ICFhcy52aWEuXy5zb3VsKXtcblx0
XHRhcy52aWEgPSBhdC5yb290LiQuZ2V0KCgoYXMuZGF0YXx8JycpLl98fCcnKVsnIyddIHx8IGF0LiQuYmFjaygnb3B0LnV1aWQnKSgpKVxuXHR9XG5cdGFz
LnZpYS5wdXQoYXMuZGF0YSwgYXMuYWNrLCBhcyk7XG5cdFxuXG5cdHJldHVybjtcblx0aWYoYXQuZ2V0ICYmIGF0LmJhY2suc291bCl7XG5cdFx0dG1wID0g
YXMuZGF0YTtcblx0XHRhcy52aWEgPSBhdC5iYWNrLiQ7XG5cdFx0KGFzLmRhdGEgPSB7fSlbYXQuZ2V0XSA9IHRtcDsgXG5cdFx0YXMudmlhLnB1dChhcy5k
YXRhLCBhcy5hY2ssIGFzKTtcblx0XHRyZXR1cm47XG5cdH1cbn1cbmZ1bmN0aW9uIGNoZWNrKGQsIHRtcCl7IHJldHVybiAoKGQgJiYgKHRtcCA9IGQuY29u
c3RydWN0b3IpICYmIHRtcC5uYW1lKSB8fCB0eXBlb2YgZCkgfVxuXG52YXIgdSwgZW1wdHkgPSB7fSwgbm9vcCA9IGZ1bmN0aW9uKCl7fSwgdHVybiA9IHNl
dFRpbWVvdXQudHVybiwgdmFsaWQgPSBHdW4udmFsaWQsIHN0YXRlX2lmeSA9IEd1bi5zdGF0ZS5pZnk7XG52YXIgaWlmZSA9IGZ1bmN0aW9uKGZuLGFzKXtm
bi5jYWxsKGFzfHxlbXB0eSl9XG5cdFxufSgpKTsiLCJzcmMvY29yZS5qcyI6ImltcG9ydCAnLi9jaGFpbi5qcyc7XG5pbXBvcnQgJy4vYmFjay5qcyc7XG5p
bXBvcnQgJy4vcHV0LmpzJztcbmltcG9ydCAnLi9nZXQuanMnO1xuaW1wb3J0IF9fcm9vdCBmcm9tICcuL3Jvb3QuanMnO1xuXG5sZXQgX19kZWZhdWx0RXhw
b3J0O1xuKGZ1bmN0aW9uKCl7XG4gIHZhciBHdW4gPSBfX3Jvb3Q7XG4gIF9fZGVmYXVsdEV4cG9ydCA9IEd1bjtcbn0oKSk7XG5leHBvcnQgZGVmYXVsdCBf
X2RlZmF1bHRFeHBvcnQ7Iiwic3JjL2luZGV4LmpzIjoiaW1wb3J0ICcuL3NoaW0uanMnO1xuaW1wb3J0ICcuL29udG8uanMnO1xuaW1wb3J0ICcuL2Jvb2su
anMnO1xuaW1wb3J0ICcuL3ZhbGlkLmpzJztcbmltcG9ydCAnLi9zdGF0ZS5qcyc7XG5pbXBvcnQgJy4vZHVwLmpzJztcbmltcG9ydCAnLi9hc2suanMnO1xu
aW1wb3J0ICcuL2NvcmUuanMnO1xuaW1wb3J0ICcuL29uLmpzJztcbmltcG9ydCAnLi9tYXAuanMnO1xuaW1wb3J0ICcuL3NldC5qcyc7XG5pbXBvcnQgJy4v
bWVzaC5qcyc7XG5pbXBvcnQgJy4vd2Vic29ja2V0LmpzJztcbmltcG9ydCAnLi9sb2NhbFN0b3JhZ2UuanMnO1xuaW1wb3J0IF9fcm9vdCBmcm9tICcuL3Jv
b3QuanMnO1xuXG5sZXQgX19kZWZhdWx0RXhwb3J0O1xuKGZ1bmN0aW9uKCl7XG4gIHZhciBHdW4gPSBfX3Jvb3Q7XG4gIF9fZGVmYXVsdEV4cG9ydCA9IEd1
bjtcbn0oKSk7XG5leHBvcnQgZGVmYXVsdCBfX2RlZmF1bHRFeHBvcnQ7Iiwic3JjL29uLmpzIjoiaW1wb3J0IF9fcm9vdCBmcm9tICcuL3Jvb3QuanMnO1xu
KGZ1bmN0aW9uKCl7XG5cbnZhciBHdW4gPSBfX3Jvb3Q7XG5HdW4uY2hhaW4ub24gPSBmdW5jdGlvbih0YWcsIGFyZywgZWFzLCBhcyl7IC8vIGRvbid0IHJl
d3JpdGUhXG5cdHZhciBndW4gPSB0aGlzLCBjYXQgPSBndW4uXywgcm9vdCA9IGNhdC5yb290LCBhY3QsIG9mZiwgaWQsIHRtcDtcblx0aWYodHlwZW9mIHRh
ZyA9PT0gJ3N0cmluZycpe1xuXHRcdGlmKCFhcmcpeyByZXR1cm4gY2F0Lm9uKHRhZykgfVxuXHRcdGFjdCA9IGNhdC5vbih0YWcsIGFyZywgZWFzIHx8IGNh
dCwgYXMpO1xuXHRcdGlmKGVhcyAmJiBlYXMuJCl7XG5cdFx0XHQoZWFzLnN1YnMgfHwgKGVhcy5zdWJzID0gW10pKS5wdXNoKGFjdCk7XG5cdFx0fVxuXHRc
dHJldHVybiBndW47XG5cdH1cblx0dmFyIG9wdCA9IGFyZztcblx0KG9wdCA9ICh0cnVlID09PSBvcHQpPyB7Y2hhbmdlOiB0cnVlfSA6IG9wdCB8fCB7fSku
bm90ID0gMTsgb3B0Lm9uID0gMTtcblx0Ly9vcHQuYXQgPSBjYXQ7XG5cdC8vb3B0Lm9rID0gdGFnO1xuXHQvL29wdC5sYXN0ID0ge307XG5cdHZhciB3YWl0
ID0ge307IC8vIGNhbiB3ZSBhc3NpZ24gdGhpcyB0byB0aGUgYXQgaW5zdGVhZCwgbGlrZSBpbiBvbmNlP1xuXHRndW4uZ2V0KHRhZywgb3B0KTtcblx0Lypn
dW4uZ2V0KGZ1bmN0aW9uIG9uKGRhdGEsa2V5LG1zZyxldmUpeyB2YXIgJCA9IHRoaXM7XG5cdFx0aWYodG1wID0gcm9vdC5oYXRjaCl7IC8vIHF1aWNrIGhh
Y2shXG5cdFx0XHRpZih3YWl0WyQuXy5pZF0peyByZXR1cm4gfSB3YWl0WyQuXy5pZF0gPSAxO1xuXHRcdFx0dG1wLnB1c2goZnVuY3Rpb24oKXtvbi5jYWxs
KCQsIGRhdGEsa2V5LG1zZyxldmUpfSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fTsgd2FpdCA9IHt9OyAvLyBlbmQgcXVpY2sgaGFjay5cblx0XHR0YWcuY2Fs
bCgkLCBkYXRhLGtleSxtc2csZXZlKTtcblx0fSwgb3B0KTsgLy8gVE9ETzogUEVSRiEgRXZlbnQgbGlzdGVuZXIgbGVhayEhIT8qL1xuXHQvKlxuXHRmdW5j
dGlvbiBvbmUobXNnLCBldmUpe1xuXHRcdGlmKG9uZS5zdHVuKXsgcmV0dXJuIH1cblx0XHR2YXIgYXQgPSBtc2cuJC5fLCBkYXRhID0gYXQucHV0LCB0bXA7
XG5cdFx0aWYodG1wID0gYXQubGluayl7IGRhdGEgPSByb290LiQuZ2V0KHRtcCkuXy5wdXQgfVxuXHRcdGlmKG9wdC5ub3Q9PT11ICYmIHUgPT09IGRhdGEp
eyByZXR1cm4gfVxuXHRcdGlmKG9wdC5zdHVuPT09dSAmJiAodG1wID0gcm9vdC5zdHVuKSAmJiAodG1wID0gdG1wW2F0LmlkXSB8fCB0bXBbYXQuYmFjay5p
ZF0pICYmICF0bXAuZW5kKXsgLy8gUmVtZW1iZXIhIElmIHlvdSBwb3J0IHRoaXMgaW50byBgLmdldChjYmAgbWFrZSBzdXJlIHlvdSBhbGxvdyBzdHVuOjAg
c2tpcCBvcHRpb24gZm9yIGAucHV0KGAuXG5cdFx0XHR0bXBbaWRdID0gZnVuY3Rpb24oKXtvbmUobXNnLGV2ZSl9O1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1c
blx0XHQvL3RtcCA9IG9uZS53YWl0IHx8IChvbmUud2FpdCA9IHt9KTsgY29uc29sZS5sb2codG1wW2F0LmlkXSA9PT0gJycpOyBpZih0bXBbYXQuaWRdICE9
PSAnJyl7IHRtcFthdC5pZF0gPSB0bXBbYXQuaWRdIHx8IHNldFRpbWVvdXQoZnVuY3Rpb24oKXt0bXBbYXQuaWRdPScnO29uZShtc2csZXZlKX0sMSk7IHJl
dHVybiB9IGRlbGV0ZSB0bXBbYXQuaWRdO1xuXHRcdC8vIGNhbGw6XG5cdFx0aWYob3B0LmFzKXtcblx0XHRcdG9wdC5vay5jYWxsKG9wdC5hcywgbXNnLCBl
dmUgfHwgb25lKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b3B0Lm9rLmNhbGwoYXQuJCwgZGF0YSwgbXNnLmdldCB8fCBhdC5nZXQsIG1zZywgZXZlIHx8IG9u
ZSk7XG5cdFx0fVxuXHR9O1xuXHRvbmUuYXQgPSBjYXQ7XG5cdChjYXQuYWN0fHwoY2F0LmFjdD17fSkpW2lkID0gU3RyaW5nLnJhbmRvbSg3KV0gPSBvbmU7
XG5cdG9uZS5vZmYgPSBmdW5jdGlvbigpeyBvbmUuc3R1biA9IDE7IGlmKCFjYXQuYWN0KXsgcmV0dXJuIH0gZGVsZXRlIGNhdC5hY3RbaWRdIH1cblx0Y2F0
Lm9uKCdvdXQnLCB7Z2V0OiB7fX0pOyovXG5cdHJldHVybiBndW47XG59XG4vLyBSdWxlczpcbi8vIDEuIElmIGNhY2hlZCwgc2hvdWxkIGJlIGZhc3QsIGJ1
dCBub3QgcmVhZCB3aGlsZSB3cml0ZS5cbi8vIDIuIFNob3VsZCBub3QgcmV0cmlnZ2VyIG90aGVyIGxpc3RlbmVycywgc2hvdWxkIGdldCB0cmlnZ2VyZWQg
ZXZlbiBpZiBub3RoaW5nIGZvdW5kLlxuLy8gMy4gSWYgdGhlIHNhbWUgY2FsbGJhY2sgcGFzc2VkIHRvIG1hbnkgZGlmZmVyZW50IG9uY2UgY2hhaW5zLCBl
YWNoIHNob3VsZCByZXNvbHZlIC0gYW4gdW5zdWJzY3JpYmUgZnJvbSB0aGUgc2FtZSBjYWxsYmFjayBzaG91bGQgbm90IGVmZmVjdCB0aGUgc3RhdGUgb2Yg
dGhlIG90aGVyIHJlc29sdmluZyBjaGFpbnMsIGlmIHlvdSBkbyB3YW50IHRvIGNhbmNlbCB0aGVtIGFsbCBlYXJseSB5b3Ugc2hvdWxkIG11dGF0ZSB0aGUg
Y2FsbGJhY2sgaXRzZWxmIHdpdGggYSBmbGFnICYgY2hlY2sgZm9yIGl0IGF0IHRvcCBvZiBjYWxsYmFja1xuR3VuLmNoYWluLm9uY2UgPSBmdW5jdGlvbihj
Yiwgb3B0KXsgb3B0ID0gb3B0IHx8IHt9OyAvLyBhdm9pZCByZXdyaXRpbmdcblx0aWYoIWNiKXsgcmV0dXJuIG5vbmUodGhpcyxvcHQpIH1cblx0dmFyIGd1
biA9IHRoaXMsIGNhdCA9IGd1bi5fLCByb290ID0gY2F0LnJvb3QsIGRhdGEgPSBjYXQucHV0LCBpZCA9IFN0cmluZy5yYW5kb20oNyksIG9uZSwgdG1wO1xu
XHRndW4uZ2V0KGZ1bmN0aW9uKGRhdGEsa2V5LG1zZyxldmUpe1xuXHRcdHZhciAkID0gdGhpcywgYXQgPSAkLl8sIG9uZSA9IChhdC5vbmV8fChhdC5vbmU9
e30pKTtcblx0XHRpZihldmUuc3R1bil7IHJldHVybiB9IGlmKCcnID09PSBvbmVbaWRdKXsgcmV0dXJuIH1cblx0XHRpZih0cnVlID09PSAodG1wID0gR3Vu
LnZhbGlkKGRhdGEpKSl7IG9uY2UoKTsgcmV0dXJuIH1cblx0XHRpZignc3RyaW5nJyA9PSB0eXBlb2YgdG1wKXsgcmV0dXJuIH1cblx0XHRjbGVhclRpbWVv
dXQoKGNhdC5vbmV8fCcnKVtpZF0pOyAvLyBjbGVhciBcIm5vdCBmb3VuZFwiIHNpbmNlIHRoZXkgb25seSBnZXQgc2V0IG9uIGNhdC5cblx0XHRjbGVhclRp
bWVvdXQob25lW2lkXSk7IG9uZVtpZF0gPSBzZXRUaW1lb3V0KG9uY2UsIG9wdC53YWl0fHw5OSk7IC8vIFRPRE86IEJ1Zz8gVGhpcyBkb2Vzbid0IGhhbmRs
ZSBwbHVyYWwgY2hhaW5zLlxuXHRcdGZ1bmN0aW9uIG9uY2UoZil7XG5cdFx0XHRpZighYXQuaGFzICYmICFhdC5zb3VsKXsgYXQgPSB7cHV0OiBkYXRhLCBn
ZXQ6IGtleX0gfSAvLyBoYW5kbGVzIG5vbi1jb3JlIG1lc3NhZ2VzLlxuXHRcdFx0aWYodSA9PT0gKHRtcCA9IGF0LnB1dCkpeyB0bXAgPSAoKG1zZy4kJHx8
JycpLl98fCcnKS5wdXQgfVxuXHRcdFx0aWYoJ3N0cmluZycgPT0gdHlwZW9mIEd1bi52YWxpZCh0bXApKXtcblx0XHRcdFx0dG1wID0gcm9vdC4kLmdldCh0
bXApLl8ucHV0O1xuXHRcdFx0XHRpZih0bXAgPT09IHUgJiYgIWYpe1xuXHRcdFx0XHRcdG9uZVtpZF0gPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IG9uY2Uo
MSkgfSwgb3B0LndhaXR8fDk5KTsgLy8gVE9ETzogUXVpY2sgZml4LiBNYXliZSB1c2UgYWNrIGNvdW50IGZvciBtb3JlIHByZWRpY3RhYmxlIGNvbnRyb2w/
XG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8vY29uc29sZS5sb2coXCJBTkQgVkFOSVNIRURcIiwgZGF0YSk7XG5cdFx0
XHRpZihldmUuc3R1bil7IHJldHVybiB9IGlmKCcnID09PSBvbmVbaWRdKXsgcmV0dXJuIH0gb25lW2lkXSA9ICcnO1xuXHRcdFx0aWYoY2F0LnNvdWwgfHwg
Y2F0Lmhhcyl7IGV2ZS5vZmYoKSB9IC8vIFRPRE86IFBsdXJhbCBjaGFpbnM/IC8vIGVsc2UgeyA/Lm9mZigpIH0gLy8gYmV0dGVyIHRoYW4gb25lIGNoZWNr
P1xuXHRcdFx0Y2IuY2FsbCgkLCB0bXAsIGF0LmdldCk7XG5cdFx0XHRjbGVhclRpbWVvdXQob25lW2lkXSk7IC8vIGNsZWFyIFwibm90IGZvdW5kXCIgc2lu
Y2UgdGhleSBvbmx5IGdldCBzZXQgb24gY2F0LiAvLyBUT0RPOiBUaGlzIHdhcyBoYWNraWx5IGFkZGVkLCBpcyBpdCBuZWNlc3Nhcnkgb3IgaW1wb3J0YW50
PyBQcm9iYWJseSBub3QsIGluIGZ1dHVyZSB0cnkgcmVtb3ZpbmcgdGhpcy4gV2FzIGFkZGVkIGp1c3QgYXMgYSBzYWZldHkgZm9yIHRoZSBgJiYgIWZgIGNo
ZWNrLlxuXHRcdH07XG5cdH0sIHtvbjogMX0pO1xuXHRyZXR1cm4gZ3VuO1xufVxuZnVuY3Rpb24gbm9uZShndW4sb3B0LGNoYWluKXtcblx0R3VuLmxvZy5v
bmNlKFwidmFsb25jZVwiLCBcIkNoYWluYWJsZSB2YWwgaXMgZXhwZXJpbWVudGFsLCBpdHMgYmVoYXZpb3IgYW5kIEFQSSBtYXkgY2hhbmdlIG1vdmluZyBm
b3J3YXJkLiBQbGVhc2UgcGxheSB3aXRoIGl0IGFuZCByZXBvcnQgYnVncyBhbmQgaWRlYXMgb24gaG93IHRvIGltcHJvdmUgaXQuXCIpO1xuXHQoY2hhaW4g
PSBndW4uY2hhaW4oKSkuXy5uaXggPSBndW4ub25jZShmdW5jdGlvbihkYXRhLCBrZXkpeyBjaGFpbi5fLm9uKCdpbicsIHRoaXMuXykgfSk7XG5cdGNoYWlu
Ll8ubGV4ID0gZ3VuLl8ubGV4OyAvLyBUT0RPOiBCZXR0ZXIgYXBwcm9hY2ggaW4gZnV0dXJlPyBUaGlzIGlzIHF1aWNrIGZvciBub3cuXG5cdHJldHVybiBj
aGFpbjtcbn1cblxuR3VuLmNoYWluLm9mZiA9IGZ1bmN0aW9uKCl7XG5cdC8vIG1ha2Ugb2ZmIG1vcmUgYWdncmVzc2l2ZS4gV2FybmluZywgaXQgbWlnaHQg
YmFja2ZpcmUhXG5cdHZhciBndW4gPSB0aGlzLCBhdCA9IGd1bi5fLCB0bXA7XG5cdHZhciBjYXQgPSBhdC5iYWNrO1xuXHRpZighY2F0KXsgcmV0dXJuIH1c
blx0YXQuYWNrID0gMDsgLy8gc28gY2FuIHJlc3Vic2NyaWJlLlxuXHRpZih0bXAgPSBjYXQubmV4dCl7XG5cdFx0aWYodG1wW2F0LmdldF0pe1xuXHRcdFx0
ZGVsZXRlIHRtcFthdC5nZXRdO1xuXHRcdH0gZWxzZSB7XG5cblx0XHR9XG5cdH1cblx0Ly8gVE9ETzogZGVsZXRlIGNhdC5vbmVbbWFwLmlkXT9cblx0aWYg
KHRtcCA9IGNhdC5hbnkpIHtcblx0XHRkZWxldGUgY2F0LmFueTtcblx0XHRjYXQuYW55ID0ge307XG5cdH1cblx0aWYodG1wID0gY2F0LmFzayl7XG5cdFx0
ZGVsZXRlIHRtcFthdC5nZXRdO1xuXHR9XG5cdGlmKHRtcCA9IGNhdC5wdXQpe1xuXHRcdGRlbGV0ZSB0bXBbYXQuZ2V0XTtcblx0fVxuXHRpZih0bXAgPSBh
dC5zb3VsKXtcblx0XHRkZWxldGUgY2F0LnJvb3QuZ3JhcGhbdG1wXTtcblx0fVxuXHRpZih0bXAgPSBhdC5tYXApe1xuXHRcdE9iamVjdC5rZXlzKHRtcCku
Zm9yRWFjaChmdW5jdGlvbihpLGF0KXsgYXQgPSB0bXBbaV07IC8vb2JqX21hcCh0bXAsIGZ1bmN0aW9uKGF0KXtcblx0XHRcdGlmKGF0Lmxpbmspe1xuXHRc
dFx0XHRjYXQucm9vdC4kLmdldChhdC5saW5rKS5vZmYoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRpZih0bXAgPSBhdC5uZXh0KXtcblx0XHRPYmpl
Y3Qua2V5cyh0bXApLmZvckVhY2goZnVuY3Rpb24oaSxuZWF0KXsgbmVhdCA9IHRtcFtpXTsgLy9vYmpfbWFwKHRtcCwgZnVuY3Rpb24obmVhdCl7XG5cdFx0
XHRuZWF0LiQub2ZmKCk7XG5cdFx0fSk7XG5cdH1cblx0YXQub24oJ29mZicsIHt9KTtcblx0cmV0dXJuIGd1bjtcbn1cbnZhciBlbXB0eSA9IHt9LCBub29w
ID0gZnVuY3Rpb24oKXt9LCB1O1xuXHRcbn0oKSk7Iiwic3JjL21hcC5qcyI6ImltcG9ydCBfX3Jvb3QgZnJvbSAnLi9yb290LmpzJztcbihmdW5jdGlvbigp
e1xuXG52YXIgR3VuID0gX19yb290LCBuZXh0ID0gR3VuLmNoYWluLmdldC5uZXh0O1xuR3VuLmNoYWluLmdldC5uZXh0ID0gZnVuY3Rpb24oZ3VuLCBsZXgp
eyB2YXIgdG1wO1xuXHRpZighT2JqZWN0LnBsYWluKGxleCkpeyByZXR1cm4gKG5leHR8fG5vb3ApKGd1biwgbGV4KSB9XG5cdGlmKHRtcCA9ICgodG1wID0g
bGV4WycjJ10pfHwnJylbJz0nXSB8fCB0bXApeyByZXR1cm4gZ3VuLmdldCh0bXApIH1cblx0KHRtcCA9IGd1bi5jaGFpbigpLl8pLmxleCA9IGxleDsgLy8g
TEVYIVxuXHRndW4ub24oJ2luJywgZnVuY3Rpb24oZXZlKXtcblx0XHRpZihTdHJpbmcubWF0Y2goZXZlLmdldHx8IChldmUucHV0fHwnJylbJy4nXSwgbGV4
WycuJ10gfHwgbGV4WycjJ10gfHwgbGV4KSl7XG5cdFx0XHR0bXAub24oJ2luJywgZXZlKTtcblx0XHR9XG5cdFx0dGhpcy50by5uZXh0KGV2ZSk7XG5cdH0p
O1xuXHRyZXR1cm4gdG1wLiQ7XG59XG5HdW4uY2hhaW4ubWFwID0gZnVuY3Rpb24oY2IsIG9wdCwgdCl7XG5cdHZhciBndW4gPSB0aGlzLCBjYXQgPSBndW4u
XywgbGV4LCBjaGFpbjtcblx0aWYoT2JqZWN0LnBsYWluKGNiKSl7IGxleCA9IGNiWycuJ10/IGNiIDogeycuJzogY2J9OyBjYiA9IHUgfVxuXHRpZighY2Ip
e1xuXHRcdGlmKGNoYWluID0gY2F0LmVhY2gpeyByZXR1cm4gY2hhaW4gfVxuXHRcdChjYXQuZWFjaCA9IGNoYWluID0gZ3VuLmNoYWluKCkpLl8ubGV4ID0g
bGV4IHx8IGNoYWluLl8ubGV4IHx8IGNhdC5sZXg7XG5cdFx0Y2hhaW4uXy5uaXggPSBndW4uYmFjaygnbml4Jyk7XG5cdFx0Z3VuLm9uKCdpbicsIG1hcCwg
Y2hhaW4uXyk7XG5cdFx0cmV0dXJuIGNoYWluO1xuXHR9XG5cdEd1bi5sb2cub25jZShcIm1hcGZuXCIsIFwiTWFwIGZ1bmN0aW9ucyBhcmUgZXhwZXJpbWVu
dGFsLCB0aGVpciBiZWhhdmlvciBhbmQgQVBJIG1heSBjaGFuZ2UgbW92aW5nIGZvcndhcmQuIFBsZWFzZSBwbGF5IHdpdGggaXQgYW5kIHJlcG9ydCBidWdz
IGFuZCBpZGVhcyBvbiBob3cgdG8gaW1wcm92ZSBpdC5cIik7XG5cdGNoYWluID0gZ3VuLmNoYWluKCk7XG5cdGd1bi5tYXAoKS5vbihmdW5jdGlvbihkYXRh
LCBrZXksIG1zZywgZXZlKXtcblx0XHR2YXIgbmV4dCA9IChjYnx8bm9vcCkuY2FsbCh0aGlzLCBkYXRhLCBrZXksIG1zZywgZXZlKTtcblx0XHRpZih1ID09
PSBuZXh0KXsgcmV0dXJuIH1cblx0XHRpZihkYXRhID09PSBuZXh0KXsgcmV0dXJuIGNoYWluLl8ub24oJ2luJywgbXNnKSB9XG5cdFx0aWYoR3VuLmlzKG5l
eHQpKXsgcmV0dXJuIGNoYWluLl8ub24oJ2luJywgbmV4dC5fKSB9XG5cdFx0dmFyIHRtcCA9IHt9OyBPYmplY3Qua2V5cyhtc2cucHV0KS5mb3JFYWNoKGZ1
bmN0aW9uKGspeyB0bXBba10gPSBtc2cucHV0W2tdIH0sIHRtcCk7IHRtcFsnPSddID0gbmV4dDsgXG5cdFx0Y2hhaW4uXy5vbignaW4nLCB7Z2V0OiBrZXks
IHB1dDogdG1wfSk7XG5cdH0pO1xuXHRyZXR1cm4gY2hhaW47XG59XG5mdW5jdGlvbiBtYXAobXNnKXsgdGhpcy50by5uZXh0KG1zZyk7XG5cdHZhciBjYXQg
PSB0aGlzLmFzLCBndW4gPSBtc2cuJCwgYXQgPSBndW4uXywgcHV0ID0gbXNnLnB1dCwgdG1wO1xuXHRpZighYXQuc291bCAmJiAhbXNnLiQkKXsgcmV0dXJu
IH0gLy8gdGhpcyBsaW5lIHRvb2sgaHVuZHJlZHMgb2YgdHJpZXMgdG8gZmlndXJlIG91dC4gSXQgb25seSB3b3JrcyBpZiBjb3JlIGNoZWNrcyB0byBmaWx0
ZXIgb3V0IGFib3ZlIGNoYWlucyBkdXJpbmcgbGluayB0aG8uIFRoaXMgc2F5cyBcIm9ubHkgYm90aGVyIHRvIG1hcCBvbiBhIG5vZGVcIiBmb3IgdGhpcyBs
YXllciBvZiB0aGUgY2hhaW4uIElmIHNvbWV0aGluZyBpcyBub3QgYSBub2RlLCBtYXAgc2hvdWxkIG5vdCB3b3JrLlxuXHRpZigodG1wID0gY2F0LmxleCkg
JiYgIVN0cmluZy5tYXRjaChtc2cuZ2V0fHwgKHB1dHx8JycpWycuJ10sIHRtcFsnLiddIHx8IHRtcFsnIyddIHx8IHRtcCkpeyByZXR1cm4gfVxuXHRHdW4u
b24ubGluayhtc2csIGNhdCk7XG59XG52YXIgbm9vcCA9IGZ1bmN0aW9uKCl7fSwgZXZlbnQgPSB7c3R1bjogbm9vcCwgb2ZmOiBub29wfSwgdTtcblx0XG59
KCkpOyIsInNyYy9zZXQuanMiOiJpbXBvcnQgX19yb290IGZyb20gJy4vcm9vdC5qcyc7XG4oZnVuY3Rpb24oKXtcblxudmFyIEd1biA9IF9fcm9vdDtcbkd1
bi5jaGFpbi5zZXQgPSBmdW5jdGlvbihpdGVtLCBjYiwgb3B0KXtcblx0dmFyIGd1biA9IHRoaXMsIHJvb3QgPSBndW4uYmFjaygtMSksIHNvdWwsIHRtcDtc
blx0Y2IgPSBjYiB8fCBmdW5jdGlvbigpe307XG5cdG9wdCA9IG9wdCB8fCB7fTsgb3B0Lml0ZW0gPSBvcHQuaXRlbSB8fCBpdGVtO1xuXHRpZihzb3VsID0g
KChpdGVtfHwnJykuX3x8JycpWycjJ10peyAoaXRlbSA9IHt9KVsnIyddID0gc291bCB9IC8vIGNoZWNrIGlmIG5vZGUsIG1ha2UgbGluay5cblx0aWYoJ3N0
cmluZycgPT0gdHlwZW9mICh0bXAgPSBHdW4udmFsaWQoaXRlbSkpKXsgcmV0dXJuIGd1bi5nZXQoc291bCA9IHRtcCkucHV0KGl0ZW0sIGNiLCBvcHQpIH0g
Ly8gY2hlY2sgaWYgbGlua1xuXHRpZighR3VuLmlzKGl0ZW0pKXtcblx0XHRpZihPYmplY3QucGxhaW4oaXRlbSkpe1xuXHRcdFx0aXRlbSA9IHJvb3QuZ2V0
KHNvdWwgPSBndW4uYmFjaygnb3B0LnV1aWQnKSgpKS5wdXQoaXRlbSk7XG5cdFx0fVxuXHRcdHJldHVybiBndW4uZ2V0KHNvdWwgfHwgcm9vdC5iYWNrKCdv
cHQudXVpZCcpKDcpKS5wdXQoaXRlbSwgY2IsIG9wdCk7XG5cdH1cblx0Z3VuLnB1dChmdW5jdGlvbihnbyl7XG5cdFx0aXRlbS5nZXQoZnVuY3Rpb24oc291
bCwgbywgbXNnKXsgLy8gVE9ETzogQlVHISBXZSBubyBsb25nZXIgaGF2ZSB0aGlzIG9wdGlvbj8gJiBnbyBlcnJvciBub3QgaGFuZGxlZD9cblx0XHRcdGlm
KCFzb3VsKXsgcmV0dXJuIGNiLmNhbGwoZ3VuLCB7ZXJyOiBHdW4ubG9nKCdPbmx5IGEgbm9kZSBjYW4gYmUgbGlua2VkISBOb3QgXCInICsgbXNnLnB1dCAr
ICdcIiEnKX0pIH1cblx0XHRcdCh0bXAgPSB7fSlbc291bF0gPSB7JyMnOiBzb3VsfTsgZ28odG1wKTtcblx0XHR9LHRydWUpO1xuXHR9KVxuXHRyZXR1cm4g
aXRlbTtcbn1cblx0XG59KCkpOyIsInNyYy9tZXNoLmpzIjoiaW1wb3J0ICcuL3NoaW0uanMnO1xuXG5sZXQgX19kZWZhdWx0RXhwb3J0O1xuKGZ1bmN0aW9u
KCl7XG4gICAgdmFyIG5vb3AgPSBmdW5jdGlvbigpe31cbiAgICB2YXIgcGFyc2UgPSBKU09OLnBhcnNlQXN5bmMgfHwgZnVuY3Rpb24odCxjYixyKXsgdmFy
IHUsIGQgPSArbmV3IERhdGU7IHRyeXsgY2IodSwgSlNPTi5wYXJzZSh0LHIpLCBqc29uLnN1Y2tzKCtuZXcgRGF0ZSAtIGQpKSB9Y2F0Y2goZSl7IGNiKGUp
IH0gfVxuICAgIHZhciBqc29uID0gSlNPTi5zdHJpbmdpZnlBc3luYyB8fCBmdW5jdGlvbih2LGNiLHIscyl7IHZhciB1LCBkID0gK25ldyBEYXRlOyB0cnl7
IGNiKHUsIEpTT04uc3RyaW5naWZ5KHYscixzKSwganNvbi5zdWNrcygrbmV3IERhdGUgLSBkKSkgfWNhdGNoKGUpeyBjYihlKSB9IH1cbiAgICBqc29uLnN1
Y2tzID0gZnVuY3Rpb24oZCl7IGlmKGQgPiA5OSl7IGNvbnNvbGUubG9nKFwiV2FybmluZzogSlNPTiBibG9ja2luZyBDUFUgZGV0ZWN0ZWQuIEFkZCBgZ3Vu
L2xpYi95c29uLmpzYCB0byBmaXguXCIpOyBqc29uLnN1Y2tzID0gbm9vcCB9IH1cblxuICAgIGZ1bmN0aW9uIE1lc2gocm9vdCl7XG4gICAgICAgIHZhciBt
ZXNoID0gZnVuY3Rpb24oKXt9O1xuICAgICAgICB2YXIgb3B0ID0gcm9vdC5vcHQgfHwge307XG4gICAgICAgIG9wdC5sb2cgPSBvcHQubG9nIHx8IGNvbnNv
bGUubG9nO1xuICAgICAgICBvcHQuZ2FwID0gb3B0LmdhcCB8fCBvcHQud2FpdCB8fCAwO1xuICAgICAgICBvcHQubWF4ID0gb3B0Lm1heCB8fCAob3B0Lm1l
bW9yeT8gKG9wdC5tZW1vcnkgKiA5OTkgKiA5OTkpIDogMzAwMDAwMDAwKSAqIDAuMztcbiAgICAgICAgb3B0LnBhY2sgPSBvcHQucGFjayB8fCAob3B0Lm1h
eCAqIDAuMDEgKiAwLjAxKTtcbiAgICAgICAgb3B0LnB1ZmYgPSBvcHQucHVmZiB8fCA5OyAvLyBJREVBOiBkbyBhIHN0YXJ0L2VuZCBiZW5jaG1hcmssIGRp
dmlkZSBvcHMvcmVzdWx0LlxuICAgICAgICB2YXIgcHVmZiA9IHNldFRpbWVvdXQudHVybiB8fCBzZXRUaW1lb3V0O1xuXG4gICAgICAgIHZhciBkdXAgPSBy
b290LmR1cCwgZHVwX2NoZWNrID0gZHVwLmNoZWNrLCBkdXBfdHJhY2sgPSBkdXAudHJhY2s7XG5cbiAgICAgICAgdmFyIFNUID0gK25ldyBEYXRlLCBMVCA9
IFNUO1xuXG4gICAgICAgIHZhciBoZWFyID0gbWVzaC5oZWFyID0gZnVuY3Rpb24ocmF3LCBwZWVyKXtcbiAgICAgICAgICAgIGlmKCFyYXcpeyByZXR1cm4g
fVxuICAgICAgICAgICAgaWYob3B0Lm1heCA8PSByYXcubGVuZ3RoKXsgcmV0dXJuIG1lc2guc2F5KHtkYW06ICchJywgZXJyOiBcIk1lc3NhZ2UgdG9vIGJp
ZyFcIn0sIHBlZXIpIH1cbiAgICAgICAgICAgIGlmKG1lc2ggPT09IHRoaXMpe1xuICAgICAgICAgICAgICAgIC8qaWYoJ3N0cmluZycgPT0gdHlwZW9mIHJh
dyl7IHRyeXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXQgPSBjb25zb2xlLlNUQVQgfHwge307XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29s
ZS5sb2coJ0hFQVI6JywgcGVlci5pZCwgKHJhd3x8JycpLnNsaWNlKDAsMjUwKSwgKChyYXd8fCcnKS5sZW5ndGggLyAxMDI0IC8gMTAyNCkudG9GaXhlZCg0
KSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNldFRpbWVvdXQudHVybi5zLmxlbmd0aCwgJ3N0
YWNrcycsIHBhcnNlRmxvYXQoKC0oTFQgLSAoTFQgPSArbmV3IERhdGUpKS8xMDAwKS50b0ZpeGVkKDMpKSwgJ3NlYycsIHBhcnNlRmxvYXQoKChMVC1TVCkv
MTAwMCAvIDYwKS50b0ZpeGVkKDEpKSwgJ3VwJywgc3RhdC5wZWVyc3x8MCwgJ3BlZXJzJywgc3RhdC5oYXN8fDAsICdoYXMnLCBzdGF0Lm1lbWh1c2VkfHww
LCBzdGF0Lm1lbXVzZWR8fDAsIHN0YXQubWVtYXh8fDAsICdoZWFwIG1lbSBtYXgnKTtcbiAgICAgICAgICAgICAgICB9Y2F0Y2goZSl7IGNvbnNvbGUubG9n
KCdEQkcgZXJyJywgZSkgfX0qL1xuICAgICAgICAgICAgICAgIGhlYXIuZCArPSByYXcubGVuZ3RofHwwIDsgKytoZWFyLmMgfSAvLyBTVEFUUyFcbiAgICAg
ICAgICAgIHZhciBTID0gcGVlci5TSCA9ICtuZXcgRGF0ZTtcbiAgICAgICAgICAgIHZhciB0bXAgPSByYXdbMF0sIG1zZztcbiAgICAgICAgICAgIC8vcmF3
ICYmIHJhdy5zbGljZSAmJiBjb25zb2xlLmxvZyhcImhlYXI6XCIsICgocGVlci53aXJlfHwnJykuaGVhZGVyc3x8JycpLm9yaWdpbiwgcmF3Lmxlbmd0aCwg
cmF3LnNsaWNlICYmIHJhdy5zbGljZSgwLDUwKSk7IC8vdGMtaWFtdW5pcXVlLXRjLXBhY2thZ2UtZHMxXG4gICAgICAgICAgICBpZignWycgPT09IHRtcCl7
XG4gICAgICAgICAgICAgICAgcGFyc2UocmF3LCBmdW5jdGlvbihlcnIsIG1zZyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGVyciB8fCAhbXNnKXsgcmV0
dXJuIG1lc2guc2F5KHtkYW06ICchJywgZXJyOiBcIkRBTSBKU09OIHBhcnNlIGVycm9yLlwifSwgcGVlcikgfVxuICAgICAgICAgICAgICAgICAgICBjb25z
b2xlLlNUQVQgJiYgY29uc29sZS5TVEFUKCtuZXcgRGF0ZSwgbXNnLmxlbmd0aCwgJyMgb24gaGVhciBiYXRjaCcpO1xuICAgICAgICAgICAgICAgICAgICB2
YXIgUCA9IG9wdC5wdWZmO1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gZ28oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBTID0gK25l
dyBEYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSAwLCBtOyB3aGlsZShpIDwgUCAmJiAobSA9IG1zZ1tpKytdKSl7IG1lc2guaGVhciht
LCBwZWVyKSB9XG4gICAgICAgICAgICAgICAgICAgICAgICBtc2cgPSBtc2cuc2xpY2UoaSk7IC8vIHNsaWNpbmcgYWZ0ZXIgaXMgZmFzdGVyIHRoYW4gc2hp
ZnRpbmcgZHVyaW5nLlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5TVEFUICYmIGNvbnNvbGUuU1RBVChTLCArbmV3IERhdGUgLSBTLCAnaGVh
ciBsb29wJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmbHVzaChwZWVyKTsgLy8gZm9yY2Ugc2VuZCBhbGwgc3luY2hyb25vdXNseSBiYXRjaGVkIGFj
a3MuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZighbXNnLmxlbmd0aCl7IHJldHVybiB9XG4gICAgICAgICAgICAgICAgICAgICAgICBwdWZmKGdvLCAw
KTtcbiAgICAgICAgICAgICAgICAgICAgfSgpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByYXcgPSAnJzsgLy8gXG4gICAgICAg
ICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoJ3snID09PSB0bXAgfHwgKChyYXdbJyMnXSB8fCBPYmplY3QucGxhaW4o
cmF3KSkgJiYgKG1zZyA9IHJhdykpKXtcbiAgICAgICAgICAgICAgICBpZihtc2cpeyByZXR1cm4gaGVhci5vbmUobXNnLCBwZWVyLCBTKSB9XG4gICAgICAg
ICAgICAgICAgcGFyc2UocmF3LCBmdW5jdGlvbihlcnIsIG1zZyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGVyciB8fCAhbXNnKXsgcmV0dXJuIG1lc2gu
c2F5KHtkYW06ICchJywgZXJyOiBcIkRBTSBKU09OIHBhcnNlIGVycm9yLlwifSwgcGVlcikgfVxuICAgICAgICAgICAgICAgICAgICBoZWFyLm9uZShtc2cs
IHBlZXIsIFMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAg
ICBoZWFyLm9uZSA9IGZ1bmN0aW9uKG1zZywgcGVlciwgUyl7IC8vIFMgaGVyZSBpcyB0ZW1wb3JhcnkhIFVuZG8uXG4gICAgICAgICAgICB2YXIgaWQsIGhh
c2gsIHRtcCwgYXNoLCBEQkc7XG4gICAgICAgICAgICBpZihtc2cuREJHKXsgbXNnLkRCRyA9IERCRyA9IHtEQkc6IG1zZy5EQkd9IH1cbiAgICAgICAgICAg
IERCRyAmJiAoREJHLmggPSBTKTtcbiAgICAgICAgICAgIERCRyAmJiAoREJHLmhwID0gK25ldyBEYXRlKTtcbiAgICAgICAgICAgIGlmKCEoaWQgPSBtc2db
JyMnXSkpeyBpZCA9IG1zZ1snIyddID0gU3RyaW5nLnJhbmRvbSg5KSB9XG4gICAgICAgICAgICBpZih0bXAgPSBkdXBfY2hlY2soaWQpKXsgcmV0dXJuIH1c
biAgICAgICAgICAgIC8vIERBTSBsb2dpYzpcbiAgICAgICAgICAgIGlmKCEoaGFzaCA9IG1zZ1snIyMnXSkgJiYgZmFsc2UgJiYgdSAhPT0gbXNnLnB1dCl7
IC8qaGFzaCA9IG1zZ1snIyMnXSA9IFR5cGUub2JqLmhhc2gobXNnLnB1dCkqLyB9IC8vIGRpc2FibGUgaGFzaGluZyBmb3Igbm93IC8vIFRPRE86IGltcG9z
ZSB3YXJuaW5nL3BlbmFsdHkgaW5zdGVhZCAoPylcbiAgICAgICAgICAgIGlmKGhhc2ggJiYgKHRtcCA9IG1zZ1snQCddIHx8IChtc2cuZ2V0ICYmIGlkKSkg
JiYgZHVwLmNoZWNrKGFzaCA9IHRtcCtoYXNoKSl7IHJldHVybiB9IC8vIEltYWdpbmUgQSA8LT4gQiA8PT4gKEMgJiBEKSwgQyAmIEQgcmVwbHkgd2l0aCBz
YW1lIEFDSyBidXQgaGF2ZSBkaWZmZXJlbnQgSURzLCBCIGNhbiB1c2UgaGFzaCB0byBkZWR1cC4gT3IgaWYgYSBHRVQgaGFzIGEgaGFzaCBhbHJlYWR5LCB3
ZSBzaG91bGRuJ3QgQUNLIGlmIHNhbWUuXG4gICAgICAgICAgICAobXNnLl8gPSBmdW5jdGlvbigpe30pLnZpYSA9IG1lc2gubGVhcCA9IHBlZXI7XG4gICAg
ICAgICAgICBpZigodG1wID0gbXNnWyc+PCddKSAmJiAnc3RyaW5nJyA9PSB0eXBlb2YgdG1wKXsgdG1wLnNsaWNlKDAsOTkpLnNwbGl0KCcsJykuZm9yRWFj
aChmdW5jdGlvbihrKXsgdGhpc1trXSA9IDEgfSwgKG1zZy5fKS55byA9IHt9KSB9IC8vIFBlZXJzIGFscmVhZHkgc2VudCB0bywgZG8gbm90IHJlc2VuZC5c
biAgICAgICAgICAgIC8vIERBTSBeXG4gICAgICAgICAgICBpZih0bXAgPSBtc2cuZGFtKXtcbiAgICAgICAgICAgICAgICAoZHVwX3RyYWNrKGlkKXx8e30p
LnZpYSA9IHBlZXI7XG4gICAgICAgICAgICAgICAgaWYodG1wID0gbWVzaC5oZWFyW3RtcF0pe1xuICAgICAgICAgICAgICAgICAgICB0bXAobXNnLCBwZWVy
LCByb290KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYodG1wID0g
bXNnLm9rKXsgbXNnLl8ubmVhciA9IHRtcFsnLyddIH1cbiAgICAgICAgICAgIHZhciBTID0gK25ldyBEYXRlO1xuICAgICAgICAgICAgREJHICYmIChEQkcu
aXMgPSBTKTsgcGVlci5TSSA9IGlkO1xuICAgICAgICAgICAgZHVwX3RyYWNrLmVkID0gZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICAgICAgaWYoaWQgIT09
IGQpeyByZXR1cm4gfVxuICAgICAgICAgICAgICAgIGR1cF90cmFjay5lZCA9IDA7XG4gICAgICAgICAgICAgICAgaWYoIShkID0gZHVwLnNbaWRdKSl7IHJl
dHVybiB9XG4gICAgICAgICAgICAgICAgZC52aWEgPSBwZWVyO1xuICAgICAgICAgICAgICAgIGlmKG1zZy5nZXQpeyBkLml0ID0gbXNnIH1cbiAgICAgICAg
ICAgIH1cbiAgICAgICAgICAgIHJvb3Qub24oJ2luJywgbWVzaC5sYXN0ID0gbXNnKTtcbiAgICAgICAgICAgIERCRyAmJiAoREJHLmhkID0gK25ldyBEYXRl
KTtcbiAgICAgICAgICAgIGNvbnNvbGUuU1RBVCAmJiBjb25zb2xlLlNUQVQoUywgK25ldyBEYXRlIC0gUywgbXNnLmdldD8gJ21zZyBnZXQnIDogbXNnLnB1
dD8gJ21zZyBwdXQnIDogJ21zZycpO1xuICAgICAgICAgICAgZHVwX3RyYWNrKGlkKTsgLy8gaW4gY2FzZSAnaW4nIGRvZXMgbm90IGNhbGwgdHJhY2suXG4g
ICAgICAgICAgICBpZihhc2gpeyBkdXBfdHJhY2soYXNoKSB9IC8vZHVwLnRyYWNrKHRtcCtoYXNoLCB0cnVlKS5pdCA9IGl0KG1zZyk7XG4gICAgICAgICAg
ICBtZXNoLmxlYXAgPSBtZXNoLmxhc3QgPSBudWxsOyAvLyB3YXJuaW5nISBtZXNoLmxlYXAgY291bGQgYmUgYnVnZ3kuXG4gICAgICAgIH1cbiAgICAgICAg
dmFyIHRvbWFwID0gZnVuY3Rpb24oayxpLG0pe20oayx0cnVlKX07XG4gICAgICAgIGhlYXIuYyA9IGhlYXIuZCA9IDA7XG5cbiAgICAgICAgOyhmdW5jdGlv
bigpe1xuICAgICAgICAgICAgdmFyIFNNSUEgPSAwO1xuICAgICAgICAgICAgdmFyIGxvb3A7XG4gICAgICAgICAgICBtZXNoLmhhc2ggPSBmdW5jdGlvbiht
c2csIHBlZXIpeyB2YXIgaCwgcywgdDtcbiAgICAgICAgICAgICAgICB2YXIgUyA9ICtuZXcgRGF0ZTtcbiAgICAgICAgICAgICAgICBqc29uKG1zZy5wdXQs
IGZ1bmN0aW9uIGhhc2goZXJyLCB0ZXh0KXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNzID0gKHMgfHwgKHMgPSB0ID0gdGV4dHx8JycpKS5zbGljZSgw
LCAzMjc2OCk7IC8vIDEwMjQgKiAzMlxuICAgICAgICAgICAgICAgICAgaCA9IFN0cmluZy5oYXNoKHNzLCBoKTsgcyA9IHMuc2xpY2UoMzI3NjgpO1xuICAg
ICAgICAgICAgICAgICAgaWYocyl7IHB1ZmYoaGFzaCwgMCk7IHJldHVybiB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuU1RBVCAmJiBjb25zb2xl
LlNUQVQoUywgK25ldyBEYXRlIC0gUywgJ3NheSBqc29uK2hhc2gnKTtcbiAgICAgICAgICAgICAgICAgIG1zZy5fLiRwdXQgPSB0O1xuICAgICAgICAgICAg
ICAgICAgbXNnWycjIyddID0gaDtcbiAgICAgICAgICAgICAgICAgIG1lc2guc2F5KG1zZywgcGVlcik7XG4gICAgICAgICAgICAgICAgICBkZWxldGUgbXNn
Ll8uJHB1dDtcbiAgICAgICAgICAgICAgICB9LCBzb3J0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIHNvcnQoaywgdil7IHZhciB0
bXA7XG4gICAgICAgICAgICAgICAgaWYoISh2IGluc3RhbmNlb2YgT2JqZWN0KSl7IHJldHVybiB2IH1cbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyh2
KS5zb3J0KCkuZm9yRWFjaChzb3J0YSwge3RvOiB0bXAgPSB7fSwgb246IHZ9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdG1wO1xuICAgICAgICAgICAg
fSBmdW5jdGlvbiBzb3J0YShrKXsgdGhpcy50b1trXSA9IHRoaXMub25ba10gfVxuXG4gICAgICAgICAgICB2YXIgc2F5ID0gbWVzaC5zYXkgPSBmdW5jdGlv
bihtc2csIHBlZXIpeyB2YXIgdG1wO1xuICAgICAgICAgICAgICAgIGlmKCh0bXAgPSB0aGlzKSAmJiAodG1wID0gdG1wLnRvKSAmJiB0bXAubmV4dCl7IHRt
cC5uZXh0KG1zZykgfSAvLyBjb21wYXRpYmxlIHdpdGggbWlkZGxld2FyZSBhZGFwdGVycy5cbiAgICAgICAgICAgICAgICBpZighbXNnKXsgcmV0dXJuIGZh
bHNlIH1cbiAgICAgICAgICAgICAgICB2YXIgaWQsIGhhc2gsIHJhdywgYWNrID0gbXNnWydAJ107XG4gICAgLy9pZihvcHQuc3VwZXIgJiYgKCFhY2sgfHwg
IW1zZy5wdXQpKXsgcmV0dXJuIH0gLy8gVE9ETzogTUFOSEFUVEFOIFNUVUIgLy9PQlZJT1VTTFkgQlVHISBCdXQgc3F1ZWxjaCByZWxheS4gLy8gOiggZ2V0
IG9ubHkgaXMgMTAwJSsgQ1BVIHVzYWdlIDooXG4gICAgICAgICAgICAgICAgdmFyIG1ldGEgPSBtc2cuX3x8KG1zZy5fPWZ1bmN0aW9uKCl7fSk7XG4gICAg
ICAgICAgICAgICAgdmFyIERCRyA9IG1zZy5EQkcsIFMgPSArbmV3IERhdGU7IG1ldGEueSA9IG1ldGEueSB8fCBTOyBpZighcGVlcil7IERCRyAmJiAoREJH
LnkgPSBTKSB9XG4gICAgICAgICAgICAgICAgaWYoIShpZCA9IG1zZ1snIyddKSl7IGlkID0gbXNnWycjJ10gPSBTdHJpbmcucmFuZG9tKDkpIH1cbiAgICAg
ICAgICAgICAgICAhbG9vcCAmJiBkdXBfdHJhY2soaWQpOy8vLml0ID0gaXQobXNnKTsgLy8gdHJhY2sgZm9yIDkgc2Vjb25kcywgZGVmYXVsdC4gRWFydGg8
LT5NYXJzIHdvdWxkIG5lZWQgbW9yZSEgLy8gYWx3YXlzIHRyYWNrLCBtYXliZSBtb3ZlIHRoaXMgdG8gdGhlICdhZnRlcicgbG9naWMgaWYgd2Ugc3BsaXQg
ZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgLy9pZihtc2cucHV0ICYmIChtc2cuZXJyIHx8IChkdXAuc1tpZF18fCcnKS5lcnIpKXsgcmV0dXJuIGZhbHNl
IH0gLy8gVE9ETzogaW4gdGhlb3J5IHdlIHNob3VsZCBub3QgYmUgYWJsZSB0byBzdHVuIGEgbWVzc2FnZSwgYnV0IGZvciBub3cgZ29pbmcgdG8gY2hlY2sg
aWYgaXQgY2FuIGhlbHAgbmV0d29yayBwZXJmb3JtYW5jZSBwcmV2ZW50aW5nIGludmFsaWQgZGF0YSB0byByZWxheS5cbiAgICAgICAgICAgICAgICBpZigh
KGhhc2ggPSBtc2dbJyMjJ10pICYmIHUgIT09IG1zZy5wdXQgJiYgIW1ldGEudmlhICYmIGFjayl7IG1lc2guaGFzaChtc2csIHBlZXIpOyByZXR1cm4gfSAv
LyBUT0RPOiBTaG91bGQgYnJvYWRjYXN0cyBiZSBoYXNoZWQ/XG4gICAgICAgICAgICAgICAgaWYoIXBlZXIgJiYgYWNrKXsgcGVlciA9ICgodG1wID0gZHVw
LnNbYWNrXSkgJiYgKHRtcC52aWEgfHwgKCh0bXAgPSB0bXAuaXQpICYmICh0bXAgPSB0bXAuXykgJiYgdG1wLnZpYSkpKSB8fCAoKHRtcCA9IG1lc2gubGFz
dCkgJiYgYWNrID09PSB0bXBbJyMnXSAmJiBtZXNoLmxlYXApIH0gLy8gd2FybmluZyEgbWVzaC5sZWFwIGNvdWxkIGJlIGJ1Z2d5ISBtZXNoIGxhc3QgY2hl
Y2sgcmVkdWNlcyB0aGlzLiAvLyBUT0RPOiBDTEVBTiBVUCBUSElTIExJTkUgTk9XPyBgLml0YCBzaG91bGQgYmUgcmVsaWFibGUuXG4gICAgICAgICAgICAg
ICAgaWYoIXBlZXIgJiYgYWNrKXsgLy8gc3RpbGwgbm8gcGVlciwgdGhlbiBhY2sgZGFpc3kgY2hhaW4gJ3R1bm5lbCcgZ290IGxvc3QuXG4gICAgICAgICAg
ICAgICAgICAgIGlmKGR1cC5zW2Fja10peyByZXR1cm4gfSAvLyBpbiBkdXBzIGJ1dCBubyBwZWVyIGhpbnRzIHRoYXQgdGhpcyB3YXMgYWNrIHRvIG91cnNl
bGYsIGlnbm9yZS5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5TVEFUICYmIGNvbnNvbGUuU1RBVCgrbmV3IERhdGUsICsrU01JQSwgJ3RvdGFsIG5v
IHBlZXIgdG8gYWNrIHRvJyk7IC8vIFRPRE86IERlbGV0ZSB0aGlzIG5vdy4gRHJvcHBpbmcgbG9zdCBBQ0tzIGlzIHByb3RvY29sIGZpbmUgbm93LlxuICAg
ICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSAvLyBUT0RPOiBUZW1wb3Jhcnk/IElmIGFjayB2aWEgdHJhY2UgaGFz
IGJlZW4gbG9zdCwgYWNrcyB3aWxsIGdvIHRvIGFsbCBwZWVycywgd2hpY2ggdHJhc2hlcyBicm93c2VyIGJhbmR3aWR0aC4gTm90IHJlbGF5aW5nIHRoZSBh
Y2sgd2lsbCBmb3JjZSBzZW5kZXIgdG8gYXNrIGZvciBhY2sgYWdhaW4uIE5vdGUsIHRoaXMgaXMgdGVjaG5pY2FsbHkgd3JvbmcgZm9yIG1lc2ggYmVoYXZp
b3IuXG4gICAgICAgICAgICAgICAgaWYoYWNrICYmICFtc2cucHV0ICYmICFoYXNoICYmICgoZHVwLnNbYWNrXXx8JycpLml0fHwnJylbJyMjJ10peyByZXR1
cm4gZmFsc2UgfSAvLyBJZiB3ZSdyZSBzYXlpbmcgJ25vdCBmb3VuZCcgYnV0IGEgcmVsYXkgaGFkIGRhdGEsIGRvIG5vdCBib3RoZXIgc2VuZGluZyBvdXIg
bm90IGZvdW5kLiAvLyBJcyB0aGlzIGNvcnJlY3QsIHJldHVybiBmYWxzZT8gLy8gTk9URTogQUREIFBBTklDIFRFU1QgRk9SIFRISVMhXG4gICAgICAgICAg
ICAgICAgaWYoIXBlZXIgJiYgbWVzaC53YXkpeyByZXR1cm4gbWVzaC53YXkobXNnKSB9XG4gICAgICAgICAgICAgICAgREJHICYmIChEQkcueWggPSArbmV3
IERhdGUpO1xuICAgICAgICAgICAgICAgIGlmKCEocmF3ID0gbWV0YS5yYXcpKXsgbWVzaC5yYXcobXNnLCBwZWVyKTsgcmV0dXJuIH1cbiAgICAgICAgICAg
ICAgICBEQkcgJiYgKERCRy55ciA9ICtuZXcgRGF0ZSk7XG4gICAgICAgICAgICAgICAgaWYoIXBlZXIgfHwgIXBlZXIuaWQpe1xuICAgICAgICAgICAgICAg
ICAgICBpZighT2JqZWN0LnBsYWluKHBlZXIgfHwgb3B0LnBlZXJzKSl7IHJldHVybiBmYWxzZSB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBTID0gK25l
dyBEYXRlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgUCA9IG9wdC5wdWZmLCBwcyA9IG9wdC5wZWVycywgcGwgPSBPYmplY3Qua2V5cyhwZWVyIHx8IG9w
dC5wZWVycyB8fCB7fSk7IC8vIFRPRE86IC5rZXlzKCBpcyBzbG93XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuU1RBVCAmJiBjb25zb2xlLlNUQVQo
UywgK25ldyBEYXRlIC0gUywgJ3BlZXIga2V5cycpO1xuICAgICAgICAgICAgICAgICAgICA7KGZ1bmN0aW9uIGdvKCl7XG4gICAgICAgICAgICAgICAgICAg
ICAgICB2YXIgUyA9ICtuZXcgRGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vVHlwZS5vYmoubWFwKHBlZXIgfHwgb3B0LnBlZXJzLCBlYWNoKTsg
Ly8gaW4gY2FzZSBwZWVyIGlzIGEgcGVlciBsaXN0LlxuICAgICAgICAgICAgICAgICAgICAgICAgbG9vcCA9IDE7IHZhciB3ciA9IG1ldGEucmF3OyBtZXRh
LnJhdyA9IHJhdzsgLy8gcXVpY2sgcGVyZiBoYWNrXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaSA9IDAsIHA7IHdoaWxlKGkgPCA5ICYmIChwID0g
KHBsfHwnJylbaSsrXSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCEocCA9IHBzW3BdIHx8IChwZWVyfHwnJylbcF0pKXsgY29udGludWUg
fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc2guc2F5KG1zZywgcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAg
ICAgICAgICAgICBtZXRhLnJhdyA9IHdyOyBsb29wID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsID0gcGwuc2xpY2UoaSk7IC8vIHNsaWNpbmcg
YWZ0ZXIgaXMgZmFzdGVyIHRoYW4gc2hpZnRpbmcgZHVyaW5nLlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5TVEFUICYmIGNvbnNvbGUuU1RB
VChTLCArbmV3IERhdGUgLSBTLCAnc2F5IGxvb3AnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFwbC5sZW5ndGgpeyByZXR1cm4gfVxuICAgICAg
ICAgICAgICAgICAgICAgICAgcHVmZihnbywgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY2sgJiYgZHVwX3RyYWNrKGFjayk7IC8vIGtlZXAgZm9y
IGxhdGVyXG4gICAgICAgICAgICAgICAgICAgIH0oKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAg
ICAgICAgICAgLy8gVE9ETzogUEVSRjogY29uc2lkZXIgc3BsaXR0aW5nIGZ1bmN0aW9uIGhlcmUsIHNvIHNheSBsb29wcyBkbyBsZXNzIHdvcmsuXG4gICAg
ICAgICAgICAgICAgaWYoIXBlZXIud2lyZSAmJiBtZXNoLndpcmUpeyBtZXNoLndpcmUocGVlcikgfVxuICAgICAgICAgICAgICAgIGlmKGlkID09PSBwZWVy
Lmxhc3QpeyByZXR1cm4gfSBwZWVyLmxhc3QgPSBpZDsgIC8vIHdhcyBpdCBqdXN0IHNlbnQ/XG4gICAgICAgICAgICAgICAgaWYocGVlciA9PT0gbWV0YS52
aWEpeyByZXR1cm4gZmFsc2UgfSAvLyBkb24ndCBzZW5kIGJhY2sgdG8gc2VsZi5cbiAgICAgICAgICAgICAgICBpZigodG1wID0gbWV0YS55bykgJiYgKHRt
cFtwZWVyLnVybF0gfHwgdG1wW3BlZXIucGlkXSB8fCB0bXBbcGVlci5pZF0pIC8qJiYgIW8qLyl7IHJldHVybiBmYWxzZSB9XG4gICAgICAgICAgICAgICAg
Y29uc29sZS5TVEFUICYmIGNvbnNvbGUuU1RBVChTLCAoKERCR3x8bWV0YSkueXAgPSArbmV3IERhdGUpIC0gKG1ldGEueSB8fCBTKSwgJ3NheSBwcmVwJyk7
XG4gICAgICAgICAgICAgICAgIWxvb3AgJiYgYWNrICYmIGR1cF90cmFjayhhY2spOyAvLyBzdHJlYW1pbmcgbG9uZyByZXNwb25zZXMgbmVlZHMgdG8ga2Vl
cCBhbGl2ZSB0aGUgYWNrLlxuICAgICAgICAgICAgICAgIGlmKHBlZXIuYmF0Y2gpe1xuICAgICAgICAgICAgICAgICAgICBwZWVyLnRhaWwgPSAodG1wID0g
cGVlci50YWlsIHx8IDApICsgcmF3Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgaWYocGVlci50YWlsIDw9IG9wdC5wYWNrKXtcbiAgICAgICAgICAg
ICAgICAgICAgICAgIHBlZXIuYmF0Y2ggKz0gKHRtcD8nLCc6JycpK3JhdztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAg
ICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmbHVzaChwZWVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGVlci5iYXRj
aCA9ICdbJzsgLy8gUHJldmVudHMgZG91YmxlIEpTT04hXG4gICAgICAgICAgICAgICAgdmFyIFNUID0gK25ldyBEYXRlO1xuICAgICAgICAgICAgICAgIHNl
dFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5TVEFUICYmIGNvbnNvbGUuU1RBVChTVCwgK25ldyBEYXRlIC0gU1Qs
ICcwbXMgVE8nKTtcbiAgICAgICAgICAgICAgICAgICAgZmx1c2gocGVlcik7XG4gICAgICAgICAgICAgICAgfSwgb3B0LmdhcCk7IC8vIFRPRE86IHF1ZXVp
bmcvYmF0Y2hpbmcgbWlnaHQgYmUgYmFkIGZvciBsb3ctbGF0ZW5jeSB2aWRlbyBnYW1lIHBlcmZvcm1hbmNlISBBbGxvdyBvcHQgb3V0P1xuICAgICAgICAg
ICAgICAgIHNlbmQocmF3LCBwZWVyKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLlNUQVQgJiYgKGFjayA9PT0gcGVlci5TSSkgJiYgY29uc29sZS5TVEFU
KFMsICtuZXcgRGF0ZSAtIHBlZXIuU0gsICdzYXkgYWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZXNoLnNheS5jID0gbWVzaC5zYXkuZCA9
IDA7XG4gICAgICAgICAgICAvLyBUT0RPOiB0aGlzIGNhdXNlZCBhIG91dC1vZi1tZW1vcnkgY3Jhc2ghXG4gICAgICAgICAgICBtZXNoLnJhdyA9IGZ1bmN0
aW9uKG1zZywgcGVlcil7IC8vIFRPRE86IENsZWFuIHRoaXMgdXAgLyBkZWxldGUgaXQgLyBtb3ZlIGxvZ2ljIG91dCFcbiAgICAgICAgICAgICAgICBpZigh
bXNnKXsgcmV0dXJuICcnIH1cbiAgICAgICAgICAgICAgICB2YXIgbWV0YSA9IChtc2cuXykgfHwge30sIHB1dCwgdG1wO1xuICAgICAgICAgICAgICAgIGlm
KHRtcCA9IG1ldGEucmF3KXsgcmV0dXJuIHRtcCB9XG4gICAgICAgICAgICAgICAgaWYoJ3N0cmluZycgPT0gdHlwZW9mIG1zZyl7IHJldHVybiBtc2cgfVxu
ICAgICAgICAgICAgICAgIHZhciBoYXNoID0gbXNnWycjIyddLCBhY2sgPSBtc2dbJ0AnXTtcbiAgICAgICAgICAgICAgICBpZihoYXNoICYmIGFjayl7XG4g
ICAgICAgICAgICAgICAgICAgIGlmKCFtZXRhLnZpYSAmJiBkdXBfY2hlY2soYWNrK2hhc2gpKXsgcmV0dXJuIGZhbHNlIH0gLy8gZm9yIG91ciBvd24gb3V0
IG1lc3NhZ2VzLCBtZW1vcnkgJiBzdG9yYWdlIG1heSBhY2sgdGhlIHNhbWUgdGhpbmcsIHNvIGRlZHVwIHRoYXQuIFRobyBpZiB2aWEgYW5vdGhlciBwZWVy
LCB3ZSBhbHJlYWR5IHRyYWNrZWQgaXQgdXBvbiBoZWFyaW5nLCBzbyB0aGlzIHdpbGwgYWx3YXlzIHRyaWdnZXIgZmFsc2UgcG9zaXRpdmVzLCBzbyBkb24n
dCBkbyB0aGF0IVxuICAgICAgICAgICAgICAgICAgICBpZih0bXAgPSAoZHVwLnNbYWNrXXx8JycpLml0KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlm
KGhhc2ggPT09IHRtcFsnIyMnXSl7IHJldHVybiBmYWxzZSB9IC8vIGlmIGFzayBoYXMgYSBtYXRjaGluZyBoYXNoLCBhY2tpbmcgaXMgb3B0aW9uYWwuXG4g
ICAgICAgICAgICAgICAgICAgICAgICBpZighdG1wWycjIyddKXsgdG1wWycjIyddID0gaGFzaCB9IC8vIGlmIG5vbmUsIGFkZCBvdXIgaGFzaCB0byBhc2sg
c28gYW55b25lIHdlIHJlbGF5IHRvIGNhbiBkZWR1cC4gLy8gTk9URTogTWF5IG9ubHkgY2hlY2sgYWdhaW5zdCAxc3QgYWNrIGNodW5rLCAybmQrIHdvbid0
IGtub3cgYW5kIHN0aWxsIHN0cmVhbSBiYWNrIHRvIHJlbGF5aW5nIHBlZXJzIHdoaWNoIG1heSB0aGVuIGRlZHVwLiBBbnkgd2F5IHRvIGZpeCB0aGlzIHdh
c3RlZCBiYW5kd2lkdGg/IEkgZ3Vlc3MgZm9yY2UgcmF0ZSBsaW1pdGluZyBicmVha2luZyBjaGFuZ2UsIHRoYXQgYXNraW5nIHBlZXIgaGFzIHRvIGFzayBm
b3IgbmV4dCBsZXhpY2FsIGNodW5rLlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKCFtc2cu
ZGFtICYmICFtc2dbJ0AnXSl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpID0gMCwgdG8gPSBbXTsgdG1wID0gb3B0LnBlZXJzO1xuICAgICAgICAgICAg
ICAgICAgICBmb3IodmFyIGsgaW4gdG1wKXsgdmFyIHAgPSB0bXBba107IC8vIFRPRE86IE1ha2UgaXQgdXAgcGVlcnMgaW5zdGVhZCFcbiAgICAgICAgICAg
ICAgICAgICAgICAgIHRvLnB1c2gocC51cmwgfHwgcC5waWQgfHwgcC5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZigrK2kgPiA2KXsgYnJlYWsg
fVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmKGkgPiAxKXsgbXNnWyc+PCddID0gdG8uam9pbigpIH0gLy8gVE9ETzog
QlVHISBUaGlzIGdldHMgc2V0IHJlZ2FyZGxlc3Mgb2YgcGVlcnMgc2VudCB0byEgRGV0ZWN0P1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAg
ICBpZihtc2cucHV0ICYmICh0bXAgPSBtc2cub2spKXsgbXNnLm9rID0geydAJzoodG1wWydAJ118fDEpLTEsICcvJzogKHRtcFsnLyddPT1tc2cuXy5uZWFy
KT8gbWVzaC5uZWFyIDogdG1wWycvJ119OyB9XG4gICAgICAgICAgICAgICAgaWYocHV0ID0gbWV0YS4kcHV0KXtcbiAgICAgICAgICAgICAgICAgICAgdG1w
ID0ge307IE9iamVjdC5rZXlzKG1zZykuZm9yRWFjaChmdW5jdGlvbihrKXsgdG1wW2tdID0gbXNnW2tdIH0pO1xuICAgICAgICAgICAgICAgICAgICB0bXAu
cHV0ID0gJzpdKShbOic7XG4gICAgICAgICAgICAgICAgICAgIGpzb24odG1wLCBmdW5jdGlvbihlcnIsIHJhdyl7XG4gICAgICAgICAgICAgICAgICAgICAg
ICBpZihlcnIpeyByZXR1cm4gfSAvLyBUT0RPOiBIYW5kbGUhIVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFMgPSArbmV3IERhdGU7XG4gICAgICAg
ICAgICAgICAgICAgICAgICB0bXAgPSByYXcuaW5kZXhPZignXCJwdXRcIjpcIjpdKShbOlwiJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXModSwg
cmF3ID0gcmF3LnNsaWNlKDAsIHRtcCs2KSArIHB1dCArIHJhdy5zbGljZSh0bXAgKyAxNCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5T
VEFUICYmIGNvbnNvbGUuU1RBVChTLCArbmV3IERhdGUgLSBTLCAnc2F5IHNsaWNlJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAg
ICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGpzb24obXNnLCByZXMpO1xuICAgICAgICAgICAgICAgIGZ1bmN0
aW9uIHJlcyhlcnIsIHJhdyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGVycil7IHJldHVybiB9IC8vIFRPRE86IEhhbmRsZSEhXG4gICAgICAgICAgICAg
ICAgICAgIG1ldGEucmF3ID0gcmF3OyAvL2lmKG1ldGEgJiYgKHJhd3x8JycpLmxlbmd0aCA8ICg5OTkgKiA5OSkpeyBtZXRhLnJhdyA9IHJhdyB9IC8vIEhO
UEVSRjogSWYgc3RyaW5nIHRvbyBiaWcsIGRvbid0IGtlZXAgaW4gbWVtb3J5LlxuICAgICAgICAgICAgICAgICAgICBtZXNoLnNheShtc2csIHBlZXIpO1xu
ICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSgpKTtcblxuICAgICAgICBmdW5jdGlvbiBmbHVzaChwZWVyKXtcbiAgICAgICAg
ICAgIHZhciB0bXAgPSBwZWVyLmJhdGNoLCB0ID0gJ3N0cmluZycgPT0gdHlwZW9mIHRtcCwgbDtcbiAgICAgICAgICAgIGlmKHQpeyB0bXAgKz0gJ10nIH0v
LyBUT0RPOiBQcmV2ZW50IGRvdWJsZSBKU09OIVxuICAgICAgICAgICAgcGVlci5iYXRjaCA9IHBlZXIudGFpbCA9IG51bGw7XG4gICAgICAgICAgICBpZigh
dG1wKXsgcmV0dXJuIH1cbiAgICAgICAgICAgIGlmKHQ/IDMgPiB0bXAubGVuZ3RoIDogIXRtcC5sZW5ndGgpeyByZXR1cm4gfSAvLyBUT0RPOiBeXG4gICAg
ICAgICAgICBpZighdCl7dHJ5e3RtcCA9ICgxID09PSB0bXAubGVuZ3RoPyB0bXBbMF0gOiBKU09OLnN0cmluZ2lmeSh0bXApKTtcbiAgICAgICAgICAgIH1j
YXRjaChlKXtyZXR1cm4gb3B0LmxvZygnREFNIEpTT04gc3RyaW5naWZ5IGVycm9yJywgZSl9fVxuICAgICAgICAgICAgaWYoIXRtcCl7IHJldHVybiB9XG4g
ICAgICAgICAgICBzZW5kKHRtcCwgcGVlcik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZm9yIG5vdyAtIGZpbmQgYmV0dGVyIHBsYWNlIGxhdGVyLlxuICAg
ICAgICBmdW5jdGlvbiBzZW5kKHJhdywgcGVlcil7IHRyeXtcbiAgICAgICAgICAgIHZhciB3aXJlID0gcGVlci53aXJlO1xuICAgICAgICAgICAgaWYocGVl
ci5zYXkpe1xuICAgICAgICAgICAgICAgIHBlZXIuc2F5KHJhdyk7XG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIGlmKHdpcmUuc2VuZCl7XG4g
ICAgICAgICAgICAgICAgd2lyZS5zZW5kKHJhdyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZXNoLnNheS5kICs9IHJhdy5sZW5ndGh8fDA7ICsr
bWVzaC5zYXkuYzsgLy8gU1RBVFMhXG4gICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgIChwZWVyLnF1ZXVlID0gcGVlci5xdWV1ZSB8fCBbXSkucHVz
aChyYXcpO1xuICAgICAgICB9fVxuXG4gICAgICAgIG1lc2gubmVhciA9IDA7XG4gICAgICAgIG1lc2guaGkgPSBmdW5jdGlvbihwZWVyKXtcbiAgICAgICAg
ICAgIHZhciB3aXJlID0gcGVlci53aXJlLCB0bXA7XG4gICAgICAgICAgICBpZighd2lyZSl7IG1lc2gud2lyZSgocGVlci5sZW5ndGggJiYge3VybDogcGVl
ciwgaWQ6IHBlZXJ9KSB8fCBwZWVyKTsgcmV0dXJuIH1cbiAgICAgICAgICAgIGlmKHBlZXIuaWQpe1xuICAgICAgICAgICAgICAgIG9wdC5wZWVyc1twZWVy
LnVybCB8fCBwZWVyLmlkXSA9IHBlZXI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRtcCA9IHBlZXIuaWQgPSBwZWVyLmlkIHx8
IHBlZXIudXJsIHx8IFN0cmluZy5yYW5kb20oOSk7XG4gICAgICAgICAgICAgICAgbWVzaC5zYXkoe2RhbTogJz8nLCBwaWQ6IHJvb3Qub3B0LnBpZH0sIG9w
dC5wZWVyc1t0bXBdID0gcGVlcik7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGR1cC5zW3BlZXIubGFzdF07IC8vIElNUE9SVEFOVDogc2VlIGh0dHBzOi8v
Z3VuLmVjby9kb2NzL0RBTSNzZWxmXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZighcGVlci5tZXQpe1xuICAgICAgICAgICAgICAgIG1lc2gubmVh
cisrO1xuICAgICAgICAgICAgICAgIHBlZXIubWV0ID0gKyhuZXcgRGF0ZSk7XG4gICAgICAgICAgICAgICAgcm9vdC5vbignaGknLCBwZWVyKVxuICAgICAg
ICAgICAgfVxuICAgICAgICAgICAgLy8gQHJvZ293c2tpIEkgbmVlZCB0aGlzIGhlcmUgYnkgZGVmYXVsdCBmb3Igbm93IHRvIGZpeCBnbzFkZmlzaCdzIGJ1
Z1xuICAgICAgICAgICAgdG1wID0gcGVlci5xdWV1ZTsgcGVlci5xdWV1ZSA9IFtdO1xuICAgICAgICAgICAgc2V0VGltZW91dC5lYWNoKHRtcHx8W10sZnVu
Y3Rpb24obXNnKXtcbiAgICAgICAgICAgICAgICBzZW5kKG1zZywgcGVlcik7XG4gICAgICAgICAgICB9LDAsOSk7XG4gICAgICAgICAgICAvL1R5cGUub2Jq
Lm5hdGl2ZSAmJiBUeXBlLm9iai5uYXRpdmUoKTsgLy8gZGlydHkgcGxhY2UgdG8gY2hlY2sgaWYgb3RoZXIgSlMgcG9sbHV0ZWQuXG4gICAgICAgIH1cbiAg
ICAgICAgbWVzaC5ieWUgPSBmdW5jdGlvbihwZWVyKXtcbiAgICAgICAgICAgIHBlZXIubWV0ICYmIC0tbWVzaC5uZWFyO1xuICAgICAgICAgICAgZGVsZXRl
IHBlZXIubWV0O1xuICAgICAgICAgICAgcm9vdC5vbignYnllJywgcGVlcik7XG4gICAgICAgICAgICB2YXIgdG1wID0gKyhuZXcgRGF0ZSk7IHRtcCA9ICh0
bXAgLSAocGVlci5tZXR8fHRtcCkpO1xuICAgICAgICAgICAgbWVzaC5ieWUudGltZSA9ICgobWVzaC5ieWUudGltZSB8fCB0bXApICsgdG1wKSAvIDI7XG4g
ICAgICAgIH1cbiAgICAgICAgbWVzaC5oZWFyWychJ10gPSBmdW5jdGlvbihtc2csIHBlZXIpeyBvcHQubG9nKCdFcnJvcjonLCBtc2cuZXJyKSB9XG4gICAg
ICAgIG1lc2guaGVhclsnPyddID0gZnVuY3Rpb24obXNnLCBwZWVyKXtcbiAgICAgICAgICAgIGlmKG1zZy5waWQpe1xuICAgICAgICAgICAgICAgIGlmKCFw
ZWVyLnBpZCl7IHBlZXIucGlkID0gbXNnLnBpZCB9XG4gICAgICAgICAgICAgICAgaWYobXNnWydAJ10peyByZXR1cm4gfVxuICAgICAgICAgICAgfVxuICAg
ICAgICAgICAgbWVzaC5zYXkoe2RhbTogJz8nLCBwaWQ6IG9wdC5waWQsICdAJzogbXNnWycjJ119LCBwZWVyKTtcbiAgICAgICAgICAgIGRlbGV0ZSBkdXAu
c1twZWVyLmxhc3RdOyAvLyBJTVBPUlRBTlQ6IHNlZSBodHRwczovL2d1bi5lY28vZG9jcy9EQU0jc2VsZlxuICAgICAgICB9XG4gICAgICAgIG1lc2guaGVh
clsnbW9iJ10gPSBmdW5jdGlvbihtc2csIHBlZXIpeyAvLyBOT1RFOiBBWEUgd2lsbCBvdmVybG9hZCB0aGlzIHdpdGggYmV0dGVyIGxvZ2ljLlxuICAgICAg
ICAgICAgaWYoIW1zZy5wZWVycyl7IHJldHVybiB9XG4gICAgICAgICAgICB2YXIgcGVlcnMgPSBPYmplY3Qua2V5cyhtc2cucGVlcnMpLCBvbmUgPSBwZWVy
c1soTWF0aC5yYW5kb20oKSpwZWVycy5sZW5ndGgpID4+IDBdO1xuICAgICAgICAgICAgaWYoIW9uZSl7IHJldHVybiB9XG4gICAgICAgICAgICBtZXNoLmJ5
ZShwZWVyKTtcbiAgICAgICAgICAgIG1lc2guaGkob25lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJvb3Qub24oJ2NyZWF0ZScsIGZ1bmN0aW9uKHJvb3Qp
e1xuICAgICAgICAgICAgcm9vdC5vcHQucGlkID0gcm9vdC5vcHQucGlkIHx8IFN0cmluZy5yYW5kb20oOSk7XG4gICAgICAgICAgICB0aGlzLnRvLm5leHQo
cm9vdCk7XG4gICAgICAgICAgICByb290Lm9uKCdvdXQnLCBtZXNoLnNheSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJvb3Qub24oJ2J5ZScsIGZ1bmN0
aW9uKHBlZXIsIHRtcCl7XG4gICAgICAgICAgICBwZWVyID0gb3B0LnBlZXJzW3BlZXIuaWQgfHwgcGVlcl0gfHwgcGVlcjtcbiAgICAgICAgICAgIHRoaXMu
dG8ubmV4dChwZWVyKTtcbiAgICAgICAgICAgIHBlZXIuYnllPyBwZWVyLmJ5ZSgpIDogKHRtcCA9IHBlZXIud2lyZSkgJiYgdG1wLmNsb3NlICYmIHRtcC5j
bG9zZSgpO1xuICAgICAgICAgICAgZGVsZXRlIG9wdC5wZWVyc1twZWVyLmlkXTtcbiAgICAgICAgICAgIHBlZXIud2lyZSA9IG51bGw7XG4gICAgICAgIH0p
O1xuXG4gICAgICAgIHZhciBnZXRzID0ge307XG4gICAgICAgIHJvb3Qub24oJ2J5ZScsIGZ1bmN0aW9uKHBlZXIsIHRtcCl7IHRoaXMudG8ubmV4dChwZWVy
KTtcbiAgICAgICAgICAgIGlmKHRtcCA9IGNvbnNvbGUuU1RBVCl7IHRtcC5wZWVycyA9IG1lc2gubmVhcjsgfVxuICAgICAgICAgICAgaWYoISh0bXAgPSBw
ZWVyLnVybCkpeyByZXR1cm4gfSBnZXRzW3RtcF0gPSB0cnVlO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpeyBkZWxldGUgZ2V0c1t0bXBd
IH0sb3B0LmxhY2sgfHwgOTAwMCk7XG4gICAgICAgIH0pO1xuICAgICAgICByb290Lm9uKCdoaScsIGZ1bmN0aW9uKHBlZXIsIHRtcCl7IHRoaXMudG8ubmV4
dChwZWVyKTtcbiAgICAgICAgICAgIGlmKHRtcCA9IGNvbnNvbGUuU1RBVCl7IHRtcC5wZWVycyA9IG1lc2gubmVhciB9XG4gICAgICAgICAgICBpZihvcHQu
c3VwZXIpeyByZXR1cm4gfSAvLyB0ZW1wb3JhcnkgKD8pIHVudGlsIHdlIGhhdmUgYmV0dGVyIGZpeC9zb2x1dGlvbj9cbiAgICAgICAgICAgIHZhciBzb3Vs
cyA9IE9iamVjdC5rZXlzKHJvb3QubmV4dHx8JycpOyAvLyBUT0RPOiAua2V5cyggaXMgc2xvd1xuICAgICAgICAgICAgaWYoc291bHMubGVuZ3RoID4gOTk5
OSAmJiAhY29uc29sZS5TVUJTKXsgY29uc29sZS5sb2coY29uc29sZS5TVUJTID0gXCJXYXJuaW5nOiBZb3UgaGF2ZSBtb3JlIHRoYW4gMTBLIGxpdmUgR0VU
cywgd2hpY2ggbWlnaHQgdXNlIG1vcmUgYmFuZHdpZHRoIHRoYW4geW91ciBzY3JlZW4gY2FuIHNob3cgLSBjb25zaWRlciBgLm9mZigpYC5cIikgfVxuICAg
ICAgICAgICAgc2V0VGltZW91dC5lYWNoKHNvdWxzLCBmdW5jdGlvbihzb3VsKXsgdmFyIG5vZGUgPSByb290Lm5leHRbc291bF07XG4gICAgICAgICAgICAg
ICAgaWYob3B0LnN1cGVyIHx8IChub2RlLmFza3x8JycpWycnXSl7IG1lc2guc2F5KHtnZXQ6IHsnIyc6IHNvdWx9fSwgcGVlcik7IHJldHVybiB9XG4gICAg
ICAgICAgICAgICAgc2V0VGltZW91dC5lYWNoKE9iamVjdC5rZXlzKG5vZGUuYXNrfHwnJyksIGZ1bmN0aW9uKGtleSl7IGlmKCFrZXkpeyByZXR1cm4gfVxu
ICAgICAgICAgICAgICAgICAgICAvLyBpcyB0aGUgbGFjayBvZiAjIyBhICFvbmlvbiBoaW50P1xuICAgICAgICAgICAgICAgICAgICBtZXNoLnNheSh7JyMj
JzogU3RyaW5nLmhhc2goKHJvb3QuZ3JhcGhbc291bF18fCcnKVtrZXldKSwgZ2V0OiB7JyMnOiBzb3VsLCAnLic6IGtleX19LCBwZWVyKTtcbiAgICAgICAg
ICAgICAgICAgICAgLy8gVE9ETzogU3dpdGNoIHRoaXMgc28gQm9vayBjb3VsZCByb3V0ZT9cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7
XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBtZXNoO1xuICAgIH1cbiAgICB2YXIgZW1wdHkgPSB7fSwgb2sgPSB0cnVlLCB1O1xuXG4gICAgdHJ5
eyBfX2RlZmF1bHRFeHBvcnQgPSBNZXNoIH1jYXRjaChlKXt9XG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgX19kZWZhdWx0RXhwb3J0OyIsInNyYy93ZWJzb2Nr
ZXQuanMiOiJpbXBvcnQgX19yb290IGZyb20gJy4vcm9vdC5qcyc7XG5pbXBvcnQgX19tZXNoIGZyb20gJy4vbWVzaC5qcyc7XG4oZnVuY3Rpb24oKXtcblxu
dmFyIEd1biA9IF9fcm9vdDtcbkd1bi5NZXNoID0gX19tZXNoO1xuXG4vLyBUT0RPOiByZXN5bmMgdXBvbiByZWNvbm5lY3Qgb25saW5lL29mZmxpbmVcbi8v
d2luZG93Lm9ub25saW5lID0gd2luZG93Lm9ub2ZmbGluZSA9IGZ1bmN0aW9uKCl7IGNvbnNvbGUubG9nKCdvbmxpbmU/JywgbmF2aWdhdG9yLm9uTGluZSkg
fVxuXG5HdW4ub24oJ29wdCcsIGZ1bmN0aW9uKHJvb3Qpe1xuXHR0aGlzLnRvLm5leHQocm9vdCk7XG5cdGlmKHJvb3Qub25jZSl7IHJldHVybiB9XG5cdHZh
ciBvcHQgPSByb290Lm9wdDtcblx0aWYoZmFsc2UgPT09IG9wdC5XZWJTb2NrZXQpeyByZXR1cm4gfVxuXG5cdHZhciBlbnYgPSBHdW4ud2luZG93IHx8IHt9
O1xuXHR2YXIgd2Vic29ja2V0ID0gb3B0LldlYlNvY2tldCB8fCBlbnYuV2ViU29ja2V0IHx8IGVudi53ZWJraXRXZWJTb2NrZXQgfHwgZW52Lm1veldlYlNv
Y2tldDtcblx0aWYoIXdlYnNvY2tldCl7IHJldHVybiB9XG5cdG9wdC5XZWJTb2NrZXQgPSB3ZWJzb2NrZXQ7XG5cblx0dmFyIG1lc2ggPSBvcHQubWVzaCA9
IG9wdC5tZXNoIHx8IEd1bi5NZXNoKHJvb3QpO1xuXG5cdHZhciB3aXJlZCA9IG1lc2gud2lyZSB8fCBvcHQud2lyZTtcblx0bWVzaC53aXJlID0gb3B0Lndp
cmUgPSBvcGVuO1xuXHRmdW5jdGlvbiBvcGVuKHBlZXIpeyB0cnl7XG5cdFx0aWYoIXBlZXIgfHwgIXBlZXIudXJsKXsgcmV0dXJuIHdpcmVkICYmIHdpcmVk
KHBlZXIpIH1cblx0XHR2YXIgdXJsID0gcGVlci51cmwucmVwbGFjZSgvXmh0dHAvLCAnd3MnKTtcblx0XHR2YXIgd2lyZSA9IHBlZXIud2lyZSA9IG5ldyBv
cHQuV2ViU29ja2V0KHVybCk7XG5cdFx0d2lyZS5vbmNsb3NlID0gZnVuY3Rpb24oKXtcblx0XHRcdHJlY29ubmVjdChwZWVyKTtcblx0XHRcdG9wdC5tZXNo
LmJ5ZShwZWVyKTtcblx0XHR9O1xuXHRcdHdpcmUub25lcnJvciA9IGZ1bmN0aW9uKGVycil7XG5cdFx0XHRyZWNvbm5lY3QocGVlcik7XG5cdFx0fTtcblx0
XHR3aXJlLm9ub3BlbiA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRvcHQubWVzaC5oaShwZWVyKTtcblx0XHR9XG5cdFx0d2lyZS5vbm1lc3NhZ2UgPSBmdW5jdGlv
bihtc2cpe1xuXHRcdFx0aWYoIW1zZyl7IHJldHVybiB9XG5cdFx0XHRvcHQubWVzaC5oZWFyKG1zZy5kYXRhIHx8IG1zZywgcGVlcik7XG5cdFx0fTtcblx0
XHRyZXR1cm4gd2lyZTtcblx0fWNhdGNoKGUpeyBvcHQubWVzaC5ieWUocGVlcikgfX1cblxuXHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ICFvcHQuc3VwZXIg
JiYgcm9vdC5vbignb3V0Jywge2RhbTonaGknfSkgfSwxKTsgLy8gaXQgY2FuIHRha2UgYSB3aGlsZSB0byBvcGVuIGEgc29ja2V0LCBzbyBtYXliZSBubyBs
b25nZXIgbGF6eSBsb2FkIGZvciBwZXJmIHJlYXNvbnM/XG5cblx0dmFyIHdhaXQgPSAyICogOTk5O1xuXHRmdW5jdGlvbiByZWNvbm5lY3QocGVlcil7XG5c
dFx0Y2xlYXJUaW1lb3V0KHBlZXIuZGVmZXIpO1xuXHRcdGlmKCFvcHQucGVlcnNbcGVlci51cmxdKXsgcmV0dXJuIH1cblx0XHRpZihkb2MgJiYgcGVlci5y
ZXRyeSA8PSAwKXsgcmV0dXJuIH1cblx0XHRwZWVyLnJldHJ5ID0gKHBlZXIucmV0cnkgfHwgb3B0LnJldHJ5KzEgfHwgNjApIC0gKCgtcGVlci50cmllZCAr
IChwZWVyLnRyaWVkID0gK25ldyBEYXRlKSA8IHdhaXQqNCk/MTowKTtcblx0XHRwZWVyLmRlZmVyID0gc2V0VGltZW91dChmdW5jdGlvbiB0bygpe1xuXHRc
dFx0aWYoZG9jICYmIGRvYy5oaWRkZW4peyByZXR1cm4gc2V0VGltZW91dCh0byx3YWl0KSB9XG5cdFx0XHRvcGVuKHBlZXIpO1xuXHRcdH0sIHdhaXQpO1xu
XHR9XG5cdHZhciBkb2MgPSAoJycrdSAhPT0gdHlwZW9mIGRvY3VtZW50KSAmJiBkb2N1bWVudDtcbn0pO1xudmFyIG5vb3AgPSBmdW5jdGlvbigpe30sIHU7
XG5cdFxufSgpKTsiLCJzcmMvbG9jYWxTdG9yYWdlLmpzIjoiOyhmdW5jdGlvbigpe1xuXG5pZih0eXBlb2YgR3VuID09PSAndW5kZWZpbmVkJyl7IHJldHVy
biB9XG5cbnZhciBub29wID0gZnVuY3Rpb24oKXt9LCBzdG9yZSwgdTtcbnRyeXtzdG9yZSA9IChHdW4ud2luZG93fHxub29wKS5sb2NhbFN0b3JhZ2V9Y2F0
Y2goZSl7fVxuaWYoIXN0b3JlKXtcblx0R3VuLmxvZyhcIldhcm5pbmc6IE5vIGxvY2FsU3RvcmFnZSBleGlzdHMgdG8gcGVyc2lzdCBkYXRhIHRvIVwiKTtc
blx0c3RvcmUgPSB7c2V0SXRlbTogZnVuY3Rpb24oayx2KXt0aGlzW2tdPXZ9LCByZW1vdmVJdGVtOiBmdW5jdGlvbihrKXtkZWxldGUgdGhpc1trXX0sIGdl
dEl0ZW06IGZ1bmN0aW9uKGspe3JldHVybiB0aGlzW2tdfX07XG59XG5cbnZhciBwYXJzZSA9IEpTT04ucGFyc2VBc3luYyB8fCBmdW5jdGlvbih0LGNiLHIp
eyB2YXIgdTsgdHJ5eyBjYih1LCBKU09OLnBhcnNlKHQscikpIH1jYXRjaChlKXsgY2IoZSkgfSB9XG52YXIganNvbiA9IEpTT04uc3RyaW5naWZ5QXN5bmMg
fHwgZnVuY3Rpb24odixjYixyLHMpeyB2YXIgdTsgdHJ5eyBjYih1LCBKU09OLnN0cmluZ2lmeSh2LHIscykpIH1jYXRjaChlKXsgY2IoZSkgfSB9XG5cbkd1
bi5vbignY3JlYXRlJywgZnVuY3Rpb24gbGcocm9vdCl7XG5cdHRoaXMudG8ubmV4dChyb290KTtcblx0dmFyIG9wdCA9IHJvb3Qub3B0LCBncmFwaCA9IHJv
b3QuZ3JhcGgsIGFja3MgPSBbXSwgZGlzaywgdG8sIHNpemUsIHN0b3A7XG5cdGlmKGZhbHNlID09PSBvcHQubG9jYWxTdG9yYWdlKXtcblx0XHQvLyBNZW1v
cnktb25seSBtb2RlOiBubyBkaXNrIHdyaXRlcyBidXQgc3RpbGwgYWNrIHB1dHMgc28gY2FsbGJhY2tzIGZpcmUuXG5cdFx0cm9vdC5vbigncHV0JywgZnVu
Y3Rpb24obXNnKXtcblx0XHRcdHRoaXMudG8ubmV4dChtc2cpO1xuXHRcdFx0aWYoIW1zZ1snQCddKXsgcm9vdC5vbignaW4nLCB7J0AnOiBtc2dbJyMnXSwg
b2s6IDF9KSB9XG5cdFx0fSk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdG9wdC5wcmVmaXggPSBvcHQuZmlsZSB8fCAnZ3VuLyc7XG5cdHRyeXsgZGlzayA9IGxn
W29wdC5wcmVmaXhdID0gbGdbb3B0LnByZWZpeF0gfHwgSlNPTi5wYXJzZShzaXplID0gc3RvcmUuZ2V0SXRlbShvcHQucHJlZml4KSkgfHwge307IC8vIFRP
RE86IFBlcmYhIFRoaXMgd2lsbCBibG9jaywgc2hvdWxkIHdlIGNhcmUsIHNpbmNlIGxpbWl0ZWQgdG8gNU1CIGFueXdheXM/XG5cdH1jYXRjaChlKXsgZGlz
ayA9IGxnW29wdC5wcmVmaXhdID0ge307IH1cblx0c2l6ZSA9IChzaXplfHwnJykubGVuZ3RoO1xuXG5cdHJvb3Qub24oJ2dldCcsIGZ1bmN0aW9uKG1zZyl7
XG5cdFx0dGhpcy50by5uZXh0KG1zZyk7XG5cdFx0dmFyIGxleCA9IG1zZy5nZXQsIHNvdWwsIGRhdGEsIHRtcCwgdTtcblx0XHRpZighbGV4IHx8ICEoc291
bCA9IGxleFsnIyddKSl7IHJldHVybiB9XG5cdFx0ZGF0YSA9IGRpc2tbc291bF0gfHwgdTtcblx0XHRpZihkYXRhICYmICh0bXAgPSBsZXhbJy4nXSkgJiYg
IU9iamVjdC5wbGFpbih0bXApKXsgLy8gcGx1Y2shXG5cdFx0XHRkYXRhID0gR3VuLnN0YXRlLmlmeSh7fSwgdG1wLCBHdW4uc3RhdGUuaXMoZGF0YSwgdG1w
KSwgZGF0YVt0bXBdLCBzb3VsKTtcblx0XHR9XG5cdFx0Ly9pZihkYXRhKXsgKHRtcCA9IHt9KVtzb3VsXSA9IGRhdGEgfSAvLyBiYWNrIGludG8gYSBncmFw
aC5cblx0XHQvL3NldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRHdW4ub24uZ2V0LmFjayhtc2csIGRhdGEpOyAvL3Jvb3Qub24oJ2luJywgeydAJzogbXNn
WycjJ10sIHB1dDogdG1wLCBsUzoxfSk7Ly8gfHwgcm9vdC4kfSk7XG5cdFx0Ly99LCBNYXRoLnJhbmRvbSgpICogMTApOyAvLyBGT1IgVEVTVElORyBQVVJQ
T1NFUyFcblx0fSk7XG5cblx0cm9vdC5vbigncHV0JywgZnVuY3Rpb24obXNnKXtcblx0XHR0aGlzLnRvLm5leHQobXNnKTsgLy8gcmVtZW1iZXIgdG8gY2Fs
bCBuZXh0IG1pZGRsZXdhcmUgYWRhcHRlclxuXHRcdHZhciBwdXQgPSBtc2cucHV0LCBzb3VsID0gcHV0WycjJ10sIGtleSA9IHB1dFsnLiddLCBpZCA9IG1z
Z1snIyddLCBvayA9IG1zZy5va3x8JycsIHRtcDsgLy8gcHVsbCBkYXRhIG9mZiB3aXJlIGVudmVsb3BlXG5cdFx0ZGlza1tzb3VsXSA9IEd1bi5zdGF0ZS5p
ZnkoZGlza1tzb3VsXSwga2V5LCBwdXRbJz4nXSwgcHV0Wyc6J10sIHNvdWwpOyAvLyBtZXJnZSBpbnRvIGRpc2sgb2JqZWN0XG5cdFx0aWYoc3RvcCAmJiBz
aXplID4gKDQ5OTk4ODApKXsgcm9vdC5vbignaW4nLCB7J0AnOiBpZCwgZXJyOiBcImxvY2FsU3RvcmFnZSBtYXghXCJ9KTsgcmV0dXJuOyB9XG5cdFx0Ly9p
ZighbXNnWydAJ10peyBhY2tzLnB1c2goaWQpIH0gLy8gdGhlbiBhY2sgYW55IG5vbi1hY2sgd3JpdGUuIC8vIFRPRE86IHVzZSBiYXRjaCBpZC5cblx0XHRp
ZighbXNnWydAJ10gJiYgKCFtc2cuXy52aWEgfHwgTWF0aC5yYW5kb20oKSA8IChva1snQCddIC8gb2tbJy8nXSkpKXsgYWNrcy5wdXNoKGlkKSB9IC8vIHRo
ZW4gYWNrIGFueSBub24tYWNrIHdyaXRlLiAvLyBUT0RPOiB1c2UgYmF0Y2ggaWQuXG5cdFx0aWYodG8peyByZXR1cm4gfVxuXHRcdHRvID0gc2V0VGltZW91
dChmbHVzaCwgOSsoc2l6ZSAvIDMzMykpOyAvLyAwLjFNQiA9IDAuM3MsIDVNQiA9IDE1cyBcblx0fSk7XG5cdGZ1bmN0aW9uIGZsdXNoKCl7XG5cdFx0aWYo
IWFja3MubGVuZ3RoICYmICgoc2V0VGltZW91dC50dXJufHwnJykuc3x8JycpLmxlbmd0aCl7IHNldFRpbWVvdXQoZmx1c2gsOTkpOyByZXR1cm47IH0gLy8g
ZGVmZXIgaWYgXCJidXN5XCIgJiYgbm8gc2F2ZXMuXG5cdFx0dmFyIGVyciwgYWNrID0gYWNrczsgY2xlYXJUaW1lb3V0KHRvKTsgdG8gPSBmYWxzZTsgYWNr
cyA9IFtdO1xuXHRcdGpzb24oZGlzaywgZnVuY3Rpb24oZXJyLCB0bXApe1xuXHRcdFx0dHJ5eyFlcnIgJiYgc3RvcmUuc2V0SXRlbShvcHQucHJlZml4LCB0
bXApO1xuXHRcdFx0fWNhdGNoKGUpeyBlcnIgPSBzdG9wID0gZSB8fCBcImxvY2FsU3RvcmFnZSBmYWlsdXJlXCIgfVxuXHRcdFx0aWYoZXJyKXtcblx0XHRc
dFx0R3VuLmxvZyhlcnIgKyBcIiBDb25zaWRlciB1c2luZyBHVU4ncyBJbmRleGVkREIgcGx1Z2luIGZvciBSQUQgZm9yIG1vcmUgc3RvcmFnZSBzcGFjZSwg
aHR0cHM6Ly9ndW4uZWNvL2RvY3MvUkFEI2luc3RhbGxcIik7XG5cdFx0XHRcdHJvb3Qub24oJ2xvY2FsU3RvcmFnZTplcnJvcicsIHtlcnI6IGVyciwgZ2V0
OiBvcHQucHJlZml4LCBwdXQ6IGRpc2t9KTtcblx0XHRcdH1cblx0XHRcdHNpemUgPSB0bXAubGVuZ3RoO1xuXG5cdFx0XHQvL2lmKCFlcnIgJiYgIU9iamVj
dC5lbXB0eShvcHQucGVlcnMpKXsgcmV0dXJuIH0gLy8gb25seSBhY2sgaWYgdGhlcmUgYXJlIG5vIHBlZXJzLiAvLyBTd2l0Y2ggdGhpcyB0byBwcm9iYWJp
bGlzdGljIG1vZGVcblx0XHRcdHNldFRpbWVvdXQuZWFjaChhY2ssIGZ1bmN0aW9uKGlkKXtcblx0XHRcdFx0cm9vdC5vbignaW4nLCB7J0AnOiBpZCwgZXJy
OiBlcnIsIG9rOiAwfSk7IC8vIGxvY2FsU3RvcmFnZSBpc24ndCByZWxpYWJsZSwgc28gbWFrZSBpdHMgYG9rYCBjb2RlIGJlIGEgbG93IG51bWJlci5cblx0
XHRcdH0sMCw5OSk7XG5cdFx0fSlcblx0fVxuXG59KTtcblx0XG59KCkpOyJ9fQ==
UNBUILD-SNAPSHOT-END */
