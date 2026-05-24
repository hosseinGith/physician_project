import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuditLogs_MedicalService } from './auditLogs_Medical.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccessType } from 'src/types';
import AuditLogs_MedicalDtoAdd from './dtos/auditLogs_Medical-add.dto';
import { AuditLogs_Medical } from 'src/entitys/auditLogs_Medical.entity';
import { Access } from 'src/shared/guards/access.decorator';
import { AccessGuard } from 'src/shared/guards/access.guard';
@Controller('/api/auditLogs_Medical')
@Access(AccessType.ADMIN)
@UseGuards(AuthGuard,AccessGuard)
@ApiBearerAuth()
export class AuditLogs_MedicalController {
 constructor(private readonly auditLogs_Medical: AuditLogs_MedicalService) {}
 @ApiResponse({
  type: AuditLogs_Medical,
 })
 @Get(':id')
 findOne(@Param('id') id: string) {
  return this.auditLogs_Medical.get(id);
 }
 @ApiResponse({
  type: [AuditLogs_Medical],
 })
 @Get()
 findAll() {
  return this.auditLogs_Medical.get();
 }

 @Post()
 add(@Body() body: AuditLogs_MedicalDtoAdd) {
  return this.auditLogs_Medical.add(body);
 }
}
