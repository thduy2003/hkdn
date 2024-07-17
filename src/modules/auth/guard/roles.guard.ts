import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_ROLE } from '@shared/enum/user.enum';
import { UserService } from '@modules/user/user.service';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<USER_ROLE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const { user } = context.switchToHttp().getRequest();
    const currentUser = await this.userService.findOneById(user.userId);
    user['role'] = currentUser.role;
    if (!requiredRoles.some((role) => user.role === role)) {
      throw new ForbiddenException('ADMIN-113');
    }
    return requiredRoles.some((role) => user.role === role);
  }
}
