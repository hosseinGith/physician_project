import {
 Body,
 Controller,
 Delete,
 Get,
 Param,
 Patch,
 Post,
 Req,
 UseGuards,
 UseInterceptors,
 UsePipes,
} from '@nestjs/common';
import { AdminAddUser } from './dtos/user-add.dto';
import { UsersService } from './users.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccessType } from 'src/types';
import UserUpdateDto from './dtos/user-update.dto';
import { HashUserData } from 'src/shared/pipes/hash-user-data.pipe';
import { DecryptUserData } from 'src/shared/interceptors/decrypt-user-data.interceptor';
import UserUpdatePublicDto from './dtos/user-update-public.dto';
import type { Request } from 'express';
import { Access } from 'src/shared/guards/access.decorator';
import { AccessGuard } from 'src/shared/guards/access.guard';

@Controller('/api/users')
@ApiBearerAuth()
@UsePipes(HashUserData)
@UseGuards(AuthGuard)
@UseInterceptors(DecryptUserData)
export class UsersController {
 constructor(private readonly users: UsersService) {}

 @Access(AccessType.PATIENT, AccessType.DOCTOR)
 @UseGuards(AccessGuard)
 @Get('/getUserInitialInfo')
 getUserInitialInfo(@Req() request: Request) {
  return this.users.getUserInitialInfo(request);
 }
 @Access()
 @UseGuards(AccessGuard)
 @Get(':id')
 findOne(@Param('id') id: string) {
  return this.users.get(id);
 }
 @Access()
 @UseGuards(AccessGuard)
 @Get()
 findAll() {
  return this.users.get();
 }
 @Access()
 @UseGuards(AccessGuard)
 @Post()
 add(@Body() body: AdminAddUser) {
  return this.users.add(body);
 }
 @Access(AccessType.PATIENT, AccessType.DOCTOR)
 @UseGuards(AccessGuard)
 @Patch('/updateUserData')
 updateUserData(@Body() body: UserUpdatePublicDto, @Req() request: Request) {
  return this.users.updateUserData(body, request);
 }
 @Access()
 @UseGuards(AccessGuard)
 @Patch(':id')
 update(@Param('id') id: string, @Body() body: UserUpdateDto) {
  return this.users.update(id, body);
 }

 @Access()
 @UseGuards(AccessGuard)
 @Delete(':id')
 delete(@Param('id') id: string) {
  return this.users.delete(id);
 }
}
