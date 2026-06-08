import { Module } from '@nestjs/common';
import { BlockedTimesController } from './blockedTimes.controller';
import { BlockedTimesService } from './blockedTimes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/modules/users/users.entity';
import { Doctors } from 'src/modules/users/doctor/doctors.entity';

@Module({
 imports: [TypeOrmModule.forFeature([Users, Doctors]), HoursModule],

 controllers: [BlockedTimesController],
 providers: [BlockedTimesService],
})
export class HoursModule {}
