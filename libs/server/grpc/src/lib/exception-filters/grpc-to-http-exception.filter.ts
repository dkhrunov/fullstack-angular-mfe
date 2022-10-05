import { status } from '@grpc/grpc-js';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpAdapterHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ServerErrorResponse } from '@nx-mfe/shared/dto';

import { IGrpcException } from '../exceptions';

@Catch()
export class GrpcToHttpExceptionFilter implements ExceptionFilter {
  private static readonly _logger = new Logger('RpcToHttpExceptionFilter');

  private static _rpcToHttpCodesMap = new Map<number, number>([
    [status.OK, 200],
    [status.CANCELLED, HttpStatus.METHOD_NOT_ALLOWED],
    [status.UNKNOWN, HttpStatus.BAD_GATEWAY],
    [status.INVALID_ARGUMENT, HttpStatus.BAD_REQUEST],
    [status.DEADLINE_EXCEEDED, HttpStatus.REQUEST_TIMEOUT],
    [status.NOT_FOUND, HttpStatus.NOT_FOUND],
    [status.ALREADY_EXISTS, HttpStatus.CONFLICT],
    [status.PERMISSION_DENIED, HttpStatus.FORBIDDEN],
    [status.RESOURCE_EXHAUSTED, HttpStatus.TOO_MANY_REQUESTS],
    [status.FAILED_PRECONDITION, HttpStatus.PRECONDITION_FAILED],
    [status.ABORTED, HttpStatus.GONE],
    [status.OUT_OF_RANGE, HttpStatus.PAYLOAD_TOO_LARGE],
    [status.UNIMPLEMENTED, HttpStatus.NOT_IMPLEMENTED],
    [status.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR],
    [status.UNAVAILABLE, HttpStatus.SERVICE_UNAVAILABLE],
    [status.DATA_LOSS, HttpStatus.INTERNAL_SERVER_ERROR],
    [status.UNAUTHENTICATED, HttpStatus.UNAUTHORIZED],
  ]);

  constructor(private readonly _httpAdapterHost: HttpAdapterHost) {}

  public catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this._httpAdapterHost;
    const ctx = host.switchToHttp();

    let responseBody: ServerErrorResponse;

    if (this._isRpcException(exception)) {
      responseBody = this._rpcExceptionResponse(exception, host);
    } else {
      responseBody = this._defaultExceptionResponse(exception, host);
    }

    GrpcToHttpExceptionFilter._logger.error(responseBody);
    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }

  private _defaultExceptionResponse(exception: any, host: ArgumentsHost): ServerErrorResponse {
    const { httpAdapter } = this._httpAdapterHost;
    const ctx = host.switchToHttp();

    return {
      statusCode: exception.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception?.message ?? 'Internal server error',
      error: HttpStatus[exception.status] ?? HttpStatus[500],
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };
  }

  private _rpcExceptionResponse(
    exception: IGrpcException,
    host: ArgumentsHost
  ): ServerErrorResponse {
    const { httpAdapter } = this._httpAdapterHost;
    const ctx = host.switchToHttp();
    const statusCode =
      GrpcToHttpExceptionFilter._rpcToHttpCodesMap.get(exception?.code ?? status.UNKNOWN) ??
      HttpStatus.INTERNAL_SERVER_ERROR;

    return {
      statusCode,
      message: exception?.details ?? exception?.message ?? 'Internal server error',
      error: HttpStatus[statusCode] ?? HttpStatus[500],
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };
  }

  private _isRpcException(exception: any): exception is IGrpcException {
    const isRpcCode = Boolean(status[exception?.code]);
    const isHasCode = Object.hasOwnProperty.call(exception, 'code');
    const isHasMetadata = Object.hasOwnProperty.call(exception, 'metadata');

    return isHasCode && isRpcCode && isHasMetadata;
  }
}
