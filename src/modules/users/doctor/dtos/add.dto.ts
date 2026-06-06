import { PartialType } from '@nestjs/swagger';
import { Doctors } from 'src/entities/doctors.entity';

export default class AddDoctorDto extends PartialType(Doctors) {}
