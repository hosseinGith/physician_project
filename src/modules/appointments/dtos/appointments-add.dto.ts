import { IsEnum, IsNumber, IsString } from 'class-validator';
import {
 StatusAppointmentsEnum,
 VisitTypeAppointmentsEnum,
} from 'src/entitys/appointments.entity';

export default class AppointmentsDtoAdd {
 @IsNumber()
 patientId?: number;
 @IsNumber()
 doctorId?: number;
 @IsString()
 appointmentDate?: string;
 @IsString()
 appointmentTime?: string;
 @IsString()
 @IsEnum(StatusAppointmentsEnum)
 status?: string;
 @IsString()
 @IsEnum(VisitTypeAppointmentsEnum)
 visit_type?: string;
 @IsString()
 symptoms?: string;
 @IsString()
 created_at?: string;
 @IsNumber()
 reminderSent?: number;
}
