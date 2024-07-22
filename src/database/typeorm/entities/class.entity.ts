import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';
import { ClassEnrollment } from './class-enrollment.entity';
import { ExamResult } from './exam-result.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { Exam } from './exam.entity';

@Entity('classes', { schema: 'public' })
export class Class extends BaseEntity {
  // @ApiPropertyOptional()
  // @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  // id: number;

  @ManyToOne(() => User, (user) => user.classes)
  @JoinColumn([{ name: 'teacher_id', referencedColumnName: 'id' }])
  teacher: User;

  @ManyToOne(() => Course, (course) => course.classes)
  @JoinColumn([{ name: 'course_id', referencedColumnName: 'id' }])
  course: Course;

  @ApiPropertyOptional()
  @Column('character varying', { name: 'name', length: 255 })
  name: string;

  @ApiPropertyOptional()
  @Column('timestamp with time zone', {
    name: 'start_date',
  })
  startDate: Date | null;

  @ApiPropertyOptional()
  @Column('timestamp with time zone', {
    name: 'end_date',
  })
  endDate: Date | null;

  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @OneToMany(() => ClassEnrollment, (classEnrollment) => classEnrollment.class, { cascade: true })
  classEnrollments: ClassEnrollment[];

  @OneToMany(() => ExamResult, (examResult) => examResult.class, { cascade: true })
  examResults: ExamResult[];
  //change first column in the join table use join column, and change second column use inverseJoinColumn
  @ManyToMany(() => Exam)
  @JoinTable({
    name: 'class_exam',
    joinColumn: { name: 'class_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'exam_id', referencedColumnName: 'id' },
  })
  exams: Exam[];
}
