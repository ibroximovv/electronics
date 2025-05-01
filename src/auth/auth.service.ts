import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { MailService } from 'src/mail/mail.service';
import { SmsService } from 'src/sms/sms.service';
import { totp } from "otplib";
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from "bcrypt";
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

totp.options =  {
  step: 300,
  digits: 5
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly sendMail: MailService, private readonly sendPhone: SmsService, private readonly jwt: JwtService){}

  async sendOtp(sendOtpDto: SendOtpDto) {
    try {
      const otp = totp.generate(sendOtpDto.email + 'hello')
      this.sendMail.sendToMail(sendOtpDto.email, 
        'Tasdiqlash kodi',
        'Iltimos tasdiqlash kodini hech kimga bermang',
        `<h1>${otp}</h1>`
      )
      
      // this.sendPhone.sendSmsToPhone(sendOtpDto.phone, otp)
      
      return { message: 'otp sent' }
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    try {
      const verifyOtp: boolean = totp.verify({ token: verifyOtpDto.otp, secret: verifyOtpDto.email + 'hello' })
      return verifyOtp
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
  
  async register(data: RegisterDto) {
    try {
      const findUser = await this.prisma.user.findFirst({ where: { email: data.email }})
      if (findUser) {
        throw new BadRequestException('User already exists')
      }

      const findUserByPhone = await this.prisma.user.findUnique({ where: { phone: data.phone }})
      if (findUserByPhone) {
        throw new BadRequestException('Phone already exists')
      }
      
      const hashedPassword = bcrypt.hashSync(data.password, 10)

      const createdUser = await this.prisma.user.create({ data: {
        ...data,
        password: hashedPassword
      } })
      return createdUser;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; 
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const findUser = await this.prisma.user.findFirst({ where: { email: loginDto.email }})
      if (!findUser) {
        throw new BadRequestException('User not found')
      }
      const matchPassword = bcrypt.compareSync(loginDto.password, findUser.password)

      if (!matchPassword) {
        throw new BadRequestException('Password not provided')
      }

      const token = this.jwt.sign({ id: findUser.id, role: findUser.role })
      return { token }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; 
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
