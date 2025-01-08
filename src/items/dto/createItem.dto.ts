import { Transform } from 'class-transformer';
import {
  IS_DECIMAL,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  min,
  Min,
} from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  itemDescription?: string;

  @IsDecimal()
  @Transform(({ value }) => value.toString())
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  categoryId: number;
}
