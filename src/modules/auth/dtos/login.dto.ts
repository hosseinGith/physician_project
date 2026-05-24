import { IsString, Length, Matches } from 'class-validator';
import { numberRegx } from 'src/shared/utils';

// user-data.dto.ts
export class UserDataDto {
 @IsString()
 @Matches(numberRegx, { message: 'فرمت شماره موبایل اشتباه است' })
 number: string;

 @IsString()
 password: string;
}
// signup.dto.ts
export default class LoginDto {
 @IsString()
 @Matches(numberRegx, { message: 'فرمت شماره موبایل اشتباه است' })
 number: string;
 @IsString()
 @Length(
  Number(process.env.OTP_CODE_LENGTH || 5),
  Number(process.env.OTP_CODE_LENGTH || 5),
  { message: 'فرمت کد تایید اشتباه است.' },
 )
 code: string;
}

