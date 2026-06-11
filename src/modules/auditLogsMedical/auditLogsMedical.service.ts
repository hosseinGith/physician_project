import { Injectable, NotFoundException } from '@nestjs/common';

import { Repository } from 'typeorm';
import { AuditLogsMedical } from 'src/modules/auditLogsMedical/entities/auditLogsMedical.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientService } from '../patient/patient.service';
import AuditLogsMedicalCreateDto from './dto/create.dto';

@Injectable()
export class AuditLogsMedicalService {
 constructor(
  @InjectRepository(AuditLogsMedical)
  private AuditLogsMedicalRep: Repository<AuditLogsMedical>,
  private patients: PatientService,
 ) {}
 async findOne(id: string) {
  const AuditLogsMedicalRep = await this.AuditLogsMedicalRep.findOneBy({
   id,
  });
  if (!AuditLogsMedicalRep) throw new NotFoundException();
  return AuditLogsMedicalRep;
 }
 async findAll() {
  return await this.AuditLogsMedicalRep.find();
 }
 async create(body: AuditLogsMedicalCreateDto) {
  const patient = await this.patients.findOne(body.patientId);
  if (!patient) throw new NotFoundException();

  const create_status = this.AuditLogsMedicalRep.create({
   ...{ ...body, patientId: undefined },
   patient,
  });
  const auditLogsMedicalRep =
   await this.AuditLogsMedicalRep.save(create_status);
  return auditLogsMedicalRep;
 }
 
}
