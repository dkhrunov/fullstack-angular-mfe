import { status } from '@grpc/grpc-js';

export interface IGrpcException {
  code: status;
  message: string;
  details?: string;
}
