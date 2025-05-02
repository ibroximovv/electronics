import { Module } from '@nestjs/common';
import { LastViewedService } from './last-viewed.service';
import { LastViewedController } from './last-viewed.controller';

@Module({
  controllers: [LastViewedController],
  providers: [LastViewedService],
})
export class LastViewedModule {}
