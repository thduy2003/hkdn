import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({
    type: String,
    example: 'Example',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
