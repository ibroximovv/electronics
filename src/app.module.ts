import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SmsService } from './sms/sms.service';
import { MailModule } from './mail/mail.module';
import { RegionModule } from './region/region.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { CommentModule } from './comment/comment.module';
import { OrderModule } from './order/order.module';
import { LikesModule } from './likes/likes.module';
import { ChatModule } from './chat/chat.module';
import { AdminModule } from './admin/admin.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [PrismaModule, AuthModule, MailModule, RegionModule, CategoryModule, ProductModule, CommentModule, OrderModule, LikesModule, ChatModule, AdminModule, MessageModule],
  controllers: [AppController],
  providers: [AppService, SmsService],
})
export class AppModule {}
