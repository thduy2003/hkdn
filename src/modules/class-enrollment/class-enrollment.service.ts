import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { AbstractBaseService } from '@core/services/base.service';
import { ClassEnrollment } from '@database/typeorm/entities/class-enrollment.entity';
import { ClassEnrollmentQueryDto } from './dto/class-enrollment-query.dto';

@Injectable()
export class ClassEnrollmentService extends AbstractBaseService<
  ClassEnrollment,
  ClassEnrollmentQueryDto
> {
  constructor(
    @InjectRepository(ClassEnrollment)
    classEnrollmentRepository: Repository<ClassEnrollment>,
  ) {
    super(classEnrollmentRepository);
  }
  protected async populateSearchOptions(
    searchParams: ClassEnrollmentQueryDto,
  ): Promise<FindManyOptions> {
    const options = await super.populateSearchOptions(searchParams);
    const criteriaOptions: FindManyOptions = {
      where: options.where,
      order: {
        createdAt: searchParams.order || 'DESC',
      },
      relations: {
        user: true,
        class: true,
      },
      select: {
        classId: true,
        studentId: true,
        enrollmentDate: true,
        createdAt: true,
        user: {
          fullName: true,
        },
        class: {
          name: true,
          startDate: true,
          endDate: true,
        },
      },
    };
    return Promise.resolve(criteriaOptions);
  }
}
