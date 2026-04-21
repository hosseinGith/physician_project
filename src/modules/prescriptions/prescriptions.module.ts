import { Module } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { PrescriptionsController } from './prescriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointments } from 'src/entitys/appointments.entity';
import { Users } from 'src/entitys/users.entity';

@Module({
 imports: [TypeOrmModule.forFeature([Appointments, Users])],
 providers: [PrescriptionsService],
 controllers: [PrescriptionsController],
})
export class PrescriptionsModule {}
