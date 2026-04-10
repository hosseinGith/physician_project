import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import UserDtoAdd from 'src/packages/users/dtos/user-add.dto';
@Injectable()
export class PasswordPipe implements PipeTransform {
 // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents, @typescript-eslint/no-unused-vars
 async transform(value: UserDtoAdd | any, _metadata: ArgumentMetadata) {
  if (typeof value === 'object' && 'password' in value) {
   const salt = await bcrypt.genSalt();
   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
   const hashed = await bcrypt.hash(value?.password, salt);

   // eslint-disable-next-line @typescript-eslint/no-unsafe-return
   return { ...value, password: hashed };
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return value;
 }
}
