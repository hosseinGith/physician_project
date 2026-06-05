import {
 Body,
 Controller,
 Get,
 NotFoundException,
 Param,
 Patch,
 Query,
 Req,
 UseGuards,
 UseInterceptors,
 UsePipes,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import AddDoctorDto from './dtos/add.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccessType } from 'src/types';
import { HashUserData } from 'src/shared/pipes/hash-user-data.pipe';
import { DecryptUserData } from 'src/shared/interceptors/decrypt-user-data.interceptor';
import type { Request } from 'express';
import { Access } from 'src/shared/guards/access.decorator';
import { AccessGuard } from 'src/shared/guards/access.guard';

@UsePipes(HashUserData)
@UseInterceptors(DecryptUserData)
@ApiBearerAuth()
@Controller('/api/doctor')
export class DoctorController {
 constructor(private readonly service: DoctorService) {}
 @Get('/public/search')
 search(@Query('q') q?: string, @Query('specialty') specialty?: string) {
  return this.service.searchDoctors(q, specialty);
 }
 @Get('/public/specialties')
 specialties() {
  return this.service.getAllSpecialties();
 }

 @Access(AccessType.DOCTOR)
 @UseGuards(AuthGuard, AccessGuard)
 @Get('/profile')
 getProfile(@Req() request: Request) {
  if (!request.user?.id) throw new NotFoundException();
  return this.service.getProfile(request.user.id);
 }

 @Access(AccessType.DOCTOR)
 @UseGuards(AuthGuard, AccessGuard)
 @Get('/my_appointments')
 getDoctorAppointments(@Req() request: Request) {
  const userId = request.user?.id;
  if (!userId) throw new NotFoundException();
  return this.service.getDoctorAppointments(userId);
 }

 @Get(':id')
 findOne(@Param('id') id: string) {
  return this.service.findOne(id);
 }

 @Access(AccessType.DOCTOR)
 @UseGuards(AuthGuard, AccessGuard)
 @Patch(':id')
 update(@Param() id: string, @Body() body: AddDoctorDto) {
  return this.service.update(id, body);
 }
}
