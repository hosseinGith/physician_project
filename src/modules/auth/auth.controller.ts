import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import LoginDto from './dtos/login.dto';
import OtpDto from './dtos/otp.dto';

@ApiTags('Authentication')
@Controller('auth')
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
