import { status } from '@grpc/grpc-js';
import {
  ArgumentsHost,
  Catch,
  Logger,
  RpcExceptionFilter as IRpcExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { LogObservableError } from '@nx-mfe/server/common';
import { Observable, throwError } from 'rxjs';

@Catch()
export class RpcExceptionFilter implements IRpcExceptionFilter {
  private static readonly _logger = new Logger('RpcExceptionFilter');

  @LogObservableError(RpcExceptionFilter._logger, 'error')
  public catch(exception: any, host: ArgumentsHost): Observable<never> {
    if (host.getType() === 'rpc') {
      if (exception instanceof RpcException) {
        return throwError(() => exception.getError());
      }

      return throwError(() =>
        new RpcException({
          code: exception?.code ?? status.INTERNAL,
          message: exception?.details ?? exception?.message ?? exception,
        }).getError()
      );
    }

    return throwError(() => exception);
  }
}
