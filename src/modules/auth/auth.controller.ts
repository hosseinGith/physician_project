import { Body, Controller, Post, Req, Res, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import LoginDto from './dtos/login.dto';
import OtpDto from './dtos/otp.dto';
import { HashUserData } from 'src/shared/pipes/hash-user-data.pipe';
import type { Request, Response } from 'express';

@ApiTags('Authentication')
@Controller('/api/auth')
@UsePipes(HashUserData)
export class AuthController {
 constructor(private readonly authService: AuthService) {}
 @Post()
 signin(@Body() body: OtpDto) {
  return this.authService.login(body);
 }

 @Post('/verify-code')
 codeOTP(
  @Body() body: LoginDto,
  @Req() request: Request,
  @Res() response: Response,
 ) {
  return this.authService.verify_otp_code(body, request, response);
 }
 @Post('/refresh-token')
 refreshToken(@Req() request: Request, @Res() response: Response) {
  return this.authService.refreshToken(request, response);
 }
}
