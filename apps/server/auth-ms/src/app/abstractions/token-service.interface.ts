import { UserMetadata } from '@nx-mfe/server/domains';
import { AuthTokensResponse } from '@nx-mfe/shared/dto';

// TODO мне не нравиться эта зависимость от БД сущности
import { TokenEntity } from '../token/token.entity';

export interface ITokenService {
  generateAuthTokens<P extends Record<string, any>>(payload: P): AuthTokensResponse;

  saveRefreshToken(refreshToken: string, userMetadata: UserMetadata): Promise<TokenEntity>;

  findRefreshToken(refreshToken: string): Promise<TokenEntity | undefined>;

  deleteRefreshToken(refreshToken: string): Promise<void>;

  deleteAllRefreshTokensForDevice(userId: number, userAgent: string): Promise<void>;
}
