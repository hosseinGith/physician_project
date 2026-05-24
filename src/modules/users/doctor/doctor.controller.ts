import {
 Body,
 Controller,
 Get,
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
  return this.service.find(q, specialty);
 }
 @Get('/public/specialtys')
 specialtys() {
  return this.service.allSpecialtys();
 }
 @UseGuards(AuthGuard)
 @Access(AccessType.DOCTOR)
 @UseGuards(AccessGuard)
 @Get('/profile')
 getUserData(@Req() request: Request) {
  return this.service.getUserData(request);
 }
 @UseGuards(AuthGuard)
 @Access(AccessType.DOCTOR)
 @UseGuards(AccessGuard)
 @Get('/my_patients')
 my_appointments(@Req() request: Request) {
  return this.service.my_appointments(request);
 }
 @UseGuards(AuthGuard)
 @Access(AccessType.DOCTOR)
 @UseGuards(AccessGuard)
 @Get()
 get() {
  return this.service.get();
 }
 @Get(':id')
 findOne(@Param('id') id: string) {
  return this.service.get(id);
 }
 @UseGuards(AuthGuard)
 @Access(AccessType.DOCTOR)
 @UseGuards(AccessGuard)
 @Patch(':id')
 update(@Param() id: string, @Body() body: AddDoctorDto) {
  return this.service.update(id, body);
 }
}
