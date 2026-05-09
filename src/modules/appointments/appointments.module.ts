import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointments } from 'src/entitys/appointments.entity';
import { Users } from 'src/entitys/users.entity';
import { Doctors } from 'src/entitys/doctors.entity';
import { Patients } from 'src/entitys/patients.entity';
import { DoctorHours } from 'src/entitys/doctorHours.entity';
import { ChatRequests } from 'src/entitys/chatRequests.entity';

@Module({
 imports: [
  TypeOrmModule.forFeature([
   Appointments,
   Users,
   Doctors,
   Patients,
   ChatRequests,
   DoctorHours,
  ]),
 ],
 controllers: [AppointmentsController],
 providers: [AppointmentsService],
})
export class AppointmentsModule {}
