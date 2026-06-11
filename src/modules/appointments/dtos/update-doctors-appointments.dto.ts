import { PickType } from '@nestjs/swagger';
import { Appointments } from '../entities/appointments.entity';

export class UpdateDoctorsAppointments extends PickType(Appointments, [
 'status',
]) {}
