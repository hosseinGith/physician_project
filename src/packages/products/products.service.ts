import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/entitys/products.entity';
import { Like, Repository } from 'typeorm';
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
 async add(body: ProductsAdd) {
  const product = this.productsRep.create(body);

  return await this.productsRep.save(product);
 }
 async update(id: number, body: ProductsUpdate) {
  return !!(await this.productsRep.update({ id }, body)).affected;
 }
 async delete(id: number) {
  return !!(await this.productsRep.delete({ id })).affected;
 }
 async search(q: string) {
  if (!q.trim()) return [];
  return await this.productsRep.find({
   where: [{ slug: Like(`%${q}%`) }, { description: Like(`%${q}%`) }],
  });
 }
}
