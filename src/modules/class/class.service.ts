import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import moment from 'moment';
import { Class } from '@database/typeorm/entities/class.entity';
import { AbstractBaseService } from '@core/services/base.service';
import { ClassQueryDto } from './dto/class-query.dto';

@Injectable()
export class ClassService extends AbstractBaseService<Class, ClassQueryDto> {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {
    super(classRepository);
  }
  async findOne(id: number): Promise<Class> {
    return this.repository.findOneBy({
      id,
    });
  }
}
