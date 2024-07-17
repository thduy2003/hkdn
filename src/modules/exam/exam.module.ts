import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from '@database/typeorm/entities/exam.entity';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { Class } from '@database/typeorm/entities/class.entity';
import { User } from '@database/typeorm/entities';
import { ExamResult } from '@database/typeorm/entities/exam-result.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@modules/user/user.service';
import { Course } from '@database/typeorm/entities/course.entity';
import { ClassEnrollment } from '@database/typeorm/entities/class-enrollment.entity';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, Class, User, ExamResult, Course, ClassEnrollment]), UserModule],
  controllers: [ExamController],
  providers: [ExamService, JwtService],
  exports: [ExamService],
})
export class ExamModule {}
