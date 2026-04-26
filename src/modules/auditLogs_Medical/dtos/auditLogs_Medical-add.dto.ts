import { IsEnum, IsNumber, IsString } from 'class-validator';
import { AccessTypeAuditLogs_MedicalEnum } from 'src/entitys/auditLogs_Medical.entity';

export default class AuditLogs_MedicalDtoAdd {
 @IsNumber()
 accessedByUserid: string;
 @IsNumber()
 patientId: string;
 @IsEnum(AccessTypeAuditLogs_MedicalEnum)
 accessType: string;
 @IsString()
 accessReason: string;
 @IsString()
 ipAddress: string;
 @IsString()
 accessed_at: string;
}
