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
import { FindOptionsWhere, ILike, Like, Repository } from 'typeorm';
import { CreateClassDto } from './dto/create-class.dto';
import { Class } from '@database/typeorm/entities/class.entity';
import { Course } from '@database/typeorm/entities/course.entity';
import { BaseService } from '@core/services/base.service';

@Injectable()
export class UserService extends BaseService<User>(User) {
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
    let options: FindOptionsWhere<User>[] = [];

    if (pageOptionsDto?.keyword) {
      options = [
        { fullName: ILike(`%${pageOptionsDto.keyword}%`) },
        { email: ILike(`%${pageOptionsDto.keyword}%`) },
        { role: ILike(`%${pageOptionsDto.keyword}%`) },
      ];
    }

    const [data, count] = await this.repository.findAndCount({
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.page_size,
      order: {
        createdAt: pageOptionsDto.order || 'DESC',
      },
      where: options.length > 0 ? options : undefined,
      select: ['id', 'fullName', 'email', 'role'],
    });

    const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto });
    return new PageDto(data, pageMetaDto);
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
