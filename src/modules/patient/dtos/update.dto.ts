import { OmitType, PartialType } from '@nestjs/swagger';
import { Patients } from 'src/modules/patient/entities/patients.entity';

export default class PatientUpdateDto extends PartialType(
 OmitType(Patients, ['id', 'user']),
) {}
