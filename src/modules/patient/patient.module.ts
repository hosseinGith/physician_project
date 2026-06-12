import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientController } from './patient.controller';
import { PatientService } from './services/patient.service';
import { Patients } from 'src/modules/patient/entities/patients.entity';
import { UsersModule } from '../users/users.module';
import { PrescriptionsModule } from 'src/modules/prescriptions/prescriptions.module';
import { PatientAppointmentService } from './services/patient-appointments.service';
import { Appointments } from '../appointments/entities/appointments.entity';

@Module({
 imports: [
  TypeOrmModule.forFeature([Patients]),
  forwardRef(() => UsersModule),
  Appointments,

  PrescriptionsModule,
 ],
 providers: [PatientService, PatientAppointmentService],
 controllers: [PatientController],
 exports: [PatientService],
})
export class PatientModule {}
