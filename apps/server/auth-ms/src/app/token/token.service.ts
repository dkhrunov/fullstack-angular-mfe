import { status } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { UserMetadata } from '@nx-mfe/server/domains';
import { GrpcException } from '@nx-mfe/server/grpc';
import { isNil, isString } from '@nx-mfe/shared/common';
import { AuthTokensResponse } from '@nx-mfe/shared/dto';
import { Repository } from 'typeorm';

import { ITokenService } from '../abstractions';
import { TokenEntity } from './token.entity';

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly _tokenRepository: Repository<TokenEntity>,
    private readonly _jwtService: JwtService
  ) {}

  public generateAuthTokens<P extends Record<string, any>>(payload: P): AuthTokensResponse {
    const accessToken = this._jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: Number(process.env.JWT_ACCESS_EXPIRES_IN),
    });

    const refreshToken = this._jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: Number(process.env.JWT_REFRESH_EXPIRES_IN),
    });

    return new AuthTokensResponse({ accessToken, refreshToken });
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

    const createdToken = this._tokenRepository.create({
      refreshToken,
      expiresIn: payload.exp,
      userId: payload.id,
      userAgent: userMetadata.userAgent,
      ip: userMetadata.ip,
    });

    return this._tokenRepository.save(createdToken);
  }

  public findRefreshToken(refreshToken: string): Promise<TokenEntity | undefined> {
    return this._tokenRepository.findOne({ refreshToken });
  }

  public async deleteRefreshToken(refreshToken: string): Promise<void> {
    await this._tokenRepository.delete({ refreshToken });
  }

  public async deleteAllRefreshTokensForDevice(userId: number, userAgent: string): Promise<void> {
    await this._tokenRepository.delete({ userId, userAgent });
  }

  @Cron(CronExpression.EVERY_WEEK, { timeZone: 'Europe/Moscow' })
  protected async removeExpiresRefreshTokens(): Promise<void> {
    const tokens = await this._tokenRepository.find();
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
      await this._tokenRepository.remove(invalidTokens);
    }
  }
}
