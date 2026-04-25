import {
 BadRequestException,
 Injectable,
 NotFoundException,
 UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctors } from 'src/entitys/doctors.entity';
import AddDoctorDto from './dtos/add.dto';
import find from 'src/shared/utils/find';
import type { Request } from 'express';
import getDataFromUserToken from 'src/shared/utils/getDataFromUserToken';
import { Users } from 'src/entitys/users.entity';

@Injectable()
export class DoctorService {
 constructor(
  @InjectRepository(Doctors)
  private readonly doctors: Repository<Doctors>,
  @InjectRepository(Users)
  private readonly users: Repository<Users>,
 ) {}

 async get(id?: number) {
  return await find<Doctors>(this.doctors, id, ['doctorHours']);
 }
 async getUserData(request: Request) {
  const token = getDataFromUserToken(request);
  if (!token) throw new UnauthorizedException();
  const user = await this.users.findOne({
   where: { id: token.id },
   select: ['doctor'],
  });
  if (!user) throw new NotFoundException();
  return user;
 }

 async update(id: number, body: AddDoctorDto) {
  if (!id) throw new BadRequestException('', 'id');

  const doctor = await this.doctors.findOneBy({ id });
  const fieldsToUpdate = Object.keys(body).length;

  if (fieldsToUpdate === 0) {
   throw new BadRequestException('هیچ فیلدی برای به‌روزرسانی ارسال نشده است.');
  }

  if (doctor)
   return (await this.doctors.update({ id: doctor.id }, body)).affected === 1;
  else throw new NotFoundException();
 }
}
