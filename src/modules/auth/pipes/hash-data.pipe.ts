import { Injectable, PipeTransform } from '@nestjs/common';
import { CryptoService } from 'src/modules/crypto/crypto.service';

@Injectable()
export class HashDataPipe implements PipeTransform {
 constructor(private readonly cryptoService: CryptoService) {}

 transform(value: any) {
  if (typeof value === 'object' && 'number' in value) {
   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
   const hashedNumber = this.cryptoService.encrypt(value.number);
   // eslint-disable-next-line @typescript-eslint/no-unsafe-return
   return { ...value, number: hashedNumber };
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return value;
 }
}
