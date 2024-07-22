import { Injectable } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { I18nContext } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import { NodeEnv } from '@core/enum';
import * as _ from 'lodash';

@Injectable()
export class ErrorService {
  constructor(private readonly configService: ConfigService) {}
  message(err: string | object, i18n: I18nContext, stackTrace: any) {
    const errorMessage = _.isArray(err['message']) ? err['message'][0] : err['message'];
    const args = err['args'] ? err['args'] : {};
    console.log('error message: ' + errorMessage);
    switch (err['error']) {
      case 'Bad Request':
        return this.combine(errorMessage, i18n, args);
      case 'Forbidden':
        return this.combine(errorMessage, i18n, args);
      case 'Internal Server Error':
        if (this.configService.get('NODE_ENV') == NodeEnv.DEVELOPMENT) {
          return this.combineDev(errorMessage, i18n, stackTrace);
        }
        return this.combine(errorMessage, i18n, args);
      case 'Not Found':
        return this.combine(errorMessage, i18n, args);
      case 'Unauthorized':
        return this.combine(errorMessage, i18n, args);
      case 'Unprocessable Entity':
        return this.handleUnprocessEntity(err, i18n);
      default:
        return this.combine(errorMessage, i18n, args);
    }
  }

  private handleUnprocessEntity(error: string | object, i18n: I18nContext) {
    const transformedError = this.transform(error['message'], i18n).flat();

    return this.combine('CUS-0401', i18n, transformedError);
  }

  private transform(errors: ValidationError[], i18n: I18nContext) {
    const transformedError = errors.map((err: ValidationError) => {
      return Object.values(err.constraints).map((value: string) => {
        return Object.assign(
          i18n.t(`errors.${value}`, {
            args: { property: err.property },
          }),
          { field: err.property },
        );
      });
    });

    return transformedError;
  }

  private combine(err_msg: string, i18n: I18nContext, args: object = {}) {
    console.log('args', args);
    return Object.assign(i18n.t(`errors.${err_msg}`, { args }));
  }

  private combineDev(err_msg: string, i18n: I18nContext, stackTrace: any) {
    return Object.assign(i18n.t(`errors.${err_msg}`), {
      details: stackTrace,
    });
  }
}
