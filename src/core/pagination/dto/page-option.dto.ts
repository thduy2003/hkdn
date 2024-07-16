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

export class PageOptionsDto {
  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  order?: Order = Order.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: DEFAULT_PAGE,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  @IsNotEmpty({ message: 'PAG-104' })
  page?: number = DEFAULT_PAGE;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: MAX_LIMIT,
    default: DEFAULT_LIMIT,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT)
  @IsOptional()
  @IsNotEmpty({ message: 'PAG-104' })
  page_size?: number = DEFAULT_LIMIT;

  // @ApiPropertyOptional({
  //   type: 'object',
  //   additionalProperties: true,
  //   example: {
  //     query: {
  //       key1: 'value1',
  //       key2: 'value2',
  //       key3: 'value3',
  //     },
  //   },
  // })
  // @Type((options) => options.newObject)
  // @IsOptional()
  // query?: any;

  @ApiPropertyOptional()
  @IsOptional()
  keyword?: string;

  get skip(): number {
    return (this.page - 1) * this.page_size;
  }
}
