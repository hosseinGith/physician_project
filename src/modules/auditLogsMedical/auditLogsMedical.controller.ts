import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuditLogsMedicalService } from './auditLogsMedical.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccessType } from 'src/types';
import AuditLogsMedicalDtoAdd from './dtos/auditLogsMedical-add.dto';
import { AuditLogsMedical } from 'src/modules/auditLogs_Medical/auditLogsMedical.entity';
import { Access } from 'src/shared/decorators/access.decorator';
import { AccessGuard } from 'src/shared/guards/access.guard';
@Controller('/api/auditLogsMedical')
@Access(AccessType.ADMIN)
@UseGuards(AuthGuard, AccessGuard)
@ApiBearerAuth()
export class AuditLogsMedicalController {
 constructor(private readonly auditLogsMedical: AuditLogsMedicalService) {}
 @ApiResponse({
  status: 200,
  type: AuditLogsMedical,
 })
 @Get(':id')
 findOne(@Param('id') id: string) {
  return this.auditLogsMedical.findOne(id);
 }
 @ApiResponse({
  type: [AuditLogsMedical],
 })
 @Get()
 findAll() {
  return this.auditLogsMedical.findAll();
 }

 @Post()
 create(@Body() body: AuditLogsMedicalDtoAdd) {
  return this.auditLogsMedical.create(body);
 }
}
