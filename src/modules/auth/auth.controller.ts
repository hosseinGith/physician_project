import {
 Body,
 Controller,
 NotFoundException,
 Post,
 Req,
 Res,
 UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import LoginDto from './dto/login.dto';
import OtpDto from './dto/otp.dto';
import { HashUserData } from '../../shared/pipes/hash-user-data.pipe';
import { type Request, type Response } from 'express';

@ApiTags('Authentication')
@Controller('/api/auth')
@UsePipes(HashUserData)
export class AuthController {
 constructor(private readonly authService: AuthService) {}
 @Post()
 sendOtp(@Body() body: OtpDto) {
  return this.authService.sendOtp(body);
 }

 @Post('/verify-code')
 async verifyCode(
  @Body() body: LoginDto,
  @Res({ passthrough: true }) response: Response,
 ) {
  const { userId } = await this.authService.verifyCode(body);
  const token = this.authService.createTokens({ id: userId }, response);
  return token;
 }
 @Post('/refresh-token')
 async refreshToken(
  @Req() request: Request,
  @Res({ passthrough: true }) response: Response,
 ) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const user_refresh_token = request.cookies['refresh_token'] as
   | string
   | undefined;
  if (!user_refresh_token) throw new NotFoundException();
  const { userId } = await this.authService.refreshToken(user_refresh_token);
  const token = this.authService.createTokens({ id: userId }, response);
  return token;
 }
}
