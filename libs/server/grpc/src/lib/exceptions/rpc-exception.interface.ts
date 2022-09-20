import { status } from '@grpc/grpc-js';

export interface IRpcException {
  code: status;
  message: string;
  details?: string;
}
