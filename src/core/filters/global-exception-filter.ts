import { NodeEnv } from '@core/enum';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterError } from 'multer';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { ProjectLogger } from '../loggers';
import { I18nContext } from 'nestjs-i18n';
import { ErrorService } from '@shared/services/error.service';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  logger = new ProjectLogger('GlobalExceptionsFilter');

  constructor(private configService: ConfigService, private errorService: ErrorService) {}
  catch(exception: any, host: ArgumentsHost): any {
    if (exception instanceof HttpException) {
      return this.handleHttpException(exception, host);
    }
    return this.handleSystemException(exception, host);
  }

  /**
   * HttpException error handler. Recommended for customized error message.
   */
  private handleHttpException(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const customResponse: any = exception.getResponse();
    const i18n = I18nContext.current(host);
    const stackTrace = exception.stack;
    console.log('customResponse', customResponse);
    const message = customResponse || response.message || 'Unknown server errors';
    console.log('message handleHttpException: ' + message);
    if (this.configService.get('NODE_ENV') == NodeEnv.DEVELOPMENT) {
      this.logger.info(exception.message);
    } else {
      this.logger.exception(exception.stack);
    }

    return response.status(exception.getStatus()).json({
      error_code: exception.getStatus(),
      message: this.errorService.message(message, i18n, stackTrace),
    });
  }

  /**
   * System exception error handler. This will throw out generic messages if invoked.
   */
  private handleSystemException(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let message = exception.message;

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    switch (exception.constructor) {
      case EntityNotFoundError:
        statusCode = HttpStatus.NOT_FOUND;
        message = 'Not found';
        break;
      case QueryFailedError:
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Query error';
        break;
      case MulterError:
        statusCode = HttpStatus.BAD_REQUEST;
        message = exception.message;
        break;
      default:
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Unknown server error';
        break;
    }
    this.logger.exception(exception.stack);

    return response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
