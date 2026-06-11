import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
class userData {
 @IsString()
 first_name: string;
 @IsString()
 last_name: string;
 @IsString()
 national_id: string;
}
export default class UserUpdatePublicDto extends PartialType(userData) {}
