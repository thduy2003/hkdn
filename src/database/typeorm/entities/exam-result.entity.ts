import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Class } from './class.entity';
import { Exam } from './exam.entity';
import { Feedback } from './feedback.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';

@Entity('exam_results', { schema: 'public' })
export class ExamResult extends BaseEntity {
  // @ApiPropertyOptional()
  // @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  // id: number;

  @ManyToOne(() => Exam, (exam) => exam.examResults)
  @JoinColumn({ name: 'exam_id', referencedColumnName: 'id' })
  exam: Exam;

  @ManyToOne(() => Class, (classs) => classs.examResults)
  @JoinColumn({ name: 'class_id', referencedColumnName: 'id' })
  class: Class;

  @ManyToOne(() => User, (user) => user.examResults)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'id' })
  user: User;

  @ApiPropertyOptional()
  @Column('decimal', { precision: 6, scale: 2 })
  result: number;

  @ApiPropertyOptional()
  @Column('timestamp with time zone', {
    name: 'deadline_feedback',
    default: () => 'CURRENT_TIMESTAMP',
  })
  deadlineFeedback: Date;

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

  @OneToMany(() => Feedback, (feedback) => feedback.examResult)
  feedbacks: Feedback[];
}
