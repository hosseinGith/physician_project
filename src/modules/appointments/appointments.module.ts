import { forwardRef, Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './services/appointments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { DoctorModule } from '../doctor/doctor.module';
import { PatientModule } from '../patient/patient.module';
import { Appointments } from 'src/modules/appointments/entities/appointments.entity';

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
