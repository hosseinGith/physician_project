import {
 Body,
 Controller,
 Delete,
 Get,
 Param,
 Patch,
 Post,
 Req,
 UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccessType } from 'src/types';
import AppointmentsDtoAdd from './dtos/appointments-add.dto';
import AppointmentsUpdateDto from './dtos/appointments-update.dto';
import type { Request } from 'express';
import { Access } from 'src/shared/guards/access.decorator';
import { AccessGuard } from 'src/shared/guards/access.guard';
@Controller('appointments')
@Access(AccessType.ADMIN)
@UseGuards(AuthGuard,AccessGuard)
@ApiBearerAuth()
export class AppointmentsController {
 constructor(private readonly appointments: AppointmentsService) {}

 @Get(':id')
 findOne(@Param('id') id: string) {
  return this.appointments.get(id);
 }
 @Get()
 findAll() {
  return this.appointments.get();
 }
 @Post()
 add(@Body() body: AppointmentsDtoAdd, @Req() request: Request) {
  return this.appointments.add(body, request);
 }
 @Patch(':id')
 update(@Param('id') id: string, @Body() body: AppointmentsUpdateDto) {
  return this.appointments.update(id, body);
 }
 @Delete(':id')
 delete(@Param('id') id: string) {
  return this.appointments.delete(id);
 }
}
