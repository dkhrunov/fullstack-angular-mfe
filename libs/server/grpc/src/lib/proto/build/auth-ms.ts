/* eslint-disable */
import { Metadata } from '@grpc/grpc-js';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Empty } from './utils';

export const protobufPackage = 'auth';

export interface UserMetadata {
  ip: string;
  userAgent: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  userMetadata: UserMetadata | undefined;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface RefreshRequest {
  refreshToken: string;
  userMetadata: UserMetadata | undefined;
}

export interface RegistrerRequest {
  email: string;
  password: string;
}

export interface ConfirmRegisterRequest {
  confirmationLink: string;
}

export interface ResendRegisterConfirmationRequest {
  email: string;
}

export const AUTH_PACKAGE_NAME = 'auth';

function createBaseUserMetadata(): UserMetadata {
  return { ip: '', userAgent: '' };
}

export const UserMetadata = {
  fromJSON(object: any): UserMetadata {
    return {
      ip: isSet(object.ip) ? String(object.ip) : '',
      userAgent: isSet(object.userAgent) ? String(object.userAgent) : '',
    };
  },

  toJSON(message: UserMetadata): unknown {
    const obj: any = {};
    message.ip !== undefined && (obj.ip = message.ip);
    message.userAgent !== undefined && (obj.userAgent = message.userAgent);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UserMetadata>, I>>(object: I): UserMetadata {
    const message = createBaseUserMetadata();
    message.ip = object.ip ?? '';
    message.userAgent = object.userAgent ?? '';
    return message;
  },
};

function createBaseAuthTokens(): AuthTokens {
  return { accessToken: '', refreshToken: '' };
}

export const AuthTokens = {
  fromJSON(object: any): AuthTokens {
    return {
      accessToken: isSet(object.accessToken) ? String(object.accessToken) : '',
      refreshToken: isSet(object.refreshToken) ? String(object.refreshToken) : '',
    };
  },

  toJSON(message: AuthTokens): unknown {
    const obj: any = {};
    message.accessToken !== undefined && (obj.accessToken = message.accessToken);
    message.refreshToken !== undefined && (obj.refreshToken = message.refreshToken);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AuthTokens>, I>>(object: I): AuthTokens {
    const message = createBaseAuthTokens();
    message.accessToken = object.accessToken ?? '';
    message.refreshToken = object.refreshToken ?? '';
    return message;
  },
};

function createBaseLoginRequest(): LoginRequest {
  return { email: '', password: '', userMetadata: undefined };
}

export const LoginRequest = {
  fromJSON(object: any): LoginRequest {
    return {
      email: isSet(object.email) ? String(object.email) : '',
      password: isSet(object.password) ? String(object.password) : '',
      userMetadata: isSet(object.userMetadata)
        ? UserMetadata.fromJSON(object.userMetadata)
        : undefined,
    };
  },

  toJSON(message: LoginRequest): unknown {
    const obj: any = {};
    message.email !== undefined && (obj.email = message.email);
    message.password !== undefined && (obj.password = message.password);
    message.userMetadata !== undefined &&
      (obj.userMetadata = message.userMetadata
        ? UserMetadata.toJSON(message.userMetadata)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LoginRequest>, I>>(object: I): LoginRequest {
    const message = createBaseLoginRequest();
    message.email = object.email ?? '';
    message.password = object.password ?? '';
    message.userMetadata =
      object.userMetadata !== undefined && object.userMetadata !== null
        ? UserMetadata.fromPartial(object.userMetadata)
        : undefined;
    return message;
  },
};

function createBaseLogoutRequest(): LogoutRequest {
  return { refreshToken: '' };
}

export const LogoutRequest = {
  fromJSON(object: any): LogoutRequest {
    return { refreshToken: isSet(object.refreshToken) ? String(object.refreshToken) : '' };
  },

  toJSON(message: LogoutRequest): unknown {
    const obj: any = {};
    message.refreshToken !== undefined && (obj.refreshToken = message.refreshToken);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LogoutRequest>, I>>(object: I): LogoutRequest {
    const message = createBaseLogoutRequest();
    message.refreshToken = object.refreshToken ?? '';
    return message;
  },
};

function createBaseRefreshRequest(): RefreshRequest {
  return { refreshToken: '', userMetadata: undefined };
}

export const RefreshRequest = {
  fromJSON(object: any): RefreshRequest {
    return {
      refreshToken: isSet(object.refreshToken) ? String(object.refreshToken) : '',
      userMetadata: isSet(object.userMetadata)
        ? UserMetadata.fromJSON(object.userMetadata)
        : undefined,
    };
  },

  toJSON(message: RefreshRequest): unknown {
    const obj: any = {};
    message.refreshToken !== undefined && (obj.refreshToken = message.refreshToken);
    message.userMetadata !== undefined &&
      (obj.userMetadata = message.userMetadata
        ? UserMetadata.toJSON(message.userMetadata)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RefreshRequest>, I>>(object: I): RefreshRequest {
    const message = createBaseRefreshRequest();
    message.refreshToken = object.refreshToken ?? '';
    message.userMetadata =
      object.userMetadata !== undefined && object.userMetadata !== null
        ? UserMetadata.fromPartial(object.userMetadata)
        : undefined;
    return message;
  },
};

function createBaseRegistrerRequest(): RegistrerRequest {
  return { email: '', password: '' };
}

export const RegistrerRequest = {
  fromJSON(object: any): RegistrerRequest {
    return {
      email: isSet(object.email) ? String(object.email) : '',
      password: isSet(object.password) ? String(object.password) : '',
    };
  },

  toJSON(message: RegistrerRequest): unknown {
    const obj: any = {};
    message.email !== undefined && (obj.email = message.email);
    message.password !== undefined && (obj.password = message.password);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RegistrerRequest>, I>>(object: I): RegistrerRequest {
    const message = createBaseRegistrerRequest();
    message.email = object.email ?? '';
    message.password = object.password ?? '';
    return message;
  },
};

function createBaseConfirmRegisterRequest(): ConfirmRegisterRequest {
  return { confirmationLink: '' };
}

export const ConfirmRegisterRequest = {
  fromJSON(object: any): ConfirmRegisterRequest {
    return {
      confirmationLink: isSet(object.confirmationLink) ? String(object.confirmationLink) : '',
    };
  },

  toJSON(message: ConfirmRegisterRequest): unknown {
    const obj: any = {};
    message.confirmationLink !== undefined && (obj.confirmationLink = message.confirmationLink);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ConfirmRegisterRequest>, I>>(
    object: I
  ): ConfirmRegisterRequest {
    const message = createBaseConfirmRegisterRequest();
    message.confirmationLink = object.confirmationLink ?? '';
    return message;
  },
};

function createBaseResendRegisterConfirmationRequest(): ResendRegisterConfirmationRequest {
  return { email: '' };
}

export const ResendRegisterConfirmationRequest = {
  fromJSON(object: any): ResendRegisterConfirmationRequest {
    return { email: isSet(object.email) ? String(object.email) : '' };
  },

  toJSON(message: ResendRegisterConfirmationRequest): unknown {
    const obj: any = {};
    message.email !== undefined && (obj.email = message.email);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ResendRegisterConfirmationRequest>, I>>(
    object: I
  ): ResendRegisterConfirmationRequest {
    const message = createBaseResendRegisterConfirmationRequest();
    message.email = object.email ?? '';
    return message;
  },
};

export interface AuthServiceClient {
  login(request: LoginRequest, metadata?: Metadata): Observable<AuthTokens>;

  logout(request: LogoutRequest, metadata?: Metadata): Observable<Empty>;

  refresh(request: RefreshRequest, metadata?: Metadata): Observable<AuthTokens>;

  register(request: RegistrerRequest, metadata?: Metadata): Observable<Empty>;

  confirmRegister(request: ConfirmRegisterRequest, metadata?: Metadata): Observable<Empty>;

  resendRegisterConfirmation(
    request: ResendRegisterConfirmationRequest,
    metadata?: Metadata
  ): Observable<Empty>;
}

export interface AuthServiceController {
  login(
    request: LoginRequest,
    metadata?: Metadata
  ): Promise<AuthTokens> | Observable<AuthTokens> | AuthTokens;

  logout(request: LogoutRequest, metadata?: Metadata): Promise<Empty> | Observable<Empty> | Empty;

  refresh(
    request: RefreshRequest,
    metadata?: Metadata
  ): Promise<AuthTokens> | Observable<AuthTokens> | AuthTokens;

  register(
    request: RegistrerRequest,
    metadata?: Metadata
  ): Promise<Empty> | Observable<Empty> | Empty;

  confirmRegister(
    request: ConfirmRegisterRequest,
    metadata?: Metadata
  ): Promise<Empty> | Observable<Empty> | Empty;

  resendRegisterConfirmation(
    request: ResendRegisterConfirmationRequest,
    metadata?: Metadata
  ): Promise<Empty> | Observable<Empty> | Empty;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'login',
      'logout',
      'refresh',
      'register',
      'confirmRegister',
      'resendRegisterConfirmation',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('AuthService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('AuthService', method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = 'AuthService';

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
