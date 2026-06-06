import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { OtpCodes } from 'src/entities/otpCodes.entity';
import { CryptoHash } from 'src/shared/utils/cryptoHash.service';
import { UsersModule } from '../users/users.module';

@Module({
 imports: [TypeOrmModule.forFeature([OtpCodes]), UsersModule],
 controllers: [AuthController],
 providers: [AuthService, CryptoHash],
 exports: [AuthService],
})
export class AuthModule {}
