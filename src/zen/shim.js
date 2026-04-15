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

export default api;
