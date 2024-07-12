import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ProjectLogger } from '@core/loggers';
import { ValidationPipe } from '@nestjs/common';
import { requestLoggerMiddleware } from '@shared/middleware/request-logger.middleware';
import { setupSwagger } from './setup-swagger';
import * as cookieParser from 'cookie-parser';
import { TransformInterceptor } from '@shared/interceptors/transform.interceptor';
import { GlobalExceptionsFilter } from '@core/filters/global-exception-filter';
import { UnauthorizedExceptionFilter } from '@core/filters/unauthorized.filter';
import { ErrorService } from '@shared/services/error.service';

const logger = new ProjectLogger('bootstrap');

async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );
  app.setGlobalPrefix('/api');
  app.use(requestLoggerMiddleware);
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.enableCors({ origin: '*', credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  setupSwagger(app);

  const config = app.get<ConfigService>(ConfigService);
  const error = app.get<ErrorService>(ErrorService);

  app.useGlobalFilters(new GlobalExceptionsFilter(config, error));
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  });
  await app.listen(config.get('PORT'), async () => {
    logger.info(`Application is running on: ${await app.getUrl()}`);
  });

  return app;
}
bootstrap();
