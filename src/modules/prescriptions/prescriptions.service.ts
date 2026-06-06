import {
 BadRequestException,
 Injectable,
 NotFoundException,
} from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { Prescriptions } from 'src/entities/prescriptions.entity';
import { InjectRepository } from '@nestjs/typeorm';
import PrescriptionsDtoAdd from './dtos/prescriptions-add.dto';
import PrescriptionsUpdateDto from './dtos/prescriptions-update.dto';

@Injectable()
export class PrescriptionsService {
 constructor(
  @InjectRepository(Prescriptions)
  private prescriptionsRep: Repository<Prescriptions>,
 ) {}
 async findOne(id: string) {
  const res = await this.prescriptionsRep.findOneBy({ id });
  if (res) return res;
  throw new NotFoundException();
 }
 async findAll(options?: FindManyOptions<Prescriptions>) {
  const res = await this.prescriptionsRep.find(options);
  return res;
 }
 async create(body: PrescriptionsDtoAdd) {
  const prescriptions = await this.prescriptionsRep.save(
   this.prescriptionsRep.create(body),
  );
  return prescriptions;
 }
 async update(id: string, body: PrescriptionsUpdateDto) {
  if (!id) throw new BadRequestException('', 'id');

  const prescriptions = await this.prescriptionsRep.findOneBy({ id });
  const fieldsToUpdate = Object.keys(body).length;

  if (fieldsToUpdate === 0) {
   throw new BadRequestException('هیچ فیلدی برای به‌روزرسانی ارسال نشده است.');
  }

  if (prescriptions)
   return (
    (await this.prescriptionsRep.update({ id: prescriptions.id }, body))
     .affected === 1
   );
  throw new NotFoundException();
 }
 async remove(id: string) {
  const res = await this.prescriptionsRep.delete({ id });
  if (!res.affected) throw new NotFoundException();
  return true;
 }
}
