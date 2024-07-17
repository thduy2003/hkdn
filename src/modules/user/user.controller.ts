import { Body, Controller, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { BaseController } from '@core/services/base.controller';
import { User } from '@database/typeorm/entities';
import { UserQueryDto } from './dto/user-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '@modules/auth/guard/roles.decorator';
import { USER_ROLE } from '@shared/enum/user.enum';
import { AuthGuard } from '@modules/auth/guard/auth.guard';
import { RolesGuard } from '@modules/auth/guard/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { EnrollClassDto } from './dto/enroll-class.dto';
import { ApiOkResponseDefault } from '@core/services/response.decorator';

@Controller('')
export class UserController extends BaseController<User, UserService, UserQueryDto>(
  User,
  UserService,
  UserQueryDto,
  CreateUserDto,
) {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
  @Post('/user/:classId')
  @Roles(USER_ROLE.EMPLOYEE)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    tags: ['user'],
    operationId: 'enrollClass',
    summary: 'Enroll a class',
    description: 'Enroll a class',
  })
  @ApiParam({
    name: 'classId',
    required: true,
    description: 'ID of the class to enroll',
    type: 'integer',
  })
  @ApiOkResponseDefault(String)
  @ApiBearerAuth('token')
  async enrollClass(@Body() data: EnrollClassDto, @Param('classId') classId: number): Promise<string> {
    return this.userService.enrollClass(data, classId);
  }
}
