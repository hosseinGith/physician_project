import { Module } from '@nestjs/common';
import { BlockedTimesController } from './blockedTimes.controller';
import { BlockedTimesService } from './blockedTimes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockedTimes } from './blockedTimes.entity';
import { DoctorModule } from '../doctor.module';

@Module({
 imports: [TypeOrmModule.forFeature([BlockedTimes]), DoctorModule],

 controllers: [BlockedTimesController],
 providers: [BlockedTimesService],
})
export class BlockedTimesModule {}
