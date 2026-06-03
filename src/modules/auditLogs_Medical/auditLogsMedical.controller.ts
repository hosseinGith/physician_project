import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuditLogsMedicalService } from './auditLogsMedical.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccessType } from 'src/types';
import AuditLogsMedicalDtoAdd from './dtos/auditLogs_Medical-add.dto';
import { AuditLogsMedical } from 'src/entitys/auditLogs_Medical.entity';
import { Access } from 'src/shared/guards/access.decorator';
import { AccessGuard } from 'src/shared/guards/access.guard';
@Controller('/api/auditLogs_Medical')
@Access(AccessType.ADMIN)
@UseGuards(AuthGuard, AccessGuard)
@ApiBearerAuth()
export class AuditLogsMedicalController {
 constructor(private readonly auditLogs_Medical: AuditLogsMedicalService) {}
 @ApiResponse({
  status: 200,
  type: AuditLogsMedical,
 })
 @Get(':id')
 findOne(@Param('id') id: string) {
  return this.auditLogs_Medical.findOne(id);
 }
 @ApiResponse({
  type: [AuditLogsMedical],
 })
 @Get()
 findAll() {
  return this.auditLogs_Medical.findAll();
 }

 @Post()
 create(@Body() body: AuditLogsMedicalDtoAdd) {
  return this.auditLogs_Medical.create(body);
 }
}
