import { Course } from '@database/typeorm/entities/course.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CourseSeedService {
  constructor(
    @InjectRepository(Course)
    private repository: Repository<Course>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(
        this.repository.create([
          {
            name: 'Cơ sở lập trình',
          },
          {
            name: 'Cơ sở dữ liệu',
          },
        ]),
      );
    }
  }
}
