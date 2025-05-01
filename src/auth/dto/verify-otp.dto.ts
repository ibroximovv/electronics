import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class VerifyOtpDto {
    @ApiProperty({ example: 'ibroximovv.uz@gmail.com'})
    @IsEmail()
    email: string
    
    // @ApiProperty({ example: '+998910128133' })
    // @IsString()
    // phone: string

    @ApiProperty({ example: '12345' })
    @IsString()
    otp: string
}