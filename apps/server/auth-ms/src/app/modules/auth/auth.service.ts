import { status } from '@grpc/grpc-js';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { compareHashedPassword } from '@nx-mfe/server/common';
import { ActivationTokenPayload, AuthTokenPayload, UserMetadata } from '@nx-mfe/server/domains';
import { AuthMs, GrpcException, MailMs, UsersMs } from '@nx-mfe/server/grpc';
import { VOID } from '@nx-mfe/shared/common';
import { AuthTokensResponse, CredentialsRequest, RegisterRequest } from '@nx-mfe/shared/dto';
import { catchError, firstValueFrom, mergeMap, Observable, throwError } from 'rxjs';

import { IAuthService, ITokenService } from '../../abstractions';
import { Services } from '../../constants';

@Injectable()
export class AuthService implements IAuthService, OnModuleInit {
  private _userMs: UsersMs.UsersServiceClient;

  private _mailMs: MailMs.MailServiceClient;

  constructor(
    @Inject(Services.TOKEN_SERVICE) private readonly _tokenService: ITokenService,
    @Inject(UsersMs.USERS_SERVICE_NAME) private readonly _userMsClient: ClientGrpc,
    @Inject(MailMs.MAIL_SERVICE_NAME) private readonly _mailMsClient: ClientGrpc
  ) {}

  public onModuleInit() {
    this._userMs = this._userMsClient.getService<UsersMs.UsersServiceClient>(
      UsersMs.USERS_SERVICE_NAME
    );

    this._mailMs = this._mailMsClient.getService<MailMs.MailServiceClient>(
      MailMs.MAIL_SERVICE_NAME
    );
  }

  public async register(credentials: RegisterRequest): Promise<void> {
    const createUserRequest = UsersMs.CreateRequest.fromJSON(credentials);
    const user = await firstValueFrom(this._userMs.create(createUserRequest));

    const activationTokenPayload = new ActivationTokenPayload(user);
    const activationToken = this._tokenService.signActivationToken(activationTokenPayload);

    await firstValueFrom(this._sendActivationAccountEmail(user.email, activationToken));
  }

  public async login(
    credentials: CredentialsRequest,
    userMetadata: UserMetadata
  ): Promise<AuthMs.AuthTokens> {
    const findUserRequest = UsersMs.FindOneRequest.fromJSON({ email: credentials.email });
    const user = await firstValueFrom(this._userMs.findOne(findUserRequest));

    if (!user) {
      throw new GrpcException({
        code: status.UNAUTHENTICATED,
        message: 'Wrong E-mail or password.',
      });
    }

    if (!user.isConfirmed) {
      throw new GrpcException({
        code: status.PERMISSION_DENIED,
        message: 'Account not activated. Please activate your account first',
      });
    }

    const isPasswordCorrect = await compareHashedPassword(credentials.password, user.password);

    if (!isPasswordCorrect) {
      throw new GrpcException({
        code: status.UNAUTHENTICATED,
        message: 'Wrong E-mail or password.',
      });
    }

    const tokenPayload = new AuthTokenPayload(user);
    const authTokens = this._tokenService.signAuthTokens(tokenPayload);

    await this._tokenService.saveRefreshToken(authTokens.refreshToken, userMetadata);

    return AuthMs.AuthTokens.fromJSON(authTokens);
  }

  public async logout(refreshToken: string): Promise<void> {
    await this._tokenService.deleteRefreshToken(refreshToken);
  }

  public async refresh(
    refreshToken: string,
    userMetadata: UserMetadata
  ): Promise<AuthTokensResponse> {
    this._tokenService.checkRefreshToken(refreshToken, userMetadata);

    const refreshTokenPayload = this._tokenService.decode(refreshToken);
    const findUserRequest = UsersMs.FindOneRequest.fromJSON({ id: refreshTokenPayload.id });
    const user = await firstValueFrom(this._userMs.findOne(findUserRequest));

    if (!user) {
      throw new GrpcException({
        code: status.NOT_FOUND,
        message: 'User does not exist.',
      });
    }

    const tokenPayload = new AuthTokenPayload(user);
    const authTokens = this._tokenService.signAuthTokens(tokenPayload);
    await this._tokenService.deleteRefreshToken(refreshToken);
    await this._tokenService.saveRefreshToken(authTokens.refreshToken, userMetadata);

    return authTokens;
  }

  public async activateAccount(activationToken: string): Promise<void> {
    this._tokenService.verifyActivationToken(activationToken);

    const userId = this._tokenService.decode(activationToken).id;
    const findUserRequest = UsersMs.FindOneRequest.fromPartial({ id: userId });
    const user = await firstValueFrom(this._userMs.findOne(findUserRequest));

    if (!user) {
      throw new GrpcException({ code: status.NOT_FOUND, message: 'User doesn`t found' });
    }

    if (user.isConfirmed) {
      throw new GrpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Account already activated.',
      });
    }

    const updateUserRequest = UsersMs.UpdateRequest.fromPartial({
      id: user.id,
      isConfirmed: true,
    });
    await firstValueFrom(this._userMs.update(updateUserRequest));
  }

  public async resendActivationEmail(email: string): Promise<void> {
    const findUserRequest = UsersMs.FindOneRequest.fromPartial({ email });
    // BUG проверить что падает ошибка если передать email несуществуешего пользователя
    const user = await firstValueFrom(this._userMs.findOne(findUserRequest));

    if (!user) {
      throw new GrpcException({ code: status.NOT_FOUND, message: 'User doesn`t found' });
    }

    if (user.isConfirmed) {
      throw new GrpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Account already activated.',
      });
    }

    const activationTokenPayload = new ActivationTokenPayload(user);
    const activationToken = this._tokenService.signActivationToken(activationTokenPayload);

    await firstValueFrom(this._sendActivationAccountEmail(user.email, activationToken));
  }

  // TODO requestPassword

  // TODO resetPassword

  private _sendActivationAccountEmail(recipient: string, token: string): Observable<void> {
    const request = MailMs.ConfirmRegistrationRequest.fromJSON({ recipient, token });

    return this._mailMs.confirmRegistration(request).pipe(
      catchError((error) =>
        throwError(
          () =>
            new GrpcException({
              code: status.INTERNAL,
              message: error ?? 'Error while sending email confirmation',
            })
        )
      ),
      mergeMap(() => VOID)
    );
  }
}
