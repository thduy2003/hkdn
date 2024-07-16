import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ClassEnrollmentService } from './class-enrollment.service';
import { Roles } from '@modules/auth/guard/roles.decorator';
import { USER_ROLE } from '@shared/enum/user.enum';
import { AuthGuard } from '@modules/auth/guard/auth.guard';
import { RolesGuard } from '@modules/auth/guard/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClassEnrollment } from '@database/typeorm/entities/class-enrollment.entity';
import { ClassEnrollmentQueryDto } from './dto/class-enrollment-query.dto';
import { BaseController } from '@core/services/base.controller';
import { EnrollClassDto } from './dto/enroll-class.dto';

@Controller('')
export class ClassEnrollmentController extends BaseController<
  ClassEnrollment,
  ClassEnrollmentService,
  ClassEnrollmentQueryDto
>(ClassEnrollment, ClassEnrollmentService, ClassEnrollmentQueryDto, 'class-enrollments') {
  constructor(private readonly classEnrollmentService: ClassEnrollmentService) {
    super(classEnrollmentService);
  }
  // @Get('')
  // @Roles(USER_ROLE.EMPLOYEE)
  // @UseGuards(AuthGuard, RolesGuard)
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({
  //   tags: ['class-enrollment'],
  //   operationId: 'getAllClassEnrollment',
  //   summary: 'Get all ClassEnrollment',
  //   description: 'Get all ClassEnrollment',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Successful',
  //   type: PageDto<ClassEnrollment>,
  // })
  // @ApiBearerAuth('token')
  // async getAll(@Query() pageOptionsDto: ClassEnrollmentQueryDto): Promise<PageDto<ClassEnrollment>> {
  //   return this.classEnrollmentService.findAll(pageOptionsDto);
  // }
  @Post('class-enrollment')
  @Roles(USER_ROLE.EMPLOYEE)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    tags: ['classenrollment'],
    operationId: 'enrollClass',
    summary: 'Enroll class',
    description: 'Enroll class',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful',
    type: ClassEnrollment,
  })
  @ApiBearerAuth('token')
  async createClass(@Body() data: EnrollClassDto): Promise<ClassEnrollment> {
    return this.classEnrollmentService.enrollClass(data);
  }
}
