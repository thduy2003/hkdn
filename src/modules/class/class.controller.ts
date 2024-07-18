import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ClassService } from './class.service';
import { BaseController } from '@core/services/base.controller';
import { Class } from '@database/typeorm/entities/class.entity';
import { ClassQueryDto } from './dto/class-query.dto';
import { Roles } from '@modules/auth/guard/roles.decorator';
import { USER_ROLE } from '@shared/enum/user.enum';
import { AuthGuard } from '@modules/auth/guard/auth.guard';
import { RolesGuard } from '@modules/auth/guard/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ApiOkResponseDefault } from '@core/services/response.decorator';
import { PageDto } from '@core/pagination/dto/page-dto';
import { User } from '@database/typeorm/entities';
import { StudentsQueryDto } from './dto/students-query.dto';
import { EnterResultDto } from '@modules/exam/dto/enter-result.dto';

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
  @HttpCode(HttpStatus.OK)
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
  @Get('/class/:id/students')
  @Roles(USER_ROLE.EMPLOYEE)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    tags: ['class'],
    operationId: 'getStudentsInClass',
    summary: 'Get all students in the class',
    description: 'Get all students in the class',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the class ',
    type: 'integer',
  })
  @ApiOkResponseDefault(Class)
  @ApiBearerAuth('token')
  async getStudentsInClass(@Param('id') classId: number, @Query() query: StudentsQueryDto): Promise<PageDto<User>> {
    return this.classService.getStudentsInClass(classId, query);
  }
  @Post('/class/:classId/:studentId/result')
  @Roles(USER_ROLE.TEACHER)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    tags: ['class'],
    operationId: 'enterResult',
    summary: 'Enter result for a student in the class',
    description: 'Enter result for a student in the class',
  })
  @ApiParam({
    name: 'classId',
    required: true,
    description: 'ID of the class ',
    type: 'integer',
  })
  @ApiParam({
    name: 'studentId',
    required: true,
    description: 'ID of the student ',
    type: 'integer',
  })
  @ApiOkResponseDefault(String)
  @ApiBearerAuth('token')
  async enterResult(
    @Body() data: EnterResultDto,
    @Param('classId') classId: number,
    @Param('studentId') studentId: number,
  ): Promise<string> {
    return this.classService.enterResult(data, classId, studentId);
  }
}
