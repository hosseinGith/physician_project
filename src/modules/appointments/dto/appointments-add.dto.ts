import { IsBoolean, IsDate, IsEnum, IsString } from 'class-validator';
import {
 AppointmentStatusEnum,
 VisitTypeAppointmentsEnum,
} from 'src/modules/appointments/entities/appointments.entity';

export default class AppointmentsDtoAdd {
 @IsString()
 patientId: string;
 @IsString()
 doctorId: string;
 @IsDate()
 date: Date;
 @IsEnum(AppointmentStatusEnum)
 status: AppointmentStatusEnum;
 @IsEnum(VisitTypeAppointmentsEnum)
 visit_type: VisitTypeAppointmentsEnum;
 @IsString()
 symptoms: string;
 @IsBoolean()
 reminderSent: boolean;
 @IsString()
 hourId: string;
}
