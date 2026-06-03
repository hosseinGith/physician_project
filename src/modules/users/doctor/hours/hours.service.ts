import AddHourDto from './dtos/AddHour.dto';
import { DoctorHours } from 'src/entitys/doctorHours.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Doctors } from 'src/entitys/doctors.entity';
import {
 BadRequestException,
 Injectable,
 NotFoundException,
 UnauthorizedException,
} from '@nestjs/common';
import find from 'src/shared/utils/find';
import { Users } from 'src/entitys/users.entity';
import getDataFromUserToken from 'src/shared/utils/getDataFromUserToken';

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
 async get(id?: string) {
  return await find<DoctorHours>(this.doctorHours, id, [], ['hour']);
 }
 async add(body: AddHourDto, request: Request) {
  const token = getDataFromUserToken(request);
  if (!token) throw new UnauthorizedException();
  const userId = token.id;
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
