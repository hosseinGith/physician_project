import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentsService } from '../../appointments/services/appointments.service';
import { DoctorService } from 'src/modules/doctor/services/doctor.service';
import { AuditLogsService } from 'src/modules/auditLogs/auditLogs.service';
import { Patients } from '../entities/patients.entity';
import CreatePatientAppointment from '../dto/create-appointment.dto';
import { Users } from 'src/modules/users/entities/users.entity';
import {
 AppointmentStatusEnum,
 VisitTypeAppointmentsEnum,
} from 'src/modules/appointments/entities/appointments.entity';
import getNextValidDate from '../checkAppointmentDay';

@Injectable()
export class PatientAppointmentService {
 constructor(
  @InjectRepository(Patients) private readonly doctorRepository: Patients,
  private readonly doctorService: DoctorService,
  private readonly appointments: AppointmentsService,
  private readonly auditLogs: AuditLogsService,
 ) {}
 findAll(userId: string) {
  const appointments = this.appointments.findOneByOption({
   where: {
    doctor: { user: { id: userId } },
   },
  });
  return appointments;
 }
 async getDoctorAppointment(userId: string) {
  const appointments = await this.appointments.findAll(undefined, {
   doctor: { user: { id: userId } },
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
 async setTurnAppointment(
  doctorId: string,
  body: CreatePatientAppointment,
  user: Users,
  callbackAccessDenied,
 ) {
  const doctor = await this.doctorService.findOneBy(doctorId);
  const dateOfTargetDay = getNextValidDate(body.dayName);

  const updateStatus = await this.appointments.create({
   doctor,
   appointment_date: dateOfTargetDay,
   patient: user.patient,
   prescriptions: [],
   status: AppointmentStatusEnum.PENDING,
   visit_type: VisitTypeAppointmentsEnum.INPERSON,
   symptoms: '',
   reminder_sent: body.reminder_sent,
  });
  return updateStatus;
 }
}
