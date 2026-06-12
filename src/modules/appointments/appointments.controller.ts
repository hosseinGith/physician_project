import {
 Body,
 Controller,
 Delete,
 Get,
 NotFoundException,
 Param,
 Patch,
 Post,
 Req,
 UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './services/appointments.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccessType } from 'src/types';
import { Access } from 'src/shared/decorators/access.decorator';
import { AccessGuard } from 'src/shared/guards/access.guard';
import ActiveTurn from './dto/turn.dto';
import type { Request } from 'express';
import AppointmentsUpdateDto from './dto/appointments-update.dto';
import AdminAppointmentsDtoAdd from './dto/admin-appointments-add.dto';
@Controller('/api/appointments')
@Access(AccessType.ADMIN)
@UseGuards(AuthGuard, AccessGuard)
@ApiBearerAuth()
export class AppointmentsController {
 constructor(private readonly appointments: AppointmentsService) {}
 @Get(':id')
 findOne(@Param('id') id: string) {
  return this.appointments.findOne(id);
 }

 @Access(AccessType.PATIENT)
 @Get('/patientAppointments')
 getPatientAppointments(@Req() request: Request) {
  const userId = request.user?.id;
  if (!userId) throw new NotFoundException();
  return this.appointments.getPatientAppointments(userId);
 }
 @Get()
 findAll() {
  return this.appointments.findAll();
 }

 @Post()
 create(@Body() body: AdminAppointmentsDtoAdd) {
  const { patientId, doctorId, ...appointmentData } = body;
  return this.appointments.create(patientId, doctorId, appointmentData);
 }
 @Access(AccessType.PATIENT)
 @Post('/patient/turn')
 createAppointment(@Body() body: ActiveTurn, @Req() request: Request) {
  return this.appointments.createAppointment(body, request.user.id);
 }

 @Patch(':id')
 update(@Param('id') id: string, @Body() body: AppointmentsUpdateDto) {
  return this.appointments.update(id, body);
 }
 @Delete(':id')
 remove(@Param('id') id: string) {
  return this.appointments.remove(id);
 }
}
