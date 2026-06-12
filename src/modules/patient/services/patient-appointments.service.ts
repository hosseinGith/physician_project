import { Injectable } from '@nestjs/common';
import { AppointmentsService } from '../../appointments/services/appointments.service';
import { DoctorService } from 'src/modules/doctor/services/doctor.service';
import CreatePatientAppointment from '../dto/create-appointment.dto';
import { Users } from 'src/modules/users/entities/users.entity';
import {
 AppointmentStatusEnum,
 VisitTypeAppointmentsEnum,
} from 'src/modules/appointments/entities/appointments.entity';

@Injectable()
export class PatientAppointmentService {
 constructor(
  private readonly doctorService: DoctorService,
  private readonly appointments: AppointmentsService,
 ) {}
 findAll(userId: string) {
  const appointments = this.appointments.findOneByOption({
   where: {
    patient: { user: { id: userId } },
   },
  });
  return appointments;
 }
 async getDoctorAppointment(userId: string) {
  const appointments = await this.appointments.findAll(undefined, {
   patient: { user: { id: userId } },
  });

  return appointments;
 }
 findOne(id: string, userId: string) {
  const appointment = this.appointments.findOneByOption({
   where: {
    patient: { user: { id: userId } },
    id,
   },
  });
  return appointment;
 }
 async setTurnAppointment(
  doctorId: string,
  body: CreatePatientAppointment,
  user: Users,
  dateOfTargetDay: Date,
 ) {
  const patient = await this.doctorService.findOneBy(doctorId);

  const updateStatus = await this.appointments.create(
   user.patient.id,
   patient.id,
   {
    appointment_date: dateOfTargetDay,
    prescriptions: [],
    status: AppointmentStatusEnum.PENDING,
    visit_type: VisitTypeAppointmentsEnum.INPERSON,
    symptoms: '',
    reminder_sent: body.reminder_sent,
   },
  );
  return updateStatus;
 }
}
