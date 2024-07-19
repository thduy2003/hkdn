import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from '@database/typeorm/entities/exam.entity';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Exam]), UserModule],
  controllers: [ExamController],
  providers: [ExamService, JwtService],
  exports: [ExamService],
})
export class ExamModule {}
