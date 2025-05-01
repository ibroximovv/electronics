import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

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

  async findAll() {
    try {
      return await this.prisma.comment.findMany();
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async findOne(id: string) {
    try {
      const findOne = await this.prisma.comment.findFirst({ where: { id }})
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
      return await this.prisma.comment.update({ where: { id }, data: updateCommentDto });
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
      return await this.prisma.comment.delete({ where: { id }});
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }
}
