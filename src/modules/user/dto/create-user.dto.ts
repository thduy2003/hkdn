import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  readonly fullName?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  readonly email?: string;
}
