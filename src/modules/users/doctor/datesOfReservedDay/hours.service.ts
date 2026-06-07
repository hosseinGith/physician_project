import AddHourDto from './dtos/AddHour.dto';
import { DoctorHours } from 'src/entities/doctorHours.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Doctors } from 'src/entities/doctors.entity';
import {
 BadRequestException,
 Injectable,
 NotFoundException,
} from '@nestjs/common';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class HoursService {
 constructor(
  @InjectRepository(DoctorHours)
  private readonly doctorHours: Repository<DoctorHours>,
  @InjectRepository(Doctors)
  private readonly doctors: Repository<Doctors>,
  @InjectRepository(Users)
  private readonly user: Repository<Users>,

  private readonly jwt: JwtService,
 ) {}
 //  async get(id?: string) {
 //   return await find<DoctorHours>(this.doctorHours, id, [], ['hour']);
 //  }
 async create(body: AddHourDto, userId: string) {
  const user = await this.user.findOne({
   where: {
    id: userId,
   },
   select: {
    doctor: { id: true },
   },
   relations: ['doctor'],
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
 async delete(id: string) {
  if (typeof id !== 'number') new BadRequestException('id required');
  const existing = await this.doctorHours.findOneBy({ id });
  if (!existing) throw new NotFoundException();

  return Boolean((await this.doctorHours.delete(id)).affected);
 }
}
