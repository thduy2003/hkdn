import { Feedback } from '@database/typeorm/entities/feedback.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { JwtPayload } from '@modules/auth/interface/jwt-payload.interface';
import { ExamResult } from '@database/typeorm/entities/exam-result.entity';
import * as moment from 'moment';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    @InjectRepository(ExamResult)
    private examResultRepository: Repository<ExamResult>,
  ) {}
  async createFeeback(
    data: CreateFeedbackDto,
    user: JwtPayload,
    examResultId: number,
  ): Promise<Feedback> {
    const isExamResultExisted = await this.examResultRepository.findOneBy({
      id: examResultId,
    });
    if (!isExamResultExisted) {
      throw new BadRequestException('Không tồn tại điểm bài kiểm tra này');
    }
    const isStudentExamResult = await this.examResultRepository.findOneBy({
      id: examResultId,
      user: { id: user.userId },
    });
    if (!isStudentExamResult) {
      throw new BadRequestException(
        'Đây không phải là điểm bài kiểm tra của học sinh này',
      );
    }
    const checkValidDate = moment(
      isStudentExamResult.deadlineFeedback,
    ).isBefore(new Date());
    if (checkValidDate) {
      throw new BadRequestException(
        'Đã quá hạn phúc khảo điểm bài kiểm tra này',
      );
    }
    const feedback = this.feedbackRepository.create({
      ...data,
      user: {
        id: user.userId,
      },
      examResult: {
        id: examResultId,
      },
    });
    return this.feedbackRepository.save(feedback);
  }
}
