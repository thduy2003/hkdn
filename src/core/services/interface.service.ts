import { PageDto } from '@core/pagination/dto/page-dto';
import { FindManyOptions } from 'typeorm';

export interface IService<IEntity> {
  find(query: any): Promise<PageDto<IEntity>>;
}
