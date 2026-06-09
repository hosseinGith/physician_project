import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/modules/users/users.entity';
import { PatientModule } from './patient/patient.module';
import { DoctorModule } from './doctor/doctor.module';

@Module({
 imports: [TypeOrmModule.forFeature([Users]), DoctorModule, PatientModule],
 controllers: [UsersController],
 providers: [UsersService],
 exports: [UsersService],
})
export class UsersModule {}
