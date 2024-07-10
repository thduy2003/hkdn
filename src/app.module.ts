import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';
import { DataSource } from 'typeorm';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { APP_FILTER } from '@nestjs/core';
import { BadRequestExceptionFilter } from '@core/filters/bad-request.filter';
import { ConflictExceptionFilter } from '@core/filters/conflict-exception.filter';
import { ForbiddenExceptionFilter } from '@core/filters/forbidden.filter';
import { InternalServerErrorExceptionFilter } from '@core/filters/internal-server-error.filter';
import { NotFoundExceptionFilter } from '@core/filters/not-found.filter';
import { UnauthorizedExceptionFilter } from '@core/filters/unauthorized.filter';
import { UnprocessableEntityExceptionFilter } from '@core/filters/unprocess-entity.filter';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AdminModule } from '@modules/admin/admin.module';
import { ExamModule } from '@modules/exam/exam.module';
import { FeedbackModule } from '@modules/feedback/feedback.module';
@Module({
  imports: [
    AuthModule,
    AdminModule,
    UserModule,
    ExamModule,
    FeedbackModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.mysqlConfig,
      inject: [ApiConfigService, ConfigService],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        en: 'en',
        vi: 'vi',
      },
      loaderOptions: {
        path: path.join(__dirname, '../src/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: BadRequestExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ConflictExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ForbiddenExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: InternalServerErrorExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: UnprocessableEntityExceptionFilter,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
