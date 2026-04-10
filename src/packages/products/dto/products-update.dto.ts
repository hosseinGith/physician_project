import { PartialType } from '@nestjs/swagger';
import { ProductsAdd } from './products-add.dto';

export class ProductsUpdate extends PartialType(ProductsAdd) {}
