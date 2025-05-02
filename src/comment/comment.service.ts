import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { GetCommentDto } from './dto/get-comment.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService){}
  async create(createCommentDto: CreateCommentDto, req: Request) {
    try {
      const createNewComment = await this.prisma.comment.create({ data: {
        ...createCommentDto,
        userId: req['user-id']
      }})
      return createNewComment;
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async findAll(query: GetCommentDto) {
    try {
      const { page = 1, limit = 10, productId, sortBy = 'createdAt', sortOrder = 'desc' } = query;
  
      const skip = (page - 1) * limit;
  
      const where: Prisma.CommentWhereInput = {
        ...(productId && { productId: { equals: productId } }),
      };
  
      const orderBy = {
        [sortBy]: sortOrder,
      };
  
      const [comments, total] = await Promise.all([
        this.prisma.comment.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include: {
            User: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            },
            Product: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
          },
          omit: { userId: true, productId: true } 
        }),
        this.prisma.comment.count({ where }),
      ]);
  
      return {
        data: comments,
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
      const findOne = await this.prisma.comment.findFirst({ where: { id }, 
        include: {
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          Product: {
            select: {
              id: true,
              name: true,
              price: true
            }
          }
        },
        omit: { userId: true, productId: true } 
      })
      if (!findOne) {
        throw new BadRequestException('Comment not found')
      }
      return findOne;
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    try {
      const findOne = await this.prisma.comment.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('Comment not found')
      }
      return await this.prisma.comment.update({ where: { id }, data: updateCommentDto,
        include: {
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          Product: {
            select: {
              id: true,
              name: true,
              price: true
            }
          }
        },
        omit: { userId: true, productId: true } 
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async remove(id: string) {
    try {
      const findOne = await this.prisma.comment.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('Comment not found')
      }
      return await this.prisma.comment.delete({ where: { id }, 
        include: {
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          Product: {
            select: {
              id: true,
              name: true,
              price: true
            }
          }
        },
        omit: { userId: true, productId: true } 
      });
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }
}
