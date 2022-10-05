import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

import { IGrpcException } from './grpc-exception.interface';

export class GrpcException extends RpcException implements IGrpcException {
  public readonly code: status;
  public override readonly message: string;

  constructor(exception: IGrpcException) {
    super(exception);
    this.code = exception.code;
    this.message = exception.message;
  }
}
