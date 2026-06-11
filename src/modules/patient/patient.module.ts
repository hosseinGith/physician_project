import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { Patients } from 'src/modules/patient/entities/patients.entity';
import { UsersModule } from '../users/users.module';
import { PrescriptionsModule } from 'src/modules/prescriptions/prescriptions.module';

@Module({
 imports: [
  TypeOrmModule.forFeature([Patients]),
  forwardRef(() => UsersModule),
  PrescriptionsModule,
 ],
 providers: [PatientService],
 controllers: [PatientController],
 exports: [PatientService],
})
export class PatientModule {}
