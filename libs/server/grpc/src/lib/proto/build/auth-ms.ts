/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Empty } from "./utils";

export const protobufPackage = "auth";

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

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface ActivateAccountRequest {
  activationToken: string;
}

export interface ResendActivationEmailRequest {
  email: string;
}

export const AUTH_PACKAGE_NAME = "auth";

function createBaseUserMetadata(): UserMetadata {
  return { ip: "", userAgent: "" };
}

export const UserMetadata = {
  fromJSON(object: any): UserMetadata {
    return {
      ip: isSet(object.ip) ? String(object.ip) : "",
      userAgent: isSet(object.userAgent) ? String(object.userAgent) : "",
    };
  },

  toJSON(message: UserMetadata): unknown {
    const obj: any = {};
    message.ip !== undefined && (obj.ip = message.ip);
    message.userAgent !== undefined && (obj.userAgent = message.userAgent);
    return obj;
  },

  create<I extends Exact<DeepPartial<UserMetadata>, I>>(base?: I): UserMetadata {
    return UserMetadata.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UserMetadata>, I>>(object: I): UserMetadata {
    const message = createBaseUserMetadata();
    message.ip = object.ip ?? "";
    message.userAgent = object.userAgent ?? "";
    return message;
  },
};

function createBaseAuthTokens(): AuthTokens {
  return { accessToken: "", refreshToken: "" };
}

export const AuthTokens = {
  fromJSON(object: any): AuthTokens {
    return {
      accessToken: isSet(object.accessToken) ? String(object.accessToken) : "",
      refreshToken: isSet(object.refreshToken) ? String(object.refreshToken) : "",
    };
  },

  toJSON(message: AuthTokens): unknown {
    const obj: any = {};
    message.accessToken !== undefined && (obj.accessToken = message.accessToken);
    message.refreshToken !== undefined && (obj.refreshToken = message.refreshToken);
    return obj;
  },

  create<I extends Exact<DeepPartial<AuthTokens>, I>>(base?: I): AuthTokens {
    return AuthTokens.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<AuthTokens>, I>>(object: I): AuthTokens {
    const message = createBaseAuthTokens();
    message.accessToken = object.accessToken ?? "";
    message.refreshToken = object.refreshToken ?? "";
    return message;
  },
};

function createBaseLoginRequest(): LoginRequest {
  return { email: "", password: "", userMetadata: undefined };
}

export const LoginRequest = {
  fromJSON(object: any): LoginRequest {
    return {
      email: isSet(object.email) ? String(object.email) : "",
      password: isSet(object.password) ? String(object.password) : "",
      userMetadata: isSet(object.userMetadata) ? UserMetadata.fromJSON(object.userMetadata) : undefined,
    };
  },

  toJSON(message: LoginRequest): unknown {
    const obj: any = {};
    message.email !== undefined && (obj.email = message.email);
    message.password !== undefined && (obj.password = message.password);
    message.userMetadata !== undefined &&
      (obj.userMetadata = message.userMetadata ? UserMetadata.toJSON(message.userMetadata) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<LoginRequest>, I>>(base?: I): LoginRequest {
    return LoginRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<LoginRequest>, I>>(object: I): LoginRequest {
    const message = createBaseLoginRequest();
    message.email = object.email ?? "";
    message.password = object.password ?? "";
    message.userMetadata = (object.userMetadata !== undefined && object.userMetadata !== null)
      ? UserMetadata.fromPartial(object.userMetadata)
      : undefined;
    return message;
  },
};

function createBaseLogoutRequest(): LogoutRequest {
  return { refreshToken: "" };
}

export const LogoutRequest = {
  fromJSON(object: any): LogoutRequest {
    return { refreshToken: isSet(object.refreshToken) ? String(object.refreshToken) : "" };
  },

  toJSON(message: LogoutRequest): unknown {
    const obj: any = {};
    message.refreshToken !== undefined && (obj.refreshToken = message.refreshToken);
    return obj;
  },

  create<I extends Exact<DeepPartial<LogoutRequest>, I>>(base?: I): LogoutRequest {
    return LogoutRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<LogoutRequest>, I>>(object: I): LogoutRequest {
    const message = createBaseLogoutRequest();
    message.refreshToken = object.refreshToken ?? "";
    return message;
  },
};

function createBaseRefreshRequest(): RefreshRequest {
  return { refreshToken: "", userMetadata: undefined };
}

export const RefreshRequest = {
  fromJSON(object: any): RefreshRequest {
    return {
      refreshToken: isSet(object.refreshToken) ? String(object.refreshToken) : "",
      userMetadata: isSet(object.userMetadata) ? UserMetadata.fromJSON(object.userMetadata) : undefined,
    };
  },

  toJSON(message: RefreshRequest): unknown {
    const obj: any = {};
    message.refreshToken !== undefined && (obj.refreshToken = message.refreshToken);
    message.userMetadata !== undefined &&
      (obj.userMetadata = message.userMetadata ? UserMetadata.toJSON(message.userMetadata) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<RefreshRequest>, I>>(base?: I): RefreshRequest {
    return RefreshRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<RefreshRequest>, I>>(object: I): RefreshRequest {
    const message = createBaseRefreshRequest();
    message.refreshToken = object.refreshToken ?? "";
    message.userMetadata = (object.userMetadata !== undefined && object.userMetadata !== null)
      ? UserMetadata.fromPartial(object.userMetadata)
      : undefined;
    return message;
  },
};

function createBaseRegisterRequest(): RegisterRequest {
  return { email: "", password: "" };
}

export const RegisterRequest = {
  fromJSON(object: any): RegisterRequest {
    return {
      email: isSet(object.email) ? String(object.email) : "",
      password: isSet(object.password) ? String(object.password) : "",
    };
  },

  toJSON(message: RegisterRequest): unknown {
    const obj: any = {};
    message.email !== undefined && (obj.email = message.email);
    message.password !== undefined && (obj.password = message.password);
    return obj;
  },

  create<I extends Exact<DeepPartial<RegisterRequest>, I>>(base?: I): RegisterRequest {
    return RegisterRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<RegisterRequest>, I>>(object: I): RegisterRequest {
    const message = createBaseRegisterRequest();
    message.email = object.email ?? "";
    message.password = object.password ?? "";
    return message;
  },
};

function createBaseActivateAccountRequest(): ActivateAccountRequest {
  return { activationToken: "" };
}

export const ActivateAccountRequest = {
  fromJSON(object: any): ActivateAccountRequest {
    return { activationToken: isSet(object.activationToken) ? String(object.activationToken) : "" };
  },

  toJSON(message: ActivateAccountRequest): unknown {
    const obj: any = {};
    message.activationToken !== undefined && (obj.activationToken = message.activationToken);
    return obj;
  },

  create<I extends Exact<DeepPartial<ActivateAccountRequest>, I>>(base?: I): ActivateAccountRequest {
    return ActivateAccountRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ActivateAccountRequest>, I>>(object: I): ActivateAccountRequest {
    const message = createBaseActivateAccountRequest();
    message.activationToken = object.activationToken ?? "";
    return message;
  },
};

function createBaseResendActivationEmailRequest(): ResendActivationEmailRequest {
  return { email: "" };
}

export const ResendActivationEmailRequest = {
  fromJSON(object: any): ResendActivationEmailRequest {
    return { email: isSet(object.email) ? String(object.email) : "" };
  },

  toJSON(message: ResendActivationEmailRequest): unknown {
    const obj: any = {};
    message.email !== undefined && (obj.email = message.email);
    return obj;
  },

  create<I extends Exact<DeepPartial<ResendActivationEmailRequest>, I>>(base?: I): ResendActivationEmailRequest {
    return ResendActivationEmailRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ResendActivationEmailRequest>, I>>(object: I): ResendActivationEmailRequest {
    const message = createBaseResendActivationEmailRequest();
    message.email = object.email ?? "";
    return message;
  },
};

export interface AuthServiceClient {
  login(request: LoginRequest, metadata?: Metadata): Observable<AuthTokens>;

  logout(request: LogoutRequest, metadata?: Metadata): Observable<Empty>;

  refresh(request: RefreshRequest, metadata?: Metadata): Observable<AuthTokens>;

  register(request: RegisterRequest, metadata?: Metadata): Observable<Empty>;

  activateAccount(request: ActivateAccountRequest, metadata?: Metadata): Observable<Empty>;

  resendActivationEmail(request: ResendActivationEmailRequest, metadata?: Metadata): Observable<Empty>;
}

export interface AuthServiceController {
  login(request: LoginRequest, metadata?: Metadata): Promise<AuthTokens> | Observable<AuthTokens> | AuthTokens;

  logout(request: LogoutRequest, metadata?: Metadata): Promise<Empty> | Observable<Empty> | Empty;

  refresh(request: RefreshRequest, metadata?: Metadata): Promise<AuthTokens> | Observable<AuthTokens> | AuthTokens;

  register(request: RegisterRequest, metadata?: Metadata): Promise<Empty> | Observable<Empty> | Empty;

  activateAccount(request: ActivateAccountRequest, metadata?: Metadata): Promise<Empty> | Observable<Empty> | Empty;

  resendActivationEmail(
    request: ResendActivationEmailRequest,
    metadata?: Metadata,
  ): Promise<Empty> | Observable<Empty> | Empty;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "login",
      "logout",
      "refresh",
      "register",
      "activateAccount",
      "resendActivationEmail",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
