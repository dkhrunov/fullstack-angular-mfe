import { status } from '@grpc/grpc-js';
import { Controller, Inject } from '@nestjs/common';
import { AuthMs, GrpcException, Utils } from '@nx-mfe/server/grpc';
import { isNil } from '@nx-mfe/shared/common';
import { Observable } from 'rxjs';

import { IAuthService } from '../../abstractions';
import { Services } from '../../constants';

@Controller()
@AuthMs.AuthServiceControllerMethods()
export class AuthController implements AuthMs.AuthServiceController {
  constructor(@Inject(Services.AUTH_SERVICE) private readonly _service: IAuthService) {}

  public register(
    request: AuthMs.RegisterRequest
  ): Utils.Empty | Promise<Utils.Empty> | Observable<Utils.Empty> {
    return this._service.register(request);
  }

  public login(
    request: AuthMs.LoginRequest
  ): AuthMs.AuthTokens | Promise<AuthMs.AuthTokens> | Observable<AuthMs.AuthTokens> {
    if (isNil(request.userMetadata)) {
      throw new GrpcException({
        code: status.INTERNAL,
        message: 'userMetadata field in request is required',
      });
    }

    return this._service.login(request, request.userMetadata);
  }

  public logout(
    request: AuthMs.LogoutRequest
  ): Utils.Empty | Promise<Utils.Empty> | Observable<Utils.Empty> {
    return this._service.logout(request.refreshToken);
  }

  public refresh(
    request: AuthMs.RefreshRequest
  ): AuthMs.AuthTokens | Promise<AuthMs.AuthTokens> | Observable<AuthMs.AuthTokens> {
    if (isNil(request.userMetadata)) {
      throw new GrpcException({
        code: status.INTERNAL,
        message: 'userMetadata field in request is required',
      });
    }

    return this._service.refresh(request.refreshToken, request.userMetadata);
  }

  public activateAccount(
    request: AuthMs.ActivateAccountRequest
  ): Utils.Empty | Promise<Utils.Empty> | Observable<Utils.Empty> {
    return this._service.activateAccount(request.activationToken);
  }

  public resendActivationEmail(
    request: AuthMs.ResendActivationEmailRequest
  ): Utils.Empty | Promise<Utils.Empty> | Observable<Utils.Empty> {
    return this._service.resendActivationEmail(request.email);
  }
}
