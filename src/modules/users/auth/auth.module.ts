import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { OtpCodes } from './entities/otpCodes.entity';
import { CryptoHash } from 'src/shared/utils/cryptoHash.service';
import { UsersModule } from '../../users/users.module';

@Module({
 imports: [TypeOrmModule.forFeature([OtpCodes]), forwardRef(() => UsersModule)],
 controllers: [AuthController],
 providers: [AuthService, CryptoHash],
 exports: [AuthService],
})
export class AuthModule {}
