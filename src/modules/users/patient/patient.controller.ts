import {
 Body,
 Controller,
 Get,
 Param,
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
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccessGuard } from 'src/shared/guards/access.guard';
import { SortedByEnum } from './types';
import { StatusPrescriptions } from 'src/entitys/prescriptions.entity';

@Controller('/api/patient')
@ApiBearerAuth()
@UsePipes(HashUserData)
@UseInterceptors(DecryptUserData)
@UseGuards(AuthGuard)
export class PatientController {
 constructor(private readonly service: PatientService) {}
 @Access(AccessType.PATIENT)
 @UseGuards(AccessGuard)
 @Get('/prescriptions/search')
 searchInPatientPrescriptions(@Req() request: Request) {
  return this.service.searchInPatientPrescriptions(request);
 }
 @Get('/prescriptions')
 getPatientPrescriptions(
  @Query('q') q: string,
  @Query('status') status: StatusPrescriptions | undefined,
  @Query('sortedBy') sortedBy: SortedByEnum | undefined,
  @Req() request: Request,
 ) {
  return this.service.getPatientPrescriptions(request, q, status, sortedBy);
 }
 @Access(AccessType.PATIENT)
 @UseGuards(AccessGuard)
 @Get('/doctors/actives')
 findActiveDoctors() {
  return this.service.findActiveDoctors();
 }
 @Access(AccessType.PATIENT)
 @UseGuards(AccessGuard)
 @Get('/doctors/search')
 search(@Query('q') q: string, @Query('specialty') specialty?: string) {
  return this.service.search(q, specialty);
 }
 @Access(AccessType.PATIENT)
 @UseGuards(AccessGuard)
 @Get('/doctors/getDoctorForAppointments/:id')
 getDoctorForAppointments(@Param('id') id: string) {
  return this.service.getDoctorForAppointments(id);
 }
 @Access(AccessType.PATIENT)
 @UseGuards(AccessGuard)
 @Get('profile')
 profile(@Req() request: Request) {
  return this.service.profile(request);
 }

 @Access(AccessType.PATIENT)
 @UseGuards(AccessGuard)
 @Get('/appointments')
 get_appointments(@Req() request: Request) {
  return this.service.get_appointments(request);
 }
 @Access(AccessType.PATIENT)
 @UseGuards(AccessGuard)
 @Post('/appointment/active')
 appointment(@Body() body: ActiveTurn, @Req() request: Request) {
  return this.service.appointment(body, request);
 }
 @Access(AccessType.PATIENT)
 @UseGuards(AccessGuard)
 @Patch('/patientUpdate')
 patientUpdate(@Body() body: PatientUpdateDto, @Req() request: Request) {
  return this.service.update(body, request);
 }
}
