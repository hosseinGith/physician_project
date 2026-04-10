import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/entitys/products.entity';
import { Repository } from 'typeorm';
import { ProductsAdd } from './dto/products-add.dto';
import { ProductsUpdate } from './dto/products-update.dto';

@Injectable()
export class ProductsService {
 constructor(
  @InjectRepository(Products)
  private readonly productsRep: Repository<Products>,
 ) {}

 async find(id?: number) {
  if (typeof id === 'number') return await this.productsRep.findOneBy({ id });
  return await this.productsRep.find();
 }
 add(body: ProductsAdd) {
  return this.productsRep.create(body);
 }
 async update(id: number, body: ProductsUpdate) {
  return !!(await this.productsRep.update({ id }, body)).affected;
 }
 async delete(id: number) {
  return !!(await this.productsRep.delete({ id })).affected;
 }
}
