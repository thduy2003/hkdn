import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateClassDto {
  @ApiProperty({
    type: String,
    example: 'Example',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: Date,
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    type: Date,
  })
  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  teacherId: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  courseId: number;
}
