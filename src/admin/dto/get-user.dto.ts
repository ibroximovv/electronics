import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsNumber, IsString, Min, Max } from "class-validator";

export class GetUserDto {
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
  @Min(1900)
  @Max(new Date().getFullYear())
  @Type(() => Number)
  @IsNumber()
  year?: number;

  @ApiProperty({ example: 'firstName', enum: ['firstName', 'lastName', 'year', 'createdAt'], required: false })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ example: 'asc', enum: ['asc', 'desc'], required: false })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;
}