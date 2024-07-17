import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Class } from '@database/typeorm/entities/class.entity';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Class]), forwardRef(() => UserModule)],
  controllers: [ClassController],
  providers: [ClassService, JwtService],
  exports: [ClassService],
})
export class ClassModule {}
