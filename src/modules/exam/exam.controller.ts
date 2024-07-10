import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { Roles } from '@modules/auth/guard/roles.decorator';
import { USER_ROLE } from '@shared/enum/user.enum';
import { RolesGuard } from '@modules/auth/guard/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EnterResultDto } from './dto/enter-result.dto';
import { ExamResult } from '@database/typeorm/entities/exam-result.entity';
import { CurrentUser } from '@shared/decorator/user.decorator';
import { JwtPayload } from '@modules/auth/interface/jwt-payload.interface';
import { AuthGuard } from '@modules/auth/guard/auth.guard';

@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}
  @Post('enter-result')
  @Roles(USER_ROLE.TEACHER)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    tags: ['exam'],
    operationId: 'enterResult',
    summary: 'Enter result for a exam',
    description: 'Enter result for a exam',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful',
    type: EnterResultDto,
  })
  @ApiBearerAuth('token')
  async createClass(
    @Body() data: EnterResultDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<ExamResult> {
    return this.examService.enterResult(data, user);
  }
}
