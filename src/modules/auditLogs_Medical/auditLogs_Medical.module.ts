import { Module } from '@nestjs/common';
import { AuditLogs_MedicalController } from './auditLogs_Medical.controller';
import { AuditLogs_MedicalService } from './auditLogs_Medical.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entitys/users.entity';
import { AuditLogs_Medical } from 'src/entitys/auditLogs_Medical.entity';
import { Patients } from 'src/entitys/patients.entity';

@Module({
 imports: [TypeOrmModule.forFeature([AuditLogs_Medical, Users, Patients])],
 controllers: [AuditLogs_MedicalController],
 providers: [AuditLogs_MedicalService],
})
export class AuditLogs_MedicalModule {}
