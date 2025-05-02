import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
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
import * as DeviceDetector from 'device-detector-js';
import { Request } from 'express';

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

  async login(loginDto: LoginDto, req: Request) {
    try {
      const findUser = await this.prisma.user.findFirst({
        where: { email: loginDto.email },
      });

      if (!findUser) {
        throw new BadRequestException('User not found');
      }

      const matchPassword = bcrypt.compareSync(loginDto.password, findUser.password);
      if (!matchPassword) {
        throw new BadRequestException('Incorrect password');
      }

      const accessToken = this.jwt.sign(
        { id: findUser.id, role: findUser.role },
        { expiresIn: '15m' }
      );
      const refreshToken = this.jwt.sign(
        { id: findUser.id, role: findUser.role },
        { expiresIn: '7d' }
      );

      const deviceDetector = new DeviceDetector();
      const device = deviceDetector.parse(req.headers['user-agent'] || '');
      const deviceName = `${device.client?.name || 'Unknown Client'} on ${device.os?.name || 'Unknown OS'}`;

      const userIp = req.ip || (req.headers['x-forwarded-for'] as string) || 'unknown';

      await this.prisma.session.create({
        data: {
          userId: findUser.id,
          userIp,
          device: deviceName,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), 
        },
      });

      return { accessToken, refreshToken }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; 
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const verifyToken = this.jwt.verify(refreshToken)
      const user = await this.prisma.user.findFirst({ where: { id: verifyToken.id } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const newAccessToken = this.jwt.sign({ id: user.id, role: user.role }, { expiresIn: '15m' });
      return { accesToken: newAccessToken }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error 
      }
      if (error instanceof BadRequestException) {
        throw error; 
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
