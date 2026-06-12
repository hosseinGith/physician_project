import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientController } from './patient.controller';
import { PatientService } from './services/patient.service';
import { Patients } from 'src/modules/patient/entities/patients.entity';
import { UsersModule } from '../users/users.module';
import { PrescriptionsModule } from 'src/modules/prescriptions/prescriptions.module';
import { PatientAppointmentService } from './services/patient-appointments.service';
import { DoctorModule } from '../doctor/doctor.module';
import { AppointmentsModule } from '../appointments/appointments.module';
import { AuditLogsModule } from '../auditLogs/auditLogs.module';

@Module({
 imports: [
  TypeOrmModule.forFeature([Patients]),
  forwardRef(() => UsersModule),
  forwardRef(() => DoctorModule),
  forwardRef(() => AppointmentsModule),
  AuditLogsModule,

  PrescriptionsModule,
 ],
 providers: [PatientService, PatientAppointmentService],
 controllers: [PatientController],
 exports: [PatientService],
})
export class PatientModule {}
