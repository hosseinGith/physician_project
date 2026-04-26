import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import LoginDto from './dtos/login.dto';
import OtpDto from './dtos/otp.dto';
import { HashUserData } from 'src/shared/pipes/hash-user-data.pipe';

@ApiTags('Authentication')
@Controller('auth')
@UsePipes(HashUserData)
export class AuthController {
 constructor(private readonly authService: AuthService) {}
 @Post('login')
 signin(@Body() body: OtpDto) {
  return this.authService.login(body);
 }

 @Post('login/verify-code')
 codeOTP(@Body() body: LoginDto) {
  return this.authService.verify_otp_code(body);
 }
}
