import { Module } from '@nestjs/common';
import { BlockedTimesController } from './blockedTimes.controller';
import { BlockedTimesService } from './blockedTimes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockedTimes } from './blockedTimes.entity';

@Module({
 imports: [TypeOrmModule.forFeature([BlockedTimes])],

 controllers: [BlockedTimesController],
 providers: [BlockedTimesService],
})
export class HoursModule {}
