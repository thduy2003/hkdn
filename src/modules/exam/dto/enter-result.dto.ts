import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class EnterResultDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  examId: number;

  @ApiProperty({
    type: Number,
    example: 8.8,
  })
  @IsNotEmpty()
  @IsNumber()
  result: number;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  @IsNotEmpty()
  @IsDateString()
  deadlineFeedback: Date;
}
