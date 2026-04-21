import {
 Body,
 Controller,
 Delete,
 Get,
 Param,
 Patch,
 Post,
 UseGuards,
 UseInterceptors,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { PasswordPipe } from 'src/shared/pipe/password.pipe';
import { PasswordInterceptor } from 'src/shared/interceptors/password.interceptor';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccessGuard } from 'src/shared/guards/access.guard';
import { AccessType } from 'src/types';
import AppointmentsDtoAdd from './dtos/appointments-add.dto';
import AppointmentsUpdateDto from './dtos/appointments-update.dto';
@Controller('appointments')
@UseGuards(AuthGuard, new AccessGuard([AccessType.ADMIN]))
@ApiBearerAuth()
@UseInterceptors(PasswordInterceptor)
export class AppointmentsController {
 constructor(private readonly appointments: AppointmentsService) {}

 @Get(':id')
 findOne(@Param('id') id: number) {
  return this.appointments.get(id);
 }
 @Get()
 findAll() {
  return this.appointments.get();
 }
 @Post()
 add(@Body(PasswordPipe) body: AppointmentsDtoAdd) {
  return this.appointments.add(body);
 }
 @Patch(':id')
 update(
  @Param('id') id: number,
  @Body(PasswordPipe) body: AppointmentsUpdateDto,
 ) {
  return this.appointments.update(id, body);
 }
 @Delete(':id')
 delete(@Param('id') id: number) {
  return this.appointments.delete(id);
 }
}
