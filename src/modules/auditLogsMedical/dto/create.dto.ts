import { OmitType } from '@nestjs/swagger';
import { AuditLogsMedical } from 'src/modules/auditLogsMedical/entities/auditLogsMedical.entity';

export default class AuditLogsMedicalCreateDto extends OmitType(AuditLogsMedical, [
 'id',
 'accessed_at',
]) {}
