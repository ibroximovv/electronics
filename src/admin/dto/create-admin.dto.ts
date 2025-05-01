import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateAdminDto {
    @ApiProperty({ example: 'Ilyosbek' })
    @IsString()
    firstName: string

    @ApiProperty({ example: 'Ibroximov' })
    @IsString()
    lastName: string

    @ApiProperty({ example: 2005, required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    year?: number

    @ApiProperty({ example: 'ibroximovv.uz@gmail.com'})
    @IsEmail()
    email: string

    @ApiProperty({ example: '+998910128133' })
    @IsString()
    phone: string

    @ApiProperty({ example: 'password' })
    @IsString()
    password: string

    @ApiProperty({ example: 'photo.png', required: false })
    @IsOptional()
    @IsString()
    photo?: string

    @ApiProperty({ enum: UserRole })
    @IsEnum(UserRole)
    role: UserRole
    
    @ApiProperty({ example: 'db16c541-8e1f-4d5c-8327-121f9d2f9e1a'})
    @IsUUID()
    regionId: string
}