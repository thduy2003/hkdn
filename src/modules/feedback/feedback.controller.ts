import { Controller } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { BaseController } from '@core/services/base.controller';
import { Feedback } from '@database/typeorm/entities/feedback.entity';
import { FeedbackQueryDto } from './dto/feedback-query.dto';

@Controller('')
export class FeedbackController extends BaseController<Feedback, FeedbackService, FeedbackQueryDto>(
  Feedback,
  FeedbackService,
  FeedbackQueryDto,
) {
  constructor(private readonly feedbackService: FeedbackService) {
    super(feedbackService);
  }
  // @Post(':examResultId')
  // @Roles(USER_ROLE.STUDENT)
  // @UseGuards(AuthGuard, RolesGuard)
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOperation({
  //   tags: ['feedback'],
  //   operationId: 'createFeedback',
  //   summary: 'Create feedback for exam result',
  //   description: 'Create feedback for exam result',
  // })
  // @ApiParam({
  //   name: 'examResultId',
  //   required: true,
  //   description: 'ID of the exam result to create the feedback',
  //   type: 'integer',
  // })
  // @ApiResponse({
  //   status: HttpStatus.CREATED,
  //   description: 'Successful',
  //   type: CreateFeedbackDto,
  // })
  // @ApiBearerAuth('token')
  // async createClass(
  //   @Body() data: CreateFeedbackDto,
  //   @CurrentUser() user: JwtPayload,
  //   @Param('examResultId') examResultId: number,
  // ): Promise<Feedback> {
  //   return this.feedbackService.createFeeback(data, user, examResultId);
  // }
}
