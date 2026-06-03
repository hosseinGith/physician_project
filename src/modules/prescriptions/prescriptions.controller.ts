import {
 Body,
 Controller,
 Delete,
 Get,
 Param,
 Patch,
 Post,
 UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccessType } from 'src/types';
import { PrescriptionsService } from './prescriptions.service';
import PrescriptionsDtoAdd from './dtos/prescriptions-add.dto';
import PrescriptionsUpdateDto from './dtos/prescriptions-update.dto';
import { Access } from 'src/shared/guards/access.decorator';
import { AccessGuard } from 'src/shared/guards/access.guard';

@Controller('/api/prescriptions')
@Access(AccessType.ADMIN)
@UseGuards(AuthGuard,AccessGuard)
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
 create(@Body() body: PrescriptionsDtoAdd) {
  return this.prescriptions.create(body);
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
