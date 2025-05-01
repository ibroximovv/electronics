import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService){}
  async create(createMessageDto: CreateMessageDto, req: Request) {
    try {
      if (req['user-id'] === createMessageDto.toId) {
        throw new BadRequestException("Can't create a message with yourself");
      }
      return await this.prisma.message.create({ data: {
        ...createMessageDto,
        fromId: req['user-id']
      }})
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; 
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async findAll() {
    try {
      return await this.prisma.message.findMany();
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async findOne(id: string) {
    try {
      const findOne = await this.prisma.message.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('Message not found')
      }
      return findOne;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; 
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    try {
      const findOne = await this.prisma.message.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('Message not found')
      }
      return await this.prisma.message.update({ where: { id }, data: updateMessageDto });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; 
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async remove(id: string) {
    try {
      const findOne = await this.prisma.message.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('Message not found')
      }
      return await this.prisma.message.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; 
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }
}
