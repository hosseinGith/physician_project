import {
 Body,
 Controller,
 Delete,
 Get,
 Param,
 Post,
 Req,
 UseGuards,
 UseInterceptors,
 UsePipes,
} from '@nestjs/common';
import { AccessGuard } from 'src/shared/guards/access.guard';
import { AccessType } from 'src/types';
import type { Request } from 'express';
import AddHourDto from './dtos/AddHour.dto';
import { HoursService } from './hours.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { HashUserData } from 'src/shared/pipes/hash-user-data.pipe';
import { DecryptUserData } from 'src/shared/interceptors/decrypt-user-data.interceptor';

@UsePipes(HashUserData)
@UseInterceptors(DecryptUserData)
@ApiBearerAuth()
@Controller('doctorhours')
@UseGuards(AuthGuard, new AccessGuard([AccessType.DOCTOR]))
export class HoursController {
 constructor(private readonly service: HoursService) {}
 @Get()
 get() {
  return this.service.get();
 }
 @Get(':id')
 findOne(@Param('id') id: string) {
  return this.service.get(id);
 }
 @Post()
 add(@Body() body: AddHourDto, @Req() request: Request) {
  return this.service.add(body, request);
 }
 @Delete(':id')
 delete(@Param('id') id: string) {
  return this.service.delete(id);
 }
}
