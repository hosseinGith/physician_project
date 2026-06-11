import {
 Body,
 Controller,
 Get,
 Param,
 Post,
 Req,
 UseGuards,
} from '@nestjs/common';
import { DoctorsAppointmentService } from '../services/doctors-appointments.service';
import { AccessType } from 'src/types';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccessGuard } from 'src/shared/guards/access.guard';
import { Access } from 'src/shared/decorators/access.decorator';
import type { Request } from 'express';
import { UpdateDoctorsAppointments } from '../dtos/update-doctors-appointments.dto';

@Controller('/api/appointments/doctor')
@Access(AccessType.DOCTOR)
@UseGuards(AuthGuard, AccessGuard)
// doctor appointments access
export class DoctorsAppointmentController {
 constructor(private readonly service: DoctorsAppointmentService) {}
 @Get()
 findAll(@Req() request: Request) {
  return this.service.findAll(request.user.id);
 }
 @Get(':id')
 findOne(@Param(':id') id: string, @Req() request: Request) {
  return this.service.findOne(id, request.user.id);
 }
 // change appointment status
 @Post(':id')
 create(@Param(':id') id: string, @Body() body: UpdateDoctorsAppointments) {
  return this.service.update(id, body);
 }
}
