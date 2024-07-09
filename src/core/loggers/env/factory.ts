import { LoggerOptions } from 'typeorm';
import { NodeEnv } from '@core/enum';
import { ConfigService } from '@nestjs/config';
import { LocalLogger } from './local';
import { ProductionLogger } from './production';

const loggerMap = {
  [NodeEnv.DEVELOPMENT]: LocalLogger,
  [NodeEnv.PRODUCTION]: ProductionLogger,
};

const configService = new ConfigService();

export class LoggerFactory {
  static getInstance(
    loggerOptions: LoggerOptions,
    name: string,
  ): LocalLogger | ProductionLogger {
    const instance = loggerMap[configService.get('NODE_ENV')];
    return new instance(loggerOptions, name);
  }
}
