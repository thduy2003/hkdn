import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ClassEnrollment } from '@database/typeorm/entities/class-enrollment.entity';
import { ClassEnrollmentService } from './class-enrollment.service';
import { ClassEnrollmentController } from './class-enrollment.controller';
import { UserService } from '@modules/user/user.service';
import { Course } from '@database/typeorm/entities/course.entity';
import { Class } from '@database/typeorm/entities/class.entity';
import { User } from '@database/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ClassEnrollment, Course, Class, User])],
  controllers: [ClassEnrollmentController],
  providers: [ClassEnrollmentService, JwtService, UserService],
  exports: [ClassEnrollmentService],
})
export class ClassEnrollmentModule {}
