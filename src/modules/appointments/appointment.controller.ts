import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import AppointmentsUpdateDto from './dtos/appointments-update.dto';

@Controller('appointment')
export class AppointmentController {
 constructor(private readonly appointments: AppointmentsService) {}
 @Get(':id')
 findOne(@Param('id') id: string) {
  return this.appointments.findOne(id);
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
