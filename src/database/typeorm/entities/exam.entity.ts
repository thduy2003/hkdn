import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ExamResult } from './exam-result.entity';

@Entity('exams', { schema: 'public' })
export class Exam {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'name', length: 255 })
  name: string;

  @Column('character varying', { name: 'type', length: 255 })
  type: string;

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

  @OneToMany(() => ExamResult, (examResult) => examResult.exam)
  examResults: ExamResult[];
}