import { CryptoHash } from './cryptoHash.service';

export default function safeDecrypt(
 encryptedValue: string | null | undefined,
): string | null {
 const cryptoHash = new CryptoHash();
 if (!encryptedValue) return null;

 // بررسی فرمت معتبر (شامل : باشد)
 if (!encryptedValue.includes(':')) {
  console.warn('Invalid encrypted format, returning original value');
  return encryptedValue; // یا null
 }

 try {
  return cryptoHash.decrypt(encryptedValue);
 } catch (error) {
  if (typeof error === 'object')
   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
   console.error('Decryption failed:', error['message']);
  return null; // یا مقدار پیش‌فرض
 }
}
