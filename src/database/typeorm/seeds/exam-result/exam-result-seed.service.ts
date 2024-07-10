import { ExamResult } from '@database/typeorm/entities/exam-result.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExamResultSeedService {
  constructor(
    @InjectRepository(ExamResult)
    private repository: Repository<ExamResult>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(
        this.repository.create([
          {
            exam: {
              id: 1,
            },
            class: {
              id: 1,
            },
            user: {
              id: 2,
            },
            result: 8.8,
          },
        ]),
      );
    }
  }
}
