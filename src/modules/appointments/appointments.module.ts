import { forwardRef, Module } from '@nestjs/common';
import { AppointmentsController } from './controllers/appointments.controller';
import { AppointmentsService } from './services/appointments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { DoctorModule } from '../doctor/doctor.module';
import { PatientModule } from '../patient/patient.module';
import { Appointments } from 'src/modules/appointments/entities/appointments.entity';
import { DoctorsAppointmentController } from './controllers/doctors-appointments.controller';
import { DoctorsAppointmentService } from './services/doctors-appointments.service';

@Module({
 imports: [
  TypeOrmModule.forFeature([Appointments]),
  forwardRef(() => PatientModule),
  forwardRef(() => UsersModule),
  forwardRef(() => DoctorModule),
 ],
 controllers: [AppointmentsController, DoctorsAppointmentController],
 providers: [AppointmentsService, DoctorsAppointmentService],
 exports: [AppointmentsService],
})
export class AppointmentsModule {}
