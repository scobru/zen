import shim from "./shim.js";
import bridge from "./crypto.js";

function toBytes(data) {
  if (typeof data === "string") {
    return new shim.TextEncoder().encode(data);
  }
  if (data instanceof Uint8Array) {
    return data;
  }
  if (data instanceof ArrayBuffer) {
    return new Uint8Array(data);
  }
  if (data && data.buffer instanceof ArrayBuffer) {
    return new Uint8Array(data.buffer, data.byteOffset || 0, data.byteLength);
  }
  return new shim.TextEncoder().encode(String(data));
}

export default async function keccak256(data) {
  await bridge.ready;
  const bytes = toBytes(data);
  return shim.Buffer.from(bridge.keccak256(bytes));
}
