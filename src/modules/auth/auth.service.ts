import {
 Injectable,
 BadRequestException,
 NotFoundException,
 UnauthorizedException,
 ServiceUnavailableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Patients } from 'src/modules/patient/entities/patients.entity';
import { Users } from 'src/modules/users/entities/users.entity';
import { Repository } from 'typeorm';
import LoginDto from './dto/login.dto';
import OtpDto from './dto/otp.dto';
import { OtpCodes } from './entities/otpCodes.entity';

import { randomInt } from 'node:crypto';
import { baseTimeOtpExpire } from 'src/shared/settings';
import { Response } from 'express';
import { TokenType } from 'src/types';
import { UsersService } from '../users/users.service';
import { CryptoService } from '../crypto/crypto.service';

@Injectable()
export class AuthService {
 constructor(
  private readonly users: UsersService,
  @InjectRepository(OtpCodes)
  private readonly otpCodes: Repository<OtpCodes>,
  private readonly jwtService: JwtService,
  private readonly cryptoHash: CryptoService,
 ) {}
 createTokens(tokenConfig: any, response: Response) {
  try {
   const new_refresh_token = this.jwtService.sign(tokenConfig, {
    secret: process.env.JWT_SECRET,
   });
   const new_access_token = this.jwtService.sign(tokenConfig);

   response.cookie('refresh_token', new_refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
   });
   return new_access_token;
  } catch {
   throw new ServiceUnavailableException(
    'مشکل در احراز هویت. لطفا دوباره تلاش کنید.',
   );
  }
 }
 async sendOtp(body: OtpDto) {
  const hashedNumber = this.cryptoHash.hashForSearch(
   this.cryptoHash.decrypt(body.number),
  );

  const existingNumber = await this.otpCodes.findOne({
   where: { number_hash: hashedNumber },
  });
  if (existingNumber) {
   const delta = (Date.now() - existingNumber.created_at.getTime()) / 1000;
   if (
    delta < Number(process.env.OTP_CODE_TIME_EXPIRE_SEC || baseTimeOtpExpire)
   ) {
    return {
     message: `کد ارسال شده است . لطفا بعد از ${(Number(process.env.OTP_CODE_TIME_EXPIRE_SEC || baseTimeOtpExpire) - delta).toFixed(0)} ثانیه دوباره تلاش کنید.`,
     error: 'haveCode',
     time: `${(Number(process.env.OTP_CODE_TIME_EXPIRE_SEC || baseTimeOtpExpire) - delta).toFixed(0)}`,
    };
   }
   // after check number date in otpCodes delete it if after of expire time
   else await this.otpCodes.delete(existingNumber.id);
  }
  //   start otp mission
  const length = Number(process.env.OTP_CODE_LENGTH) || 5;
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const code = randomInt(min, max + 1).toString();

  const encrypted_code = this.cryptoHash.encrypt(code);
  console.log(encrypted_code);

  try {
   await this.otpCodes.save(
    this.otpCodes.create({
     code: encrypted_code,
     number: body.number,
     number_hash: hashedNumber,
    }),
   );
   return { code, time: baseTimeOtpExpire };
  } catch {
   throw new BadRequestException('مشکل در سیستم');
  }
 }

 async verifyCode(body: LoginDto) {
  const hashedNumber = this.cryptoHash.hashForSearch(
   this.cryptoHash.decrypt(body.number),
  );

  const otp = await this.otpCodes.findOneBy({ number_hash: hashedNumber });
  if (!otp)
   throw new NotFoundException(
    'شماره موبایل اشتباه است. لطفا دوباره تلاش کنید.',
   );
  // check otp code time
  if (
   (Date.now() - otp.created_at.getTime()) / 1000 >
   Number(process.env.OTP_CODE_TIME_EXPIRE_SEC || baseTimeOtpExpire)
  ) {
   await this.otpCodes.delete({ number: body.number });
   throw new BadRequestException(
    'زمان ثبت کد فرا رسیده است. لطفا دوباره تلاش کنید.',
    'Time',
   );
  }

  if (this.cryptoHash.decrypt(otp.code) !== this.cryptoHash.decrypt(body.code))
   throw new BadRequestException(
    'کد اشتباه است. لطفا دوباره تلاش کنید.',
    'Code incorrect',
   );

  try {
   const user = await this.users.findOneByWhere({
    number_hash: hashedNumber,
   });
   // without create patient
   if (user) {
    await this.otpCodes.delete({ number_hash: hashedNumber });
    return {
     userId: user.id,
    };
   }
  } catch {
   /* empty */
  }
  // create patient for new accounts
  const queryRunner = this.otpCodes.manager.connection.createQueryRunner();
  try {
   await queryRunner.connect();
   await queryRunner.startTransaction();
   const user = await queryRunner.manager.save(
    Users,
    queryRunner.manager.create(Users, {
     number: body.number,
     number_hash: body.number,
    }),
   );
   const patient = queryRunner.manager.create(Patients, {
    user,
   });
   await queryRunner.manager.delete(OtpCodes, { number: body.number });
   await queryRunner.manager.save(Patients, patient);
   await queryRunner.commitTransaction();
   return {
    userId: user.id,
   };
  } catch (e) {
   console.log(e);
   await queryRunner.rollbackTransaction();
   throw new ServiceUnavailableException();
  } finally {
   await queryRunner.release();
  }
 }
 async refreshToken(user_refresh_token: string) {
  if (!user_refresh_token) throw new UnauthorizedException();
  try {
   this.jwtService.verify(user_refresh_token, {
    secret: process.env.JWT_SECRET,
   });
   const de_user: TokenType = this.jwtService.decode(user_refresh_token);
   const id = de_user?.id;
   const user = await this.users.findOne(id);
   if (!user) throw new NotFoundException();
   return { userId: user.id };
  } catch {
   throw new UnauthorizedException();
  }
 }
}
