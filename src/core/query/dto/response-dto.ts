import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty({
    type: Number,
    example: 200,
  })
  readonly statusCode: number;
  @ApiProperty({
    example: 'Example',
  })
  readonly data: T;
}
