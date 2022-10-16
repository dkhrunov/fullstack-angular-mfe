/* eslint-disable */
import { Metadata } from '@grpc/grpc-js';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'users';

export interface User {
  id: number;
  email: string;
  password: string;
  isConfirmed: boolean;
}

export interface CreateRequest {
  email: string;
  password: string;
}

export interface UpdateRequest {
  id: number;
  email: string | undefined;
  password: string | undefined;
  isConfirmed: boolean | undefined;
}

export interface FindOneRequest {
  id: number | undefined;
  email: string | undefined;
}

export interface DeleteRequest {
  id: number;
}

export interface DeleteResponse {
  id: number;
}

export const USERS_PACKAGE_NAME = 'users';

function createBaseUser(): User {
  return { id: 0, email: '', password: '', isConfirmed: false };
}

export const User = {
  fromJSON(object: any): User {
    return {
      id: isSet(object.id) ? Number(object.id) : 0,
      email: isSet(object.email) ? String(object.email) : '',
      password: isSet(object.password) ? String(object.password) : '',
      isConfirmed: isSet(object.isConfirmed) ? Boolean(object.isConfirmed) : false,
    };
  },

  toJSON(message: User): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.email !== undefined && (obj.email = message.email);
    message.password !== undefined && (obj.password = message.password);
    message.isConfirmed !== undefined && (obj.isConfirmed = message.isConfirmed);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<User>, I>>(object: I): User {
    const message = createBaseUser();
    message.id = object.id ?? 0;
    message.email = object.email ?? '';
    message.password = object.password ?? '';
    message.isConfirmed = object.isConfirmed ?? false;
    return message;
  },
};

function createBaseCreateRequest(): CreateRequest {
  return { email: '', password: '' };
}

export const CreateRequest = {
  fromJSON(object: any): CreateRequest {
    return {
      email: isSet(object.email) ? String(object.email) : '',
      password: isSet(object.password) ? String(object.password) : '',
    };
  },

  toJSON(message: CreateRequest): unknown {
    const obj: any = {};
    message.email !== undefined && (obj.email = message.email);
    message.password !== undefined && (obj.password = message.password);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CreateRequest>, I>>(object: I): CreateRequest {
    const message = createBaseCreateRequest();
    message.email = object.email ?? '';
    message.password = object.password ?? '';
    return message;
  },
};

function createBaseUpdateRequest(): UpdateRequest {
  return { id: 0, email: undefined, password: undefined, isConfirmed: undefined };
}

export const UpdateRequest = {
  fromJSON(object: any): UpdateRequest {
    return {
      id: isSet(object.id) ? Number(object.id) : 0,
      email: isSet(object.email) ? String(object.email) : undefined,
      password: isSet(object.password) ? String(object.password) : undefined,
      isConfirmed: isSet(object.isConfirmed) ? Boolean(object.isConfirmed) : undefined,
    };
  },

  toJSON(message: UpdateRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.email !== undefined && (obj.email = message.email);
    message.password !== undefined && (obj.password = message.password);
    message.isConfirmed !== undefined && (obj.isConfirmed = message.isConfirmed);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdateRequest>, I>>(object: I): UpdateRequest {
    const message = createBaseUpdateRequest();
    message.id = object.id ?? 0;
    message.email = object.email ?? undefined;
    message.password = object.password ?? undefined;
    message.isConfirmed = object.isConfirmed ?? undefined;
    return message;
  },
};

function createBaseFindOneRequest(): FindOneRequest {
  return { id: undefined, email: undefined };
}

export const FindOneRequest = {
  fromJSON(object: any): FindOneRequest {
    return {
      id: isSet(object.id) ? Number(object.id) : undefined,
      email: isSet(object.email) ? String(object.email) : undefined,
    };
  },

  toJSON(message: FindOneRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.email !== undefined && (obj.email = message.email);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<FindOneRequest>, I>>(object: I): FindOneRequest {
    const message = createBaseFindOneRequest();
    message.id = object.id ?? undefined;
    message.email = object.email ?? undefined;
    return message;
  },
};

function createBaseDeleteRequest(): DeleteRequest {
  return { id: 0 };
}

export const DeleteRequest = {
  fromJSON(object: any): DeleteRequest {
    return { id: isSet(object.id) ? Number(object.id) : 0 };
  },

  toJSON(message: DeleteRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DeleteRequest>, I>>(object: I): DeleteRequest {
    const message = createBaseDeleteRequest();
    message.id = object.id ?? 0;
    return message;
  },
};

function createBaseDeleteResponse(): DeleteResponse {
  return { id: 0 };
}

export const DeleteResponse = {
  fromJSON(object: any): DeleteResponse {
    return { id: isSet(object.id) ? Number(object.id) : 0 };
  },

  toJSON(message: DeleteResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DeleteResponse>, I>>(object: I): DeleteResponse {
    const message = createBaseDeleteResponse();
    message.id = object.id ?? 0;
    return message;
  },
};

export interface UsersServiceClient {
  findOne(request: FindOneRequest, metadata?: Metadata): Observable<User>;

  create(request: CreateRequest, metadata?: Metadata): Observable<User>;

  update(request: UpdateRequest, metadata?: Metadata): Observable<User>;

  delete(request: DeleteRequest, metadata?: Metadata): Observable<DeleteResponse>;
}

export interface UsersServiceController {
  findOne(request: FindOneRequest, metadata?: Metadata): Promise<User> | Observable<User> | User;

  create(request: CreateRequest, metadata?: Metadata): Promise<User> | Observable<User> | User;

  update(request: UpdateRequest, metadata?: Metadata): Promise<User> | Observable<User> | User;

  delete(
    request: DeleteRequest,
    metadata?: Metadata
  ): Promise<DeleteResponse> | Observable<DeleteResponse> | DeleteResponse;
}

export function UsersServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['findOne', 'create', 'update', 'delete'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('UsersService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('UsersService', method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USERS_SERVICE_NAME = 'UsersService';

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
