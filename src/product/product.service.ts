import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService){}
  async create(data: CreateProductDto, req: Request) {
    try {
      const findPrd = await this.prisma.product.findFirst({ where: { name: data.name }})
      if (findPrd) {
        return await this.prisma.product.update({ where: { id: findPrd.id }, data: { ...data, count: findPrd.count + data.count }})
      }
      const created = await this.prisma.product.create({
        data: {
          ...data,
          userId: req['user-id']
        }
      })

      return created;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(`Product with such unique field already exists`);
        }
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findAll() {
    try {
      return await this.prisma.product.findMany();
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findOne(id: string) {
    try {
      const findOne = await this.prisma.product.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('Product not found')
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

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const findOne = await this.prisma.product.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('Product not found')
      }
      return await this.prisma.product.update({ where: { id }, data: updateProductDto });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; 
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async remove(id: string) {
    try {
      const findOne = await this.prisma.product.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('Product not found')
      }
      return await this.prisma.product.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; 
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
