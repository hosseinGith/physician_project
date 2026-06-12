import { IsString } from 'class-validator';
import AppointmentsDtoAdd from './appointments-add.dto';

export default class AdminAppointmentsDtoAdd extends AppointmentsDtoAdd {
 @IsString()
 doctorId: string;
 @IsString()
 patientId: string;
}
