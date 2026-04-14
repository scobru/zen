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
ICB2YXIgTU9EVUxFID0gTU9EXG4gIGV4cG9ydCBkZWZhdWx0IE1PRC5leHBvcnRzO1xuICBcbiIsInNyYy9ndW4vc2hpbS5qcyI6IjsoZnVuY3Rpb24oKXtc
blxuLy8gU2hpbSBmb3IgZ2VuZXJpYyBqYXZhc2NyaXB0IHV0aWxpdGllcy5cblN0cmluZy5yYW5kb20gPSBmdW5jdGlvbihsLCBjKXtcblx0dmFyIHMgPSAn
Jztcblx0bCA9IGwgfHwgMjQ7IC8vIHlvdSBhcmUgbm90IGdvaW5nIHRvIG1ha2UgYSAwIGxlbmd0aCByYW5kb20gbnVtYmVyLCBzbyBubyBuZWVkIHRvIGNo
ZWNrIHR5cGVcblx0YyA9IGMgfHwgJzAxMjM0NTY3ODlBQkNERUZHSElKS0xNTk9QUVJTVFVWV1haYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonO1xuXHR3
aGlsZShsLS0gPiAwKXsgcyArPSBjLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjLmxlbmd0aCkpIH1cblx0cmV0dXJuIHM7XG59XG5TdHJp
bmcubWF0Y2ggPSBmdW5jdGlvbih0LCBvKXsgdmFyIHRtcCwgdTtcblx0aWYoJ3N0cmluZycgIT09IHR5cGVvZiB0KXsgcmV0dXJuIGZhbHNlIH1cblx0aWYo
J3N0cmluZycgPT0gdHlwZW9mIG8peyBvID0geyc9Jzogb30gfVxuXHRvID0gbyB8fCB7fTtcblx0dG1wID0gKG9bJz0nXSB8fCBvWycqJ10gfHwgb1snPidd
IHx8IG9bJzwnXSk7XG5cdGlmKHQgPT09IHRtcCl7IHJldHVybiB0cnVlIH1cblx0aWYodSAhPT0gb1snPSddKXsgcmV0dXJuIGZhbHNlIH1cblx0dG1wID0g
KG9bJyonXSB8fCBvWyc+J10pO1xuXHRpZih0LnNsaWNlKDAsICh0bXB8fCcnKS5sZW5ndGgpID09PSB0bXApeyByZXR1cm4gdHJ1ZSB9XG5cdGlmKHUgIT09
IG9bJyonXSl7IHJldHVybiBmYWxzZSB9XG5cdGlmKHUgIT09IG9bJz4nXSAmJiB1ICE9PSBvWyc8J10pe1xuXHRcdHJldHVybiAodCA+PSBvWyc+J10gJiYg
dCA8PSBvWyc8J10pPyB0cnVlIDogZmFsc2U7XG5cdH1cblx0aWYodSAhPT0gb1snPiddICYmIHQgPj0gb1snPiddKXsgcmV0dXJuIHRydWUgfVxuXHRpZih1
ICE9PSBvWyc8J10gJiYgdCA8PSBvWyc8J10peyByZXR1cm4gdHJ1ZSB9XG5cdHJldHVybiBmYWxzZTtcbn1cblN0cmluZy5oYXNoID0gZnVuY3Rpb24ocywg
Yyl7IC8vIHZpYSBTT1xuXHRpZih0eXBlb2YgcyAhPT0gJ3N0cmluZycpeyByZXR1cm4gfVxuXHQgICAgYyA9IGMgfHwgMDsgLy8gQ1BVIHNjaGVkdWxlIGhh
c2hpbmcgYnlcblx0ICAgIGlmKCFzLmxlbmd0aCl7IHJldHVybiBjIH1cblx0ICAgIGZvcih2YXIgaT0wLGw9cy5sZW5ndGgsbjsgaTxsOyArK2kpe1xuXHQg
ICAgICBuID0gcy5jaGFyQ29kZUF0KGkpO1xuXHQgICAgICBjID0gKChjPDw1KS1jKStuO1xuXHQgICAgICBjIHw9IDA7XG5cdCAgICB9XG5cdCAgICByZXR1
cm4gYztcblx0ICB9XG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbk9iamVjdC5wbGFpbiA9IGZ1bmN0aW9uKG8peyByZXR1
cm4gbz8gKG8gaW5zdGFuY2VvZiBPYmplY3QgJiYgby5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwo
bykubWF0Y2goL15cXFtvYmplY3QgKFxcdyspXFxdJC8pWzFdID09PSAnT2JqZWN0JyA6IGZhbHNlIH1cbk9iamVjdC5lbXB0eSA9IGZ1bmN0aW9uKG8sIG4p
e1xuXHRmb3IodmFyIGsgaW4gbyl7IGlmKGhhcy5jYWxsKG8sIGspICYmICghbiB8fCAtMT09bi5pbmRleE9mKGspKSl7IHJldHVybiBmYWxzZSB9IH1cblx0
cmV0dXJuIHRydWU7XG59XG5PYmplY3Qua2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uKG8pe1xuXHR2YXIgbCA9IFtdO1xuXHRmb3IodmFyIGsgaW4g
byl7IGlmKGhhcy5jYWxsKG8sIGspKXsgbC5wdXNoKGspIH0gfVxuXHRyZXR1cm4gbDtcbn1cbjsoZnVuY3Rpb24oKXtcblx0dmFyIHUsIHNUID0gc2V0VGlt
ZW91dCwgbCA9IDAsIGMgPSAwLCBhY3RpdmUgPSAwXG5cdCwgc0kgPSAodHlwZW9mIHNldEltbWVkaWF0ZSAhPT0gJycrdSAmJiBzZXRJbW1lZGlhdGUpIHx8
IChmdW5jdGlvbihjLGYpe1xuXHRcdGlmKHR5cGVvZiBNZXNzYWdlQ2hhbm5lbCA9PSAnJyt1KXsgcmV0dXJuIHNUIH1cblx0XHQoYyA9IG5ldyBNZXNzYWdl
Q2hhbm5lbCgpKS5wb3J0MS5vbm1lc3NhZ2UgPSBmdW5jdGlvbihlKXsgJyc9PWUuZGF0YSAmJiBmKCkgfVxuXHRcdHJldHVybiBmdW5jdGlvbihxKXsgZj1x
O2MucG9ydDIucG9zdE1lc3NhZ2UoJycpIH1cblx0fSgpKSwgY2hlY2sgPSBzVC5jaGVjayA9IHNULmNoZWNrIHx8ICh0eXBlb2YgcGVyZm9ybWFuY2UgIT09
ICcnK3UgJiYgcGVyZm9ybWFuY2UpXG5cdHx8IHtub3c6IGZ1bmN0aW9uKCl7IHJldHVybiArbmV3IERhdGUgfX07XG5cdHNULmhvbGQgPSBzVC5ob2xkIHx8
IDk7IC8vIGhhbGYgYSBmcmFtZSBiZW5jaG1hcmtzIGZhc3RlciB0aGFuIDwgMW1zP1xuXHRzVC5wb2xsID0gc1QucG9sbCB8fCBmdW5jdGlvbihmKXtcblx0
XHRpZihhY3RpdmUpe1xuXHRcdFx0c0koZnVuY3Rpb24oKXsgbCA9IGNoZWNrLm5vdygpOyBhY3RpdmUgPSAxOyB0cnl7IGYoKSB9IGZpbmFsbHkgeyBhY3Rp
dmUgPSAwIH0gfSwgYz0wKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYoKHNULmhvbGQgPj0gKGNoZWNrLm5vdygpIC0gbCkpICYmIGMrKyA8IDMz
MzMpe1xuXHRcdFx0YWN0aXZlID0gMTtcblx0XHRcdHRyeXsgZigpIH0gZmluYWxseSB7IGFjdGl2ZSA9IDAgfVxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0
XHRzSShmdW5jdGlvbigpeyBsID0gY2hlY2subm93KCk7IGFjdGl2ZSA9IDE7IHRyeXsgZigpIH0gZmluYWxseSB7IGFjdGl2ZSA9IDAgfSB9LGM9MClcblx0
fVxufSgpKTtcbjsoZnVuY3Rpb24oKXsgLy8gVG9vIG1hbnkgcG9sbHMgYmxvY2ssIHRoaXMgXCJ0aHJlYWRzXCIgdGhlbSBpbiB0dXJucyBvdmVyIGEgc2lu
Z2xlIHRocmVhZCBpbiB0aW1lLlxuXHR2YXIgc1QgPSBzZXRUaW1lb3V0LCB0ID0gc1QudHVybiA9IHNULnR1cm4gfHwgZnVuY3Rpb24oZil7IDEgPT0gcy5w
dXNoKGYpICYmIHAoVCkgfVxuXHQsIHMgPSB0LnMgPSBbXSwgcCA9IHNULnBvbGwsIGkgPSAwLCBmLCBUID0gZnVuY3Rpb24oKXtcblx0XHRpZihmID0gc1tp
KytdKXsgZigpIH1cblx0XHRpZihpID09IHMubGVuZ3RoIHx8IDk5ID09IGkpe1xuXHRcdFx0cyA9IHQucyA9IHMuc2xpY2UoaSk7XG5cdFx0XHRpID0gMDtc
blx0XHR9XG5cdFx0aWYocy5sZW5ndGgpeyBwKFQpIH1cblx0fVxufSgpKTtcbjsoZnVuY3Rpb24oKXtcblx0dmFyIHUsIHNUID0gc2V0VGltZW91dCwgVCA9
IHNULnR1cm47XG5cdChzVC5lYWNoID0gc1QuZWFjaCB8fCBmdW5jdGlvbihsLGYsZSxTKXsgUyA9IFMgfHwgOTsgKGZ1bmN0aW9uIHQocyxMLHIpe1xuXHQg
IGlmKEwgPSAocyA9IChsfHxbXSkuc3BsaWNlKDAsUykpLmxlbmd0aCl7XG5cdCAgXHRmb3IodmFyIGkgPSAwOyBpIDwgTDsgaSsrKXtcblx0ICBcdFx0aWYo
dSAhPT0gKHIgPSBmKHNbaV0pKSl7IGJyZWFrIH1cblx0ICBcdH1cblx0ICBcdGlmKHUgPT09IHIpeyBUKHQpOyByZXR1cm4gfVxuXHQgIH0gZSAmJiBlKHIp
O1xuXHR9KCkpfSkoKTtcbn0oKSk7XG5cdFxufSgpKTtcbiIsInNyYy9ndW4vb250by5qcyI6ImxldCBfX2RlZmF1bHRFeHBvcnQ7XG4oZnVuY3Rpb24oKXtc
blxuLy8gT24gZXZlbnQgZW1pdHRlciBnZW5lcmljIGphdmFzY3JpcHQgdXRpbGl0eS5cbl9fZGVmYXVsdEV4cG9ydCA9IGZ1bmN0aW9uIG9udG8odGFnLCBh
cmcsIGFzKXtcblx0aWYoIXRhZyl7IHJldHVybiB7dG86IG9udG99IH1cblx0dmFyIHUsIGYgPSAnZnVuY3Rpb24nID09IHR5cGVvZiBhcmcsIHRhZyA9ICh0
aGlzLnRhZyB8fCAodGhpcy50YWcgPSB7fSkpW3RhZ10gfHwgZiAmJiAoXG5cdFx0dGhpcy50YWdbdGFnXSA9IHt0YWc6IHRhZywgdG86IG9udG8uXyA9IHsg
bmV4dDogZnVuY3Rpb24oYXJnKXsgdmFyIHRtcDtcblx0XHRcdGlmKHRtcCA9IHRoaXMudG8peyB0bXAubmV4dChhcmcpIH1cblx0fX19KTtcblx0aWYoZil7
XG5cdFx0dmFyIGJlID0ge1xuXHRcdFx0b2ZmOiBvbnRvLm9mZiB8fFxuXHRcdFx0KG9udG8ub2ZmID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYodGhpcy5u
ZXh0ID09PSBvbnRvLl8ubmV4dCl7IHJldHVybiAhMCB9XG5cdFx0XHRcdGlmKHRoaXMgPT09IHRoaXMudGhlLmxhc3Qpe1xuXHRcdFx0XHRcdHRoaXMudGhl
Lmxhc3QgPSB0aGlzLmJhY2s7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy50by5iYWNrID0gdGhpcy5iYWNrO1xuXHRcdFx0XHR0aGlzLm5leHQgPSBvbnRv
Ll8ubmV4dDtcblx0XHRcdFx0dGhpcy5iYWNrLnRvID0gdGhpcy50bztcblx0XHRcdFx0aWYodGhpcy50aGUubGFzdCA9PT0gdGhpcy50aGUpe1xuXHRcdFx0
XHRcdGRlbGV0ZSB0aGlzLm9uLnRhZ1t0aGlzLnRoZS50YWddO1xuXHRcdFx0XHR9XG5cdFx0XHR9KSxcblx0XHRcdHRvOiBvbnRvLl8sXG5cdFx0XHRuZXh0
OiBhcmcsXG5cdFx0XHR0aGU6IHRhZyxcblx0XHRcdG9uOiB0aGlzLFxuXHRcdFx0YXM6IGFzLFxuXHRcdH07XG5cdFx0KGJlLmJhY2sgPSB0YWcubGFzdCB8
fCB0YWcpLnRvID0gYmU7XG5cdFx0cmV0dXJuIHRhZy5sYXN0ID0gYmU7XG5cdH1cblx0aWYoKHRhZyA9IHRhZy50bykgJiYgdSAhPT0gYXJnKXsgdGFnLm5l
eHQoYXJnKSB9XG5cdHJldHVybiB0YWc7XG59O1xuXHRcbn0oKSk7XG5leHBvcnQgZGVmYXVsdCBfX2RlZmF1bHRFeHBvcnQ7Iiwic3JjL2d1bi9ib29rLmpz
IjoibGV0IF9fZGVmYXVsdEV4cG9ydDtcbihmdW5jdGlvbigpe1xuXG4vLyBUT0RPOiBCVUchIFVuYnVpbGQgd2lsbCBtYWtlIHRoZXNlIGdsb2JhbHMuLi4g
Q0hBTkdFIHVuYnVpbGQgdG8gd3JhcCBmaWxlcyBpbiBhIGZ1bmN0aW9uLlxuLy8gQm9vayBpcyBhIHJlcGxhY2VtZW50IGZvciBKUyBvYmplY3RzLCBtYXBz
LCBkaWN0aW9uYXJpZXMuXG52YXIgc1QgPSBzZXRUaW1lb3V0LCBCID0gc1QuQm9vayB8fCAoc1QuQm9vayA9IGZ1bmN0aW9uKHRleHQpe1xuXHR2YXIgYiA9
IGZ1bmN0aW9uIGJvb2sod29yZCwgaXMpe1xuXHRcdHZhciBoYXMgPSBiLmFsbFt3b3JkXSwgcDtcblx0XHRpZihpcyA9PT0gdW5kZWZpbmVkKXsgcmV0dXJu
IChoYXMgJiYgaGFzLmlzKSB8fCBiLmdldChoYXMgfHwgd29yZCkgfVxuXHRcdGlmKGhhcyl7XG5cdFx0XHRpZihwID0gaGFzLnBhZ2Upe1xuXHRcdFx0XHRw
LnNpemUgKz0gc2l6ZShpcykgLSBzaXplKGhhcy5pcyk7XG5cdFx0XHRcdHAudGV4dCA9ICcnO1xuXHRcdFx0fVxuXHRcdFx0aGFzLnRleHQgPSAnJztcblx0
XHRcdGhhcy5pcyA9IGlzO1xuXHRcdFx0cmV0dXJuIGI7XG5cdFx0fVxuXHRcdC8vYi5hbGxbd29yZF0gPSB7aXM6IHdvcmR9OyByZXR1cm4gYjtcblx0XHRy
ZXR1cm4gYi5zZXQod29yZCwgaXMpO1xuXHR9O1xuXHQvLyBUT0RPOiBpZiBmcm9tIHRleHQsIHByZXNlcnZlIHRoZSBzZXBhcmF0b3Igc3ltYm9sLlxuXHRi
Lmxpc3QgPSBbe2Zyb206IHRleHQsIHNpemU6ICh0ZXh0fHwnJykubGVuZ3RoLCBzdWJzdHJpbmc6IHN1YiwgdG9TdHJpbmc6IHRvLCBib29rOiBiLCBnZXQ6
IGIsIHJlYWQ6IGxpc3R9XTtcblx0Yi5wYWdlID0gcGFnZTtcblx0Yi5zZXQgPSBzZXQ7XG5cdGIuZ2V0ID0gZ2V0O1xuXHRiLmFsbCA9IHt9O1xuXHRyZXR1
cm4gYjtcbn0pLCBQQUdFID0gMioqMTI7XG5cbmZ1bmN0aW9uIHBhZ2Uod29yZCl7XG5cdHZhciBiID0gdGhpcywgbCA9IGIubGlzdCwgaSA9IHNwb3Qod29y
ZCwgbCwgYi5wYXJzZSksIHAgPSBsW2ldO1xuXHRpZignc3RyaW5nJyA9PSB0eXBlb2YgcCl7IGxbaV0gPSBwID0ge3NpemU6IC0xLCBmaXJzdDogYi5wYXJz
ZT8gYi5wYXJzZShwKSA6IHAsIHN1YnN0cmluZzogc3ViLCB0b1N0cmluZzogdG8sIGJvb2s6IGIsIGdldDogYiwgcmVhZDogbGlzdH0gfSAvLyBUT0RPOiB0
ZXN0LCBob3cgZG8gd2UgYXJyaXZlIGF0IHRoaXMgY29uZGl0aW9uIGFnYWluP1xuXHQvL3AuaSA9IGk7XG5cdHJldHVybiBwO1xuXHQvLyBUT0RPOiBCVUch
IFdoYXQgaWYgd2UgZ2V0IHRoZSBwYWdlLCBpdCB0dXJucyBvdXQgdG8gYmUgdG9vIGJpZyAmIHNwbGl0LCB3ZSBtdXN0IHRoZW4gUkUgZ2V0IHRoZSBwYWdl
IVxufVxuZnVuY3Rpb24gZ2V0KHdvcmQpe1xuXHRpZighd29yZCl7IHJldHVybiB9XG5cdGlmKHVuZGVmaW5lZCAhPT0gd29yZC5pcyl7IHJldHVybiB3b3Jk
LmlzIH0gLy8gSlMgZmFsc2V5IHZhbHVlcyFcblx0dmFyIGIgPSB0aGlzLCBoYXMgPSBiLmFsbFt3b3JkXTtcblx0aWYoaGFzKXsgcmV0dXJuIGhhcy5pcyB9
XG5cdC8vIGdldCBkb2VzIGFuIGV4YWN0IG1hdGNoLCBzbyB3ZSB3b3VsZCBoYXZlIGZvdW5kIGl0IGFscmVhZHksIHVubGVzcyBwYXJzZWxlc3MgcGFnZTpc
blx0dmFyIHBhZ2UgPSBiLnBhZ2Uod29yZCksIGwsIGhhcywgYSwgaTtcblx0aWYoIXBhZ2UgfHwgIXBhZ2UuZnJvbSl7IHJldHVybiB9IC8vIG5vIHBhcnNl
bGVzcyBkYXRhXG5cdHJldHVybiBnb3Qod29yZCwgcGFnZSk7XG59XG5mdW5jdGlvbiBnb3Qod29yZCwgcGFnZSl7XG5cdHZhciBiID0gcGFnZS5ib29rLCBs
LCBoYXMsIGEsIGk7XG5cdGlmKGwgPSBmcm9tKHBhZ2UpKXsgaGFzID0gbFtnb3QuaSA9IGkgPSBzcG90KHdvcmQsIGwsIEIuZGVjb2RlKV07IH0gLy8gVE9E
TzogUE9URU5USUFMIEJVRyEgVGhpcyBhc3N1bWVzIHRoYXQgZWFjaCB3b3JkIG9uIGEgcGFnZSB1c2VzIHRoZSBzYW1lIHNlcmlhbGl6ZXIvZm9ybWF0dGVy
L3N0cnVjdHVyZS4gLy8gVE9PRDogQlVHISEhIE5vdCBhY3R1YWxseSwgYnV0IGlmIHdlIHdhbnQgdG8gZG8gbm9uLWV4YWN0IHJhZGl4LWxpa2UgY2xvc2Vz
dC13b3JkIGxvb2t1cHMgb24gYSBwYWdlLCB3ZSBuZWVkIHRvIGNoZWNrIGxpbWJvICYgcG90ZW50aWFsbHkgc29ydCBmaXJzdC5cblx0Ly8gcGFyc2VsZXNz
IG1heSByZXR1cm4gLTEgZnJvbSBhY3R1YWwgdmFsdWUsIHNvIHdlIG1heSBuZWVkIHRvIHRlc3QgYm90aC4gLy8gVE9ETzogRG91YmxlIGNoZWNrPyBJIHRo
aW5rIHRoaXMgaXMgY29ycmVjdC5cblx0aWYoaGFzICYmIHdvcmQgPT0gaGFzLndvcmQpeyByZXR1cm4gKGIuYWxsW3dvcmRdID0gaGFzKS5pcyB9XG5cdGlm
KCdzdHJpbmcnICE9IHR5cGVvZiBoYXMpeyBoYXMgPSBsW2dvdC5pID0gaSs9MV0gfVxuXHRpZihoYXMgJiYgd29yZCA9PSBoYXMud29yZCl7IHJldHVybiAo
Yi5hbGxbd29yZF0gPSBoYXMpLmlzIH1cblx0YSA9IHNsb3QoaGFzKSAvLyBFc2NhcGUhXG5cdGlmKHdvcmQgIT0gQi5kZWNvZGUoYVswXSkpe1xuXHRcdGhh
cyA9IGxbZ290LmkgPSBpKz0xXTsgLy8gZWRnZSBjYXNlIGJ1Zz9cblx0XHRhID0gc2xvdChoYXMpOyAvLyBlZGdlIGNhc2UgYnVnP1xuXHRcdGlmKHdvcmQg
IT0gQi5kZWNvZGUoYVswXSkpeyByZXR1cm4gfVxuXHR9XG5cdGhhcyA9IGxbaV0gPSBiLmFsbFt3b3JkXSA9IHt3b3JkOiAnJyt3b3JkLCBpczogQi5kZWNv
ZGUoYVsxXSksIHBhZ2U6IHBhZ2UsIHN1YnN0cmluZzogc3VidCwgdG9TdHJpbmc6IHRvdH07IC8vIFRPRE86IGNvbnZlcnQgdG8gYSBKUyB2YWx1ZSEhISBN
YXliZSBpbmRleCEgVE9ETzogQlVHIHdvcmQgbmVlZHMgYSBwYWdlISEhISBUT0RPOiBDaGVjayBmb3Igb3RoZXIgdHlwZXMhISFcblx0cmV0dXJuIGhhcy5p
cztcbn1cblxuZnVuY3Rpb24gc3BvdCh3b3JkLCBzb3J0ZWQsIHBhcnNlKXsgcGFyc2UgPSBwYXJzZSB8fCBzcG90Lm5vIHx8IChzcG90Lm5vID0gZnVuY3Rp
b24odCl7IHJldHVybiB0IH0pOyAvLyBUT0RPOiBCVUc/Pz8/IFdoeSBpcyB0aGVyZSBzdWJzdHJpbmcoKXx8MCA/IC8vIFRPRE86IFBFUkYhISEgLnRvU3Ry
aW5nKCkgaXMgKzMzJSBmYXN0ZXIsIGNhbiB3ZSBjb21iaW5lIGl0IHdpdGggdGhlIGV4cG9ydD9cblx0dmFyIEwgPSBzb3J0ZWQsIG1pbiA9IDAsIHBhZ2Us
IGZvdW5kLCBsID0gKHdvcmQ9Jycrd29yZCkubGVuZ3RoLCBtYXggPSBMLmxlbmd0aCwgaSA9IG1heC8yO1xuXHR3aGlsZSgoKHdvcmQgPCAocGFnZSA9IChw
YXJzZShMW2k9aT4+MF0pfHwnJykuc3Vic3RyaW5nKCkpKSB8fCAoKHBhcnNlKExbaSsxXSl8fCcnKS5zdWJzdHJpbmcoKSA8PSB3b3JkKSkgJiYgaSAhPSBt
aW4peyAvLyBMW2ldIDw9IHdvcmQgPCBMW2krMV1cblx0XHRpICs9IChwYWdlIDw9IHdvcmQpPyAobWF4IC0gKG1pbiA9IGkpKS8yIDogLSgobWF4ID0gaSkg
LSBtaW4pLzI7XG5cdH1cblx0cmV0dXJuIGk7XG59XG5cbmZ1bmN0aW9uIGZyb20oYSwgdCwgbCl7XG5cdGlmKCdzdHJpbmcnICE9IHR5cGVvZiBhLmZyb20p
eyByZXR1cm4gYS5mcm9tIH1cblx0Ly8obCA9IGEuZnJvbSA9ICh0ID0gYS5mcm9tfHwnJykuc3Vic3RyaW5nKDEsIHQubGVuZ3RoLTEpLnNwbGl0KHRbMF0p
KTsgLy8gc2xvdFxuXHQobCA9IGEuZnJvbSA9IHNsb3QodCA9IHR8fGEuZnJvbXx8JycpKTtcblx0cmV0dXJuIGw7XG59XG5mdW5jdGlvbiBsaXN0KGVhY2gp
eyBlYWNoID0gZWFjaCB8fCBmdW5jdGlvbih4KXtyZXR1cm4geH0gXG5cdHZhciBpID0gMCwgbCA9IHNvcnQodGhpcyksIHcsIHIgPSBbXSwgcCA9IHRoaXMu
Ym9vay5wYXJzZSB8fCBmdW5jdGlvbigpe307XG5cdC8vd2hpbGUodyA9IGxbaSsrXSl7IHIucHVzaChlYWNoKHNsb3QodylbMV0sIHAodyl8fHcsIHRoaXMp
KSB9XG5cdHdoaWxlKHcgPSBsW2krK10peyByLnB1c2goZWFjaCh0aGlzLmdldCh3ID0gdy53b3JkfHxwKHcpfHx3KSwgdywgdGhpcykpIH0gLy8gVE9ETzog
QlVHISBQRVJGP1xuXHRyZXR1cm4gcjtcbn1cblxuZnVuY3Rpb24gc2V0KHdvcmQsIGlzKXtcblx0Ly8gVE9ETzogUGVyZiBvbiByYW5kb20gd3JpdGUgaXMg
ZGVjZW50LCBidXQgc2hvcnQga2V5cyBvciBzZXEgc2VlbXMgc2lnbmlmaWNhbnRseSBzbG93ZXIuXG5cdHZhciBiID0gdGhpcywgaGFzID0gYi5hbGxbd29y
ZF07XG5cdGlmKGhhcyl7IHJldHVybiBiKHdvcmQsIGlzKSB9IC8vIHVwZGF0ZXMgdG8gaW4tbWVtb3J5IGl0ZW1zIHdpbGwgYWx3YXlzIG1hdGNoIGV4YWN0
bHkuXG5cdHZhciBwYWdlID0gYi5wYWdlKHdvcmQ9Jycrd29yZCksIHRtcDsgLy8gYmVmb3JlIHdlIGFzc3VtZSB0aGlzIGlzIGFuIGluc2VydCB0aG8sIHdl
IG5lZWQgdG8gY2hlY2tcblx0aWYocGFnZSAmJiBwYWdlLmZyb20peyAvLyBpZiBpdCBjb3VsZCBiZSBhbiB1cGRhdGUgdG8gYW4gZXhpc3Rpbmcgd29yZCBm
cm9tIHBhcnNlbGVzcy5cblx0XHRiLmdldCh3b3JkKTtcblx0XHRpZihiLmFsbFt3b3JkXSl7IHJldHVybiBiKHdvcmQsIGlzKSB9XG5cdH1cblx0Ly8gTVVT
VCBiZSBhbiBpbnNlcnQ6XG5cdGhhcyA9IGIuYWxsW3dvcmRdID0ge3dvcmQ6IHdvcmQsIGlzOiBpcywgcGFnZTogcGFnZSwgc3Vic3RyaW5nOiBzdWJ0LCB0
b1N0cmluZzogdG90fTtcblx0cGFnZS5maXJzdCA9IChwYWdlLmZpcnN0IDwgd29yZCk/IHBhZ2UuZmlyc3QgOiB3b3JkO1xuXHRpZighcGFnZS5saW1ibyl7
IChwYWdlLmxpbWJvID0gW10pIH1cblx0cGFnZS5saW1iby5wdXNoKGhhcyk7XG5cdGIod29yZCwgaXMpO1xuXHRwYWdlLnNpemUgKz0gc2l6ZSh3b3JkKSAr
IHNpemUoaXMpO1xuXHRpZigoYi5QQUdFIHx8IFBBR0UpIDwgcGFnZS5zaXplKXsgc3BsaXQocGFnZSwgYikgfVxuXHRyZXR1cm4gYjtcbn1cblxuZnVuY3Rp
b24gc3BsaXQocCwgYil7IC8vIFRPRE86IHVzZSBjbG9zZXN0IGhhc2ggaW5zdGVhZCBvZiBoYWxmLlxuXHQvL2NvbnNvbGUudGltZSgpO1xuXHQvL3ZhciBT
ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cdHZhciBMID0gc29ydChwKSwgbCA9IEwubGVuZ3RoLCBpID0gbC8yID4+IDAsIGogPSBpLCBoYWxmID0gTFtqXSwg
dG1wO1xuXHQvL2NvbnNvbGUudGltZUVuZCgpO1xuXHR2YXIgbmV4dCA9IHtmaXJzdDogaGFsZi5zdWJzdHJpbmcoKSwgc2l6ZTogMCwgc3Vic3RyaW5nOiBz
dWIsIHRvU3RyaW5nOiB0bywgYm9vazogYiwgZ2V0OiBiLCByZWFkOiBsaXN0fSwgZiA9IG5leHQuZnJvbSA9IFtdO1xuXHR3aGlsZSh0bXAgPSBMW2krK10p
e1xuXHRcdGYucHVzaCh0bXApO1xuXHRcdG5leHQuc2l6ZSArPSAodG1wLmlzfHwnJykubGVuZ3RofHwxO1xuXHRcdHRtcC5wYWdlID0gbmV4dDtcblx0fVxu
XHRwLmZyb20gPSBwLmZyb20uc2xpY2UoMCwgaik7XG5cdHAuc2l6ZSAtPSBuZXh0LnNpemU7XG5cdGIubGlzdC5zcGxpY2Uoc3BvdChuZXh0LmZpcnN0LCBi
Lmxpc3QpKzEsIDAsIG5leHQpOyAvLyBUT0RPOiBCVUchIE1ha2Ugc3VyZSBuZXh0LmZpcnN0IGlzIGRlY29kZWQgdGV4dC4gLy8gVE9ETzogQlVHISBzcG90
IG1heSBuZWVkIHBhcnNlIHRvbz9cblx0Ly9jb25zb2xlLnRpbWVFbmQoKTtcblx0aWYoYi5zcGxpdCl7IGIuc3BsaXQobmV4dCwgcCkgfVxuXHQvL2NvbnNv
bGUubG9nKFMgPSAocGVyZm9ybWFuY2Uubm93KCkgLSBTKSwgJ3NwbGl0Jyk7XG5cdC8vY29uc29sZS5CSUcgPSBjb25zb2xlLkJJRyA+IFM/IGNvbnNvbGUu
QklHIDogUztcbn1cblxuZnVuY3Rpb24gc2xvdCh0KXsgcmV0dXJuIGhlYWwoKHQ9dHx8JycpLnN1YnN0cmluZygxLCB0Lmxlbmd0aC0xKS5zcGxpdCh0WzBd
KSwgdFswXSkgfSBCLnNsb3QgPSBzbG90OyAvLyBUT0RPOiBjaGVjayBmaXJzdD1sYXN0ICYgcGFzcyBgc2AuXG5mdW5jdGlvbiBoZWFsKGwsIHMpeyB2YXIg
aSwgZTtcblx0aWYoMCA+IChpID0gbC5pbmRleE9mKCcnKSkpeyByZXR1cm4gbCB9IC8vIH43MDBNIG9wcy9zZWMgb24gNEtCIG9mIE1hdGgucmFuZG9tKClz
LCBldmVuIGZhc3RlciBpZiBlc2NhcGUgZG9lcyBleGlzdC5cblx0aWYoJycgPT0gbFswXSAmJiAxID09IGwubGVuZ3RoKXsgcmV0dXJuIFtdIH0gLy8gYW5u
b3lpbmcgZWRnZSBjYXNlcyEgaG93IG11Y2ggZG9lcyB0aGlzIHNsb3cgdXMgZG93bj9cblx0Ly9pZigoYz1pKzIrcGFyc2VJbnQobFtpKzFdKSkgIT0gYyl7
IHJldHVybiBbXSB9IC8vIG1heWJlIHN0aWxsIGZhc3RlciB0aGFuIGJlbG93P1xuXHRpZigoZT1pKzIrcGFyc2VJbnQoKGU9bFtpKzFdKS5zdWJzdHJpbmco
MCwgZS5pbmRleE9mKCdcIicpKXx8ZSkpICE9IGUpeyByZXR1cm4gW10gfSAvLyBOYU4gY2hlY2sgaW4gSlMgaXMgd2VpcmQuXG5cdGxbaV0gPSBsLnNsaWNl
KGksIGUpLmpvaW4oc3x8J3wnKTsgLy8gcmVqb2luIHRoZSBlc2NhcGVkIHZhbHVlXG5cdHJldHVybiBsLnNsaWNlKDAsaSsxKS5jb25jYXQoaGVhbChsLnNs
aWNlKGUpLCBzKSk7IC8vIG1lcmdlIGxlZnQgd2l0aCBjaGVja2VkIHJpZ2h0LlxufVxuXG5mdW5jdGlvbiBzaXplKHQpeyByZXR1cm4gKHR8fCcnKS5sZW5n
dGh8fDEgfSAvLyBiaXRzL251bWJlcnMgbGVzcyBzaXplPyBCdWcgb3IgZmVhdHVyZT9cbmZ1bmN0aW9uIHN1YnQoaSxqKXsgcmV0dXJuIHRoaXMud29yZCB9
XG4vL2Z1bmN0aW9uIHRvdCgpeyByZXR1cm4gdGhpcy50ZXh0ID0gdGhpcy50ZXh0IHx8IFwiJ1wiKyh0aGlzLndvcmQpK1wiJ1wiKyh0aGlzLmlzKStcIidc
IiB9XG5mdW5jdGlvbiB0b3QoKXsgdmFyIHRtcCA9IHt9O1xuXHQvL2lmKCh0bXAgPSB0aGlzLnBhZ2UpICYmIHRtcC5zYXZpbmcpeyBkZWxldGUgdG1wLmJv
b2suYWxsW3RoaXMud29yZF07IH0gLy8gVE9ETzogQlVHISBCb29rIGNhbid0IGtub3cgYWJvdXQgUkFELCB0aGlzIHdhcyBmcm9tIFJBRCwgc28gdGhpcyBN
SUdIVCBiZSBjb3JyZWN0IGJ1dCB3ZSBuZWVkIHRvIHJlZmFjdG9yLiBNYWtlIHN1cmUgdG8gYWRkIHRlc3RzIHRoYXQgd2lsbCByZS10cmlnZ2VyIHRoaXMu
XG5cdHJldHVybiB0aGlzLnRleHQgPSB0aGlzLnRleHQgfHwgXCI6XCIrQi5lbmNvZGUodGhpcy53b3JkKStcIjpcIitCLmVuY29kZSh0aGlzLmlzKStcIjpc
Ijtcblx0dG1wW3RoaXMud29yZF0gPSB0aGlzLmlzO1xuXHRyZXR1cm4gdGhpcy50ZXh0ID0gdGhpcy50ZXh0IHx8IEIuZW5jb2RlKHRtcCwnfCcsJzonKS5z
bGljZSgxLC0xKTtcblx0Ly9yZXR1cm4gdGhpcy50ZXh0ID0gdGhpcy50ZXh0IHx8IFwiJ1wiKyh0aGlzLndvcmQpK1wiJ1wiKyh0aGlzLmlzKStcIidcIjtc
bn1cbmZ1bmN0aW9uIHN1YihpLGopeyByZXR1cm4gKHRoaXMuZmlyc3R8fHRoaXMud29yZHx8Qi5kZWNvZGUoKGZyb20odGhpcyl8fCcnKVswXXx8JycpKS5z
dWJzdHJpbmcoaSxqKSB9XG5mdW5jdGlvbiB0bygpeyByZXR1cm4gdGhpcy50ZXh0ID0gdGhpcy50ZXh0IHx8IHRleHQodGhpcykgfVxuZnVuY3Rpb24gdGV4
dChwKXsgLy8gUEVSRjogcmVhZC0+WypdIDogdGV4dC0+XCIqXCIgbm8gZWRpdCB3YXN0ZSAxIHRpbWUgcGVyZi5cblx0aWYocC5saW1ibyl7IHNvcnQocCkg
fSAvLyBUT0RPOiBCVUc/IEVtcHR5IHBhZ2UgbWVhbmluZz8gdW5kZWYsICcnLCAnfHwnP1xuXHRyZXR1cm4gKCdzdHJpbmcnID09IHR5cGVvZiBwLmZyb20p
PyBwLmZyb20gOiAnfCcrKHAuZnJvbXx8W10pLmpvaW4oJ3wnKSsnfCc7XG59XG5cbmZ1bmN0aW9uIHNvcnQocCwgbCl7XG5cdHZhciBmID0gcC5mcm9tID0g
KCdzdHJpbmcnID09IHR5cGVvZiBwLmZyb20pPyBzbG90KHAuZnJvbSkgOiBwLmZyb218fFtdO1xuXHRpZighKGwgPSBsIHx8IHAubGltYm8pKXsgcmV0dXJu
IGYgfVxuXHRyZXR1cm4gbWl4KHApLnNvcnQoZnVuY3Rpb24oYSxiKXtcblx0XHRyZXR1cm4gKGEud29yZHx8Qi5kZWNvZGUoJycrYSkpIDwgKGIud29yZHx8
Qi5kZWNvZGUoJycrYikpPyAtMToxO1xuXHR9KTtcbn1cbmZ1bmN0aW9uIG1peChwLCBsKXsgLy8gVE9ETzogSU1QUk9WRSBQRVJGT1JNQU5DRSEhISEgbFtq
XSA9IGkgaXMgNVgrIGZhc3RlciB0aGFuIC5wdXNoKFxuXHRsID0gbCB8fCBwLmxpbWJvIHx8IFtdOyBwLmxpbWJvID0gbnVsbDtcblx0dmFyIGogPSAwLCBp
LCBmID0gcC5mcm9tO1xuXHR3aGlsZShpID0gbFtqKytdKXtcblx0XHRpZihnb3QoaS53b3JkLCBwKSl7XG5cdFx0XHRmW2dvdC5pXSA9IGk7IC8vIFRPRE86
IFRyaWNrOiBhbGxvdyBmb3IgYSBHVU4nUyBIQU0gQ1JEVCBob29rIGhlcmUuXG5cdFx0fSBlbHNlIHtcblx0XHRcdGYucHVzaChpKTsgXG5cdFx0fVxuXHR9
XG5cdHJldHVybiBmO1xufVxuXG5CLmVuY29kZSA9IGZ1bmN0aW9uKGQsIHMsIHUpeyBzID0gcyB8fCBcInxcIjsgdSA9IHUgfHwgU3RyaW5nLmZyb21DaGFy
Q29kZSgzMik7XG5cdHN3aXRjaCh0eXBlb2YgZCl7XG5cdFx0Y2FzZSAnc3RyaW5nJzogLy8gdGV4dFxuXHRcdFx0dmFyIGkgPSBkLmluZGV4T2YocyksIGMg
PSAwO1xuXHRcdFx0d2hpbGUoaSAhPSAtMSl7IGMrKzsgaSA9IGQuaW5kZXhPZihzLCBpKzEpIH1cblx0XHRcdHJldHVybiAoYz9zK2M6JycpKyAnXCInICsg
ZDtcblx0XHRjYXNlICdudW1iZXInOiByZXR1cm4gKGQgPCAwKT8gJycrZCA6ICcrJytkO1xuXHRcdGNhc2UgJ2Jvb2xlYW4nOiByZXR1cm4gZD8gJysnIDog
Jy0nO1xuXHRcdGNhc2UgJ29iamVjdCc6IGlmKCFkKXsgcmV0dXJuICcgJyB9IC8vIFRPRE86IEJVRyEhISBOZXN0ZWQgb2JqZWN0cyBkb24ndCBzbG90IGNv
cnJlY3RseVxuXHRcdFx0dmFyIGwgPSBPYmplY3Qua2V5cyhkKS5zb3J0KCksIGkgPSAwLCB0ID0gcywgaywgdjtcblx0XHRcdHdoaWxlKGsgPSBsW2krK10p
eyB0ICs9IHUrQi5lbmNvZGUoayxzLHUpK3UrQi5lbmNvZGUoZFtrXSxzLHUpK3UrcyB9XG5cdFx0XHRyZXR1cm4gdDtcblx0fVxufVxuQi5kZWNvZGUgPSBm
dW5jdGlvbih0LCBzKXsgcyA9IHMgfHwgXCJ8XCI7XG5cdGlmKCdzdHJpbmcnICE9IHR5cGVvZiB0KXsgcmV0dXJuIH1cblx0c3dpdGNoKHQpeyBjYXNlICcg
JzogcmV0dXJuIG51bGw7IGNhc2UgJy0nOiByZXR1cm4gZmFsc2U7IGNhc2UgJysnOiByZXR1cm4gdHJ1ZTsgfVxuXHRzd2l0Y2godFswXSl7XG5cdFx0Y2Fz
ZSAnLSc6IGNhc2UgJysnOiByZXR1cm4gcGFyc2VGbG9hdCh0KTtcblx0XHRjYXNlICdcIic6IHJldHVybiB0LnNsaWNlKDEpO1xuXHR9XG5cdHJldHVybiB0
LnNsaWNlKHQuaW5kZXhPZignXCInKSsxKTtcbn1cblxuQi5oYXNoID0gZnVuY3Rpb24ocywgYyl7IC8vIHZpYSBTT1xuXHRpZih0eXBlb2YgcyAhPT0gJ3N0
cmluZycpeyByZXR1cm4gfVxuICBjID0gYyB8fCAwOyAvLyBDUFUgc2NoZWR1bGUgaGFzaGluZyBieVxuICBpZighcy5sZW5ndGgpeyByZXR1cm4gYyB9XG4g
IGZvcih2YXIgaT0wLGw9cy5sZW5ndGgsbjsgaTxsOyArK2kpe1xuICAgIG4gPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgYyA9ICgoYzw8NSktYykrbjtcbiAg
ICBjIHw9IDA7XG4gIH1cbiAgcmV0dXJuIGM7XG59XG5cbmZ1bmN0aW9uIHJlY29yZChrZXksIHZhbCl7IHJldHVybiBrZXkrQi5lbmNvZGUodmFsKStcIiVc
IitrZXkubGVuZ3RoIH1cbmZ1bmN0aW9uIGRlY29yZCh0KXtcblx0dmFyIG8gPSB7fSwgaSA9IHQubGFzdEluZGV4T2YoXCIlXCIpLCBjID0gcGFyc2VGbG9h
dCh0LnNsaWNlKGkrMSkpO1xuXHRvW3Quc2xpY2UoMCxjKV0gPSBCLmRlY29kZSh0LnNsaWNlKGMsaSkpO1xuXHRyZXR1cm4gbztcbn1cblxudHJ5e19fZGVm
YXVsdEV4cG9ydCA9Qn1jYXRjaChlKXt9XG5cdFxufSgpKTtcbmV4cG9ydCBkZWZhdWx0IF9fZGVmYXVsdEV4cG9ydDsiLCJzcmMvZ3VuL3ZhbGlkLmpzIjoi
bGV0IF9fZGVmYXVsdEV4cG9ydDtcbihmdW5jdGlvbigpe1xuXG4vLyBWYWxpZCB2YWx1ZXMgYXJlIGEgc3Vic2V0IG9mIEpTT046IG51bGwsIGJpbmFyeSwg
bnVtYmVyICghSW5maW5pdHkpLCB0ZXh0LFxuLy8gb3IgYSBzb3VsIHJlbGF0aW9uLiBBcnJheXMgbmVlZCBzcGVjaWFsIGFsZ29yaXRobXMgdG8gaGFuZGxl
IGNvbmN1cnJlbmN5LFxuLy8gc28gdGhleSBhcmUgbm90IHN1cHBvcnRlZCBkaXJlY3RseS4gVXNlIGFuIGV4dGVuc2lvbiB0aGF0IHN1cHBvcnRzIHRoZW0g
aWZcbi8vIG5lZWRlZCBidXQgcmVzZWFyY2ggdGhlaXIgcHJvYmxlbXMgZmlyc3QuXG5fX2RlZmF1bHRFeHBvcnQgPSBmdW5jdGlvbih2KXtcbiAgLy8gXCJk
ZWxldGVzXCIsIG51bGxpbmcgb3V0IGtleXMuXG4gIHJldHVybiB2ID09PSBudWxsIHx8XG5cdFwic3RyaW5nXCIgPT09IHR5cGVvZiB2IHx8XG5cdFwiYm9v
bGVhblwiID09PSB0eXBlb2YgdiB8fFxuXHQvLyB3ZSB3YW50ICsvLSBJbmZpbml0eSB0byBiZSwgYnV0IEpTT04gZG9lcyBub3Qgc3VwcG9ydCBpdCwgc2Fk
IGZhY2UuXG5cdC8vIGNhbiB5b3UgZ3Vlc3Mgd2hhdCB2ID09PSB2IGNoZWNrcyBmb3I/IDspXG5cdChcIm51bWJlclwiID09PSB0eXBlb2YgdiAmJiB2ICE9
IEluZmluaXR5ICYmIHYgIT0gLUluZmluaXR5ICYmIHYgPT09IHYpIHx8XG5cdCghIXYgJiYgXCJzdHJpbmdcIiA9PSB0eXBlb2YgdltcIiNcIl0gJiYgT2Jq
ZWN0LmtleXModikubGVuZ3RoID09PSAxICYmIHZbXCIjXCJdKTtcbn1cblx0XG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgX19kZWZhdWx0RXhwb3J0OyIsInNy
Yy9ndW4vc3RhdGUuanMiOiJpbXBvcnQgJy4vc2hpbS5qcyc7XG5cbmxldCBfX2RlZmF1bHRFeHBvcnQ7XG4oZnVuY3Rpb24oKXtcbiAgICBmdW5jdGlvbiBT
dGF0ZSgpe1xuICAgICAgICB2YXIgdCA9ICtuZXcgRGF0ZTtcbiAgICAgICAgaWYobGFzdCA8IHQpe1xuICAgICAgICAgICAgcmV0dXJuIE4gPSAwLCBsYXN0
ID0gdCArIFN0YXRlLmRyaWZ0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsYXN0ID0gdCArICgoTiArPSAxKSAvIEQpICsgU3RhdGUuZHJpZnQ7XG4g
ICAgfVxuICAgIFN0YXRlLmRyaWZ0ID0gMDtcbiAgICB2YXIgTkkgPSAtSW5maW5pdHksIE4gPSAwLCBEID0gOTk5LCBsYXN0ID0gTkksIHU7IC8vIFdBUk5J
TkchIEluIHRoZSBmdXR1cmUsIG9uIG1hY2hpbmVzIHRoYXQgYXJlIEQgdGltZXMgZmFzdGVyIHRoYW4gMjAxNkFEIG1hY2hpbmVzLCB5b3Ugd2lsbCB3YW50
IHRvIGluY3JlYXNlIEQgYnkgYW5vdGhlciBzZXZlcmFsIG9yZGVycyBvZiBtYWduaXR1ZGUgc28gdGhlIHByb2Nlc3Npbmcgc3BlZWQgbmV2ZXIgb3V0IHBh
Y2VzIHRoZSBkZWNpbWFsIHJlc29sdXRpb24gKGluY3JlYXNpbmcgYW4gaW50ZWdlciBlZmZlY3RzIHRoZSBzdGF0ZSBhY2N1cmFjeSkuXG4gICAgU3RhdGUu
aXMgPSBmdW5jdGlvbihuLCBrLCBvKXsgLy8gY29udmVuaWVuY2UgZnVuY3Rpb24gdG8gZ2V0IHRoZSBzdGF0ZSBvbiBhIGtleSBvbiBhIG5vZGUgYW5kIHJl
dHVybiBpdC5cbiAgICAgICAgdmFyIHRtcCA9IChrICYmIG4gJiYgbi5fICYmIG4uX1snPiddKSB8fCBvO1xuICAgICAgICBpZighdG1wKXsgcmV0dXJuIH1c
biAgICAgICAgcmV0dXJuICgnbnVtYmVyJyA9PSB0eXBlb2YgKHRtcCA9IHRtcFtrXSkpPyB0bXAgOiBOSTtcbiAgICB9XG4gICAgU3RhdGUuaWZ5ID0gZnVu
Y3Rpb24obiwgaywgcywgdiwgc291bCl7IC8vIHB1dCBhIGtleSdzIHN0YXRlIG9uIGEgbm9kZS5cbiAgICAgICAgKG4gPSBuIHx8IHt9KS5fID0gbi5fIHx8
IHt9OyAvLyBzYWZldHkgY2hlY2sgb3IgaW5pdC5cbiAgICAgICAgaWYoc291bCl7IG4uX1snIyddID0gc291bCB9IC8vIHNldCBhIHNvdWwgaWYgc3BlY2lm
aWVkLlxuICAgICAgICB2YXIgdG1wID0gbi5fWyc+J10gfHwgKG4uX1snPiddID0ge30pOyAvLyBncmFiIHRoZSBzdGF0ZXMgZGF0YS5cbiAgICAgICAgaWYo
dSAhPT0gayAmJiBrICE9PSAnXycpe1xuICAgICAgICAgICAgaWYoJ251bWJlcicgPT0gdHlwZW9mIHMpeyB0bXBba10gPSBzIH0gLy8gYWRkIHRoZSB2YWxp
ZCBzdGF0ZS5cbiAgICAgICAgICAgIGlmKHUgIT09IHYpeyBuW2tdID0gdiB9IC8vIE5vdGU6IE5vdCBpdHMgam9iIHRvIGNoZWNrIGZvciB2YWxpZCB2YWx1
ZXMhXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG47XG4gICAgfVxuICAgIF9fZGVmYXVsdEV4cG9ydCA9IFN0YXRlO1xufSgpKTtcbmV4cG9ydCBkZWZh
dWx0IF9fZGVmYXVsdEV4cG9ydDsiLCJzcmMvZ3VuL2R1cC5qcyI6ImltcG9ydCAnLi9zaGltLmpzJztcblxubGV0IF9fZGVmYXVsdEV4cG9ydDtcbihmdW5j
dGlvbigpe1xuICAgIGZ1bmN0aW9uIER1cChvcHQpe1xuICAgICAgICB2YXIgZHVwID0ge3M6e319LCBzID0gZHVwLnM7XG4gICAgICAgIG9wdCA9IG9wdCB8
fCB7bWF4OiA5OTksIGFnZTogMTAwMCAqIDl9Oy8vKi8gMTAwMCAqIDkgKiAzfTtcbiAgICAgICAgZHVwLmNoZWNrID0gZnVuY3Rpb24oaWQpe1xuICAgICAg
ICAgICAgaWYoIXNbaWRdKXsgcmV0dXJuIGZhbHNlIH1cbiAgICAgICAgICAgIHJldHVybiBkdChpZCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGR0ID0g
ZHVwLnRyYWNrID0gZnVuY3Rpb24oaWQpe1xuICAgICAgICAgICAgdmFyIGl0ID0gc1tpZF0gfHwgKHNbaWRdID0ge30pO1xuICAgICAgICAgICAgaXQud2Fz
ID0gZHVwLm5vdyA9ICtuZXcgRGF0ZTtcbiAgICAgICAgICAgIGlmKCFkdXAudG8peyBkdXAudG8gPSBzZXRUaW1lb3V0KGR1cC5kcm9wLCBvcHQuYWdlICsg
OSkgfVxuICAgICAgICAgICAgaWYoZHQuZWQpeyBkdC5lZChpZCkgfVxuICAgICAgICAgICAgcmV0dXJuIGl0O1xuICAgICAgICB9XG4gICAgICAgIGR1cC5k
cm9wID0gZnVuY3Rpb24oYWdlKXtcbiAgICAgICAgICAgIGR1cC50byA9IG51bGw7XG4gICAgICAgICAgICBkdXAubm93ID0gK25ldyBEYXRlO1xuICAgICAg
ICAgICAgdmFyIGwgPSBPYmplY3Qua2V5cyhzKTtcbiAgICAgICAgICAgIGNvbnNvbGUuU1RBVCAmJiBjb25zb2xlLlNUQVQoZHVwLm5vdywgK25ldyBEYXRl
IC0gZHVwLm5vdywgJ2R1cCBkcm9wIGtleXMnKTsgLy8gcHJldiB+MjAlIENQVSA3JSBSQU0gMzAwTUIgLy8gbm93IH4yNSUgQ1BVIDclIFJBTSA1MDBNQlxu
ICAgICAgICAgICAgc2V0VGltZW91dC5lYWNoKGwsIGZ1bmN0aW9uKGlkKXsgdmFyIGl0ID0gc1tpZF07IC8vIFRPRE86IC5rZXlzKCBpcyBzbG93P1xuICAg
ICAgICAgICAgICAgIGlmKGl0ICYmIChhZ2UgfHwgb3B0LmFnZSkgPiAoZHVwLm5vdyAtIGl0LndhcykpeyByZXR1cm4gfVxuICAgICAgICAgICAgICAgIGRl
bGV0ZSBzW2lkXTtcbiAgICAgICAgICAgIH0sMCw5OSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGR1cDtcbiAgICB9XG4gICAgX19kZWZhdWx0RXhw
b3J0ID0gRHVwO1xufSgpKTtcbmV4cG9ydCBkZWZhdWx0IF9fZGVmYXVsdEV4cG9ydDsiLCJzcmMvZ3VuL2Fzay5qcyI6ImltcG9ydCAnLi9vbnRvLmpzJztc
blxubGV0IF9fZGVmYXVsdEV4cG9ydDtcbihmdW5jdGlvbigpe1xuICAgIF9fZGVmYXVsdEV4cG9ydCA9IGZ1bmN0aW9uIGFzayhjYiwgYXMpe1xuICAgICAg
ICBpZighdGhpcy5vbil7IHJldHVybiB9XG4gICAgICAgIHZhciBsYWNrID0gKHRoaXMub3B0fHx7fSkubGFjayB8fCA5MDAwO1xuICAgICAgICBpZighKCdm
dW5jdGlvbicgPT0gdHlwZW9mIGNiKSl7XG4gICAgICAgICAgICBpZighY2IpeyByZXR1cm4gfVxuICAgICAgICAgICAgdmFyIGlkID0gY2JbJyMnXSB8fCBj
YiwgdG1wID0gKHRoaXMudGFnfHwnJylbaWRdO1xuICAgICAgICAgICAgaWYoIXRtcCl7IHJldHVybiB9XG4gICAgICAgICAgICBpZihhcyl7XG4gICAgICAg
ICAgICAgICAgdG1wID0gdGhpcy5vbihpZCwgYXMpO1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0bXAuZXJyKTtcbiAgICAgICAgICAgICAgICB0
bXAuZXJyID0gc2V0VGltZW91dChmdW5jdGlvbigpeyB0bXAub2ZmKCkgfSwgbGFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1
ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaWQgPSAoYXMgJiYgYXNbJyMnXSkgfHwgcmFuZG9tKDkpO1xuICAgICAgICBpZighY2IpeyByZXR1cm4gaWQg
fVxuICAgICAgICB2YXIgdG8gPSB0aGlzLm9uKGlkLCBjYiwgYXMpO1xuICAgICAgICB0by5lcnIgPSB0by5lcnIgfHwgc2V0VGltZW91dChmdW5jdGlvbigp
eyB0by5vZmYoKTtcbiAgICAgICAgICAgIHRvLm5leHQoe2VycjogXCJFcnJvcjogTm8gQUNLIHlldC5cIiwgbGFjazogdHJ1ZX0pO1xuICAgICAgICB9LCBs
YWNrKTtcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH1cbiAgICB2YXIgcmFuZG9tID0gU3RyaW5nLnJhbmRvbSB8fCBmdW5jdGlvbigpeyByZXR1cm4gTWF0
aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMikgfVxufSgpKTtcbmV4cG9ydCBkZWZhdWx0IF9fZGVmYXVsdEV4cG9ydDsiLCJzcmMvZ3VuL3Jvb3Qu
anMiOiJpbXBvcnQgJy4vc2hpbS5qcyc7XG5pbXBvcnQgX192YWxpZCBmcm9tICcuL3ZhbGlkLmpzJztcbmltcG9ydCBfX3N0YXRlIGZyb20gJy4vc3RhdGUu
anMnO1xuaW1wb3J0IF9fb250byBmcm9tICcuL29udG8uanMnO1xuaW1wb3J0IF9fZHVwIGZyb20gJy4vZHVwLmpzJztcbmltcG9ydCBfX2FzayBmcm9tICcu
L2Fzay5qcyc7XG5cbmxldCBfX2RlZmF1bHRFeHBvcnQ7XG4oZnVuY3Rpb24oKXtcbiAgICBmdW5jdGlvbiBHdW4obyl7XG4gICAgICAgIGlmKG8gaW5zdGFu
Y2VvZiBHdW4peyByZXR1cm4gKHRoaXMuXyA9IHskOiB0aGlzfSkuJCB9XG4gICAgICAgIGlmKCEodGhpcyBpbnN0YW5jZW9mIEd1bikpeyByZXR1cm4gbmV3
IEd1bihvKSB9XG4gICAgICAgIHJldHVybiBHdW4uY3JlYXRlKHRoaXMuXyA9IHskOiB0aGlzLCBvcHQ6IG99KTtcbiAgICB9XG5cbiAgICBHdW4uaXMgPSBm
dW5jdGlvbigkKXsgcmV0dXJuICgkIGluc3RhbmNlb2YgR3VuKSB8fCAoJCAmJiAkLl8gJiYgKCQgPT09ICQuXy4kKSkgfHwgZmFsc2UgfVxuXG4gICAgR3Vu
LnZlcnNpb24gPSAwLjIwMjA7XG5cbiAgICBHdW4uY2hhaW4gPSBHdW4ucHJvdG90eXBlO1xuICAgIEd1bi5jaGFpbi50b0pTT04gPSBmdW5jdGlvbigpe307
XG5cbiAgICBHdW4udmFsaWQgPSBfX3ZhbGlkO1xuICAgIEd1bi5zdGF0ZSA9IF9fc3RhdGU7XG4gICAgR3VuLm9uID0gX19vbnRvO1xuICAgIEd1bi5kdXAg
PSBfX2R1cDtcbiAgICBHdW4uYXNrID0gX19hc2s7XG5cbiAgICAoZnVuY3Rpb24oKXtcbiAgICAgICAgR3VuLmNyZWF0ZSA9IGZ1bmN0aW9uKGF0KXtcbiAg
ICAgICAgICAgIGF0LnJvb3QgPSBhdC5yb290IHx8IGF0O1xuICAgICAgICAgICAgYXQuZ3JhcGggPSBhdC5ncmFwaCB8fCB7fTtcbiAgICAgICAgICAgIGF0
Lm9uID0gYXQub24gfHwgR3VuLm9uO1xuICAgICAgICAgICAgYXQuYXNrID0gYXQuYXNrIHx8IEd1bi5hc2s7XG4gICAgICAgICAgICBhdC5kdXAgPSBhdC5k
dXAgfHwgR3VuLmR1cCgpO1xuICAgICAgICAgICAgdmFyIGd1biA9IGF0LiQub3B0KGF0Lm9wdCk7XG4gICAgICAgICAgICBpZighYXQub25jZSl7XG4gICAg
ICAgICAgICAgICAgYXQub24oJ2luJywgdW5pdmVyc2UsIGF0KTtcbiAgICAgICAgICAgICAgICBhdC5vbignb3V0JywgdW5pdmVyc2UsIGF0KTtcbiAgICAg
ICAgICAgICAgICBhdC5vbigncHV0JywgbWFwLCBhdCk7XG4gICAgICAgICAgICAgICAgR3VuLm9uKCdjcmVhdGUnLCBhdCk7XG4gICAgICAgICAgICAgICAg
YXQub24oJ2NyZWF0ZScsIGF0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF0Lm9uY2UgPSAxO1xuICAgICAgICAgICAgcmV0dXJuIGd1bjtcbiAg
ICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB1bml2ZXJzZShtc2cpe1xuICAgICAgICAgICAgLy8gVE9ETzogQlVHISBtc2cub3V0ID0gbnVsbCBiZWluZyBz
ZXQhXG4gICAgICAgICAgICAvL2lmKCFGKXsgdmFyIGV2ZSA9IHRoaXM7IHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgdW5pdmVyc2UuY2FsbChldmUsIG1zZywx
KSB9LE1hdGgucmFuZG9tKCkgKiAxMDApO3JldHVybjsgfSAvLyBBREQgRiBUTyBQQVJBTVMhXG4gICAgICAgICAgICBpZighbXNnKXsgcmV0dXJuIH1cbiAg
ICAgICAgICAgIGlmKG1zZy5vdXQgPT09IHVuaXZlcnNlKXsgdGhpcy50by5uZXh0KG1zZyk7IHJldHVybiB9XG4gICAgICAgICAgICB2YXIgZXZlID0gdGhp
cywgYXMgPSBldmUuYXMsIGF0ID0gYXMuYXQgfHwgYXMsIGd1biA9IGF0LiQsIGR1cCA9IGF0LmR1cCwgdG1wLCBEQkcgPSBtc2cuREJHO1xuICAgICAgICAg
ICAgKHRtcCA9IG1zZ1snIyddKSB8fCAodG1wID0gbXNnWycjJ10gPSB0ZXh0X3JhbmQoOSkpO1xuICAgICAgICAgICAgaWYoZHVwLmNoZWNrKHRtcCkpeyBy
ZXR1cm4gfSBkdXAudHJhY2sodG1wKTtcbiAgICAgICAgICAgIHRtcCA9IG1zZy5fOyBtc2cuXyA9ICgnZnVuY3Rpb24nID09IHR5cGVvZiB0bXApPyB0bXAg
OiBmdW5jdGlvbigpe307XG4gICAgICAgICAgICAobXNnLiQgJiYgKG1zZy4kID09PSAobXNnLiQuX3x8JycpLiQpKSB8fCAobXNnLiQgPSBndW4pO1xuICAg
ICAgICAgICAgaWYobXNnWydAJ10gJiYgIW1zZy5wdXQpeyBhY2sobXNnKSB9XG4gICAgICAgICAgICBpZighYXQuYXNrKG1zZ1snQCddLCBtc2cpKXsgLy8g
aXMgdGhpcyBtYWNoaW5lIGxpc3RlbmluZyBmb3IgYW4gYWNrP1xuICAgICAgICAgICAgICAgIERCRyAmJiAoREJHLnUgPSArbmV3IERhdGUpO1xuICAgICAg
ICAgICAgICAgIGlmKG1zZy5wdXQpeyBwdXQobXNnKTsgcmV0dXJuIH0gZWxzZVxuICAgICAgICAgICAgICAgIGlmKG1zZy5nZXQpeyBHdW4ub24uZ2V0KG1z
ZywgZ3VuKSB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBEQkcgJiYgKERCRy51YyA9ICtuZXcgRGF0ZSk7XG4gICAgICAgICAgICBldmUudG8ubmV4
dChtc2cpO1xuICAgICAgICAgICAgREJHICYmIChEQkcudWEgPSArbmV3IERhdGUpO1xuICAgICAgICAgICAgaWYobXNnLm50cyB8fCBtc2cuTlRTKXsgcmV0
dXJuIH0gLy8gVE9ETzogVGhpcyBzaG91bGRuJ3QgYmUgaW4gY29yZSwgYnV0IGZhc3Qgd2F5IHRvIHByZXZlbnQgTlRTIHNwcmVhZC4gRGVsZXRlIHRoaXMg
bGluZSBhZnRlciBhbGwgcGVlcnMgaGF2ZSB1cGdyYWRlZCB0byBuZXdlciB2ZXJzaW9ucy5cbiAgICAgICAgICAgIG1zZy5vdXQgPSB1bml2ZXJzZTsgYXQu
b24oJ291dCcsIG1zZyk7XG4gICAgICAgICAgICBEQkcgJiYgKERCRy51ZSA9ICtuZXcgRGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcHV0
KG1zZyl7XG4gICAgICAgICAgICBpZighbXNnKXsgcmV0dXJuIH1cbiAgICAgICAgICAgIHZhciBjdHggPSBtc2cuX3x8JycsIHJvb3QgPSBjdHgucm9vdCA9
ICgoY3R4LiQgPSBtc2cuJHx8JycpLl98fCcnKS5yb290O1xuICAgICAgICAgICAgaWYobXNnWydAJ10gJiYgY3R4LmZhaXRoICYmICFjdHgubWlzcyl7IC8v
IFRPRE86IEFYRSBtYXkgc3BsaXQvcm91dGUgYmFzZWQgb24gJ3B1dCcgd2hhdCBzaG91bGQgd2UgZG8gaGVyZT8gRGV0ZWN0IEAgaW4gQVhFPyBJIHRoaW5r
IHdlIGRvbid0IGhhdmUgdG8gd29ycnksIGFzIERBTSB3aWxsIHJvdXRlIGl0IG9uIEAuXG4gICAgICAgICAgICAgICAgbXNnLm91dCA9IHVuaXZlcnNlO1xu
ICAgICAgICAgICAgICAgIHJvb3Qub24oJ291dCcsIG1zZyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAg
Y3R4LmxhdGNoID0gcm9vdC5oYXRjaDsgY3R4Lm1hdGNoID0gcm9vdC5oYXRjaCA9IFtdO1xuICAgICAgICAgICAgdmFyIHB1dCA9IG1zZy5wdXQ7XG4gICAg
ICAgICAgICB2YXIgREJHID0gY3R4LkRCRyA9IG1zZy5EQkcsIFMgPSArbmV3IERhdGU7IENUID0gQ1QgfHwgUztcbiAgICAgICAgICAgIGlmKHB1dFsnIydd
ICYmIHB1dFsnLiddKXsgLypyb290ICYmIHJvb3Qub24oJ3B1dCcsIG1zZyk7Ki8gcmV0dXJuIH0gLy8gVE9ETzogQlVHISBUaGlzIG5lZWRzIHRvIGNhbGwg
SEFNIGluc3RlYWQuXG4gICAgICAgICAgICBEQkcgJiYgKERCRy5wID0gUyk7XG4gICAgICAgICAgICBjdHhbJyMnXSA9IG1zZ1snIyddO1xuICAgICAgICAg
ICAgY3R4Lm1zZyA9IG1zZztcbiAgICAgICAgICAgIGN0eC5hbGwgPSAwO1xuICAgICAgICAgICAgY3R4LnN0dW4gPSAxO1xuICAgICAgICAgICAgdmFyIG5s
ID0gT2JqZWN0LmtleXMocHV0KTsvLy5zb3J0KCk7IC8vIFRPRE86IFRoaXMgaXMgdW5ib3VuZGVkIG9wZXJhdGlvbiwgbGFyZ2UgZ3JhcGhzIHdpbGwgYmUg
c2xvd2VyLiBXcml0ZSBvdXIgb3duIENQVSBzY2hlZHVsZWQgc29ydD8gT3Igc29tZWhvdyBkbyBpdCBpbiBiZWxvdz8gS2V5cyBpdHNlbGYgaXMgbm90IE8o
MSkgZWl0aGVyLCBjcmVhdGUgRVM1IHNoaW0gb3ZlciA/d2VhayBtYXA/IG9yIGN1c3RvbSB3aGljaCBpcyBjb25zdGFudC5cbiAgICAgICAgICAgIGNvbnNv
bGUuU1RBVCAmJiBjb25zb2xlLlNUQVQoUywgKChEQkd8fGN0eCkucGsgPSArbmV3IERhdGUpIC0gUywgJ3B1dCBzb3J0Jyk7XG4gICAgICAgICAgICB2YXIg
bmkgPSAwLCBuaiwga2wsIHNvdWwsIG5vZGUsIHN0YXRlcywgZXJyLCB0bXA7XG4gICAgICAgICAgICAoZnVuY3Rpb24gcG9wKG8pe1xuICAgICAgICAgICAg
ICAgIGlmKG5qICE9IG5pKXsgbmogPSBuaTtcbiAgICAgICAgICAgICAgICAgICAgaWYoIShzb3VsID0gbmxbbmldKSl7XG4gICAgICAgICAgICAgICAgICAg
ICAgICBjb25zb2xlLlNUQVQgJiYgY29uc29sZS5TVEFUKFMsICgoREJHfHxjdHgpLnBkID0gK25ldyBEYXRlKSAtIFMsICdwdXQnKTtcbiAgICAgICAgICAg
ICAgICAgICAgICAgIGZpcmUoY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAg
ICAgICAgICAgICBpZighKG5vZGUgPSBwdXRbc291bF0pKXsgZXJyID0gRVJSK2N1dChzb3VsKStcIm5vIG5vZGUuXCIgfSBlbHNlXG4gICAgICAgICAgICAg
ICAgICAgIGlmKCEodG1wID0gbm9kZS5fKSl7IGVyciA9IEVSUitjdXQoc291bCkrXCJubyBtZXRhLlwiIH0gZWxzZVxuICAgICAgICAgICAgICAgICAgICBp
Zihzb3VsICE9PSB0bXBbJyMnXSl7IGVyciA9IEVSUitjdXQoc291bCkrXCJzb3VsIG5vdCBzYW1lLlwiIH0gZWxzZVxuICAgICAgICAgICAgICAgICAgICBp
ZighKHN0YXRlcyA9IHRtcFsnPiddKSl7IGVyciA9IEVSUitjdXQoc291bCkrXCJubyBzdGF0ZS5cIiB9XG4gICAgICAgICAgICAgICAgICAgIGtsID0gT2Jq
ZWN0LmtleXMobm9kZXx8e30pOyAvLyBUT0RPOiAua2V5cyggaXMgc2xvd1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZihlcnIpe1xu
ICAgICAgICAgICAgICAgICAgICBtc2cuZXJyID0gY3R4LmVyciA9IGVycjsgLy8gaW52YWxpZCBkYXRhIHNob3VsZCBlcnJvciBhbmQgc3R1biB0aGUgbWVz
c2FnZS5cbiAgICAgICAgICAgICAgICAgICAgZmlyZShjdHgpO1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiaGFuZGxlIGVycm9yIVwi
LCBlcnIpIC8vIGhhbmRsZSFcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgaSA9
IDAsIGtleTsgbyA9IG8gfHwgMDtcbiAgICAgICAgICAgICAgICB3aGlsZShvKysgPCA5ICYmIChrZXkgPSBrbFtpKytdKSl7XG4gICAgICAgICAgICAgICAg
ICAgIGlmKCdfJyA9PT0ga2V5KXsgY29udGludWUgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsID0gbm9kZVtrZXldLCBzdGF0ZSA9IHN0YXRlc1tr
ZXldO1xuICAgICAgICAgICAgICAgICAgICBpZih1ID09PSBzdGF0ZSl7IGVyciA9IEVSUitjdXQoa2V5KStcIm9uXCIrY3V0KHNvdWwpK1wibm8gc3RhdGUu
XCI7IGJyZWFrIH1cbiAgICAgICAgICAgICAgICAgICAgaWYoIXZhbGlkKHZhbCkpeyBlcnIgPSBFUlIrY3V0KGtleSkrXCJvblwiK2N1dChzb3VsKStcImJh
ZCBcIisodHlwZW9mIHZhbCkrY3V0KHZhbCk7IGJyZWFrIH1cbiAgICAgICAgICAgICAgICAgICAgLy9jdHguYWxsKys7IC8vY3R4LmFja1tzb3VsK2tleV0g
PSAnJztcbiAgICAgICAgICAgICAgICAgICAgaGFtKHZhbCwga2V5LCBzb3VsLCBzdGF0ZSwgbXNnKTtcbiAgICAgICAgICAgICAgICAgICAgKytDOyAvLyBj
b3VydGVzeSBjb3VudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoKGtsID0ga2wuc2xpY2UoaSkpLmxlbmd0aCl7IHR1cm4ocG9w
KTsgcmV0dXJuIH1cbiAgICAgICAgICAgICAgICArK25pOyBrbCA9IG51bGw7IHBvcChvKTtcbiAgICAgICAgICAgIH0oKSk7XG4gICAgICAgIH0gR3VuLm9u
LnB1dCA9IHB1dDtcbiAgICAgICAgLy8gVE9ETzogTUFSSyEhISBjbG9jayBiZWxvdywgcmVjb25uZWN0IHN5bmMsIFNFQSBjZXJ0aWZ5IHdpcmUgbWVyZ2Us
IFVzZXIuYXV0aCB0YWtpbmcgbXVsdGlwbGUgdGltZXMsIC8vIG1zZyBwdXQsIHB1dCwgc2F5IGFjaywgaGVhciBsb29wLi4uXG4gICAgICAgIC8vIFdBU0lT
IEJVRyEgbG9jYWwgcGVlciBub3QgYWNrLiAub2ZmIG90aGVyIHBlb3BsZTogLm9wZW5cbiAgICAgICAgZnVuY3Rpb24gaGFtKHZhbCwga2V5LCBzb3VsLCBz
dGF0ZSwgbXNnKXtcbiAgICAgICAgICAgIHZhciBjdHggPSBtc2cuX3x8JycsIHJvb3QgPSBjdHgucm9vdCwgZ3JhcGggPSByb290LmdyYXBoLCBsb3QsIHRt
cDtcbiAgICAgICAgICAgIHZhciB2ZXJ0ZXggPSBncmFwaFtzb3VsXSB8fCBlbXB0eSwgd2FzID0gc3RhdGVfaXModmVydGV4LCBrZXksIDEpLCBrbm93biA9
IHZlcnRleFtrZXldO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgREJHID0gY3R4LkRCRzsgaWYodG1wID0gY29uc29sZS5TVEFUKXsgaWYoIWdy
YXBoW3NvdWxdIHx8ICFrbm93bil7IHRtcC5oYXMgPSAodG1wLmhhcyB8fCAwKSArIDEgfSB9XG5cbiAgICAgICAgICAgIHZhciBub3cgPSBTdGF0ZSgpLCB1
O1xuICAgICAgICAgICAgaWYoc3RhdGUgPiBub3cpe1xuICAgICAgICAgICAgICAgIGlmKCh0bXAgPSBzdGF0ZSAtIG5vdykgPiBIYW0ubWF4KXtcbiAgICAg
ICAgICAgICAgICAgICAgbXNnLmVyciA9IGN0eC5lcnIgPSBFUlIrY3V0KGtleSkrXCJvblwiK2N1dChzb3VsKStcInN0YXRlIHRvbyBmYXIgaW4gZnV0dXJl
LlwiOyBmaXJlKGN0eCk7IGJhY2soY3R4KTsgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9u
KCl7IGhhbSh2YWwsIGtleSwgc291bCwgc3RhdGUsIG1zZykgfSwgdG1wID4gTUQ/IE1EIDogdG1wKTsgLy8gTWF4IERlZmVyIDMyYml0LiA6KFxuICAgICAg
ICAgICAgICAgIGNvbnNvbGUuU1RBVCAmJiBjb25zb2xlLlNUQVQoKChEQkd8fGN0eCkuSGYgPSArbmV3IERhdGUpLCB0bXAsICdmdXR1cmUnKTtcbiAgICAg
ICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihzdGF0ZSA8IHdhcyl7IC8qb2xkOyovIGlmKHRydWUgfHwgIWN0eC5t
aXNzKXsgcmV0dXJuIH0gfSAvLyBidXQgc29tZSBjaGFpbnMgaGF2ZSBhIGNhY2hlIG1pc3MgdGhhdCBuZWVkIHRvIHJlLWZpcmUuIC8vIFRPRE86IEltcHJv
dmUgaW4gZnV0dXJlLiAvLyBmb3IgQVhFIHRoaXMgd291bGQgcmVkdWNlIHJlYnJvYWRjYXN0LCBidXQgR1VOIGRvZXMgaXQgb24gbWVzc2FnZSBmb3J3YXJk
aW5nLiAvLyBUVVJOUyBPVVQgQ0FDSEUgTUlTUyBXQVMgTk9UIE5FRURFRCBGT1IgTkVXIENIQUlOUyBBTllNT1JFISEhIERBTkdFUiBEQU5HRVIgREFOR0VS
LCBBTFdBWVMgUkVUVVJOISAob3IgYW0gSSBtaXNzaW5nIHNvbWV0aGluZz8pXG4gICAgICAgICAgICBpZighY3R4LmZhaXRoKXsgLy8gVE9ETzogQlVHPyBD
YW4gdGhpcyBiZSB1c2VkIGZvciBjYWNoZSBtaXNzIGFzIHdlbGw/IC8vIFllcyB0aGlzIHdhcyBhIGJ1ZywgbmVlZCB0byBjaGVjayBjYWNoZSBtaXNzIGZv
ciBSQUQgdGVzdHMsIGJ1dCBzaG91bGQgd2UgY2FyZSBhYm91dCB0aGUgZmFpdGggY2hlY2sgbm93PyBQcm9iYWJseSBub3QuXG4gICAgICAgICAgICAgICAg
aWYoc3RhdGUgPT09IHdhcyAmJiAodmFsID09PSBrbm93biB8fCBMKHZhbCkgPD0gTChrbm93bikpKXsgLypjb25zb2xlLmxvZyhcInNhbWVcIik7Ki8gLypz
YW1lOyovIGlmKCFjdHgubWlzcyl7IHJldHVybiB9IH0gLy8gc2FtZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3R4LnN0dW4rKzsgLy8gVE9ETzog
J2ZvcmdldCcgZmVhdHVyZSBpbiBTRUEgdGllZCB0byB0aGlzLCBiYWQgYXBwcm9hY2gsIGJ1dCBoYWNrZWQgaW4gZm9yIG5vdy4gQW55IGNoYW5nZXMgaGVy
ZSBtdXN0IHVwZGF0ZSB0aGVyZS5cbiAgICAgICAgICAgIHZhciBhaWQgPSBtc2dbJyMnXStjdHguYWxsKyssIGlkID0ge3RvU3RyaW5nOiBmdW5jdGlvbigp
eyByZXR1cm4gYWlkIH0sIF86IGN0eH07IGlkLnRvSlNPTiA9IGlkLnRvU3RyaW5nOyAvLyB0aGlzICp0cmljayogbWFrZXMgaXQgY29tcGF0aWJsZSBiZXR3
ZWVuIG9sZCAmIG5ldyB2ZXJzaW9ucy5cbiAgICAgICAgICAgIHJvb3QuZHVwLnRyYWNrKGlkKVsnIyddID0gbXNnWycjJ107IC8vIGZpeGVzIG5ldyBPSyBh
Y2tzIGZvciBSUEMgbGlrZSBSVEMuXG4gICAgICAgICAgICBEQkcgJiYgKERCRy5waCA9IERCRy5waCB8fCArbmV3IERhdGUpO1xuICAgICAgICAgICAgcm9v
dC5vbigncHV0JywgeycjJzogaWQsICdAJzogbXNnWydAJ10sIHB1dDogeycjJzogc291bCwgJy4nOiBrZXksICc6JzogdmFsLCAnPic6IHN0YXRlfSwgb2s6
IG1zZy5vaywgXzogY3R4fSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWFwKG1zZyl7XG4gICAgICAgICAgICB2YXIgREJHOyBpZihEQkcgPSAo
bXNnLl98fCcnKS5EQkcpeyBEQkcucGEgPSArbmV3IERhdGU7IERCRy5wbSA9IERCRy5wbSB8fCArbmV3IERhdGV9XG4gICAgICAgICAgICB2YXIgZXZlID0g
dGhpcywgcm9vdCA9IGV2ZS5hcywgZ3JhcGggPSByb290LmdyYXBoLCBjdHggPSBtc2cuXywgcHV0ID0gbXNnLnB1dCwgc291bCA9IHB1dFsnIyddLCBrZXkg
PSBwdXRbJy4nXSwgdmFsID0gcHV0Wyc6J10sIHN0YXRlID0gcHV0Wyc+J10sIGlkID0gbXNnWycjJ10sIHRtcDtcbiAgICAgICAgICAgIGlmKCh0bXAgPSBj
dHgubXNnKSAmJiAodG1wID0gdG1wLnB1dCkgJiYgKHRtcCA9IHRtcFtzb3VsXSkpeyBzdGF0ZV9pZnkodG1wLCBrZXksIHN0YXRlLCB2YWwsIHNvdWwpIH0g
Ly8gbmVjZXNzYXJ5ISBvciBlbHNlIG91dCBtZXNzYWdlcyBkbyBub3QgZ2V0IFNFQSB0cmFuc2Zvcm1zLlxuICAgICAgICAgICAgLy92YXIgYnl0ZXMgPSAo
KGdyYXBoW3NvdWxdfHwnJylba2V5XXx8JycpLmxlbmd0aHx8MTtcbiAgICAgICAgICAgIGdyYXBoW3NvdWxdID0gc3RhdGVfaWZ5KGdyYXBoW3NvdWxdLCBr
ZXksIHN0YXRlLCB2YWwsIHNvdWwpO1xuICAgICAgICAgICAgaWYodG1wID0gKHJvb3QubmV4dHx8JycpW3NvdWxdKXtcbiAgICAgICAgICAgICAgICAvL3Rt
cC5ieXRlcyA9ICh0bXAuYnl0ZXN8fDApICsgKCh2YWx8fCcnKS5sZW5ndGh8fDEpIC0gYnl0ZXM7XG4gICAgICAgICAgICAgICAgLy9pZih0bXAuYnl0ZXMg
PiAyKioxMyl7IEd1bi5sb2cub25jZSgnYnl0ZS1saW1pdCcsIFwiTm90ZTogSW4gdGhlIGZ1dHVyZSwgR1VOIHBlZXJzIHdpbGwgZW5mb3JjZSBhIH40S0Ig
cXVlcnkgbGltaXQuIFBsZWFzZSBzZWUgaHR0cHM6Ly9ndW4uZWNvL2RvY3MvUGFnZVwiKSB9XG4gICAgICAgICAgICAgICAgdG1wLm9uKCdpbicsIG1zZylc
biAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpcmUoY3R4KTtcbiAgICAgICAgICAgIGV2ZS50by5uZXh0KG1zZyk7XG4gICAgICAgIH1cbiAgICAgICAg
ZnVuY3Rpb24gZmlyZShjdHgsIG1zZyl7IHZhciByb290O1xuICAgICAgICAgICAgaWYoY3R4LnN0b3ApeyByZXR1cm4gfVxuICAgICAgICAgICAgaWYoMCA8
IC0tY3R4LnN0dW4gJiYgIWN0eC5lcnIpeyByZXR1cm4gfSAvLyBkZWNyZW1lbnQgYWx3YXlzIHJ1bnM7IGVhcmx5LXJldHVybiBvbmx5IGlmIHN0dW4gc3Rp
bGwgcG9zaXRpdmUgQU5EIG5vIGVycm9yLlxuICAgICAgICAgICAgY3R4LnN0b3AgPSAxO1xuICAgICAgICAgICAgaWYoIShyb290ID0gY3R4LnJvb3QpKXsg
cmV0dXJuIH1cbiAgICAgICAgICAgIHZhciB0bXAgPSBjdHgubWF0Y2g7IHRtcC5lbmQgPSAxO1xuICAgICAgICAgICAgaWYodG1wID09PSByb290LmhhdGNo
KXsgaWYoISh0bXAgPSBjdHgubGF0Y2gpIHx8IHRtcC5lbmQpeyBkZWxldGUgcm9vdC5oYXRjaCB9IGVsc2UgeyByb290LmhhdGNoID0gdG1wIH0gfVxuICAg
ICAgICAgICAgY3R4LmhhdGNoICYmIGN0eC5oYXRjaCgpOyAvLyBUT0RPOiByZW5hbWUvcmV3b3JrIGhvdyBwdXQgJiB0aGlzIGludGVyYWN0LlxuICAgICAg
ICAgICAgc2V0VGltZW91dC5lYWNoKGN0eC5tYXRjaCwgZnVuY3Rpb24oY2Ipe2NiICYmIGNiKCl9KTsgXG4gICAgICAgICAgICBpZighKG1zZyA9IGN0eC5t
c2cpIHx8IGN0eC5lcnIgfHwgbXNnLmVycil7IHJldHVybiB9XG4gICAgICAgICAgICBtc2cub3V0ID0gdW5pdmVyc2U7XG4gICAgICAgICAgICBjdHgucm9v
dC5vbignb3V0JywgbXNnKTtcblxuICAgICAgICAgICAgQ0YoKTsgLy8gY291cnRlc3kgY2hlY2s7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gYWNr
KG1zZyl7IC8vIGFnZ3JlZ2F0ZSBBQ0tzLlxuICAgICAgICAgICAgdmFyIGlkID0gbXNnWydAJ10gfHwgJycsIGN0eCwgb2ssIHRtcDtcbiAgICAgICAgICAg
IGlmKCEoY3R4ID0gaWQuXykpe1xuICAgICAgICAgICAgICAgIHZhciBkdXAgPSAoZHVwID0gbXNnLiQpICYmIChkdXAgPSBkdXAuXykgJiYgKGR1cCA9IGR1
cC5yb290KSAmJiAoZHVwID0gZHVwLmR1cCk7XG4gICAgICAgICAgICAgICAgaWYoIShkdXAgPSBkdXAuY2hlY2soaWQpKSl7IHJldHVybiB9XG4gICAgICAg
ICAgICAgICAgbXNnWydAJ10gPSBkdXBbJyMnXSB8fCBtc2dbJ0AnXTsgLy8gVGhpcyBkb2Vzbid0IGRvIGFueXRoaW5nIGFueW1vcmUsIGJhY2t0cmFjayBp
dCB0byBzb21ldGhpbmcgZWxzZT9cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdHguYWNrcyA9IChjdHgu
YWNrc3x8MCkgKyAxO1xuICAgICAgICAgICAgaWYoY3R4LmVyciA9IG1zZy5lcnIpe1xuICAgICAgICAgICAgICAgIG1zZ1snQCddID0gY3R4WycjJ107XG4g
ICAgICAgICAgICAgICAgZmlyZShjdHgpOyAvLyBUT0RPOiBCVUc/IEhvdyBpdCBza2lwcy9zdG9wcyBwcm9wYWdhdGlvbiBvZiBtc2cgaWYgYW55IDEgaXRl
bSBpcyBlcnJvciwgdGhpcyB3b3VsZCBhc3N1bWUgYSB3aG9sZSBiYXRjaC9yZXN5bmMgaGFzIHNhbWUgbWFsaWNpb3VzIGludGVudC5cbiAgICAgICAgICAg
IH1cbiAgICAgICAgICAgIGN0eC5vayA9IG1zZy5vayB8fCBjdHgub2s7XG4gICAgICAgICAgICBpZighY3R4LnN0b3AgJiYgIWN0eC5jcmFjayl7IGN0eC5j
cmFjayA9IGN0eC5tYXRjaCAmJiBjdHgubWF0Y2gucHVzaChmdW5jdGlvbigpe2JhY2soY3R4KX0pIH0gLy8gaGFuZGxlIHN5bmNocm9ub3VzIGFja3MuIE5P
VEU6IElmIGEgc3RvcmFnZSBwZWVyIEFDS3Mgc3luY2hyb25vdXNseSB0aGVuIHRoZSBQVVQgbG9vcCBoYXMgbm90IGV2ZW4gY291bnRlZCB1cCBob3cgbWFu
eSBpdGVtcyBuZWVkIHRvIGJlIHByb2Nlc3NlZCwgc28gY3R4LlNUT1AgZmxhZ3MgdGhpcyBhbmQgYWRkcyBvbmx5IDEgY2FsbGJhY2sgdG8gdGhlIGVuZCBv
ZiB0aGUgUFVUIGxvb3AuXG4gICAgICAgICAgICBiYWNrKGN0eCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gYmFjayhjdHgpe1xuICAgICAgICAg
ICAgaWYoIWN0eCB8fCAhY3R4LnJvb3QpeyByZXR1cm4gfVxuICAgICAgICAgICAgaWYoY3R4LnN0dW4gfHwgKGN0eC5hY2tzfHwwKSAhPT0gY3R4LmFsbCl7
IHJldHVybiB9IC8vIG5vcm1hbGl6ZSBhY2tzOiB1bmRlZmluZWQgdHJlYXRlZCBhcyAwIGJlZm9yZSBmaXJzdCBzdG9yYWdlIGFjayBhcnJpdmVzLlxuICAg
ICAgICAgICAgY3R4LnJvb3Qub24oJ2luJywgeydAJzogY3R4WycjJ10sIGVycjogY3R4LmVyciwgb2s6IGN0eC5lcnI/IHUgOiBjdHgub2sgfHwgeycnOjF9
fSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgRVJSID0gXCJFcnJvcjogSW52YWxpZCBncmFwaCFcIjtcbiAgICAgICAgdmFyIGN1dCA9IGZ1bmN0aW9u
KHMpeyByZXR1cm4gXCIgJ1wiKygnJytzKS5zbGljZSgwLDkpK1wiLi4uJyBcIiB9XG4gICAgICAgIHZhciBMID0gSlNPTi5zdHJpbmdpZnksIE1EID0gMjE0
NzQ4MzY0NywgU3RhdGUgPSBHdW4uc3RhdGU7XG4gICAgICAgIHZhciBIYW0gPSBoYW07IEhhbS5tYXggPSAxMDAwICogNjAgKiA2MCAqIDI0ICogNzsgLy8g
MSB3ZWVrOiBsZWdpdCBjbG9jayBza2V3IGlzIHNlY29uZHMsIG5vdCBkYXlzLlxuICAgICAgICB2YXIgQyA9IDAsIENULCBDRiA9IGZ1bmN0aW9uKCl7aWYo
Qz45OTkgJiYgKEMvLShDVCAtIChDVCA9ICtuZXcgRGF0ZSkpPjEpKXtHdW4ud2luZG93ICYmIGNvbnNvbGUubG9nKFwiV2FybmluZzogWW91J3JlIHN5bmNp
bmcgMUsrIHJlY29yZHMgYSBzZWNvbmQsIGZhc3RlciB0aGFuIERPTSBjYW4gdXBkYXRlIC0gY29uc2lkZXIgbGltaXRpbmcgcXVlcnkuXCIpO0NGPWZ1bmN0
aW9uKCl7Qz0wfX19O1xuXG4gICAgfSgpKTtcblxuICAgIChmdW5jdGlvbigpe1xuICAgICAgICBHdW4ub24uZ2V0ID0gZnVuY3Rpb24obXNnLCBndW4pe1xu
ICAgICAgICAgICAgdmFyIHJvb3QgPSBndW4uXywgZ2V0ID0gbXNnLmdldCwgc291bCA9IGdldFsnIyddLCBub2RlID0gcm9vdC5ncmFwaFtzb3VsXSwgaGFz
ID0gZ2V0WycuJ107XG4gICAgICAgICAgICB2YXIgbmV4dCA9IHJvb3QubmV4dCB8fCAocm9vdC5uZXh0ID0ge30pLCBhdCA9IG5leHRbc291bF07XG5cbiAg
ICAgICAgICAgIC8vIFRPRE86IEF6YXJhdHR1bSBidWcsIHdoYXQgaXMgaW4gZ3JhcGggaXMgbm90IHNhbWUgYXMgd2hhdCBpcyBpbiBuZXh0LiBGaXghXG5c
biAgICAgICAgICAgIC8vIHF1ZXVlIGNvbmN1cnJlbnQgR0VUcz9cbiAgICAgICAgICAgIC8vIFRPRE86IGNvbnNpZGVyIHRhZ2dpbmcgb3JpZ2luYWwgbWVz
c2FnZSBpbnRvIGR1cCBmb3IgREFNLlxuICAgICAgICAgICAgLy8gVE9ETzogXiBhYm92ZT8gSW4gY2hhdCBhcHAsIDEyIG1lc3NhZ2VzIHJlc3VsdGVkIGlu
IHNhbWUgcGVlciBhc2tpbmcgZm9yIGAjdXNlci5wdWJgIDEyIHRpbWVzLiAoc2FtZSB3aXRoICN1c2VyIEdFVCB0b28sIHlpcGVzISkgLy8gREFNIG5vdGU6
IFRoaXMgYWxzbyByZXN1bHRlZCBpbiAxMiByZXBsaWVzIGZyb20gMSBwZWVyIHdoaWNoIGFsbCBoYWQgc2FtZSAjI2hhc2ggYnV0IG5vbmUgb2YgdGhlbSBk
ZWR1cGVkIGJlY2F1c2UgZWFjaCBnZXQgd2FzIGRpZmZlcmVudC5cbiAgICAgICAgICAgIC8vIFRPRE86IE1vdmluZyBxdWljayBoYWNrcyBmaXhpbmcgdGhl
c2UgdGhpbmdzIHRvIGF4ZSBmb3Igbm93LlxuICAgICAgICAgICAgLy8gVE9ETzogYSBsb3Qgb2YgR0VUICNmb28gdGhlbiBHRVQgI2Zvby5cIlwiIGhhcHBl
bmluZywgd2h5P1xuICAgICAgICAgICAgLy8gVE9ETzogREFNJ3MgIyMgaGFzaCBjaGVjaywgb24gc2FtZSBnZXQgQUNLLCBwcm9kdWNpbmcgbXVsdGlwbGUg
cmVwbGllcyBzdGlsbCwgbWF5YmUgSlNPTiB2cyBZU09OP1xuICAgICAgICAgICAgLy8gVE1QIG5vdGUgZm9yIG5vdzogdmlNWnExc2xHIHdhcyBjaGF0IExF
WCBxdWVyeSAjLlxuICAgICAgICAgICAgLyppZihndW4gIT09ICh0bXAgPSBtc2cuJCkgJiYgKHRtcCA9ICh0bXB8fCcnKS5fKSl7XG4gICAgICAgICAgICAg
ICAgaWYodG1wLlEpeyB0bXAuUVttc2dbJyMnXV0gPSAnJzsgcmV0dXJuIH0gLy8gY2hhaW4gZG9lcyBub3QgbmVlZCB0byBhc2sgZm9yIGl0IGFnYWluLlxu
ICAgICAgICAgICAgICAgIHRtcC5RID0ge307XG4gICAgICAgICAgICB9Ki9cbiAgICAgICAgICAgIC8qaWYodSA9PT0gaGFzKXtcbiAgICAgICAgICAgICAg
ICBpZihhdC5RKXtcbiAgICAgICAgICAgICAgICAgICAgLy9hdC5RW21zZ1snIyddXSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAvL3JldHVybjtcbiAg
ICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXQuUSA9IHt9O1xuICAgICAgICAgICAgfSovXG4gICAgICAgICAgICB2YXIgY3R4ID0gbXNnLl98
fHt9LCBEQkcgPSBjdHguREJHID0gbXNnLkRCRztcbiAgICAgICAgICAgIERCRyAmJiAoREJHLmcgPSArbmV3IERhdGUpO1xuICAgICAgICAgICAgLy9jb25z
b2xlLmxvZyhcIkdFVDpcIiwgZ2V0LCBub2RlLCBoYXMsIGF0KTtcbiAgICAgICAgICAgIC8vaWYoIW5vZGUgJiYgIWF0KXsgcmV0dXJuIHJvb3Qub24oJ2dl
dCcsIG1zZykgfVxuICAgICAgICAgICAgLy9pZihoYXMgJiYgbm9kZSl7IC8vIHJlcGxhY2UgMiBiZWxvdyBsaW5lcyB0byBjb250aW51ZSBkZXY/XG4gICAg
ICAgICAgICBpZighbm9kZSl7IHJldHVybiByb290Lm9uKCdnZXQnLCBtc2cpIH1cbiAgICAgICAgICAgIGlmKGhhcyl7XG4gICAgICAgICAgICAgICAgaWYo
J3N0cmluZycgIT0gdHlwZW9mIGhhcyB8fCB1ID09PSBub2RlW2hhc10pe1xuICAgICAgICAgICAgICAgICAgICBpZighKChhdHx8JycpLm5leHR8fCcnKVto
YXNdKXsgcm9vdC5vbignZ2V0JywgbXNnKTsgcmV0dXJuIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbm9kZSA9IHN0YXRlX2lmeSh7
fSwgaGFzLCBzdGF0ZV9pcyhub2RlLCBoYXMpLCBub2RlW2hhc10sIHNvdWwpO1xuICAgICAgICAgICAgICAgIC8vIElmIHdlIGhhdmUgYSBrZXkgaW4tbWVt
b3J5LCBkbyB3ZSByZWFsbHkgbmVlZCB0byBmZXRjaD9cbiAgICAgICAgICAgICAgICAvLyBNYXliZS4uLiBpbiBjYXNlIHRoZSBpbi1tZW1vcnkga2V5IHdl
IGhhdmUgaXMgYSBsb2NhbCB3cml0ZVxuICAgICAgICAgICAgICAgIC8vIHdlIHN0aWxsIG5lZWQgdG8gdHJpZ2dlciBhIHB1bGwvbWVyZ2UgZnJvbSBwZWVy
cy5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vR3VuLndpbmRvdz8gR3VuLm9iai5jb3B5KG5vZGUpIDogbm9kZTsgLy8gSE5QRVJGOiBJZiAhYnJv
d3NlciBidW1wIFBlcmZvcm1hbmNlPyBJcyB0aGlzIHRvbyBkYW5nZXJvdXMgdG8gcmVmZXJlbmNlIHJvb3QgZ3JhcGg/IENvcHkgLyBzaGFsbG93IGNvcHkg
dG9vIGV4cGVuc2l2ZSBmb3IgYmlnIG5vZGVzLiBHdW4ub2JqLnRvKG5vZGUpOyAvLyAxIGxheWVyIGRlZXAgY29weSAvLyBHdW4ub2JqLmNvcHkobm9kZSk7
IC8vIHRvbyBzbG93IG9uIGJpZyBub2Rlc1xuICAgICAgICAgICAgbm9kZSAmJiBhY2sobXNnLCBub2RlKTtcbiAgICAgICAgICAgIHJvb3Qub24oJ2dldCcs
IG1zZyk7IC8vIHNlbmQgR0VUIHRvIHN0b3JhZ2UgYWRhcHRlcnMuXG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gYWNrKG1zZywgbm9kZSl7XG4gICAg
ICAgICAgICB2YXIgUyA9ICtuZXcgRGF0ZSwgY3R4ID0gbXNnLl98fHt9LCBEQkcgPSBjdHguREJHID0gbXNnLkRCRztcbiAgICAgICAgICAgIHZhciB0byA9
IG1zZ1snIyddLCBpZCA9IHRleHRfcmFuZCg5KSwga2V5cyA9IE9iamVjdC5rZXlzKG5vZGV8fCcnKS5zb3J0KCksIHNvdWwgPSAoKG5vZGV8fCcnKS5ffHwn
JylbJyMnXSwga2wgPSBrZXlzLmxlbmd0aCwgaiA9IDAsIHJvb3QgPSBtc2cuJC5fLnJvb3QsIEYgPSAobm9kZSA9PT0gcm9vdC5ncmFwaFtzb3VsXSk7XG4g
ICAgICAgICAgICBjb25zb2xlLlNUQVQgJiYgY29uc29sZS5TVEFUKFMsICgoREJHfHxjdHgpLmdrID0gK25ldyBEYXRlKSAtIFMsICdnb3Qga2V5cycpO1xu
ICAgICAgICAgICAgLy8gUEVSRjogQ29uc2lkZXIgY29tbWVudGluZyB0aGlzIG91dCB0byBmb3JjZSBkaXNrLW9ubHkgcmVhZHMgZm9yIHBlcmYgdGVzdGlu
Zz8gLy8gVE9ETzogLmtleXMoIGlzIHNsb3dcbiAgICAgICAgICAgIG5vZGUgJiYgKGZ1bmN0aW9uIGdvKCl7XG4gICAgICAgICAgICAgICAgUyA9ICtuZXcg
RGF0ZTtcbiAgICAgICAgICAgICAgICB2YXIgaSA9IDAsIGssIHB1dCA9IHt9LCB0bXA7XG4gICAgICAgICAgICAgICAgd2hpbGUoaSA8IDkgJiYgKGsgPSBr
ZXlzW2krK10pKXtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVfaWZ5KHB1dCwgaywgc3RhdGVfaXMobm9kZSwgayksIG5vZGVba10sIHNvdWwpO1xuICAg
ICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBrZXlzID0ga2V5cy5zbGljZShpKTtcbiAgICAgICAgICAgICAgICAodG1wID0ge30pW3NvdWxdID0g
cHV0OyBwdXQgPSB0bXA7XG4gICAgICAgICAgICAgICAgdmFyIGZhaXRoOyBpZihGKXsgZmFpdGggPSBmdW5jdGlvbigpe307IGZhaXRoLnJhbSA9IGZhaXRo
LmZhaXRoID0gdHJ1ZTsgfSAvLyBITlBFUkY6IFdlJ3JlIHRlc3RpbmcgcGVyZm9ybWFuY2UgaW1wcm92ZW1lbnQgYnkgc2tpcHBpbmcgZ29pbmcgdGhyb3Vn
aCBzZWN1cml0eSBhZ2FpbiwgYnV0IHRoaXMgc2hvdWxkIGJlIGF1ZGl0ZWQuXG4gICAgICAgICAgICAgICAgdG1wID0ga2V5cy5sZW5ndGg7XG4gICAgICAg
ICAgICAgICAgY29uc29sZS5TVEFUICYmIGNvbnNvbGUuU1RBVChTLCAtKFMgLSAoUyA9ICtuZXcgRGF0ZSkpLCAnZ290IGNvcGllZCBzb21lJyk7XG4gICAg
ICAgICAgICAgICAgREJHICYmIChEQkcuZ2EgPSArbmV3IERhdGUpO1xuICAgICAgICAgICAgICAgIHJvb3Qub24oJ2luJywgeydAJzogdG8sICcjJzogaWQs
IHB1dDogcHV0LCAnJSc6ICh0bXA/IChpZCA9IHRleHRfcmFuZCg5KSkgOiB1KSwgJDogcm9vdC4kLCBfOiBmYWl0aCwgREJHOiBEQkd9KTtcbiAgICAgICAg
ICAgICAgICBjb25zb2xlLlNUQVQgJiYgY29uc29sZS5TVEFUKFMsICtuZXcgRGF0ZSAtIFMsICdnb3QgaW4nKTtcbiAgICAgICAgICAgICAgICBpZighdG1w
KXsgcmV0dXJuIH1cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0LnR1cm4oZ28pO1xuICAgICAgICAgICAgfSgpKTtcbiAgICAgICAgICAgIGlmKCFub2Rl
KXsgcm9vdC5vbignaW4nLCB7J0AnOiBtc2dbJyMnXX0pIH0gLy8gVE9ETzogSSBkb24ndCB0aGluayBJIGxpa2UgdGhpcywgdGhlIGRlZmF1bHQgbFMgYWRh
cHRlciB1c2VzIHRoaXMgYnV0IFwibm90IGZvdW5kXCIgaXMgYSBzZW5zaXRpdmUgaXNzdWUsIHNvIHNob3VsZCBwcm9iYWJseSBiZSBoYW5kbGVkIG1vcmUg
Y2FyZWZ1bGx5L2luZGl2aWR1YWxseS5cbiAgICAgICAgfSBHdW4ub24uZ2V0LmFjayA9IGFjaztcbiAgICB9KCkpO1xuXG4gICAgKGZ1bmN0aW9uKCl7XG4g
ICAgICAgIEd1bi5jaGFpbi5vcHQgPSBmdW5jdGlvbihvcHQpe1xuICAgICAgICAgICAgb3B0ID0gb3B0IHx8IHt9O1xuICAgICAgICAgICAgdmFyIGd1biA9
IHRoaXMsIGF0ID0gZ3VuLl8sIHRtcCA9IG9wdC5wZWVycyB8fCBvcHQ7XG4gICAgICAgICAgICBpZighT2JqZWN0LnBsYWluKG9wdCkpeyBvcHQgPSB7fSB9
XG4gICAgICAgICAgICBpZighT2JqZWN0LnBsYWluKGF0Lm9wdCkpeyBhdC5vcHQgPSBvcHQgfVxuICAgICAgICAgICAgaWYoJ3N0cmluZycgPT0gdHlwZW9m
IHRtcCl7IHRtcCA9IFt0bXBdIH1cbiAgICAgICAgICAgIGlmKCFPYmplY3QucGxhaW4oYXQub3B0LnBlZXJzKSl7IGF0Lm9wdC5wZWVycyA9IHt9fVxuICAg
ICAgICAgICAgaWYodG1wIGluc3RhbmNlb2YgQXJyYXkpe1xuICAgICAgICAgICAgICAgIG9wdC5wZWVycyA9IHt9O1xuICAgICAgICAgICAgICAgIHRtcC5m
b3JFYWNoKGZ1bmN0aW9uKHVybCl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwID0ge307IHAuaWQgPSBwLnVybCA9IHVybDtcbiAgICAgICAgICAgICAg
ICAgICAgb3B0LnBlZXJzW3VybF0gPSBhdC5vcHQucGVlcnNbdXJsXSA9IGF0Lm9wdC5wZWVyc1t1cmxdIHx8IHA7XG4gICAgICAgICAgICAgICAgfSlcbiAg
ICAgICAgICAgIH1cbiAgICAgICAgICAgIG9ial9lYWNoKG9wdCwgZnVuY3Rpb24gZWFjaChrKXsgdmFyIHYgPSB0aGlzW2tdO1xuICAgICAgICAgICAgICAg
IGlmKCh0aGlzICYmIHRoaXMuaGFzT3duUHJvcGVydHkoaykpIHx8ICdzdHJpbmcnID09IHR5cGVvZiB2IHx8IE9iamVjdC5lbXB0eSh2KSl7IHRoaXNba10g
PSB2OyByZXR1cm4gfVxuICAgICAgICAgICAgICAgIGlmKHYgJiYgdi5jb25zdHJ1Y3RvciAhPT0gT2JqZWN0ICYmICEodiBpbnN0YW5jZW9mIEFycmF5KSl7
IHJldHVybiB9XG4gICAgICAgICAgICAgICAgb2JqX2VhY2godiwgZWFjaCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGF0Lm9wdC5mcm9tID0g
b3B0O1xuICAgICAgICAgICAgR3VuLm9uKCdvcHQnLCBhdCk7XG4gICAgICAgICAgICBhdC5vcHQudXVpZCA9IGF0Lm9wdC51dWlkIHx8IGZ1bmN0aW9uIHV1
aWQobCl7IHJldHVybiBHdW4uc3RhdGUoKS50b1N0cmluZygzNikucmVwbGFjZSgnLicsJycpICsgU3RyaW5nLnJhbmRvbShsfHwxMikgfVxuICAgICAgICAg
ICAgcmV0dXJuIGd1bjtcbiAgICAgICAgfVxuICAgIH0oKSk7XG5cbiAgICB2YXIgb2JqX2VhY2ggPSBmdW5jdGlvbihvLGYpeyBPYmplY3Qua2V5cyhvKS5m
b3JFYWNoKGYsbykgfSwgdGV4dF9yYW5kID0gU3RyaW5nLnJhbmRvbSwgdHVybiA9IHNldFRpbWVvdXQudHVybiwgdmFsaWQgPSBHdW4udmFsaWQsIHN0YXRl
X2lzID0gR3VuLnN0YXRlLmlzLCBzdGF0ZV9pZnkgPSBHdW4uc3RhdGUuaWZ5LCB1LCBlbXB0eSA9IHt9LCBDO1xuXG4gICAgR3VuLmxvZyA9IGZ1bmN0aW9u
KCl7IHJldHVybiAoIUd1bi5sb2cub2ZmICYmIEMubG9nLmFwcGx5KEMsIGFyZ3VtZW50cykpLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykuam9pbignICcp
IH07XG4gICAgR3VuLmxvZy5vbmNlID0gZnVuY3Rpb24odyxzLG8peyByZXR1cm4gKG8gPSBHdW4ubG9nLm9uY2UpW3ddID0gb1t3XSB8fCAwLCBvW3ddKysg
fHwgR3VuLmxvZyhzKSB9O1xuXG4gICAgKCh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2Ygd2luZG93ID09PSBcInVuZGVm
aW5lZFwiICYmIHR5cGVvZiBXb3JrZXJHbG9iYWxTY29wZSAhPT0gXCJ1bmRlZmluZWRcIikgPyAoKGdsb2JhbFRoaXMuR1VOID0gZ2xvYmFsVGhpcy5HdW4g
PSBHdW4pLndpbmRvdyA9IGdsb2JhbFRoaXMpIDogKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyAoKHdpbmRvdy5HVU4gPSB3aW5kb3cuR3Vu
ID0gR3VuKS53aW5kb3cgPSB3aW5kb3cpIDogdW5kZWZpbmVkKSk7XG4gICAgKChnbG9iYWxUaGlzLkdVTiA9IGdsb2JhbFRoaXMuR3VuID0gR3VuKS5nbG9i
YWxUaGlzID0gZ2xvYmFsVGhpcyk7XG4gICAgdHJ5eyBpZih0eXBlb2YgTU9EVUxFICE9PSBcInVuZGVmaW5lZFwiKXsgTU9EVUxFLmV4cG9ydHMgPSBHdW4g
fSB9Y2F0Y2goZSl7fVxuICAgIF9fZGVmYXVsdEV4cG9ydCA9IEd1bjtcblxuICAgIChHdW4ud2luZG93fHx7fSkuY29uc29sZSA9IChHdW4ud2luZG93fHx7
fSkuY29uc29sZSB8fCB7bG9nOiBmdW5jdGlvbigpe319O1xuICAgIChDID0gY29uc29sZSkub25seSA9IGZ1bmN0aW9uKGksIHMpeyByZXR1cm4gKEMub25s
eS5pICYmIGkgPT09IEMub25seS5pICYmIEMub25seS5pKyspICYmIChDLmxvZy5hcHBseShDLCBhcmd1bWVudHMpIHx8IHMpIH07XG59KCkpO1xuZXhwb3J0
IGRlZmF1bHQgX19kZWZhdWx0RXhwb3J0OyIsInNyYy9ndW4vYmFjay5qcyI6ImltcG9ydCBfX3Jvb3QgZnJvbSAnLi9yb290LmpzJztcbihmdW5jdGlvbigp
e1xuXG52YXIgR3VuID0gX19yb290O1xuR3VuLmNoYWluLmJhY2sgPSBmdW5jdGlvbihuLCBvcHQpeyB2YXIgdG1wO1xuXHRuID0gbiB8fCAxO1xuXHRpZigt
MSA9PT0gbiB8fCBJbmZpbml0eSA9PT0gbil7XG5cdFx0cmV0dXJuIHRoaXMuXy5yb290LiQ7XG5cdH0gZWxzZVxuXHRpZigxID09PSBuKXtcblx0XHRyZXR1
cm4gKHRoaXMuXy5iYWNrIHx8IHRoaXMuXykuJDtcblx0fVxuXHR2YXIgZ3VuID0gdGhpcywgYXQgPSBndW4uXztcblx0aWYodHlwZW9mIG4gPT09ICdzdHJp
bmcnKXtcblx0XHRuID0gbi5zcGxpdCgnLicpO1xuXHR9XG5cdGlmKG4gaW5zdGFuY2VvZiBBcnJheSl7XG5cdFx0dmFyIGkgPSAwLCBsID0gbi5sZW5ndGgs
IHRtcCA9IGF0O1xuXHRcdGZvcihpOyBpIDwgbDsgaSsrKXtcblx0XHRcdHRtcCA9ICh0bXB8fGVtcHR5KVtuW2ldXTtcblx0XHR9XG5cdFx0aWYodSAhPT0g
dG1wKXtcblx0XHRcdHJldHVybiBvcHQ/IGd1biA6IHRtcDtcblx0XHR9IGVsc2Vcblx0XHRpZigodG1wID0gYXQuYmFjaykpe1xuXHRcdFx0cmV0dXJuIHRt
cC4kLmJhY2sobiwgb3B0KTtcblx0XHR9XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGlmKCdmdW5jdGlvbicgPT0gdHlwZW9mIG4pe1xuXHRcdHZhciB5ZXMsIHRt
cCA9IHtiYWNrOiBhdH07XG5cdFx0d2hpbGUoKHRtcCA9IHRtcC5iYWNrKVxuXHRcdCYmIHUgPT09ICh5ZXMgPSBuKHRtcCwgb3B0KSkpe31cblx0XHRyZXR1
cm4geWVzO1xuXHR9XG5cdGlmKCdudW1iZXInID09IHR5cGVvZiBuKXtcblx0XHRyZXR1cm4gKGF0LmJhY2sgfHwgYXQpLiQuYmFjayhuIC0gMSk7XG5cdH1c
blx0cmV0dXJuIHRoaXM7XG59XG52YXIgZW1wdHkgPSB7fSwgdTtcblx0XG59KCkpOyIsInNyYy9ndW4vY2hhaW4uanMiOiJpbXBvcnQgX19yb290IGZyb20g
Jy4vcm9vdC5qcyc7XG4oZnVuY3Rpb24oKXtcblxuLy8gV0FSTklORzogR1VOIGlzIHZlcnkgc2ltcGxlLCBidXQgdGhlIEphdmFTY3JpcHQgY2hhaW5pbmcg
QVBJIGFyb3VuZCBHVU5cbi8vIGlzIGNvbXBsaWNhdGVkIGFuZCB3YXMgZXh0cmVtZWx5IGhhcmQgdG8gYnVpbGQuIElmIHlvdSBwb3J0IEdVTiB0byBhbm90
aGVyXG4vLyBsYW5ndWFnZSwgY29uc2lkZXIgaW1wbGVtZW50aW5nIGFuIGVhc2llciBBUEkgdG8gYnVpbGQuXG52YXIgR3VuID0gX19yb290O1xuR3VuLmNo
YWluLmNoYWluID0gZnVuY3Rpb24oc3ViKXtcblx0dmFyIGd1biA9IHRoaXMsIGF0ID0gZ3VuLl8sIGNoYWluID0gbmV3IChzdWIgfHwgZ3VuKS5jb25zdHJ1
Y3RvcihndW4pLCBjYXQgPSBjaGFpbi5fLCByb290O1xuXHRjYXQucm9vdCA9IHJvb3QgPSBhdC5yb290O1xuXHRjYXQuaWQgPSArK3Jvb3Qub25jZTtcblx0
Y2F0LmJhY2sgPSBndW4uXztcblx0Y2F0Lm9uID0gR3VuLm9uO1xuXHRjYXQub24oJ2luJywgR3VuLm9uLmluLCBjYXQpOyAvLyBGb3IgJ2luJyBpZiBJIGFk
ZCBteSBvd24gbGlzdGVuZXJzIHRvIGVhY2ggdGhlbiBJIE1VU1QgZG8gaXQgYmVmb3JlIGluIGdldHMgY2FsbGVkLiBJZiBJIGxpc3RlbiBnbG9iYWxseSBm
b3IgYWxsIGluY29taW5nIGRhdGEgaW5zdGVhZCB0aG91Z2gsIHJlZ2FyZGxlc3Mgb2YgaW5kaXZpZHVhbCBsaXN0ZW5lcnMsIEkgY2FuIHRyYW5zZm9ybSB0
aGUgZGF0YSB0aGVyZSBhbmQgdGhlbiBhcyB3ZWxsLlxuXHRjYXQub24oJ291dCcsIEd1bi5vbi5vdXQsIGNhdCk7IC8vIEhvd2V2ZXIgZm9yIG91dHB1dCwg
dGhlcmUgaXNuJ3QgcmVhbGx5IHRoZSBnbG9iYWwgb3B0aW9uLiBJIG11c3QgbGlzdGVuIGJ5IGFkZGluZyBteSBvd24gbGlzdGVuZXIgaW5kaXZpZHVhbGx5
IEJFRk9SRSB0aGlzIG9uZSBpcyBldmVyIGNhbGxlZC5cblx0cmV0dXJuIGNoYWluO1xufVxuXG5mdW5jdGlvbiBvdXRwdXQobXNnKXtcblx0dmFyIHB1dCwg
Z2V0LCBhdCA9IHRoaXMuYXMsIGJhY2sgPSBhdC5iYWNrLCByb290ID0gYXQucm9vdCwgdG1wO1xuXHRpZighbXNnLiQpeyBtc2cuJCA9IGF0LiQgfVxuXHR0
aGlzLnRvLm5leHQobXNnKTtcblx0aWYoYXQuZXJyKXsgYXQub24oJ2luJywge3B1dDogYXQucHV0ID0gdSwgJDogYXQuJH0pOyByZXR1cm4gfVxuXHRpZihn
ZXQgPSBtc2cuZ2V0KXtcblx0XHQvKmlmKHUgIT09IGF0LnB1dCl7XG5cdFx0XHRhdC5vbignaW4nLCBhdCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fSovXG5c
dFx0aWYocm9vdC5wYXNzKXsgcm9vdC5wYXNzW2F0LmlkXSA9IGF0OyB9IC8vIHdpbGwgdGhpcyBtYWtlIGZvciBidWdneSBiZWhhdmlvciBlbHNld2hlcmU/
XG5cdFx0aWYoYXQubGV4KXsgT2JqZWN0LmtleXMoYXQubGV4KS5mb3JFYWNoKGZ1bmN0aW9uKGspeyB0bXBba10gPSBhdC5sZXhba10gfSwgdG1wID0gbXNn
LmdldCA9IG1zZy5nZXQgfHwge30pIH1cblx0XHRpZihnZXRbJyMnXSB8fCBhdC5zb3VsKXtcblx0XHRcdGdldFsnIyddID0gZ2V0WycjJ10gfHwgYXQuc291
bDtcblx0XHRcdC8vcm9vdC5ncmFwaFtnZXRbJyMnXV0gPSByb290LmdyYXBoW2dldFsnIyddXSB8fCB7Xzp7JyMnOmdldFsnIyddLCc+Jzp7fX19O1xuXHRc
dFx0bXNnWycjJ10gfHwgKG1zZ1snIyddID0gdGV4dF9yYW5kKDkpKTsgLy8gQTMxMjAgP1xuXHRcdFx0YmFjayA9IChzZ2V0KHJvb3QsIGdldFsnIyddKS5f
KTtcblx0XHRcdGlmKCEoZ2V0ID0gZ2V0WycuJ10pKXsgLy8gc291bFxuXHRcdFx0XHR0bXAgPSBiYWNrLmFzayAmJiBiYWNrLmFza1snJ107IC8vIGNoZWNr
IGlmIHdlIGhhdmUgYWxyZWFkeSBhc2tlZCBmb3IgdGhlIGZ1bGwgbm9kZVxuXHRcdFx0XHQoYmFjay5hc2sgfHwgKGJhY2suYXNrID0ge30pKVsnJ10gPSBi
YWNrOyAvLyBhZGQgYSBmbGFnIHRoYXQgd2UgYXJlIG5vdy5cblx0XHRcdFx0aWYodSAhPT0gYmFjay5wdXQpeyAvLyBpZiB3ZSBhbHJlYWR5IGhhdmUgZGF0
YSxcblx0XHRcdFx0XHRiYWNrLm9uKCdpbicsIGJhY2spOyAvLyBzZW5kIHdoYXQgaXMgY2FjaGVkIGRvd24gdGhlIGNoYWluXG5cdFx0XHRcdFx0aWYodG1w
KXsgcmV0dXJuIH0gLy8gYW5kIGRvbid0IGFzayBmb3IgaXQgYWdhaW4uXG5cdFx0XHRcdH1cblx0XHRcdFx0bXNnLiQgPSBiYWNrLiQ7XG5cdFx0XHR9IGVs
c2Vcblx0XHRcdGlmKG9ial9oYXMoYmFjay5wdXQsIGdldCkpeyAvLyBUT0RPOiBzdXBwb3J0ICNMRVggIVxuXHRcdFx0XHR0bXAgPSBiYWNrLmFzayAmJiBi
YWNrLmFza1tnZXRdO1xuXHRcdFx0XHQoYmFjay5hc2sgfHwgKGJhY2suYXNrID0ge30pKVtnZXRdID0gYmFjay4kLmdldChnZXQpLl87XG5cdFx0XHRcdGJh
Y2sub24oJ2luJywge2dldDogZ2V0LCBwdXQ6IHsnIyc6IGJhY2suc291bCwgJy4nOiBnZXQsICc6JzogYmFjay5wdXRbZ2V0XSwgJz4nOiBzdGF0ZV9pcyhy
b290LmdyYXBoW2JhY2suc291bF0sIGdldCl9fSk7XG5cdFx0XHRcdGlmKHRtcCl7IHJldHVybiB9XG5cdFx0XHR9XG5cdFx0XHRcdC8qcHV0ID0gKGJhY2su
JC5nZXQoZ2V0KS5fKTtcblx0XHRcdFx0aWYoISh0bXAgPSBwdXQuYWNrKSl7IHB1dC5hY2sgPSAtMSB9XG5cdFx0XHRcdGJhY2sub24oJ2luJywge1xuXHRc
dFx0XHRcdCQ6IGJhY2suJCxcblx0XHRcdFx0XHRwdXQ6IEd1bi5zdGF0ZS5pZnkoe30sIGdldCwgR3VuLnN0YXRlKGJhY2sucHV0LCBnZXQpLCBiYWNrLnB1
dFtnZXRdKSxcblx0XHRcdFx0XHRnZXQ6IGJhY2suZ2V0XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRpZih0bXApeyByZXR1cm4gfVxuXHRcdFx0fSBlbHNlXG5c
dFx0XHRpZignc3RyaW5nJyAhPSB0eXBlb2YgZ2V0KXtcblx0XHRcdFx0dmFyIHB1dCA9IHt9LCBtZXRhID0gKGJhY2sucHV0fHx7fSkuXztcblx0XHRcdFx0
R3VuLm9iai5tYXAoYmFjay5wdXQsIGZ1bmN0aW9uKHYsayl7XG5cdFx0XHRcdFx0aWYoIUd1bi50ZXh0Lm1hdGNoKGssIGdldCkpeyByZXR1cm4gfVxuXHRc
dFx0XHRcdHB1dFtrXSA9IHY7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdGlmKCFHdW4ub2JqLmVtcHR5KHB1dCkpe1xuXHRcdFx0XHRcdHB1dC5fID0gbWV0YTtc
blx0XHRcdFx0XHRiYWNrLm9uKCdpbicsIHskOiBiYWNrLiQsIHB1dDogcHV0LCBnZXQ6IGJhY2suZ2V0fSlcblx0XHRcdFx0fVxuXHRcdFx0XHRpZih0bXAg
PSBhdC5sZXgpe1xuXHRcdFx0XHRcdHRtcCA9ICh0bXAuXykgfHwgKHRtcC5fID0gZnVuY3Rpb24oKXt9KTtcblx0XHRcdFx0XHRpZihiYWNrLmFjayA8IHRt
cC5hc2speyB0bXAuYXNrID0gYmFjay5hY2sgfVxuXHRcdFx0XHRcdGlmKHRtcC5hc2speyByZXR1cm4gfVxuXHRcdFx0XHRcdHRtcC5hc2sgPSAxO1xuXHRc
dFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQqL1xuXHRcdFx0cm9vdC5hc2soYWNrLCBtc2cpOyAvLyBBMzEyMCA/XG5cdFx0XHRyZXR1cm4gcm9vdC5vbignaW4n
LCBtc2cpO1xuXHRcdH1cblx0XHQvL2lmKHJvb3Qubm93KXsgcm9vdC5ub3dbYXQuaWRdID0gcm9vdC5ub3dbYXQuaWRdIHx8IHRydWU7IGF0LnBhc3MgPSB7
fSB9XG5cdFx0aWYoZ2V0WycuJ10pe1xuXHRcdFx0aWYoYXQuZ2V0KXtcblx0XHRcdFx0bXNnID0ge2dldDogeycuJzogYXQuZ2V0fSwgJDogYXQuJH07XG5c
dFx0XHRcdChiYWNrLmFzayB8fCAoYmFjay5hc2sgPSB7fSkpW2F0LmdldF0gPSBtc2cuJC5fOyAvLyBUT0RPOiBQRVJGT1JNQU5DRT8gTW9yZSBlbGVnYW50
IHdheT9cblx0XHRcdFx0cmV0dXJuIGJhY2sub24oJ291dCcsIG1zZyk7XG5cdFx0XHR9XG5cdFx0XHRtc2cgPSB7Z2V0OiBhdC5sZXg/IG1zZy5nZXQgOiB7
fSwgJDogYXQuJH07XG5cdFx0XHRyZXR1cm4gYmFjay5vbignb3V0JywgbXNnKTtcblx0XHR9XG5cdFx0KGF0LmFzayB8fCAoYXQuYXNrID0ge30pKVsnJ10g
PSBhdDtcdCAvL2F0LmFjayA9IGF0LmFjayB8fCAtMTtcblx0XHRpZihhdC5nZXQpe1xuXHRcdFx0Z2V0WycuJ10gPSBhdC5nZXQ7XG5cdFx0XHQoYmFjay5h
c2sgfHwgKGJhY2suYXNrID0ge30pKVthdC5nZXRdID0gbXNnLiQuXzsgLy8gVE9ETzogUEVSRk9STUFOQ0U/IE1vcmUgZWxlZ2FudCB3YXk/XG5cdFx0XHRy
ZXR1cm4gYmFjay5vbignb3V0JywgbXNnKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGJhY2sub24oJ291dCcsIG1zZyk7XG59OyBHdW4ub24ub3V0ID0gb3V0
cHV0O1xuXG5mdW5jdGlvbiBpbnB1dChtc2csIGNhdCl7IGNhdCA9IGNhdCB8fCB0aGlzLmFzOyAvLyBUT0RPOiBWOCBtYXkgbm90IGJlIGFibGUgdG8gb3B0
aW1pemUgZnVuY3Rpb25zIHdpdGggZGlmZmVyZW50IHBhcmFtZXRlciBjYWxscywgc28gdHJ5IHRvIGRvIGJlbmNobWFyayB0byBzZWUgaWYgdGhlcmUgaXMg
YW55IGFjdHVhbCBkaWZmZXJlbmNlLlxuXHR2YXIgcm9vdCA9IGNhdC5yb290LCBndW4gPSBtc2cuJCB8fCAobXNnLiQgPSBjYXQuJCksIGF0ID0gKGd1bnx8
JycpLl8gfHwgZW1wdHksIHRtcCA9IG1zZy5wdXR8fCcnLCBzb3VsID0gdG1wWycjJ10sIGtleSA9IHRtcFsnLiddLCBjaGFuZ2UgPSAodSAhPT0gdG1wWyc9
J10pPyB0bXBbJz0nXSA6IHRtcFsnOiddLCBzdGF0ZSA9IHRtcFsnPiddIHx8IC1JbmZpbml0eSwgc2F0OyAvLyBldmUgPSBldmVudCwgYXQgPSBkYXRhIGF0
LCBjYXQgPSBjaGFpbiBhdCwgc2F0ID0gc3ViIGF0IChjaGlsZHJlbiBjaGFpbnMpLlxuXHRpZih1ICE9PSBtc2cucHV0ICYmICh1ID09PSB0bXBbJyMnXSB8
fCB1ID09PSB0bXBbJy4nXSB8fCAodSA9PT0gdG1wWyc6J10gJiYgdSA9PT0gdG1wWyc9J10pIHx8IHUgPT09IHRtcFsnPiddKSl7IC8vIGNvbnZlcnQgZnJv
bSBvbGQgZm9ybWF0XG5cdFx0aWYoIXZhbGlkKHRtcCkpe1xuXHRcdFx0aWYoIShzb3VsID0gKCh0bXB8fCcnKS5ffHwnJylbJyMnXSkpeyBjb25zb2xlLmxv
ZyhcImNoYWluIG5vdCB5ZXQgc3VwcG9ydGVkIGZvclwiLCB0bXAsICcuLi4nLCBtc2csIGNhdCk7IHJldHVybjsgfVxuXHRcdFx0Z3VuID0gc2dldChjYXQu
cm9vdCwgc291bCk7XG5cdFx0XHRyZXR1cm4gc2V0VGltZW91dC5lYWNoKE9iamVjdC5rZXlzKHRtcCkuc29ydCgpLCBmdW5jdGlvbihrKXsgLy8gVE9ETzog
LmtleXMoIGlzIHNsb3cgLy8gQlVHPyA/U29tZSByZS1pbiBsb2dpYyBtYXkgZGVwZW5kIG9uIHRoaXMgYmVpbmcgc3luYz9cblx0XHRcdFx0aWYoJ18nID09
IGsgfHwgdSA9PT0gKHN0YXRlID0gc3RhdGVfaXModG1wLCBrKSkpeyByZXR1cm4gfVxuXHRcdFx0XHRjYXQub24oJ2luJywgeyQ6IGd1biwgcHV0OiB7JyMn
OiBzb3VsLCAnLic6IGssICc9JzogdG1wW2tdLCAnPic6IHN0YXRlfSwgVklBOiBtc2d9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRjYXQub24oJ2luJywg
eyQ6IGF0LmJhY2suJCwgcHV0OiB7JyMnOiBzb3VsID0gYXQuYmFjay5zb3VsLCAnLic6IGtleSA9IGF0LmhhcyB8fCBhdC5nZXQsICc9JzogdG1wLCAnPic6
IHN0YXRlX2lzKGF0LmJhY2sucHV0LCBrZXkpfSwgdmlhOiBtc2d9KTsgLy8gVE9ETzogVGhpcyBjb3VsZCBiZSBidWdneSEgSXQgYXNzdW1lcy9hcHByb3hl
cyBkYXRhLCBvdGhlciBzdHVmZiBjb3VsZCBoYXZlIGNvcnJ1cHRlZCBpdC5cblx0XHRyZXR1cm47XG5cdH1cblx0aWYoKG1zZy5zZWVufHwnJylbY2F0Lmlk
XSl7IHJldHVybiB9IChtc2cuc2VlbiB8fCAobXNnLnNlZW4gPSBmdW5jdGlvbigpe30pKVtjYXQuaWRdID0gY2F0OyAvLyBoZWxwIHN0b3Agc29tZSBpbmZp
bml0ZSBsb29wc1xuXG5cdGlmKGNhdCAhPT0gYXQpeyAvLyBkb24ndCB3b3JyeSBhYm91dCB0aGlzIHdoZW4gZmlyc3QgdW5kZXJzdGFuZGluZyB0aGUgY29k
ZSwgaXQgaGFuZGxlcyBjaGFuZ2luZyBjb250ZXh0cyBvbiBhIG1lc3NhZ2UuIEEgc291bCBjaGFpbiB3aWxsIG5ldmVyIGhhdmUgYSBkaWZmZXJlbnQgY29u
dGV4dC5cblx0XHRPYmplY3Qua2V5cyhtc2cpLmZvckVhY2goZnVuY3Rpb24oayl7IHRtcFtrXSA9IG1zZ1trXSB9LCB0bXAgPSB7fSk7IC8vIG1ha2UgY29w
eSBvZiBtZXNzYWdlXG5cdFx0dG1wLmdldCA9IGNhdC5nZXQgfHwgdG1wLmdldDtcblx0XHRpZighY2F0LnNvdWwgJiYgIWNhdC5oYXMpeyAvLyBpZiB3ZSBk
byBub3QgcmVjb2duaXplIHRoZSBjaGFpbiB0eXBlXG5cdFx0XHR0bXAuJCQkID0gdG1wLiQkJCB8fCBjYXQuJDsgLy8gbWFrZSBhIHJlZmVyZW5jZSB0byB3
aGVyZXZlciBpdCBjYW1lIGZyb20uXG5cdFx0fSBlbHNlXG5cdFx0aWYoYXQuc291bCl7IC8vIGEgaGFzIChwcm9wZXJ0eSkgY2hhaW4gd2lsbCBoYXZlIGEg
ZGlmZmVyZW50IGNvbnRleHQgc29tZXRpbWVzIGlmIGl0IGlzIGxpbmtlZCAodG8gYSBzb3VsIGNoYWluKS4gQW55dGhpbmcgdGhhdCBpcyBub3QgYSBzb3Vs
IG9yIGhhcyBjaGFpbiwgd2lsbCBhbHdheXMgaGF2ZSBkaWZmZXJlbnQgY29udGV4dHMuXG5cdFx0XHR0bXAuJCA9IGNhdC4kO1xuXHRcdFx0dG1wLiQkID0g
dG1wLiQkIHx8IGF0LiQ7XG5cdFx0fVxuXHRcdG1zZyA9IHRtcDsgLy8gdXNlIHRoZSBtZXNzYWdlIHdpdGggdGhlIG5ldyBjb250ZXh0IGluc3RlYWQ7XG5c
dH1cblx0dW5saW5rKG1zZywgY2F0KTtcblxuXHRpZigoKChjYXQuc291bCkvKiAmJiAoY2F0LmFza3x8JycpWycnXSovKSB8fCBtc2cuJCQpICYmIHN0YXRl
ID49IHN0YXRlX2lzKHJvb3QuZ3JhcGhbc291bF0sIGtleSkpeyAvLyBUaGUgcm9vdCBoYXMgYW4gaW4tbWVtb3J5IGNhY2hlIG9mIHRoZSBncmFwaCwgYnV0
IGlmIG91ciBwZWVyIGhhcyBhc2tlZCBmb3IgdGhlIGRhdGEgdGhlbiB3ZSB3YW50IGEgcGVyIGRlZHVwbGljYXRlZCBjaGFpbiBjb3B5IG9mIHRoZSBkYXRh
IHRoYXQgbWlnaHQgaGF2ZSBsb2NhbCBlZGl0cyBvbiBpdC5cblx0XHQodG1wID0gc2dldChyb290LCBzb3VsKS5fKS5wdXQgPSBzdGF0ZV9pZnkodG1wLnB1
dCwga2V5LCBzdGF0ZSwgY2hhbmdlLCBzb3VsKTtcblx0fVxuXHRpZighYXQuc291bCAvKiYmIChhdC5hc2t8fCcnKVsnJ10qLyAmJiBzdGF0ZSA+PSBzdGF0
ZV9pcyhyb290LmdyYXBoW3NvdWxdLCBrZXkpICYmIChzYXQgPSAoc2dldChyb290LCBzb3VsKS5fLm5leHR8fCcnKVtrZXldKSl7IC8vIFNhbWUgYXMgYWJv
dmUgaGVyZSwgYnV0IGZvciBvdGhlciB0eXBlcyBvZiBjaGFpbnMuIC8vIFRPRE86IEltcHJvdmUgcGVyZiBieSBwcmV2ZW50aW5nIGVjaG9lcyByZWNhY2hp
bmcuXG5cdFx0c2F0LnB1dCA9IGNoYW5nZTsgLy8gdXBkYXRlIGNhY2hlXG5cdFx0aWYoJ3N0cmluZycgPT0gdHlwZW9mICh0bXAgPSB2YWxpZChjaGFuZ2Up
KSl7XG5cdFx0XHRzYXQucHV0ID0gc2dldChyb290LCB0bXApLl8ucHV0IHx8IGNoYW5nZTsgLy8gc2hhcmUgc2FtZSBjYWNoZSBhcyB3aGF0IHdlJ3JlIGxp
bmtpbmcgdG8uXG5cdFx0fVxuXHR9XG5cblx0dGhpcy50byAmJiB0aGlzLnRvLm5leHQobXNnKTsgLy8gMXN0IEFQSSBqb2IgaXMgdG8gY2FsbCBhbGwgY2hh
aW4gbGlzdGVuZXJzLlxuXHQvLyBUT0RPOiBNYWtlIGlucHV0IG1vcmUgcmV1c2FibGUgYnkgb25seSBkb2luZyB0aGVzZSAoc29tZT8pIGNhbGxzIGlmIHdl
IGFyZSBhIGNoYWluIHdlIHJlY29nbml6ZT8gVGhpcyBtZWFucyBlYWNoIGlucHV0IGxpc3RlbmVyIHdvdWxkIGJlIHJlc3BvbnNpYmxlIGZvciB3aGVuIGxp
c3RlbmVycyBuZWVkIHRvIGJlIGNhbGxlZCwgd2hpY2ggbWFrZXMgc2Vuc2UsIGFzIHRoZXkgbWlnaHQgd2FudCB0byBmaWx0ZXIuXG5cdGNhdC5hbnkgJiYg
c2V0VGltZW91dC5lYWNoKE9iamVjdC5rZXlzKGNhdC5hbnkpLCBmdW5jdGlvbihhbnkpeyAoYW55ID0gY2F0LmFueVthbnldKSAmJiBhbnkobXNnKSB9LDAs
OTkpOyAvLyAxc3QgQVBJIGpvYiBpcyB0byBjYWxsIGFsbCBjaGFpbiBsaXN0ZW5lcnMuIC8vIFRPRE86IC5rZXlzKCBpcyBzbG93IC8vIEJVRzogU29tZSBy
ZS1pbiBsb2dpYyBtYXkgZGVwZW5kIG9uIHRoaXMgYmVpbmcgc3luYy5cblx0Y2F0LmVjaG8gJiYgc2V0VGltZW91dC5lYWNoKE9iamVjdC5rZXlzKGNhdC5l
Y2hvKSwgZnVuY3Rpb24obGF0KXsgKGxhdCA9IGNhdC5lY2hvW2xhdF0pICYmIGxhdC5vbignaW4nLCBtc2cpIH0sMCw5OSk7IC8vICYgbGlua2VkIGF0IGNo
YWlucyAvLyBUT0RPOiAua2V5cyggaXMgc2xvdyAvLyBCVUc6IFNvbWUgcmUtaW4gbG9naWMgbWF5IGRlcGVuZCBvbiB0aGlzIGJlaW5nIHN5bmMuXG5cblx0
aWYoKChtc2cuJCR8fCcnKS5ffHxhdCkuc291bCl7IC8vIGNvbW1lbnRzIGFyZSBsaW5lYXIsIGJ1dCB0aGlzIGxpbmUgb2YgY29kZSBpcyBub24tbGluZWFy
LCBzbyBpZiBJIHdlcmUgdG8gY29tbWVudCB3aGF0IGl0IGRvZXMsIHlvdSdkIGhhdmUgdG8gcmVhZCA0MiBvdGhlciBjb21tZW50cyBmaXJzdC4uLiBidXQg
eW91IGNhbid0IHJlYWQgYW55IG9mIHRob3NlIGNvbW1lbnRzIHVudGlsIHlvdSBmaXJzdCByZWFkIHRoaXMgY29tbWVudC4gV2hhdCE/IC8vIHNob3VsZG4n
dCB0aGlzIG1hdGNoIGxpbmsncyBjaGVjaz9cblx0XHQvLyBpcyB0aGVyZSBjYXNlcyB3aGVyZSBpdCBpcyBhICQkIHRoYXQgd2UgZG8gTk9UIHdhbnQgdG8g
ZG8gdGhlIGZvbGxvd2luZz8gXG5cdFx0aWYoKHNhdCA9IGNhdC5uZXh0KSAmJiAoc2F0ID0gc2F0W2tleV0pKXsgLy8gVE9ETzogcG9zc2libGUgdHJpY2s/
IE1heWJlIGhhdmUgYGlvbm1hcGAgY29kZSBzZXQgYSBzYXQ/IC8vIFRPRE86IE1heWJlIHdlIHNob3VsZCBkbyBgY2F0LmFza2AgaW5zdGVhZD8gSSBndWVz
cyBkb2VzIG5vdCBtYXR0ZXIuXG5cdFx0XHR0bXAgPSB7fTsgT2JqZWN0LmtleXMobXNnKS5mb3JFYWNoKGZ1bmN0aW9uKGspeyB0bXBba10gPSBtc2dba10g
fSk7XG5cdFx0XHR0bXAuJCA9IChtc2cuJCR8fG1zZy4kKS5nZXQodG1wLmdldCA9IGtleSk7IGRlbGV0ZSB0bXAuJCQ7IGRlbGV0ZSB0bXAuJCQkO1xuXHRc
dFx0c2F0Lm9uKCdpbicsIHRtcCk7XG5cdFx0fVxuXHR9XG5cblx0bGluayhtc2csIGNhdCk7XG59OyBHdW4ub24uaW4gPSBpbnB1dDtcblxuZnVuY3Rpb24g
bGluayhtc2csIGNhdCl7IGNhdCA9IGNhdCB8fCB0aGlzLmFzIHx8IG1zZy4kLl87XG5cdGlmKG1zZy4kJCAmJiB0aGlzICE9PSBHdW4ub24peyByZXR1cm4g
fSAvLyAkJCBtZWFucyB3ZSBjYW1lIGZyb20gYSBsaW5rLCBzbyB3ZSBhcmUgYXQgdGhlIHdyb25nIGxldmVsLCB0aHVzIGlnbm9yZSBpdCB1bmxlc3Mgb3Zl
cnJ1bGVkIG1hbnVhbGx5IGJ5IGJlaW5nIGNhbGxlZCBkaXJlY3RseS5cblx0aWYoIW1zZy5wdXQgfHwgY2F0LnNvdWwpeyByZXR1cm4gfSAvLyBCdXQgeW91
IGNhbm5vdCBvdmVycnVsZSBiZWluZyBsaW5rZWQgdG8gbm90aGluZywgb3IgdHJ5aW5nIHRvIGxpbmsgYSBzb3VsIGNoYWluIC0gdGhhdCBtdXN0IG5ldmVy
IGhhcHBlbi5cblx0dmFyIHB1dCA9IG1zZy5wdXR8fCcnLCBsaW5rID0gcHV0Wyc9J118fHB1dFsnOiddLCB0bXA7XG5cdHZhciByb290ID0gY2F0LnJvb3Qs
IHRhdCA9IHNnZXQocm9vdCwgcHV0WycjJ10pLmdldChwdXRbJy4nXSkuXztcblx0aWYoJ3N0cmluZycgIT0gdHlwZW9mIChsaW5rID0gdmFsaWQobGluaykp
KXtcblx0XHRpZih0aGlzID09PSBHdW4ub24peyAodGF0LmVjaG8gfHwgKHRhdC5lY2hvID0ge30pKVtjYXQuaWRdID0gY2F0IH0gLy8gYWxsb3cgc29tZSBj
aGFpbiB0byBleHBsaWNpdGx5IGZvcmNlIGxpbmtpbmcgdG8gc2ltcGxlIGRhdGEuXG5cdFx0cmV0dXJuOyAvLyBieSBkZWZhdWx0IGRvIG5vdCBsaW5rIHRv
IGRhdGEgdGhhdCBpcyBub3QgYSBsaW5rLlxuXHR9XG5cdGlmKCh0YXQuZWNobyB8fCAodGF0LmVjaG8gPSB7fSkpW2NhdC5pZF0gLy8gd2UndmUgYWxyZWFk
eSBsaW5rZWQgb3Vyc2VsdmVzIHNvIHdlIGRvIG5vdCBuZWVkIHRvIGRvIGl0IGFnYWluLiBFeGNlcHQuLi4gKGFubm95aW5nIGltcGxlbWVudGF0aW9uIGRl
dGFpbHMpXG5cdFx0JiYgIShyb290LnBhc3N8fCcnKVtjYXQuaWRdKXsgcmV0dXJuIH0gLy8gaWYgYSBuZXcgZXZlbnQgbGlzdGVuZXIgd2FzIGFkZGVkLCB3
ZSBuZWVkIHRvIG1ha2UgYSBwYXNzIHRocm91Z2ggZm9yIGl0LiBUaGUgcGFzcyB3aWxsIGJlIG9uIHRoZSBjaGFpbiwgbm90IGFsd2F5cyB0aGUgY2hhaW4g
cGFzc2VkIGRvd24uIFxuXHRpZih0bXAgPSByb290LnBhc3MpeyBpZih0bXBbbGluaytjYXQuaWRdKXsgcmV0dXJuIH0gdG1wW2xpbmsrY2F0LmlkXSA9IDEg
fSAvLyBCdXQgdGhlIGFib3ZlIGVkZ2UgY2FzZSBtYXkgXCJwYXNzIHRocm91Z2hcIiBvbiBhIGNpcmN1bGFyIGdyYXBoIGNhdXNpbmcgaW5maW5pdGUgcGFz
c2VzLCBzbyB3ZSBoYWNraWx5IGFkZCBhIHRlbXBvcmFyeSBjaGVjayBmb3IgdGhhdC5cblxuXHQodGF0LmVjaG98fCh0YXQuZWNobz17fSkpW2NhdC5pZF0g
PSBjYXQ7IC8vIHNldCBvdXJzZWxmIHVwIGZvciB0aGUgZWNobyEgLy8gVE9ETzogQlVHPyBFY2hvIHRvIHNlbGYgbm8gbG9uZ2VyIGNhdXNlcyBwcm9ibGVt
cz8gQ29uZmlybS5cblxuXHRpZihjYXQuaGFzKXsgY2F0LmxpbmsgPSBsaW5rIH1cblx0dmFyIHNhdCA9IHNnZXQocm9vdCwgdGF0LmxpbmsgPSBsaW5rKS5f
OyAvLyBncmFiIHdoYXQgd2UncmUgbGlua2luZyB0by5cblx0KHNhdC5lY2hvIHx8IChzYXQuZWNobyA9IHt9KSlbdGF0LmlkXSA9IHRhdDsgLy8gbGluayBp
dC5cblx0dmFyIHRtcCA9IGNhdC5hc2t8fCcnOyAvLyBhc2sgdGhlIGNoYWluIGZvciB3aGF0IG5lZWRzIHRvIGJlIGxvYWRlZCBuZXh0IVxuXHRpZih0bXBb
JyddIHx8IGNhdC5sZXgpeyAvLyB3ZSBtaWdodCBuZWVkIHRvIGxvYWQgdGhlIHdob2xlIHRoaW5nIC8vIFRPRE86IGNhdC5sZXggcHJvYmFibHkgaGFzIGVk
Z2UgY2FzZSBidWdzIHRvIGl0LCBuZWVkIG1vcmUgdGVzdCBjb3ZlcmFnZS5cblx0XHRzYXQub24oJ291dCcsIHtnZXQ6IHsnIyc6IGxpbmt9fSk7XG5cdH1c
blx0c2V0VGltZW91dC5lYWNoKE9iamVjdC5rZXlzKHRtcCksIGZ1bmN0aW9uKGdldCwgc2F0KXsgLy8gaWYgc3ViIGNoYWlucyBhcmUgYXNraW5nIGZvciBk
YXRhLiAvLyBUT0RPOiAua2V5cyggaXMgc2xvdyAvLyBCVUc/ID9Tb21lIHJlLWluIGxvZ2ljIG1heSBkZXBlbmQgb24gdGhpcyBiZWluZyBzeW5jP1xuXHRc
dGlmKCFnZXQgfHwgIShzYXQgPSB0bXBbZ2V0XSkpeyByZXR1cm4gfVxuXHRcdHNhdC5vbignb3V0Jywge2dldDogeycjJzogbGluaywgJy4nOiBnZXR9fSk7
IC8vIGdvIGdldCBpdC5cblx0fSwwLDk5KTtcbn07IEd1bi5vbi5saW5rID0gbGluaztcblxuZnVuY3Rpb24gdW5saW5rKG1zZywgY2F0KXsgLy8gdWdoLCBz
byBtdWNoIGNvZGUgZm9yIHNlZW1pbmdseSBlZGdlIGNhc2UgYmVoYXZpb3IuXG5cdHZhciBwdXQgPSBtc2cucHV0fHwnJywgY2hhbmdlID0gKHUgIT09IHB1
dFsnPSddKT8gcHV0Wyc9J10gOiBwdXRbJzonXSwgcm9vdCA9IGNhdC5yb290LCBsaW5rLCB0bXA7XG5cdGlmKHUgPT09IGNoYW5nZSl7IC8vIDFzdCBlZGdl
IGNhc2U6IElmIHdlIGhhdmUgYSBicmFuZCBuZXcgZGF0YWJhc2UsIG5vIGRhdGEgd2lsbCBiZSBmb3VuZC5cblx0XHQvLyBUT0RPOiBCVUchIGJlY2F1c2Ug
ZW1wdHlpbmcgY2FjaGUgY291bGQgYmUgYXN5bmMgZnJvbSBiZWxvdywgbWFrZSBzdXJlIHdlIGFyZSBub3QgZW1wdHlpbmcgYSBuZXdlciBjYWNoZS4gU28g
bWF5YmUgcGFzcyBhbiBBc3luYyBJRCB0byBjaGVjayBhZ2FpbnN0P1xuXHRcdC8vIFRPRE86IEJVRyEgV2hhdCBpZiB0aGlzIGlzIGEgbWFwPyAvLyBXYXJu
aW5nISBDbGVhcmluZyB0aGluZ3Mgb3V0IG5lZWRzIHRvIGJlIHJvYnVzdCBhZ2FpbnN0IHN5bmMvYXN5bmMgb3BzLCBvciBlbHNlIHlvdSdsbCBzZWUgYG1h
cCB2YWwgZ2V0IHB1dGAgdGVzdCBjYXRhc3Ryb3BoaWNhbGx5IGZhaWwgYmVjYXVzZSBtYXAgYXR0ZW1wdHMgdG8gbGluayB3aGVuIHBhcmVudCBncmFwaCBp
cyBzdHJlYW1lZCBiZWZvcmUgY2hpbGQgdmFsdWUgZ2V0cyBzZXQuIE5lZWQgdG8gZGlmZmVyZW50aWF0ZSBiZXR3ZWVuIGxhY2sgYWNrcyBhbmQgZm9yY2Ug
Y2xlYXJpbmcuXG5cdFx0aWYoY2F0LnNvdWwgJiYgdSAhPT0gY2F0LnB1dCl7IHJldHVybiB9IC8vIGRhdGEgbWF5IG5vdCBiZSBmb3VuZCBvbiBhIHNvdWws
IGJ1dCBpZiBhIHNvdWwgYWxyZWFkeSBoYXMgZGF0YSwgdGhlbiBub3RoaW5nIGNhbiBjbGVhciB0aGUgc291bCBhcyBhIHdob2xlLlxuXHRcdC8vaWYoIWNh
dC5oYXMpeyByZXR1cm4gfVxuXHRcdHRtcCA9IChtc2cuJCR8fG1zZy4kfHwnJykuX3x8Jyc7XG5cdFx0aWYobXNnWydAJ10gJiYgKHUgIT09IHRtcC5wdXQg
fHwgdSAhPT0gY2F0LnB1dCkpeyByZXR1cm4gfSAvLyBhIFwibm90IGZvdW5kXCIgZnJvbSBvdGhlciBwZWVycyBzaG91bGQgbm90IGNsZWFyIG91dCBkYXRh
IGlmIHdlIGhhdmUgYWxyZWFkeSBmb3VuZCBpdC5cblx0XHQvL2lmKGNhdC5oYXMgJiYgdSA9PT0gY2F0LnB1dCAmJiAhKHJvb3QucGFzc3x8JycpW2NhdC5p
ZF0peyByZXR1cm4gfSAvLyBpZiB3ZSBhcmUgYWxyZWFkeSB1bmxpbmtlZCwgZG8gbm90IGNhbGwgYWdhaW4sIHVubGVzcyBlZGdlIGNhc2UuIC8vIFRPRE86
IEJVRyEgVGhpcyBsaW5lIHNob3VsZCBiZSBkZWxldGVkIGZvciBcInVubGluayBkZWVwbHkgbmVzdGVkXCIuXG5cdFx0aWYobGluayA9IGNhdC5saW5rIHx8
IG1zZy5saW5rZWQpe1xuXHRcdFx0ZGVsZXRlIChzZ2V0KHJvb3QsIGxpbmspLl8uZWNob3x8JycpW2NhdC5pZF07XG5cdFx0fVxuXHRcdGlmKGNhdC5oYXMp
eyAvLyBUT0RPOiBFbXB0eSBvdXQgbGlua3MsIG1hcHMsIGVjaG9zLCBhY2tzL2Fza3MsIGV0Yy4/XG5cdFx0XHRjYXQubGluayA9IG51bGw7XG5cdFx0fVxu
XHRcdGNhdC5wdXQgPSB1OyAvLyBlbXB0eSBvdXQgdGhlIGNhY2hlIGlmLCBmb3IgZXhhbXBsZSwgYWxpY2UncyBjYXIncyBjb2xvciBubyBsb25nZXIgZXhp
c3RzIChyZWxhdGl2ZSB0byBhbGljZSkgaWYgYWxpY2Ugbm8gbG9uZ2VyIGhhcyBhIGNhci5cblx0XHQvLyBUT0RPOiBCVUchIEZvciBtYXBzLCBwcm94eSB0
aGlzIHNvIHRoZSBpbmRpdmlkdWFsIHN1YiBpcyB0cmlnZ2VyZWQsIG5vdCBhbGwgc3Vicy5cblx0XHRzZXRUaW1lb3V0LmVhY2goT2JqZWN0LmtleXMoY2F0
Lm5leHR8fCcnKSwgZnVuY3Rpb24oZ2V0LCBzYXQpeyAvLyBlbXB0eSBvdXQgYWxsIHN1YiBjaGFpbnMuIC8vIFRPRE86IC5rZXlzKCBpcyBzbG93IC8vIEJV
Rz8gP1NvbWUgcmUtaW4gbG9naWMgbWF5IGRlcGVuZCBvbiB0aGlzIGJlaW5nIHN5bmM/IC8vIFRPRE86IEJVRz8gVGhpcyB3aWxsIHRyaWdnZXIgZGVlcGVy
IHB1dCBmaXJzdCwgZG9lcyBwdXQgbG9naWMgZGVwZW5kIG9uIG5lc3RlZCBvcmRlcj8gLy8gVE9ETzogQlVHISBGb3IgbWFwLCB0aGlzIG5lZWRzIHRvIGJl
IHRoZSBpc29sYXRlZCBjaGlsZCwgbm90IGFsbCBvZiB0aGVtLlxuXHRcdFx0aWYoIShzYXQgPSBjYXQubmV4dFtnZXRdKSl7IHJldHVybiB9XG5cdFx0XHQv
L2lmKGNhdC5oYXMgJiYgdSA9PT0gc2F0LnB1dCAmJiAhKHJvb3QucGFzc3x8JycpW3NhdC5pZF0peyByZXR1cm4gfSAvLyBpZiB3ZSBhcmUgYWxyZWFkeSB1
bmxpbmtlZCwgZG8gbm90IGNhbGwgYWdhaW4sIHVubGVzcyBlZGdlIGNhc2UuIC8vIFRPRE86IEJVRyEgVGhpcyBsaW5lIHNob3VsZCBiZSBkZWxldGVkIGZv
ciBcInVubGluayBkZWVwbHkgbmVzdGVkXCIuXG5cdFx0XHRpZihsaW5rKXsgZGVsZXRlIChzZ2V0KHJvb3QsIGxpbmspLmdldChnZXQpLl8uZWNob3x8Jycp
W3NhdC5pZF0gfVxuXHRcdFx0c2F0Lm9uKCdpbicsIHtnZXQ6IGdldCwgcHV0OiB1LCAkOiBzYXQuJH0pOyAvLyBUT0RPOiBCVUc/IEFkZCByZWN1cnNpdmUg
c2VlbiBjaGVjaz9cblx0XHR9LDAsOTkpO1xuXHRcdHJldHVybjtcblx0fVxuXHRpZihjYXQuc291bCl7IHJldHVybiB9IC8vIGEgc291bCBjYW5ub3QgdW5s
aW5rIGl0c2VsZi5cblx0aWYobXNnLiQkKXsgcmV0dXJuIH0gLy8gYSBsaW5rZWQgY2hhaW4gZG9lcyBub3QgZG8gdGhlIHVubGlua2luZywgdGhlIHN1YiBj
aGFpbiBkb2VzLiAvLyBUT0RPOiBCVUc/IFdpbGwgdGhpcyBjYW5jZWwgbWFwcz9cblx0bGluayA9IHZhbGlkKGNoYW5nZSk7IC8vIG5lZWQgdG8gdW5saW5r
IGFueXRpbWUgd2UgYXJlIG5vdCB0aGUgc2FtZSBsaW5rLCB0aG91Z2ggb25seSBkbyB0aGlzIG9uY2UgcGVyIHVubGluayAoYW5kIG5vdCBvbiBpbml0KS5c
blx0dG1wID0gbXNnLiQuX3x8Jyc7XG5cdGlmKGxpbmsgPT09IHRtcC5saW5rIHx8IChjYXQuaGFzICYmICF0bXAubGluaykpe1xuXHRcdGlmKChyb290LnBh
c3N8fCcnKVtjYXQuaWRdICYmICdzdHJpbmcnICE9PSB0eXBlb2YgbGluayl7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxu
XHRkZWxldGUgKHRtcC5lY2hvfHwnJylbY2F0LmlkXTtcblx0dW5saW5rKHtnZXQ6IGNhdC5nZXQsIHB1dDogdSwgJDogbXNnLiQsIGxpbmtlZDogbXNnLmxp
bmtlZCA9IG1zZy5saW5rZWQgfHwgdG1wLmxpbmt9LCBjYXQpOyAvLyB1bmxpbmsgb3VyIHN1YiBjaGFpbnMuXG59OyBHdW4ub24udW5saW5rID0gdW5saW5r
O1xuXG5mdW5jdGlvbiBhY2sobXNnLCBldil7XG5cdC8vaWYoIW1zZ1snJSddICYmICh0aGlzfHwnJykub2ZmKXsgdGhpcy5vZmYoKSB9IC8vIGRvIE5PVCBt
ZW1vcnkgbGVhaywgdHVybiBvZmYgbGlzdGVuZXJzISBOb3cgaGFuZGxlZCBieSAuYXNrIGl0c2VsZlxuXHQvLyBtYW5oYXR0YW46XG5cdHZhciBhcyA9IHRo
aXMuYXMsIGF0ID0gYXMuJC5fLCByb290ID0gYXQucm9vdCwgZ2V0ID0gYXMuZ2V0fHwnJywgdG1wID0gKG1zZy5wdXR8fCcnKVtnZXRbJyMnXV18fCcnO1xu
XHRpZighbXNnLnB1dCB8fCAoJ3N0cmluZycgPT0gdHlwZW9mIGdldFsnLiddICYmIHUgPT09IHRtcFtnZXRbJy4nXV0pKXtcblx0XHRpZih1ICE9PSBhdC5w
dXQpeyByZXR1cm4gfVxuXHRcdGlmKCFhdC5zb3VsICYmICFhdC5oYXMpeyByZXR1cm4gfSAvLyBUT0RPOiBCVUc/IEZvciBub3csIG9ubHkgY29yZS1jaGFp
bnMgd2lsbCBoYW5kbGUgbm90LWZvdW5kcywgYmVjYXVzZSBidWdzIGNyZWVwIGluIGlmIG5vbi1jb3JlIGNoYWlucyBhcmUgdXNlZCBhcyAkIGJ1dCB3ZSBj
YW4gcmV2aXNpdCB0aGlzIGxhdGVyIGZvciBtb3JlIHBvd2VyZnVsIGV4dGVuc2lvbnMuXG5cdFx0YXQuYWNrID0gKGF0LmFjayB8fCAwKSArIDE7XG5cdFx0
YXQub24oJ2luJywge1xuXHRcdFx0Z2V0OiBhdC5nZXQsXG5cdFx0XHRwdXQ6IGF0LnB1dCA9IHUsXG5cdFx0XHQkOiBhdC4kLFxuXHRcdFx0J0AnOiBtc2db
J0AnXVxuXHRcdH0pO1xuXHRcdC8qKHRtcCA9IGF0LlEpICYmIHNldFRpbWVvdXQuZWFjaChPYmplY3Qua2V5cyh0bXApLCBmdW5jdGlvbihpZCl7IC8vIFRP
RE86IFRlbXBvcmFyeSB0ZXN0aW5nLCBub3QgaW50ZWdyYXRlZCBvciBiZWluZyB1c2VkLCBwcm9iYWJseSBkZWxldGUuXG5cdFx0XHRPYmplY3Qua2V5cyht
c2cpLmZvckVhY2goZnVuY3Rpb24oayl7IHRtcFtrXSA9IG1zZ1trXSB9LCB0bXAgPSB7fSk7IHRtcFsnQCddID0gaWQ7IC8vIGNvcHkgbWVzc2FnZVxuXHRc
dFx0cm9vdC5vbignaW4nLCB0bXApO1xuXHRcdH0pOyBkZWxldGUgYXQuUTsqL1xuXHRcdHJldHVybjtcblx0fVxuXHQobXNnLl98fHt9KS5taXNzID0gMTtc
blx0R3VuLm9uLnB1dChtc2cpO1xuXHRyZXR1cm47IC8vIGVvbVxufVxuXG52YXIgZW1wdHkgPSB7fSwgdSwgdGV4dF9yYW5kID0gU3RyaW5nLnJhbmRvbSwg
dmFsaWQgPSBHdW4udmFsaWQsIG9ial9oYXMgPSBmdW5jdGlvbihvLCBrKXsgcmV0dXJuIG8gJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5j
YWxsKG8sIGspIH0sIHN0YXRlID0gR3VuLnN0YXRlLCBzdGF0ZV9pcyA9IHN0YXRlLmlzLCBzdGF0ZV9pZnkgPSBzdGF0ZS5pZnk7XG5mdW5jdGlvbiBzZ2V0
KHJvb3QsIHNvdWwpeyByb290Ll9zbCA9IDE7IHZhciBnID0gcm9vdC4kLmdldChzb3VsKTsgcm9vdC5fc2wgPSAwOyByZXR1cm4gZyB9XG5cdFxufSgpKTsi
LCJzcmMvZ3VuL2dldC5qcyI6ImltcG9ydCBfX3Jvb3QgZnJvbSAnLi9yb290LmpzJztcbihmdW5jdGlvbigpe1xuXG52YXIgR3VuID0gX19yb290O1xuR3Vu
LmNoYWluLmdldCA9IGZ1bmN0aW9uKGtleSwgY2IsIGFzKXtcblx0dmFyIGd1biwgdG1wO1xuXHRpZih0eXBlb2Yga2V5ID09PSAnc3RyaW5nJyl7XG5cdFx0
aWYoa2V5Lmxlbmd0aCA9PSAwKSB7XHRcblx0XHRcdChndW4gPSB0aGlzLmNoYWluKCkpLl8uZXJyID0ge2VycjogR3VuLmxvZygnMCBsZW5ndGgga2V5IScs
IGtleSl9O1xuXHRcdFx0aWYoY2IpeyBjYi5jYWxsKGd1biwgZ3VuLl8uZXJyKSB9XG5cdFx0XHRyZXR1cm4gZ3VuO1xuXHRcdH1cblx0XHR2YXIgYmFjayA9
IHRoaXMsIGNhdCA9IGJhY2suXztcblx0XHR2YXIgbmV4dCA9IGNhdC5uZXh0IHx8IGVtcHR5O1xuXHRcdGlmKGJhY2sgPT09IGNhdC5yb290LiQgJiYga2V5
LmluZGV4T2YoJy8nKSA+PSAwICYmICFjYXQucm9vdC5fc2wgJiYgIWNhdC5yb290LmdyYXBoW2tleV0pe1xuXHRcdFx0dmFyIHBhcnRzID0ga2V5LnNwbGl0
KCcvJyksIGkgPSAwLCBjdXIgPSBiYWNrLl8sIG9rID0gMTtcblx0XHRcdHdoaWxlKGkgPCBwYXJ0cy5sZW5ndGgpe1xuXHRcdFx0XHRpZighKChjdXIubmV4
dHx8e30pW3BhcnRzW2ldXSkpeyBvayA9IDA7IGJyZWFrIH1cblx0XHRcdFx0Y3VyID0gY3VyLm5leHRbcGFydHNbaSsrXV0uJC5fOyBcblx0XHRcdH1cblx0
XHRcdGlmKG9rKXtcblx0XHRcdFx0dmFyIG5hdiA9IGJhY2s7IGkgPSAwO1xuXHRcdFx0XHR3aGlsZShpIDwgcGFydHMubGVuZ3RoKXsgbmF2ID0gbmF2Lmdl
dChwYXJ0c1tpKytdKSB9XG5cdFx0XHRcdHJldHVybiBuYXY7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKCEoZ3VuID0gbmV4dFtrZXldKSl7XG5cdFx0XHRn
dW4gPSBrZXkgJiYgY2FjaGUoa2V5LCBiYWNrKTtcblx0XHR9XG5cdFx0Z3VuID0gZ3VuICYmIGd1bi4kO1xuXHR9IGVsc2Vcblx0aWYoJ2Z1bmN0aW9uJyA9
PSB0eXBlb2Yga2V5KXtcblx0XHRpZih0cnVlID09PSBjYil7IHJldHVybiBzb3VsKHRoaXMsIGtleSwgY2IsIGFzKSwgdGhpcyB9XG5cdFx0Z3VuID0gdGhp
cztcblx0XHR2YXIgY2F0ID0gZ3VuLl8sIG9wdCA9IGNiIHx8IHt9LCByb290ID0gY2F0LnJvb3QsIGlkO1xuXHRcdG9wdC5hdCA9IGNhdDtcblx0XHRvcHQu
b2sgPSBrZXk7XG5cdFx0dmFyIHdhaXQgPSB7fTsgLy8gY2FuIHdlIGFzc2lnbiB0aGlzIHRvIHRoZSBhdCBpbnN0ZWFkLCBsaWtlIGluIG9uY2U/XG5cdFx0
Ly92YXIgcGF0aCA9IFtdOyBjYXQuJC5iYWNrKGF0ID0+IHsgYXQuZ2V0ICYmIHBhdGgucHVzaChhdC5nZXQuc2xpY2UoMCw5KSl9KTsgcGF0aCA9IHBhdGgu
cmV2ZXJzZSgpLmpvaW4oJy4nKTtcblx0XHRmdW5jdGlvbiBhbnkobXNnLCBldmUsIGYpe1xuXHRcdFx0aWYoYW55LnN0dW4peyByZXR1cm4gfVxuXHRcdFx0
aWYoKHRtcCA9IHJvb3QucGFzcykgJiYgIXRtcFtpZF0peyByZXR1cm4gfVxuXHRcdFx0dmFyIGF0ID0gbXNnLiQuXywgc2F0ID0gKG1zZy4kJHx8JycpLl8s
IGRhdGEgPSAoc2F0fHxhdCkucHV0LCBvZGQgPSAoIWF0LmhhcyAmJiAhYXQuc291bCksIHRlc3QgPSB7fSwgbGluaywgdG1wO1xuXHRcdFx0aWYob2RkIHx8
IHUgPT09IGRhdGEpeyAvLyBoYW5kbGVzIG5vbi1jb3JlXG5cdFx0XHRcdGRhdGEgPSAodSA9PT0gKCh0bXAgPSBtc2cucHV0KXx8JycpWyc9J10pPyAodSA9
PT0gKHRtcHx8JycpWyc6J10pPyB0bXAgOiB0bXBbJzonXSA6IHRtcFsnPSddO1xuXHRcdFx0fVxuXHRcdFx0aWYobGluayA9ICgnc3RyaW5nJyA9PSB0eXBl
b2YgKHRtcCA9IEd1bi52YWxpZChkYXRhKSkpKXtcblx0XHRcdFx0ZGF0YSA9ICh1ID09PSAodG1wID0gcm9vdC4kLmdldCh0bXApLl8ucHV0KSk/IG9wdC5u
b3Q/IHUgOiBkYXRhIDogdG1wO1xuXHRcdFx0fVxuXHRcdFx0aWYob3B0Lm5vdCAmJiB1ID09PSBkYXRhKXsgcmV0dXJuIH1cblx0XHRcdGlmKHUgPT09IG9w
dC5zdHVuKXtcblx0XHRcdFx0aWYoKHRtcCA9IHJvb3Quc3R1bikgJiYgdG1wLm9uKXtcblx0XHRcdFx0XHRjYXQuJC5iYWNrKGZ1bmN0aW9uKGEpeyAvLyBv
dXIgY2hhaW4gc3R1bm5lZD9cblx0XHRcdFx0XHRcdHRtcC5vbignJythLmlkLCB0ZXN0ID0ge30pO1xuXHRcdFx0XHRcdFx0aWYoKHRlc3QucnVuIHx8IDAp
IDwgYW55LmlkKXsgcmV0dXJuIHRlc3QgfSAvLyBpZiB0aGVyZSBpcyBhbiBlYXJsaWVyIHN0dW4gb24gZ2FwbGVzcyBwYXJlbnRzL3NlbGYuXG5cdFx0XHRc
dFx0fSk7XG5cdFx0XHRcdFx0IXRlc3QucnVuICYmIHRtcC5vbignJythdC5pZCwgdGVzdCA9IHt9KTsgLy8gdGhpcyBub2RlIHN0dW5uZWQ/XG5cdFx0XHRc
dFx0IXRlc3QucnVuICYmIHNhdCAmJiB0bXAub24oJycrc2F0LmlkLCB0ZXN0ID0ge30pOyAvLyBsaW5rZWQgbm9kZSBzdHVubmVkP1xuXHRcdFx0XHRcdGlm
KGFueS5pZCA+IHRlc3QucnVuKXtcblx0XHRcdFx0XHRcdGlmKCF0ZXN0LnN0dW4gfHwgdGVzdC5zdHVuLmVuZCl7XG5cdFx0XHRcdFx0XHRcdHRlc3Quc3R1
biA9IHRtcC5vbignc3R1bicpO1xuXHRcdFx0XHRcdFx0XHR0ZXN0LnN0dW4gPSB0ZXN0LnN0dW4gJiYgdGVzdC5zdHVuLmxhc3Q7XG5cdFx0XHRcdFx0XHR9
XG5cdFx0XHRcdFx0XHRpZih0ZXN0LnN0dW4gJiYgIXRlc3Quc3R1bi5lbmQpe1xuXHRcdFx0XHRcdFx0XHQvL2lmKG9kZCAmJiB1ID09PSBkYXRhKXsgcmV0
dXJuIH1cblx0XHRcdFx0XHRcdFx0Ly9pZih1ID09PSBtc2cucHV0KXsgcmV0dXJuIH0gLy8gXCJub3QgZm91bmRcIiBhY2tzIHdpbGwgYmUgZm91bmQgaWYg
dGhlcmUgaXMgc3R1biwgc28gaWdub3JlIHRoZXNlLlxuXHRcdFx0XHRcdFx0XHQodGVzdC5zdHVuLmFkZCB8fCAodGVzdC5zdHVuLmFkZCA9IHt9KSlbaWRd
ID0gZnVuY3Rpb24oKXsgYW55KG1zZyxldmUsMSkgfSAvLyBhZGQgb3Vyc2VsZiB0byB0aGUgc3R1biBjYWxsYmFjayBsaXN0IHRoYXQgaXMgY2FsbGVkIGF0
IGVuZCBvZiB0aGUgd3JpdGUuXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0
aWYoLypvZGQgJiYqLyB1ID09PSBkYXRhKXsgZiA9IDAgfSAvLyBpZiBkYXRhIG5vdCBmb3VuZCwga2VlcCB3YWl0aW5nL3RyeWluZy5cblx0XHRcdFx0Lypp
ZihmICYmIHUgPT09IGRhdGEpe1xuXHRcdFx0XHRcdGNhdC5vbignb3V0Jywgb3B0Lm91dCk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9Ki9cblx0
XHRcdFx0aWYoKHRtcCA9IHJvb3QuaGF0Y2gpICYmICF0bXAuZW5kICYmIHUgPT09IG9wdC5oYXRjaCAmJiAhZil7IC8vIHF1aWNrIGhhY2shIC8vIFdoYXQn
cyBnb2luZyBvbiBoZXJlPyBCZWNhdXNlIGRhdGEgaXMgc3RyZWFtZWQsIHdlIGdldCB0aGluZ3Mgb25lIGJ5IG9uZSwgYnV0IGEgbG90IG9mIGRldmVsb3Bl
cnMgd291bGQgcmF0aGVyIGdldCBhIGNhbGxiYWNrIGFmdGVyIGVhY2ggYmF0Y2ggaW5zdGVhZCwgc28gdGhpcyBkb2VzIHRoYXQgYnkgY3JlYXRpbmcgYSB3
YWl0IGxpc3QgcGVyIGNoYWluIGlkIHRoYXQgaXMgdGhlbiBjYWxsZWQgYXQgdGhlIGVuZCBvZiB0aGUgYmF0Y2ggYnkgdGhlIGhhdGNoIGNvZGUgaW4gdGhl
IHJvb3QgcHV0IGxpc3RlbmVyLlxuXHRcdFx0XHRcdGlmKHdhaXRbYXQuJC5fLmlkXSl7IHJldHVybiB9IHdhaXRbYXQuJC5fLmlkXSA9IDE7XG5cdFx0XHRc
dFx0dG1wLnB1c2goZnVuY3Rpb24oKXthbnkobXNnLGV2ZSwxKX0pO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fTsgd2FpdCA9IHt9OyAvLyBlbmQg
cXVpY2sgaGFjay5cblx0XHRcdH1cblx0XHRcdC8vIGNhbGw6XG5cdFx0XHRpZihyb290LnBhc3MpeyBpZihyb290LnBhc3NbaWQrYXQuaWRdKXsgcmV0dXJu
IH0gcm9vdC5wYXNzW2lkK2F0LmlkXSA9IDEgfVxuXHRcdFx0aWYob3B0Lm9uKXsgb3B0Lm9rLmNhbGwoYXQuJCwgZGF0YSwgYXQuZ2V0LCBtc2csIGV2ZSB8
fCBhbnkpOyByZXR1cm4gfSAvLyBUT0RPOiBBbHNvIGNvbnNpZGVyIGJyZWFraW5nIGB0aGlzYCBzaW5jZSBhIGxvdCBvZiBwZW9wbGUgZG8gYD0+YCB0aGVz
ZSBkYXlzIGFuZCBgLmNhbGwoYCBoYXMgc2xvd2VyIHBlcmZvcm1hbmNlLlxuXHRcdFx0aWYob3B0LnYyMDIwKXsgb3B0Lm9rKG1zZywgZXZlIHx8IGFueSk7
IHJldHVybiB9XG5cdFx0XHRPYmplY3Qua2V5cyhtc2cpLmZvckVhY2goZnVuY3Rpb24oayl7IHRtcFtrXSA9IG1zZ1trXSB9LCB0bXAgPSB7fSk7IG1zZyA9
IHRtcDsgbXNnLnB1dCA9IGRhdGE7IC8vIDIwMTkgQ09NUEFUSUJJTElUWSEgVE9ETzogR0VUIFJJRCBPRiBUSElTIVxuXHRcdFx0b3B0Lm9rLmNhbGwob3B0
LmFzLCBtc2csIGV2ZSB8fCBhbnkpOyAvLyBpcyB0aGlzIHRoZSByaWdodFxuXHRcdH07XG5cdFx0YW55LmF0ID0gY2F0O1xuXHRcdC8vKGNhdC5hbnl8fChj
YXQuYW55PWZ1bmN0aW9uKG1zZyl7IHNldFRpbWVvdXQuZWFjaChPYmplY3Qua2V5cyhjYXQuYW55fHwnJyksIGZ1bmN0aW9uKGFjdCl7IChhY3QgPSBjYXQu
YW55W2FjdF0pICYmIGFjdChtc2cpIH0sMCw5OSkgfSkpW2lkID0gU3RyaW5nLnJhbmRvbSg3KV0gPSBhbnk7IC8vIG1heWJlIHN3aXRjaCB0byB0aGlzIGlu
IGZ1dHVyZT9cblx0XHQoY2F0LmFueXx8KGNhdC5hbnk9e30pKVtpZCA9IFN0cmluZy5yYW5kb20oNyldID0gYW55O1xuXHRcdGFueS5vZmYgPSBmdW5jdGlv
bigpeyBhbnkuc3R1biA9IDE7IGlmKCFjYXQuYW55KXsgcmV0dXJuIH0gZGVsZXRlIGNhdC5hbnlbaWRdIH1cblx0XHRhbnkucmlkID0gcmlkOyAvLyBsb2dp
YyBmcm9tIG9sZCB2ZXJzaW9uLCBjYW4gd2UgY2xlYW4gaXQgdXAgbm93P1xuXHRcdGFueS5pZCA9IG9wdC5ydW4gfHwgKytyb290Lm9uY2U7IC8vIHVzZWQg
aW4gY2FsbGJhY2sgdG8gY2hlY2sgaWYgd2UgYXJlIGVhcmxpZXIgdGhhbiBhIHdyaXRlLiAvLyB3aWxsIHRoaXMgZXZlciBjYXVzZSBhbiBpbnRlZ2VyIG92
ZXJmbG93P1xuXHRcdHRtcCA9IHJvb3QucGFzczsgKHJvb3QucGFzcyA9IHt9KVtpZF0gPSAxOyAvLyBFeHBsYW5hdGlvbjogdGVzdCB0cmFkZS1vZmZzIHdh
bnQgdG8gcHJldmVudCByZWN1cnNpb24gc28gd2UgYWRkL3JlbW92ZSBwYXNzIGZsYWcgYXMgaXQgZ2V0cyBmdWxmaWxsZWQgdG8gbm90IHJlcGVhdCwgaG93
ZXZlciBtYXAgbWFwIG5lZWRzIG1hbnkgcGFzcyBmbGFncyAtIGhvdyBkbyB3ZSByZWNvbmNpbGU/XG5cdFx0b3B0Lm91dCA9IG9wdC5vdXQgfHwge2dldDog
e319O1xuXHRcdGNhdC5vbignb3V0Jywgb3B0Lm91dCk7XG5cdFx0cm9vdC5wYXNzID0gdG1wO1xuXHRcdHJldHVybiBndW47XG5cdH0gZWxzZVxuXHRpZign
bnVtYmVyJyA9PSB0eXBlb2Yga2V5KXtcblx0XHRyZXR1cm4gdGhpcy5nZXQoJycra2V5LCBjYiwgYXMpO1xuXHR9IGVsc2Vcblx0aWYoJ3N0cmluZycgPT0g
dHlwZW9mICh0bXAgPSB2YWxpZChrZXkpKSl7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0KHRtcCwgY2IsIGFzKTtcblx0fSBlbHNlXG5cdGlmKHRtcCA9IHRoaXMu
Z2V0Lm5leHQpe1xuXHRcdGd1biA9IHRtcCh0aGlzLCBrZXkpO1xuXHR9XG5cdGlmKCFndW4pe1xuXHRcdChndW4gPSB0aGlzLmNoYWluKCkpLl8uZXJyID0g
e2VycjogR3VuLmxvZygnSW52YWxpZCBnZXQgcmVxdWVzdCEnLCBrZXkpfTsgLy8gQ0xFQU4gVVBcblx0XHRpZihjYil7IGNiLmNhbGwoZ3VuLCBndW4uXy5l
cnIpIH1cblx0XHRyZXR1cm4gZ3VuO1xuXHR9XG5cdGlmKGNiICYmICdmdW5jdGlvbicgPT0gdHlwZW9mIGNiKXtcblx0XHRndW4uZ2V0KGNiLCBhcyk7XG5c
dH1cblx0cmV0dXJuIGd1bjtcbn1cbmZ1bmN0aW9uIGNhY2hlKGtleSwgYmFjayl7XG5cdHZhciBjYXQgPSBiYWNrLl8sIG5leHQgPSBjYXQubmV4dCwgZ3Vu
ID0gYmFjay5jaGFpbigpLCBhdCA9IGd1bi5fO1xuXHRpZighbmV4dCl7IG5leHQgPSBjYXQubmV4dCA9IHt9IH1cblx0bmV4dFthdC5nZXQgPSBrZXldID0g
YXQ7XG5cdGlmKGJhY2sgPT09IGNhdC5yb290LiQpe1xuXHRcdGF0LnNvdWwgPSBrZXk7XG5cdFx0Ly9hdC5wdXQgPSB7fTtcblx0fSBlbHNlXG5cdGlmKGNh
dC5zb3VsIHx8IGNhdC5oYXMpe1xuXHRcdGF0LmhhcyA9IGtleTtcblx0XHQvL2lmKG9ial9oYXMoY2F0LnB1dCwga2V5KSl7XG5cdFx0XHQvL2F0LnB1dCA9
IGNhdC5wdXRba2V5XTtcblx0XHQvL31cblx0fVxuXHRyZXR1cm4gYXQ7XG59XG5mdW5jdGlvbiBzb3VsKGd1biwgY2IsIG9wdCwgYXMpe1xuXHR2YXIgY2F0
ID0gZ3VuLl8sIGFja3MgPSAwLCB0bXA7XG5cdGlmKHRtcCA9IGNhdC5zb3VsIHx8IGNhdC5saW5rKXsgcmV0dXJuIGNiKHRtcCwgYXMsIGNhdCkgfVxuXHRp
ZihjYXQuamFtKXsgcmV0dXJuIGNhdC5qYW0ucHVzaChbY2IsIGFzXSkgfVxuXHRjYXQuamFtID0gW1tjYixhc11dO1xuXHRndW4uZ2V0KGZ1bmN0aW9uIGdv
KG1zZywgZXZlKXtcblx0XHRpZih1ID09PSBtc2cucHV0ICYmICFjYXQucm9vdC5vcHQuc3VwZXIgJiYgKHRtcCA9IE9iamVjdC5rZXlzKGNhdC5yb290Lm9w
dC5wZWVycykubGVuZ3RoKSAmJiArK2Fja3MgPD0gdG1wKXsgLy8gVE9ETzogc3VwZXIgc2hvdWxkIG5vdCBiZSBpbiBjb3JlIGNvZGUsIGJyaW5nIEFYRSB1
cCBpbnRvIGNvcmUgaW5zdGVhZCB0byBmaXg/IC8vIFRPRE86IC5rZXlzKCBpcyBzbG93XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGV2ZS5yaWQobXNn
KTtcblx0XHR2YXIgYXQgPSAoKGF0ID0gbXNnLiQpICYmIGF0Ll8pIHx8IHt9LCBpID0gMCwgYXM7XG5cdFx0dG1wID0gY2F0LmphbTsgZGVsZXRlIGNhdC5q
YW07IC8vIHRtcCA9IGNhdC5qYW0uc3BsaWNlKDAsIDEwMCk7XG5cdFx0Ly9pZih0bXAubGVuZ3RoKXsgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpeyBn
byhtc2csIGV2ZSkgfSkgfVxuXHRcdHdoaWxlKGFzID0gdG1wW2krK10peyAvL0d1bi5vYmoubWFwKHRtcCwgZnVuY3Rpb24oYXMsIGNiKXtcblx0XHRcdHZh
ciBjYiA9IGFzWzBdLCBpZDsgYXMgPSBhc1sxXTtcblx0XHRcdGNiICYmIGNiKGlkID0gYXQubGluayB8fCBhdC5zb3VsIHx8IEd1bi52YWxpZChtc2cucHV0
KSB8fCAoKG1zZy5wdXR8fHt9KS5ffHx7fSlbJyMnXSwgYXMsIG1zZywgZXZlKTtcblx0XHR9IC8vKTtcblx0fSwge291dDoge2dldDogeycuJzp0cnVlfX19
KTtcblx0cmV0dXJuIGd1bjtcbn1cbmZ1bmN0aW9uIHJpZChhdCl7XG5cdHZhciBjYXQgPSB0aGlzLmF0IHx8IHRoaXMub247XG5cdGlmKCFhdCB8fCBjYXQu
c291bCB8fCBjYXQuaGFzKXsgcmV0dXJuIHRoaXMub2ZmKCkgfVxuXHRpZighKGF0ID0gKGF0ID0gKGF0ID0gYXQuJCB8fCBhdCkuXyB8fCBhdCkuaWQpKXsg
cmV0dXJuIH1cblx0dmFyIG1hcCA9IGNhdC5tYXAsIHRtcCwgc2Vlbjtcblx0Ly9pZighbWFwIHx8ICEodG1wID0gbWFwW2F0XSkgfHwgISh0bXAgPSB0bXAu
YXQpKXsgcmV0dXJuIH1cblx0aWYodG1wID0gKHNlZW4gPSB0aGlzLnNlZW4gfHwgKHRoaXMuc2VlbiA9IHt9KSlbYXRdKXsgcmV0dXJuIHRydWUgfVxuXHRz
ZWVuW2F0XSA9IHRydWU7XG5cdC8vdG1wLmVjaG9bY2F0LmlkXSA9IHt9OyAvLyBUT0RPOiBXYXJuaW5nOiBUaGlzIHVuc3Vic2NyaWJlcyBBTEwgb2YgdGhp
cyBjaGFpbidzIGxpc3RlbmVycyBmcm9tIHRoaXMgbGluaywgbm90IGp1c3QgdGhlIG9uZSBjYWxsYmFjayBldmVudC5cblx0Ly9vYmouZGVsKG1hcCwgYXQp
OyAvLyBUT0RPOiBXYXJuaW5nOiBUaGlzIHVuc3Vic2NyaWJlcyBBTEwgb2YgdGhpcyBjaGFpbidzIGxpc3RlbmVycyBmcm9tIHRoaXMgbGluaywgbm90IGp1
c3QgdGhlIG9uZSBjYWxsYmFjayBldmVudC5cblx0cmV0dXJuO1xufVxudmFyIGVtcHR5ID0ge30sIHZhbGlkID0gR3VuLnZhbGlkLCB1O1xuXHRcbn0oKSk7
Iiwic3JjL2d1bi9wdXQuanMiOiJpbXBvcnQgX19yb290IGZyb20gJy4vcm9vdC5qcyc7XG4oZnVuY3Rpb24oKXtcblxudmFyIEd1biA9IF9fcm9vdDtcbkd1
bi5jaGFpbi5wdXQgPSBmdW5jdGlvbihkYXRhLCBjYiwgYXMpeyAvLyBJIHJld3JvdGUgaXQgOilcblx0dmFyIGd1biA9IHRoaXMsIGF0ID0gZ3VuLl8sIHJv
b3QgPSBhdC5yb290O1xuXHRhcyA9IGFzIHx8IHt9O1xuXHRhcy5yb290ID0gYXQucm9vdDtcblx0YXMucnVuIHx8IChhcy5ydW4gPSByb290Lm9uY2UpO1xu
XHRzdHVuKGFzLCBhdC5pZCk7IC8vIHNldCBhIGZsYWcgZm9yIHJlYWRzIHRvIGNoZWNrIGlmIHRoaXMgY2hhaW4gaXMgd3JpdGluZy5cblx0YXMuYWNrID0g
YXMuYWNrIHx8IGNiO1xuXHRhcy52aWEgPSBhcy52aWEgfHwgZ3VuO1xuXHRhcy5kYXRhID0gYXMuZGF0YSB8fCBkYXRhO1xuXHRhcy5zb3VsIHx8IChhcy5z
b3VsID0gYXQuc291bCB8fCAoJ3N0cmluZycgPT0gdHlwZW9mIGNiICYmIGNiKSk7XG5cdHZhciBzID0gYXMuc3RhdGUgPSBhcy5zdGF0ZSB8fCBHdW4uc3Rh
dGUoKTtcblx0aWYoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSl7IGRhdGEoZnVuY3Rpb24oZCl7IGFzLmRhdGEgPSBkOyBndW4ucHV0KHUsdSxhcykgfSk7
IHJldHVybiBndW4gfVxuXHRpZighYXMuc291bCl7IHJldHVybiBnZXQoYXMpLCBndW4gfVxuXHRhcy4kID0gcm9vdC4kLmdldChhcy5zb3VsKTsgLy8gVE9E
TzogVGhpcyBtYXkgbm90IGFsbG93IHVzZXIgY2hhaW5pbmcgYW5kIHNpbWlsYXI/XG5cdGFzLnRvZG8gPSBbe2l0OiBhcy5kYXRhLCByZWY6IGFzLiR9XTtc
blx0YXMudHVybiA9IGFzLnR1cm4gfHwgdHVybjtcblx0YXMucmFuID0gYXMucmFuIHx8IHJhbjtcblx0Ly92YXIgcGF0aCA9IFtdOyBhcy52aWEuYmFjayhh
dCA9PiB7IGF0LmdldCAmJiBwYXRoLnB1c2goYXQuZ2V0LnNsaWNlKDAsOSkpIH0pOyBwYXRoID0gcGF0aC5yZXZlcnNlKCkuam9pbignLicpO1xuXHQvLyBU
T0RPOiBQZXJmISBXZSBvbmx5IG5lZWQgdG8gc3R1biBjaGFpbnMgdGhhdCBhcmUgYmVpbmcgbW9kaWZpZWQsIG5vdCBuZWNlc3NhcmlseSB3cml0dGVuIHRv
LlxuXHQoZnVuY3Rpb24gd2Fsaygpe1xuXHRcdHZhciB0byA9IGFzLnRvZG8sIGF0ID0gdG8ucG9wKCksIGQgPSBhdC5pdCwgY2lkID0gYXQucmVmICYmIGF0
LnJlZi5fLmlkLCB2LCBrLCBjYXQsIHRtcCwgZztcblx0XHRzdHVuKGFzLCBhdC5yZWYpO1xuXHRcdGlmKHRtcCA9IGF0LnRvZG8pe1xuXHRcdFx0ayA9IHRt
cC5wb3AoKTsgZCA9IGRba107XG5cdFx0XHRpZih0bXAubGVuZ3RoKXsgdG8ucHVzaChhdCkgfVxuXHRcdH1cblx0XHRrICYmICh0by5wYXRoIHx8ICh0by5w
YXRoID0gW10pKS5wdXNoKGspO1xuXHRcdGlmKCEodiA9IHZhbGlkKGQpKSAmJiAhKGcgPSBHdW4uaXMoZCkpKXtcblx0XHRcdGlmKCFPYmplY3QucGxhaW4o
ZCkpeyByYW4uZXJyKGFzLCBcIkludmFsaWQgZGF0YTogXCIrIGNoZWNrKGQpICtcIiBhdCBcIiArIChhcy52aWEuYmFjayhmdW5jdGlvbihhdCl7YXQuZ2V0
ICYmIHRtcC5wdXNoKGF0LmdldCl9LCB0bXAgPSBbXSkgfHwgdG1wLmpvaW4oJy4nKSkrJy4nKyh0by5wYXRofHxbXSkuam9pbignLicpKTsgcmV0dXJuIH1c
blx0XHRcdHZhciBzZWVuID0gYXMuc2VlbiB8fCAoYXMuc2VlbiA9IFtdKSwgaSA9IHNlZW4ubGVuZ3RoO1xuXHRcdFx0d2hpbGUoaS0tKXsgaWYoZCA9PT0g
KHRtcCA9IHNlZW5baV0pLml0KXsgdiA9IGQgPSB0bXAubGluazsgYnJlYWsgfSB9XG5cdFx0fVxuXHRcdGlmKGsgJiYgdil7IGF0Lm5vZGUgPSBzdGF0ZV9p
ZnkoYXQubm9kZSwgaywgcywgZCkgfSAvLyBoYW5kbGUgc291bCBsYXRlci5cblx0XHRlbHNlIHtcblx0XHRcdGlmKCFhcy5zZWVuKXsgcmFuLmVycihhcywg
XCJEYXRhIGF0IHJvb3Qgb2YgZ3JhcGggbXVzdCBiZSBhIG5vZGUgKGFuIG9iamVjdCkuXCIpOyByZXR1cm4gfVxuXHRcdFx0YXMuc2Vlbi5wdXNoKGNhdCA9
IHtpdDogZCwgbGluazoge30sIHRvZG86IGc/IFtdIDogT2JqZWN0LmtleXMoZCkuc29ydCgpLnJldmVyc2UoKSwgcGF0aDogKHRvLnBhdGh8fFtdKS5zbGlj
ZSgpLCB1cDogYXR9KTsgLy8gQW55IHBlcmYgcmVhc29ucyB0byBDUFUgc2NoZWR1bGUgdGhpcyAua2V5cyggP1xuXHRcdFx0YXQubm9kZSA9IHN0YXRlX2lm
eShhdC5ub2RlLCBrLCBzLCBjYXQubGluayk7XG5cdFx0XHQhZyAmJiBjYXQudG9kby5sZW5ndGggJiYgdG8ucHVzaChjYXQpO1xuXHRcdFx0Ly8gLS0tLS0t
LS0tLS0tLS0tXG5cdFx0XHR2YXIgaWQgPSBhcy5zZWVuLmxlbmd0aDtcblx0XHRcdChhcy53YWl0IHx8IChhcy53YWl0ID0ge30pKVtpZF0gPSAnJztcblx0
XHRcdHRtcCA9IChjYXQucmVmID0gKGc/IGQgOiBrPyBhdC5yZWYuZ2V0KGspIDogYXQucmVmKSkuXztcblx0XHRcdCh0bXAgPSAoZCAmJiAoZC5ffHwnJylb
JyMnXSkgfHwgdG1wLnNvdWwgfHwgdG1wLmxpbmspPyByZXNvbHZlKHtzb3VsOiB0bXB9KSA6IGNhdC5yZWYuZ2V0KHJlc29sdmUsIHtydW46IGFzLnJ1biwg
LypoYXRjaDogMCwqLyB2MjAyMDoxLCBvdXQ6e2dldDp7Jy4nOicgJ319fSk7IC8vIFRPRE86IEJVRyEgVGhpcyBzaG91bGQgYmUgcmVzb2x2ZSBPTkxZIHNv
dWwgdG8gcHJldmVudCBmdWxsIGRhdGEgZnJvbSBiZWluZyBsb2FkZWQuIC8vIEZpeGVkIG5vdz9cblx0XHRcdC8vc2V0VGltZW91dChmdW5jdGlvbigpeyBp
ZihGKXsgcmV0dXJuIH0gY29uc29sZS5sb2coXCJJIEhBVkUgTk9UIEJFRU4gQ0FMTEVEIVwiLCBwYXRoLCBpZCwgY2F0LnJlZi5fLmlkLCBrKSB9LCA5MDAw
KTsgdmFyIEY7IC8vIE1BS0UgU1VSRSBUTyBBREQgRiA9IDEgYmVsb3chXG5cdFx0XHRmdW5jdGlvbiByZXNvbHZlKG1zZywgZXZlKXtcblx0XHRcdFx0dmFy
IGVuZCA9IGNhdC5saW5rWycjJ107XG5cdFx0XHRcdGlmKGV2ZSl7IGV2ZS5vZmYoKTsgZXZlLnJpZChtc2cpIH0gLy8gVE9ETzogVG9vIGVhcmx5ISBDaGVj
ayBhbGwgcGVlcnMgYWNrIG5vdCBmb3VuZC5cblx0XHRcdFx0Ly8gVE9ETzogQlVHIG1heWJlPyBNYWtlIHN1cmUgdGhpcyBkb2VzIG5vdCBwaWNrIHVwIGEg
bGluayBjaGFuZ2Ugd2lwZSwgdGhhdCBpdCB1c2VzIHRoZSBjaGFuZ2lnbiBsaW5rIGluc3RlYWQuXG5cdFx0XHRcdHZhciBzb3VsID0gZW5kIHx8IG1zZy5z
b3VsIHx8ICh0bXAgPSAobXNnLiQkfHxtc2cuJCkuX3x8JycpLnNvdWwgfHwgdG1wLmxpbmsgfHwgKCh0bXAgPSB0bXAucHV0fHwnJykuX3x8JycpWycjJ10g
fHwgdG1wWycjJ10gfHwgKCgodG1wID0gbXNnLnB1dHx8JycpICYmIG1zZy4kJCk/IHRtcFsnIyddIDogKHRtcFsnPSddfHx0bXBbJzonXXx8JycpWycjJ10p
O1xuXHRcdFx0XHQhZW5kICYmIHN0dW4oYXMsIG1zZy4kKTtcblx0XHRcdFx0aWYoIXNvdWwgJiYgIWF0LmxpbmtbJyMnXSl7IC8vIGNoZWNrIHNvdWwgbGlu
ayBhYm92ZSB1c1xuXHRcdFx0XHRcdChhdC53YWl0IHx8IChhdC53YWl0ID0gW10pKS5wdXNoKGZ1bmN0aW9uKCl7IHJlc29sdmUobXNnLCBldmUpIH0pIC8v
IHdhaXRcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoIXNvdWwpe1xuXHRcdFx0XHRcdHNvdWwgPSBbXTtcblx0XHRcdFx0XHQo
bXNnLiQkfHxtc2cuJCkuYmFjayhmdW5jdGlvbihhdCl7XG5cdFx0XHRcdFx0XHRpZih0bXAgPSBhdC5zb3VsIHx8IGF0LmxpbmspeyByZXR1cm4gc291bC5w
dXNoKHRtcCkgfVxuXHRcdFx0XHRcdFx0c291bC5wdXNoKGF0LmdldCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0c291bCA9IHNvdWwucmV2ZXJzZSgp
LmpvaW4oJy8nKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXQubGlua1snIyddID0gc291bDtcblx0XHRcdFx0IWcgJiYgKCgoYXMuZ3JhcGggfHwgKGFzLmdy
YXBoID0ge30pKVtzb3VsXSA9IChjYXQubm9kZSB8fCAoY2F0Lm5vZGUgPSB7Xzp7fX0pKSkuX1snIyddID0gc291bCk7XG5cdFx0XHRcdGRlbGV0ZSBhcy53
YWl0W2lkXTtcblx0XHRcdFx0Y2F0LndhaXQgJiYgc2V0VGltZW91dC5lYWNoKGNhdC53YWl0LCBmdW5jdGlvbihjYil7IGNiICYmIGNiKCkgfSk7XG5cdFx0
XHRcdGFzLnJhbihhcyk7XG5cdFx0XHR9O1xuXHRcdFx0Ly8gLS0tLS0tLS0tLS0tLS0tXG5cdFx0fVxuXHRcdGlmKCF0by5sZW5ndGgpeyByZXR1cm4gYXMu
cmFuKGFzKSB9XG5cdFx0YXMudHVybih3YWxrKTtcblx0fSgpKTtcblx0cmV0dXJuIGd1bjtcbn1cblxuZnVuY3Rpb24gc3R1bihhcywgaWQpe1xuXHRpZigh
aWQpeyByZXR1cm4gfSBpZCA9IChpZC5ffHwnJykuaWR8fGlkO1xuXHR2YXIgcnVuID0gYXMucm9vdC5zdHVuIHx8IChhcy5yb290LnN0dW4gPSB7b246IEd1
bi5vbn0pLCB0ZXN0ID0ge30sIHRtcDtcblx0YXMuc3R1biB8fCAoYXMuc3R1biA9IHJ1bi5vbignc3R1bicsIGZ1bmN0aW9uKCl7IH0pKTtcblx0aWYodG1w
ID0gcnVuLm9uKCcnK2lkKSl7IHRtcC50aGUubGFzdC5uZXh0KHRlc3QpIH1cblx0aWYodGVzdC5ydW4gPj0gYXMucnVuKXsgcmV0dXJuIH1cblx0cnVuLm9u
KCcnK2lkLCBmdW5jdGlvbih0ZXN0KXtcblx0XHRpZihhcy5zdHVuLmVuZCl7XG5cdFx0XHR0aGlzLm9mZigpO1xuXHRcdFx0dGhpcy50by5uZXh0KHRlc3Qp
O1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0ZXN0LnJ1biA9IHRlc3QucnVuIHx8IGFzLnJ1bjtcblx0XHR0ZXN0LnN0dW4gPSB0ZXN0LnN0dW4gfHwg
YXMuc3R1bjsgcmV0dXJuO1xuXHRcdGlmKHRoaXMudG8udG8pe1xuXHRcdFx0dGhpcy50aGUubGFzdC5uZXh0KHRlc3QpO1xuXHRcdFx0cmV0dXJuO1xuXHRc
dH1cblx0XHR0ZXN0LnN0dW4gPSBhcy5zdHVuO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gcmFuKGFzKXtcblx0aWYoYXMuZXJyKXsgcmFuLmVuZChhcy5zdHVu
LCBhcy5yb290KTsgcmV0dXJuIH0gLy8gbW92ZSBsb2cgaGFuZGxlIGhlcmUuXG5cdGlmKGFzLnRvZG8ubGVuZ3RoIHx8IGFzLmVuZCB8fCAhT2JqZWN0LmVt
cHR5KGFzLndhaXQpKXsgcmV0dXJuIH0gYXMuZW5kID0gMTtcblx0Ly8oYXMucmV0cnkgPSBmdW5jdGlvbigpeyBhcy5hY2tzID0gMDtcblx0dmFyIGNhdCA9
IChhcy4kLmJhY2soLTEpLl8pLCByb290ID0gY2F0LnJvb3QsIGFzayA9IGNhdC5hc2soZnVuY3Rpb24oYWNrKXtcblx0XHRyb290Lm9uKCdhY2snLCBhY2sp
O1xuXHRcdGlmKGFjay5lcnIgJiYgIWFjay5sYWNrKXsgR3VuLmxvZyhhY2spIH1cblx0XHRpZigrK2Fja3MgPiAoYXMuYWNrcyB8fCAwKSl7IHRoaXMub2Zm
KCkgfSAvLyBBZGp1c3RhYmxlIEFDS3MhIE9ubHkgMSBieSBkZWZhdWx0LlxuXHRcdGlmKCFhcy5hY2speyByZXR1cm4gfVxuXHRcdGFzLmFjayhhY2ssIHRo
aXMpO1xuXHR9LCBhcy5vcHQpLCBhY2tzID0gMCwgc3R1biA9IGFzLnN0dW4sIHRtcDtcblx0KHRtcCA9IGZ1bmN0aW9uKCl7IC8vIHRoaXMgaXMgbm90IG9m
ZmljaWFsIHlldCwgYnV0IHF1aWNrIHNvbHV0aW9uIHRvIGhhY2sgaW4gZm9yIG5vdy5cblx0XHRpZighc3R1bil7IHJldHVybiB9XG5cdFx0cmFuLmVuZChz
dHVuLCByb290KTtcblx0XHRzZXRUaW1lb3V0LmVhY2goT2JqZWN0LmtleXMoc3R1biA9IHN0dW4uYWRkfHwnJyksIGZ1bmN0aW9uKGNiKXsgaWYoY2IgPSBz
dHVuW2NiXSl7Y2IoKX0gfSk7IC8vIHJlc3VtZSB0aGUgc3R1bm5lZCByZWFkcyAvLyBBbnkgcGVyZiByZWFzb25zIHRvIENQVSBzY2hlZHVsZSB0aGlzIC5r
ZXlzKCA/XG5cdH0pLmhhdGNoID0gdG1wOyAvLyB0aGlzIGlzIG5vdCBvZmZpY2lhbCB5ZXQgXlxuXHQvL2NvbnNvbGUubG9nKDEsIFwiUFVUXCIsIGFzLnJ1
biwgYXMuZ3JhcGgpO1xuXHRpZihhcy5hY2sgJiYgIWFzLm9rKXsgYXMub2sgPSBhcy5hY2tzIHx8IDkgfSAvLyBUT0RPOiBJbiBmdXR1cmUhIFJlbW92ZSB0
aGlzISBUaGlzIGlzIGp1c3Qgb2xkIEFQSSBzdXBwb3J0LlxuXHQoYXMudmlhLl8pLm9uKCdvdXQnLCB7cHV0OiBhcy5vdXQgPSBhcy5ncmFwaCwgb2s6IGFz
Lm9rICYmIHsnQCc6IGFzLm9rKzF9LCBvcHQ6IGFzLm9wdCwgJyMnOiBhc2ssIF86IHRtcH0pO1xuXHQvL30pKCk7XG59OyByYW4uZW5kID0gZnVuY3Rpb24o
c3R1bixyb290KXtcblx0c3R1bi5lbmQgPSBub29wOyAvLyBsaWtlIHdpdGggdGhlIGVhcmxpZXIgaWQsIGNoZWFwZXIgdG8gbWFrZSB0aGlzIGZsYWcgYSBm
dW5jdGlvbiBzbyBiZWxvdyBjYWxsYmFja3MgZG8gbm90IGhhdmUgdG8gZG8gYW4gZXh0cmEgdHlwZSBjaGVjay5cblx0aWYoc3R1bi50aGUudG8gPT09IHN0
dW4gJiYgc3R1biA9PT0gc3R1bi50aGUubGFzdCl7IGRlbGV0ZSByb290LnN0dW4gfVxuXHRzdHVuLm9mZigpO1xufTsgcmFuLmVyciA9IGZ1bmN0aW9uKGFz
LCBlcnIpe1xuXHQoYXMuYWNrfHxub29wKS5jYWxsKGFzLCBhcy5vdXQgPSB7IGVycjogYXMuZXJyID0gR3VuLmxvZyhlcnIpIH0pO1xuXHRhcy5yYW4oYXMp
O1xufVxuXG5mdW5jdGlvbiBnZXQoYXMpe1xuXHR2YXIgYXQgPSBhcy52aWEuXywgdG1wO1xuXHRhcy52aWEgPSBhcy52aWEuYmFjayhmdW5jdGlvbihhdCl7
XG5cdFx0aWYoYXQuc291bCB8fCAhYXQuZ2V0KXsgcmV0dXJuIGF0LiQgfVxuXHRcdHRtcCA9IGFzLmRhdGE7IChhcy5kYXRhID0ge30pW2F0LmdldF0gPSB0
bXA7XG5cdH0pO1xuXHRpZighYXMudmlhIHx8ICFhcy52aWEuXy5zb3VsKXtcblx0XHRhcy52aWEgPSBhdC5yb290LiQuZ2V0KCgoYXMuZGF0YXx8JycpLl98
fCcnKVsnIyddIHx8IGF0LiQuYmFjaygnb3B0LnV1aWQnKSgpKVxuXHR9XG5cdGFzLnZpYS5wdXQoYXMuZGF0YSwgYXMuYWNrLCBhcyk7XG5cdFxuXG5cdHJl
dHVybjtcblx0aWYoYXQuZ2V0ICYmIGF0LmJhY2suc291bCl7XG5cdFx0dG1wID0gYXMuZGF0YTtcblx0XHRhcy52aWEgPSBhdC5iYWNrLiQ7XG5cdFx0KGFz
LmRhdGEgPSB7fSlbYXQuZ2V0XSA9IHRtcDsgXG5cdFx0YXMudmlhLnB1dChhcy5kYXRhLCBhcy5hY2ssIGFzKTtcblx0XHRyZXR1cm47XG5cdH1cbn1cbmZ1
bmN0aW9uIGNoZWNrKGQsIHRtcCl7IHJldHVybiAoKGQgJiYgKHRtcCA9IGQuY29uc3RydWN0b3IpICYmIHRtcC5uYW1lKSB8fCB0eXBlb2YgZCkgfVxuXG52
YXIgdSwgZW1wdHkgPSB7fSwgbm9vcCA9IGZ1bmN0aW9uKCl7fSwgdHVybiA9IHNldFRpbWVvdXQudHVybiwgdmFsaWQgPSBHdW4udmFsaWQsIHN0YXRlX2lm
eSA9IEd1bi5zdGF0ZS5pZnk7XG52YXIgaWlmZSA9IGZ1bmN0aW9uKGZuLGFzKXtmbi5jYWxsKGFzfHxlbXB0eSl9XG5cdFxufSgpKTsiLCJzcmMvZ3VuL2Nv
cmUuanMiOiJpbXBvcnQgJy4vY2hhaW4uanMnO1xuaW1wb3J0ICcuL2JhY2suanMnO1xuaW1wb3J0ICcuL3B1dC5qcyc7XG5pbXBvcnQgJy4vZ2V0LmpzJztc
bmltcG9ydCBfX3Jvb3QgZnJvbSAnLi9yb290LmpzJztcblxubGV0IF9fZGVmYXVsdEV4cG9ydDtcbihmdW5jdGlvbigpe1xuICB2YXIgR3VuID0gX19yb290
O1xuICBfX2RlZmF1bHRFeHBvcnQgPSBHdW47XG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgX19kZWZhdWx0RXhwb3J0OyIsInNyYy9ndW4vaW5kZXguanMiOiJp
bXBvcnQgJy4vc2hpbS5qcyc7XG5pbXBvcnQgJy4vb250by5qcyc7XG5pbXBvcnQgJy4vYm9vay5qcyc7XG5pbXBvcnQgJy4vdmFsaWQuanMnO1xuaW1wb3J0
ICcuL3N0YXRlLmpzJztcbmltcG9ydCAnLi9kdXAuanMnO1xuaW1wb3J0ICcuL2Fzay5qcyc7XG5pbXBvcnQgJy4vY29yZS5qcyc7XG5pbXBvcnQgJy4vb24u
anMnO1xuaW1wb3J0ICcuL21hcC5qcyc7XG5pbXBvcnQgJy4vc2V0LmpzJztcbmltcG9ydCAnLi9tZXNoLmpzJztcbmltcG9ydCAnLi93ZWJzb2NrZXQuanMn
O1xuaW1wb3J0ICcuL2xvY2FsU3RvcmFnZS5qcyc7XG5pbXBvcnQgX19yb290IGZyb20gJy4vcm9vdC5qcyc7XG5cbmxldCBfX2RlZmF1bHRFeHBvcnQ7XG4o
ZnVuY3Rpb24oKXtcbiAgdmFyIEd1biA9IF9fcm9vdDtcbiAgX19kZWZhdWx0RXhwb3J0ID0gR3VuO1xufSgpKTtcbmV4cG9ydCBkZWZhdWx0IF9fZGVmYXVs
dEV4cG9ydDsiLCJzcmMvZ3VuL29uLmpzIjoiaW1wb3J0IF9fcm9vdCBmcm9tICcuL3Jvb3QuanMnO1xuKGZ1bmN0aW9uKCl7XG5cbnZhciBHdW4gPSBfX3Jv
b3Q7XG5HdW4uY2hhaW4ub24gPSBmdW5jdGlvbih0YWcsIGFyZywgZWFzLCBhcyl7IC8vIGRvbid0IHJld3JpdGUhXG5cdHZhciBndW4gPSB0aGlzLCBjYXQg
PSBndW4uXywgcm9vdCA9IGNhdC5yb290LCBhY3QsIG9mZiwgaWQsIHRtcDtcblx0aWYodHlwZW9mIHRhZyA9PT0gJ3N0cmluZycpe1xuXHRcdGlmKCFhcmcp
eyByZXR1cm4gY2F0Lm9uKHRhZykgfVxuXHRcdGFjdCA9IGNhdC5vbih0YWcsIGFyZywgZWFzIHx8IGNhdCwgYXMpO1xuXHRcdGlmKGVhcyAmJiBlYXMuJCl7
XG5cdFx0XHQoZWFzLnN1YnMgfHwgKGVhcy5zdWJzID0gW10pKS5wdXNoKGFjdCk7XG5cdFx0fVxuXHRcdHJldHVybiBndW47XG5cdH1cblx0dmFyIG9wdCA9
IGFyZztcblx0KG9wdCA9ICh0cnVlID09PSBvcHQpPyB7Y2hhbmdlOiB0cnVlfSA6IG9wdCB8fCB7fSkubm90ID0gMTsgb3B0Lm9uID0gMTtcblx0Ly9vcHQu
YXQgPSBjYXQ7XG5cdC8vb3B0Lm9rID0gdGFnO1xuXHQvL29wdC5sYXN0ID0ge307XG5cdHZhciB3YWl0ID0ge307IC8vIGNhbiB3ZSBhc3NpZ24gdGhpcyB0
byB0aGUgYXQgaW5zdGVhZCwgbGlrZSBpbiBvbmNlP1xuXHRndW4uZ2V0KHRhZywgb3B0KTtcblx0LypndW4uZ2V0KGZ1bmN0aW9uIG9uKGRhdGEsa2V5LG1z
ZyxldmUpeyB2YXIgJCA9IHRoaXM7XG5cdFx0aWYodG1wID0gcm9vdC5oYXRjaCl7IC8vIHF1aWNrIGhhY2shXG5cdFx0XHRpZih3YWl0WyQuXy5pZF0peyBy
ZXR1cm4gfSB3YWl0WyQuXy5pZF0gPSAxO1xuXHRcdFx0dG1wLnB1c2goZnVuY3Rpb24oKXtvbi5jYWxsKCQsIGRhdGEsa2V5LG1zZyxldmUpfSk7XG5cdFx0
XHRyZXR1cm47XG5cdFx0fTsgd2FpdCA9IHt9OyAvLyBlbmQgcXVpY2sgaGFjay5cblx0XHR0YWcuY2FsbCgkLCBkYXRhLGtleSxtc2csZXZlKTtcblx0fSwg
b3B0KTsgLy8gVE9ETzogUEVSRiEgRXZlbnQgbGlzdGVuZXIgbGVhayEhIT8qL1xuXHQvKlxuXHRmdW5jdGlvbiBvbmUobXNnLCBldmUpe1xuXHRcdGlmKG9u
ZS5zdHVuKXsgcmV0dXJuIH1cblx0XHR2YXIgYXQgPSBtc2cuJC5fLCBkYXRhID0gYXQucHV0LCB0bXA7XG5cdFx0aWYodG1wID0gYXQubGluayl7IGRhdGEg
PSByb290LiQuZ2V0KHRtcCkuXy5wdXQgfVxuXHRcdGlmKG9wdC5ub3Q9PT11ICYmIHUgPT09IGRhdGEpeyByZXR1cm4gfVxuXHRcdGlmKG9wdC5zdHVuPT09
dSAmJiAodG1wID0gcm9vdC5zdHVuKSAmJiAodG1wID0gdG1wW2F0LmlkXSB8fCB0bXBbYXQuYmFjay5pZF0pICYmICF0bXAuZW5kKXsgLy8gUmVtZW1iZXIh
IElmIHlvdSBwb3J0IHRoaXMgaW50byBgLmdldChjYmAgbWFrZSBzdXJlIHlvdSBhbGxvdyBzdHVuOjAgc2tpcCBvcHRpb24gZm9yIGAucHV0KGAuXG5cdFx0
XHR0bXBbaWRdID0gZnVuY3Rpb24oKXtvbmUobXNnLGV2ZSl9O1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHQvL3RtcCA9IG9uZS53YWl0IHx8IChvbmUu
d2FpdCA9IHt9KTsgY29uc29sZS5sb2codG1wW2F0LmlkXSA9PT0gJycpOyBpZih0bXBbYXQuaWRdICE9PSAnJyl7IHRtcFthdC5pZF0gPSB0bXBbYXQuaWRd
IHx8IHNldFRpbWVvdXQoZnVuY3Rpb24oKXt0bXBbYXQuaWRdPScnO29uZShtc2csZXZlKX0sMSk7IHJldHVybiB9IGRlbGV0ZSB0bXBbYXQuaWRdO1xuXHRc
dC8vIGNhbGw6XG5cdFx0aWYob3B0LmFzKXtcblx0XHRcdG9wdC5vay5jYWxsKG9wdC5hcywgbXNnLCBldmUgfHwgb25lKTtcblx0XHR9IGVsc2Uge1xuXHRc
dFx0b3B0Lm9rLmNhbGwoYXQuJCwgZGF0YSwgbXNnLmdldCB8fCBhdC5nZXQsIG1zZywgZXZlIHx8IG9uZSk7XG5cdFx0fVxuXHR9O1xuXHRvbmUuYXQgPSBj
YXQ7XG5cdChjYXQuYWN0fHwoY2F0LmFjdD17fSkpW2lkID0gU3RyaW5nLnJhbmRvbSg3KV0gPSBvbmU7XG5cdG9uZS5vZmYgPSBmdW5jdGlvbigpeyBvbmUu
c3R1biA9IDE7IGlmKCFjYXQuYWN0KXsgcmV0dXJuIH0gZGVsZXRlIGNhdC5hY3RbaWRdIH1cblx0Y2F0Lm9uKCdvdXQnLCB7Z2V0OiB7fX0pOyovXG5cdHJl
dHVybiBndW47XG59XG4vLyBSdWxlczpcbi8vIDEuIElmIGNhY2hlZCwgc2hvdWxkIGJlIGZhc3QsIGJ1dCBub3QgcmVhZCB3aGlsZSB3cml0ZS5cbi8vIDIu
IFNob3VsZCBub3QgcmV0cmlnZ2VyIG90aGVyIGxpc3RlbmVycywgc2hvdWxkIGdldCB0cmlnZ2VyZWQgZXZlbiBpZiBub3RoaW5nIGZvdW5kLlxuLy8gMy4g
SWYgdGhlIHNhbWUgY2FsbGJhY2sgcGFzc2VkIHRvIG1hbnkgZGlmZmVyZW50IG9uY2UgY2hhaW5zLCBlYWNoIHNob3VsZCByZXNvbHZlIC0gYW4gdW5zdWJz
Y3JpYmUgZnJvbSB0aGUgc2FtZSBjYWxsYmFjayBzaG91bGQgbm90IGVmZmVjdCB0aGUgc3RhdGUgb2YgdGhlIG90aGVyIHJlc29sdmluZyBjaGFpbnMsIGlm
IHlvdSBkbyB3YW50IHRvIGNhbmNlbCB0aGVtIGFsbCBlYXJseSB5b3Ugc2hvdWxkIG11dGF0ZSB0aGUgY2FsbGJhY2sgaXRzZWxmIHdpdGggYSBmbGFnICYg
Y2hlY2sgZm9yIGl0IGF0IHRvcCBvZiBjYWxsYmFja1xuR3VuLmNoYWluLm9uY2UgPSBmdW5jdGlvbihjYiwgb3B0KXsgb3B0ID0gb3B0IHx8IHt9OyAvLyBh
dm9pZCByZXdyaXRpbmdcblx0aWYoIWNiKXsgcmV0dXJuIG5vbmUodGhpcyxvcHQpIH1cblx0dmFyIGd1biA9IHRoaXMsIGNhdCA9IGd1bi5fLCByb290ID0g
Y2F0LnJvb3QsIGRhdGEgPSBjYXQucHV0LCBpZCA9IFN0cmluZy5yYW5kb20oNyksIG9uZSwgdG1wO1xuXHRndW4uZ2V0KGZ1bmN0aW9uKGRhdGEsa2V5LG1z
ZyxldmUpe1xuXHRcdHZhciAkID0gdGhpcywgYXQgPSAkLl8sIG9uZSA9IChhdC5vbmV8fChhdC5vbmU9e30pKTtcblx0XHRpZihldmUuc3R1bil7IHJldHVy
biB9IGlmKCcnID09PSBvbmVbaWRdKXsgcmV0dXJuIH1cblx0XHRpZih0cnVlID09PSAodG1wID0gR3VuLnZhbGlkKGRhdGEpKSl7IG9uY2UoKTsgcmV0dXJu
IH1cblx0XHRpZignc3RyaW5nJyA9PSB0eXBlb2YgdG1wKXsgcmV0dXJuIH1cblx0XHRjbGVhclRpbWVvdXQoKGNhdC5vbmV8fCcnKVtpZF0pOyAvLyBjbGVh
ciBcIm5vdCBmb3VuZFwiIHNpbmNlIHRoZXkgb25seSBnZXQgc2V0IG9uIGNhdC5cblx0XHRjbGVhclRpbWVvdXQob25lW2lkXSk7IG9uZVtpZF0gPSBzZXRU
aW1lb3V0KG9uY2UsIG9wdC53YWl0fHw5OSk7IC8vIFRPRE86IEJ1Zz8gVGhpcyBkb2Vzbid0IGhhbmRsZSBwbHVyYWwgY2hhaW5zLlxuXHRcdGZ1bmN0aW9u
IG9uY2UoZil7XG5cdFx0XHRpZighYXQuaGFzICYmICFhdC5zb3VsKXsgYXQgPSB7cHV0OiBkYXRhLCBnZXQ6IGtleX0gfSAvLyBoYW5kbGVzIG5vbi1jb3Jl
IG1lc3NhZ2VzLlxuXHRcdFx0aWYodSA9PT0gKHRtcCA9IGF0LnB1dCkpeyB0bXAgPSAoKG1zZy4kJHx8JycpLl98fCcnKS5wdXQgfVxuXHRcdFx0aWYoJ3N0
cmluZycgPT0gdHlwZW9mIEd1bi52YWxpZCh0bXApKXtcblx0XHRcdFx0dG1wID0gcm9vdC4kLmdldCh0bXApLl8ucHV0O1xuXHRcdFx0XHRpZih0bXAgPT09
IHUgJiYgIWYpe1xuXHRcdFx0XHRcdG9uZVtpZF0gPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IG9uY2UoMSkgfSwgb3B0LndhaXR8fDk5KTsgLy8gVE9ETzog
UXVpY2sgZml4LiBNYXliZSB1c2UgYWNrIGNvdW50IGZvciBtb3JlIHByZWRpY3RhYmxlIGNvbnRyb2w/XG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdH1c
blx0XHRcdH1cblx0XHRcdC8vY29uc29sZS5sb2coXCJBTkQgVkFOSVNIRURcIiwgZGF0YSk7XG5cdFx0XHRpZihldmUuc3R1bil7IHJldHVybiB9IGlmKCcn
ID09PSBvbmVbaWRdKXsgcmV0dXJuIH0gb25lW2lkXSA9ICcnO1xuXHRcdFx0aWYoY2F0LnNvdWwgfHwgY2F0Lmhhcyl7IGV2ZS5vZmYoKSB9IC8vIFRPRE86
IFBsdXJhbCBjaGFpbnM/IC8vIGVsc2UgeyA/Lm9mZigpIH0gLy8gYmV0dGVyIHRoYW4gb25lIGNoZWNrP1xuXHRcdFx0Y2IuY2FsbCgkLCB0bXAsIGF0Lmdl
dCk7XG5cdFx0XHRjbGVhclRpbWVvdXQob25lW2lkXSk7IC8vIGNsZWFyIFwibm90IGZvdW5kXCIgc2luY2UgdGhleSBvbmx5IGdldCBzZXQgb24gY2F0LiAv
LyBUT0RPOiBUaGlzIHdhcyBoYWNraWx5IGFkZGVkLCBpcyBpdCBuZWNlc3Nhcnkgb3IgaW1wb3J0YW50PyBQcm9iYWJseSBub3QsIGluIGZ1dHVyZSB0cnkg
cmVtb3ZpbmcgdGhpcy4gV2FzIGFkZGVkIGp1c3QgYXMgYSBzYWZldHkgZm9yIHRoZSBgJiYgIWZgIGNoZWNrLlxuXHRcdH07XG5cdH0sIHtvbjogMX0pO1xu
XHRyZXR1cm4gZ3VuO1xufVxuZnVuY3Rpb24gbm9uZShndW4sb3B0LGNoYWluKXtcblx0R3VuLmxvZy5vbmNlKFwidmFsb25jZVwiLCBcIkNoYWluYWJsZSB2
YWwgaXMgZXhwZXJpbWVudGFsLCBpdHMgYmVoYXZpb3IgYW5kIEFQSSBtYXkgY2hhbmdlIG1vdmluZyBmb3J3YXJkLiBQbGVhc2UgcGxheSB3aXRoIGl0IGFu
ZCByZXBvcnQgYnVncyBhbmQgaWRlYXMgb24gaG93IHRvIGltcHJvdmUgaXQuXCIpO1xuXHQoY2hhaW4gPSBndW4uY2hhaW4oKSkuXy5uaXggPSBndW4ub25j
ZShmdW5jdGlvbihkYXRhLCBrZXkpeyBjaGFpbi5fLm9uKCdpbicsIHRoaXMuXykgfSk7XG5cdGNoYWluLl8ubGV4ID0gZ3VuLl8ubGV4OyAvLyBUT0RPOiBC
ZXR0ZXIgYXBwcm9hY2ggaW4gZnV0dXJlPyBUaGlzIGlzIHF1aWNrIGZvciBub3cuXG5cdHJldHVybiBjaGFpbjtcbn1cblxuR3VuLmNoYWluLm9mZiA9IGZ1
bmN0aW9uKCl7XG5cdC8vIG1ha2Ugb2ZmIG1vcmUgYWdncmVzc2l2ZS4gV2FybmluZywgaXQgbWlnaHQgYmFja2ZpcmUhXG5cdHZhciBndW4gPSB0aGlzLCBh
dCA9IGd1bi5fLCB0bXA7XG5cdHZhciBjYXQgPSBhdC5iYWNrO1xuXHRpZighY2F0KXsgcmV0dXJuIH1cblx0YXQuYWNrID0gMDsgLy8gc28gY2FuIHJlc3Vi
c2NyaWJlLlxuXHRpZih0bXAgPSBjYXQubmV4dCl7XG5cdFx0aWYodG1wW2F0LmdldF0pe1xuXHRcdFx0ZGVsZXRlIHRtcFthdC5nZXRdO1xuXHRcdH0gZWxz
ZSB7XG5cblx0XHR9XG5cdH1cblx0Ly8gVE9ETzogZGVsZXRlIGNhdC5vbmVbbWFwLmlkXT9cblx0aWYgKHRtcCA9IGNhdC5hbnkpIHtcblx0XHRkZWxldGUg
Y2F0LmFueTtcblx0XHRjYXQuYW55ID0ge307XG5cdH1cblx0aWYodG1wID0gY2F0LmFzayl7XG5cdFx0ZGVsZXRlIHRtcFthdC5nZXRdO1xuXHR9XG5cdGlm
KHRtcCA9IGNhdC5wdXQpe1xuXHRcdGRlbGV0ZSB0bXBbYXQuZ2V0XTtcblx0fVxuXHRpZih0bXAgPSBhdC5zb3VsKXtcblx0XHRkZWxldGUgY2F0LnJvb3Qu
Z3JhcGhbdG1wXTtcblx0fVxuXHRpZih0bXAgPSBhdC5tYXApe1xuXHRcdE9iamVjdC5rZXlzKHRtcCkuZm9yRWFjaChmdW5jdGlvbihpLGF0KXsgYXQgPSB0
bXBbaV07IC8vb2JqX21hcCh0bXAsIGZ1bmN0aW9uKGF0KXtcblx0XHRcdGlmKGF0Lmxpbmspe1xuXHRcdFx0XHRjYXQucm9vdC4kLmdldChhdC5saW5rKS5v
ZmYoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRpZih0bXAgPSBhdC5uZXh0KXtcblx0XHRPYmplY3Qua2V5cyh0bXApLmZvckVhY2goZnVuY3Rpb24o
aSxuZWF0KXsgbmVhdCA9IHRtcFtpXTsgLy9vYmpfbWFwKHRtcCwgZnVuY3Rpb24obmVhdCl7XG5cdFx0XHRuZWF0LiQub2ZmKCk7XG5cdFx0fSk7XG5cdH1c
blx0YXQub24oJ29mZicsIHt9KTtcblx0cmV0dXJuIGd1bjtcbn1cbnZhciBlbXB0eSA9IHt9LCBub29wID0gZnVuY3Rpb24oKXt9LCB1O1xuXHRcbn0oKSk7
Iiwic3JjL2d1bi9tYXAuanMiOiJpbXBvcnQgX19yb290IGZyb20gJy4vcm9vdC5qcyc7XG4oZnVuY3Rpb24oKXtcblxudmFyIEd1biA9IF9fcm9vdCwgbmV4
dCA9IEd1bi5jaGFpbi5nZXQubmV4dDtcbkd1bi5jaGFpbi5nZXQubmV4dCA9IGZ1bmN0aW9uKGd1biwgbGV4KXsgdmFyIHRtcDtcblx0aWYoIU9iamVjdC5w
bGFpbihsZXgpKXsgcmV0dXJuIChuZXh0fHxub29wKShndW4sIGxleCkgfVxuXHRpZih0bXAgPSAoKHRtcCA9IGxleFsnIyddKXx8JycpWyc9J10gfHwgdG1w
KXsgcmV0dXJuIGd1bi5nZXQodG1wKSB9XG5cdCh0bXAgPSBndW4uY2hhaW4oKS5fKS5sZXggPSBsZXg7IC8vIExFWCFcblx0Z3VuLm9uKCdpbicsIGZ1bmN0
aW9uKGV2ZSl7XG5cdFx0aWYoU3RyaW5nLm1hdGNoKGV2ZS5nZXR8fCAoZXZlLnB1dHx8JycpWycuJ10sIGxleFsnLiddIHx8IGxleFsnIyddIHx8IGxleCkp
e1xuXHRcdFx0dG1wLm9uKCdpbicsIGV2ZSk7XG5cdFx0fVxuXHRcdHRoaXMudG8ubmV4dChldmUpO1xuXHR9KTtcblx0cmV0dXJuIHRtcC4kO1xufVxuR3Vu
LmNoYWluLm1hcCA9IGZ1bmN0aW9uKGNiLCBvcHQsIHQpe1xuXHR2YXIgZ3VuID0gdGhpcywgY2F0ID0gZ3VuLl8sIGxleCwgY2hhaW47XG5cdGlmKE9iamVj
dC5wbGFpbihjYikpeyBsZXggPSBjYlsnLiddPyBjYiA6IHsnLic6IGNifTsgY2IgPSB1IH1cblx0aWYoIWNiKXtcblx0XHRpZihjaGFpbiA9IGNhdC5lYWNo
KXsgcmV0dXJuIGNoYWluIH1cblx0XHQoY2F0LmVhY2ggPSBjaGFpbiA9IGd1bi5jaGFpbigpKS5fLmxleCA9IGxleCB8fCBjaGFpbi5fLmxleCB8fCBjYXQu
bGV4O1xuXHRcdGNoYWluLl8ubml4ID0gZ3VuLmJhY2soJ25peCcpO1xuXHRcdGd1bi5vbignaW4nLCBtYXAsIGNoYWluLl8pO1xuXHRcdHJldHVybiBjaGFp
bjtcblx0fVxuXHRHdW4ubG9nLm9uY2UoXCJtYXBmblwiLCBcIk1hcCBmdW5jdGlvbnMgYXJlIGV4cGVyaW1lbnRhbCwgdGhlaXIgYmVoYXZpb3IgYW5kIEFQ
SSBtYXkgY2hhbmdlIG1vdmluZyBmb3J3YXJkLiBQbGVhc2UgcGxheSB3aXRoIGl0IGFuZCByZXBvcnQgYnVncyBhbmQgaWRlYXMgb24gaG93IHRvIGltcHJv
dmUgaXQuXCIpO1xuXHRjaGFpbiA9IGd1bi5jaGFpbigpO1xuXHRndW4ubWFwKCkub24oZnVuY3Rpb24oZGF0YSwga2V5LCBtc2csIGV2ZSl7XG5cdFx0dmFy
IG5leHQgPSAoY2J8fG5vb3ApLmNhbGwodGhpcywgZGF0YSwga2V5LCBtc2csIGV2ZSk7XG5cdFx0aWYodSA9PT0gbmV4dCl7IHJldHVybiB9XG5cdFx0aWYo
ZGF0YSA9PT0gbmV4dCl7IHJldHVybiBjaGFpbi5fLm9uKCdpbicsIG1zZykgfVxuXHRcdGlmKEd1bi5pcyhuZXh0KSl7IHJldHVybiBjaGFpbi5fLm9uKCdp
bicsIG5leHQuXykgfVxuXHRcdHZhciB0bXAgPSB7fTsgT2JqZWN0LmtleXMobXNnLnB1dCkuZm9yRWFjaChmdW5jdGlvbihrKXsgdG1wW2tdID0gbXNnLnB1
dFtrXSB9LCB0bXApOyB0bXBbJz0nXSA9IG5leHQ7IFxuXHRcdGNoYWluLl8ub24oJ2luJywge2dldDoga2V5LCBwdXQ6IHRtcH0pO1xuXHR9KTtcblx0cmV0
dXJuIGNoYWluO1xufVxuZnVuY3Rpb24gbWFwKG1zZyl7IHRoaXMudG8ubmV4dChtc2cpO1xuXHR2YXIgY2F0ID0gdGhpcy5hcywgZ3VuID0gbXNnLiQsIGF0
ID0gZ3VuLl8sIHB1dCA9IG1zZy5wdXQsIHRtcDtcblx0aWYoIWF0LnNvdWwgJiYgIW1zZy4kJCl7IHJldHVybiB9IC8vIHRoaXMgbGluZSB0b29rIGh1bmRy
ZWRzIG9mIHRyaWVzIHRvIGZpZ3VyZSBvdXQuIEl0IG9ubHkgd29ya3MgaWYgY29yZSBjaGVja3MgdG8gZmlsdGVyIG91dCBhYm92ZSBjaGFpbnMgZHVyaW5n
IGxpbmsgdGhvLiBUaGlzIHNheXMgXCJvbmx5IGJvdGhlciB0byBtYXAgb24gYSBub2RlXCIgZm9yIHRoaXMgbGF5ZXIgb2YgdGhlIGNoYWluLiBJZiBzb21l
dGhpbmcgaXMgbm90IGEgbm9kZSwgbWFwIHNob3VsZCBub3Qgd29yay5cblx0aWYoKHRtcCA9IGNhdC5sZXgpICYmICFTdHJpbmcubWF0Y2gobXNnLmdldHx8
IChwdXR8fCcnKVsnLiddLCB0bXBbJy4nXSB8fCB0bXBbJyMnXSB8fCB0bXApKXsgcmV0dXJuIH1cblx0R3VuLm9uLmxpbmsobXNnLCBjYXQpO1xufVxudmFy
IG5vb3AgPSBmdW5jdGlvbigpe30sIGV2ZW50ID0ge3N0dW46IG5vb3AsIG9mZjogbm9vcH0sIHU7XG5cdFxufSgpKTsiLCJzcmMvZ3VuL3NldC5qcyI6Imlt
cG9ydCBfX3Jvb3QgZnJvbSAnLi9yb290LmpzJztcbihmdW5jdGlvbigpe1xuXG52YXIgR3VuID0gX19yb290O1xuR3VuLmNoYWluLnNldCA9IGZ1bmN0aW9u
KGl0ZW0sIGNiLCBvcHQpe1xuXHR2YXIgZ3VuID0gdGhpcywgcm9vdCA9IGd1bi5iYWNrKC0xKSwgc291bCwgdG1wO1xuXHRjYiA9IGNiIHx8IGZ1bmN0aW9u
KCl7fTtcblx0b3B0ID0gb3B0IHx8IHt9OyBvcHQuaXRlbSA9IG9wdC5pdGVtIHx8IGl0ZW07XG5cdGlmKHNvdWwgPSAoKGl0ZW18fCcnKS5ffHwnJylbJyMn
XSl7IChpdGVtID0ge30pWycjJ10gPSBzb3VsIH0gLy8gY2hlY2sgaWYgbm9kZSwgbWFrZSBsaW5rLlxuXHRpZignc3RyaW5nJyA9PSB0eXBlb2YgKHRtcCA9
IEd1bi52YWxpZChpdGVtKSkpeyByZXR1cm4gZ3VuLmdldChzb3VsID0gdG1wKS5wdXQoaXRlbSwgY2IsIG9wdCkgfSAvLyBjaGVjayBpZiBsaW5rXG5cdGlm
KCFHdW4uaXMoaXRlbSkpe1xuXHRcdGlmKE9iamVjdC5wbGFpbihpdGVtKSl7XG5cdFx0XHRpdGVtID0gcm9vdC5nZXQoc291bCA9IGd1bi5iYWNrKCdvcHQu
dXVpZCcpKCkpLnB1dChpdGVtKTtcblx0XHR9XG5cdFx0cmV0dXJuIGd1bi5nZXQoc291bCB8fCByb290LmJhY2soJ29wdC51dWlkJykoNykpLnB1dChpdGVt
LCBjYiwgb3B0KTtcblx0fVxuXHRndW4ucHV0KGZ1bmN0aW9uKGdvKXtcblx0XHRpdGVtLmdldChmdW5jdGlvbihzb3VsLCBvLCBtc2cpeyAvLyBUT0RPOiBC
VUchIFdlIG5vIGxvbmdlciBoYXZlIHRoaXMgb3B0aW9uPyAmIGdvIGVycm9yIG5vdCBoYW5kbGVkP1xuXHRcdFx0aWYoIXNvdWwpeyByZXR1cm4gY2IuY2Fs
bChndW4sIHtlcnI6IEd1bi5sb2coJ09ubHkgYSBub2RlIGNhbiBiZSBsaW5rZWQhIE5vdCBcIicgKyBtc2cucHV0ICsgJ1wiIScpfSkgfVxuXHRcdFx0KHRt
cCA9IHt9KVtzb3VsXSA9IHsnIyc6IHNvdWx9OyBnbyh0bXApO1xuXHRcdH0sdHJ1ZSk7XG5cdH0pXG5cdHJldHVybiBpdGVtO1xufVxuXHRcbn0oKSk7Iiwi
c3JjL2d1bi9tZXNoLmpzIjoiaW1wb3J0ICcuL3NoaW0uanMnO1xuXG5sZXQgX19kZWZhdWx0RXhwb3J0O1xuKGZ1bmN0aW9uKCl7XG4gICAgdmFyIG5vb3Ag
PSBmdW5jdGlvbigpe31cbiAgICB2YXIgcGFyc2UgPSBKU09OLnBhcnNlQXN5bmMgfHwgZnVuY3Rpb24odCxjYixyKXsgdmFyIHUsIGQgPSArbmV3IERhdGU7
IHRyeXsgY2IodSwgSlNPTi5wYXJzZSh0LHIpLCBqc29uLnN1Y2tzKCtuZXcgRGF0ZSAtIGQpKSB9Y2F0Y2goZSl7IGNiKGUpIH0gfVxuICAgIHZhciBqc29u
ID0gSlNPTi5zdHJpbmdpZnlBc3luYyB8fCBmdW5jdGlvbih2LGNiLHIscyl7IHZhciB1LCBkID0gK25ldyBEYXRlOyB0cnl7IGNiKHUsIEpTT04uc3RyaW5n
aWZ5KHYscixzKSwganNvbi5zdWNrcygrbmV3IERhdGUgLSBkKSkgfWNhdGNoKGUpeyBjYihlKSB9IH1cbiAgICBqc29uLnN1Y2tzID0gZnVuY3Rpb24oZCl7
IGlmKGQgPiA5OSl7IGNvbnNvbGUubG9nKFwiV2FybmluZzogSlNPTiBibG9ja2luZyBDUFUgZGV0ZWN0ZWQuIEFkZCBgZ3VuL2xpYi95c29uLmpzYCB0byBm
aXguXCIpOyBqc29uLnN1Y2tzID0gbm9vcCB9IH1cblxuICAgIGZ1bmN0aW9uIE1lc2gocm9vdCl7XG4gICAgICAgIHZhciBtZXNoID0gZnVuY3Rpb24oKXt9
O1xuICAgICAgICB2YXIgb3B0ID0gcm9vdC5vcHQgfHwge307XG4gICAgICAgIG9wdC5sb2cgPSBvcHQubG9nIHx8IGNvbnNvbGUubG9nO1xuICAgICAgICBv
cHQuZ2FwID0gb3B0LmdhcCB8fCBvcHQud2FpdCB8fCAwO1xuICAgICAgICBvcHQubWF4ID0gb3B0Lm1heCB8fCAob3B0Lm1lbW9yeT8gKG9wdC5tZW1vcnkg
KiA5OTkgKiA5OTkpIDogMzAwMDAwMDAwKSAqIDAuMztcbiAgICAgICAgb3B0LnBhY2sgPSBvcHQucGFjayB8fCAob3B0Lm1heCAqIDAuMDEgKiAwLjAxKTtc
biAgICAgICAgb3B0LnB1ZmYgPSBvcHQucHVmZiB8fCA5OyAvLyBJREVBOiBkbyBhIHN0YXJ0L2VuZCBiZW5jaG1hcmssIGRpdmlkZSBvcHMvcmVzdWx0Llxu
ICAgICAgICB2YXIgcHVmZiA9IHNldFRpbWVvdXQudHVybiB8fCBzZXRUaW1lb3V0O1xuXG4gICAgICAgIHZhciBkdXAgPSByb290LmR1cCwgZHVwX2NoZWNr
ID0gZHVwLmNoZWNrLCBkdXBfdHJhY2sgPSBkdXAudHJhY2s7XG5cbiAgICAgICAgdmFyIFNUID0gK25ldyBEYXRlLCBMVCA9IFNUO1xuXG4gICAgICAgIHZh
ciBoZWFyID0gbWVzaC5oZWFyID0gZnVuY3Rpb24ocmF3LCBwZWVyKXtcbiAgICAgICAgICAgIGlmKCFyYXcpeyByZXR1cm4gfVxuICAgICAgICAgICAgaWYo
b3B0Lm1heCA8PSByYXcubGVuZ3RoKXsgcmV0dXJuIG1lc2guc2F5KHtkYW06ICchJywgZXJyOiBcIk1lc3NhZ2UgdG9vIGJpZyFcIn0sIHBlZXIpIH1cbiAg
ICAgICAgICAgIGlmKG1lc2ggPT09IHRoaXMpe1xuICAgICAgICAgICAgICAgIC8qaWYoJ3N0cmluZycgPT0gdHlwZW9mIHJhdyl7IHRyeXtcbiAgICAgICAg
ICAgICAgICAgICAgdmFyIHN0YXQgPSBjb25zb2xlLlNUQVQgfHwge307XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ0hFQVI6JywgcGVl
ci5pZCwgKHJhd3x8JycpLnNsaWNlKDAsMjUwKSwgKChyYXd8fCcnKS5sZW5ndGggLyAxMDI0IC8gMTAyNCkudG9GaXhlZCg0KSk7XG4gICAgICAgICAgICAg
ICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNldFRpbWVvdXQudHVybi5zLmxlbmd0aCwgJ3N0YWNrcycsIHBhcnNlRmxvYXQo
KC0oTFQgLSAoTFQgPSArbmV3IERhdGUpKS8xMDAwKS50b0ZpeGVkKDMpKSwgJ3NlYycsIHBhcnNlRmxvYXQoKChMVC1TVCkvMTAwMCAvIDYwKS50b0ZpeGVk
KDEpKSwgJ3VwJywgc3RhdC5wZWVyc3x8MCwgJ3BlZXJzJywgc3RhdC5oYXN8fDAsICdoYXMnLCBzdGF0Lm1lbWh1c2VkfHwwLCBzdGF0Lm1lbXVzZWR8fDAs
IHN0YXQubWVtYXh8fDAsICdoZWFwIG1lbSBtYXgnKTtcbiAgICAgICAgICAgICAgICB9Y2F0Y2goZSl7IGNvbnNvbGUubG9nKCdEQkcgZXJyJywgZSkgfX0q
L1xuICAgICAgICAgICAgICAgIGhlYXIuZCArPSByYXcubGVuZ3RofHwwIDsgKytoZWFyLmMgfSAvLyBTVEFUUyFcbiAgICAgICAgICAgIHZhciBTID0gcGVl
ci5TSCA9ICtuZXcgRGF0ZTtcbiAgICAgICAgICAgIHZhciB0bXAgPSByYXdbMF0sIG1zZztcbiAgICAgICAgICAgIC8vcmF3ICYmIHJhdy5zbGljZSAmJiBj
b25zb2xlLmxvZyhcImhlYXI6XCIsICgocGVlci53aXJlfHwnJykuaGVhZGVyc3x8JycpLm9yaWdpbiwgcmF3Lmxlbmd0aCwgcmF3LnNsaWNlICYmIHJhdy5z
bGljZSgwLDUwKSk7IC8vdGMtaWFtdW5pcXVlLXRjLXBhY2thZ2UtZHMxXG4gICAgICAgICAgICBpZignWycgPT09IHRtcCl7XG4gICAgICAgICAgICAgICAg
cGFyc2UocmF3LCBmdW5jdGlvbihlcnIsIG1zZyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGVyciB8fCAhbXNnKXsgcmV0dXJuIG1lc2guc2F5KHtkYW06
ICchJywgZXJyOiBcIkRBTSBKU09OIHBhcnNlIGVycm9yLlwifSwgcGVlcikgfVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLlNUQVQgJiYgY29uc29s
ZS5TVEFUKCtuZXcgRGF0ZSwgbXNnLmxlbmd0aCwgJyMgb24gaGVhciBiYXRjaCcpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgUCA9IG9wdC5wdWZmO1xu
ICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gZ28oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBTID0gK25ldyBEYXRlO1xuICAgICAgICAg
ICAgICAgICAgICAgICAgdmFyIGkgPSAwLCBtOyB3aGlsZShpIDwgUCAmJiAobSA9IG1zZ1tpKytdKSl7IG1lc2guaGVhcihtLCBwZWVyKSB9XG4gICAgICAg
ICAgICAgICAgICAgICAgICBtc2cgPSBtc2cuc2xpY2UoaSk7IC8vIHNsaWNpbmcgYWZ0ZXIgaXMgZmFzdGVyIHRoYW4gc2hpZnRpbmcgZHVyaW5nLlxuICAg
ICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5TVEFUICYmIGNvbnNvbGUuU1RBVChTLCArbmV3IERhdGUgLSBTLCAnaGVhciBsb29wJyk7XG4gICAgICAg
ICAgICAgICAgICAgICAgICBmbHVzaChwZWVyKTsgLy8gZm9yY2Ugc2VuZCBhbGwgc3luY2hyb25vdXNseSBiYXRjaGVkIGFja3MuXG4gICAgICAgICAgICAg
ICAgICAgICAgICBpZighbXNnLmxlbmd0aCl7IHJldHVybiB9XG4gICAgICAgICAgICAgICAgICAgICAgICBwdWZmKGdvLCAwKTtcbiAgICAgICAgICAgICAg
ICAgICAgfSgpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByYXcgPSAnJzsgLy8gXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xu
ICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoJ3snID09PSB0bXAgfHwgKChyYXdbJyMnXSB8fCBPYmplY3QucGxhaW4ocmF3KSkgJiYgKG1zZyA9IHJh
dykpKXtcbiAgICAgICAgICAgICAgICBpZihtc2cpeyByZXR1cm4gaGVhci5vbmUobXNnLCBwZWVyLCBTKSB9XG4gICAgICAgICAgICAgICAgcGFyc2UocmF3
LCBmdW5jdGlvbihlcnIsIG1zZyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGVyciB8fCAhbXNnKXsgcmV0dXJuIG1lc2guc2F5KHtkYW06ICchJywgZXJy
OiBcIkRBTSBKU09OIHBhcnNlIGVycm9yLlwifSwgcGVlcikgfVxuICAgICAgICAgICAgICAgICAgICBoZWFyLm9uZShtc2csIHBlZXIsIFMpO1xuICAgICAg
ICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBoZWFyLm9uZSA9IGZ1bmN0
aW9uKG1zZywgcGVlciwgUyl7IC8vIFMgaGVyZSBpcyB0ZW1wb3JhcnkhIFVuZG8uXG4gICAgICAgICAgICB2YXIgaWQsIGhhc2gsIHRtcCwgYXNoLCBEQkc7
XG4gICAgICAgICAgICBpZihtc2cuREJHKXsgbXNnLkRCRyA9IERCRyA9IHtEQkc6IG1zZy5EQkd9IH1cbiAgICAgICAgICAgIERCRyAmJiAoREJHLmggPSBT
KTtcbiAgICAgICAgICAgIERCRyAmJiAoREJHLmhwID0gK25ldyBEYXRlKTtcbiAgICAgICAgICAgIGlmKCEoaWQgPSBtc2dbJyMnXSkpeyBpZCA9IG1zZ1sn
IyddID0gU3RyaW5nLnJhbmRvbSg5KSB9XG4gICAgICAgICAgICBpZih0bXAgPSBkdXBfY2hlY2soaWQpKXsgcmV0dXJuIH1cbiAgICAgICAgICAgIC8vIERB
TSBsb2dpYzpcbiAgICAgICAgICAgIGlmKCEoaGFzaCA9IG1zZ1snIyMnXSkgJiYgZmFsc2UgJiYgdSAhPT0gbXNnLnB1dCl7IC8qaGFzaCA9IG1zZ1snIyMn
XSA9IFR5cGUub2JqLmhhc2gobXNnLnB1dCkqLyB9IC8vIGRpc2FibGUgaGFzaGluZyBmb3Igbm93IC8vIFRPRE86IGltcG9zZSB3YXJuaW5nL3BlbmFsdHkg
aW5zdGVhZCAoPylcbiAgICAgICAgICAgIGlmKGhhc2ggJiYgKHRtcCA9IG1zZ1snQCddIHx8IChtc2cuZ2V0ICYmIGlkKSkgJiYgZHVwLmNoZWNrKGFzaCA9
IHRtcCtoYXNoKSl7IHJldHVybiB9IC8vIEltYWdpbmUgQSA8LT4gQiA8PT4gKEMgJiBEKSwgQyAmIEQgcmVwbHkgd2l0aCBzYW1lIEFDSyBidXQgaGF2ZSBk
aWZmZXJlbnQgSURzLCBCIGNhbiB1c2UgaGFzaCB0byBkZWR1cC4gT3IgaWYgYSBHRVQgaGFzIGEgaGFzaCBhbHJlYWR5LCB3ZSBzaG91bGRuJ3QgQUNLIGlm
IHNhbWUuXG4gICAgICAgICAgICAobXNnLl8gPSBmdW5jdGlvbigpe30pLnZpYSA9IG1lc2gubGVhcCA9IHBlZXI7XG4gICAgICAgICAgICBpZigodG1wID0g
bXNnWyc+PCddKSAmJiAnc3RyaW5nJyA9PSB0eXBlb2YgdG1wKXsgdG1wLnNsaWNlKDAsOTkpLnNwbGl0KCcsJykuZm9yRWFjaChmdW5jdGlvbihrKXsgdGhp
c1trXSA9IDEgfSwgKG1zZy5fKS55byA9IHt9KSB9IC8vIFBlZXJzIGFscmVhZHkgc2VudCB0bywgZG8gbm90IHJlc2VuZC5cbiAgICAgICAgICAgIC8vIERB
TSBeXG4gICAgICAgICAgICBpZih0bXAgPSBtc2cuZGFtKXtcbiAgICAgICAgICAgICAgICAoZHVwX3RyYWNrKGlkKXx8e30pLnZpYSA9IHBlZXI7XG4gICAg
ICAgICAgICAgICAgaWYodG1wID0gbWVzaC5oZWFyW3RtcF0pe1xuICAgICAgICAgICAgICAgICAgICB0bXAobXNnLCBwZWVyLCByb290KTtcbiAgICAgICAg
ICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYodG1wID0gbXNnLm9rKXsgbXNnLl8ubmVh
ciA9IHRtcFsnLyddIH1cbiAgICAgICAgICAgIHZhciBTID0gK25ldyBEYXRlO1xuICAgICAgICAgICAgREJHICYmIChEQkcuaXMgPSBTKTsgcGVlci5TSSA9
IGlkO1xuICAgICAgICAgICAgZHVwX3RyYWNrLmVkID0gZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICAgICAgaWYoaWQgIT09IGQpeyByZXR1cm4gfVxuICAg
ICAgICAgICAgICAgIGR1cF90cmFjay5lZCA9IDA7XG4gICAgICAgICAgICAgICAgaWYoIShkID0gZHVwLnNbaWRdKSl7IHJldHVybiB9XG4gICAgICAgICAg
ICAgICAgZC52aWEgPSBwZWVyO1xuICAgICAgICAgICAgICAgIGlmKG1zZy5nZXQpeyBkLml0ID0gbXNnIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAg
IHJvb3Qub24oJ2luJywgbWVzaC5sYXN0ID0gbXNnKTtcbiAgICAgICAgICAgIERCRyAmJiAoREJHLmhkID0gK25ldyBEYXRlKTtcbiAgICAgICAgICAgIGNv
bnNvbGUuU1RBVCAmJiBjb25zb2xlLlNUQVQoUywgK25ldyBEYXRlIC0gUywgbXNnLmdldD8gJ21zZyBnZXQnIDogbXNnLnB1dD8gJ21zZyBwdXQnIDogJ21z
ZycpO1xuICAgICAgICAgICAgZHVwX3RyYWNrKGlkKTsgLy8gaW4gY2FzZSAnaW4nIGRvZXMgbm90IGNhbGwgdHJhY2suXG4gICAgICAgICAgICBpZihhc2gp
eyBkdXBfdHJhY2soYXNoKSB9IC8vZHVwLnRyYWNrKHRtcCtoYXNoLCB0cnVlKS5pdCA9IGl0KG1zZyk7XG4gICAgICAgICAgICBtZXNoLmxlYXAgPSBtZXNo
Lmxhc3QgPSBudWxsOyAvLyB3YXJuaW5nISBtZXNoLmxlYXAgY291bGQgYmUgYnVnZ3kuXG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRvbWFwID0gZnVuY3Rp
b24oayxpLG0pe20oayx0cnVlKX07XG4gICAgICAgIGhlYXIuYyA9IGhlYXIuZCA9IDA7XG5cbiAgICAgICAgOyhmdW5jdGlvbigpe1xuICAgICAgICAgICAg
dmFyIFNNSUEgPSAwO1xuICAgICAgICAgICAgdmFyIGxvb3A7XG4gICAgICAgICAgICBtZXNoLmhhc2ggPSBmdW5jdGlvbihtc2csIHBlZXIpeyB2YXIgaCwg
cywgdDtcbiAgICAgICAgICAgICAgICB2YXIgUyA9ICtuZXcgRGF0ZTtcbiAgICAgICAgICAgICAgICBqc29uKG1zZy5wdXQsIGZ1bmN0aW9uIGhhc2goZXJy
LCB0ZXh0KXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNzID0gKHMgfHwgKHMgPSB0ID0gdGV4dHx8JycpKS5zbGljZSgwLCAzMjc2OCk7IC8vIDEwMjQg
KiAzMlxuICAgICAgICAgICAgICAgICAgaCA9IFN0cmluZy5oYXNoKHNzLCBoKTsgcyA9IHMuc2xpY2UoMzI3NjgpO1xuICAgICAgICAgICAgICAgICAgaWYo
cyl7IHB1ZmYoaGFzaCwgMCk7IHJldHVybiB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuU1RBVCAmJiBjb25zb2xlLlNUQVQoUywgK25ldyBEYXRl
IC0gUywgJ3NheSBqc29uK2hhc2gnKTtcbiAgICAgICAgICAgICAgICAgIG1zZy5fLiRwdXQgPSB0O1xuICAgICAgICAgICAgICAgICAgbXNnWycjIyddID0g
aDtcbiAgICAgICAgICAgICAgICAgIG1lc2guc2F5KG1zZywgcGVlcik7XG4gICAgICAgICAgICAgICAgICBkZWxldGUgbXNnLl8uJHB1dDtcbiAgICAgICAg
ICAgICAgICB9LCBzb3J0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIHNvcnQoaywgdil7IHZhciB0bXA7XG4gICAgICAgICAgICAg
ICAgaWYoISh2IGluc3RhbmNlb2YgT2JqZWN0KSl7IHJldHVybiB2IH1cbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyh2KS5zb3J0KCkuZm9yRWFjaChz
b3J0YSwge3RvOiB0bXAgPSB7fSwgb246IHZ9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdG1wO1xuICAgICAgICAgICAgfSBmdW5jdGlvbiBzb3J0YShr
KXsgdGhpcy50b1trXSA9IHRoaXMub25ba10gfVxuXG4gICAgICAgICAgICB2YXIgc2F5ID0gbWVzaC5zYXkgPSBmdW5jdGlvbihtc2csIHBlZXIpeyB2YXIg
dG1wO1xuICAgICAgICAgICAgICAgIGlmKCh0bXAgPSB0aGlzKSAmJiAodG1wID0gdG1wLnRvKSAmJiB0bXAubmV4dCl7IHRtcC5uZXh0KG1zZykgfSAvLyBj
b21wYXRpYmxlIHdpdGggbWlkZGxld2FyZSBhZGFwdGVycy5cbiAgICAgICAgICAgICAgICBpZighbXNnKXsgcmV0dXJuIGZhbHNlIH1cbiAgICAgICAgICAg
ICAgICB2YXIgaWQsIGhhc2gsIHJhdywgYWNrID0gbXNnWydAJ107XG4gICAgLy9pZihvcHQuc3VwZXIgJiYgKCFhY2sgfHwgIW1zZy5wdXQpKXsgcmV0dXJu
IH0gLy8gVE9ETzogTUFOSEFUVEFOIFNUVUIgLy9PQlZJT1VTTFkgQlVHISBCdXQgc3F1ZWxjaCByZWxheS4gLy8gOiggZ2V0IG9ubHkgaXMgMTAwJSsgQ1BV
IHVzYWdlIDooXG4gICAgICAgICAgICAgICAgdmFyIG1ldGEgPSBtc2cuX3x8KG1zZy5fPWZ1bmN0aW9uKCl7fSk7XG4gICAgICAgICAgICAgICAgdmFyIERC
RyA9IG1zZy5EQkcsIFMgPSArbmV3IERhdGU7IG1ldGEueSA9IG1ldGEueSB8fCBTOyBpZighcGVlcil7IERCRyAmJiAoREJHLnkgPSBTKSB9XG4gICAgICAg
ICAgICAgICAgaWYoIShpZCA9IG1zZ1snIyddKSl7IGlkID0gbXNnWycjJ10gPSBTdHJpbmcucmFuZG9tKDkpIH1cbiAgICAgICAgICAgICAgICAhbG9vcCAm
JiBkdXBfdHJhY2soaWQpOy8vLml0ID0gaXQobXNnKTsgLy8gdHJhY2sgZm9yIDkgc2Vjb25kcywgZGVmYXVsdC4gRWFydGg8LT5NYXJzIHdvdWxkIG5lZWQg
bW9yZSEgLy8gYWx3YXlzIHRyYWNrLCBtYXliZSBtb3ZlIHRoaXMgdG8gdGhlICdhZnRlcicgbG9naWMgaWYgd2Ugc3BsaXQgZnVuY3Rpb24uXG4gICAgICAg
ICAgICAgICAgLy9pZihtc2cucHV0ICYmIChtc2cuZXJyIHx8IChkdXAuc1tpZF18fCcnKS5lcnIpKXsgcmV0dXJuIGZhbHNlIH0gLy8gVE9ETzogaW4gdGhl
b3J5IHdlIHNob3VsZCBub3QgYmUgYWJsZSB0byBzdHVuIGEgbWVzc2FnZSwgYnV0IGZvciBub3cgZ29pbmcgdG8gY2hlY2sgaWYgaXQgY2FuIGhlbHAgbmV0
d29yayBwZXJmb3JtYW5jZSBwcmV2ZW50aW5nIGludmFsaWQgZGF0YSB0byByZWxheS5cbiAgICAgICAgICAgICAgICBpZighKGhhc2ggPSBtc2dbJyMjJ10p
ICYmIHUgIT09IG1zZy5wdXQgJiYgIW1ldGEudmlhICYmIGFjayl7IG1lc2guaGFzaChtc2csIHBlZXIpOyByZXR1cm4gfSAvLyBUT0RPOiBTaG91bGQgYnJv
YWRjYXN0cyBiZSBoYXNoZWQ/XG4gICAgICAgICAgICAgICAgaWYoIXBlZXIgJiYgYWNrKXsgcGVlciA9ICgodG1wID0gZHVwLnNbYWNrXSkgJiYgKHRtcC52
aWEgfHwgKCh0bXAgPSB0bXAuaXQpICYmICh0bXAgPSB0bXAuXykgJiYgdG1wLnZpYSkpKSB8fCAoKHRtcCA9IG1lc2gubGFzdCkgJiYgYWNrID09PSB0bXBb
JyMnXSAmJiBtZXNoLmxlYXApIH0gLy8gd2FybmluZyEgbWVzaC5sZWFwIGNvdWxkIGJlIGJ1Z2d5ISBtZXNoIGxhc3QgY2hlY2sgcmVkdWNlcyB0aGlzLiAv
LyBUT0RPOiBDTEVBTiBVUCBUSElTIExJTkUgTk9XPyBgLml0YCBzaG91bGQgYmUgcmVsaWFibGUuXG4gICAgICAgICAgICAgICAgaWYoIXBlZXIgJiYgYWNr
KXsgLy8gc3RpbGwgbm8gcGVlciwgdGhlbiBhY2sgZGFpc3kgY2hhaW4gJ3R1bm5lbCcgZ290IGxvc3QuXG4gICAgICAgICAgICAgICAgICAgIGlmKGR1cC5z
W2Fja10peyByZXR1cm4gfSAvLyBpbiBkdXBzIGJ1dCBubyBwZWVyIGhpbnRzIHRoYXQgdGhpcyB3YXMgYWNrIHRvIG91cnNlbGYsIGlnbm9yZS5cbiAgICAg
ICAgICAgICAgICAgICAgY29uc29sZS5TVEFUICYmIGNvbnNvbGUuU1RBVCgrbmV3IERhdGUsICsrU01JQSwgJ3RvdGFsIG5vIHBlZXIgdG8gYWNrIHRvJyk7
IC8vIFRPRE86IERlbGV0ZSB0aGlzIG5vdy4gRHJvcHBpbmcgbG9zdCBBQ0tzIGlzIHByb3RvY29sIGZpbmUgbm93LlxuICAgICAgICAgICAgICAgICAgICBy
ZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSAvLyBUT0RPOiBUZW1wb3Jhcnk/IElmIGFjayB2aWEgdHJhY2UgaGFzIGJlZW4gbG9zdCwgYWNrcyB3
aWxsIGdvIHRvIGFsbCBwZWVycywgd2hpY2ggdHJhc2hlcyBicm93c2VyIGJhbmR3aWR0aC4gTm90IHJlbGF5aW5nIHRoZSBhY2sgd2lsbCBmb3JjZSBzZW5k
ZXIgdG8gYXNrIGZvciBhY2sgYWdhaW4uIE5vdGUsIHRoaXMgaXMgdGVjaG5pY2FsbHkgd3JvbmcgZm9yIG1lc2ggYmVoYXZpb3IuXG4gICAgICAgICAgICAg
ICAgaWYoYWNrICYmICFtc2cucHV0ICYmICFoYXNoICYmICgoZHVwLnNbYWNrXXx8JycpLml0fHwnJylbJyMjJ10peyByZXR1cm4gZmFsc2UgfSAvLyBJZiB3
ZSdyZSBzYXlpbmcgJ25vdCBmb3VuZCcgYnV0IGEgcmVsYXkgaGFkIGRhdGEsIGRvIG5vdCBib3RoZXIgc2VuZGluZyBvdXIgbm90IGZvdW5kLiAvLyBJcyB0
aGlzIGNvcnJlY3QsIHJldHVybiBmYWxzZT8gLy8gTk9URTogQUREIFBBTklDIFRFU1QgRk9SIFRISVMhXG4gICAgICAgICAgICAgICAgaWYoIXBlZXIgJiYg
bWVzaC53YXkpeyByZXR1cm4gbWVzaC53YXkobXNnKSB9XG4gICAgICAgICAgICAgICAgREJHICYmIChEQkcueWggPSArbmV3IERhdGUpO1xuICAgICAgICAg
ICAgICAgIGlmKCEocmF3ID0gbWV0YS5yYXcpKXsgbWVzaC5yYXcobXNnLCBwZWVyKTsgcmV0dXJuIH1cbiAgICAgICAgICAgICAgICBEQkcgJiYgKERCRy55
ciA9ICtuZXcgRGF0ZSk7XG4gICAgICAgICAgICAgICAgaWYoIXBlZXIgfHwgIXBlZXIuaWQpe1xuICAgICAgICAgICAgICAgICAgICBpZighT2JqZWN0LnBs
YWluKHBlZXIgfHwgb3B0LnBlZXJzKSl7IHJldHVybiBmYWxzZSB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBTID0gK25ldyBEYXRlO1xuICAgICAgICAg
ICAgICAgICAgICB2YXIgUCA9IG9wdC5wdWZmLCBwcyA9IG9wdC5wZWVycywgcGwgPSBPYmplY3Qua2V5cyhwZWVyIHx8IG9wdC5wZWVycyB8fCB7fSk7IC8v
IFRPRE86IC5rZXlzKCBpcyBzbG93XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuU1RBVCAmJiBjb25zb2xlLlNUQVQoUywgK25ldyBEYXRlIC0gUywg
J3BlZXIga2V5cycpO1xuICAgICAgICAgICAgICAgICAgICA7KGZ1bmN0aW9uIGdvKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgUyA9ICtuZXcg
RGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vVHlwZS5vYmoubWFwKHBlZXIgfHwgb3B0LnBlZXJzLCBlYWNoKTsgLy8gaW4gY2FzZSBwZWVyIGlz
IGEgcGVlciBsaXN0LlxuICAgICAgICAgICAgICAgICAgICAgICAgbG9vcCA9IDE7IHZhciB3ciA9IG1ldGEucmF3OyBtZXRhLnJhdyA9IHJhdzsgLy8gcXVp
Y2sgcGVyZiBoYWNrXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaSA9IDAsIHA7IHdoaWxlKGkgPCA5ICYmIChwID0gKHBsfHwnJylbaSsrXSkpe1xu
ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCEocCA9IHBzW3BdIHx8IChwZWVyfHwnJylbcF0pKXsgY29udGludWUgfVxuICAgICAgICAgICAgICAg
ICAgICAgICAgICAgIG1lc2guc2F5KG1zZywgcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhLnJh
dyA9IHdyOyBsb29wID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsID0gcGwuc2xpY2UoaSk7IC8vIHNsaWNpbmcgYWZ0ZXIgaXMgZmFzdGVyIHRo
YW4gc2hpZnRpbmcgZHVyaW5nLlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5TVEFUICYmIGNvbnNvbGUuU1RBVChTLCArbmV3IERhdGUgLSBT
LCAnc2F5IGxvb3AnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFwbC5sZW5ndGgpeyByZXR1cm4gfVxuICAgICAgICAgICAgICAgICAgICAgICAg
cHVmZihnbywgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY2sgJiYgZHVwX3RyYWNrKGFjayk7IC8vIGtlZXAgZm9yIGxhdGVyXG4gICAgICAgICAg
ICAgICAgICAgIH0oKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gVE9ETzog
UEVSRjogY29uc2lkZXIgc3BsaXR0aW5nIGZ1bmN0aW9uIGhlcmUsIHNvIHNheSBsb29wcyBkbyBsZXNzIHdvcmsuXG4gICAgICAgICAgICAgICAgaWYoIXBl
ZXIud2lyZSAmJiBtZXNoLndpcmUpeyBtZXNoLndpcmUocGVlcikgfVxuICAgICAgICAgICAgICAgIGlmKGlkID09PSBwZWVyLmxhc3QpeyByZXR1cm4gfSBw
ZWVyLmxhc3QgPSBpZDsgIC8vIHdhcyBpdCBqdXN0IHNlbnQ/XG4gICAgICAgICAgICAgICAgaWYocGVlciA9PT0gbWV0YS52aWEpeyByZXR1cm4gZmFsc2Ug
fSAvLyBkb24ndCBzZW5kIGJhY2sgdG8gc2VsZi5cbiAgICAgICAgICAgICAgICBpZigodG1wID0gbWV0YS55bykgJiYgKHRtcFtwZWVyLnVybF0gfHwgdG1w
W3BlZXIucGlkXSB8fCB0bXBbcGVlci5pZF0pIC8qJiYgIW8qLyl7IHJldHVybiBmYWxzZSB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5TVEFUICYmIGNv
bnNvbGUuU1RBVChTLCAoKERCR3x8bWV0YSkueXAgPSArbmV3IERhdGUpIC0gKG1ldGEueSB8fCBTKSwgJ3NheSBwcmVwJyk7XG4gICAgICAgICAgICAgICAg
IWxvb3AgJiYgYWNrICYmIGR1cF90cmFjayhhY2spOyAvLyBzdHJlYW1pbmcgbG9uZyByZXNwb25zZXMgbmVlZHMgdG8ga2VlcCBhbGl2ZSB0aGUgYWNrLlxu
ICAgICAgICAgICAgICAgIGlmKHBlZXIuYmF0Y2gpe1xuICAgICAgICAgICAgICAgICAgICBwZWVyLnRhaWwgPSAodG1wID0gcGVlci50YWlsIHx8IDApICsg
cmF3Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgaWYocGVlci50YWlsIDw9IG9wdC5wYWNrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlZXIu
YmF0Y2ggKz0gKHRtcD8nLCc6JycpK3JhdztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAg
ICAgICAgICAgICAgICBmbHVzaChwZWVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGVlci5iYXRjaCA9ICdbJzsgLy8gUHJldmVu
dHMgZG91YmxlIEpTT04hXG4gICAgICAgICAgICAgICAgdmFyIFNUID0gK25ldyBEYXRlO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24o
KXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5TVEFUICYmIGNvbnNvbGUuU1RBVChTVCwgK25ldyBEYXRlIC0gU1QsICcwbXMgVE8nKTtcbiAgICAg
ICAgICAgICAgICAgICAgZmx1c2gocGVlcik7XG4gICAgICAgICAgICAgICAgfSwgb3B0LmdhcCk7IC8vIFRPRE86IHF1ZXVpbmcvYmF0Y2hpbmcgbWlnaHQg
YmUgYmFkIGZvciBsb3ctbGF0ZW5jeSB2aWRlbyBnYW1lIHBlcmZvcm1hbmNlISBBbGxvdyBvcHQgb3V0P1xuICAgICAgICAgICAgICAgIHNlbmQocmF3LCBw
ZWVyKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLlNUQVQgJiYgKGFjayA9PT0gcGVlci5TSSkgJiYgY29uc29sZS5TVEFUKFMsICtuZXcgRGF0ZSAtIHBl
ZXIuU0gsICdzYXkgYWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZXNoLnNheS5jID0gbWVzaC5zYXkuZCA9IDA7XG4gICAgICAgICAgICAv
LyBUT0RPOiB0aGlzIGNhdXNlZCBhIG91dC1vZi1tZW1vcnkgY3Jhc2ghXG4gICAgICAgICAgICBtZXNoLnJhdyA9IGZ1bmN0aW9uKG1zZywgcGVlcil7IC8v
IFRPRE86IENsZWFuIHRoaXMgdXAgLyBkZWxldGUgaXQgLyBtb3ZlIGxvZ2ljIG91dCFcbiAgICAgICAgICAgICAgICBpZighbXNnKXsgcmV0dXJuICcnIH1c
biAgICAgICAgICAgICAgICB2YXIgbWV0YSA9IChtc2cuXykgfHwge30sIHB1dCwgdG1wO1xuICAgICAgICAgICAgICAgIGlmKHRtcCA9IG1ldGEucmF3KXsg
cmV0dXJuIHRtcCB9XG4gICAgICAgICAgICAgICAgaWYoJ3N0cmluZycgPT0gdHlwZW9mIG1zZyl7IHJldHVybiBtc2cgfVxuICAgICAgICAgICAgICAgIHZh
ciBoYXNoID0gbXNnWycjIyddLCBhY2sgPSBtc2dbJ0AnXTtcbiAgICAgICAgICAgICAgICBpZihoYXNoICYmIGFjayl7XG4gICAgICAgICAgICAgICAgICAg
IGlmKCFtZXRhLnZpYSAmJiBkdXBfY2hlY2soYWNrK2hhc2gpKXsgcmV0dXJuIGZhbHNlIH0gLy8gZm9yIG91ciBvd24gb3V0IG1lc3NhZ2VzLCBtZW1vcnkg
JiBzdG9yYWdlIG1heSBhY2sgdGhlIHNhbWUgdGhpbmcsIHNvIGRlZHVwIHRoYXQuIFRobyBpZiB2aWEgYW5vdGhlciBwZWVyLCB3ZSBhbHJlYWR5IHRyYWNr
ZWQgaXQgdXBvbiBoZWFyaW5nLCBzbyB0aGlzIHdpbGwgYWx3YXlzIHRyaWdnZXIgZmFsc2UgcG9zaXRpdmVzLCBzbyBkb24ndCBkbyB0aGF0IVxuICAgICAg
ICAgICAgICAgICAgICBpZih0bXAgPSAoZHVwLnNbYWNrXXx8JycpLml0KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGhhc2ggPT09IHRtcFsnIyMn
XSl7IHJldHVybiBmYWxzZSB9IC8vIGlmIGFzayBoYXMgYSBtYXRjaGluZyBoYXNoLCBhY2tpbmcgaXMgb3B0aW9uYWwuXG4gICAgICAgICAgICAgICAgICAg
ICAgICBpZighdG1wWycjIyddKXsgdG1wWycjIyddID0gaGFzaCB9IC8vIGlmIG5vbmUsIGFkZCBvdXIgaGFzaCB0byBhc2sgc28gYW55b25lIHdlIHJlbGF5
IHRvIGNhbiBkZWR1cC4gLy8gTk9URTogTWF5IG9ubHkgY2hlY2sgYWdhaW5zdCAxc3QgYWNrIGNodW5rLCAybmQrIHdvbid0IGtub3cgYW5kIHN0aWxsIHN0
cmVhbSBiYWNrIHRvIHJlbGF5aW5nIHBlZXJzIHdoaWNoIG1heSB0aGVuIGRlZHVwLiBBbnkgd2F5IHRvIGZpeCB0aGlzIHdhc3RlZCBiYW5kd2lkdGg/IEkg
Z3Vlc3MgZm9yY2UgcmF0ZSBsaW1pdGluZyBicmVha2luZyBjaGFuZ2UsIHRoYXQgYXNraW5nIHBlZXIgaGFzIHRvIGFzayBmb3IgbmV4dCBsZXhpY2FsIGNo
dW5rLlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKCFtc2cuZGFtICYmICFtc2dbJ0AnXSl7
XG4gICAgICAgICAgICAgICAgICAgIHZhciBpID0gMCwgdG8gPSBbXTsgdG1wID0gb3B0LnBlZXJzO1xuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGsg
aW4gdG1wKXsgdmFyIHAgPSB0bXBba107IC8vIFRPRE86IE1ha2UgaXQgdXAgcGVlcnMgaW5zdGVhZCFcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvLnB1
c2gocC51cmwgfHwgcC5waWQgfHwgcC5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZigrK2kgPiA2KXsgYnJlYWsgfVxuICAgICAgICAgICAgICAg
ICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmKGkgPiAxKXsgbXNnWyc+PCddID0gdG8uam9pbigpIH0gLy8gVE9ETzogQlVHISBUaGlzIGdldHMgc2V0
IHJlZ2FyZGxlc3Mgb2YgcGVlcnMgc2VudCB0byEgRGV0ZWN0P1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZihtc2cucHV0ICYmICh0
bXAgPSBtc2cub2spKXsgbXNnLm9rID0geydAJzoodG1wWydAJ118fDEpLTEsICcvJzogKHRtcFsnLyddPT1tc2cuXy5uZWFyKT8gbWVzaC5uZWFyIDogdG1w
WycvJ119OyB9XG4gICAgICAgICAgICAgICAgaWYocHV0ID0gbWV0YS4kcHV0KXtcbiAgICAgICAgICAgICAgICAgICAgdG1wID0ge307IE9iamVjdC5rZXlz
KG1zZykuZm9yRWFjaChmdW5jdGlvbihrKXsgdG1wW2tdID0gbXNnW2tdIH0pO1xuICAgICAgICAgICAgICAgICAgICB0bXAucHV0ID0gJzpdKShbOic7XG4g
ICAgICAgICAgICAgICAgICAgIGpzb24odG1wLCBmdW5jdGlvbihlcnIsIHJhdyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihlcnIpeyByZXR1cm4g
fSAvLyBUT0RPOiBIYW5kbGUhIVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFMgPSArbmV3IERhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0
bXAgPSByYXcuaW5kZXhPZignXCJwdXRcIjpcIjpdKShbOlwiJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXModSwgcmF3ID0gcmF3LnNsaWNlKDAs
IHRtcCs2KSArIHB1dCArIHJhdy5zbGljZSh0bXAgKyAxNCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5TVEFUICYmIGNvbnNvbGUuU1RB
VChTLCArbmV3IERhdGUgLSBTLCAnc2F5IHNsaWNlJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4g
ICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGpzb24obXNnLCByZXMpO1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHJlcyhlcnIsIHJhdyl7
XG4gICAgICAgICAgICAgICAgICAgIGlmKGVycil7IHJldHVybiB9IC8vIFRPRE86IEhhbmRsZSEhXG4gICAgICAgICAgICAgICAgICAgIG1ldGEucmF3ID0g
cmF3OyAvL2lmKG1ldGEgJiYgKHJhd3x8JycpLmxlbmd0aCA8ICg5OTkgKiA5OSkpeyBtZXRhLnJhdyA9IHJhdyB9IC8vIEhOUEVSRjogSWYgc3RyaW5nIHRv
byBiaWcsIGRvbid0IGtlZXAgaW4gbWVtb3J5LlxuICAgICAgICAgICAgICAgICAgICBtZXNoLnNheShtc2csIHBlZXIpO1xuICAgICAgICAgICAgICAgIH1c
biAgICAgICAgICAgIH1cbiAgICAgICAgfSgpKTtcblxuICAgICAgICBmdW5jdGlvbiBmbHVzaChwZWVyKXtcbiAgICAgICAgICAgIHZhciB0bXAgPSBwZWVy
LmJhdGNoLCB0ID0gJ3N0cmluZycgPT0gdHlwZW9mIHRtcCwgbDtcbiAgICAgICAgICAgIGlmKHQpeyB0bXAgKz0gJ10nIH0vLyBUT0RPOiBQcmV2ZW50IGRv
dWJsZSBKU09OIVxuICAgICAgICAgICAgcGVlci5iYXRjaCA9IHBlZXIudGFpbCA9IG51bGw7XG4gICAgICAgICAgICBpZighdG1wKXsgcmV0dXJuIH1cbiAg
ICAgICAgICAgIGlmKHQ/IDMgPiB0bXAubGVuZ3RoIDogIXRtcC5sZW5ndGgpeyByZXR1cm4gfSAvLyBUT0RPOiBeXG4gICAgICAgICAgICBpZighdCl7dHJ5
e3RtcCA9ICgxID09PSB0bXAubGVuZ3RoPyB0bXBbMF0gOiBKU09OLnN0cmluZ2lmeSh0bXApKTtcbiAgICAgICAgICAgIH1jYXRjaChlKXtyZXR1cm4gb3B0
LmxvZygnREFNIEpTT04gc3RyaW5naWZ5IGVycm9yJywgZSl9fVxuICAgICAgICAgICAgaWYoIXRtcCl7IHJldHVybiB9XG4gICAgICAgICAgICBzZW5kKHRt
cCwgcGVlcik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZm9yIG5vdyAtIGZpbmQgYmV0dGVyIHBsYWNlIGxhdGVyLlxuICAgICAgICBmdW5jdGlvbiBzZW5k
KHJhdywgcGVlcil7IHRyeXtcbiAgICAgICAgICAgIHZhciB3aXJlID0gcGVlci53aXJlO1xuICAgICAgICAgICAgaWYocGVlci5zYXkpe1xuICAgICAgICAg
ICAgICAgIHBlZXIuc2F5KHJhdyk7XG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIGlmKHdpcmUuc2VuZCl7XG4gICAgICAgICAgICAgICAgd2ly
ZS5zZW5kKHJhdyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZXNoLnNheS5kICs9IHJhdy5sZW5ndGh8fDA7ICsrbWVzaC5zYXkuYzsgLy8gU1RB
VFMhXG4gICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgIChwZWVyLnF1ZXVlID0gcGVlci5xdWV1ZSB8fCBbXSkucHVzaChyYXcpO1xuICAgICAgICB9
fVxuXG4gICAgICAgIG1lc2gubmVhciA9IDA7XG4gICAgICAgIG1lc2guaGkgPSBmdW5jdGlvbihwZWVyKXtcbiAgICAgICAgICAgIHZhciB3aXJlID0gcGVl
ci53aXJlLCB0bXA7XG4gICAgICAgICAgICBpZighd2lyZSl7IG1lc2gud2lyZSgocGVlci5sZW5ndGggJiYge3VybDogcGVlciwgaWQ6IHBlZXJ9KSB8fCBw
ZWVyKTsgcmV0dXJuIH1cbiAgICAgICAgICAgIGlmKHBlZXIuaWQpe1xuICAgICAgICAgICAgICAgIG9wdC5wZWVyc1twZWVyLnVybCB8fCBwZWVyLmlkXSA9
IHBlZXI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRtcCA9IHBlZXIuaWQgPSBwZWVyLmlkIHx8IHBlZXIudXJsIHx8IFN0cmlu
Zy5yYW5kb20oOSk7XG4gICAgICAgICAgICAgICAgbWVzaC5zYXkoe2RhbTogJz8nLCBwaWQ6IHJvb3Qub3B0LnBpZH0sIG9wdC5wZWVyc1t0bXBdID0gcGVl
cik7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGR1cC5zW3BlZXIubGFzdF07IC8vIElNUE9SVEFOVDogc2VlIGh0dHBzOi8vZ3VuLmVjby9kb2NzL0RBTSNz
ZWxmXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZighcGVlci5tZXQpe1xuICAgICAgICAgICAgICAgIG1lc2gubmVhcisrO1xuICAgICAgICAgICAg
ICAgIHBlZXIubWV0ID0gKyhuZXcgRGF0ZSk7XG4gICAgICAgICAgICAgICAgcm9vdC5vbignaGknLCBwZWVyKVxuICAgICAgICAgICAgfVxuICAgICAgICAg
ICAgLy8gQHJvZ293c2tpIEkgbmVlZCB0aGlzIGhlcmUgYnkgZGVmYXVsdCBmb3Igbm93IHRvIGZpeCBnbzFkZmlzaCdzIGJ1Z1xuICAgICAgICAgICAgdG1w
ID0gcGVlci5xdWV1ZTsgcGVlci5xdWV1ZSA9IFtdO1xuICAgICAgICAgICAgc2V0VGltZW91dC5lYWNoKHRtcHx8W10sZnVuY3Rpb24obXNnKXtcbiAgICAg
ICAgICAgICAgICBzZW5kKG1zZywgcGVlcik7XG4gICAgICAgICAgICB9LDAsOSk7XG4gICAgICAgICAgICAvL1R5cGUub2JqLm5hdGl2ZSAmJiBUeXBlLm9i
ai5uYXRpdmUoKTsgLy8gZGlydHkgcGxhY2UgdG8gY2hlY2sgaWYgb3RoZXIgSlMgcG9sbHV0ZWQuXG4gICAgICAgIH1cbiAgICAgICAgbWVzaC5ieWUgPSBm
dW5jdGlvbihwZWVyKXtcbiAgICAgICAgICAgIHBlZXIubWV0ICYmIC0tbWVzaC5uZWFyO1xuICAgICAgICAgICAgZGVsZXRlIHBlZXIubWV0O1xuICAgICAg
ICAgICAgcm9vdC5vbignYnllJywgcGVlcik7XG4gICAgICAgICAgICB2YXIgdG1wID0gKyhuZXcgRGF0ZSk7IHRtcCA9ICh0bXAgLSAocGVlci5tZXR8fHRt
cCkpO1xuICAgICAgICAgICAgbWVzaC5ieWUudGltZSA9ICgobWVzaC5ieWUudGltZSB8fCB0bXApICsgdG1wKSAvIDI7XG4gICAgICAgIH1cbiAgICAgICAg
bWVzaC5oZWFyWychJ10gPSBmdW5jdGlvbihtc2csIHBlZXIpeyBvcHQubG9nKCdFcnJvcjonLCBtc2cuZXJyKSB9XG4gICAgICAgIG1lc2guaGVhclsnPydd
ID0gZnVuY3Rpb24obXNnLCBwZWVyKXtcbiAgICAgICAgICAgIGlmKG1zZy5waWQpe1xuICAgICAgICAgICAgICAgIGlmKCFwZWVyLnBpZCl7IHBlZXIucGlk
ID0gbXNnLnBpZCB9XG4gICAgICAgICAgICAgICAgaWYobXNnWydAJ10peyByZXR1cm4gfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWVzaC5zYXko
e2RhbTogJz8nLCBwaWQ6IG9wdC5waWQsICdAJzogbXNnWycjJ119LCBwZWVyKTtcbiAgICAgICAgICAgIGRlbGV0ZSBkdXAuc1twZWVyLmxhc3RdOyAvLyBJ
TVBPUlRBTlQ6IHNlZSBodHRwczovL2d1bi5lY28vZG9jcy9EQU0jc2VsZlxuICAgICAgICB9XG4gICAgICAgIG1lc2guaGVhclsnbW9iJ10gPSBmdW5jdGlv
bihtc2csIHBlZXIpeyAvLyBOT1RFOiBBWEUgd2lsbCBvdmVybG9hZCB0aGlzIHdpdGggYmV0dGVyIGxvZ2ljLlxuICAgICAgICAgICAgaWYoIW1zZy5wZWVy
cyl7IHJldHVybiB9XG4gICAgICAgICAgICB2YXIgcGVlcnMgPSBPYmplY3Qua2V5cyhtc2cucGVlcnMpLCBvbmUgPSBwZWVyc1soTWF0aC5yYW5kb20oKSpw
ZWVycy5sZW5ndGgpID4+IDBdO1xuICAgICAgICAgICAgaWYoIW9uZSl7IHJldHVybiB9XG4gICAgICAgICAgICBtZXNoLmJ5ZShwZWVyKTtcbiAgICAgICAg
ICAgIG1lc2guaGkob25lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJvb3Qub24oJ2NyZWF0ZScsIGZ1bmN0aW9uKHJvb3Qpe1xuICAgICAgICAgICAgcm9v
dC5vcHQucGlkID0gcm9vdC5vcHQucGlkIHx8IFN0cmluZy5yYW5kb20oOSk7XG4gICAgICAgICAgICB0aGlzLnRvLm5leHQocm9vdCk7XG4gICAgICAgICAg
ICByb290Lm9uKCdvdXQnLCBtZXNoLnNheSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJvb3Qub24oJ2J5ZScsIGZ1bmN0aW9uKHBlZXIsIHRtcCl7XG4g
ICAgICAgICAgICBwZWVyID0gb3B0LnBlZXJzW3BlZXIuaWQgfHwgcGVlcl0gfHwgcGVlcjtcbiAgICAgICAgICAgIHRoaXMudG8ubmV4dChwZWVyKTtcbiAg
ICAgICAgICAgIHBlZXIuYnllPyBwZWVyLmJ5ZSgpIDogKHRtcCA9IHBlZXIud2lyZSkgJiYgdG1wLmNsb3NlICYmIHRtcC5jbG9zZSgpO1xuICAgICAgICAg
ICAgZGVsZXRlIG9wdC5wZWVyc1twZWVyLmlkXTtcbiAgICAgICAgICAgIHBlZXIud2lyZSA9IG51bGw7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBn
ZXRzID0ge307XG4gICAgICAgIHJvb3Qub24oJ2J5ZScsIGZ1bmN0aW9uKHBlZXIsIHRtcCl7IHRoaXMudG8ubmV4dChwZWVyKTtcbiAgICAgICAgICAgIGlm
KHRtcCA9IGNvbnNvbGUuU1RBVCl7IHRtcC5wZWVycyA9IG1lc2gubmVhcjsgfVxuICAgICAgICAgICAgaWYoISh0bXAgPSBwZWVyLnVybCkpeyByZXR1cm4g
fSBnZXRzW3RtcF0gPSB0cnVlO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpeyBkZWxldGUgZ2V0c1t0bXBdIH0sb3B0LmxhY2sgfHwgOTAw
MCk7XG4gICAgICAgIH0pO1xuICAgICAgICByb290Lm9uKCdoaScsIGZ1bmN0aW9uKHBlZXIsIHRtcCl7IHRoaXMudG8ubmV4dChwZWVyKTtcbiAgICAgICAg
ICAgIGlmKHRtcCA9IGNvbnNvbGUuU1RBVCl7IHRtcC5wZWVycyA9IG1lc2gubmVhciB9XG4gICAgICAgICAgICBpZihvcHQuc3VwZXIpeyByZXR1cm4gfSAv
LyB0ZW1wb3JhcnkgKD8pIHVudGlsIHdlIGhhdmUgYmV0dGVyIGZpeC9zb2x1dGlvbj9cbiAgICAgICAgICAgIHZhciBzb3VscyA9IE9iamVjdC5rZXlzKHJv
b3QubmV4dHx8JycpOyAvLyBUT0RPOiAua2V5cyggaXMgc2xvd1xuICAgICAgICAgICAgaWYoc291bHMubGVuZ3RoID4gOTk5OSAmJiAhY29uc29sZS5TVUJT
KXsgY29uc29sZS5sb2coY29uc29sZS5TVUJTID0gXCJXYXJuaW5nOiBZb3UgaGF2ZSBtb3JlIHRoYW4gMTBLIGxpdmUgR0VUcywgd2hpY2ggbWlnaHQgdXNl
IG1vcmUgYmFuZHdpZHRoIHRoYW4geW91ciBzY3JlZW4gY2FuIHNob3cgLSBjb25zaWRlciBgLm9mZigpYC5cIikgfVxuICAgICAgICAgICAgc2V0VGltZW91
dC5lYWNoKHNvdWxzLCBmdW5jdGlvbihzb3VsKXsgdmFyIG5vZGUgPSByb290Lm5leHRbc291bF07XG4gICAgICAgICAgICAgICAgaWYob3B0LnN1cGVyIHx8
IChub2RlLmFza3x8JycpWycnXSl7IG1lc2guc2F5KHtnZXQ6IHsnIyc6IHNvdWx9fSwgcGVlcik7IHJldHVybiB9XG4gICAgICAgICAgICAgICAgc2V0VGlt
ZW91dC5lYWNoKE9iamVjdC5rZXlzKG5vZGUuYXNrfHwnJyksIGZ1bmN0aW9uKGtleSl7IGlmKCFrZXkpeyByZXR1cm4gfVxuICAgICAgICAgICAgICAgICAg
ICAvLyBpcyB0aGUgbGFjayBvZiAjIyBhICFvbmlvbiBoaW50P1xuICAgICAgICAgICAgICAgICAgICBtZXNoLnNheSh7JyMjJzogU3RyaW5nLmhhc2goKHJv
b3QuZ3JhcGhbc291bF18fCcnKVtrZXldKSwgZ2V0OiB7JyMnOiBzb3VsLCAnLic6IGtleX19LCBwZWVyKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9E
TzogU3dpdGNoIHRoaXMgc28gQm9vayBjb3VsZCByb3V0ZT9cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4g
ICAgICAgIHJldHVybiBtZXNoO1xuICAgIH1cbiAgICB2YXIgZW1wdHkgPSB7fSwgb2sgPSB0cnVlLCB1O1xuXG4gICAgdHJ5eyBfX2RlZmF1bHRFeHBvcnQg
PSBNZXNoIH1jYXRjaChlKXt9XG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgX19kZWZhdWx0RXhwb3J0OyIsInNyYy9ndW4vd2Vic29ja2V0LmpzIjoiaW1wb3J0
IF9fcm9vdCBmcm9tICcuL3Jvb3QuanMnO1xuaW1wb3J0IF9fbWVzaCBmcm9tICcuL21lc2guanMnO1xuKGZ1bmN0aW9uKCl7XG5cbnZhciBHdW4gPSBfX3Jv
b3Q7XG5HdW4uTWVzaCA9IF9fbWVzaDtcblxuLy8gVE9ETzogcmVzeW5jIHVwb24gcmVjb25uZWN0IG9ubGluZS9vZmZsaW5lXG4vL3dpbmRvdy5vbm9ubGlu
ZSA9IHdpbmRvdy5vbm9mZmxpbmUgPSBmdW5jdGlvbigpeyBjb25zb2xlLmxvZygnb25saW5lPycsIG5hdmlnYXRvci5vbkxpbmUpIH1cblxuR3VuLm9uKCdv
cHQnLCBmdW5jdGlvbihyb290KXtcblx0dGhpcy50by5uZXh0KHJvb3QpO1xuXHRpZihyb290Lm9uY2UpeyByZXR1cm4gfVxuXHR2YXIgb3B0ID0gcm9vdC5v
cHQ7XG5cdGlmKGZhbHNlID09PSBvcHQuV2ViU29ja2V0KXsgcmV0dXJuIH1cblxuXHR2YXIgZW52ID0gR3VuLndpbmRvdyB8fCB7fTtcblx0dmFyIHdlYnNv
Y2tldCA9IG9wdC5XZWJTb2NrZXQgfHwgZW52LldlYlNvY2tldCB8fCBlbnYud2Via2l0V2ViU29ja2V0IHx8IGVudi5tb3pXZWJTb2NrZXQ7XG5cdGlmKCF3
ZWJzb2NrZXQpeyByZXR1cm4gfVxuXHRvcHQuV2ViU29ja2V0ID0gd2Vic29ja2V0O1xuXG5cdHZhciBtZXNoID0gb3B0Lm1lc2ggPSBvcHQubWVzaCB8fCBH
dW4uTWVzaChyb290KTtcblxuXHR2YXIgd2lyZWQgPSBtZXNoLndpcmUgfHwgb3B0LndpcmU7XG5cdG1lc2gud2lyZSA9IG9wdC53aXJlID0gb3Blbjtcblx0
ZnVuY3Rpb24gb3BlbihwZWVyKXsgdHJ5e1xuXHRcdGlmKCFwZWVyIHx8ICFwZWVyLnVybCl7IHJldHVybiB3aXJlZCAmJiB3aXJlZChwZWVyKSB9XG5cdFx0
dmFyIHVybCA9IHBlZXIudXJsLnJlcGxhY2UoL15odHRwLywgJ3dzJyk7XG5cdFx0dmFyIHdpcmUgPSBwZWVyLndpcmUgPSBuZXcgb3B0LldlYlNvY2tldCh1
cmwpO1xuXHRcdHdpcmUub25jbG9zZSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZWNvbm5lY3QocGVlcik7XG5cdFx0XHRvcHQubWVzaC5ieWUocGVlcik7XG5c
dFx0fTtcblx0XHR3aXJlLm9uZXJyb3IgPSBmdW5jdGlvbihlcnIpe1xuXHRcdFx0cmVjb25uZWN0KHBlZXIpO1xuXHRcdH07XG5cdFx0d2lyZS5vbm9wZW4g
PSBmdW5jdGlvbigpe1xuXHRcdFx0b3B0Lm1lc2guaGkocGVlcik7XG5cdFx0fVxuXHRcdHdpcmUub25tZXNzYWdlID0gZnVuY3Rpb24obXNnKXtcblx0XHRc
dGlmKCFtc2cpeyByZXR1cm4gfVxuXHRcdFx0b3B0Lm1lc2guaGVhcihtc2cuZGF0YSB8fCBtc2csIHBlZXIpO1xuXHRcdH07XG5cdFx0cmV0dXJuIHdpcmU7
XG5cdH1jYXRjaChlKXsgb3B0Lm1lc2guYnllKHBlZXIpIH19XG5cblx0c2V0VGltZW91dChmdW5jdGlvbigpeyAhb3B0LnN1cGVyICYmIHJvb3Qub24oJ291
dCcsIHtkYW06J2hpJ30pIH0sMSk7IC8vIGl0IGNhbiB0YWtlIGEgd2hpbGUgdG8gb3BlbiBhIHNvY2tldCwgc28gbWF5YmUgbm8gbG9uZ2VyIGxhenkgbG9h
ZCBmb3IgcGVyZiByZWFzb25zP1xuXG5cdHZhciB3YWl0ID0gMiAqIDk5OTtcblx0ZnVuY3Rpb24gcmVjb25uZWN0KHBlZXIpe1xuXHRcdGNsZWFyVGltZW91
dChwZWVyLmRlZmVyKTtcblx0XHRpZighb3B0LnBlZXJzW3BlZXIudXJsXSl7IHJldHVybiB9XG5cdFx0aWYoZG9jICYmIHBlZXIucmV0cnkgPD0gMCl7IHJl
dHVybiB9XG5cdFx0cGVlci5yZXRyeSA9IChwZWVyLnJldHJ5IHx8IG9wdC5yZXRyeSsxIHx8IDYwKSAtICgoLXBlZXIudHJpZWQgKyAocGVlci50cmllZCA9
ICtuZXcgRGF0ZSkgPCB3YWl0KjQpPzE6MCk7XG5cdFx0cGVlci5kZWZlciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gdG8oKXtcblx0XHRcdGlmKGRvYyAmJiBk
b2MuaGlkZGVuKXsgcmV0dXJuIHNldFRpbWVvdXQodG8sd2FpdCkgfVxuXHRcdFx0b3BlbihwZWVyKTtcblx0XHR9LCB3YWl0KTtcblx0fVxuXHR2YXIgZG9j
ID0gKCcnK3UgIT09IHR5cGVvZiBkb2N1bWVudCkgJiYgZG9jdW1lbnQ7XG59KTtcbnZhciBub29wID0gZnVuY3Rpb24oKXt9LCB1O1xuXHRcbn0oKSk7Iiwi
c3JjL2d1bi9sb2NhbFN0b3JhZ2UuanMiOiI7KGZ1bmN0aW9uKCl7XG5cbmlmKHR5cGVvZiBHdW4gPT09ICd1bmRlZmluZWQnKXsgcmV0dXJuIH1cblxudmFy
IG5vb3AgPSBmdW5jdGlvbigpe30sIHN0b3JlLCB1O1xudHJ5e3N0b3JlID0gKEd1bi53aW5kb3d8fG5vb3ApLmxvY2FsU3RvcmFnZX1jYXRjaChlKXt9XG5p
Zighc3RvcmUpe1xuXHRHdW4ubG9nKFwiV2FybmluZzogTm8gbG9jYWxTdG9yYWdlIGV4aXN0cyB0byBwZXJzaXN0IGRhdGEgdG8hXCIpO1xuXHRzdG9yZSA9
IHtzZXRJdGVtOiBmdW5jdGlvbihrLHYpe3RoaXNba109dn0sIHJlbW92ZUl0ZW06IGZ1bmN0aW9uKGspe2RlbGV0ZSB0aGlzW2tdfSwgZ2V0SXRlbTogZnVu
Y3Rpb24oayl7cmV0dXJuIHRoaXNba119fTtcbn1cblxudmFyIHBhcnNlID0gSlNPTi5wYXJzZUFzeW5jIHx8IGZ1bmN0aW9uKHQsY2Iscil7IHZhciB1OyB0
cnl7IGNiKHUsIEpTT04ucGFyc2UodCxyKSkgfWNhdGNoKGUpeyBjYihlKSB9IH1cbnZhciBqc29uID0gSlNPTi5zdHJpbmdpZnlBc3luYyB8fCBmdW5jdGlv
bih2LGNiLHIscyl7IHZhciB1OyB0cnl7IGNiKHUsIEpTT04uc3RyaW5naWZ5KHYscixzKSkgfWNhdGNoKGUpeyBjYihlKSB9IH1cblxuR3VuLm9uKCdjcmVh
dGUnLCBmdW5jdGlvbiBsZyhyb290KXtcblx0dGhpcy50by5uZXh0KHJvb3QpO1xuXHR2YXIgb3B0ID0gcm9vdC5vcHQsIGdyYXBoID0gcm9vdC5ncmFwaCwg
YWNrcyA9IFtdLCBkaXNrLCB0bywgc2l6ZSwgc3RvcDtcblx0aWYoZmFsc2UgPT09IG9wdC5sb2NhbFN0b3JhZ2Upe1xuXHRcdC8vIE1lbW9yeS1vbmx5IG1v
ZGU6IG5vIGRpc2sgd3JpdGVzIGJ1dCBzdGlsbCBhY2sgcHV0cyBzbyBjYWxsYmFja3MgZmlyZS5cblx0XHRyb290Lm9uKCdwdXQnLCBmdW5jdGlvbihtc2cp
e1xuXHRcdFx0dGhpcy50by5uZXh0KG1zZyk7XG5cdFx0XHRpZighbXNnWydAJ10peyByb290Lm9uKCdpbicsIHsnQCc6IG1zZ1snIyddLCBvazogMX0pIH1c
blx0XHR9KTtcblx0XHRyZXR1cm47XG5cdH1cblx0b3B0LnByZWZpeCA9IG9wdC5maWxlIHx8ICdndW4vJztcblx0dHJ5eyBkaXNrID0gbGdbb3B0LnByZWZp
eF0gPSBsZ1tvcHQucHJlZml4XSB8fCBKU09OLnBhcnNlKHNpemUgPSBzdG9yZS5nZXRJdGVtKG9wdC5wcmVmaXgpKSB8fCB7fTsgLy8gVE9ETzogUGVyZiEg
VGhpcyB3aWxsIGJsb2NrLCBzaG91bGQgd2UgY2FyZSwgc2luY2UgbGltaXRlZCB0byA1TUIgYW55d2F5cz9cblx0fWNhdGNoKGUpeyBkaXNrID0gbGdbb3B0
LnByZWZpeF0gPSB7fTsgfVxuXHRzaXplID0gKHNpemV8fCcnKS5sZW5ndGg7XG5cblx0cm9vdC5vbignZ2V0JywgZnVuY3Rpb24obXNnKXtcblx0XHR0aGlz
LnRvLm5leHQobXNnKTtcblx0XHR2YXIgbGV4ID0gbXNnLmdldCwgc291bCwgZGF0YSwgdG1wLCB1O1xuXHRcdGlmKCFsZXggfHwgIShzb3VsID0gbGV4Wycj
J10pKXsgcmV0dXJuIH1cblx0XHRkYXRhID0gZGlza1tzb3VsXSB8fCB1O1xuXHRcdGlmKGRhdGEgJiYgKHRtcCA9IGxleFsnLiddKSAmJiAhT2JqZWN0LnBs
YWluKHRtcCkpeyAvLyBwbHVjayFcblx0XHRcdGRhdGEgPSBHdW4uc3RhdGUuaWZ5KHt9LCB0bXAsIEd1bi5zdGF0ZS5pcyhkYXRhLCB0bXApLCBkYXRhW3Rt
cF0sIHNvdWwpO1xuXHRcdH1cblx0XHQvL2lmKGRhdGEpeyAodG1wID0ge30pW3NvdWxdID0gZGF0YSB9IC8vIGJhY2sgaW50byBhIGdyYXBoLlxuXHRcdC8v
c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdEd1bi5vbi5nZXQuYWNrKG1zZywgZGF0YSk7IC8vcm9vdC5vbignaW4nLCB7J0AnOiBtc2dbJyMnXSwgcHV0
OiB0bXAsIGxTOjF9KTsvLyB8fCByb290LiR9KTtcblx0XHQvL30sIE1hdGgucmFuZG9tKCkgKiAxMCk7IC8vIEZPUiBURVNUSU5HIFBVUlBPU0VTIVxuXHR9
KTtcblxuXHRyb290Lm9uKCdwdXQnLCBmdW5jdGlvbihtc2cpe1xuXHRcdHRoaXMudG8ubmV4dChtc2cpOyAvLyByZW1lbWJlciB0byBjYWxsIG5leHQgbWlk
ZGxld2FyZSBhZGFwdGVyXG5cdFx0dmFyIHB1dCA9IG1zZy5wdXQsIHNvdWwgPSBwdXRbJyMnXSwga2V5ID0gcHV0WycuJ10sIGlkID0gbXNnWycjJ10sIG9r
ID0gbXNnLm9rfHwnJywgdG1wOyAvLyBwdWxsIGRhdGEgb2ZmIHdpcmUgZW52ZWxvcGVcblx0XHRkaXNrW3NvdWxdID0gR3VuLnN0YXRlLmlmeShkaXNrW3Nv
dWxdLCBrZXksIHB1dFsnPiddLCBwdXRbJzonXSwgc291bCk7IC8vIG1lcmdlIGludG8gZGlzayBvYmplY3Rcblx0XHRpZihzdG9wICYmIHNpemUgPiAoNDk5
OTg4MCkpeyByb290Lm9uKCdpbicsIHsnQCc6IGlkLCBlcnI6IFwibG9jYWxTdG9yYWdlIG1heCFcIn0pOyByZXR1cm47IH1cblx0XHQvL2lmKCFtc2dbJ0An
XSl7IGFja3MucHVzaChpZCkgfSAvLyB0aGVuIGFjayBhbnkgbm9uLWFjayB3cml0ZS4gLy8gVE9ETzogdXNlIGJhdGNoIGlkLlxuXHRcdGlmKCFtc2dbJ0An
XSAmJiAoIW1zZy5fLnZpYSB8fCBNYXRoLnJhbmRvbSgpIDwgKG9rWydAJ10gLyBva1snLyddKSkpeyBhY2tzLnB1c2goaWQpIH0gLy8gdGhlbiBhY2sgYW55
IG5vbi1hY2sgd3JpdGUuIC8vIFRPRE86IHVzZSBiYXRjaCBpZC5cblx0XHRpZih0byl7IHJldHVybiB9XG5cdFx0dG8gPSBzZXRUaW1lb3V0KGZsdXNoLCA5
KyhzaXplIC8gMzMzKSk7IC8vIDAuMU1CID0gMC4zcywgNU1CID0gMTVzIFxuXHR9KTtcblx0ZnVuY3Rpb24gZmx1c2goKXtcblx0XHRpZighYWNrcy5sZW5n
dGggJiYgKChzZXRUaW1lb3V0LnR1cm58fCcnKS5zfHwnJykubGVuZ3RoKXsgc2V0VGltZW91dChmbHVzaCw5OSk7IHJldHVybjsgfSAvLyBkZWZlciBpZiBc
ImJ1c3lcIiAmJiBubyBzYXZlcy5cblx0XHR2YXIgZXJyLCBhY2sgPSBhY2tzOyBjbGVhclRpbWVvdXQodG8pOyB0byA9IGZhbHNlOyBhY2tzID0gW107XG5c
dFx0anNvbihkaXNrLCBmdW5jdGlvbihlcnIsIHRtcCl7XG5cdFx0XHR0cnl7IWVyciAmJiBzdG9yZS5zZXRJdGVtKG9wdC5wcmVmaXgsIHRtcCk7XG5cdFx0
XHR9Y2F0Y2goZSl7IGVyciA9IHN0b3AgPSBlIHx8IFwibG9jYWxTdG9yYWdlIGZhaWx1cmVcIiB9XG5cdFx0XHRpZihlcnIpe1xuXHRcdFx0XHRHdW4ubG9n
KGVyciArIFwiIENvbnNpZGVyIHVzaW5nIEdVTidzIEluZGV4ZWREQiBwbHVnaW4gZm9yIFJBRCBmb3IgbW9yZSBzdG9yYWdlIHNwYWNlLCBodHRwczovL2d1
bi5lY28vZG9jcy9SQUQjaW5zdGFsbFwiKTtcblx0XHRcdFx0cm9vdC5vbignbG9jYWxTdG9yYWdlOmVycm9yJywge2VycjogZXJyLCBnZXQ6IG9wdC5wcmVm
aXgsIHB1dDogZGlza30pO1xuXHRcdFx0fVxuXHRcdFx0c2l6ZSA9IHRtcC5sZW5ndGg7XG5cblx0XHRcdC8vaWYoIWVyciAmJiAhT2JqZWN0LmVtcHR5KG9w
dC5wZWVycykpeyByZXR1cm4gfSAvLyBvbmx5IGFjayBpZiB0aGVyZSBhcmUgbm8gcGVlcnMuIC8vIFN3aXRjaCB0aGlzIHRvIHByb2JhYmlsaXN0aWMgbW9k
ZVxuXHRcdFx0c2V0VGltZW91dC5lYWNoKGFjaywgZnVuY3Rpb24oaWQpe1xuXHRcdFx0XHRyb290Lm9uKCdpbicsIHsnQCc6IGlkLCBlcnI6IGVyciwgb2s6
IDB9KTsgLy8gbG9jYWxTdG9yYWdlIGlzbid0IHJlbGlhYmxlLCBzbyBtYWtlIGl0cyBgb2tgIGNvZGUgYmUgYSBsb3cgbnVtYmVyLlxuXHRcdFx0fSwwLDk5
KTtcblx0XHR9KVxuXHR9XG5cbn0pO1xuXHRcbn0oKSk7In19
UNBUILD-SNAPSHOT-END */
