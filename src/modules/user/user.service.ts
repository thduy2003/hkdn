import { User } from '@database/typeorm/entities';
import { AuthCredentialDto } from '@modules/auth/dto/auth-credential.dto';
import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { CreateClassDto } from './dto/create-class.dto';
import { Class } from '@database/typeorm/entities/class.entity';
import { Course } from '@database/typeorm/entities/course.entity';
import { UserQueryDto } from './dto/user-query.dto';
import { AbstractBaseService } from '@core/services/base.service';

@Injectable()
export class UserService extends AbstractBaseService<User, UserQueryDto> {
  constructor(
    @InjectRepository(User)
    userRepository: Repository<User>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {
    super(userRepository);
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

  async createClass(data: CreateClassDto): Promise<Class> {
    const isTeacherExisted = await this.repository.findOneBy({
      id: data.teacherId,
    });
    if (!isTeacherExisted) {
      throw new BadRequestException('Không tồn tại giáo viên này');
    }
    const isCourseExisted = await this.courseRepository.findOneBy({
      id: data.courseId,
    });
    if (!isCourseExisted) {
      throw new BadRequestException('Không tồn tại khóa học này');
    }
    const classEntity = this.classRepository.create({
      ...data,
      user: {
        id: data.teacherId,
      },
      course: {
        id: data.courseId,
      },
    });
    return this.classRepository.save(classEntity);
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
}
