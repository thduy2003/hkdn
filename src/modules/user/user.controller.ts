import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
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
import { UpdateEnrollmentDateDto } from './dto/update-enroll-date.dto';

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
  @Post('/user/enroll/:classId')
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
  @Post('/user/unenroll/:classId')
  @Roles(USER_ROLE.EMPLOYEE)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    tags: ['user'],
    operationId: 'unenrollClass',
    summary: 'unEnroll a class',
    description: 'unEnroll a class',
  })
  @ApiParam({
    name: 'classId',
    required: true,
    description: 'ID of the class to enroll',
    type: 'integer',
  })
  @ApiOkResponseDefault(String, HttpStatus.NO_CONTENT)
  @ApiBearerAuth('token')
  async unEnrollClass(@Body() data: EnrollClassDto, @Param('classId') classId: number): Promise<string> {
    return this.userService.unEnrollClass(data, classId);
  }
  @Put('/user/update/:classId')
  @Roles(USER_ROLE.EMPLOYEE)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    tags: ['user'],
    operationId: 'updateEnrollmentDate',
    summary: 'update class enrollment date',
    description: 'update class enrollment date',
  })
  @ApiParam({
    name: 'classId',
    required: true,
    description: 'ID of the class to update enrollment date',
    type: 'integer',
  })
  @ApiOkResponseDefault(String, HttpStatus.OK)
  @ApiBearerAuth('token')
  async updateEnrollmentDate(
    @Body() data: UpdateEnrollmentDateDto,
    @Param('classId') classId: number,
  ): Promise<string> {
    return this.userService.updateEnrollmentDate(data, classId);
  }
}
