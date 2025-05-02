import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetChatDto } from './dto/get-chat.dto';

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

  async findAll(query: GetChatDto) {
    try {
      const { page = 1, limit = 10 } = query;
  
      const skip = (page - 1) * limit;
  
      const [chats, total] = await Promise.all([
        this.prisma.chat.findMany({
          skip,
          take: limit,
          include: {
            from: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
                photo: true
              }
            },
            to: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
                photo: true,
              }
            }
          },
          omit: { toId: true, fromId: true }
        }),
        this.prisma.chat.count(),
      ]);
  
      return {
        data: chats,
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
      const findOne = await this.prisma.chat.findFirst({ where: { id },
        include: {
          from: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              photo: true
            }
          },
          to: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              photo: true,
            }
          }
        },
        omit: { toId: true, fromId: true }
      })
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
      return await this.prisma.chat.update({ where: { id }, data: updateChatDto, 
        include: {
          from: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              photo: true
            }
          },
          to: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              photo: true,
            }
          }
        },
        omit: { toId: true, fromId: true }
      });
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
      const findOne = await this.prisma.chat.findFirst({ where: { id }, 
        include: {
          from: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              photo: true
            }
          },
          to: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              photo: true,
            }
          }
        },
        omit: { toId: true, fromId: true }
      })
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
