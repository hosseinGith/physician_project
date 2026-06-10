import { forwardRef, Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { DoctorModule } from '../users/doctor/doctor.module';
import { PatientModule } from '../users/patient/patient.module';
import { Appointments } from 'src/modules/appointments/appointments.entity';

@Module({
 imports: [
  TypeOrmModule.forFeature([Appointments]),
  forwardRef(() => PatientModule),

  forwardRef(() => UsersModule),
  forwardRef(() => DoctorModule),
 ],
 controllers: [AppointmentsController],
 providers: [AppointmentsService],
 exports: [AppointmentsService],
})
export class AppointmentsModule {}
