import BufferApi from './buffer.js';

const globalScope = (typeof globalThis !== 'undefined') ? globalThis : (typeof global !== 'undefined' ? global : (typeof window !== 'undefined' ? window : {}));
const api = { Buffer: globalScope.Buffer || BufferApi };
const empty = {};

JSON.parseAsync = JSON.parseAsync || function(text, cb, reviver) {
  try { cb(undefined, JSON.parse(text, reviver)); } catch (error) { cb(error); }
};
JSON.stringifyAsync = JSON.stringifyAsync || function(value, cb, replacer, space) {
  try { cb(undefined, JSON.stringify(value, replacer, space)); } catch (error) { cb(error); }
};

api.parse = function(text, reviver) {
  return new Promise(function(resolve, reject) {
    JSON.parseAsync(text, function(error, raw) { error ? reject(error) : resolve(raw); }, reviver);
  });
};

api.stringify = function(value, replacer, space) {
  return new Promise(function(resolve, reject) {
    JSON.stringifyAsync(value, function(error, raw) { error ? reject(error) : resolve(raw); }, replacer, space);
  });
};

if (!api.TextEncoder) { api.TextEncoder = globalScope.TextEncoder; }
if (!api.TextDecoder) { api.TextDecoder = globalScope.TextDecoder; }

api.crypto = globalScope.crypto;
api.subtle = (globalScope.crypto || empty).subtle || (globalScope.crypto || empty).webkitSubtle;
api.random = function(len) {
  return api.Buffer.from(api.crypto.getRandomValues(new Uint8Array(api.Buffer.alloc(len))));
};

// JS utility shims (ported from gun/shim.js)
String.random = String.random || function(l, c) {
  var s = '';
  l = l || 24;
  c = c || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXZabcdefghijklmnopqrstuvwxyz';
  while (l-- > 0) { s += c.charAt(Math.floor(Math.random() * c.length)); }
  return s;
};
String.match = String.match || function(t, o) { var tmp, u;
  if ('string' !== typeof t) { return false; }
  if ('string' == typeof o) { o = {'=': o}; }
  o = o || {};
  tmp = (o['='] || o['*'] || o['>'] || o['<']);
  if (t === tmp) { return true; }
  if (u !== o['=']) { return false; }
  tmp = (o['*'] || o['>']);
  if (t.slice(0, (tmp||'').length) === tmp) { return true; }
  if (u !== o['*']) { return false; }
  if (u !== o['>'] && u !== o['<']) {
    return (t >= o['>'] && t <= o['<']) ? true : false;
  }
  if (u !== o['>'] && t >= o['>']) { return true; }
  if (u !== o['<'] && t <= o['<']) { return true; }
  return false;
};
String.hash = String.hash || function(s, c) {
  if (typeof s !== 'string') { return; }
  c = c || 0;
  if (!s.length) { return c; }
  for (var i = 0, l = s.length, n; i < l; ++i) {
    n = s.charCodeAt(i);
    c = ((c<<5)-c)+n;
    c |= 0;
  }
  return c;
};
var has = Object.prototype.hasOwnProperty;
Object.plain = Object.plain || function(o) {
  return o ? (o instanceof Object && o.constructor === Object) || Object.prototype.toString.call(o).match(/^\[object (\w+)\]$/)[1] === 'Object' : false;
};
Object.empty = Object.empty || function(o, n) {
  for (var k in o) { if (has.call(o, k) && (!n || -1==n.indexOf(k))) { return false; } }
  return true;
};
Object.keys = Object.keys || function(o) {
  var l = [];
  for (var k in o) { if (has.call(o, k)) { l.push(k); } }
  return l;
};
;(function() {
  var u, sT = setTimeout, l = 0, c = 0, active = 0
  , sI = (typeof setImmediate !== ''+u && setImmediate) || (function(c, f) {
    if (typeof MessageChannel == ''+u) { return sT; }
    (c = new MessageChannel()).port1.onmessage = function(e) { '' == e.data && f(); };
    return function(q) { f=q; c.port2.postMessage(''); };
  }()), check = sT.check = sT.check || (typeof performance !== ''+u && performance)
  || {now: function() { return +new Date; }};
  sT.hold = sT.hold || 9;
  sT.poll = sT.poll || function(f) {
    if (active) {
      sI(function() { l = check.now(); active = 1; try { f(); } finally { active = 0; } }, c=0);
      return;
    }
    if ((sT.hold >= (check.now() - l)) && c++ < 3333) {
      active = 1;
      try { f(); } finally { active = 0; }
      return;
    }
    sI(function() { l = check.now(); active = 1; try { f(); } finally { active = 0; } }, c=0);
  };
}());
;(function() {
  var sT = setTimeout, t = sT.turn = sT.turn || function(f) { 1 == s.push(f) && p(T); }
  , s = t.s = [], p = sT.poll, i = 0, f, T = function() {
    if (f = s[i++]) { f(); }
    if (i == s.length || 99 == i) {
      s = t.s = s.slice(i);
      i = 0;
    }
    if (s.length) { p(T); }
  };
}());
;(function() {
  var u, sT = setTimeout, T = sT.turn;
  (sT.each = sT.each || function(l, f, e, S) { S = S || 9; (function t(s, L, r) {
    if (L = (s = (l||[]).splice(0, S)).length) {
      for (var i = 0; i < L; i++) {
        if (u !== (r = f(s[i]))) { break; }
      }
      if (u === r) { T(t); return; }
    }
    e && e(r);
  }()); })();
}());

export default api;
