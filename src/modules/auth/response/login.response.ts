import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty({
    type: String,
    example: 'eyjdqoidjoqjdoi',
  })
  access_token: string;
  @ApiProperty({
    type: Number,
    example: 'eyjdqoidjoqjdoi',
  })
  expired_at: number;
}
