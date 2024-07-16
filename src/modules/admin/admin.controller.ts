import { Controller } from '@nestjs/common';
import { UserService } from '@modules/user/user.service';
import { User } from '@database/typeorm/entities';
import { UserQueryDto } from '@modules/user/dto/user-query.dto';
import { BaseController } from '@core/services/base.controller';

@Controller('admin')
export class AdminController {
  constructor(private readonly userService: UserService) {}
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
  //   @Query() pageOptionsDto: UserQueryDto,
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
