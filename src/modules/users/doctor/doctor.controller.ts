import {
 Body,
 Controller,
 Get,
 Param,
 Patch,
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
@Controller('doctor')
@UseGuards(AuthGuard)
export class DoctorController {
 constructor(private readonly service: DoctorService) {}

 @Access(AccessType.DOCTOR)
 @UseGuards(AccessGuard)
 @Get('/profile')
 getUserData(@Req() request: Request) {
  return this.service.getUserData(request);
 }
 @Access(AccessType.DOCTOR)
 @UseGuards(AccessGuard)
 @Get('/my_patients')
 my_appointments(@Req() request: Request) {
  return this.service.my_appointments(request);
 }
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
 @Access(AccessType.DOCTOR)
 @UseGuards(AccessGuard)
 @Patch(':id')
 update(@Param() id: string, @Body() body: AddDoctorDto) {
  return this.service.update(id, body);
 }
}
