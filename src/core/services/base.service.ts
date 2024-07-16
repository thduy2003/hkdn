import { FindManyOptions, Repository } from 'typeorm';
import { dashToCamelCase } from '@shared/utils/string-util';
import { IService } from './interface.service';
import { PageDto } from '@core/pagination/dto/page-dto';
import { PageMetaDto } from '@core/pagination/dto/page-meta.dto';
import { PageOptionsDto } from '@core/pagination/dto/page-option.dto';
import { Inject } from '@nestjs/common';
import { BaseEntity } from './base.entity';

export abstract class AbstractBaseService<TEntity, QueryDto extends PageOptionsDto>
  implements IService<TEntity, QueryDto>
{
  repository: Repository<TEntity>;
  constructor(
    @Inject()
    _repository: Repository<TEntity>,
  ) {
    this.repository = _repository;
  }

  protected async populateSearchOptions(searchParams: QueryDto): Promise<FindManyOptions> {
    return Promise.resolve({
      where: searchParams && this.autoMapWhereCriteria(searchParams),
    });
  }
  protected autoMapWhereCriteria(searchParams: QueryDto) {
    const where = {};

    if (searchParams && Object.keys(searchParams).length > 0) {
      for (const key in searchParams) {
        const modelProp = dashToCamelCase(key);

        // Only add where field if the field name is value
        if (this.isFieldNameValid(modelProp)) {
          if (searchParams[key]) {
            let queryValue: any = searchParams[key];

            // Support search over array (IN operation)
            // Some string fields that does not support IN will throw error?
            if (queryValue && typeof queryValue.indexOf === 'function' && queryValue.indexOf(',') !== -1) {
              queryValue = queryValue.split(',');
            }

            where[modelProp] = queryValue;
          }
        }
      }
    }

    return where;
  }
  isFieldNameValid(fields: string | Array<string>): boolean {
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    let isValid = true;

    fieldArray.forEach((field) => {
      if (!this.repository.metadata.findColumnWithPropertyName(field)) {
        isValid = false;
      }
    });

    return isValid;
  }
  async findAll(query: QueryDto): Promise<PageDto<TEntity>> {
    if (isNaN(query.page)) {
      query.page = 1;
    } else {
      query.page = parseInt(query.page.toString());
      if (query.page < 1) {
        query.page = 1;
      }
    }

    query.page_size = query.page_size ? parseInt(query.page_size.toString()) : 10;

    const pageOptionsDto = new PageOptionsDto();
    pageOptionsDto.order = query.order;
    pageOptionsDto.page = query.page;
    pageOptionsDto.page_size = query.page_size;
    if (query.keyword) {
      pageOptionsDto.keyword = query.keyword;
    }
    const managerOptions: FindManyOptions = await this.populateSearchOptions(query);
    managerOptions.skip = (pageOptionsDto.page - 1) * pageOptionsDto.page_size;
    managerOptions.take = pageOptionsDto.page_size;
    const [data, count] = await this.repository.findAndCount(managerOptions);
    const pageMetaDto = new PageMetaDto({
      itemCount: count,
      pageOptionsDto: pageOptionsDto,
    });
    return new PageDto(data, pageMetaDto);
  }

  // protected beforeSave(originalEntity: TEntity, entity: TEntity): Promise<TEntity> {
  //   return Promise.resolve(entity);
  // }
  // private populateSaveOptions(entity: TEntity, action: string) {
  //   const result = {
  //     functionName: 'create',
  //     options: {
  //       isNewRecord: true,
  //       where: {},
  //     },
  //   };

  //   if (action !== 'create') {
  //     result.functionName = 'update';
  //     result.options.where[this.getPrimaryKey()] = entity[this.getPrimaryKey()];
  //   }

  //   return result;
  // }
  // getPrimaryKey(): string {
  //   return this.repository.metadata.primaryColumns[0].propertyName;
  // }
  // async getById(key: any) {
  //   if (!key) {
  //     return null;
  //   }

  //   return this.repository.findOne({
  //     where: {
  //       id: key,
  //     },
  //   });
  // }
  // protected getEntity(entity: TEntity) {
  //   return this.getById(entity[this.getPrimaryKey()]);
  // }

  // private async executeSaveEntity(originalEntity: TEntity, entity: TEntity, action: string): Promise<TEntity> {
  //   const copiedEntity = { ...entity };
  //   const saveOptions = this.populateSaveOptions(entity, action);
  //   let previousDataValues;
  //   if (originalEntity) {
  //     previousDataValues = (originalEntity as any).dataValues;
  //   }
  //   return this.repository.manager.transaction(async (trx) => {
  //     let savedResult: TEntity;
  //     // Get latest entity to execute update association
  //     const currentEntityInstance = await this.getEntity(action === 'create' ? savedResult : entity);
  //   });
  // }
}
