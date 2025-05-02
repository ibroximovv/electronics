import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserRole } from '@prisma/client';
import { RolesDecorator } from 'src/common/role.decorator';
import { GetRegionDto } from './dto/get-region.dto';
import { SessionGuard } from 'src/session/session.guard';

@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @RolesDecorator(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthorizationGuard, SessionGuard)
  @Post()
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionService.create(createRegionDto);
  }

  @Get()
  findAll(@Query() query: GetRegionDto) {
    return this.regionService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regionService.findOne(id);
  }

  @RolesDecorator(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthorizationGuard, SessionGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionService.update(id, updateRegionDto);
  }

  @RolesDecorator(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthorizationGuard, SessionGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regionService.remove(id);
  }
}
