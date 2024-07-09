import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PageDto } from '@core/pagination/dto/page-dto';
import { PageOptionsDto } from '@core/pagination/dto/page-option.dto';
import { User } from '@database/typeorm/entities';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    tags: ['user'],
    operationId: 'getAllUser',
    summary: 'Get all user',
    description: 'Get all user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: PageDto,
  })
  async findMany(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    return this.userService.findAll(pageOptionsDto);
  }
}
