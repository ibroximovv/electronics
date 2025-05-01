import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService){}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({ data: createCategoryDto });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Region name must be unique');
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findAll() {
    try {
      return await this.prisma.category.findMany();
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findOne(id: string) {
    try {
      const findOne = await this.prisma.category.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('Category not found')
      }
      return findOne;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; 
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const findOne = await this.prisma.category.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('Category not found')
      }
      return await this.prisma.category.update({ where: { id }, data: updateCategoryDto });
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

      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async remove(id: string) {
    try {
      const findOne = await this.prisma.category.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('Category not found')
      }
      return await this.prisma.category.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; 
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
