import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from '@database/typeorm/entities/exam.entity';
import { ExamSeedService } from './exam-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Exam])],
  providers: [ExamSeedService],
  exports: [ExamSeedService],
})
export class ExamSeedModule {}
