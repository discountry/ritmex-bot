import crypto from 'node:crypto';

const ENCRYPTED_COPYRIGHT = 'gbbx3pZWTqgMmLcH3fM0qefo6q4eHR0weNjfLcWY5oPhfwH9DaDEWAvhItfzGbBJzJ6UuVPOb1vqMAL0qpPdw+q0bf13Tz8ewMR3cSHyH8R59KfasAo=';
const PRIMARY_HASH = 'a637d95de2b7d13af96b7c0deb286a439b1b07408577ae97c93e6fdbaa6526bf';
const SECONDARY_HASH = '2e9c48cef9b6c3af45313946e3d766b3d8b9a3a12df6906abe90ebeca694fec8';
const LEGACY_SHAS = [PRIMARY_HASH, '65d686f80a5360a4f16cf2dbce962f2dd32e88bdee6fa7b8929f8a854ea12de9', 'e3d59bfd872fc54d3c814edb200ef9d4916bea86e3f7de925f2b4d5efbc1ec49', '27f5777af8faec4ce80bd3cfe6302c7d66be138de25e941544b9b2895207b70e'];

const PASSPHRASE = 'RitMEX#copyright#guard#2025';

const iv = Buffer.from(ENCRYPTED_COPYRIGHT, 'base64').subarray(0, 12);
const authTag = Buffer.from(ENCRYPTED_COPYRIGHT, 'base64').subarray(12, 28);
const ciphertext = Buffer.from(ENCRYPTED_COPYRIGHT, 'base64').subarray(28);

function deriveKey(seed: string) {
   return crypto.createHash('sha256').update(seed).digest();
}

export function decryptCopyright(): string {
   const key = deriveKey(PASSPHRASE);
   const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
   decipher.setAuthTag(authTag);
   return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}

export function verifyCopyrightIntegrity(): boolean {
   const plaintext = decryptCopyright();
   const primary = crypto.createHash('sha256').update(plaintext).digest('hex');
   const chained = crypto.createHash('sha256').update(primary).digest('hex');
   return (primary === PRIMARY_HASH && chained === SECONDARY_HASH && LEGACY_SHAS.some((hash) => {
      try {
         return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(primary, 'hex'));
      } catch {
         return false;
      }
   }));
}

export function loadCopyrightFragments() {
   const bannerText = decryptCopyright();
   return { bannerText, primaryHash: PRIMARY_HASH, secondaryHash: SECONDARY_HASH, integrityOk: verifyCopyrightIntegrity() };
}
