import {
 IsIn,
 IsString,
 ValidateIf,
} from 'class-validator';
import { AppointmentStatusEnum } from '../../appointments/entities/appointments.entity';

export class UpdateDoctorsAppointments {
 @IsIn([AppointmentStatusEnum.ACCEPTED, AppointmentStatusEnum.CANCELLED])
 status: AppointmentStatusEnum.ACCEPTED | AppointmentStatusEnum.CANCELLED;
 @IsString()
 @ValidateIf(
  (obj: UpdateDoctorsAppointments) =>
   obj.status === AppointmentStatusEnum.CANCELLED,
 )
 cancelReason?: string;
}
