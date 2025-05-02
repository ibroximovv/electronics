import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Prisma, StatusEnum } from '@prisma/client';
import { GetProductDto } from './dto/get-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService){}
  async create(data: CreateProductDto, req: Request) {
    try {
      const findPrd = await this.prisma.product.findFirst({ where: { name: data.name }})
      if (findPrd) {
        return await this.prisma.product.update({ where: { id: findPrd.id }, data: { ...data, count: findPrd.count + data.count }})
      }
      const findCategory = await this.prisma.category.findFirst({ where: { id: data.categoryId }})
      if (!findCategory) {
        throw new BadRequestException('Category not found')
      }
      const created = await this.prisma.product.create({
        data: {
          ...data,
          userId: req['user-id']
        }
      })

      return created;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(`Product with such unique field already exists`);
        }
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findAll(query: GetProductDto) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        priceFrom,
        priceTo,
        status,
        colors,
        categoryId, 
      } = query;
  
      const skip = (page - 1) * limit;
  
      const where: Prisma.ProductWhereInput = {
        AND: [
          search
            ? {
                name: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              }
            : {},
          priceFrom !== undefined
            ? {
                price: {
                  gte: priceFrom,
                },
              }
            : {},
          priceTo !== undefined
            ? {
                price: {
                  lte: priceTo,
                },
              }
            : {},
          status
            ? {
                status: status as StatusEnum,
              }
            : {},
          colors
            ? {
                colors: {
                  hasSome: colors.split(',').map((c) => c.trim()),
                },
              }
            : {},
          categoryId
            ? {
                categoryId: {
                  equals: categoryId,
                },
              }
            : {},
        ],
      };
  
      const orderBy = {
        [sortBy]: sortOrder,
      };
  
      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include: {
            Category: {
              select: {
                id: true,
                name: true
              }
            },
            User: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                Region: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            },
            Comment: {
              select: {
                id: true,
                star: true,
                text: true,
                User: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true
                  }
                }
              }
            }
          },
          omit: {categoryId: true, userId: true}
        }),
        this.prisma.product.count({ where }),
      ]);

      const productsWithAvg = products.map(product => {
        const comments = product.Comment || [];
        const starAvg = comments.length > 0
          ? comments.reduce((sum, comment) => sum + comment.star, 0) / comments.length
          : 0;
        return {
          ...product,
          starAvg: Number(starAvg.toFixed(2)),
        };
      });
  
      return {
        data: productsWithAvg,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message || 'Internal server error');
    }
  }

  async findOne(id: string, req: Request) {
    try {
      const findOne = await this.prisma.product.findFirst({ where: { id },
        include: {
          Category: {
            select: {
              id: true,
              name: true
            }
          },
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              Region: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        omit: {categoryId: true, userId: true}
      })
      if (!findOne) {
        throw new BadRequestException('Product not found')
      }
      const userId = req['user-id']
      if (userId) {
        const existing = await this.prisma.viewedPrd.findFirst({
          where: {
            userId,
            productId: id,
          },
        });
      
        if (existing) {
          await this.prisma.viewedPrd.update({
            where: { id: existing.id },
            data: {
              count: existing.count + 1,
              createdAt: new Date(),
            },
          });
        } else {
          await this.prisma.viewedPrd.create({
            data: {
              userId,
              productId: id,
              count: 1,
            },
          });
        }
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

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const findOne = await this.prisma.product.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('Product not found')
      }
      return await this.prisma.product.update({ where: { id }, data: updateProductDto,
        include: {
          Category: {
            select: {
              id: true,
              name: true
            }
          },
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              Region: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        omit: {categoryId: true, userId: true}
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
      const findOne = await this.prisma.product.findFirst({ where: { id }})
      if (!findOne) {
        throw new BadRequestException('Product not found')
      }
      return await this.prisma.product.delete({ where: { id }, 
        include: {
          Category: {
            select: {
              id: true,
              name: true
            }
          },
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              Region: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        omit: {categoryId: true, userId: true}
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
