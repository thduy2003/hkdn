import { Exam } from '@database/typeorm/entities/exam.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EXAM_TYPE } from '@shared/enum/exam-type.enum';
import { Repository } from 'typeorm';

@Injectable()
export class ExamSeedService {
  constructor(
    @InjectRepository(Exam)
    private repository: Repository<Exam>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(
        this.repository.create([
          {
            name: 'Bài kiểm tra cơ sở dữ liệu 1',
            type: EXAM_TYPE.MIDTERM,
          },
          {
            name: 'Bài kiểm tra cơ sở dữ liệu cuối kì',
            type: EXAM_TYPE.FINAL,
          },
        ]),
      );
    }
  }
}
