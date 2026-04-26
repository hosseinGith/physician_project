import {
 BadRequestException,
 Injectable,
 NotFoundException,
 UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entitys/users.entity';
import { AccessType, TokenType } from 'src/types';
import { Repository } from 'typeorm';
import ActiveTurn from './dtos/turn.dto';
import { Doctors } from 'src/entitys/doctors.entity';
import { DoctorHours } from 'src/entitys/doctorHours.entity';
import { Appointments } from 'src/entitys/appointments.entity';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Patients } from 'src/entitys/patients.entity';
import getDataFromUserToken from 'src/shared/utils/getDataFromUserToken';

@Injectable()
export class PatientService {
 constructor(
  @InjectRepository(Users)
  private users: Repository<Users>,
  @InjectRepository(Doctors)
  private doctors: Repository<Doctors>,
  @InjectRepository(Patients)
  private patients: Repository<Patients>,
  @InjectRepository(DoctorHours)
  private doctorHours: Repository<DoctorHours>,
  @InjectRepository(Appointments)
  private appointments: Repository<Appointments>,
  private jwt: JwtService,
 ) {}

 async findActiveDoctors() {
  return await this.users.find({
   where: {
    access: AccessType.DOCTOR,
    is_active: true,
   },
   select: ['doctor'],
  });
 }
 // public.service.ts
 async search(q: string, specialty?: string) {
  const queryBuilder = this.users
   .createQueryBuilder('users')
   .leftJoinAndSelect('users.doctor', 'doctor');

  if (q) {
   queryBuilder.andWhere(
    '(users.first_name LIKE :name OR users.last_name LIKE :name)',
    { name: `%${q}%` },
   );
  }

  if (specialty) {
   queryBuilder.andWhere('doctor.specialty = :specialty', { specialty });
  }

  // فقط کاربرانی که دکتر هستند (دکتر دارند)
  queryBuilder.andWhere('doctor.id IS NOT NULL');

  return await queryBuilder.getMany();
 }

 // taking turns
 async activeTurn(body: ActiveTurn, request: Request) {
  const doctor = await this.doctors.findOneBy({ id: body.doctorId });
  if (!doctor)
   return new NotFoundException('دکتر مورد نظر پیدا نشد.', 'Doctor not found');
  const token = request.headers.authorization?.split(' ')[1];
  if (!token) throw new UnauthorizedException();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const de_patient = this.jwt.decode(String(token));

  if (!de_patient) throw new UnauthorizedException();
  const userId = (de_patient as TokenType).id;
  const user = await this.users.findOne({
   where: { id: userId },
   relations: ['patient'],
  });

  if (!user) throw new NotFoundException('کاربر پیدا نشد.', 'User not found');
  if (user.access !== AccessType.PATIENT)
   throw new NotFoundException('شما بیمار نیستید.', 'User not found');

  const patient = await this.patients.findOneBy({ id: user?.patient.id });
  if (!patient)
   throw new NotFoundException('کاربر پیدا نشد.', 'User not found');

  const doctorHour = await this.doctorHours.findOneBy({
   id: body.hourId,
   doctor: { id: doctor.id },
  });
  if (!doctorHour)
   return new NotFoundException(
    'ساعت مورد نظر پیدا نشد.',
    'Doctor hour not found',
   );

  const dateOnly = new Date(body.date).toISOString().split('T')[0];

  const appointment = await this.appointments.findOneBy({
   doctor: { id: doctor.id },
   appointment_date: new Date(dateOnly),
   hour: { id: doctorHour.id },
  });

  if (appointment)
   return new BadRequestException(
    'در ساعت انتخاب شده دکتر وقت آزاد ندارد.لطفا ساعت دیگری انتخاب کنید.',
    'Hour problem',
   );

  const new_appointment = await this.appointments.insert({
   appointment_date: new Date(dateOnly),
   doctor: { id: doctor.id },
   hour: doctorHour,
   patient: { id: patient.id },
  });

  return new_appointment;
 }
 async getUserData(request: Request) {
  const token = getDataFromUserToken(request);
  if (!token) throw new UnauthorizedException();
  const user = await this.users.findOne({
   where: { id: token.id },
   relations: ['patient'],
  });

  if (!user) throw new NotFoundException();
  return user;
 }
}
