import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entitys/users.entity';
import { PublicModule } from './public/public.module';

@Module({
 imports: [TypeOrmModule.forFeature([Users]), PublicModule],
 controllers: [UsersController],
 providers: [UsersService],
})
export class UsersModule {}
