import {
 Injectable,
 BadRequestException,
 NotFoundException,
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
    delta < Number(process.env.OTP_code_time_expire_sec || baseTimeOtpExpire)
   ) {
    throw new BadRequestException(
     `کد ارسال شده است . لطفا بعد ${(Number(process.env.OTP_code_time_expire_sec || baseTimeOtpExpire) - delta).toFixed(0)} ثانیه دوباره تلاش کنید.`,
    );
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
   return code;
  } catch {
   throw new BadRequestException('مشکل در سیستم');
  }
 }

 async verify_otp_code(body: LoginDto) {
  const otp = await this.otpCodes.findOneBy({ number: body.number });
  if (!otp?.code) throw new NotFoundException();
  if (otp.code !== body.code) {
   if (otp) {
    await this.otpCodes.delete({ number: body.number });
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
   Number(process.env.OTP_code_time_expire_sec || baseTimeOtpExpire)
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
    const user = this.users.create({
     number: body.number,
    });
    const savedUser = await this.users.save(user);
    const token = this.jwtService.sign({
     id: savedUser.id,
     number: body.number,
    });
    await this.otpCodes.delete({ number: body.number });

    return {
     token,
     user: {
      id: savedUser.id,
      number: body.number,
     },
    };
   } else {
    const token = this.jwtService.sign({
     id: existingNumber.id,
     number: existingNumber.number,
    });
    await this.otpCodes.delete({ number: body.number });

    return {
     token,
    };
   }
  } catch (err) {
   console.error(err);

   throw new BadRequestException('خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.');
  }
 }
}
