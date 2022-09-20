import { status } from '@grpc/grpc-js';
import { RpcException as BaseRpcException } from '@nestjs/microservices';

import { IRpcException } from './rpc-exception.interface';

export class RpcException extends BaseRpcException implements IRpcException {
  public readonly code: status;
  public override readonly message: string;

  constructor(exception: IRpcException) {
    super(exception);
    this.code = exception.code;
    this.message = exception.message;
  }
}
