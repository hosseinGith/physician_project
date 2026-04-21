import { PartialType } from '@nestjs/mapped-types';
import PrescriptionsDtoAdd from './prescriptions-add.dto';

export default class PrescriptionsUpdateDto extends PartialType(
 PrescriptionsDtoAdd,
) {}
