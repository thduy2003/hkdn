import { PageOptionsDto } from '@core/pagination/dto/page-option.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class ClassQueryDto extends PageOptionsDto {}
