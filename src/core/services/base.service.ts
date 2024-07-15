import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { dashToCamelCase } from '@shared/utils/string-util';
import { IService } from './interface.service';
import { PageDto } from '@core/pagination/dto/page-dto';
import { PageMetaDto } from '@core/pagination/dto/page-meta.dto';

export function BaseService<TEntity>(entityRef: EntityClassOrSchema) {
  class AbstractBaseService implements IService<TEntity> {
    repository: Repository<TEntity>;
    constructor(@InjectRepository(entityRef) _repository: Repository<TEntity>) {
      this.repository = _repository;
    }
    async populateSearchOptions(searchParams: any): Promise<any> {
      return Promise.resolve({
        where: searchParams && this.autoMapWhereCriteria(searchParams),
      });
    }
    autoMapWhereCriteria(searchParams) {
      const where = {};

      if (
        searchParams &&
        searchParams.query &&
        Object.keys(searchParams.query).length > 0
      ) {
        for (const key in searchParams.query) {
          const modelProp = dashToCamelCase(key);

          // Only add where field if the field name is value
          if (this.isFieldNameValid(modelProp)) {
            if (searchParams.query[key]) {
              let queryValue: any = searchParams.query[key];

              // Support search over array (IN operation)
              // Some string fields that does not support IN will throw error?
              if (
                queryValue &&
                typeof queryValue.indexOf === 'function' &&
                queryValue.indexOf(',') !== -1
              ) {
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
        if (
          !this.repository.metadata.connection
            .getMetadata(entityRef)
            .findColumnWithPropertyName(field)
        ) {
          isValid = false;
        }
      });

      return isValid;
    }
    populateDefaultQueryOptions(options) {
      let queryOpts: FindManyOptions = {};

      if (!options) {
        return {};
      }

      let skip;

      if (options.page && options.take) {
        skip = (options.page - 1) * options.take;
      }

      queryOpts = {
        skip,
        order: options.sort,
        where: options.where,
        select: options.attributes,
      };

      if (options.query && options.query.include) {
        queryOpts.relations = options.query.include.split(',');
      }

      if (options.take !== -1) {
        queryOpts.take = options.take;
      }

      return queryOpts;
    }
    async find(where: any): Promise<PageDto<TEntity>> {
      const [data, count] = await this.repository.findAndCount(where);
      const pageMetaDto = new PageMetaDto({
        itemCount: count,
        pageOptionsDto: where.pageOptionsDto,
      });
      return new PageDto(data, pageMetaDto);
    }
  }
  return AbstractBaseService;
}
