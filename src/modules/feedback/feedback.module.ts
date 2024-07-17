import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Feedback } from '@database/typeorm/entities/feedback.entity';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { UserService } from '@modules/user/user.service';
import { ExamResult } from '@database/typeorm/entities/exam-result.entity';
import { User } from '@database/typeorm/entities';
import { Course } from '@database/typeorm/entities/course.entity';
import { Class } from '@database/typeorm/entities/class.entity';
import { ClassEnrollment } from '@database/typeorm/entities/class-enrollment.entity';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback, ExamResult, User, Course, Class, ClassEnrollment]), UserModule],
  controllers: [FeedbackController],
  providers: [FeedbackService, JwtService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
