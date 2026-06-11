import { PartialType, PickType } from '@nestjs/swagger';
import { Doctors } from 'src/modules/doctor/entities/doctors.entity';

export default class AddDoctorDto extends PartialType(
 PickType(Doctors, ['bio', 'consultation_fee', 'medical_license_number']),
) {}
