import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SmsService } from 'src/sms/sms.service';
import { MailService } from 'src/mail/mail.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({
    global: true,
    secret: 'nimadir'
  })],
  controllers: [AuthController],
  providers: [AuthService, SmsService],
})
export class AuthModule {}
