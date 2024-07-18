import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { EnrollClassDto } from './enroll-class.dto';

export class UpdateEnrollmentDateDto extends EnrollClassDto {
  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  @IsNotEmpty()
  enrollmentDate: Date;
}
