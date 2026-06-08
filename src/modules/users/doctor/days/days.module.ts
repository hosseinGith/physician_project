import { Module } from '@nestjs/common';
import { DaysController } from './days.controller';
import { DaysService } from './days.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/modules/users/users.entity';
import { Doctors } from 'src/modules/users/doctor/doctors.entity';
import { DoctorHours } from 'src/modules/users/doctor/hours/doctorHours.entity';

@Module({
 imports: [
  TypeOrmModule.forFeature([Users, Doctors, DoctorHours]),
  HoursModule,
 ],

 controllers: [DaysController],
 providers: [DaysService],
})
export class HoursModule {}
