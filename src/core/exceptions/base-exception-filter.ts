import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface ApiError {
  statusCode: number;
  message: string | object;
  error: string;
}

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const body: ApiError = {
      error: exception.message,
      message: exception.getResponse(),
      statusCode: status,
    };

    response.status(status).json(body);
  }
}
