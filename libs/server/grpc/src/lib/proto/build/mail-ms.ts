/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Empty } from "./utils";

export const protobufPackage = "mail";

export interface ConfirmRegistrationRequest {
  recipient: string;
  token: string;
}

export const MAIL_PACKAGE_NAME = "mail";

function createBaseConfirmRegistrationRequest(): ConfirmRegistrationRequest {
  return { recipient: "", token: "" };
}

export const ConfirmRegistrationRequest = {
  fromJSON(object: any): ConfirmRegistrationRequest {
    return {
      recipient: isSet(object.recipient) ? String(object.recipient) : "",
      token: isSet(object.token) ? String(object.token) : "",
    };
  },

  toJSON(message: ConfirmRegistrationRequest): unknown {
    const obj: any = {};
    message.recipient !== undefined && (obj.recipient = message.recipient);
    message.token !== undefined && (obj.token = message.token);
    return obj;
  },

  create<I extends Exact<DeepPartial<ConfirmRegistrationRequest>, I>>(base?: I): ConfirmRegistrationRequest {
    return ConfirmRegistrationRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ConfirmRegistrationRequest>, I>>(object: I): ConfirmRegistrationRequest {
    const message = createBaseConfirmRegistrationRequest();
    message.recipient = object.recipient ?? "";
    message.token = object.token ?? "";
    return message;
  },
};

export interface MailServiceClient {
  confirmRegistration(request: ConfirmRegistrationRequest, metadata?: Metadata): Observable<Empty>;
}

export interface MailServiceController {
  confirmRegistration(
    request: ConfirmRegistrationRequest,
    metadata?: Metadata,
  ): Promise<Empty> | Observable<Empty> | Empty;
}

export function MailServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["confirmRegistration"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("MailService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("MailService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const MAIL_SERVICE_NAME = "MailService";

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
