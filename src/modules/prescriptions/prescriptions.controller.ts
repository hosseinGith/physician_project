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
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccessGuard } from 'src/shared/guards/access.guard';
import { AccessType } from 'src/types';
import { PrescriptionsService } from './prescriptions.service';
import PrescriptionsDtoAdd from './dtos/prescriptions-add.dto';
import PrescriptionsUpdateDto from './dtos/prescriptions-update.dto';

@Controller('prescriptions')
@UseGuards(AuthGuard, new AccessGuard([AccessType.ADMIN]))
@ApiBearerAuth()
export class PrescriptionsController {
 constructor(private readonly prescriptions: PrescriptionsService) {}

 @Get(':id')
 findOne(@Param('id') id: string) {
  return this.prescriptions.get(id);
 }
 @Get()
 findAll() {
  return this.prescriptions.get();
 }
 @Post()
 add(@Body() body: PrescriptionsDtoAdd) {
  return this.prescriptions.add(body);
 }
 @Patch(':id')
 update(@Param('id') id: string, @Body() body: PrescriptionsUpdateDto) {
  return this.prescriptions.update(id, body);
 }
 @Delete(':id')
 delete(@Param('id') id: string) {
  return this.prescriptions.delete(id);
 }
}
