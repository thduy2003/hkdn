import { PageDto } from '@core/pagination/dto/page-dto';
import { FindManyOptions } from 'typeorm';

export interface IService<IEntity, QueryDto> {
  findAll(query: QueryDto): Promise<PageDto<IEntity>>;
  save(entity: IEntity): Promise<Partial<IEntity>>;
}
