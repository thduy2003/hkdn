import { PageDto } from '@core/pagination/dto/page-dto';
import { PageMetaDto } from '@core/pagination/dto/page-meta.dto';
import { PageOptionsDto } from '@core/pagination/dto/page-option.dto';
import { User } from '@database/typeorm/entities';
import { AuthCredentialDto } from '@modules/auth/dto/auth-credential.dto';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
