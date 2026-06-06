import {
 Body,
 Controller,
 Get,
 Patch,
 Query,
 Req,
 UseGuards,
 UseInterceptors,
 UsePipes,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessType } from 'src/types';
import type { Request } from 'express';
import { HashUserData } from 'src/shared/pipes/hash-user-data.pipe';
import { DecryptUserData } from 'src/shared/interceptors/decrypt-user-data.interceptor';
import PatientUpdateDto from './dtos/update.dto';
import { Access } from 'src/shared/decorators/access.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccessGuard } from 'src/shared/guards/access.guard';
import { SortedByEnum } from './types';
import { StatusPrescriptions } from 'src/entities/prescriptions.entity';

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
 search(
  @Req() request: Request,
  @Query('q') q: string,
  @Query('specialty') specialty?: string,
 ) {
  return this.service.search(q, request.user.id, specialty);
 }

 @Get('profile')
 getProfile(@Req() request: Request) {
  return this.service.getProfile(request.user.id);
 }

 @Patch('/profile')
 update(@Body() body: PatientUpdateDto, @Req() request: Request) {
  return this.service.update(body, request.user.id);
 }
}
