import { IsBoolean, IsDate, IsEnum, IsString } from 'class-validator';
import {
 StatusAppointmentsEnum,
 VisitTypeAppointmentsEnum,
} from 'src/modules/appointments/appointments.entity';

export default class AppointmentsDtoAdd {
 @IsString()
 patientId: string;
 @IsString()
 doctorId: string;
 @IsDate()
 date: Date;
 @IsEnum(StatusAppointmentsEnum)
 status: StatusAppointmentsEnum;
 @IsEnum(VisitTypeAppointmentsEnum)
 visit_type: VisitTypeAppointmentsEnum;
 @IsString()
 symptoms: string;
 @IsBoolean()
 reminderSent: boolean;
 @IsString()
 hourId: string;
}
