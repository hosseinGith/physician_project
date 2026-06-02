import { Module } from '@nestjs/common';
import { DaysController } from './days.controller';
import { DaysService } from './days.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entitys/users.entity';
import { Doctors } from 'src/entitys/doctors.entity';
import { DoctorHours } from 'src/entitys/doctorHours.entity';

@Module({
 imports: [
  TypeOrmModule.forFeature([Users, Doctors, DoctorHours]),
  HoursModule,
 ],

 controllers: [DaysController],
 providers: [DaysService],
})
export class HoursModule {}
