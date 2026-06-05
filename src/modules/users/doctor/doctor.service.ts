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
import { Specialties } from 'src/entitys/specialties.entity';
import { UsersService } from '../users.service';
import { AppointmentsService } from 'src/modules/appointments/appointments.service';

@Injectable()
export class DoctorService {
 constructor(
  @InjectRepository(Doctors)
  private readonly doctors: Repository<Doctors>,
  @InjectRepository(Specialties)
  private readonly specialties: Repository<Specialties>,
  private readonly users: UsersService,
  private readonly appointments: AppointmentsService,
 ) {}
 async getProfile(id: string): Promise<Doctors> {
  const doctor = await this.doctors.findOneBy({ id });
  if (!doctor) throw new NotFoundException('Doctor not found');
  return doctor;
 }
 async findOne(id: string) {
  return this.doctors.findOneBy({ id });
 }
 async findAll() {
  return this.doctors.find({ select: ['doctorHours'] });
 }
 async searchDoctors(q: string = '', specialty: string = '') {
  const queryBuilder = this.doctors
   .createQueryBuilder('doctor')
   .leftJoinAndSelect('doctor.specialties', 'specialtyDoctor')
   .leftJoinAndSelect('specialtyDoctor.specialty', 'specialty')
   .leftJoinAndSelect('doctor.doctorHours', 'doctorHours')
   .leftJoinAndSelect('doctor.days', 'days')
   .leftJoinAndSelect('doctor.user', 'user')
   .addSelect(
    (qb) =>
     qb
      .select('COALESCE(AVG(rate.score), 0)')
      .from('rates', 'rate')
      .where('rate.doctorId = doctor.id'),
    'ratesAvg',
   )
   .addSelect(
    (qb) =>
     qb
      .select('COUNT(rate.id)')
      .from('rates', 'rate')
      .where('rate.doctorId = doctor.id'),
    'ratesCount',
   );

  // جستجو
  if (q) {
   queryBuilder.andWhere(
    `(
      doctor.id = :qId OR 
      user.first_name LIKE :q OR 
      user.last_name LIKE :q OR 
      specialty.name LIKE :q
    )`,
    {
     qId: q,
     q: `%${q}%`,
    },
   );
  }

  // فیلتر تخصص
  if (specialty) {
   queryBuilder.andWhere('specialty.name = :specialty', { specialty });
  }

  return queryBuilder.getMany();
 }
 async getAllSpecialties() {
  return this.specialties.find({ select: ['name', 'id'] });
 }

 async getDoctorAppointments(userId: string) {
  const user = await this.users.findOne(userId, ['doctor']);
  if (!user) throw new UnauthorizedException();
  const patients = await this.appointments.findOne({
   where: { doctor: { id: user.doctor.id } },
   relations: ['patients', 'prescriptions'],
   select: {
    appointment_date: true,
    created_at: true,
    hour: true,
    id: true,
    patient: {
     allergies: true,
     blood_type: true,
     chronic_diseases: true,
     emergency_contact_name: true,
     emergency_contact_phone: true,
     id: true,
     medical_record_number: true,
     user: {
      first_name: true,
      last_name: true,
     },
    },
   },
  });
  return patients;
 }

 async update(id: string, body: AddDoctorDto) {
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
