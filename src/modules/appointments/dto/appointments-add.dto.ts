import { OmitType } from '@nestjs/swagger';
import { Appointments } from 'src/modules/appointments/entities/appointments.entity';

export default class AppointmentsDtoAdd extends OmitType(Appointments, [
 'created_at',
 'id',
]) {}
