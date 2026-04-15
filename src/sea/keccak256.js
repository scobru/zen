import __shim from './shim.js';

let __defaultExport;
(function(){

    var shim = __shim;
    var MASK64 = (1n << 64n) - 1n;
    var RATE = 136;
    var OUTPUT_BYTES = 32;
    var SUFFIX = 0x01;
    var ROT = [
      0, 1, 62, 28, 27,
      36, 44, 6, 55, 20,
      3, 10, 43, 25, 39,
      41, 45, 15, 21, 8,
      18, 2, 61, 56, 14
    ];
    var RC = [
      0x0000000000000001n, 0x0000000000008082n,
      0x800000000000808an, 0x8000000080008000n,
      0x000000000000808bn, 0x0000000080000001n,
      0x8000000080008081n, 0x8000000000008009n,
      0x000000000000008an, 0x0000000000000088n,
      0x0000000080008009n, 0x000000008000000an,
      0x000000008000808bn, 0x800000000000008bn,
      0x8000000000008089n, 0x8000000000008003n,
      0x8000000000008002n, 0x8000000000000080n,
      0x000000000000800an, 0x800000008000000an,
      0x8000000080008081n, 0x8000000000008080n,
      0x0000000080000001n, 0x8000000080008008n
    ];

    function rotl64(value, shift) {
      var amount = BigInt(shift & 63);
      if (!amount) { return value & MASK64; }
      return ((value << amount) | (value >> (64n - amount))) & MASK64;
    }

    function keccakF(state) {
      for (var round = 0; round < 24; round++) {
        var c = new Array(5);
        var d = new Array(5);
        var b = new Array(25);
        var x;
        var y;
        var idx;
        for (x = 0; x < 5; x++) {
          c[x] = state[x] ^ state[x + 5] ^ state[x + 10] ^ state[x + 15] ^ state[x + 20];
        }
        for (x = 0; x < 5; x++) {
          d[x] = c[(x + 4) % 5] ^ rotl64(c[(x + 1) % 5], 1);
        }
        for (y = 0; y < 5; y++) {
          for (x = 0; x < 5; x++) {
            state[x + (5 * y)] ^= d[x];
          }
        }
        for (y = 0; y < 5; y++) {
          for (x = 0; x < 5; x++) {
            idx = x + (5 * y);
            b[y + (5 * ((2 * x + 3 * y) % 5))] = rotl64(state[idx], ROT[idx]);
          }
        }
        for (y = 0; y < 5; y++) {
          for (x = 0; x < 5; x++) {
            state[x + (5 * y)] = b[x + (5 * y)] ^ ((~b[((x + 1) % 5) + (5 * y)]) & b[((x + 2) % 5) + (5 * y)]);
          }
        }
        state[0] ^= RC[round];
      }
    }

    function xorBlock(state, block) {
      for (var i = 0; i < block.length; i++) {
        var lane = Math.floor(i / 8);
        var shift = BigInt((i % 8) * 8);
        state[lane] ^= BigInt(block[i]) << shift;
      }
    }

    function toBytes(data) {
      if (typeof data === 'string') {
        return new shim.TextEncoder().encode(data);
      }
      if (data instanceof Uint8Array) { return data; }
      if (data instanceof ArrayBuffer) { return new Uint8Array(data); }
      if (data && data.buffer instanceof ArrayBuffer) {
        return new Uint8Array(data.buffer, data.byteOffset || 0, data.byteLength);
      }
      return new shim.TextEncoder().encode(String(data));
    }

    __defaultExport = async function keccak256(data){
      var bytes = toBytes(data);
      var state = new Array(25).fill(0n);
      var offset = 0;
      while ((offset + RATE) <= bytes.length) {
        xorBlock(state, bytes.subarray(offset, offset + RATE));
        keccakF(state);
        offset += RATE;
      }
      var finalBlock = new Uint8Array(RATE);
      finalBlock.set(bytes.subarray(offset));
      finalBlock[bytes.length - offset] ^= SUFFIX;
      finalBlock[RATE - 1] ^= 0x80;
      xorBlock(state, finalBlock);
      keccakF(state);

      var out = new Uint8Array(OUTPUT_BYTES);
      for (var i = 0; i < OUTPUT_BYTES; i++) {
        var lane = state[Math.floor(i / 8)];
        out[i] = Number((lane >> BigInt((i % 8) * 8)) & 0xffn);
      }
      return shim.Buffer.from(out);
    }

}());
export default __defaultExport;
