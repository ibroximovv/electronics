import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Session } from '@prisma/client';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async deleteSession(id: string): Promise<void> {
    try {
      const findData = await this.prisma.session.findFirst({ where: { id }})
      if (!findData) {
        throw new BadRequestException('Session not found')
      }
      await this.prisma.session.delete({ where: { id } });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server Error')
    }
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    return this.prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
