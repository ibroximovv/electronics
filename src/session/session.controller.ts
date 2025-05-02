import { Controller, Get, Delete, Param, Query, UseGuards, Req } from '@nestjs/common';
import { SessionService } from './session.service';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';
import { SessionGuard } from './session.guard';
import { Request } from 'express';


@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Delete('sessions/:id')
  @UseGuards(AuthorizationGuard)
  async deleteSession(@Param('id') id: string) {
    await this.sessionService.deleteSession(id);
    return { message: 'Session deleted' };
  }

  @Get('sessions')
  @UseGuards(AuthorizationGuard, SessionGuard) 
  async getUserSessions(@Req() req: Request) {
    const sessions = await this.sessionService.getUserSessions(req['user-id']);
    return sessions;
  }
}
