import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@database/typeorm/entities';
import { JwtService } from '@nestjs/jwt';
import { Class } from '@database/typeorm/entities/class.entity';
import { Course } from '@database/typeorm/entities/course.entity';
import { ClassEnrollment } from '@database/typeorm/entities/class-enrollment.entity';
import { ClassService } from '@modules/class/class.service';
import { ClassModule } from '@modules/class/class.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, ClassEnrollment]), ClassModule],
  controllers: [UserController],
  providers: [UserService, JwtService],
  exports: [UserService],
})
export class UserModule {}
