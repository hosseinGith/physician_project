import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entitys/users.entity';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { Patients } from 'src/entitys/patients.entity';
import { Doctors } from 'src/entitys/doctors.entity';
import { Appointments } from 'src/entitys/appointments.entity';
import { DoctorHours } from 'src/entitys/doctorHours.entity';
import { Prescriptions } from 'src/entitys/prescriptions.entity';
import { ChatRequests } from 'src/entitys/chatRequests.entity';

@Module({
 imports: [
  TypeOrmModule.forFeature([
   Users,
   Patients,ChatRequests,
   Doctors,
   Appointments,
   DoctorHours,
   Prescriptions,
  ]),
 ],
 providers: [PatientService],
 controllers: [PatientController],
})
export class PatientModule {}
