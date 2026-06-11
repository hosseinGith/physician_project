import { forwardRef, Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctors } from 'src/modules/doctor/entities/doctors.entity';
import { Specialties } from 'src/modules/doctor/entities/specialties.entity';
import { SpecialtyDoctors } from 'src/modules/doctor/entities/specialtyDoctors.entity';
import { AppointmentsModule } from 'src/modules/appointments/appointments.module';
import { UsersModule } from '../users/users.module';
import { BlockedTimesModule } from './blockedTimes/blockedTimes.module';
@Module({
 imports: [
  TypeOrmModule.forFeature([Doctors, Specialties, SpecialtyDoctors]),
  forwardRef(() => UsersModule),
  forwardRef(() => AppointmentsModule),
  forwardRef(() => BlockedTimesModule),
 ],
 controllers: [DoctorController],
 providers: [DoctorService],
 exports: [DoctorService],
})
export class DoctorModule {}
