import { User } from '@database/typeorm/entities';
import { AuthCredentialDto } from '@modules/auth/dto/auth-credential.dto';
import { BadRequestException, ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindManyOptions, ILike, Repository } from 'typeorm';
import { Class } from '@database/typeorm/entities/class.entity';
import { UserQueryDto } from './dto/user-query.dto';
import { AbstractBaseService } from '@core/services/base.service';
import { EnrollClassDto } from './dto/enroll-class.dto';
import { ClassEnrollment } from '@database/typeorm/entities/class-enrollment.entity';
import { ClassService } from '@modules/class/class.service';
import { PageDto } from '@core/pagination/dto/page-dto';
import { PageMetaDto } from '@core/pagination/dto/page-meta.dto';
import { StudentsQueryDto } from '@modules/class/dto/students-query.dto';
import { UpdateEnrollmentDateDto } from './dto/update-enroll-date.dto';
import { JwtPayload } from '@modules/auth/interface/jwt-payload.interface';
import { CreateFeedbackDto } from '@modules/feedback/dto/create-feedback.dto';
import moment from 'moment';
import { Feedback } from '@database/typeorm/entities/feedback.entity';
import { plainToInstance } from 'class-transformer';
import { UserResponeDto } from './dto/user-response.dto';
import { USER_ROLE } from '@shared/enum/user.enum';

@Injectable()
export class UserService extends AbstractBaseService<User, UserQueryDto> {
  constructor(
    @InjectRepository(User)
    userRepository: Repository<User>,
    @Inject(ClassService) private classService: ClassService,
    @InjectRepository(ClassEnrollment)
    private classEnrollmentRepository: Repository<ClassEnrollment>,
  ) {
    super(userRepository);
  }
  protected async beforeSave(originalEntity: User, entity: User, action: string): Promise<User> {
    if (action === 'create') {
      entity.password = '123456Abc#';
      entity.role = USER_ROLE.STUDENT;
    }
    return Promise.resolve(entity);
  }
  protected async populateSavedEntity(savedEntity: User): Promise<Partial<User>> {
    return Promise.resolve(plainToInstance(UserResponeDto, savedEntity));
  }
  protected async checkDuplicateRecord(entity: User, action): Promise<boolean> {
    if (action === 'create') {
      const existingUser = await this.repository.findOne({
        where: {
          email: entity.email,
        },
      });
      if (existingUser) {
        throw new ConflictException('User email already exists');
      }
    }

    return true;
  }

