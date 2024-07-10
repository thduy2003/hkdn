import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Roles } from '@modules/auth/guard/roles.decorator';
import { USER_ROLE } from '@shared/enum/user.enum';
import { AuthGuard } from '@modules/auth/guard/auth.guard';
import { RolesGuard } from '@modules/auth/guard/roles.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { CurrentUser } from '@shared/decorator/user.decorator';
import { JwtPayload } from '@modules/auth/interface/jwt-payload.interface';
import { Feedback } from '@database/typeorm/entities/feedback.entity';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}
  @Post(':examResultId')
  @Roles(USER_ROLE.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    tags: ['feedback'],
    operationId: 'createFeedback',
    summary: 'Create feedback for exam result',
    description: 'Create feedback for exam result',
  })
  @ApiParam({
    name: 'examResultId',
    required: true,
    description: 'ID of the exam result to create the feedback',
    type: 'integer',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful',
    type: CreateFeedbackDto,
  })
  @ApiBearerAuth('token')
  async createClass(
    @Body() data: CreateFeedbackDto,
    @CurrentUser() user: JwtPayload,
    @Param('examResultId') examResultId: number,
  ): Promise<Feedback> {
    return this.feedbackService.createFeeback(data, user, examResultId);
  }
}
