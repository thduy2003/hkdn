import { PageOptionsDto } from '@core/pagination/dto/page-option.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UserQueryDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  readonly fullName?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  readonly email?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  readonly role?: string;
}
