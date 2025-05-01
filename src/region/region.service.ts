import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class RegionService {
  constructor(private readonly prisma: PrismaService){}
  async create(createRegionDto: CreateRegionDto) {
    try {
      return await this.prisma.region.create({ data: createRegionDto });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Region name must be unique');
      }
      console.log(error);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findAll() {
    try {
      return await this.prisma.region.findMany();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findOne(id: string) {
    try {
      const findOne = await this.prisma.region.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('Region not found')
      }
      return findOne;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; 
      }
      console.log(error);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async update(id: string, updateRegionDto: UpdateRegionDto) {
    try {
      const findOne = await this.prisma.region.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('Region not found')
      }
      return await this.prisma.region.update({ where: { id }, data: updateRegionDto });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; 
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Region name already exists');
      }
      console.log(error);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async remove(id: string) {
    try {
      const findOne = await this.prisma.region.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('Region not found')
      }
      return await this.prisma.region.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; 
      }
      console.log(error);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
