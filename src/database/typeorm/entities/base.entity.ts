import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity as TypeOrmBaseEntity, PrimaryGeneratedColumn } from 'typeorm';
export class BaseEntity extends TypeOrmBaseEntity {
  @ApiPropertyOptional()
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id?: number;
}
