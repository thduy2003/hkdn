import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class AddExamDto {
  @ApiProperty({
    type: Array<number>,
    example: [1, 2],
  })
  @IsNotEmpty()
  @IsArray()
  examIds: number[];
}
