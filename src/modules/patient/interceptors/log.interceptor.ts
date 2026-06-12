import {
 CallHandler,
 ExecutionContext,
 Injectable,
 NestInterceptor,
} from '@nestjs/common';
import { AuditLogsService } from 'src/modules/auditLogs/auditLogs.service';
import { PatientService } from '../services/patient.service';
import { Observable, tap } from 'rxjs';
import { AuditLogsTargetTypeEnum } from 'src/modules/auditLogs/entities/auditLogs.entity';
import type { Request } from 'express';
import getIp from 'src/shared/utils/getIp';
import getAuditLogAction from 'src/shared/utils/getAuditLogAction';
@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
 constructor(
  private readonly auditLogs: AuditLogsService,
  private readonly patientService: PatientService,
 ) {}

 intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
  const request = context.switchToHttp().getRequest<Request>();

  return next.handle().pipe(
   tap((data: unknown) => {
    void (async () => {
     const patient = await this.patientService.findOneByOptions({
      where: { user: { id: request.user.id } },
     });
     const ip = getIp(request);
     void this.auditLogs.create({
      action: getAuditLogAction(request.method),
      ipAddress: ip,
      user: patient.user,
      targetType: AuditLogsTargetTypeEnum.APPOINTMENT,
      userAgent: request.headers['user-agent'],
     });
    })();
    return data;
   }),
  );
 }
}
