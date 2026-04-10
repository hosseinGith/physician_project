import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AccessType } from 'src/types';

export default class UserDtoAdd {
 @IsOptional()
 firstName?: string;
 @IsOptional()
 lastName?: string;

 @IsString()
 @IsNotEmpty()
 username: string;
 @IsString()
 @IsNotEmpty()
 password: string;
 @IsNotEmpty()
 @IsEnum(AccessType)
 access: AccessType;
}
