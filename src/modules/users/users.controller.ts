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

@Controller('users')
@ApiBearerAuth()
@UsePipes(HashUserData)
@UseGuards(AuthGuard)
@UseInterceptors(DecryptUserData)
export class UsersController {
 constructor(private readonly users: UsersService) {}
 @Access()
 @Get(':id')
 findOne(@Param('id') id: string) {
  return this.users.get(id);
 }
 @Access()
 @Get()
 findAll() {
  return this.users.get();
 }
 @Access()
 @Post()
 add(@Body() body: AdminAddUser) {
  return this.users.add(body);
 }
 @Access()
 @Patch(':id')
 update(@Param('id') id: string, @Body() body: UserUpdateDto) {
  return this.users.update(id, body);
 }

 @Access(AccessType.PATIENT, AccessType.DOCTOR)
 @Patch('/updateUserData')
 updateUserData(@Body() body: UserUpdatePublicDto, @Req() request: Request) {
  return this.users.updateUserData(body, request);
 }
 @Access()
 @Delete(':id')
 delete(@Param('id') id: string) {
  return this.users.delete(id);
 }
}
