import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccessType } from 'src/types';
import AppointmentsDtoAdd from './dtos/appointments-add.dto';
import type { Request } from 'express';
import { Access } from 'src/shared/guards/access.decorator';
import { AccessGuard } from 'src/shared/guards/access.guard';
@Controller('/api/appointments')
@Access(AccessType.ADMIN)
@UseGuards(AuthGuard, AccessGuard)
@ApiBearerAuth()
export class AppointmentsController {
 constructor(private readonly appointments: AppointmentsService) {}
 @Get()
 findAll() {
  return this.appointments.findAll();
 }
 @Post()
 create(@Body() body: AppointmentsDtoAdd) {
  return this.appointments.create(body);
 }
}
