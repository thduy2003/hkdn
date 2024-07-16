import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Class } from './class.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

@Entity('courses', { schema: 'public' })
export class Course {
  @ApiPropertyOptional()
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @ApiPropertyOptional()
  @Column('character varying', { name: 'name', length: 255 })
  name: string;

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

  @OneToMany(() => Class, (classs) => classs.course)
  classes: Class[];
}
