import { Module } from '@nestjs/common';
import { HoursController } from './hours.controller';
import { HoursService } from './hours.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entitys/users.entity';
import { Doctors } from 'src/entitys/doctors.entity';
import { DoctorHours } from 'src/entitys/doctorHours.entity';

@Module({
 imports: [
  TypeOrmModule.forFeature([Users, Doctors, DoctorHours]),
  HoursModule,
 ],

 controllers: [HoursController],
 providers: [HoursService],
})
export class HoursModule {}
