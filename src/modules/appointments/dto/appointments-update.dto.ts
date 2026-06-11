import { PartialType } from '@nestjs/mapped-types';
import AppointmentsDtoAdd from './appointments-add.dto';

export default class AppointmentsUpdateDto extends PartialType(
 AppointmentsDtoAdd,
) {}
