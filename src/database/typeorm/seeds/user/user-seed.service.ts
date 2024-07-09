import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities';
import { USER_ROLE } from 'src/shared/enum/user.enum';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(
        this.repository.create([
          {
            fullName: 'Nguyễn Văn Cảnh',
            email: 'nguyenvana@gmail.com',
            password: '123456Abc#',
            role: USER_ROLE.EMPLOYEE,
          },
          {
            fullName: 'Trần Hoàng Duy',
            email: 'duytrieudong@gmail.com',
            password: '123456Abc#',
            role: USER_ROLE.STUDENT,
          },
          {
            fullName: 'Phan Hiền',
            email: 'admin@gmail.com',
            password: '123456Abc#',
            role: USER_ROLE.TEACHER,
          },
        ]),
      );
    }
  }
}
