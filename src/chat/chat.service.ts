import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService){}
  async create(createChatDto: CreateChatDto, req: Request) {
    try {
      if (req['user-id'] === createChatDto.toId) {
        throw new BadRequestException("Can't create a chat with yourself");
      }
      const findOne = await this.prisma.chat.findFirst({ where: { fromId: req['user-id'], toId: createChatDto.toId }})
      if(findOne) {
        throw new BadRequestException('Chat already exists')
      }
      return await this.prisma.chat.create({ data: {
        toId: createChatDto.toId,
        fromId: req['user-id']
      }});
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
      return await this.prisma.chat.findMany();
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async findOne(id: string) {
    try {
      const findOne = await this.prisma.chat.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('Chat not found')
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

  async update(id: string, updateChatDto: UpdateChatDto) {
    try {
      const findOne = await this.prisma.chat.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('Chat not found')
      }
      return await this.prisma.chat.update({ where: { id }, data: updateChatDto });
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
      const findOne = await this.prisma.chat.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('Chat not found')
      }
      return await this.prisma.chat.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; 
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }
}
