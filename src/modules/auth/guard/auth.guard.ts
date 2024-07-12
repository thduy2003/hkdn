import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ApiConfigService } from '@shared/services/api-config.service';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@shared/decorator/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ApiConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    console.log('token', token);
    if (!token) {
      throw new UnauthorizedException('PROF-104');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.authConfig.secret,
      });
      console.log('payload', payload);
      request['user'] = payload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('EXPIRED_TOKEN');
      }
      throw new UnauthorizedException('PROF-104');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    console.log(request.headers.authorization);
    console.log(type);
    console.log(token);
    return type === 'Bearer' ? token : undefined;
  }
}
