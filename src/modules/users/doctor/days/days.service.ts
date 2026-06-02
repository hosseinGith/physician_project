import AddHourDto from './dtos/AddHour.dto';
import { DoctorHours } from 'src/entitys/doctorHours.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
export class DaysService {
 constructor(
  @InjectRepository(DoctorHours)
  private readonly doctorHours: Repository<DoctorHours>,
  @InjectRepository(Doctors)
  private readonly doctors: Repository<Doctors>,
  @InjectRepository(Users)
  private readonly user: Repository<Users>,

  private readonly jwt: JwtService,
 ) {}
 async get(id?: string) {
  return await find<DoctorHours>(this.doctorHours, id, [], ['hour']);
 }
 async add(body: AddHourDto, request: Request) {
  const token = getDataFromUserToken(request);
  if (!token) throw new UnauthorizedException();
  const userId = token.id;
 }
 async delete(id: string) {
  if (typeof id !== 'number') new BadRequestException('id required');
  const existing = await this.doctorHours.findOneBy({ id });
  if (!existing) throw new NotFoundException();

  return Boolean((await this.doctorHours.delete(id)).affected);
 }
}
