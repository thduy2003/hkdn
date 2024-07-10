import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from '@database/typeorm/entities/feedback.entity';
import { FeedbackSeedService } from './feedback-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback])],
  providers: [FeedbackSeedService],
  exports: [FeedbackSeedService],
})
export class FeedbackSeedModule {}
