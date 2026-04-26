/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, PipeTransform } from '@nestjs/common';

import { CryptoHash } from '../utils/cryptoHash.service';
import { hashedUserCol } from '../settings';

@Injectable()
export class HashUserData implements PipeTransform {
 transform(value: any) {
  if (!value || typeof value !== 'object') return value;
  return this.deepSearchAndEncrypt(value);
 }

 private deepSearchAndEncrypt(data: any): any {
  if (Array.isArray(data)) {
   return data.map((item) => this.deepSearchAndEncrypt(item));
  }
  if (data) {
   const result = { ...data };

   for (const [key, value] of Object.entries(result)) {
    try {
     if (typeof value === 'string' && hashedUserCol.includes(key)) {
      result[key] = new CryptoHash().encrypt(value);
     } else if (
      typeof value === 'object' &&
      value !== null &&
      !('getTime' in value)
     ) {
      result[key] = this.deepSearchAndEncrypt(value);
     }
    } catch {
     /* empty */
     result[key] = value;
    }
   }

   return result;
  }

  return data;
 }
}
