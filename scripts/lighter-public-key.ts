import 'dotenv/config';
import { bytesToHex } from '../src/exchanges/lighter/bytes';
import { LighterPrivateKey } from '../src/exchanges/lighter/crypto/schnorr';

function main(): void {
   const raw = process.env.LIGHTER_API_PRIVATE_KEY;
   if (!raw) {
      throw new Error('LIGHTER_API_PRIVATE_KEY env var is required');
   }
   const normalized = raw.startsWith('0x') ? raw.slice(2) : raw;
   const key = LighterPrivateKey.fromHex(normalized);
   const publicKeyHex = bytesToHex(key.publicKey().toBytes());
   const apiKeyIndex = process.env.LIGHTER_API_KEY_INDEX ?? '(not set)';

   console.log(JSON.stringify({ apiKeyIndex, publicKeyHex }, null, 2));
}

main();
