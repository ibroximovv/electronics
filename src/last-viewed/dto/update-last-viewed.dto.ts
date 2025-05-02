import { PartialType } from '@nestjs/swagger';
import { CreateLastViewedDto } from './create-last-viewed.dto';

export class UpdateLastViewedDto extends PartialType(CreateLastViewedDto) {}
