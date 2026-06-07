import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { Patients } from 'src/entities/patients.entity';
import { UsersModule } from '../users.module';
import { PrescriptionsModule } from 'src/modules/prescriptions/prescriptions.module';

@Module({
 imports: [
  TypeOrmModule.forFeature([Patients]),
  UsersModule,
  PrescriptionsModule,
 ],
 providers: [PatientService],
 controllers: [PatientController],
 exports: [PatientService],
})
export class PatientModule {}
