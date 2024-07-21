import { PageOptionsDto } from '@core/pagination/dto/page-option.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class NotificationQueryDto extends PageOptionsDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNotEmpty()
  userId: number;
}
