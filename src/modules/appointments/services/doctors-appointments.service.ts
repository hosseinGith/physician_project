import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctors } from 'src/modules/users/doctor/entities/doctors.entity';
import { AppointmentsService } from './appointments.service';
import { DoctorService } from 'src/modules/users/doctor/doctor.service';
import { UpdateDoctorsAppointments } from '../dtos/update-doctors-appointments.dto';

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
 async update(id: string, body: UpdateDoctorsAppointments) {
  const updateStatus = await this.appointments.update(id, { ...body });
  return updateStatus;
 }
}
