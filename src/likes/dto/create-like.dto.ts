import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class CreateLikeDto {
    @ApiProperty({ example: '6a9d6674-5bfe-4247-990f-7256b89fa715' })
    @IsUUID()
    productId: string
}
