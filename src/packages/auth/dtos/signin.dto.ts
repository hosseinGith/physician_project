import { IsNotEmpty, IsString } from 'class-validator';

export default class SignInDto {
 @IsString()
 @IsNotEmpty()
 username: string;
 @IsString()
 @IsNotEmpty()
 password: string;
}
