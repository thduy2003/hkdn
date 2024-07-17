import { Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ClassService } from './class.service';
import { BaseController } from '@core/services/base.controller';
import { Class } from '@database/typeorm/entities/class.entity';
import { ClassQueryDto } from './dto/class-query.dto';
import { Roles } from '@modules/auth/guard/roles.decorator';
import { USER_ROLE } from '@shared/enum/user.enum';
import { AuthGuard } from '@modules/auth/guard/auth.guard';
import { RolesGuard } from '@modules/auth/guard/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApiOkResponseDefault } from '@core/services/response.decorator';

@Controller('')
export class ClassController extends BaseController<Class, ClassService, ClassQueryDto>(
  Class,
  ClassService,
  ClassQueryDto,
) {
  constructor(private readonly classService: ClassService) {
    super(classService);
  }
  @Get('/class/:id')
  @Roles(USER_ROLE.EMPLOYEE)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    tags: ['class'],
    operationId: 'getClassDetail',
    summary: 'Get class detail',
    description: 'Get class detail',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the class ',
    type: 'integer',
  })
  @ApiOkResponseDefault(Class)
  @ApiBearerAuth('token')
  async enrollClass(@Param('id') classId: number): Promise<Class> {
    return this.classService.getClassDetail(classId);
  }
}
