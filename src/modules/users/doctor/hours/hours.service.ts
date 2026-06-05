import AddHourDto from './dtos/AddHour.dto';
import { DoctorHours } from 'src/entitys/doctorHours.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import {
 BadRequestException,
 Injectable,
 NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../../users.service';
@Injectable()
export class HoursService {
 constructor(
  @InjectRepository(DoctorHours)
  private readonly doctorHours: Repository<DoctorHours>,
  private readonly user: UsersService,
 ) {}
 async findOne(
  id: string,
  where?: FindOptionsWhere<DoctorHours> | FindOptionsWhere<DoctorHours>[],
  select?: FindOptionsSelect<DoctorHours>,
 ): Promise<DoctorHours> {
  const hour = await this.doctorHours.findOne({
   where: { id, ...where },
   select,
  });
  if (!hour) throw new NotFoundException('Doctor hour not found');
  return hour;
 }

 async findAll() {
  return await this.doctorHours.find();
 }
 async create(body: AddHourDto, userId: string) {
  const user = await this.user.findOne(userId, ['doctor'], {
   doctor: { id: true },
  });
  if (!user) throw new NotFoundException('', 'User');
  const doctor = user.doctor;

  if (!doctor) throw new NotFoundException('', 'Doctor');

  const existing = await this.doctorHours.findOneBy({
   hour: body.hour,
   doctor,
  });
  if (existing)
   throw new BadRequestException(
    'ساعت دیگری را انتخاب کنید. ساعت ارسال شده در دسترس نیست',
   );
  const hour = this.doctorHours.create({
   hour: body.hour,
   doctor,
  });
  await this.doctorHours.save(hour);
  return true;
 }
 async remove(id: string) {
  return Boolean((await this.doctorHours.delete(id)).affected);
 }
}
