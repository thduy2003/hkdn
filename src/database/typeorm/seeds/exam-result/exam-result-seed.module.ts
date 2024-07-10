import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from '@database/typeorm/entities/exam.entity';
import { ExamResult } from '@database/typeorm/entities/exam-result.entity';
import { ExamResultSeedService } from './exam-result-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExamResult])],
  providers: [ExamResultSeedService],
  exports: [ExamResultSeedService],
})
export class ExamResultSeedModule {}
