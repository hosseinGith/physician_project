import { Module } from '@nestjs/common';
import { HoursController } from './hours.controller';
import { HoursService } from './hours.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/modules/users/users.entity';
import { Doctors } from 'src/modules/users/doctor/doctors.entity';
import { DoctorHours } from 'src/modules/users/doctor/hours/doctorHours.entity';

@Module({
 imports: [
  TypeOrmModule.forFeature([Users, Doctors, DoctorHours]),
  HoursModule,
 ],

 controllers: [HoursController],
 providers: [HoursService],
})
export class HoursModule {}
