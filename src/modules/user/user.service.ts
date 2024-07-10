import { PageDto } from '@core/pagination/dto/page-dto';
import { PageMetaDto } from '@core/pagination/dto/page-meta.dto';
import { PageOptionsDto } from '@core/pagination/dto/page-option.dto';
import { User } from '@database/typeorm/entities';
import { AuthCredentialDto } from '@modules/auth/dto/auth-credential.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClassDto } from './dto/create-class.dto';
import { Class } from '@database/typeorm/entities/class.entity';
import { Course } from '@database/typeorm/entities/course.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}
  async createOne(data: User | AuthCredentialDto): Promise<User> {
    const isUserExisted = await this.userRepository.findOneBy({
      email: data.email,
    });
    if (isUserExisted) {
      throw new ConflictException('LO-108');
    }
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async createClass(data: CreateClassDto): Promise<Class> {
    const isTeacherExisted = await this.userRepository.findOneBy({
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
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.id = :id', { id: id })
      .select([
        'users.id as id',
        'users.name as name',
        'users.email as email',
        'users.role as role',
      ])
      .getRawOne();

    if (!user) throw new UnauthorizedException('PROF-104');

    return user;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('users');

    queryBuilder
      .select(['users.fullName', 'users.id', 'users.email'])
      .orderBy('users.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.page_size);

    const itemCount = await queryBuilder.getCount();
    const data = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(data, pageMetaDto);
  }

  async updateUserToken(refreshToken: string, userId: number) {
    return await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        refreshToken,
      })
      .where('id = :id', { id: userId })
      .execute();
  }
  async findUserByToken(refreshToken: string): Promise<User> {
    return await this.userRepository.findOneBy({
      refreshToken,
    });
  }
}
