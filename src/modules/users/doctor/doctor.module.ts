import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entitys/users.entity';
import { Doctors } from 'src/entitys/doctors.entity';
import { DoctorHours } from 'src/entitys/doctorHours.entity';
import { HoursService } from './hours/hours.service';
import { HoursModule } from './hours/hours.module';
import { Patients } from 'src/entitys/patients.entity';
import { Appointments } from 'src/entitys/appointments.entity';
import { Specialties } from 'src/entitys/specialties.entity';
import { SpecialtyDoctors } from 'src/entitys/specialtyDoctors.entity';
import { DatesOfReservedDay } from 'src/entitys/DatesOfReservedDay.entity';

@Module({
 imports: [
  TypeOrmModule.forFeature([
   Users,
   Doctors,
   DoctorHours,
   Patients,
   Appointments,
   Specialties,
   SpecialtyDoctors,
   DatesOfReservedDay,
  ]),
  HoursModule,
 ],
 controllers: [DoctorController],
 providers: [DoctorService, HoursService],
})
export class DoctorModule {}
