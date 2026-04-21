import { OmitType } from '@nestjs/swagger';
import { Prescriptions } from 'src/entitys/prescriptions.entity';

export default class PrescriptionsDtoAdd extends OmitType(Prescriptions, [
 'id',
 'issueDate',
]) {}
