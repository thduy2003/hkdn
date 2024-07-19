import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from '@database/typeorm/entities/exam.entity';
import { AbstractBaseService } from '@core/services/base.service';

@Injectable()
export class ExamService extends AbstractBaseService<Exam> {
  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
  ) {
    super(examRepository);
  }

  // async enterResult(data: EnterResultDto, user: JwtPayload): Promise<ExamResult> {
  //   const isExamExisted = await this.examRepository.findOneBy({
  //     id: data.examId,
  //   });
  //   if (!isExamExisted) {
  //     throw new BadRequestException('Bài kiểm tra không tồn tại');
  //   }
  //   const isClassExisted = await this.classRepository.findOneBy({
  //     id: data.classId,
  //   });
  //   if (!isClassExisted) {
  //     throw new BadRequestException('Không tồn tại lớp học này');
  //   }
  //   const isStudentExisted = await this.userRepository.findOneBy({
  //     id: data.studentId,
  //   });
  //   if (!isStudentExisted) {
  //     throw new BadRequestException('Không tồn tại sinh viên này');
  //   }

  //   const isStudentInClass = await this.classRepository
  //     .createQueryBuilder('class')
  //     .innerJoinAndSelect('class.classEnrollments', 'class_enrollment')
  //     .where('class_enrollment.student_id = :studentId', {
  //       studentId: data.studentId,
  //     })
  //     .andWhere('class.id = :classId', { classId: data.classId })
  //     .select(['class.id as classId', 'class_enrollment.student_id as studentId'])
  //     .getRawOne();
  //   if (!isStudentInClass) {
  //     throw new BadRequestException('Sinh viên không thuộc lớp này');
  //   }
  //   const isTeacherInClass = await this.classRepository
  //     .createQueryBuilder('class')
  //     .innerJoinAndSelect('class.user', 'user')
  //     .where('class.user.id = :id', { id: user.userId })
  //     .select(['class.id as classId', 'user.id as teacherId'])
  //     .getRawOne();

  //   if (!isTeacherInClass) {
  //     throw new BadRequestException('Giáo viên không dạy lớp này');
  //   }
  //   const isStudentResultExisted = await this.examResultRepository.findOneBy({
  //     exam: {
  //       id: data.examId,
  //     },
  //     user: {
  //       id: data.studentId,
  //     },
  //     class: {
  //       id: data.classId,
  //     },
  //   });
  //   if (isStudentResultExisted) {
  //     throw new BadRequestException('Điểm bài thi này đã có, vui lòng cập nhật điểm');
  //   }
  //   const examResult = this.examResultRepository.create({
  //     ...data,
  //     exam: {
  //       id: data.examId,
  //     },
  //     user: {
  //       id: data.studentId,
  //     },
  //     class: {
  //       id: data.classId,
  //     },
  //   });
  //   return this.examResultRepository.save(examResult);
  // }
}
