import { Controller } from '@nestjs/common';
import { ClassService } from './class.service';
import { BaseController } from '@core/services/base.controller';
import { Class } from '@database/typeorm/entities/class.entity';
import { ClassQueryDto } from './dto/class-query.dto';

@Controller('')
export class ClassController extends BaseController<Class, ClassService, ClassQueryDto>(
  Class,
  ClassService,
  ClassQueryDto,
) {
  constructor(private readonly classService: ClassService) {
    super(classService);
  }
}
