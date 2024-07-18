import { User } from '@database/typeorm/entities';
import { AuthCredentialDto } from '@modules/auth/dto/auth-credential.dto';
import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindManyOptions, ILike, Repository } from 'typeorm';
import { CreateClassDto } from './dto/create-class.dto';
import { Class } from '@database/typeorm/entities/class.entity';
import { Course } from '@database/typeorm/entities/course.entity';
import { UserQueryDto } from './dto/user-query.dto';
import { AbstractBaseService } from '@core/services/base.service';
import { EnrollClassDto } from './dto/enroll-class.dto';
import { ClassEnrollment } from '@database/typeorm/entities/class-enrollment.entity';
import { ClassService } from '@modules/class/class.service';
import { PageDto } from '@core/pagination/dto/page-dto';
import { PageMetaDto } from '@core/pagination/dto/page-meta.dto';
import { StudentsQueryDto } from '@modules/class/dto/students-query.dto';
import { UpdateEnrollmentDateDto } from './dto/update-enroll-date.dto';

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
    console.log('originalEntity beforeSave', originalEntity);
    console.log('action', action);
    if (action === 'create') {
      entity.password = '123456Abc#';
    }
    return Promise.resolve(entity);
  }
  protected async afterCompleted(originalEntity: User, savedEntity: User, action: string): Promise<User> {
    console.log('afterCompleted', originalEntity);
    console.log('action', action);
    return Promise.resolve(savedEntity);
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

    if (!user) throw new UnauthorizedException('PROF-104');

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
    const options = this.populateDefaultSearch(query);
    const queryBuilder = this.repository
      .createQueryBuilder('user')
      .innerJoin('user.classEnrollments', 'classEnrollment')
      .innerJoin('user.examResults', 'examResult')
      .innerJoin('examResult.exam', 'exam')
      .innerJoin('classEnrollment.class', 'class')
      .where('class.id = :classId', { classId })
      .select([
        'user.id',
        'user.fullName',
        'classEnrollment.enrollmentDate',
        'examResult.id',
        'examResult.result',
        'exam.name',
      ])
      .take(options.page_size)
      .skip((options.page - 1) * options.page_size)
      .orderBy('classEnrollment.enrollmentDate', options.order);

    if (options.keyword) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('user.fullName ILIKE :keyword', { keyword: `%${options.keyword}%` });
        }),
      );
    }

    const [data, count] = await queryBuilder.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      itemCount: count,
      pageOptionsDto: options,
    });
    return new PageDto(data, pageMetaDto);
  }
}
