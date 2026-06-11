import { Injectable, PipeTransform } from '@nestjs/common';
import { CryptoHash } from 'src/shared/utils/cryptoHash.service';

@Injectable()
export class HashDataPipe implements PipeTransform {
 transform(value: any) {
  if (typeof value === 'object' && 'number' in value) {
   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
   const hashedNumber = new CryptoHash().encrypt(value.number);
   // eslint-disable-next-line @typescript-eslint/no-unsafe-return
   return { ...value, number: hashedNumber };
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return value;
 }
}
