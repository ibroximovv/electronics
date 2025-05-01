import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString, IsUUID } from "class-validator";

export class CreateOrderDto {
    @ApiProperty({ example: '6a9d6674-5bfe-4247-990f-7256b89fa715' })
    @IsUUID()
    productId: string

    @ApiProperty({ example: 1 })
    @IsNumber()
    @Type(() => Number)
    count: number

    @ApiProperty({ example: 'black' })
    @IsString()
    color: string
}
