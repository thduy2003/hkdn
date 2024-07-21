import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { Class } from './class.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { ExamResult } from './exam-result.entity';

@Entity('class_enrollment', { schema: 'public' })
export class ClassEnrollment extends BaseEntity {
  @ApiPropertyOptional()
  @Column({ name: 'class_id' })
  classId: number;

  @ApiPropertyOptional()
  @Column({ name: 'student_id' })
  studentId: number;

  //use arrow function to resolve circular dependencies
  @ApiPropertyOptional({ type: () => Class })
  @ManyToOne(() => Class, (classEntity) => classEntity.classEnrollments)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  //use arrow function to resolve circular dependencies
  @ApiPropertyOptional({ type: () => User })
  @ManyToOne(() => User, (user) => user.classEnrollments, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ApiPropertyOptional()
  @Column('timestamp with time zone', {
    name: 'enrollment_date',
  })
  enrollmentDate: Date | null;

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

  @OneToMany(() => ExamResult, (examResult) => examResult.student, { cascade: true })
  examResults: ExamResult[];
}
