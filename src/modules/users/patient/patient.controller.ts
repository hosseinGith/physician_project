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
@Access(AccessType.PATIENT)
@UseGuards(AuthGuard, AccessGuard)
export class PatientController {
 constructor(private readonly service: PatientService) {}
 @Get('/prescriptions/search')
 searchInPatientPrescriptions(@Req() request: Request) {
  return this.service.searchInPatientPrescriptions(request.user.id);
 }
 @Get('/prescriptions')
 getPatientPrescriptions(
  @Query('q') q: string,
  @Query('status') status: StatusPrescriptions | undefined,
  @Query('sortedBy') sortedBy: SortedByEnum | undefined,
  @Req() request: Request,
 ) {
  return this.service.getPatientPrescriptions(
   request.user.id,
   q,
   status,
   sortedBy,
  );
 }
 @Get('/doctors/actives')
 findActiveDoctors() {
  return this.service.findActiveDoctors();
 }
 @Get('/doctors/search')
 search(@Query('q') q: string, @Query('specialty') specialty?: string) {
  return this.service.search(q, specialty);
 }
 @Get('/doctors/:id')
 getDoctor(@Param('id') id: string) {
  return this.service.getDoctor(id);
 }
 @Get('profile')
 getProfile(@Req() request: Request) {
  return this.service.getProfile(request.user.id);
 }

 @Get('/appointments')
 getAppointments(@Req() request: Request) {
  return this.service.getAppointments(request.user.id);
 }
 @Post('/appointment')
 createAppointment(@Body() body: ActiveTurn, @Req() request: Request) {
  return this.service.createAppointment(body, request.user.id);
 }
 @Patch('/profile')
 update(@Body() body: PatientUpdateDto, @Req() request: Request) {
  return this.service.update(body, request.user.id);
 }
}
