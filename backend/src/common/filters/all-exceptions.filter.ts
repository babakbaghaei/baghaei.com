import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as Sentry from '@sentry/nestjs';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : (exception as Error).message || 'Internal server error';

    this.logger.error(
      `Status: ${httpStatus} Error: ${typeof message === 'object' ? JSON.stringify(message) : message}`,
      exception instanceof Error ? exception.stack : '',
    );

    // Report only genuine server errors to Sentry (no-op without SENTRY_DSN);
    // 4xx client errors are expected and would be noise.
    if (httpStatus >= 500) {
      Sentry.captureException(exception);
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: typeof message === 'object' ? (message as any).message : message,
      requestId: ctx.getRequest().headers['x-request-id'] || 'N/A',
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
