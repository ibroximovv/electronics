import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { Request } from 'express';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(AuthorizationGuard)
  @Post()
  create(@Body() createLikeDto: CreateLikeDto, @Req() req: Request) {
    return this.likesService.create(createLikeDto, req);
  }

  @Get()
  findAll() {
    return this.likesService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.likesService.findOne(id);
  // }

  @UseGuards(AuthorizationGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLikeDto: UpdateLikeDto) {
    return this.likesService.update(id, updateLikeDto);
  }

  @UseGuards(AuthorizationGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likesService.remove(id);
  }
}
