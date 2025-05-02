import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsNumber, Min } from "class-validator";

export class GetChatDto {
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
}