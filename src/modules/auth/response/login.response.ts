import { User } from '@database/typeorm/entities';
import { UserResponeDto } from '@modules/user/dto/user-response.dto';
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
  @ApiProperty({
    type: UserResponeDto,
    example: {
      id: 'string',
      name: 'string',
      email: 'string',
      role: 'USER_ROLE',
    },
  })
  user: UserResponeDto;
}
