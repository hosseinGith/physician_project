import { forwardRef, Module } from '@nestjs/common';
import { BlockedTimesController } from './blockedTimes.controller';
import { BlockedTimesService } from './blockedTimes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockedTimes } from './entities/blockedTimes.entity';
import { DoctorModule } from '../doctor.module';
import { UsersModule } from '../../users/users.module';

@Module({
 imports: [
  TypeOrmModule.forFeature([BlockedTimes]),
  forwardRef(() => DoctorModule),
  forwardRef(() => UsersModule),
 ],

 controllers: [BlockedTimesController],
 providers: [BlockedTimesService],
 exports: [BlockedTimesService],
})
export class BlockedTimesModule {}
