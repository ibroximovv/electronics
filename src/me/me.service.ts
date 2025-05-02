import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateMeDto } from './dto/update-me.dto';
import * as bcrypt from "bcrypt";

@Injectable()
export class MeService {
    constructor(private readonly prisma: PrismaService){}

    async getMeProducts(req: Request){
        try {
            return await this.prisma.product.findMany({ where: { userId: req['user-id'] }, include: {
                User: true,
                Category: true
            },
            omit: { categoryId: true, userId: true }
        })
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error
            }
            console.log(error.message);
            throw new InternalServerErrorException(error.message || 'Internal server Error')
        }
    }

    async getMeLikeProducts(req: Request){
        try {
            return await this.prisma.likedPrd.findMany({ where: { userId: req['user-id'] }, include: {
                User: true,
                Product: true
            },
            omit: { userId: true, productId: true }
        })
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error
            }
            console.log(error.message);
            throw new InternalServerErrorException(error.message || 'Internal server Error')
        }
    }

    async getMeOrder(req: Request){
        try {
            return await this.prisma.order.findMany({ where: { userId: req['user-id'] }, include: {
                User: true,
                Product: true
            },
            omit: { userId: true, productId: true }
        })
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error
            }
            console.log(error.message);
            throw new InternalServerErrorException(error.message || 'Internal server Error')
        }
    }

    async updateProfile(req: Request, data: UpdateMeDto ) {
        try {
            const findData = await this.prisma.user.findFirst({ where: { id: req['user-id'] }, include: {
                Region: true
            },
                omit: { regionId: true }
            })
            if (!findData) {
                throw new BadRequestException('Your data not found')
            }

            let hashedPassword = findData.password
            if (data.password) {
                hashedPassword = bcrypt.hashSync(data.password, 10)
            }
            return await this.prisma.user.update({ where: { id: req['user-id'] }, data: {
                ...data,
                password: hashedPassword
            } , 
                include: {
                    Region: true
                },
                omit: { regionId: true }
            })
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error
            }
            console.log(error.message);
            throw new InternalServerErrorException(error.message || 'Internal server Error')
        }
    }

    async getMeProfile(req: Request) {
        try {
            const findData = await this.prisma.user.findFirst({ where: { id: req['user-id'] }, include: {
                Region: true
            },
                omit: { regionId: true }
            })
            if (!findData) {
                throw new BadRequestException('Your data not found')
            }
            return findData
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error
            }
            console.log(error.message);
            throw new InternalServerErrorException(error.message || 'Internal server Error')
        }
    }

    async deleteMeProdfile(req: Request) {
        try {
            const findData = await this.prisma.user.findFirst({ where: { id: req['user-id'] }, include: {
                Region: true
            },
                omit: { regionId: true }
            })
            if (!findData) {
                throw new BadRequestException('Your data not found')
            }
            return await this.prisma.user.delete({ where: { id: req['user-id']}})
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error
            }
            console.log(error.message);
            throw new InternalServerErrorException(error.message || 'Internal server Error')
        }
    }
}
