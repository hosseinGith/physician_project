import { OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
 IsEnum,
 IsNotEmpty,
 IsOptional,
 IsString,
 Matches,
 ValidateIf,
 ValidateNested,
} from 'class-validator';
import { Doctors } from 'src/modules/doctor/entities/doctors.entity';
import { Patients } from 'src/modules/patient/entities/patients.entity';
import { numberPattern } from 'src/shared/utils';
import { AccessType } from 'src/types';

export class UserDtoAdd {
 @IsOptional()
 firstname?: string;
 @IsOptional()
 lastname?: string;

 @IsString()
 @Matches(numberPattern, { message: 'فرمت شماره موبایل اشتباه است' })
 number: string;

 @IsNotEmpty()
 @IsEnum(AccessType)
 access: AccessType;

 @IsString()
 @IsOptional()
 @Matches(/^\d{10}$/, { message: 'فرمت کد ملی اشتباه است' })
 national_id?: string;
}
export class PatientsDto extends OmitType(Patients, [
 'user',
 'id',
 'medical_record_number',
]) {}
export class DoctorDto extends OmitType(Doctors, ['user', 'id']) {}
export class AdminAddUser {
 @ValidateNested()
 @Type(() => UserDtoAdd)
 user: UserDtoAdd;
 // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
 @ValidateIf((dto) => dto?.user.access === AccessType.PATIENT)
 @IsOptional()
 @Type(() => PatientsDto)
 patient: PatientsDto;
 // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
 @ValidateIf((dto) => dto?.user.access === AccessType.DOCTOR)
 @Type(() => DoctorDto)
 @IsOptional()
 doctor: DoctorDto;
}
