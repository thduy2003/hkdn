import { Course } from '@database/typeorm/entities/course.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseSeedService } from './course-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  providers: [CourseSeedService],
  exports: [CourseSeedService],
})
export class CourseSeedModule {}
