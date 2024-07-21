import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ProjectLogger } from '@core/loggers';
import { ValidationPipe } from '@nestjs/common';
import { requestLoggerMiddleware } from '@shared/middleware/request-logger.middleware';
import { setupSwagger } from './setup-swagger';
import cookieParser from 'cookie-parser';
import { TransformInterceptor } from '@shared/interceptors/transform.interceptor';
import { GlobalExceptionsFilter } from '@core/filters/global-exception-filter';
import { ErrorService } from '@shared/services/error.service';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import serviceAccount from '@config/firebase/serviceAccountKey.json';

const logger = new ProjectLogger('bootstrap');

async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter());
  app.setGlobalPrefix('/api');
  app.use(requestLoggerMiddleware);
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    databaseURL: 'https://fcm-notifications-system.firebaseio.com',
  });
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
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

  //config firebase
  // const params = {
  //   projectId: config.getOrThrow('FIREBASE_PROJECT_ID'),
  //   clientEmail: config.getOrThrow('FIREBASE_CLIENT_EMAIL').firebaseClientEmail,
  //   credential: admin.credential.cert({
  //     privateKey: config.getOrThrow('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
  //   }),
  // };
  // admin.initializeApp({ ...params });

  app.useGlobalFilters(new GlobalExceptionsFilter(config, error));

  await app.listen(config.get('PORT'), async () => {
    logger.info(`Application is running on: ${await app.getUrl()}`);
  });

  return app;
}
bootstrap();
