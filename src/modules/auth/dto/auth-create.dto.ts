import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    type: String,
    example: 'Example',
  })
  @IsNotEmpty({ message: 'RE-104' })
  @IsString()
  full_name: string;

  @ApiProperty({
    type: String,
    example: 'Example@example.com',
  })
  @IsNotEmpty({ message: 'RE-104' })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    example: 'Test12345',
  })
  @IsNotEmpty({ message: 'RE-104' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    type: String,
    example: 'Test12345',
  })
  @IsNotEmpty({ message: 'RE-104' })
  @IsString()
  @MinLength(6)
  confirm_password: string;
}
