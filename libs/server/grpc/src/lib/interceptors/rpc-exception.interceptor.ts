import { status } from '@grpc/grpc-js';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { catchError, Observable, throwError } from 'rxjs';

/**
 * Rpc exceptions interceptor catch the errors
 */
@Injectable()
export class RpcExceptionInterceptor implements NestInterceptor {
  public intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof RpcException) {
          return throwError(() => error);
        }

        return throwError(
          () =>
            new RpcException({
              code: error?.code ?? status.INTERNAL,
              message: error?.details ?? 'Unknown error',
            })
        );
      })
    );
  }
}
