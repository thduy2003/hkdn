import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { Order } from '../constant/order.constant';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
} from '../constant/pagination.constant';
import { PageOptionsDto } from './page-option.dto';

export class TestDTO extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  readonly name?: string;
}
