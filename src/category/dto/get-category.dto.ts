import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Type } from 'class-transformer';

export class GetCategoryDto {
    @ApiProperty({ example: 1, default: 1, required: false })
    @IsOptional()
    @Min(1)
    @IsNumber()
    @Type(() => Number)
    page?: number;

    @ApiProperty({ example: 10, default: 10, required: false })
    @IsOptional()
    @Min(1)
    @IsNumber()
    @Type(() => Number)
    limit?: number;

    @ApiProperty({required: false })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ example: 'name', enum: ['name', 'createdAt'], required: false })
    @IsOptional()
    @IsString()
    @IsIn(['name', 'createdAt'])
    sortBy?: string;

    @ApiProperty({ example: 'asc', enum: ['asc', 'desc'], required: false })
    @IsOptional()
    @IsString()
    @IsIn(['asc', 'desc'])
    sortOrder?: string;
}
