import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ExamResult } from './exam-result.entity';
import { User } from './user.entity';

@Entity('feedbacks', { schema: 'public' })
export class Feedback {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'content' })
  content: string;

  @Column('character varying', { name: 'type', length: 255 })
  type: string;

  @ManyToOne(() => ExamResult, (examResult) => examResult.feedbacks)
  @JoinColumn({ name: 'exam_result_id', referencedColumnName: 'id' })
  examResult: ExamResult;

  @ManyToOne(() => User, (user) => user.feedbacks)
  @JoinColumn({ name: 'student_id' })
  user: User;

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
}
