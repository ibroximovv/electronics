import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateChatDto {
    @ApiProperty({ example: '6ff5fe47-7837-458a-a158-3a2964659353' })
    @IsUUID()
    toId: string
}
