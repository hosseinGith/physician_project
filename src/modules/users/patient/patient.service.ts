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
import PatientUpdateDto from './dtos/update.dto';
import {
 Prescriptions,
 StatusPrescriptions,
} from 'src/entitys/prescriptions.entity';
import { SortedByEnum } from './types';
import { Specialties } from 'src/entitys/specialties.entity';

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
  @InjectRepository(Prescriptions)
  private prescriptions: Repository<Prescriptions>,
  private jwt: JwtService,
 ) {}
 async searchInPatientPrescriptions(request: Request) {
  const token = request.headers.authorization?.split(' ')[1];
  if (!token) throw new UnauthorizedException();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const de_patient = this.jwt.decode(String(token));

  if (!de_patient) throw new UnauthorizedException();
  const userId = (de_patient as TokenType).id;
  return await this.prescriptions.find({
   where: {
    patient: {
     user: { id: userId },
    },
   },
   relations: ['patient'],
   select: {
    // doctor: {
    //  user: {
    //   first_name: true,
    //   last_name: true,
    //  },
    //  id: true,
    //  bio: true,
    //  consultation_fee: true,
    //  specialty: true,
    // },
    diagnosis: true,
    doctor_digital_signature: true,
    id: true,
    issue_date: true,
    medications: true,
    status: true,
    valid_until: true,
   },
  });
 }
 async getPatientPrescriptions(
  request: Request,
  q: string,
  status: StatusPrescriptions | undefined,
  sortedBy: SortedByEnum | undefined,
 ) {
  const token = request.headers.authorization?.split(' ')[1];
  if (!token) throw new UnauthorizedException();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const de_patient = this.jwt.decode(String(token));

  if (!de_patient) throw new UnauthorizedException();
  const userId = (de_patient as TokenType).id;
  return await this.prescriptions.find({
   order: {
    created_at: sortedBy
     ? sortedBy === SortedByEnum.OLDER
       ? 'ASC'
       : 'DESC'
     : undefined,
   },
   where: {
    status,
    patient: {
     user: { id: userId },
    },
   },
   relations: ['patient'],
   select: {
    // doctor: {
    //  user: {
    //   first_name: true,
    //   last_name: true,
    //  },
    //  id: true,
    //  bio: true,
    //  consultation_fee: true,
    //  specialty: true,
    // },
    diagnosis: true,
    doctor_digital_signature: true,
    id: true,
    issue_date: true,
    medications: true,
    status: true,
    valid_until: true,
   },
  });
 }

 async findActiveDoctors() {
  return await this.users.find({
   where: {
    access: AccessType.DOCTOR,
    is_active: true,
   },
   relations: ['doctor'],
   select: {
    access: true,
    doctor: {
     id: true,
     bio: true,
     consultation_fee: true,
     specialties: true,
    },
   },
  });
 }
 // public.service.ts
 async search(q: string, specialty?: string) {
  const queryBuilder = this.users
   .createQueryBuilder('users')
   .leftJoinAndSelect('users.doctor', 'doctor')
   .select(['first_name', 'specialty']);

  if (q) {
   queryBuilder.andWhere(
    '(users.first_name LIKE :name OR users.last_name LIKE :name)',
    { name: `%${q}%` },
   );
  }

  if (specialty) {
   queryBuilder.andWhere('doctor.specialty = :specialty', { Specialties });
  }

  // فقط کاربرانی که دکتر هستند (دکتر دارند)
  queryBuilder.andWhere('doctor.id IS NOT NULL');

  return await queryBuilder.getMany();
 }
 async getDoctorForAppointments(id: string) {
  const user = await this.users
   .createQueryBuilder('user')
   .leftJoinAndSelect('user.doctor', 'doctor')
   .leftJoinAndSelect('doctor.doctorHours', 'doctorHours')
   .leftJoin('doctor.rates', 'rates')
   .where('user.id = :id', { id })
   .andWhere('user.is_active = :is_active', { is_active: true })
   .select([
    'user.first_name',
    'user.last_name',
    'user.access',
    'doctor.consultation_fee',
    'doctor.bio',
    'doctor.medical_license_number',
    'doctor.specialty',
    'doctorHours.id',
    'doctorHours.hour',
   ])
   .addSelect('COALESCE(AVG(rates.rate), 0)', 'averageRate')
   .groupBy('user.id, doctor.id, doctorHours.id')
   .getOne();
  if (!user) throw new NotFoundException();
  return user;
 }
 // taking turns
 async appointment(body: ActiveTurn, request: Request) {
  const doctor = await this.doctors.findOneBy({ id: body.doctorId });
  if (!doctor)
   throw new NotFoundException('دکتر مورد نظر پیدا نشد.', 'Doctor not found');
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

  const patient = user?.patient;
  if (!patient)
   throw new NotFoundException('کاربر پیدا نشد.', 'User not found');

  const doctorHour = await this.doctorHours.findOneBy({
   id: body.hourId,
   doctor: { id: doctor.id },
  });
  if (!doctorHour)
   throw new NotFoundException(
    'ساعت مورد نظر پیدا نشد.',
    'Doctor hour not found',
   );

  const dateOnly_string = new Date(body.date).toISOString().split('T')[0];
  const dateOnly = new Date(dateOnly_string);
  dateOnly.setHours(0, 0, 0, 0);
  const appointment = await this.appointments.findOneBy({
   doctor: { id: doctor.id },
   appointment_date: dateOnly,
   hour: { id: doctorHour.id },
  });

  if (appointment)
   throw new BadRequestException(
    'در ساعت انتخاب شده دکتر وقت آزاد ندارد.لطفا ساعت دیگری انتخاب کنید.',
   );

  const save_appointment = this.appointments.create({
   appointment_date: dateOnly,
   doctor: { id: doctor.id },
   hour: doctorHour,
   patient: { id: patient.id },
  });
  const new_appointment = this.appointments.save(save_appointment);
  return Boolean(new_appointment);
 }
 async get_appointments(request: Request) {
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

  const appointment = await this.appointments.find({
   where: {
    patient: { id: user?.patient.id },
   },
   select: {
    id: true,
    appointment_date: true,
    created_at: true,
    doctor: {
     bio: true,
     consultation_fee: true,
     id: true,
     medical_license_number: true,
     specialties: true,
    },
    hour: { hour: true },
    prescriptions: {
     diagnosis: true,
     doctor_digital_signature: true,
     issue_date: true,
     medications: true,
     status: true,
     valid_until: true,
    },
    reminder_sent: true,
    status: true,
    symptoms: true,
    visit_type: true,
   },
   relations: ['doctor', 'hour', 'prescriptions'],
  });

  return appointment;
 }
 async profile(request: Request) {
  const token = getDataFromUserToken(request);
  if (!token) throw new UnauthorizedException();
  const user = await this.users.findOne({
   where: { id: token.id },
   relations: ['patient'],
  });

  if (!user) throw new NotFoundException();
  return user;
 }
 async update(body: PatientUpdateDto, request: Request) {
  const token = getDataFromUserToken(request);
  if (!token) throw new UnauthorizedException();
  const user = await this.users.findOne({
   where: { id: token.id },
   relations: ['patient'],
   select: { patient: true },
  });

  if (!user) throw new NotFoundException();
  for (const key in user.patient) {
   try {
    if (key in body && user.patient[key] === body[key]) delete body[key];
   } catch {
    /* empty */
   }
  }
  if (Object.keys(body).length === 0)
   throw new BadRequestException(
    'فیلدی ارسال نشده است. یا مقدار آن تکراری است.',
   );

  const result = await this.patients.update(
   {
    id: user.patient.id,
   },
   body,
  );
  return Boolean(result.affected);
 }
}
