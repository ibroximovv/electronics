import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsPhoneNumber } from "class-validator";

export class SendOtpDto {
    @ApiProperty({ example: '+998910128133'})
    @IsPhoneNumber()
    phone: string

    @ApiProperty({ example: 'ibroximovv.uz@gmail.com'})
    @IsEmail()
    email: string
}