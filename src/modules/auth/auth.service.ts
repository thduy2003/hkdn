import { User } from '@database/typeorm/entities';
import { UserService } from '@modules/user/user.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import * as argon2 from 'argon2';
import { CreateAuthDto } from './dto/auth-create.dto';
import { RegisterResponse } from './response/register.response';
import { USER_ROLE } from '@shared/enum/user.enum';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interface/jwt-payload.interface';
import { Response } from 'express';
import ms from 'ms';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async registerUser(createAuthDto: CreateAuthDto): Promise<RegisterResponse> {
    const data = {
      fullName: createAuthDto.full_name,
      email: createAuthDto.email,
      password: createAuthDto.password,
      role: USER_ROLE.STUDENT,
    };
    const user = await this.userService.createOne(data);
    return {
      id: user.id,
      email: user.email,
      full_name: user.fullName,
    };
  }

  async login(body: AuthCredentialDto, response: Response) {
    const user = await this.validateAndGetUser(body);
    const payload = { email: user.email, userId: user.id };
    const refresh_token = this.createRefreshToken(payload);

    //update user with refresh token
    await this.userService.updateUserToken(refresh_token, user.id);
    //set cookie
    response.cookie('refresh_token', refresh_token, {
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRES_IN')),
      httpOnly: true, // to prevent JavaScript access
    });
    const accessToken = await this.jwtService.signAsync(payload);
    const payloadDecoded: any = await this.jwtService.verifyAsync(accessToken);
    return {
      access_token: await this.jwtService.signAsync(payload),
      expired_at: payloadDecoded.exp,
    };
  }
  createRefreshToken = (payload: JwtPayload) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });
    return refresh_token;
  };

  async refreshToken(refreshToken: string, response: Response) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const user = await this.userService.findUserByToken(refreshToken);

      if (user) {
        const { id, email } = user;
        const payload = {
          userId: id,
          email,
        };
        const refresh_token = this.createRefreshToken(payload);

        //update user with refresh token
        await this.userService.updateUserToken(refresh_token, id);

        //clear cookie
        response.clearCookie('refresh_token');
        //set cookie
        response.cookie('refresh_token', refresh_token, {
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRES_IN')),
        });

        const accessToken = await this.jwtService.signAsync(payload);
        const payloadDecoded = await this.jwtService.verifyAsync(accessToken);
        return {
          access_token: accessToken,
          expired_at: payloadDecoded.exp,
        };
      } else {
        throw new UnauthorizedException(
          `Refresh token không hợp lệ, vui lòng login`,
        );
      }
    } catch {
      throw new UnauthorizedException(
        `Refresh token không hợp lệ, vui lòng login`,
      );
    }
  }

  async logout(user: JwtPayload, response: Response) {
    await this.userService.updateUserToken('', user.userId);
    response.clearCookie('refresh_token');
    return 'ok';
  }

  async getUserById(userId: number): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.id = :id', { id: userId })
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

  async validateAndGetUser(
    authCredentialDto: AuthCredentialDto,
  ): Promise<User> {
    const { email, password } = authCredentialDto;
    const isUserExisted = await this.userRepository.findOneBy({
      email,
    });
    if (!isUserExisted) {
      throw new UnauthorizedException('EMAIL_OR_PASSWORD_IS_INCORRECT');
    }

    const isValidPassword = await argon2.verify(
      isUserExisted.password,
      password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('EMAIL_OR_PASSWORD_IS_INCORRECT');
    }

    return isUserExisted;
  }
}
