import {
 BadRequestException,
 Injectable,
 NotFoundException,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { AuditLogs_Medical } from 'src/entitys/auditLogs_Medical.entity';
import { InjectRepository } from '@nestjs/typeorm';
import AuditLogs_MedicalDtoAdd from './dtos/auditLogs_Medical-add.dto';
import { Patients } from 'src/entitys/patients.entity';

@Injectable()
export class AuditLogs_MedicalService {
 constructor(
  @InjectRepository(AuditLogs_Medical)
  private AuditLogs_MedicalRep: Repository<AuditLogs_Medical>,
  @InjectRepository(Patients)
  private patients: Repository<Patients>,
 ) {}
 async get(id?: string) {
  if (!Number.isNaN(id)) {
   return await this.AuditLogs_MedicalRep.findOneBy({ id });
  }
  return await this.AuditLogs_MedicalRep.find();
 }
 async add(body: AuditLogs_MedicalDtoAdd) {
  const patient = await this.patients.findOneBy({ id: body.patientId });
  if (!patient) throw new NotFoundException();

  const create_status = this.AuditLogs_MedicalRep.create({
   ...{ ...body, patientId: undefined },
   patient,
  });
  const auditLogs_MedicalRep =
   await this.AuditLogs_MedicalRep.save(create_status);
  return auditLogs_MedicalRep;
 }
 async update(id: string, body: AuditLogs_MedicalDtoAdd) {
  if (!id) throw new BadRequestException('', 'id');

  const auditLogs_MedicalRep = await this.AuditLogs_MedicalRep.findOneBy({
   id,
  });
  const fieldsToUpdate = Object.keys(body).length;

  if (fieldsToUpdate === 0) {
   throw new BadRequestException('هیچ فیلدی برای به‌روزرسانی ارسال نشده است.');
  }
  const patient = await this.patients.findOneBy({ id: body.patientId });
  if (!patient) throw new NotFoundException();
  if (auditLogs_MedicalRep)
   return (
    (
     await this.AuditLogs_MedicalRep.update(
      { id: auditLogs_MedicalRep.id },
      { ...{ ...body, patientId: undefined }, patient },
     )
    ).affected === 1
   );
  throw new NotFoundException();
 }
 async delete(id: string) {
  if (!id) throw new BadRequestException('id not found', 'id');
  const res = await this.AuditLogs_MedicalRep.delete({ id });
  if (!res.affected) throw new NotFoundException();
  return true;
 }
}
