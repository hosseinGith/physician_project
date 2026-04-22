import {
 Body,
 Controller,
 Get,
 Param,
 Post,
 UseGuards,
 UseInterceptors,
} from '@nestjs/common';
import { AuditLogs_MedicalService } from './auditLogs_Medical.service';
import { PasswordPipe } from 'src/shared/pipe/password.pipe';
import { PasswordInterceptor } from 'src/shared/interceptors/password.interceptor';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccessGuard } from 'src/shared/guards/access.guard';
import { AccessType } from 'src/types';
import AuditLogs_MedicalDtoAdd from './dtos/auditLogs_Medical-add.dto';
@Controller('auditLogs_Medical')
@UseGuards(AuthGuard, new AccessGuard([AccessType.ADMIN]))
@ApiBearerAuth()
@UseInterceptors(PasswordInterceptor)
export class AuditLogs_MedicalController {
 constructor(private readonly auditLogs_Medical: AuditLogs_MedicalService) {}

 @Get(':id')
 findOne(@Param('id') id: number) {
  return this.auditLogs_Medical.get(id);
 }
 @Get()
 findAll() {
  return this.auditLogs_Medical.get();
 }
 @Post()
 add(@Body(PasswordPipe) body: AuditLogs_MedicalDtoAdd) {
  return this.auditLogs_Medical.add(body);
 }
}
