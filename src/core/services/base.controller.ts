import { PageDto } from '@core/pagination/dto/page-dto';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Query, UseGuards } from '@nestjs/common';
import { IService } from './interface.service';
import { Roles } from '@modules/auth/guard/roles.decorator';
import { USER_ROLE } from '@shared/enum/user.enum';
import { RolesGuard } from '@modules/auth/guard/roles.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@modules/auth/guard/auth.guard';
import { ApiOkResponseDefault, ApiOkResponsePaginated } from './response.decorator';
import pluralize from 'pluralize';
import { ResponseDto } from '@core/query/dto/response-dto';
import { PageOptionsDto } from '@core/pagination/dto/page-option.dto';
export function BaseController<TEntity, TService extends IService<TEntity, QueryDto>, QueryDto = PageOptionsDto>(
  entityRef: any,
  serviceRef: any,
  queryDto: any = PageOptionsDto,
  inputRef: any = undefined,
) {
  @Controller()
  class BaseController {
    bizService!: TService;
    constructor(@Inject(serviceRef) _bizService: TService) {
      this.bizService = _bizService;
    }
    @Get(pluralize(entityRef.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()))
    @Roles(USER_ROLE.EMPLOYEE, USER_ROLE.TEACHER)
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

    @Post(entityRef.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase())
    @Roles(USER_ROLE.EMPLOYEE)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
      tags: [entityRef.name.toLowerCase()],
      operationId: `create${entityRef.name}`,
      summary: `create a ${entityRef.name}`,
      description: `create a ${entityRef.name}`,
    })
    @ApiOkResponseDefault(entityRef)
    @ApiBody({ type: inputRef })
    @ApiBearerAuth('token')
    async createClass(@Body() data: typeof inputRef): Promise<TEntity> {
      return this.bizService.save(data);
    }
  }
  return BaseController;
}
