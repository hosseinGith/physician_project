import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { Patients } from 'src/entitys/patients.entity';
import { UsersModule } from '../users.module';
import { DoctorModule } from '../doctor/doctor.module';
import { AppointmentsModule } from 'src/modules/appointments/appointments.module';
import { HoursModule } from '../doctor/hours/hours.module';
import { PrescriptionsModule } from 'src/modules/prescriptions/prescriptions.module';

@Module({
 imports: [
  TypeOrmModule.forFeature([Patients]),
  UsersModule,
  DoctorModule,
  AppointmentsModule,
  HoursModule,
  PrescriptionsModule,
 ],
 providers: [PatientService],
 controllers: [PatientController],
 exports: [PatientService],
})
export class PatientModule {}
