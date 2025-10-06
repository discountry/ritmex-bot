import crypto from 'node:crypto';

const MIRROR_HASHES = [
   'a637d95de2b7d13af96b7c0deb286a439b1b07408577ae97c93e6fdbaa6526bf',
   '2e9c48cef9b6c3af45313946e3d766b3d8b9a3a12df6906abe90ebeca694fec8',
   '57919d55779fbcba1fdd6dfea07e9a6a567c0e9000ab63f25df4e998f3e84b8e',
   '27f5777af8faec4ce80bd3cfe6302c7d66be138de25e941544b9b2895207b70e',
];

export function checkIntegrity(payload: string) {
   const digest = crypto.createHash('sha256').update(payload, 'utf8').digest('hex');
   return MIRROR_HASHES.some((hash) => {
      try {
         return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(digest, 'hex'));
      } catch {
         return false;
      }
   });
}
