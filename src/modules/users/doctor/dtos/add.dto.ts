import { PartialType } from '@nestjs/swagger';
import { Doctors } from 'src/entitys/doctors.entity';

export default class AddDoctorDto extends PartialType(Doctors) {}
