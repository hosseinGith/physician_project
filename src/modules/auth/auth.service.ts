import {
 Injectable,
 BadRequestException,
 NotFoundException,
 UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctors } from 'src/entitys/doctors.entity';
import { Patients } from 'src/entitys/patients.entity';
import { Users } from 'src/entitys/users.entity';
import { Repository } from 'typeorm';
import LoginDto from './dtos/login.dto';
import OtpDto from './dtos/otp.dto';
import { OtpCodes } from 'src/entitys/otpCodes.entity';

import { CryptoHash } from 'src/shared/utils/cryptoHash.service';
import { randomInt } from 'node:crypto';
import { baseTimeOtpExpire } from 'src/shared/settings';
import { Request, Response } from 'express';
import { TokenType } from 'src/types';

@Injectable()
export class AuthService {
 constructor(
  @InjectRepository(Users)
  private readonly users: Repository<Users>,
  @InjectRepository(Patients)
  private readonly patients: Repository<Patients>,
  @InjectRepository(Doctors)
  private readonly doctors: Repository<Doctors>,
  @InjectRepository(OtpCodes)
  private readonly otpCodes: Repository<OtpCodes>,

  private readonly jwtService: JwtService,
  private readonly cryptoHash: CryptoHash,
 ) {}

 async login(body: OtpDto) {
  const existingNumber = await this.otpCodes.findOne({
   where: { number: body.number },
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
  }
  // after check number date in otpCodes delete it if after of expire time

  if (existingNumber) await this.otpCodes.delete(existingNumber.id);
  //   start otp mission

  const length = Number(process.env.OTP_CODE_LENGTH) || 5;
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const code = randomInt(min, max + 1).toString();

  const encrypted_code = this.cryptoHash.encrypt(code);
  try {
   await this.otpCodes.save(
    this.otpCodes.create({
     code: encrypted_code,
     number: body.number,
    }),
   );
   return { code, time: baseTimeOtpExpire };
  } catch {
   throw new BadRequestException('مشکل در سیستم');
  }
 }
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
   /* empty */
  }
 }
 async verify_otp_code(body: LoginDto, request: Request, response: Response) {
  const otp = await this.otpCodes.findOneBy({ number: body.number });
  if (!otp?.code) throw new NotFoundException('شماره  مورد نظر پیدا نشد.');

  if (otp.code !== body.code) {
   if (otp) {
    throw new BadRequestException(
     'کد اشتباه است. لطفا دوباره تلاش کنید.',
     'Code incorrect',
    );
   } else
    throw new NotFoundException(
     'شماره موبایل اشتباه است. لطفا دوباره تلاش کنید.',
     'Number incorrect',
    );
  } else if (
   (Date.now() - otp.created_at.getTime()) / 1000 >
   Number(process.env.OTP_CODE_TIME_EXPIRE_SEC || baseTimeOtpExpire)
  ) {
   await this.otpCodes.delete({ number: body.number });
   throw new BadRequestException(
    'زمان ثبت کد فرا رسیده است. لطفا دوباره تلاش کنید.',
    'Time',
   );
  }
  try {
   const existingNumber = await this.users.findOne({
    where: { number: body.number },
   });

   if (!existingNumber) {
    const queryRunner = this.users.manager.connection.createQueryRunner();
    console.log(existingNumber);

    try {
     await queryRunner.connect();
     await queryRunner.startTransaction();
     const user = await queryRunner.manager.save(
      Users,
      queryRunner.manager.create(Users, {
       number: body.number,
      }),
     );
     const patient = queryRunner.manager.create(Patients, {
      user,
     });
     // ✅ اصلاح: از manager داخل تراکنش استفاده کن
     await queryRunner.manager.delete(OtpCodes, { number: body.number });

     await queryRunner.manager.save(Patients, patient);

     const token = this.createTokens({ id: user.id }, response);
     await queryRunner.commitTransaction();
     response.status(200).json({
      token,
     });
    } catch (e) {
     console.log(e);

     await queryRunner.rollbackTransaction();
     response.sendStatus(500);
    } finally {
     await queryRunner.release();
    }
   } else {
    const token = this.createTokens({ id: existingNumber.id }, response);
    await this.otpCodes.delete({ number: body.number });
    response.status(200).json({
     token,
    });
   }
  } catch (err) {
   console.error(err);

   throw new BadRequestException('خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.');
  }
 }
 async refreshToken(request: Request, response: Response) {
  if (!request.cookies)
   return response
    .status(406)
    .json(new BadRequestException('مشکل در روش ارسال اطلاعات.').getResponse());
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const user_refresh_token = request.cookies['refresh_token'] as
   | string
   | undefined;
  if (!user_refresh_token) throw new UnauthorizedException();
  try {
   this.jwtService.verify(user_refresh_token, {
    secret: process.env.JWT_SECRET,
   });
   const de_user: TokenType = this.jwtService.decode(user_refresh_token);
   const id = de_user?.id;
   const user = await this.users.findOneBy({ id });
   if (!user) throw new NotFoundException();
   return this.createTokens({ id: user.id }, response);
  } catch {
   throw new UnauthorizedException();
  }
 }
}
