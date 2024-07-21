import { FindManyOptions, Repository } from 'typeorm';
import { dashToCamelCase } from '@shared/utils/string-util';
import { IService } from './interface.service';
import { PageDto } from '@core/pagination/dto/page-dto';
import { PageMetaDto } from '@core/pagination/dto/page-meta.dto';
import { PageOptionsDto } from '@core/pagination/dto/page-option.dto';
import { BadRequestException, Inject } from '@nestjs/common';
import { BaseEntity } from '../../database/typeorm/entities/base.entity';

export abstract class AbstractBaseService<TEntity extends BaseEntity, QueryDto extends PageOptionsDto = PageOptionsDto>
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
  protected async populateReturnedData(entity: TEntity[]): Promise<TEntity[]> {
    return Promise.resolve(entity);
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
  populateDefaultSearch(query: QueryDto): PageOptionsDto {
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
    return pageOptionsDto;
  }
  async findAll(query: QueryDto): Promise<PageDto<TEntity>> {
    const searchOptions = this.populateDefaultSearch(query);
    const managerOptions: FindManyOptions = await this.populateSearchOptions(query);
    managerOptions.skip = (searchOptions.page - 1) * searchOptions.page_size;
    managerOptions.take = searchOptions.page_size;
    console.log(managerOptions);
    const [data, count] = await this.repository.findAndCount(managerOptions);
    const returnedData = await this.populateReturnedData(data);
    const pageMetaDto = new PageMetaDto({
      itemCount: count,
      pageOptionsDto: searchOptions,
    });
    return new PageDto(returnedData, pageMetaDto);
  }
  protected populateEntity(existingEntity: TEntity, entity: TEntity, action: string): Promise<any> {
    return Promise.resolve(entity);
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected validateEntity(originalEntity: TEntity, entity: TEntity, action: string): void {}

  protected beforeSave(originalEntity: TEntity, entity: TEntity, action: string): Promise<TEntity> {
    return Promise.resolve(entity);
  }
  protected afterSaved(savedEntity: TEntity, action: string): Promise<TEntity> {
    return Promise.resolve(savedEntity);
  }
  protected afterCompleted(originalEntity: TEntity, savedEntity: TEntity, action: string): Promise<TEntity> {
    return Promise.resolve(savedEntity);
  }

  getPrimaryKey(): string {
    return this.repository.metadata.primaryColumns[0].propertyName;
  }
  async getById(key: any, repository?: any) {
    if (!key) {
      return null;
    }

    return (repository ?? this.repository).findOne({
      where: {
        id: key,
      },
    });
  }
  protected getEntity(entity: TEntity) {
    const test = this.getById(entity[this.getPrimaryKey()]);
    console.log('found', test);
    return this.getById(entity[this.getPrimaryKey()]);
  }

  private async executeSaveEntity(originalEntity: TEntity, entity: TEntity, action: string): Promise<TEntity> {
    return this.repository.manager
      .transaction(async (transactionalEntityManager) => {
        entity = await this.beforeSave(originalEntity, entity, action);
        let createEntity: TEntity;
        if (action === 'create') {
          createEntity = await this.repository.create(entity);
        }
        const savedResult = await transactionalEntityManager.save(action === 'create' ? createEntity : entity);
        // Get latest entity to execute update association
        const currentEntityInstance = action === 'create' ? savedResult : entity;
        await this.afterSaved(currentEntityInstance, action);
        return this.getEntity(currentEntityInstance);
      })
      .then(async (savedEntity) => {
        await this.afterCompleted(originalEntity, savedEntity, action);
        return Promise.resolve(savedEntity);
      });
  }
  async save(entity: TEntity): Promise<TEntity> {
    // We support update by either using id or primary key
    // but before saving we need to set the id to primary key
    if (!entity[this.getPrimaryKey()]) {
      entity[this.getPrimaryKey()] = entity.id;
      delete entity.id;
    }
    console.log('entity', entity);
    // Determine action based on the id field of entity object
    const existingEntity = await this.getEntity(entity);

    // Do not allow to update soft deleted record
    // if (existingEntity && existingEntity.isDeleted) {
    //     throw new ForbiddenError('This record has been marked as soft deleted so cannot be updated.');
    // }

    // Determine insert or update based on the existence of entity
    const action = existingEntity === null ? 'create' : 'update';

    // Execute populate entity details before executing save function
    entity = await this.populateEntity(existingEntity, entity, action);
    const autoIncrementColumn = this.repository.metadata.columns.find(
      (column) => column.isGenerated && column.generationStrategy === 'increment',
    ).propertyName;
    // We need to delete the PK value for auto increment column before creating to avoid error
    if (action === 'create' && this.getPrimaryKey() === autoIncrementColumn) {
      delete entity[this.getPrimaryKey()];
    }
    // Validate entity data before saving
    await this.validateEntity(existingEntity, entity, action);

    // Execute the check duplicate record function
    // Each service should able to implement that function to validate duplication
    // error before executing insert object to database
    // await this.checkDuplicateRecord(entity, action);

    return this.executeSaveEntity(existingEntity, entity, action);
  }
}
