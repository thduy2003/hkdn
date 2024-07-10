import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSeedModule } from './user/user-seed.module';
import { SharedModule } from 'src/shared/shared.module';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { CourseSeedModule } from './course/course-seed.module';
import { ClassSeedModule } from './class/class-seed.module';
import { ExamSeedModule } from './exam/exam-seed.module';
import { ClassEnrollmentSeedModule } from './enrollment/class-enrollment-seed.module';
import { ExamResultSeedModule } from './exam-result/exam-result-seed.module';
import { FeedbackSeedModule } from './feedback/feedback-seed.module';

@Module({
  imports: [
    UserSeedModule,
    CourseSeedModule,
    ClassSeedModule,
    ExamSeedModule,
    ClassEnrollmentSeedModule,
    ExamResultSeedModule,
    FeedbackSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.mysqlConfig,
      inject: [ApiConfigService, ConfigService],
    }),
  ],
})
export class SeedModule {}
