import { ExamResult } from '@database/typeorm/entities/exam-result.entity';
import { Feedback } from '@database/typeorm/entities/feedback.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FeedbackSeedService {
  constructor(
    @InjectRepository(Feedback)
    private repository: Repository<Feedback>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(
        this.repository.create([
          {
            content: 'em yêu cầu cô phúc khảo điểm cho em',
            examResult: {
              id: 1,
            },
            user: {
              id: 2,
            },
          },
        ]),
      );
    }
  }
}
