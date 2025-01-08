import { Transform } from "class-transformer";
import { IsDecimal, IsInt, IsNegative, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTransactionDto {
    @IsInt()
    itemId: number;
  
    @IsString()
    itemTitle: string;
  
    @IsDecimal()
    @Transform(({ value }) => value.toString())
    @IsNotEmpty()
    price: string;
  

  
    @IsInt()
    @IsNotEmpty()
    soldQty: number;
  
    @IsString()
    @IsOptional()
    salerName: string;
  }