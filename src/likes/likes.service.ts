import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { GetLikedPrdDto } from './dto/get-like.dto';

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

  async findAll(query: GetLikedPrdDto, req: Request) {
    try {
      const { page = 1, limit = 10 } = query;
  
      const skip = (page - 1) * limit;
  
      const [likedProducts, total] = await Promise.all([
        this.prisma.likedPrd.findMany({
          where: { userId: req['user-id']},
          skip,
          take: limit,
          include: {
            Product: true,
            User: {
              select: {
                id: true,
                firstName: true,
                phone: true
              }
            }
          },
          omit: {productId: true, userId: true}
        }),
        this.prisma.likedPrd.count(),
      ]);
  
      return {
        data: likedProducts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal Server Error');
    }
  }

  async findOne(id: string) {
    try {
      const findOne = await this.prisma.likedPrd.findFirst({ where: { id }, 
        include: {
          Product: true,
          User: {
            select: {
              id: true,
              firstName: true,
              phone: true
            }
          }
        },
        omit: {productId: true, userId: true}
      })
      if (!findOne) {
        throw new BadRequestException('LikedPrd not found')
      }
      return findOne;
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
      return await this.prisma.likedPrd.delete({ where: { id }, 
        include: {
          Product: true,
          User: {
            select: {
              id: true,
              firstName: true,
              phone: true,
            }
          }
        },
        omit: {productId: true, userId: true}
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }
}
