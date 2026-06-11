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
import { BlockedTimesService } from './blockedTimes.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { HashUserData } from 'src/shared/pipes/hash-user-data.pipe';
import { DecryptUserData } from 'src/shared/interceptors/decrypt-user-data.interceptor';
import { Access } from 'src/shared/decorators/access.decorator';
import { AccessGuard } from 'src/shared/guards/access.guard';
import type { Request } from 'express';
import CreateBlockedTimeDto from './dto/create.dto';

@UsePipes(HashUserData)
@UseInterceptors(DecryptUserData)
@ApiBearerAuth()
@Controller('/api/blockTimes')
@Access(AccessType.DOCTOR)
@UseGuards(AuthGuard, AccessGuard)
export class BlockedTimesController {
 constructor(private readonly service: BlockedTimesService) {}
 @Get('/asd:id')
 findOne2(@Param('id') id: string, @Req() request: Request) {
  return this.service.findOne(id, request.user.id);
 }

 @Get(':id')
 findOne(@Param('id') id: string, @Req() request: Request) {
  return this.service.findOne(id, request.user.id);
 }

 @Get()
 findAll(@Req() request: Request) {
  return this.service.findAll(request.user.id);
 }

 @Post()
 create(@Body() body: CreateBlockedTimeDto, @Req() request: Request) {
  return this.service.create(body, request.user.id);
 }
 @Delete(':id')
 remove(@Param('id') id: string, @Req() request: Request) {
  return this.service.remove(id, request.user.id);
 }
}
