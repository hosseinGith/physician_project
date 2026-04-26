import {
 Body,
 Controller,
 Delete,
 Get,
 Param,
 Patch,
 Post,
 UseGuards,
 UseInterceptors,
 UsePipes,
} from '@nestjs/common';
import { AdminAddUser } from './dtos/user-add.dto';
import { UsersService } from './users.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccessGuard } from 'src/shared/guards/access.guard';
import { AccessType } from 'src/types';
import UserUpdateDto from './dtos/user-update.dto';
import { HashUserData } from 'src/shared/pipes/hash-user-data.pipe';
import { DecryptUserData } from 'src/shared/interceptors/decrypt-user-data.interceptor';

@Controller('users')
@ApiBearerAuth()
@UseGuards(AuthGuard, new AccessGuard([AccessType.ADMIN]))
@UsePipes(HashUserData)
@UseInterceptors(DecryptUserData)
export class UsersController {
 constructor(private readonly users: UsersService) {}
 @Get(':id')
 findOne(@Param('id') id: string) {
  return this.users.get(id);
 }
 @Get()
 findAll() {
  return this.users.get();
 }
 @Post()
 add(@Body() body: AdminAddUser) {
  return this.users.add(body);
 }
 @Patch(':id')
 update(@Param('id') id: string, @Body() body: UserUpdateDto) {
  return this.users.update(id, body);
 }
 @Delete(':id')
 delete(@Param('id') id: string) {
  return this.users.delete(id);
 }
}
