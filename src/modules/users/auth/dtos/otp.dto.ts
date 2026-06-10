import { IsString, Matches } from 'class-validator';
import { numberRegx } from 'src/shared/utils';

export default class OtpDto {
 @IsString()
 @Matches(numberRegx, { message: 'فرمت شماره موبایل اشتباه است' })
 number: string;
}
