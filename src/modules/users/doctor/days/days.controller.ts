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
import { AccessType } from 'src/types';
import type { Request } from 'express';
import AddHourDto from './dtos/AddHour.dto';
import { DaysService } from './days.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { HashUserData } from 'src/shared/pipes/hash-user-data.pipe';
import { DecryptUserData } from 'src/shared/interceptors/decrypt-user-data.interceptor';
import { Access } from 'src/shared/decorators/access.decorator';
import { AccessGuard } from 'src/shared/guards/access.guard';

@UsePipes(HashUserData)
@UseInterceptors(DecryptUserData)
@ApiBearerAuth()
@Controller('/api/doctorhours')
@Access(AccessType.DOCTOR)
@UseGuards(AuthGuard, AccessGuard)
export class DaysController {
 constructor(private readonly service: DaysService) {}
//  @Get()
//  get() {
//   return this.service.get();
//  }
//  @Get(':id')
//  findOne(@Param('id') id: string) {
//   return this.service.get(id);
//  }
 @Post()
 create(@Body() body: AddHourDto, @Req() request: Request) {
  return this.service.create(body, request.user.id);
 }
 @Delete(':id')
 delete(@Param('id') id: string) {
  return this.service.delete(id);
 }
}

