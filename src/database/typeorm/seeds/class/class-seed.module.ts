import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassSeedService } from './class-seed.service';
import { Class } from '@database/typeorm/entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Class])],
  providers: [ClassSeedService],
  exports: [ClassSeedService],
})
export class ClassSeedModule {}
