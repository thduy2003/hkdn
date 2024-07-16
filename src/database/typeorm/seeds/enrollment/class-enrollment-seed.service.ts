import { ClassEnrollment } from '@database/typeorm/entities/class-enrollment.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ClassEnrollmentSeedService {
  constructor(
    @InjectRepository(ClassEnrollment)
    private repository: Repository<ClassEnrollment>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(
        this.repository.create([
          {
            classId: 1,
            studentId: 2,
            enrollmentDate: new Date('2022-08-01'),
          },
        ]),
      );
    }
  }
}
