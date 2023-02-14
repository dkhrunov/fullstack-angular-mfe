import { status } from '@grpc/grpc-js';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivationTokenPayload, AuthTokenPayload, UserMetadata } from '@nx-mfe/server/domains';
import { GrpcException } from '@nx-mfe/server/grpc';
import { isNil, isString } from '@nx-mfe/shared/common';
import { AuthTokensResponse } from '@nx-mfe/shared/data-access';
import { instanceToPlain } from 'class-transformer';
import { Repository } from 'typeorm';

import { ITokenService } from '../../abstractions';
import { TokenEntity } from './token.entity';

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    @Inject(JwtService) private readonly _jwtService: JwtService,
    @InjectRepository(TokenEntity) private readonly _repository: Repository<TokenEntity>
  ) {}

  // BUG сделать decode для AuthTokens и ActivationToken / или для каждого токена свой метод
  public decode(token: string): AuthTokenPayload {
    const payload = this._jwtService.decode(token);

    if (isNil(payload) || isString(payload)) {
      throw new GrpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Incorrect refresh token payload.',
      });
    }

    return new AuthTokenPayload(payload);
  }

  public verify(token: string, options?: JwtVerifyOptions): void {
    try {
      this._jwtService.verify(token, options);
    } catch (error) {
      throw new GrpcException({
        code: status.UNAUTHENTICATED,
        message: error.message,
      });
    }
  }

  public signAuthTokens(payload: AuthTokenPayload): AuthTokensResponse {
    const payloadObject = instanceToPlain(payload);

    const accessToken = this._jwtService.sign(payloadObject, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: Number(process.env.JWT_ACCESS_EXPIRES_IN),
    });

    const refreshToken = this._jwtService.sign(payloadObject, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: Number(process.env.JWT_REFRESH_EXPIRES_IN),
    });

    return new AuthTokensResponse({ accessToken, refreshToken });
  }

  public signActivationToken(payload: ActivationTokenPayload): string {
    const payloadObject = instanceToPlain(payload);

    return this._jwtService.sign(payloadObject, {
      secret: process.env.JWT_ACTIVATION_SECRET,
      expiresIn: Number(process.env.JWT_ACTIVATION_EXPIRES_IN),
    });
  }

  public verifyActivationToken(
    activationToken: string,
    options?: Omit<JwtVerifyOptions, 'secret'>
  ): void {
    this.verify(activationToken, { ...options, secret: process.env.JWT_ACTIVATION_SECRET });
  }

  public verifyAccessToken(accessToken: string, options?: Omit<JwtVerifyOptions, 'secret'>): void {
    this.verify(accessToken, { ...options, secret: process.env.JWT_ACCESS_SECRET });
  }

  public verifyRefreshToken(
    refreshToken: string,
    options?: Omit<JwtVerifyOptions, 'secret'>
  ): void {
    this.verify(refreshToken, { ...options, secret: process.env.JWT_REFRESH_SECRET });
  }

  public async checkRefreshToken(refreshToken: string, userMetadata: UserMetadata): Promise<void> {
    const refreshTokenEntity = await this.findRefreshToken(refreshToken);

    if (!refreshTokenEntity) {
      throw new GrpcException({
        code: status.UNAUTHENTICATED,
        message: 'Refresh token not found.',
      });
    }

    const isExpired = refreshTokenEntity.expiresIn < Math.floor(Date.now() / 1000);

    if (isExpired) {
      const refreshTokenPayload = this.decode(refreshToken);
      await this.deleteAllRefreshTokensForDevice(refreshTokenPayload.id, userMetadata.userAgent);

      throw new GrpcException({
        code: status.UNAUTHENTICATED,
        message: 'Refresh token is expired.',
      });
    }

    this.verifyRefreshToken(refreshToken);
  }

  public async saveRefreshToken(
    refreshToken: string,
    userMetadata: UserMetadata
  ): Promise<TokenEntity> {
    const payload = this._jwtService.decode(refreshToken);

    if (isNil(payload) || isString(payload) || isNil(payload.exp) || isNil(payload.id)) {
      throw new GrpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Refresh token has incorrect payload.',
      });
    }

    const createdToken = this._repository.create({
      refreshToken,
      expiresIn: payload.exp,
      userId: payload.id,
      userAgent: userMetadata.userAgent,
      ip: userMetadata.ip,
    });

    return this._repository.save(createdToken);
  }

  public findRefreshToken(refreshToken: string): Promise<TokenEntity | null> {
    return this._repository.findOneBy({ refreshToken });
  }

  public async deleteRefreshToken(refreshToken: string): Promise<void> {
    await this._repository.delete({ refreshToken });
  }

  public async deleteAllRefreshTokensForDevice(userId: number, userAgent: string): Promise<void> {
    await this._repository.delete({ userId, userAgent });
  }

  @Cron(CronExpression.EVERY_WEEK, { timeZone: 'Europe/Moscow' })
  protected async removeExpiresRefreshTokens(): Promise<void> {
    const tokens = await this._repository.find();
    const invalidTokens: TokenEntity[] = [];

    tokens.forEach((token) => {
      try {
        this._jwtService.verify(token.refreshToken, {
          secret: process.env.JWT_REFRESH_SECRET,
        });
      } catch (error) {
        invalidTokens.push(token);
      }
    });

    if (invalidTokens.length > 0) {
      await this._repository.remove(invalidTokens);
    }
  }
}
