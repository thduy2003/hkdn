import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';

@Entity('classes', { schema: 'public' })
export class Class {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @ManyToOne(() => User, (user) => user.classes)
  @JoinColumn([{ name: 'teacher_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => Course, (course) => course.classes)
  @JoinColumn([{ name: 'course_id', referencedColumnName: 'id' }])
  course: Course;

  @Column('character varying', { name: 'name', length: 255 })
  name: string;

  @Column('timestamp with time zone', {
    name: 'start_date',
  })
  startDate: Date | null;

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
}
