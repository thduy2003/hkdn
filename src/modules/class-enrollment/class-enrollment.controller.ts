import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClassEnrollmentService } from './class-enrollment.service';
import { Roles } from '@modules/auth/guard/roles.decorator';
import { USER_ROLE } from '@shared/enum/user.enum';
import { AuthGuard } from '@modules/auth/guard/auth.guard';
import { RolesGuard } from '@modules/auth/guard/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PageDto } from '@core/pagination/dto/page-dto';
import { ClassEnrollment } from '@database/typeorm/entities/class-enrollment.entity';
import { ClassEnrollmentQueryDto } from './dto/class-enrollment-query.dto';

@Controller('class-enrollment')
export class ClassEnrollmentController {
  constructor(
    private readonly classEnrollmentService: ClassEnrollmentService,
  ) {}
  @Get('')
  @Roles(USER_ROLE.EMPLOYEE)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    tags: ['class-enrollment'],
    operationId: 'getAllClassEnrollment',
    summary: 'Get all ClassEnrollment',
    description: 'Get all ClassEnrollment',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: PageDto<ClassEnrollment>,
  })
  @ApiBearerAuth('token')
  async getAll(
    @Query() pageOptionsDto: ClassEnrollmentQueryDto,
  ): Promise<PageDto<ClassEnrollment>> {
    return this.classEnrollmentService.findAll(pageOptionsDto);
  }
}
