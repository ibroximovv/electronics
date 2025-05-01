import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class CreateMessageDto {
    @ApiProperty({ example: '6ff5fe47-7837-458a-a158-3a2964659353' })
    @IsUUID()
    toId: string

    @ApiProperty({ example: 'fefdbc9b-7181-4985-9f5b-f7b83cc62874' })
    @IsUUID()
    chatId: string

    @ApiProperty({ example: 'hello'})
    @IsString()
    text: string
}
