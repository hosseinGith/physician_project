import { forwardRef, Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctors } from 'src/entitys/doctors.entity';
import { Specialties } from 'src/entitys/specialties.entity';
import { SpecialtyDoctors } from 'src/entitys/specialtyDoctors.entity';
import { AppointmentsModule } from 'src/modules/appointments/appointments.module';
import { UsersModule } from '../users.module';
import { AppointmentsService } from 'src/modules/appointments/appointments.service';
console.log(AppointmentsModule);
@Module({
 imports: [
  TypeOrmModule.forFeature([Doctors, Specialties, SpecialtyDoctors]),
  UsersModule,
  forwardRef(() => AppointmentsModule),
 ],
 controllers: [DoctorController],
 providers: [DoctorService],
 exports: [DoctorService],
})
export class DoctorModule {}
