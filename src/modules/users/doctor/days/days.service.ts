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
 //  async get(id?: string) {
 //   return await this
 //  }
 create(body: AddHourDto, userId: string) {}
 async delete(id: string) {
  if (typeof id !== 'number') new BadRequestException('id required');
  const existing = await this.doctorHours.findOneBy({ id });
  if (!existing) throw new NotFoundException();

  return Boolean((await this.doctorHours.delete(id)).affected);
 }
}
