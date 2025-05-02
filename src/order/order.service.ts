import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { GetOrderDto } from './dto/get-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService){}
  async create(data: CreateOrderDto, req: Request) {
    try {
      const prd = await this.prisma.product.findFirst({ where: { id: data.productId }})
      if (!prd) {
        throw new BadRequestException('Product not found')
      }
      if ( prd.count < data.count) {
        throw new BadRequestException(`There are not enough products, a maximum of ${prd.count} can be purchased.`)
      }
      if (!prd.colors.includes(data.color)) {
        throw new BadRequestException(`This product is not available in this color.`)
      }
      const createdNewOrder = await this.prisma.order.create({ data: {
        ...data,
        userId: req['user-id']
      }})

      await this.prisma.product.update({ where: { id: data.productId}, data: {
        count: prd.count - data.count
      }})
      return createdNewOrder;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; 
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async findAll(query: GetOrderDto) {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', productId } = query;
  
      const skip = (page - 1) * limit;
  
      const where: Prisma.OrderWhereInput = {
        ...(productId && { productId: { equals: productId } }),
      };
  
      const orderBy = {
        [sortBy]: sortOrder,
      };
  
      const [orders, total] = await Promise.all([
        this.prisma.order.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include: {
            User: {
              select: {
                id: true,
                firstName: true,
                phone: true
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
          omit: { productId: true, userId: true }
        }),
        this.prisma.order.count({ where }),
      ]);
  
      return {
        data: orders,
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
      const findOne = await this.prisma.order.findFirst({ where: { id },
        include: {
          User: {
            select: {
              id: true,
              firstName: true,
              phone: true
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
        omit: { productId: true, userId: true }
      })
      if (!findOne) {
        throw new BadRequestException('Order not found')
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

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const findOne = await this.prisma.order.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('Order not found')
      }
      let findPrd = await this.prisma.product.findFirst({ where: { id: findOne.productId }})
      if (updateOrderDto.productId) {
        findPrd = await this.prisma.product.findFirst({ where: { id: updateOrderDto.productId }})
        if (!findPrd) {
          throw new BadRequestException('The product you want to change was not found.')
        }
      }
      if (updateOrderDto.count) {
        if (findPrd?.count && findPrd.count > updateOrderDto.count)
        await this.prisma.product.update({ where: { id: findPrd?.id}, data: { count: findPrd.count - updateOrderDto.count }})
      }

      if (updateOrderDto.color) {
        if (!findPrd?.colors.includes(updateOrderDto.color)) {
          throw new BadRequestException('This product is not available in this color.')
        }
      }
      return await this.prisma.order.update({ where: { id }, data: updateOrderDto, 
        include: {
          User: {
            select: {
              id: true,
              firstName: true,
              phone: true
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
        omit: { productId: true, userId: true }
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
      const findOne = await this.prisma.order.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('Order not found')
      }
      const deletedOrder = await this.prisma.order.delete({ where: { id },
        include: {
          User: {
            select: {
              id: true,
              firstName: true,
              phone: true
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
        omit: { productId: true, userId: true }
      })
      const findPrd = await this.prisma.product.findFirst({ where: { id: findOne.productId }})
      if(!findPrd) {
        throw new BadRequestException('Product not found')
      }

      await this.prisma.product.update({ where: { id: findOne.productId }, data: {
        count: findPrd.count + deletedOrder.count
      }})
      return deletedOrder;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; 
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }
}
