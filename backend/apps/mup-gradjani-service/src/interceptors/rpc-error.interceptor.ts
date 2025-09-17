import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, catchError } from 'rxjs';

@Injectable()
export class RpcErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        console.error('[RpcErrorInterceptor] error:', {
          name: error?.name,
          code: error?.code,
          message: error?.message,
          meta: error?.meta,
        });

        // Transformiši sve greške u RpcException format
        throw new RpcException({
          name: error.name,
          message: error.message,
          status: error.status || 500,
          statusCode: error.status || 500,
        });
      }),
    );
  }
}
