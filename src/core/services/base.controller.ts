import { PageDto } from '@core/pagination/dto/page-dto';
import { Controller, Get, HttpCode, HttpStatus, Inject, Query, UseGuards } from '@nestjs/common';
import { IService } from './interface.service';
import { Roles } from '@modules/auth/guard/roles.decorator';
import { USER_ROLE } from '@shared/enum/user.enum';
import { RolesGuard } from '@modules/auth/guard/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@modules/auth/guard/auth.guard';
import { ApiOkResponsePaginated } from './response.decorator';
import pluralize from 'pluralize';

export function BaseController<TEntity, TService extends IService<TEntity, QueryDto>, QueryDto>(
  entityRef: any,
  serviceRef: any,
  queryDto: any,
  routeName?: string,
) {
  @Controller()
  class BaseController {
    bizService!: TService;
    constructor(@Inject(serviceRef) _bizService: TService) {
      this.bizService = _bizService;
    }
    @Get(routeName ? routeName : pluralize(entityRef.name.toLowerCase()))
    @Roles(USER_ROLE.EMPLOYEE, USER_ROLE.STUDENT)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
      tags: [entityRef.name.toLowerCase()],
      operationId: `getAll${entityRef.name}`,
      summary: `Get all ${entityRef.name}`,
      description: `Get all ${entityRef.name}`,
    })
    @ApiOkResponsePaginated(entityRef)
    @ApiBearerAuth('token')
    @ApiQuery({ type: queryDto })
    async getAll(@Query() queryDto: QueryDto): Promise<PageDto<TEntity>> {
      return this.bizService.findAll(queryDto);
    }
  }
  return BaseController;
}
