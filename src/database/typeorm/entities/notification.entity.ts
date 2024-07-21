import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('notifications', { schema: 'public' })
export class Notification extends BaseEntity {
  @ManyToOne(() => User, (user) => user.examResults)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ApiPropertyOptional()
  @Column('text', { name: 'content' })
  content: string;

  @Column({ default: false })
  read: boolean;

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
