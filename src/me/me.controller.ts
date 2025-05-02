import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { MeService } from './me.service';
import { Request } from 'express';
import { UpdateMeDto } from './dto/update-me.dto';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';
import { SessionGuard } from 'src/session/session.guard';

@Controller('my')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @UseGuards(AuthorizationGuard, SessionGuard)
  @Get('profile')
  getMyProfile(@Req() req: Request){
    return this.meService.getMeProfile(req)
  }

  @UseGuards(AuthorizationGuard, SessionGuard)
  @Get('products')
  getMyProducts(@Req() req: Request){
    return this.meService.getMeProducts(req)
  }

  @UseGuards(AuthorizationGuard, SessionGuard)
  @Get('orders')
  getMyOrders(@Req() req: Request){
    return this.meService.getMeOrder(req)
  }

  @UseGuards(AuthorizationGuard, SessionGuard)
  @Get('liked-product')
  getMyLiked(@Req() req: Request){
    return this.meService.getMeLikeProducts(req)
  }

  @UseGuards(AuthorizationGuard, SessionGuard)
  @Patch('profile')
  updateMyProfile(@Req() req: Request, @Body() data: UpdateMeDto){
    return this.meService.updateProfile(req, data)
  }

  @UseGuards(AuthorizationGuard, SessionGuard)
  @Delete('profile')
  deleteMyProfile(@Req() req: Request){
    return this.meService.deleteMeProdfile(req)
  }  
}