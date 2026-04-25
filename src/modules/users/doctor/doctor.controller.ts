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
import { AccessGuard } from 'src/shared/guards/access.guard';
import AddDoctorDto from './dtos/add.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccessType } from 'src/types';
import { HashUserData } from 'src/shared/pipes/hash-user-data.pipe';
import { DecryptUserData } from 'src/shared/interceptors/decrypt-user-data.interceptor';
import type { Request } from 'express';

@UsePipes(HashUserData)
@UseInterceptors(DecryptUserData)
@ApiBearerAuth()
@Controller('doctor')
@UseGuards(AuthGuard, new AccessGuard([]))
export class DoctorController {
 constructor(private readonly service: DoctorService) {}
 @Get()
 get() {
  return this.service.get();
 }
 @Get(':id')
 findOne(@Param('id') id: number) {
  return this.service.get(id);
 }
 @UseGuards(new AccessGuard([AccessType.DOCTOR]))
 @Get('getUserData')
 getUserData(@Req() request: Request) {
  return this.service.getUserData(request);
 }
 @UseGuards(new AccessGuard([AccessType.DOCTOR]))
 @Patch(':id')
 update(@Param() id: number, @Body() body: AddDoctorDto) {
  return this.service.update(id, body);
 }
}
