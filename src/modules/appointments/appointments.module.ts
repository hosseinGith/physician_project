import { forwardRef, Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { DoctorModule } from '../users/doctor/doctor.module';
import { PatientModule } from '../users/patient/patient.module';
import { Appointments } from 'src/entities/appointments.entity';
import { HoursModule } from '../users/doctor/hours/hours.module';

@Module({
 imports: [
  TypeOrmModule.forFeature([Appointments]),
  PatientModule,
  UsersModule,
  forwardRef(() => DoctorModule),
  HoursModule,
 ],
 controllers: [AppointmentsController],
 providers: [AppointmentsService],
 exports: [AppointmentsService],
})
export class AppointmentsModule {}
