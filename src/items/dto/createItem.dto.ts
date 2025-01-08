import { Transform } from 'class-transformer';
import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
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
