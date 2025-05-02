// get-product.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum, IsArray, IsUUID, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusEnum } from '@prisma/client';

export class GetProductDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ example: 'price', enum: ['name', 'price', 'createdAt'], required: false })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ example: 'asc', enum: ['asc', 'desc'], required: false })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @ApiProperty({ required: false })
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  @IsNumber()
  priceFrom?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Min(1)
  @Max(1000000000)
  @Type(() => Number)
  @IsNumber()
  priceTo?: number;

  @ApiProperty({ enum: StatusEnum, required: false })
  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  colors?: string; 

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
