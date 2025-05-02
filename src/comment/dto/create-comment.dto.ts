import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString, IsUUID, Max, Min } from "class-validator";

export class CreateCommentDto {
    @ApiProperty({ example: '6a9d6674-5bfe-4247-990f-7256b89fa715'})
    @IsUUID()
    productId: string

    @ApiProperty({ example: 'comment written' })
    @IsString()
    text: string

    @ApiProperty({ example: 1 })
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(5)
    star: number
}
