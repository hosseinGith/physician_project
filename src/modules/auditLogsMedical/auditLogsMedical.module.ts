import { Module } from '@nestjs/common';
import { AuditLogsMedicalController } from './auditLogsMedical.controller';
import { AuditLogsMedicalService } from './auditLogsMedical.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogsMedical } from 'src/modules/auditLogsMedical/auditLogsMedical.entity';
import { UsersModule } from '../users/users.module';
import { PatientModule } from '../users/patient/patient.module';

@Module({
 imports: [
  TypeOrmModule.forFeature([AuditLogsMedical]),
  UsersModule,
  PatientModule,
 ],
 controllers: [AuditLogsMedicalController],
 providers: [AuditLogsMedicalService],
 exports: [AuditLogsMedicalService],
})
export class AuditLogsMedicalModule {}
