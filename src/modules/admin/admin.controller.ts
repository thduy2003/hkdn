import {
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '@modules/auth/guard/roles.decorator';
import { USER_ROLE } from '@shared/enum/user.enum';
import { RolesGuard } from '@modules/auth/guard/roles.guard';
import { AuthGuard } from '@modules/auth/guard/auth.guard';
import { UserService } from '@modules/user/user.service';
import { PageDto } from '@core/pagination/dto/page-dto';
import { PageOptionsDto } from '@core/pagination/dto/page-option.dto';
import { User } from '@database/typeorm/entities';
import { CreateClassDto } from '@modules/user/dto/create-class.dto';
import { Class } from '@database/typeorm/entities/class.entity';
import { BaseController } from '@core/services/base.controller';

@Controller('admin')
export class AdminController extends BaseController<User, UserService>(
  UserService,
  User,
) {
  // constructor(private readonly userService: UserService) {
  // }
  // @Get('users')
  // @Roles(USER_ROLE.EMPLOYEE, USER_ROLE.STUDENT)
  // @UseGuards(AuthGuard, RolesGuard)
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({
  //   tags: ['admin'],
  //   operationId: 'getAllUser',
  //   summary: 'Get all user',
  //   description: 'Get all user',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successful',
  //   type: PageDto,
  // })
  // @ApiBearerAuth('token')
  // async getAllUsers(
  //   @Query() pageOptionsDto: PageOptionsDto,
  // ): Promise<PageDto<User>> {
  //   return this.userService.findAll(pageOptionsDto);
  // }
  // @Post('class')
  // @Roles(USER_ROLE.EMPLOYEE)
  // @UseGuards(AuthGuard, RolesGuard)
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOperation({
  //   tags: ['admin'],
  //   operationId: 'createClass',
  //   summary: 'Create a class',
  //   description: 'Create a class',
  // })
  // @ApiResponse({
  //   status: HttpStatus.CREATED,
  //   description: 'Successful',
  //   type: CreateClassDto,
  // })
  // @ApiBearerAuth('token')
  // async createClass(@Body() data: CreateClassDto): Promise<Class> {
  //   return this.userService.createClass(data);
  // }
}
