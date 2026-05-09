import { IsString } from 'class-validator';

export default class AddPatientDto {
 @IsString()
 id: string;
 @IsString()
 content: string;
}
