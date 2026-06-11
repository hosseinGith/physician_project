import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/modules/users/entities/users.entity';
import { PatientModule } from '../patient/patient.module';
import { DoctorModule } from '../doctor/doctor.module';
import { AuthModule } from './auth/auth.module';

@Module({
 imports: [
  TypeOrmModule.forFeature([Users]),
  forwardRef(() => DoctorModule),
  forwardRef(() => PatientModule),
  forwardRef(() => AuthModule),
 ],
 controllers: [UsersController],
 providers: [UsersService],
 exports: [UsersService],
})
export class UsersModule {}
