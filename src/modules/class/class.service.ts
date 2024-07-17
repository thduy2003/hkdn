import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import moment from 'moment';
import { Class } from '@database/typeorm/entities/class.entity';
import { AbstractBaseService } from '@core/services/base.service';
import { ClassQueryDto } from './dto/class-query.dto';

@Injectable()
export class ClassService extends AbstractBaseService<Class, ClassQueryDto> {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {
    super(classRepository);
  }
  // protected async populateSearchOptions(searchParams: ClassQueryDto): Promise<FindManyOptions> {
  //   const options = await super.populateSearchOptions(searchParams);
  //   const criteriaOptions: FindManyOptions<Class> = {
  //     where: options.where,
  //     order: {
  //       createdAt: searchParams.order || 'DESC',
  //     },
  //     relations: {
  //       user: true,
  //       classEnrollments: {
  //         user: true,
  //       },
  //     },
  //     select: {
  //       id: true,
  //       name: true,
  //       startDate: true,
  //       createdAt: true,
  //       endDate: true,
  //       user: {
  //         fullName: true,
  //       },
  //       classEnrollments: true,
  //     },
  //   };
  //   return Promise.resolve(criteriaOptions);
  // }
  // protected async populateReturnedData(entity: Class[]): Promise<Class[]> {
  //   const data = await super.populateReturnedData(entity);

  //   const filteredClasses = data.map((cls) => {
  //     const filteredEnrollments = cls.classEnrollments.map((enrollment) => ({
  //       user: {
  //         fullName: enrollment.user.fullName,
  //       },
  //     }));

  //     // Tạo bản sao của `cls` và thay thế `classEnrollments`
  //     return Object.assign(new Class(), cls, { classEnrollments: filteredEnrollments });
  //   });

  //   return filteredClasses;
  // }
  async findOne(id: number): Promise<Class> {
    return this.repository.findOneBy({
      id,
    });
  }
  async getClassDetail(id: number): Promise<Class> {
    // SELECT
    //   c.id AS class_id,
    //   c.name AS class_name,
    //   t.name AS teacher_name,
    //   s.name as student_name
    // FROM
    //     classes c
    // JOIN
    //     users t ON c.teacher_id  = t.id
    // JOIN
    //     class_enrollment ce ON ce.class_id = c.id
    // JOIN
    //     users s ON ce.student_id  = s.id
    const data = await this.repository.findOne({
      where: { id },
      order: {
        createdAt: 'DESC',
      },
      relations: {
        user: true,
        classEnrollments: {
          user: true,
        },
      },
      select: {
        id: true,
        name: true,
        startDate: true,
        createdAt: true,
        endDate: true,
        user: {
          fullName: true,
        },
        classEnrollments: {
          id: true,
          user: {
            fullName: true,
          },
        },
      },
    });

    // data.classEnrollments = data.classEnrollments.map((item) => {
    //   return {
    //     user: {
    //       fullName: item.user.fullName,
    //     },
    //   };
    // });

    return data;
  }
}
