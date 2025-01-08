import { Transform } from "class-transformer";
import { IsDecimal, IsInt, IsNegative, IsNotEmpty, IsOptional, IsPositive, IsString, Min } from "class-validator";
import { IsValidPrice } from "src/validator/is-valid-price.validator";

export class CreateTransactionDto {
    @IsInt()
    itemId: number;
  
    @IsString()
    itemTitle: string;
  
    @IsNotEmpty()
    @IsValidPrice({ message: 'Priset måste vara en giltig decimal med högst två decimaler och större än eller lika med noll' })
    price: number;
  

  
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    @Min(0)
    soldQty: number;
  
    @IsString()
    @IsOptional()
    salerName: string;
  }