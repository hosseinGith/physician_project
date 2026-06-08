import {
 BadRequestException,
 Injectable,
 NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType } from 'src/types';
import { Repository } from 'typeorm';
import { Patients } from 'src/modules/users/patient/patients.entity';
import PatientUpdateDto from './dtos/update.dto';
import { StatusPrescriptions } from 'src/modules/prescriptions/prescriptions.entity';
import { SortedByEnum } from './types';
import { UsersService } from '../users.service';
import { PrescriptionsService } from 'src/modules/prescriptions/prescriptions.service';

@Injectable()
export class PatientService {
 constructor(
  @InjectRepository(Patients)
  private patients: Repository<Patients>,
  private users: UsersService,
  private prescriptions: PrescriptionsService,
 ) {}
 async searchInPatientPrescriptions(userId: string) {
  return await this.prescriptions.findAll({
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
 async findOne(id: string): Promise<Patients> {
  const patient = await this.patients.findOneBy({ id });
  if (!patient) throw new NotFoundException('Patient not found');
  return patient;
 }
 async getPatientPrescriptions(
  userId: string,
  q: string,
  status: StatusPrescriptions | undefined,
  sortedBy: SortedByEnum | undefined,
 ) {
  return await this.prescriptions.findAll({
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
  return await this.users.findAllByWhere(
   {
    access: AccessType.DOCTOR,
    is_active: true,
   },
   ['doctor'],
   {
    access: true,
    doctor: {
     id: true,
     bio: true,
     consultation_fee: true,
     specialties: true,
    },
   },
  );
 }
 async search(q: string, patientId: string, specialty?: string) {
  const queryBuilder = this.patients
   .createQueryBuilder('patient')
   .leftJoinAndSelect('patient.appointments', 'appointment')
   .leftJoin('appointment.doctor', 'doctor')
   .leftJoin('doctor.user', 'user')
   .where('patient.id = :patientId', { patientId })
   .select([
    'patient.id',
    'appointment.id',
    'appointment.appointment_date',
    'appointment.status',
    'doctor.id',
    'doctor.bio',
    'doctor.consultation_fee',
    'user.first_name',
    'user.last_name',
   ]);

  if (q) {
   queryBuilder.andWhere(
    '(users.first_name LIKE :name OR users.last_name LIKE :name)',
    { name: `%${q}%` },
   );
  }

  if (specialty) {
   queryBuilder
    .leftJoinAndSelect('doctor.specialties', 'specialty')
    .andWhere('doctor.specialties = :specialty', { specialty });
  }

  queryBuilder.andWhere('doctor.id IS NOT NULL');

  return await queryBuilder.getMany();
 }

 async getProfile(userId: string) {
  const user = await this.users.findOne(userId, ['patient']);

  if (!user) throw new NotFoundException();
  return user;
 }
 async update(body: PatientUpdateDto, userId: string) {
  const user = await this.users.findOne(userId, ['patient'], { patient: true });

  if (!user) throw new NotFoundException();
  (Object.keys(body) as (keyof PatientUpdateDto)[]).forEach((key) => {
   if (
    key in user.patient &&
    (user.patient as unknown as Record<string, unknown>)[key] ===
     (body as Record<string, unknown>)[key]
   ) {
    delete body[key];
   }
  });
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
