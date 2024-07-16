import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { AbstractBaseService } from '@core/services/base.service';
import { ClassEnrollment } from '@database/typeorm/entities/class-enrollment.entity';
import { ClassEnrollmentQueryDto } from './dto/class-enrollment-query.dto';
import { EnrollClassDto } from './dto/enroll-class.dto';
import { Class } from '@database/typeorm/entities/class.entity';
import { User } from '@database/typeorm/entities';

@Injectable()
export class ClassEnrollmentService extends AbstractBaseService<ClassEnrollment, ClassEnrollmentQueryDto> {
  constructor(
    @InjectRepository(ClassEnrollment)
    classEnrollmentRepository: Repository<ClassEnrollment>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(classEnrollmentRepository);
  }
  protected async populateSearchOptions(searchParams: ClassEnrollmentQueryDto): Promise<FindManyOptions> {
    const options = await super.populateSearchOptions(searchParams);
    const criteriaOptions: FindManyOptions = {
      where: options.where,
      order: {
        createdAt: searchParams.order || 'DESC',
      },
      relations: {
        user: true,
        class: true,
      },
      select: {
        classId: true,
        studentId: true,
        enrollmentDate: true,
        createdAt: true,
        user: {
          fullName: true,
        },
        class: {
          name: true,
          startDate: true,
          endDate: true,
        },
      },
    };
    return Promise.resolve(criteriaOptions);
  }
  async enrollClass(data: EnrollClassDto): Promise<ClassEnrollment> {
    const isClassExisted = await this.classRepository.findOneBy({
      id: data.classId,
    });
    if (!isClassExisted) {
      throw new BadRequestException('Không tồn tại lớp học này');
    }
    const isStudentExisted = await this.userRepository.findOneBy({
      id: data.studentId,
    });
    if (!isStudentExisted) {
      throw new BadRequestException('Không tồn tại học sinh này');
    }
    const checkDuplicate = await this.repository.findOneBy({
      classId: data.classId,
      studentId: data.studentId,
    });
    if (checkDuplicate) {
      throw new BadRequestException('Học sinh này đã được đăng kí ở lớp rồi');
    }
    const enroll = this.repository.create({
      ...data,
      class: {
        id: data.classId,
      },
      user: {
        id: data.studentId,
      },
      enrollmentDate: new Date(),
    });
    return this.repository.save(enroll);
  }
}
