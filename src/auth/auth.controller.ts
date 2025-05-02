import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto)
  }

  @Post('verify-otp')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto)
  }

  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.register(data)
  }
  
  @Post('login')
  login(@Body() data: LoginDto, @Req() req: Request) {
    return this.authService.login(data, req);
  }

  @Post('refresh-token')
  refreshToken(@Body() refreshToken: RefreshTokenDto ) {
    return this.authService.refreshToken(refreshToken.refreshToken)
  }
}
