import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassEnrollmentSeedService } from './class-enrollment-seed.service';
import { ClassEnrollment } from '@database/typeorm/entities/class-enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClassEnrollment])],
  providers: [ClassEnrollmentSeedService],
  exports: [ClassEnrollmentSeedService],
})
export class ClassEnrollmentSeedModule {}
