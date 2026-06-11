import {
 Body,
 Controller,
 Delete,
 Get,
 Param,
 Patch,
 UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from '../services/appointments.service';
import AppointmentsUpdateDto from '../dtos/appointments-update.dto';
import { Access } from 'src/shared/decorators/access.decorator';
import { AccessType } from 'src/types';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccessGuard } from 'src/shared/guards/access.guard';

@Controller('appointment')
@Access(AccessType.ADMIN)
@UseGuards(AuthGuard, AccessGuard)
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
