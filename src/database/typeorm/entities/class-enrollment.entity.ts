import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { Class } from './class.entity';

@Entity('class_enrollment', { schema: 'public' })
export class ClassEnrollment {
  @PrimaryColumn()
  class_id: number;

  @PrimaryColumn()
  student_id: number;

  @ManyToOne(() => Class, (classEntity) => classEntity.classEnrollments)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @ManyToOne(() => User, (user) => user.classEnrollments)
  @JoinColumn({ name: 'student_id' })
  user: User;

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
}
