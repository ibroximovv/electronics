import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";

export class UpdateMeDto {
    @ApiProperty({ example: 'Ilyosbek' })
    @IsOptional()
    @IsString()
    firstName?: string

    @ApiProperty({ example: 'Ibroximov' })
    @IsOptional()
    @IsString()
    lastName?: string

    @ApiProperty({ example: 'ibroximovv.uz@gmail.com'})
    @IsOptional()
    @IsEmail()
    email?: string

    @ApiProperty({ example: '+998910128133' })
    @IsOptional()
    @IsString()
    phone?: string

    @ApiProperty({ example: 2005, required: false })
    @IsOptional()
    @Min(1900)
    @Max(new Date().getFullYear() - 10)
    @Type(() => Number)
    @IsNumber()
    year?: number

    @ApiProperty({ example: 'photo.png', required: false })
    @IsOptional()
    @IsString()
    photo?: string

    @ApiProperty({ example: 'password' })
    @IsOptional()
    @IsString()
    password?: string
    
    @ApiProperty({ example: 'db16c541-8e1f-4d5c-8327-121f9d2f9e1a'})
    @IsOptional()
    @IsUUID()
    regionId?: string
}