import {
 BadRequestException,
 Injectable,
 NotFoundException,
 UnauthorizedException,
} from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Appointments } from 'src/entitys/appointments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import AppointmentsDtoAdd from './dtos/appointments-add.dto';
import AppointmentsUpdateDto from './dtos/appointments-update.dto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Doctors } from 'src/entitys/doctors.entity';
import { Patients } from 'src/entitys/patients.entity';
import { Users } from 'src/entitys/users.entity';
import { DoctorHours } from 'src/entitys/doctorHours.entity';

@Injectable()
export class AppointmentsService {
 constructor(
  @InjectRepository(Appointments)
  private appointments: Repository<Appointments>,
  @InjectRepository(Doctors)
  private doctors: Repository<Doctors>,
  @InjectRepository(Patients)
  private patients: Repository<Patients>,
  @InjectRepository(DoctorHours)
  private doctorHours: Repository<DoctorHours>,
  @InjectRepository(Users)
  private users: Repository<Users>,
  private readonly jwt: JwtService,
 ) {}
 async get(id?: string) {
  let res:
   | FindOptionsWhere<Appointments>
   | FindOptionsWhere<Appointments>[]
   | null;
  if (!Number.isNaN(id)) {
   res = await this.appointments.findOneBy({ id });
  } else res = await this.appointments.find();
  if (res) return res;
  throw new NotFoundException();
 }
 async add(body: AppointmentsDtoAdd, request: Request) {
  const token = String(request.headers?.authorization).split(' ')[1];

  if (!token) throw new UnauthorizedException();
  const patient = await this.patients.findOneBy({ id: body.patientId });
  if (!patient) throw new NotFoundException('', 'Patient');
  const doctor = await this.doctors.findOneBy({ id: body.doctorId });
  if (!doctor) throw new NotFoundException('', 'Doctor');
  const doctorHour = await this.doctorHours.findOneBy({
   id: body.hourId,
   doctor: { id: doctor.id },
  });
  if (!doctorHour)
   throw new NotFoundException(
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
   throw new BadRequestException(
    'در ساعت انتخاب شده دکتر وقت آزاد ندارد.لطفا ساعت دیگری انتخاب کنید.',
    'Hour problem',
   );

  const create_status = this.appointments.create({
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
  const appointments = await this.appointments.save(create_status);
  return appointments;
 }
 async update(id: string, body: AppointmentsUpdateDto) {
  if (!id) throw new BadRequestException('', 'id');

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
 async delete(id: string) {
  if (!id) throw new BadRequestException('id not found', 'id');
  const res = await this.appointments.delete({ id });
  if (!res.affected) throw new NotFoundException();
  return true;
 }
}
