import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindManyOptions, Repository } from 'typeorm';
import moment from 'moment';
import { Class } from '@database/typeorm/entities/class.entity';
import { AbstractBaseService } from '@core/services/base.service';
import { ClassQueryDto } from './dto/class-query.dto';
import { ClassEnrollment } from '@database/typeorm/entities/class-enrollment.entity';
import { User } from '@database/typeorm/entities';
import { UserService } from '@modules/user/user.service';
import { PageDto } from '@core/pagination/dto/page-dto';
import { StudentsQueryDto } from './dto/students-query.dto';
import { EnterResultDto } from '@modules/exam/dto/enter-result.dto';
import { ExamResult } from '@database/typeorm/entities/exam-result.entity';
import { JwtPayload } from '@modules/auth/interface/jwt-payload.interface';
import { Exam } from '@database/typeorm/entities/exam.entity';
import { PageMetaDto } from '@core/pagination/dto/page-meta.dto';
import { AddExamDto } from './dto/add-exam.dto';

@Injectable()
export class ClassService extends AbstractBaseService<Class, ClassQueryDto> {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
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
  protected async populateSearchOptions(searchParams: ClassQueryDto): Promise<FindManyOptions> {
    const options = await super.populateSearchOptions(searchParams);

    const criteriaOptions: any = {
      where: {
        teacher: {
          id: searchParams.teacherId,
        },
      },
      order: {
        createdAt: searchParams.order || 'DESC',
      },
    };
    return Promise.resolve(criteriaOptions);
  }
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
        teacher: true,
        exams: true,
      },
      select: {
        id: true,
        name: true,
        startDate: true,
        createdAt: true,
        endDate: true,
        teacher: {
          fullName: true,
        },
        exams: {
          id: true,
          name: true,
          type: true,
        },
      },
    });

    return data;
  }
  async getStudentsInClass(id: number, query: StudentsQueryDto): Promise<PageDto<User>> {
    const students = await this.userService.getStudentsInClass(id, query);
    return students;
  }
  async enterResult(data: EnterResultDto, classId: number, studentId: number, user: JwtPayload): Promise<string> {
    const classExisted = await this.repository.findOne({
      where: { id: classId },
      relations: {
        classEnrollments: true,
        examResults: {
          exam: true,
          student: true,
        },
        teacher: true,
        exams: true,
      },
    });
    if (!classExisted) {
      throw new BadRequestException('This class does not exist');
    }

    if (classExisted.teacher.id !== user.userId) {
      throw new BadRequestException('Teacher does not teach this class');
    }

    const enrolledStudent = classExisted.classEnrollments.find((classEnrollment) => {
      return classEnrollment.studentId === studentId;
    });
    if (!enrolledStudent) {
      throw new BadRequestException(`This student has not enrolled in the class: ${classExisted.name}`);
    }
    const existedExam = classExisted.exams.find((exam) => exam.id !== data.examId);
    if (!existedExam) {
      throw new BadRequestException(`This class does not have this exam`);
    }
    const validExam = await this.repository.manager.getRepository(Exam).findOneBy({
      id: data.examId,
    });

    if (!validExam) {
      throw new BadRequestException('This exam does not exist');
    }

    const existedExamResult = classExisted.examResults.find((examResult) => {
      return examResult.exam.id === data.examId && examResult.student.id === studentId;
    });
    if (existedExamResult) {
      // throw new BadRequestException(
      //   `Student ${existedExamResult.student.fullName} already has a result for the exam: ${existedExam.name}. Please update the result.`,
      // );
      throw new BadRequestException({
        message: 'EXAM_RESULT_EXISTED',
        args: {
          studentName: existedExamResult.student.fullName,
          examName: existedExam.name,
        },
      });
    }

    const newResult = this.repository.manager.getRepository(ExamResult).create({
      exam: {
        id: data.examId,
      },
      student: {
        id: studentId,
      },
      result: data.result,
      deadlineFeedback: data.deadlineFeedback,
    });
    classExisted.examResults.push(newResult);

    await this.repository.save(classExisted);
    return 'Entered result successfully';
  }
  async getClassesExamResult(user: JwtPayload, query: StudentsQueryDto): Promise<PageDto<Class>> {
    const options = this.populateDefaultSearch(query);
    /**
     * Since I am displaying the list of class of a student, and each class may have multiple associated pieces of information, paginating based on this combined data will not produce the desired results. The solution is to first retrieve the list of classes and paginate based on this list. Then, populate the additional combined information for each class before returning the result.
     */
    const baseQuery = this.repository
      .createQueryBuilder('class')
      .leftJoin('class.classEnrollments', 'classEnrollment')
      .where('classEnrollment.student.id = :userId', { userId: user.userId });

    const [classData, count] = await baseQuery
      .select(['class.id'])
      .limit(options.page_size)
      .offset((options.page - 1) * options.page_size)
      .getManyAndCount();

    const classIds = classData.map((c) => c.id);
    const queryBuilder = this.repository
      .createQueryBuilder('class')
      .leftJoin('class.classEnrollments', 'classEnrollment')
      .leftJoin('class.teacher', 'teacher')
      .leftJoin('class.examResults', 'examResult', 'classEnrollment.student.id = examResult.student.id')
      .leftJoin('examResult.feedbacks', 'feedback')
      .leftJoin('examResult.exam', 'exam')
      .where('class.id IN (:...classIds)', { classIds })
      .andWhere('classEnrollment.student.id = :userId', { userId: user.userId })
      .select([
        'class.id',
        'class.name',
        'classEnrollment.enrollmentDate',
        'examResult.result',
        'examResult.id',
        'examResult.deadlineFeedback',
        'exam.name',
        'feedback.createdAt',
        'feedback.content',
        'teacher.id',
      ])
      .orderBy('classEnrollment.enrollmentDate', options.order);

    if (options.keyword) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('class.name ILIKE :keyword', { keyword: `%${options.keyword}%` });
        }),
      );
    }

    const data = classIds.length > 0 ? await queryBuilder.getMany() : [];

    const pageMetaDto = new PageMetaDto({
      itemCount: count,
      pageOptionsDto: options,
    });

    return new PageDto(data, pageMetaDto);
  }
  async addExams(data: AddExamDto, classId: number, user: JwtPayload): Promise<string> {
    const existedClass = await this.repository.findOne({
      where: { id: classId },
      relations: {
        teacher: true,
        exams: true,
      },
    });
    if (!existedClass) {
      throw new BadRequestException('This class does not exist');
    }
    if (existedClass.teacher.id !== user.userId) {
      throw new BadRequestException('Teacher does not teach this class');
    }
    for (const examId of data.examIds) {
      const existedExam = existedClass.exams.find((exam) => {
        return exam.id === examId;
      });
      if (existedExam) {
        throw new BadRequestException(`Exam: ${existedExam.name} has already existed in the class`);
      }
      const validExam = await this.repository.manager.getRepository(Exam).findOneBy({
        id: examId,
      });
      if (!validExam) {
        throw new BadRequestException('This exam does not exist');
      }
      existedClass.exams.push(validExam);
    }
    await this.repository.save(existedClass);
    return 'Exams have been successfully added for the class.';
  }
}
