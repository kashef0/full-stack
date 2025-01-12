
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { IsValidPrice } from 'src/validator/is-valid-price.validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  itemDescription?: string;

  @IsNotEmpty()
  @IsValidPrice({ message: 'Priset måste vara en giltig decimal med högst två decimaler och större än eller lika med noll' })
  price: number;
    

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;

  @IsNumber()
  categoryId: number;

  @IsNumber()
  userId: number
}
