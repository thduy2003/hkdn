import { Controller } from '@nestjs/common';
import { ExamService } from './exam.service';
import { BaseController } from '@core/services/base.controller';
import { Exam } from '@database/typeorm/entities/exam.entity';
import { USER_ROLE } from '@shared/enum/user.enum';

@Controller('')
export class ExamController extends BaseController<Exam, ExamService>(Exam, ExamService, [], [], {
  findList: [USER_ROLE.TEACHER, USER_ROLE.EMPLOYEE, USER_ROLE.STUDENT],
}) {
  constructor(private readonly examService: ExamService) {
    super(examService);
  }
  // @Post('enter-result')
  // @Roles(USER_ROLE.TEACHER)
  // @UseGuards(AuthGuard, RolesGuard)
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOperation({
  //   tags: ['exam'],
  //   operationId: 'enterResult',
  //   summary: 'Enter result for a exam',
  //   description: 'Enter result for a exam',
  // })
  // @ApiResponse({
  //   status: HttpStatus.CREATED,
  //   description: 'Successful',
  //   type: EnterResultDto,
  // })
  // @ApiBearerAuth('token')
  // async createClass(@Body() data: EnterResultDto, @CurrentUser() user: JwtPayload): Promise<ExamResult> {
  //   return this.examService.enterResult(data, user);
  // }
}
