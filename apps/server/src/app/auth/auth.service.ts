import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenPayload, RefreshToken, UserMetadata } from '@nx-mfe/server/domains';
import { MailerService } from '@nx-mfe/server/mailer';
import {
  AuthTokensResponse,
  CredentialsRequest,
  RegisterRequest,
} from '@nx-mfe/shared/data-access';
import { SentMessageInfo } from 'nodemailer';
import { Connection } from 'typeorm';

import { Service } from '../shared/constants/services-injection-tokens';
import { compareHashedPassword } from '../shared/helpers/hash';
import { ITokenService } from '../token/token.service.interface';
import { UserEntity } from '../user/user.entity';
import { IUserService } from '../user/user.service.interface';
import { IAuthService } from './auth.service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly _connection: Connection,
    private readonly _jwtService: JwtService,
    private readonly _mailerService: MailerService,
    @Inject(Service.USER) private readonly _userService: IUserService,
    @Inject(Service.TOKEN) private readonly _tokenService: ITokenService
  ) {}

  public async login(
    credentials: CredentialsRequest,
    userMetadata: UserMetadata
  ): Promise<AuthTokensResponse> {
    const user = await this._userService.getByEmail(credentials.email);
    if (!user) {
      throw new UnauthorizedException('Wrong E-mail or password.');
    }

    const isPasswordCorrect = await compareHashedPassword(credentials.password, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Wrong E-mail or password.');
    }

    if (!user.isConfirmed) {
      throw new UnauthorizedException('You need to verify your email first.');
    }

    const authTokens = this._generateAuthTokens(user);
    await this._tokenService.saveRefreshToken(authTokens.refreshToken, userMetadata);

    return authTokens;
  }

  public async logout(refreshToken: string): Promise<void> {
    await this._tokenService.deleteRefreshToken(refreshToken);
  }

  public async refresh(
    refreshToken: string,
    userMetadata: UserMetadata
  ): Promise<AuthTokensResponse> {
    const tokenEntity = await this._tokenService.findRefreshToken(refreshToken);
    if (!tokenEntity) {
      throw new UnauthorizedException('Refresh token not found.');
    }

    const _refreshToken = new RefreshToken(refreshToken, this._jwtService);
    const refreshTokenPayload = _refreshToken.decode();

    const isExpired = tokenEntity.expiresIn < Math.floor(Date.now() / 1000);
    if (isExpired) {
      await this._tokenService.deleteAllRefreshTokensForDevice(
        refreshTokenPayload.id,
        userMetadata.userAgent
      );
      throw new UnauthorizedException('Refresh token is expired.');
    }

    try {
      _refreshToken.verify();
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    const user = await this._userService.getById(refreshTokenPayload.id);
    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    const authTokens = this._generateAuthTokens(user);
    await this._tokenService.deleteRefreshToken(refreshToken);
    await this._tokenService.saveRefreshToken(authTokens.refreshToken, userMetadata);

    return authTokens;
  }

  public async register(credentials: RegisterRequest): Promise<void> {
    const candidate = await this._userService.getByEmail(credentials.email);
    if (candidate) {
      throw new ConflictException('The user with this email is already registered.');
    }

    const queryRunner = this._connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this._userService.create(credentials);
      await queryRunner.manager.save<UserEntity>(user);

      // TODO поменять ссылку с вызова API бека на страницу на клиенте где как раз будет вызываться данный ендпоинт
      await this._sendRegisterConfirmationMail(
        user.email,
        `${process.env.SERVER_URL}:${process.env.PORT}/${process.env.GLOBAL_PREFIX}/auth/registration/confirm/${user.confirmationLink}`
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  public async confirmRegister(confirmationLink: string): Promise<void> {
    const user = await this._userService.getByConfirmationLink(confirmationLink);
    if (!user) {
      // TODO редирект на страницу с ошибкой на фронте.
      throw new BadRequestException('Incorrect link to confirm registration.');
    }

    await this._userService.update(user.id, { isConfirmed: true });
  }

  public async resendRegisterConfirmationMail(email: string): Promise<void> {
    const user = await this._userService.issueNewConfirmationLink(email);
    await this._sendRegisterConfirmationMail(user.email, user.confirmationLink);
  }

  private _generateAuthTokens(user: UserEntity): AuthTokensResponse {
    const { ...payload } = new AuthTokenPayload(user);
    return this._tokenService.generateTokens(payload);
  }

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
