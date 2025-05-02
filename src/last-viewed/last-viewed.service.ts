import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateLastViewedDto } from './dto/create-last-viewed.dto';
import { UpdateLastViewedDto } from './dto/update-last-viewed.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { GetViewedPrdDto } from './dto/get-last-viewed.dto';

@Injectable()
export class LastViewedService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(req: Request, query: GetViewedPrdDto) {
    try {
      const { page = 1, limit = 10 } = query;
      const userId = req['user-id'];
  
      const skip = (page - 1) * limit;
  
      const [viewedProducts, total] = await Promise.all([
        this.prisma.viewedPrd.findMany({
          where: { userId },
          skip,
          take: limit,
          include: {
            User: true,
            Product: true
          },
          omit: { userId: true, productId: true }
        }),
        this.prisma.viewedPrd.count({ where: { userId } }),
      ]);
  
      return {
        data: viewedProducts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error');
    }
  }

  async remove(id: string) {
    try {
      const findOne = await this.prisma.viewedPrd.findFirst({ where: { id }, 
        include: {
          User: true,
          Product: true
        },
        omit: { userId: true, productId: true }
      })
      if(!findOne) {
        throw new BadRequestException('LastViewed not found')
      }
      return await this.prisma.viewedPrd.delete({ where: { id }})
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; 
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }
}
