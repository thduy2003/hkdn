import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

export class PushNotificationDto {
  @ApiPropertyOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(250)
  body: string;

  @ApiPropertyOptional()
  @IsString()
  username: string;

  @ApiPropertyOptional()
  @IsString()
  token: string;
}
