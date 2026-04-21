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
} from '@nestjs/common';
import UserDtoAdd from './dtos/user-add.dto';
import { UsersService } from './users.service';
import { PasswordPipe } from 'src/shared/pipe/password.pipe';
import { PasswordInterceptor } from 'src/shared/interceptors/password.interceptor';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccessGuard } from 'src/shared/guards/access.guard';
import { AccessType } from 'src/types';
import UserUpdateDto from './dtos/user-update.dto';

@Controller('users')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@UseInterceptors(PasswordInterceptor)
export class UsersController {
 constructor(private readonly users: UsersService) {}
 @Get('/active_doctors')
 findActiveDoctors() {
  return this.users.findActiveDoctors();
 }
 @UseGuards(new AccessGuard([AccessType.ADMIN]))
 @Get(':id')
 findOne(@Param('id') id: number) {
  return this.users.get(id);
 }
 @UseGuards(new AccessGuard([AccessType.ADMIN]))
 @Get()
 findAll() {
  return this.users.get();
 }

 @UseGuards(new AccessGuard([AccessType.ADMIN]))
 @Post()
 add(@Body(PasswordPipe) body: UserDtoAdd) {
  return this.users.add(body);
 }
 @UseGuards(new AccessGuard([AccessType.ADMIN]))
 @Patch(':id')
 @UseGuards(new AccessGuard([AccessType.ADMIN]))
 update(@Param('id') id: number, @Body(PasswordPipe) body: UserUpdateDto) {
  return this.users.update(id, body);
 }
 @UseGuards(new AccessGuard([AccessType.ADMIN]))
 @Delete(':id')
 delete(@Param('id') id: number) {
  return this.users.delete(id);
 }
}
