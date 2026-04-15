import secp256k1 from './secp256k1.js';
import p256 from './p256.js';

const MAP = { secp256k1, p256, secp256r1: p256 };

export default function crv(name) { return MAP[name] || MAP.secp256k1; }
