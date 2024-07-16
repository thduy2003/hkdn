import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { BaseController } from '@core/services/base.controller';
import { User } from '@database/typeorm/entities';
import { UserQueryDto } from './dto/user-query.dto';

@Controller('')
export class UserController extends BaseController<User, UserService, UserQueryDto>(User, UserService, UserQueryDto) {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
}
