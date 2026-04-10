import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/entitys/products.entity';
import { Users } from 'src/entitys/users.entity';

@Module({
 imports: [
  TypeOrmModule.forFeature([Products]),
  TypeOrmModule.forFeature([Users]),
 ],

 controllers: [ProductsController],
 providers: [ProductsService],
})
export class ProductsModule {}
