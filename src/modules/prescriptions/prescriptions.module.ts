import { forwardRef, Module } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { PrescriptionsController } from './prescriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prescriptions } from 'src/modules/prescriptions/prescriptions.entity';
import { UsersModule } from '../users/users.module';

@Module({
 imports: [
  TypeOrmModule.forFeature([Prescriptions]),
  forwardRef(() => UsersModule),
 ],
 providers: [PrescriptionsService],
 controllers: [PrescriptionsController],
 exports: [PrescriptionsService],
})
export class PrescriptionsModule {}
