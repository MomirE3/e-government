import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcExceptionFilter.name);

  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const error = exception.getError();

    this.logger.error('RPC Exception caught:', error);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // Ako je error objekat sa informacijama o grešci
    if (typeof error === 'object' && error !== null) {
      const errorObj = error as any;

      // Mapiranje različitih tipova grešaka na HTTP status kodove
      if (errorObj.name) {
        switch (errorObj.name) {
          case 'ConflictException':
            status = HttpStatus.CONFLICT;
            message = errorObj.message || 'Resource already exists';
            break;
          case 'NotFoundException':
            status = HttpStatus.NOT_FOUND;
            message = errorObj.message || 'Resource not found';
            break;
          case 'BadRequestException':
            status = HttpStatus.BAD_REQUEST;
            message = errorObj.message || 'Bad request';
            break;
          case 'UnauthorizedException':
            status = HttpStatus.UNAUTHORIZED;
            message = errorObj.message || 'Unauthorized';
            break;
          case 'ForbiddenException':
            status = HttpStatus.FORBIDDEN;
            message = errorObj.message || 'Forbidden';
            break;
          default:
            // Za nepoznate greške, ostavi 500
            message = errorObj.message || 'Internal server error';
            break;
        }
      } else if (errorObj.message) {
        message = errorObj.message;
      }
    } else if (typeof error === 'string') {
      message = error;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
    });
  }
}
