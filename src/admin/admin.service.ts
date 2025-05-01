import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcrypt";

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

  async findAll() {
    try {
      return await this.prisma.user.findMany();
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findOne(id: string) {
    try {
      const findOne = await this.prisma.user.findFirst({ where: { id }})
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
      return await this.prisma.user.update({ where: { id }, data: updateUserDto});
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
      return await this.prisma.user.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; 
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
