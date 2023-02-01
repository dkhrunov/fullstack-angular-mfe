import { JwtVerifyOptions } from '@nestjs/jwt';
import { ActivationTokenPayload, AuthTokenPayload, UserMetadata } from '@nx-mfe/server/domains';
import { AuthTokensResponse } from '@nx-mfe/shared/dto';

// TODO мне не нравиться эта зависимость от БД сущности
import { TokenEntity } from '../modules/token/token.entity';

export interface ITokenService {
  decode(token: string): AuthTokenPayload;

  verify(token: string, options?: JwtVerifyOptions): void;

  signAuthTokens(payload: AuthTokenPayload): AuthTokensResponse;

  signActivationToken(payload: ActivationTokenPayload): string;

  verifyActivationToken(activationToken: string, options?: Omit<JwtVerifyOptions, 'secret'>): void;

  verifyAccessToken(accessToken: string, options?: Omit<JwtVerifyOptions, 'secret'>): void;

  verifyRefreshToken(refreshToken: string, options?: Omit<JwtVerifyOptions, 'secret'>): void;

  checkRefreshToken(refreshToken: string, userMetadata: UserMetadata): Promise<void>;

  saveRefreshToken(refreshToken: string, userMetadata: UserMetadata): Promise<TokenEntity>;

  findRefreshToken(refreshToken: string): Promise<TokenEntity | null>;

  deleteRefreshToken(refreshToken: string): Promise<void>;

  deleteAllRefreshTokensForDevice(userId: number, userAgent: string): Promise<void>;
}
