import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsNumber, IsString, IsUUID, Min } from "class-validator";

export class GetCommentDto {
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
  @IsUUID()
  productId?: string;

  @ApiProperty({ example: 'createdAt', enum: ['text', 'star', 'createdAt'], required: false })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ example: 'desc', enum: ['asc', 'desc'], required: false })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}