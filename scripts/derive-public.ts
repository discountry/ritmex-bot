import { bytesToHex } from '../src/exchanges/lighter/bytes';
import { LighterPrivateKey } from '../src/exchanges/lighter/crypto/schnorr';

function derive(keyHex: string): string {
   const normalized = keyHex.startsWith('0x') ? keyHex.slice(2) : keyHex;
   const key = LighterPrivateKey.fromHex(normalized);
   return bytesToHex(key.publicKey().toBytes());
}

const input = process.argv[2];
if (!input) {
   console.error('usage: bun run scripts/derive-public.ts <hex>');
   process.exit(1);
}

console.log(derive(input));
