import {
 Body,
 Controller,
 Delete,
 Get,
 Param,
 Patch,
 Post,
 UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessGuard } from 'src/shared/guards/access.guard';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AccessType } from 'src/types';
import { ProductsService } from './products.service';
import { ProductsAdd } from './dto/products-add.dto';
import { ProductsUpdate } from './dto/products-update.dto';

@Controller('Products')
@ApiBearerAuth()
export class ProductsController {
 constructor(private readonly productsServ: ProductsService) {}
 @UseGuards(
  AuthGuard,
  new AccessGuard([AccessType.Admin, AccessType.Managment]),
 )
 @Get('')
 findAll() {
  return this.productsServ.find();
 }
 @Get(':id')
 findOne(@Param('id') id: number) {
  return this.productsServ.find(id);
 }
 @Get('search/:search')
 search(@Param('search') search: string) {
  return this.productsServ.search(search);
 }
 @UseGuards(
  AuthGuard,
  new AccessGuard([AccessType.Admin, AccessType.Managment]),
 )
 @Post()
 add(@Body() body: ProductsAdd) {
  return this.productsServ.add(body);
 }
 @UseGuards(
  AuthGuard,
  new AccessGuard([AccessType.Admin, AccessType.Managment]),
 )
 @Patch(':id')
 update(@Param('id') id: number, @Body() body: ProductsUpdate) {
  return this.productsServ.update(id, body);
 }
 @UseGuards(
  AuthGuard,
  new AccessGuard([AccessType.Admin, AccessType.Managment]),
 )
 @Delete(':id')
 delete(@Param('id') id: number) {
  return this.productsServ.delete(id);
 }
}
