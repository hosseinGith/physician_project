import { Injectable, NotFoundException } from '@nestjs/common';

import { Repository } from 'typeorm';
import { AuditLogs } from 'src/modules/auditLogs/entities/auditLogs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientService } from '../patient/patient.service';
import AuditLogsCreateDto from './dto/create.dto';

@Injectable()
export class AuditLogsService {
 constructor(
  @InjectRepository(AuditLogs)
  private AuditLogsRep: Repository<AuditLogs>,
  private patients: PatientService,
 ) {}
 async findOne(id: string) {
  const AuditLogsRep = await this.AuditLogsRep.findOneBy({
   id,
  });
  if (!AuditLogsRep) throw new NotFoundException();
  return AuditLogsRep;
 }
 async findAll() {
  return await this.AuditLogsRep.find();
 }
 async create(patientId: string, body: AuditLogsCreateDto) {
  const create_status = this.AuditLogsRep.create({
   ...body,
  });
  const auditLogsRep =
   await this.AuditLogsRep.save(create_status);
  return auditLogsRep;
 }
}
