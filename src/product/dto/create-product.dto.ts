import { ApiProperty } from "@nestjs/swagger";
import { ProductType, StatusEnum } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";

export class CreateProductDto {
    @ApiProperty({ example: 'Samsung Galaxy S25 Ultra' })
    @IsString()
    name: string

    @ApiProperty({ example: 1499.99 })
    @IsNumber()
    @Type(() => Number)
    price: number

    @ApiProperty({ example: 10 })
    @IsOptional()
    @IsNumber()
    @Max(100)
    @Min(0)
    @Type(() => Number)
    skidka?: number

    @ApiProperty({ enum: StatusEnum })
    @IsEnum(StatusEnum)
    status: StatusEnum

    @ApiProperty({ example: 'Samsung Galaxy S25 Ultra this veriy good phone' })
    @IsString()
    description: string

    @ApiProperty({ example: 'photo.png' })
    @IsOptional()
    @IsString()
    photo?: string

    @ApiProperty({ example: 50 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    count: number

    @ApiProperty({ example: ['black', 'white']})
    @IsArray()
    @IsNotEmpty()
    colors: string[]

    @ApiProperty({ enum: ProductType })
    @IsEnum(ProductType)
    type: ProductType

    @ApiProperty({ example: '2e760fc8-952c-4ae5-8286-c70d8c4e4553' })
    @IsUUID()
    categoryId: string
}
