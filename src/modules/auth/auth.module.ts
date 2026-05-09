import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entitys/users.entity';
import { Doctors } from 'src/entitys/doctors.entity';
import { Patients } from 'src/entitys/patients.entity';
import { AuthService } from './auth.service';
import { OtpCodes } from 'src/entitys/otpCodes.entity';
import { CryptoHash } from 'src/shared/utils/cryptoHash.service';
import { ChatRequests } from 'src/entitys/chatRequests.entity';

@Module({
 imports: [
  TypeOrmModule.forFeature([Users, Patients, ChatRequests, Doctors, OtpCodes]),
 ],
 controllers: [AuthController],
 providers: [AuthService, CryptoHash],
})
export class AuthModule {}
