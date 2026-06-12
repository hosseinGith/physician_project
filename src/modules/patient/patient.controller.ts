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
import { PatientService } from './services/patient.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessType } from 'src/types';
import type { Request } from 'express';
import { HashUserData } from 'src/shared/pipes/hash-user-data.pipe';
import { DecryptUserData } from 'src/shared/interceptors/decrypt-user-data.interceptor';
import PatientUpdateDto from './dto/update.dto';
import { Access } from 'src/shared/decorators/access.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccessGuard } from 'src/shared/guards/access.guard';
import { SortedByEnum } from './types';
import { StatusPrescriptions } from 'src/modules/prescriptions/entities/prescriptions.entity';
import { PatientAppointmentService } from './services/patient-appointments.service';
import CreatePatientAppointment from './dto/create-appointment.dto';
import { AuditLogInterceptor } from './interceptors/log.interceptor';
import getAuditLogAction from 'src/shared/utils/getAuditLogAction';
import { AuditLogsService } from '../auditLogs/auditLogs.service';
import getIp from 'src/shared/utils/getIp';
import {
 AuditLogsActionEnum,
 AuditLogsTargetTypeEnum,
} from '../auditLogs/entities/auditLogs.entity';
@Controller('/api/patient')
@ApiBearerAuth()
@UsePipes(HashUserData)
@UseInterceptors(DecryptUserData)
@Access(AccessType.PATIENT)
@UseGuards(AuthGuard, AccessGuard)
export class PatientController {
 constructor(
  private readonly auditLogs: AuditLogsService,
  private readonly service: PatientService,
  private readonly patientAppointment: PatientAppointmentService,
  private readonly patientService: PatientService,
 ) {}

 @Get('/appointments/:id')
 getAppointment() {}
 @Get('/appointments/')
 getAppointments() {}
 @UseInterceptors(AuditLogInterceptor)
 @Post('/appointments/:doctorId')
 setTurnAppointment(
  @Param('doctorId') doctorId: string,
  @Body() body: CreatePatientAppointment,
  @Req() request: Request,
 ) {
  const callbackAccessDenied = () => {
   void this.auditLogs.createAuditLog(
    AuditLogsActionEnum.ACCESS_DENIED,
    getIp(request),
    request.user.id,
    AuditLogsTargetTypeEnum.APPOINTMENT,
    request.headers['user-agent'],
   );
  };
  return this.patientAppointment.setTurnAppointment(
   doctorId,
   body,
   request.user,
   callbackAccessDenied,
  );
 }
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
