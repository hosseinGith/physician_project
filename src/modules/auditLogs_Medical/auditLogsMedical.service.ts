import {
 BadRequestException,
 Injectable,
 NotFoundException,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { AuditLogsMedical } from 'src/entitys/auditLogsMedical.entity';
import { InjectRepository } from '@nestjs/typeorm';
import AuditLogsMedicalDtoAdd from './dtos/auditLogsMedical-add.dto';
import { PatientService } from '../users/patient/patient.service';

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
 async create(body: AuditLogsMedicalDtoAdd) {
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
 async update(id: string, body: AuditLogsMedicalDtoAdd) {
  if (!id) throw new BadRequestException('', 'id');

  const auditLogsMedicalRep = await this.AuditLogsMedicalRep.findOneBy({
   id,
  });
  const fieldsToUpdate = Object.keys(body).length;

  if (fieldsToUpdate === 0) {
   throw new BadRequestException('هیچ فیلدی برای به‌روزرسانی ارسال نشده است.');
  }
  const patient = await this.patients.findOne(body.patientId);
  if (!patient) throw new NotFoundException();
  if (auditLogsMedicalRep)
   return (
    (
     await this.AuditLogsMedicalRep.update(
      { id: auditLogsMedicalRep.id },
      { ...{ ...body, patientId: undefined }, patient },
     )
    ).affected === 1
   );
  throw new NotFoundException();
 }
 async delete(id: string) {
  if (!id) throw new BadRequestException('id not found', 'id');
  const res = await this.AuditLogsMedicalRep.delete({ id });
  if (!res.affected) throw new NotFoundException();
  return true;
 }
}
