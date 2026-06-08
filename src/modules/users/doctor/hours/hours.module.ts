import { Module } from '@nestjs/common';
import { HoursController } from './hours.controller';
import { HoursService } from './hours.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorHours } from 'src/modules/users/doctor/hours/doctorHours.entity';
import { DoctorModule } from '../doctor.module';
import { UsersModule } from '../../users.module';

@Module({
 imports: [TypeOrmModule.forFeature([DoctorHours]), DoctorModule, UsersModule],

 controllers: [HoursController],
 providers: [HoursService],
 exports: [HoursService],
})
export class HoursModule {}
