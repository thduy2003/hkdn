import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/auth-create.dto';
import { RegisterResponse } from './response/register.response';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { LoginResponse } from './response/login.response';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponeDto } from '@modules/user/dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from './guard/auth.guard';
import { CurrentUser } from '@shared/decorator/user.decorator';
import { JwtPayload } from './interface/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    tags: ['auth'],
    operationId: 'register',
    summary: 'Register',
    description: 'Register a new user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: RegisterResponse,
  })
  async register(@Body() data: CreateAuthDto): Promise<RegisterResponse> {
    return this.authService.registerUser(data);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    tags: ['auth'],
    operationId: 'login',
    summary: 'Login',
    description: 'Login',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: LoginResponse,
  })
  async login(
    @Body() body: AuthCredentialDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const data = await this.authService.login(body, res);
    return data;
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    tags: ['auth'],
    operationId: 'refresh-token',
    summary: 'RefreshToken',
    description: 'RefreshToken',
  })
  @Get('/refresh-token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: LoginResponse,
  })
  @ApiBearerAuth('token')
  async handleRefreshToken(
    @Req() request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.refreshToken(refreshToken, response);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    tags: ['auth'],
    operationId: 'profile',
    summary: 'Profile',
    description: 'Profile',
  })
  @Get('profile')
  @ApiBearerAuth('token')
  async getProfileUser(@Request() req): Promise<UserResponeDto> {
    return plainToInstance(
      UserResponeDto,
      await this.authService.getUserById(req.user['userId']),
    );
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    tags: ['auth'],
    operationId: 'logout',
    summary: 'Logout',
    description: 'Logout',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Successful',
  })
  @ApiBearerAuth('token')
  async handleLogout(
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logout(user, response);
  }
}
