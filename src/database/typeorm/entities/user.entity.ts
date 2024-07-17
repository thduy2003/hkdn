import { BeforeInsert, BeforeUpdate, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import * as argon2 from 'argon2';
import { Class } from './class.entity';
import { ClassEnrollment } from './class-enrollment.entity';
import { ExamResult } from './exam-result.entity';
import { Feedback } from './feedback.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';

@Index('users_email_key', ['email'], { unique: true })
@Index('users_pkey', ['id'], { unique: true })
@Entity('users', { schema: 'public' })
export class User extends BaseEntity {
  // @ApiPropertyOptional()
  // @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  // id: number;

  @ApiPropertyOptional()
  @Column('character varying', { name: 'name', length: 255 })
  fullName: string;

  @ApiPropertyOptional()
  @Column('character varying', { name: 'email', unique: true, length: 255 })
  email: string;

  @Column('character varying', { name: 'password', length: 255 })
  password: string;

  @Column('character varying', {
    name: 'refresh_token',
    nullable: true,
    default: null,
  })
  refreshToken: string;

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

  @ApiPropertyOptional()
  @Column('character varying', { name: 'role', length: 255 })
  role: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @BeforeUpdate()
  async updatePassword() {
    this.password = await argon2.hash(this.password);
  }

  @OneToMany(() => Class, (classs) => classs.user)
  classes: Class[];

  @OneToMany(() => ClassEnrollment, (classEnrollment) => classEnrollment.user, { cascade: true })
  classEnrollments: ClassEnrollment[];

  @OneToMany(() => ExamResult, (examResult) => examResult.user)
  examResults: ExamResult[];

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];
}
