import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BaseAuthApiService } from '@dekh/ngx-jwt-auth';
import { ENVIRONMENT, IEnvironment } from '@nx-mfe/client/environment';
import {
  AuthTokensResponse,
  LoginRequest,
  RegisterRequest,
  ResendRegisterConfirmationRequest,
} from '@nx-mfe/shared/data-access';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService extends BaseAuthApiService {
  constructor(
    private readonly _httpClient: HttpClient,
    @Inject(ENVIRONMENT) private readonly _environment: IEnvironment
  ) {
    super();
  }

  public login(request: LoginRequest): Observable<AuthTokensResponse> {
    return this._httpClient.post<AuthTokensResponse>(
      this._environment.apiUrl + '/auth/login',
      request,
      {
        withCredentials: true,
      }
    );
  }

  public register(request: RegisterRequest): Observable<void> {
    return this._httpClient.post<void>(this._environment.apiUrl + '/auth/register', request);
  }

  public logout(): Observable<void> {
    return this._httpClient.post<void>(this._environment.apiUrl + '/auth/logout', null, {
      withCredentials: true,
    });
  }

  public resendRegistrationConfirmationMail(
    request: ResendRegisterConfirmationRequest
  ): Observable<void> {
    return this._httpClient.post<void>(
      this._environment.apiUrl + '/auth/registration/confirmation/resend',
      request
    );
  }

  public refresh(): Observable<AuthTokensResponse> {
    return this._httpClient.post<AuthTokensResponse>(
      this._environment.apiUrl + '/auth/refresh',
      null,
      {
        withCredentials: true,
      }
    );
  }
}
