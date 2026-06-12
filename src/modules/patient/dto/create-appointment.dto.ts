import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { englishDays, EnglishDaysEnum } from '../types';

class CreatePatientAppointment {
 @IsString()
 hour: string;
 @IsEnum(englishDays)
 dayName: EnglishDaysEnum;
 @IsBoolean()
 reminder_sent: boolean;
}
export default CreatePatientAppointment;
