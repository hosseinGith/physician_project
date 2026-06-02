import { IsString, Matches } from 'class-validator';

export default class AddHourDto {
 @IsString()
 @Matches(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, {
  message: 'ساعت باید در فرمت HH:MM باشد.',
 })
 hour: string;
}
