import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { LastViewedService } from './last-viewed.service';
import { CreateLastViewedDto } from './dto/create-last-viewed.dto';
import { UpdateLastViewedDto } from './dto/update-last-viewed.dto';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { RolesDecorator } from 'src/common/role.decorator';
import { UserRole } from '@prisma/client';
import { Request } from 'express';
import { GetViewedPrdDto } from './dto/get-last-viewed.dto';
import { SessionGuard } from 'src/session/session.guard';

@Controller('last-viewed')
export class LastViewedController {
  constructor(private readonly lastViewedService: LastViewedService) {}

  @Get()
  findAll(@Req() req: Request, @Query() query: GetViewedPrdDto) {
    return this.lastViewedService.findAll(req, query);
  }

  @RolesDecorator(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthorizationGuard, SessionGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lastViewedService.remove(id);
  }
}
