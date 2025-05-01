import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService){}
  async create(createLikeDto: CreateLikeDto, req: Request) {
    try {
      const findLikesByUserId = await this.prisma.likedPrd.findFirst({ where: { userId: req['user-id'] }})
      if (findLikesByUserId) {
        throw new BadRequestException(`you have already liked the product ID: ${findLikesByUserId.productId}`)
      }
      return await this.prisma.likedPrd.create({ data: {
        ...createLikeDto,
        userId: req['user-id'],
        count: 1
      }});
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async findAll() {
    try {
      return await this.prisma.likedPrd.findMany();
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async findOne(id: string) {
    try {
      const findOne = await this.prisma.likedPrd.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('LikedPrd not found')
      }
      return findOne;
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async update(id: string, updateLikeDto: UpdateLikeDto) {
    try {
      const findOne = await this.prisma.likedPrd.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('LikedPrd not found')
      }
      return await this.prisma.likedPrd.update({ where: { id }, data: updateLikeDto });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async remove(id: string) {
    try {
      const findOne = await this.prisma.likedPrd.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('LikedPrd not found')
      }
      return await this.prisma.likedPrd.delete({ where: { id }});
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }
}
