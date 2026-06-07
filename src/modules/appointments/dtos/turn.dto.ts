import { IsDate, IsEnum, IsString } from 'class-validator';
import { VisitTypeAppointmentsEnum } from 'src/modules/appointments/appointments.entity';

export default class ActiveTurn {
 @IsString()
 hourId!: string;
 @IsString()
 doctorId!: string;
 @IsDate()
 date!: Date;
 @IsEnum(VisitTypeAppointmentsEnum)
 visit_type!: VisitTypeAppointmentsEnum;
}
