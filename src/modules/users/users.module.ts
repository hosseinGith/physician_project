import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entitys/users.entity';
import { PatientController } from './patient/patient.controller';
import { PatientService } from './patient/patient.service';
import { PatientModule } from './patient/patient.module';
import { Doctors } from 'src/entitys/doctors.entity';
import { Patients } from 'src/entitys/patients.entity';
import { DoctorHours } from 'src/entitys/doctorHours.entity';
import { Appointments } from 'src/entitys/appointments.entity';
import { DoctorModule } from './doctor/doctor.module';
import { DoctorService } from './doctor/doctor.service';
import { DoctorController } from './doctor/doctor.controller';
import { Prescriptions } from 'src/entitys/prescriptions.entity';

@Module({
 imports: [
  TypeOrmModule.forFeature([
   Users,
   Doctors,
   Patients,
   DoctorHours,
   Appointments,
   Prescriptions,
  ]),
  PatientModule,
  DoctorModule,
 ],
 controllers: [UsersController, PatientController, DoctorController],
 providers: [UsersService, PatientService, DoctorService],
})
export class UsersModule {}
