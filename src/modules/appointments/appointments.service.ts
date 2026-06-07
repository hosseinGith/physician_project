import {
 BadRequestException,
 forwardRef,
 Inject,
 Injectable,
 NotFoundException,
} from '@nestjs/common';
import {
 FindOptionsRelationByString,
 FindOptionsRelations,
 FindOptionsSelect,
 FindOptionsSelectByString,
 FindOptionsWhere,
 Repository,
} from 'typeorm';
import { Appointments } from 'src/modules/appointments/appointments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import AppointmentsDtoAdd from './dtos/appointments-add.dto';
import AppointmentsUpdateDto from './dtos/appointments-update.dto';

import { DoctorService } from '../users/doctor/doctor.service';
import { PatientService } from '../users/patient/patient.service';
import { HoursService } from '../users/doctor/hours/hours.service';
import ActiveTurn from './dtos/turn.dto';
import { AccessType } from 'src/types';
import { UsersService } from '../users/users.service';

@Injectable()
export class AppointmentsService {
 constructor(
  @InjectRepository(Appointments)
  private appointments: Repository<Appointments>,
  @Inject(forwardRef(() => DoctorService))
  private readonly doctors: DoctorService,
  private readonly patients: PatientService,
  private readonly doctorHours: HoursService,
  private readonly users: UsersService,
 ) {}
 async findOne(id?: string) {
  const res = await this.appointments.findOneBy({ id });
  if (res) return res;
  throw new NotFoundException();
 }
 async findOneByWhere(
  where: FindOptionsWhere<Appointments> | FindOptionsWhere<Appointments>[],
  relations?: FindOptionsRelationByString | FindOptionsRelations<Appointments>,
  select?:
   | FindOptionsSelect<Appointments>
   | FindOptionsSelectByString<Appointments>,
 ): Promise<Appointments> {
  const res = await this.appointments.findOne({ where, relations, select });
  if (!res) throw new NotFoundException();
  return res;
 }
 async findAll(select?: FindOptionsSelect<Appointments>) {
  const res = await this.appointments.find({ select: select });
  return res;
 }

 async getPatientAppointments(userId: string) {
  const user = await this.users.findOne(userId, ['patient']);

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
 async createAppointment(body: ActiveTurn, userId: string) {
  const doctor = await this.doctors.findOne(body.doctorId);
  if (!doctor)
   throw new NotFoundException('دکتر مورد نظر پیدا نشد.', 'Doctor not found');

  const user = await this.users.findOne(userId, ['patient']);

  if (!user) throw new NotFoundException('کاربر پیدا نشد.', 'User not found');
  if (user.access !== AccessType.PATIENT)
   throw new NotFoundException('شما بیمار نیستید.', 'User not found');

  const patient = user?.patient;
  if (!patient)
   throw new NotFoundException('کاربر پیدا نشد.', 'User not found');

  const doctorHour = await this.doctorHours.findOne(body.hourId, {
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
 async create(body: AppointmentsDtoAdd) {
  const [patient, doctor] = await Promise.all([
   this.patients.findOne(body.patientId),
   this.doctors.findOne(body.doctorId),
  ]);
  if (!doctor) throw new NotFoundException('Doctor not found');
  if (!patient) throw new NotFoundException('Patient not found');

  const doctorHour = await this.doctorHours.findOne(body.hourId, {
   doctor: { id: doctor.id },
  });

  const dateOnly = new Date(body.date).toISOString().split('T')[0];

  const appointment = await this.appointments.findOneBy({
   doctor: { id: doctor.id },
   appointment_date: new Date(dateOnly),
   hour: { id: doctorHour.id },
  });

  if (appointment)
   throw new BadRequestException(
    'در ساعت انتخاب شده دکتر وقت آزاد ندارد.لطفا ساعت دیگری انتخاب کنید.',
    'Hour problem',
   );

  const newAppointment = this.appointments.create({
   ...body,
   appointment_date: dateOnly,
   doctor: { id: doctor.id },
   patient: { id: patient.id },
   hour: { id: body.hourId },
   status: body.status,
   visit_type: body.visit_type,
   symptoms: body.symptoms,
   reminder_sent: Boolean(body.reminderSent),
  });
  return await this.appointments.save(newAppointment);
 }
 async update(id: string, body: AppointmentsUpdateDto) {
  const user = await this.appointments.findOneBy({ id });
  const fieldsToUpdate = Object.keys(body).length;

  if (fieldsToUpdate === 0) {
   throw new BadRequestException('هیچ فیلدی برای به‌روزرسانی ارسال نشده است.');
  }

  if (user)
   return (
    (await this.appointments.update({ id: user.id }, body)).affected === 1
   );
  throw new NotFoundException();
 }
 async remove(id: string) {
  const res = await this.appointments.delete({ id });
  if (!res.affected) throw new NotFoundException();
  return { message: 'نوبت با موفقیت حذف شد.' };
 }
}
