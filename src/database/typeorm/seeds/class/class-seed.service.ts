import { Class } from '@database/typeorm/entities/class.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ClassSeedService {
  constructor(
    @InjectRepository(Class)
    private repository: Repository<Class>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(
        this.repository.create([
          {
            name: 'BI001',
            startDate: new Date('2022-08-01'),
            endDate: new Date('2022-12-31'),
            course: {
              id: 1,
            },
            teacher: {
              id: 3,
            },
          },
          {
            name: 'BI002',
            startDate: new Date('2022-08-01'),
            endDate: new Date('2022-12-31'),
            course: {
              id: 2,
            },
            teacher: {
              id: 3,
            },
          },
        ]),
      );
    }
  }
}
