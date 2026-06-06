import { IsEnum, IsString } from 'class-validator';
import { AccessTypeAuditLogsMedicalEnum } from 'src/entities/auditLogsMedical.entity';

export default class AuditLogsMedicalDtoAdd {
 @IsString()
 accessedByUserid: string;
 @IsString()
 patientId: string;
 @IsEnum(AccessTypeAuditLogsMedicalEnum)
 accessType: string;
 @IsString()
 accessReason: string;
 @IsString()
 ipAddress: string;
 @IsString()
 accessed_at: string;
}
