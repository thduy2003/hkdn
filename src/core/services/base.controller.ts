import { PageDto } from '@core/pagination/dto/page-dto';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Query,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { IService } from './interface.service';
import { Roles } from '@modules/auth/guard/roles.decorator';
import { USER_ROLE } from '@shared/enum/user.enum';
import { RolesGuard } from '@modules/auth/guard/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PageOptionsDto } from '@core/pagination/dto/page-option.dto';
import { AuthGuard } from '@modules/auth/guard/auth.guard';
import { TestDTO } from '@core/pagination/dto/test-dto';
type PageOptionsWithEntity = PageOptionsDto & TestDTO;

export function BaseController<TEntity, TService extends IService<TEntity>>(
  serviceRef: any,
  entityRef: any,
) {
  @Controller()
  class BaseController {
    bizService!: TService;
    constructor(@Inject(serviceRef) _bizService: TService) {
      this.bizService = _bizService;
    }
    @Get(entityRef.name)
    @Roles(USER_ROLE.EMPLOYEE, USER_ROLE.STUDENT)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
      tags: ['admin'],
      operationId: 'getAllUser',
      summary: 'Get all user123',
      description: 'Get all user',
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Successful',
      type: PageDto<TEntity>,
    })
    @ApiBearerAuth('token')
    async getAll(@Query() pageOptionsDto: TestDTO): Promise<PageDto<TEntity>> {
      return this.bizService.find(pageOptionsDto);
    }
  }
  return BaseController;
}
