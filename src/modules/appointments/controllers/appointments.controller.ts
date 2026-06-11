import {
 Body,
 Controller,
 Get,
 NotFoundException,
 Post,
 Req,
 UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from '../services/appointments.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccessType } from 'src/types';
import AppointmentsDtoAdd from '../dtos/appointments-add.dto';
import { Access } from 'src/shared/decorators/access.decorator';
import { AccessGuard } from 'src/shared/guards/access.guard';
import ActiveTurn from '../dtos/turn.dto';
import type { Request } from 'express';
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
 @Access(AccessType.PATIENT)
 @Get('/patientAppointments')
 getPatientAppointments(@Req() request: Request) {
  const userId = request.user?.id;
  if (!userId) throw new NotFoundException();
  return this.appointments.getPatientAppointments(userId);
 }
 @Post()
 create(@Body() body: AppointmentsDtoAdd) {
  return this.appointments.create(body);
 }
 @Access(AccessType.PATIENT)
 @Post('/patient/turn')
 createAppointment(@Body() body: ActiveTurn, @Req() request: Request) {
  return this.appointments.createAppointment(body, request.user.id);
 }
}
