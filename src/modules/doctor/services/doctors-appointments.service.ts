import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctors } from 'src/modules/doctor/entities/doctors.entity';
import { AppointmentsService } from '../../appointments/services/appointments.service';
import { DoctorService } from 'src/modules/doctor/services/doctor.service';
import { UpdateDoctorsAppointments } from '../dto/update-doctors-appointments.dto';

@Injectable()
export class DoctorsAppointmentService {
 constructor(
  @InjectRepository(Doctors) private readonly doctorRepository: Doctors,
  private readonly doctorService: DoctorService,
  private readonly appointments: AppointmentsService,
 ) {}
 findAll(userId: string) {
  const appointments = this.appointments.findOneByOption({
   where: {
    doctor: { user: { id: userId } },
   },
  });
  return appointments;
 }
 findOne(id: string, userId: string) {
  const appointment = this.appointments.findOneByOption({
   where: {
    doctor: { user: { id: userId } },
    id,
   },
  });
  return appointment;
 }
 async update(id: string, body: UpdateDoctorsAppointments, userId: string) {
  // check user id  according to appointment
  const checkAppointmentUserId = await this.appointments.findOneByOption({
   where: { id, doctor: { user: { id: userId } } },
  });
  if (!checkAppointmentUserId)
   throw new BadRequestException('این شناسه نوبت با هیچ نوبتی مطابقت ندارد.');
  const updateStatus = await this.appointments.update(id, {
   ...body,
  });
  return updateStatus;
 }
}
