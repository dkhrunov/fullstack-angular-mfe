import { status } from '@grpc/grpc-js';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientGrpc } from '@nestjs/microservices';
import { compareHashedPassword } from '@nx-mfe/server/common';
import { AuthTokenPayload, RefreshToken, UserMetadata } from '@nx-mfe/server/domains';
import { AuthMs, GrpcException, UsersMs } from '@nx-mfe/server/grpc';
import { MailerService } from '@nx-mfe/server/mailer';
import { VOID } from '@nx-mfe/shared/common';
import { AuthTokensResponse, CredentialsRequest, RegisterRequest } from '@nx-mfe/shared/dto';
import { SentMessageInfo } from 'nodemailer';
import { firstValueFrom, mergeMap, Observable } from 'rxjs';

import { IAuthService, ITokenService } from '../abstractions';
import { Services } from '../constants';

@Injectable()
export class AuthService implements IAuthService, OnModuleInit {
  private _userService: UsersMs.UsersServiceClient;

  constructor(
    private readonly _jwtService: JwtService,
    private readonly _mailerService: MailerService,
    @Inject(UsersMs.USERS_SERVICE_NAME) private readonly _userMsClient: ClientGrpc,
    @Inject(Services.TOKEN_SERVICE) private readonly _tokenService: ITokenService
  ) {}

  public onModuleInit() {
    this._userService = this._userMsClient.getService<UsersMs.UsersServiceClient>(
      UsersMs.USERS_SERVICE_NAME
    );
  }

  public register(credentials: RegisterRequest): Observable<void> {
    return this._userService.create(UsersMs.CreateRequest.fromJSON(credentials)).pipe(
      // FIXME настроить отправку писем после регистрации
      // switchMap((user) => {
      //   return from(this._sendRegisterConfirmationMail(
      //     user.email,
      //     `${process.env.SERVER_URL}:${process.env.PORT}/${process.env.GLOBAL_PREFIX}/auth/register/confirm/${user.confirmationLink}`
      //   ))

      // .pipe(
      //   catchError(() =>
      //     throwError(
      //       () =>
      //         new GrpcException({
      //           code: status.INTERNAL,
      //           message: 'Error while sending email confirmation',
      //         })
      //     )
      //   )
      // );
      // })
      mergeMap(() => VOID)
    );
  }

  public async login(
    credentials: CredentialsRequest,
    userMetadata: UserMetadata
  ): Promise<AuthMs.AuthTokens> {
    const user = await firstValueFrom(
      this._userService.findOne(UsersMs.FindOneRequest.fromJSON({ email: credentials.email }))
    );

    if (!user) {
      throw new GrpcException({
        code: status.UNAUTHENTICATED,
        message: 'Wrong E-mail or password.',
      });
    }

    if (!user.isConfirmed) {
      throw new GrpcException({
        code: status.PERMISSION_DENIED,
        message: 'You need to verify your email first.',
      });
    }

    const isPasswordCorrect = await compareHashedPassword(credentials.password, user.password);

    if (!isPasswordCorrect) {
      throw new GrpcException({
        code: status.UNAUTHENTICATED,
        message: 'Wrong E-mail or password.',
      });
    }

    const authTokens = this._tokenService.generateAuthTokens(user);
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
    const refreshTokenEntity = await this._tokenService.findRefreshToken(refreshToken);

    if (!refreshTokenEntity) {
      throw new GrpcException({
        code: status.UNAUTHENTICATED,
        message: 'Refresh token not found.',
      });
    }

    // TODO Так не должно быть чтобы в модель я передавал сервис this._jwtService
    const _refreshToken = new RefreshToken(refreshToken, this._jwtService);
    const refreshTokenPayload = _refreshToken.decode();

    const isExpired = refreshTokenEntity.expiresIn < Math.floor(Date.now() / 1000);

    if (isExpired) {
      await this._tokenService.deleteAllRefreshTokensForDevice(
        refreshTokenPayload.id,
        userMetadata.userAgent
      );

      throw new GrpcException({
        code: status.UNAUTHENTICATED,
        message: 'Refresh token is expired.',
      });
    }

    try {
      _refreshToken.verify();
    } catch (error) {
      throw new GrpcException({
        code: status.UNAUTHENTICATED,
        message: error.message,
      });
    }

    const user = await firstValueFrom(
      this._userService.findOne(UsersMs.FindOneRequest.fromJSON({ id: refreshTokenPayload.id }))
    );

    if (!user) {
      throw new GrpcException({
        code: status.NOT_FOUND,
        message: 'User does not exist.',
      });
    }

    const authTokens = this._tokenService.generateAuthTokens(new AuthTokenPayload(user));
    await this._tokenService.deleteRefreshToken(refreshToken);
    await this._tokenService.saveRefreshToken(authTokens.refreshToken, userMetadata);

    return authTokens;
  }

  public async confirmRegister(confirmationLink: string): Promise<void> {
    const user = await firstValueFrom(
      this._userService.findOne(UsersMs.FindOneRequest.fromJSON({ confirmationLink }))
    );

    if (!user) {
      // TODO редирект на страницу с ошибкой на фронте.

      throw new GrpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Incorrect link to confirm registration.',
      });
    }

    await firstValueFrom(
      this._userService.update(
        UsersMs.UpdateRequest.fromJSON({ id: user.id, data: { isConfirmed: true } })
      )
    );
  }

  public async resendRegisterConfirmation(email: string): Promise<void> {
    const res = await firstValueFrom(
      this._userService.issueNewConfirmationLink(
        UsersMs.IssueNewConfirmationLinkRequest.fromJSON({ email })
      )
    );

    await this._sendRegisterConfirmationMail(email, res.link);
  }

  // TODO Mail microservice with RabbitMQ
  private async _sendRegisterConfirmationMail(
    to: string,
    confimationLink: string
  ): Promise<SentMessageInfo> {
    return await this._mailerService.sendMail({
      to,
      from: process.env.SMTP_USER,
      subject: 'Confirm account',
      text: '',
      html: `
					<div>
						<h2>Welcome to the application.</h2>
	          <p>To confirm the email address, click here: <a href="${confimationLink}">confirm email</a>.</p>
					</div>
				`,
    });
  }
}
