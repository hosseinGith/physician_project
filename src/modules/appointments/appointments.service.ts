import {
 BadRequestException,
 ConflictException,
 Injectable,
 NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, QueryFailedError, Repository } from 'typeorm';
import { Appointments } from 'src/entitys/appointments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import AppointmentsDtoAdd from './dtos/appointments-add.dto';

@Injectable()
export class AppointmentsService {
 constructor(
  @InjectRepository(Appointments)
  private AppointmentsRep: Repository<Appointments>,
 ) {}
 async get(id?: number) {
  let res:
   | FindOptionsWhere<Appointments>
   | FindOptionsWhere<Appointments>[]
   | null;
  if (!Number.isNaN(id)) {
   res = await this.AppointmentsRep.findOneBy({ id });
  } else res = await this.AppointmentsRep.find();
  if (res) return res;
  throw new NotFoundException();
 }
 async add(body: AppointmentsDtoAdd) {
  const create_status = this.AppointmentsRep.create(body);
  const appointments = await this.AppointmentsRep.save(create_status);
  return appointments;
 }
 async update(id: number, body: AppointmentsDtoAdd) {
  try {
   if (!id) throw new BadRequestException('', 'id');

   const user = await this.AppointmentsRep.findOneBy({ id });
   const fieldsToUpdate = Object.keys(body).length;

   if (fieldsToUpdate === 0) {
    throw new BadRequestException('هیچ فیلدی برای به‌روزرسانی ارسال نشده است.');
   }

   if (user)
    return (
     (await this.AppointmentsRep.update({ id: user.id }, body)).affected === 1
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
     'username',
    );
   } else {
    throw error;
   }
  }
 }
 async delete(id: number) {
  if (!id) throw new BadRequestException('id not found', 'id');
  const res = await this.AppointmentsRep.delete({ id });
  if (!res.affected) throw new NotFoundException();
  return true;
 }
}
