import {
 Body,
 Controller,
 Get,
 Patch,
 Post,
 Query,
 Req,
 UseGuards,
 UseInterceptors,
 UsePipes,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import ActiveTurn from './dtos/turn.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessType } from 'src/types';
import type { Request } from 'express';
import { HashUserData } from 'src/shared/pipes/hash-user-data.pipe';
import { DecryptUserData } from 'src/shared/interceptors/decrypt-user-data.interceptor';
import PatientUpdateDto from './dtos/update.dto';
import { Access } from 'src/shared/guards/access.decorator';

@Controller('patient')
@ApiBearerAuth()
@UsePipes(HashUserData)
@UseInterceptors(DecryptUserData)
@Access(AccessType.PATIENT)
export class PatientController {
 constructor(private readonly service: PatientService) {}

 @Get('/active_doctors')
 findActiveDoctors() {
  return this.service.findActiveDoctors();
 }
 @Get('/search/doctors')
 search(@Query('q') q: string, @Query('specialty') specialty?: string) {
  return this.service.search(q, specialty);
 }
 @Access(AccessType.PATIENT)
 @Get('profile')
 profile(@Req() request: Request) {
  return this.service.profile(request);
 }

 @Access(AccessType.PATIENT)
 @Get('/appointments')
 get_appointments(@Req() request: Request) {
  return this.service.get_appointments(request);
 }
 @Access(AccessType.PATIENT)
 @Post('/appointment/active')
 appointment(@Body() body: ActiveTurn, @Req() request: Request) {
  return this.service.appointment(body, request);
 }
 @Access(AccessType.PATIENT)
 @Patch('/patientUpdate')
 patientUpdate(@Body() body: PatientUpdateDto, @Req() request: Request) {
  return this.service.update(body, request);
 }
}
