import { NestFactory } from '@nestjs/core';
import { UserSeedService } from './user/user-seed.service';
import { SeedModule } from './seed.module';
import { CourseSeedService } from './course/course-seed.service';
import { ClassSeedService } from './class/class-seed.service';
import { ClassEnrollmentSeedService } from './enrollment/class-enrollment-seed.service';
import { ExamSeedService } from './exam/exam-seed.service';
import { ExamResultSeedService } from './exam-result/exam-result-seed.service';
import { FeedbackSeedService } from './feedback/feedback-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(UserSeedService).run();
  await app.get(CourseSeedService).run();
  await app.get(ClassSeedService).run();
  await app.get(ClassEnrollmentSeedService).run();
  await app.get(ExamSeedService).run();
  await app.get(ExamResultSeedService).run();
  await app.get(FeedbackSeedService).run();

  await app.close();
};

void runSeed();
