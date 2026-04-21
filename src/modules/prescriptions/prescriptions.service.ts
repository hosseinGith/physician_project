import {
 BadRequestException,
 Injectable,
 NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Prescriptions } from 'src/entitys/prescriptions.entity';
import { InjectRepository } from '@nestjs/typeorm';
import PrescriptionsDtoAdd from './dtos/prescriptions-add.dto';
import PrescriptionsUpdateDto from './dtos/prescriptions-update.dto';

@Injectable()
export class PrescriptionsService {
 constructor(
  @InjectRepository(Prescriptions)
  private PrescriptionsRep: Repository<Prescriptions>,
 ) {}
 async get(id?: number) {
  let res:
   | FindOptionsWhere<Prescriptions>
   | FindOptionsWhere<Prescriptions>[]
   | null;
  if (!Number.isNaN(id)) {
   res = await this.PrescriptionsRep.findOneBy({ id });
  } else res = await this.PrescriptionsRep.find();
  if (res) return res;
  throw new NotFoundException();
 }
 async add(body: PrescriptionsDtoAdd) {
  const create_status = this.PrescriptionsRep.create(body);
  const prescriptions = await this.PrescriptionsRep.save(create_status);
  return prescriptions;
 }
 async update(id: number, body: PrescriptionsUpdateDto) {
  if (!id) throw new BadRequestException('', 'id');

  const prescriptions = await this.PrescriptionsRep.findOneBy({ id });
  const fieldsToUpdate = Object.keys(body).length;

  if (fieldsToUpdate === 0) {
   throw new BadRequestException('هیچ فیلدی برای به‌روزرسانی ارسال نشده است.');
  }

  if (prescriptions)
   return (
    (await this.PrescriptionsRep.update({ id: prescriptions.id }, body))
     .affected === 1
   );
  throw new NotFoundException();
 }
 async delete(id: number) {
  if (!id) throw new BadRequestException('id not found', 'id');
  const res = await this.PrescriptionsRep.delete({ id });
  if (!res.affected) throw new NotFoundException();
  return true;
 }
}