  protected async populateSearchOptions(searchParams: UserQueryDto): Promise<FindManyOptions> {
    const options = await super.populateSearchOptions(searchParams);
    if (searchParams?.keyword) {
      options.where = [
        {
          ...options.where,
          fullName: ILike(`%${searchParams.keyword}%`),
        },
        {
          ...options.where,
          role: ILike(`%${searchParams.keyword}%`),
        },
        {
          ...options.where,
          email: ILike(`%${searchParams.keyword}%`),
        },
      ];
    }
    const criteriaOptions: any = {
      where: options.where,
      order: {
        createdAt: searchParams.order || 'DESC',
      },
      select: ['id', 'fullName', 'email', 'role'],
    };
    return Promise.resolve(criteriaOptions);
  }
  async createOne(data: User | AuthCredentialDto): Promise<User> {
    const isUserExisted = await this.repository.findOneBy({
      email: data.email,
    });
    if (isUserExisted) {
      throw new ConflictException('LO-108');
    }
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  // async createClass(data: CreateClassDto): Promise<Class> {
  //   const isTeacherExisted = await this.repository.findOneBy({
  //     id: data.teacherId,
  //   });
  //   if (!isTeacherExisted) {
  //     throw new BadRequestException('This teacher does not exist');
  //   }
  //   const isCourseExisted = await this.courseRepository.findOneBy({
  //     id: data.courseId,
  //   });
  //   if (!isCourseExisted) {
  //     throw new BadRequestException('This course does not exist');
  //   }
  //   const classEntity = this.classRepository.create({
  //     ...data,
  //     user: {
  //       id: data.teacherId,
  //     },
  //     course: {
  //       id: data.courseId,
  //     },
  //   });
  //   return this.classRepository.save(classEntity);
  // }
  async enrollClass(data: EnrollClassDto, classId: number): Promise<string> {
    const existedUser = await this.repository.findOne({
      where: { id: data.studentId },
      relations: { classEnrollments: { class: true } },
    });

    if (!existedUser) {
      throw new BadRequestException('This student does not exist');
    }
    const enrolledClass = existedUser.classEnrollments.find((classEnrollment) => {
      return classEnrollment.class.id === classId;
    });
    if (enrolledClass) {
      throw new BadRequestException(
        `Student: ${existedUser.fullName} has already enrolled in the class: ${enrolledClass.class.name}`,
      );
    }
    const classExisted = await this.classService.findOne(classId);
    if (!classExisted) {
      throw new BadRequestException('This class does not exist');
    }
    const newEnrollment = new ClassEnrollment();
    newEnrollment.classId = classId;
    newEnrollment.enrollmentDate = new Date();
    existedUser.classEnrollments.push(newEnrollment);
    await this.repository.save(existedUser);

    return `Enrolled class: ${classExisted.name} successfully`;
  }
  async unEnrollClass(data: EnrollClassDto, classId: number): Promise<string> {
    const existedUser = await this.repository.findOne({
      where: { id: data.studentId },
      relations: { classEnrollments: { class: true } },
    });

    if (!existedUser) {
      throw new BadRequestException('This student does not exist');
    }
    const enrolledClass = existedUser.classEnrollments.find((classEnrollment) => {
      return classEnrollment.class.id === classId;
    });
    if (!enrolledClass) {
      throw new BadRequestException(
        `Student: ${existedUser.fullName} has not enrolled in the class: ${enrolledClass.class.name}`,
      );
    }
    const classExisted = await this.classService.findOne(classId);
    if (!classExisted) {
      throw new BadRequestException('This class does not exist');
    }

    existedUser.classEnrollments = existedUser.classEnrollments.filter((item) => {
      return item.classId !== classId;
    });
    await this.repository.save(existedUser);

    return `UnEnrolled class: ${classExisted.name} successfully`;
  }
  async updateEnrollmentDate(data: UpdateEnrollmentDateDto, classId: number): Promise<string> {
    const existedUser = await this.repository.findOne({
      where: { id: data.studentId },
      relations: { classEnrollments: { class: true } },
    });

    if (!existedUser) {
      throw new BadRequestException('This student does not exist');
    }
    const enrolledClass = existedUser.classEnrollments.find((classEnrollment) => {
      return classEnrollment.class.id === classId;
    });
    if (!enrolledClass) {
      throw new BadRequestException(`Student: ${existedUser.fullName} has not enrolled in the classId: ${classId}`);
    }
    const classExisted = await this.classService.findOne(classId);
    if (!classExisted) {
      throw new BadRequestException('This class does not exist');
    }

    existedUser.classEnrollments.forEach((item) => {
      if (item.classId === classId) {
        item.enrollmentDate = data.enrollmentDate;
      }
    });
    await this.repository.save(existedUser);

    return `Update enrollment date with class: ${classExisted.name} successfully`;
  }
  async findOneById(id: number): Promise<User> {
    const user = await this.repository
      .createQueryBuilder('users')
      .where('users.id = :id', { id: id })
      .select(['users.id as id', 'users.name as name', 'users.email as email', 'users.role as role'])
      .getRawOne();

    if (!user) throw new UnauthorizedException('USER_MUST_LOGGED_IN');

    return user;
  }

  async updateUserToken(refreshToken: string, userId: number) {
    return await this.repository
      .createQueryBuilder()
      .update(User)
      .set({
        refreshToken,
      })
      .where('id = :id', { id: userId })
      .execute();
  }
  async findUserByToken(refreshToken: string): Promise<User> {
    return await this.repository.findOneBy({
      refreshToken,
    });
  }
  async getStudentsInClass(classId: number, query: StudentsQueryDto): Promise<PageDto<User>> {
    console.log('class', classId);
    const options = this.populateDefaultSearch(query);
    /**
     * Since I am displaying the list of students in a class, and each student may have multiple associated pieces of information, paginating based on this combined data will not produce the desired results. The solution is to first retrieve the list of students and paginate based on this list. Then, populate the additional combined information for each student before returning the result.
     */
    const baseQuery = this.repository
      .createQueryBuilder('user')
      .leftJoin('user.classEnrollments', 'classEnrollment')
      .where('classEnrollment.classId = :classId', { classId });
    const [studentData, count] = await baseQuery
      .select(['user.id'])
      .limit(options.page_size)
      .offset((options.page - 1) * options.page_size)
      .getManyAndCount();
    const studentIds = studentData.map((c) => c.id);
    const queryBuilder = this.repository
      .createQueryBuilder('user')
      .leftJoin('user.classEnrollments', 'classEnrollment')
      .leftJoin('user.examResults', 'examResult', 'classEnrollment.class.id = examResult.class.id')
      .leftJoin('examResult.feedbacks', 'feedback')
      .leftJoin('examResult.exam', 'exam')
      .where('user.id IN (:...studentIds)', { studentIds })
      .andWhere('classEnrollment.class.id = :classId', { classId })
      .select([
        'user.id',
        'user.fullName',
        'classEnrollment.enrollmentDate',
        'examResult.id',
        'examResult.result',
        'exam.id',
        'exam.name',
        'feedback.content',
        'feedback.createdAt',
      ])
      .orderBy('classEnrollment.enrollmentDate', options.order);

    if (options.keyword) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('user.fullName ILIKE :keyword', { keyword: `%${options.keyword}%` });
        }),
      );
    }

    const data = studentIds.length > 0 ? await queryBuilder.getMany() : [];
    const pageMetaDto = new PageMetaDto({
      itemCount: count,
      pageOptionsDto: options,
    });
    return new PageDto(data, pageMetaDto);
  }
  async getClassesExamResult(user: JwtPayload, query: StudentsQueryDto): Promise<PageDto<Class>> {
    const classes = await this.classService.getClassesExamResult(user, query);
    return classes;
  }

  async createFeedback(data: CreateFeedbackDto, user: JwtPayload, examResultId: number): Promise<string> {
    const existedUser = await this.repository.findOne({
      where: {
        id: user.userId,
      },
      relations: {
        feedbacks: true,
        examResults: true,
      },
    });
    if (!existedUser) {
      throw new BadRequestException('This student does not exist');
    }
    const examResult = existedUser.examResults.find((item) => item.id === examResultId);
    if (!examResult) {
      throw new BadRequestException('This exam result does not belong to this user');
    }
    const checkValidDate = moment(examResult.deadlineFeedback).isBefore(new Date());
    if (checkValidDate) {
      throw new BadRequestException('DEADLINE_FEEDBACK_PASSED');
    }
    const newFeedback = this.repository.manager.getRepository(Feedback).create({
      content: data.content,
      examResult: {
        id: examResultId,
      },
    });
    existedUser.feedbacks.push(newFeedback);
    await this.repository.save(existedUser);
    return 'Created feedback for this exam successfully';
  }
}
