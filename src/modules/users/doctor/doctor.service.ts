import {
 BadRequestException,
 forwardRef,
 Inject,
 Injectable,
 NotFoundException,
 UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
 FindOptionsRelationByString,
 FindOptionsRelations,
 FindOptionsSelect,
 FindOptionsSelectByString,
 FindOptionsWhere,
 Repository,
} from 'typeorm';
import { Doctors } from 'src/modules/users/doctor/entities/doctors.entity';
import AddDoctorDto from './dtos/add.dto';
import { Specialties } from 'src/modules/users/doctor/entities/specialties.entity';
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
  @Inject(forwardRef(() => AppointmentsService))
  private readonly appointments: AppointmentsService,
 ) {}
 async getProfile(id: string): Promise<Doctors> {
  const doctor = await this.doctors.findOneBy({ id });
  if (!doctor) throw new NotFoundException('Doctor not found');
  return doctor;
 }
 async findOne(
  where?: FindOptionsWhere<Doctors> | FindOptionsWhere<Doctors>[],
  relations?: FindOptionsRelationByString | FindOptionsRelations<Doctors>,
  select?: FindOptionsSelect<Doctors> | FindOptionsSelectByString<Doctors>,
 ) {
  const doctor = await this.doctors.findOne({ where, relations, select });
  if (!doctor) throw new NotFoundException('دکتر پیدا نشد.');
  return doctor;
 }

 async findOneBy(id: string) {
  const doctor = await this.doctors.findOneBy({ id });
  if (!doctor) throw new NotFoundException('دکتر پیدا نشد.');
  return doctor;
 }
 async findAll() {
  return this.doctors.find();
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
  const patients = await this.appointments.findOneByWhere(
   { doctor: { id: user.doctor.id } },
   ['patients', 'prescriptions'],
   {
    appointment_date: true,
    created_at: true,
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
  );
  return patients;
 }
 async getDoctorDetails(id: string) {
  const user = await this.doctors
   .createQueryBuilder('doctor')
   .leftJoinAndSelect('doctor.user', 'user')
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
