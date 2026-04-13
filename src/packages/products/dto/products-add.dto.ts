import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductsAdd {
 @IsString()
 title: string;
 @IsString()
 slug: string;;
 @IsString()
 description: string;
 @IsNumber()
 price: number;
 @IsNumber()
 @IsOptional()
 stock?: number
 @IsNumber()
 @IsOptional()
 discount?: number
 @IsOptional()
 @IsNumber()
 old_price?: number
 @IsNumber()
 category_id: number;
}
