import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Ip,
  OnModuleInit,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthMs, Utils } from '@nx-mfe/server/grpc';
import { mapToInstance } from '@nx-mfe/shared/common';
import {
  AuthTokensResponse,
  LoginRequest,
  RegisterRequest,
  ResendRegisterConfirmationRequest,
} from '@nx-mfe/shared/dto';
import { Request, Response } from 'express';
import { lastValueFrom, Observable, tap } from 'rxjs';

import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController implements OnModuleInit {
  private _authMs: AuthMs.AuthServiceClient;

  constructor(@Inject(AuthMs.AUTH_SERVICE_NAME) private readonly _client: ClientGrpc) {}

  public onModuleInit() {
    this._authMs = this._client.getService<AuthMs.AuthServiceClient>(AuthMs.AUTH_SERVICE_NAME);
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  public register(@Body() credentials: RegisterRequest): Observable<Utils.Empty> {
    const registerRequest = AuthMs.RegisterRequest.fromJSON(credentials);

    return this._authMs.register(registerRequest);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public login(
    @Ip() ip: string,
    @Headers('User-Agent') userAgent: string,
    @Body() body: LoginRequest,
    @Res({ passthrough: true }) res: Response
  ): Observable<AuthTokensResponse> {
    const { session, email, password } = body;

    const userMetadata = AuthMs.UserMetadata.fromJSON({ userAgent, ip });
    const loginRequest = AuthMs.LoginRequest.fromJSON({
      email,
      password,
      userMetadata,
    });

    return this._authMs.login(loginRequest).pipe(
      tap(({ refreshToken }) => this._setRefreshTokenInCookie(res, refreshToken, session)),
      mapToInstance(AuthTokensResponse)
    );
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  public logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Observable<Utils.Empty> {
    const refreshToken: string | undefined = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const logoutRequest = AuthMs.LogoutRequest.fromJSON({ refreshToken });

    return this._authMs.logout(logoutRequest).pipe(tap(() => this._clearCookies(res)));
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  public refresh(
    @Ip() ip: string,
    @Headers('User-Agent') userAgent: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Observable<AuthTokensResponse> {
    const userMetadata = AuthMs.UserMetadata.fromJSON({ userAgent, ip });

    const refreshRequest = AuthMs.RefreshRequest.fromJSON({
      refreshToken: req.cookies.refreshToken,
      userMetadata,
    });

    return this._authMs.refresh(refreshRequest).pipe(
      tap(({ refreshToken }) =>
        this._setRefreshTokenInCookie(res, refreshToken, req.cookies.session)
      ),
      mapToInstance(AuthTokensResponse)
    );
  }

  @Get('/register/confirm/:activationToken')
  @HttpCode(HttpStatus.PERMANENT_REDIRECT)
  public async confirmRegister(
    @Param('activationToken') activationToken: string,
    @Res() res: Response
  ): Promise<void> {
    const request = AuthMs.ActivateAccountRequest.fromJSON({ activationToken });

    await lastValueFrom(this._authMs.activateAccount(request));

    // TODO редирект на страницу c сообщением об успешном подтверждении почты.
    return res.redirect(String(process.env.CLIENT_URL));
  }

  @Post('/register/confirmation/resend')
  @HttpCode(HttpStatus.OK)
  public resendRegisterConfirmation(
    @Body() { email }: ResendRegisterConfirmationRequest
  ): Observable<Utils.Empty> {
    const request = AuthMs.ResendActivationEmailRequest.fromJSON({ email });

    return this._authMs.resendActivationEmail(request);
  }

  private _clearCookies(res: Response): void {
    res.clearCookie('refreshToken', {
      domain: process.env.DOMAIN,
      path: `/${process.env.GLOBAL_PREFIX || 'api'}/auth`,
    });

    res.clearCookie('session', {
      domain: process.env.DOMAIN,
      path: `/${process.env.GLOBAL_PREFIX || 'api'}/auth`,
    });
  }

  private _setRefreshTokenInCookie(res: Response, refreshToken: string, session = false): void {
    if (session) {
      res.cookie('refreshToken', refreshToken, {
        domain: process.env.DOMAIN,
        path: `/${process.env.GLOBAL_PREFIX || 'api'}/auth`,
        httpOnly: true,
      });
    } else {
      res.cookie('refreshToken', refreshToken, {
        domain: process.env.DOMAIN,
        path: `/${process.env.GLOBAL_PREFIX || 'api'}/auth`,
        maxAge: Number(process.env.JWT_REFRESH_EXPIRES_IN) * 1000,
        httpOnly: true,
      });
    }

    // Set flag that keep info about type of authorization
    // If true when user select "Do not remember me"
    res.cookie('session', session, {
      domain: process.env.DOMAIN,
      path: `/${process.env.GLOBAL_PREFIX || 'api'}/auth`,
      maxAge: Number(process.env.JWT_REFRESH_EXPIRES_IN) * 1000,
      httpOnly: true,
    });
  }
}
