import {
 Body,
 Controller,
 Get,
 Post,
 Query,
 Req,
 UseGuards,
 UseInterceptors,
 UsePipes,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import ActiveTurn from './dtos/turn.dto';
import { AccessGuard } from 'src/shared/guards/access.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessType } from 'src/types';
import type { Request } from 'express';
import { HashUserData } from 'src/shared/pipes/hash-user-data.pipe';
import { DecryptUserData } from 'src/shared/interceptors/decrypt-user-data.interceptor';

@Controller('patient')
@ApiBearerAuth()
@UsePipes(HashUserData)
@UseInterceptors(DecryptUserData)
@UseGuards(new AccessGuard([AccessType.PATIENT]))
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
 @UseGuards(new AccessGuard([AccessType.PATIENT]))
 @Get('getUserData')
 getUserData(@Req() request: Request) {
  return this.service.getUserData(request);
 }
 @Post('/appointment/active')
 activeTurn(@Body() body: ActiveTurn, @Req() request: Request) {
  return this.service.activeTurn(body, request);
 }
}
