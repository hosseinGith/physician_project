import { OmitType } from '@nestjs/swagger';
import { Appointments } from 'src/entitys/appointments.entity';

export default class AppointmentsDtoAdd extends OmitType(Appointments, [
 'id',
 'createdAt',
 'appointmentDate',
]) {}
