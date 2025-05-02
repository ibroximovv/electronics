import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcrypt";
import { Prisma } from '@prisma/client';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService){}
  async create(createUserDto: CreateAdminDto) {
    try {
      const findUser = await this.prisma.user.findFirst({ where: { email: createUserDto.email }})
      if (findUser) {
        throw new BadRequestException('User already exists')
      }
      const findByPhone = await this.prisma.user.findUnique({
        where: {
          phone: createUserDto.phone,
        },
      });

      if (findByPhone) {
        throw new BadRequestException('User with this phone already exists');
      }

      const hashedPassword = bcrypt.hashSync(createUserDto.password, 10)
      return await this.prisma.user.create({ data: {
        ...createUserDto,
        password: hashedPassword
      }});
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; 
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findAll(query: GetUserDto) {
    try {
      const { page = 1, limit = 10, year, sortBy = 'createdAt', sortOrder = 'desc', search } = query;
  
      const skip = (page - 1) * limit;
  
      const where: Prisma.UserWhereInput = {
        AND: [
          year
            ? {
                year: {
                  equals: year,
                },
              }
            : {},
          search
            ? {
                OR: [
                  { firstName: { contains: search, mode: Prisma.QueryMode.insensitive } },
                  { lastName: { contains: search, mode: Prisma.QueryMode.insensitive } },
                  { phone: { contains: search, mode: Prisma.QueryMode.insensitive } },
                ],
              }
            : {},
        ],
      };
  
      const orderBy = {
        [sortBy]: sortOrder,
      };
  
      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include: {
            Region: true
          },
          omit: {regionId: true}
        }),
        this.prisma.user.count({ where }),
      ]);
  
      return {
        data: users,
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
      const findOne = await this.prisma.user.findFirst({ where: { id }, 
        include: {
          Region: true
        },
        omit: {regionId: true}
      })
      if (!findOne) {
        throw new BadRequestException('User not found')
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

  async update(id: string, updateUserDto: UpdateAdminDto) {
    try {
      const findOne = await this.prisma.user.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('User not found')
      }
      if (updateUserDto.password) {
        updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10)
      }
      return await this.prisma.user.update({ where: { id }, data: updateUserDto, 
        include: {
          Region: true
        },
        omit: {regionId: true}
      });
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
      const findOne = await this.prisma.user.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('User not found')
      }
      return await this.prisma.user.delete({ where: { id }, 
        include: {
          Region: true
        },
        omit: {regionId: true}
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; 
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
