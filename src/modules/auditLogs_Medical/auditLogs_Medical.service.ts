import {
 BadRequestException,
 ConflictException,
 Injectable,
 NotFoundException,
} from '@nestjs/common';

import { QueryFailedError, Repository } from 'typeorm';
import { AuditLogs_Medical } from 'src/entitys/auditLogs_Medical.entity';
import { InjectRepository } from '@nestjs/typeorm';
import AuditLogs_MedicalDtoAdd from './dtos/auditLogs_Medical-add.dto';

@Injectable()
export class AuditLogs_MedicalService {
 constructor(
  @InjectRepository(AuditLogs_Medical)
  private AuditLogs_MedicalRep: Repository<AuditLogs_Medical>,
 ) {}
 async get(id?: string) {
  if (!Number.isNaN(id)) {
   return await this.AuditLogs_MedicalRep.findOneBy({ id });
  }
  return await this.AuditLogs_MedicalRep.find();
 }
 async add(body: AuditLogs_MedicalDtoAdd) {
  try {
   const create_status = this.AuditLogs_MedicalRep.create(body);
   const user = await this.AuditLogs_MedicalRep.save(create_status);
   return user;
  } catch (error) {
   if (
    error instanceof QueryFailedError &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    error.driverError?.code === 'ER_DUP_ENTRY'
   ) {
    throw new ConflictException(
     'این نام کاربری قبلاً استفاده شده است. لطفاً نام کاربری دیگری انتخاب کنید.',
     'number',
    );
   } else {
    throw error;
   }
  }
 }
 async update(id: string, body: AuditLogs_MedicalDtoAdd) {
  try {
   if (!id) throw new BadRequestException('', 'id');

   const user = await this.AuditLogs_MedicalRep.findOneBy({ id });
   const fieldsToUpdate = Object.keys(body).length;

   if (fieldsToUpdate === 0) {
    throw new BadRequestException('هیچ فیلدی برای به‌روزرسانی ارسال نشده است.');
   }
   if (user)
    return (
     (await this.AuditLogs_MedicalRep.update({ id: user.id }, body))
      .affected === 1
    );
   throw new NotFoundException();
  } catch (error) {
   if (
    error instanceof QueryFailedError &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    error.driverError?.code === 'ER_DUP_ENTRY'
   ) {
    throw new ConflictException(
     'این نام کاربری قبلاً استفاده شده است. لطفاً نام کاربری دیگری انتخاب کنید.',
     'number',
    );
   } else {
    throw error;
   }
  }
 }
 async delete(id: string) {
  if (!id) throw new BadRequestException('id not found', 'id');
  const res = await this.AuditLogs_MedicalRep.delete({ id });
  if (!res.affected) throw new NotFoundException();
  return true;
 }
}
