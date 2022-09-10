import { UserMetadata } from '@nx-mfe/server/domains';
import { AuthTokensResponse } from '@nx-mfe/shared/data-access';

import { TokenEntity } from './token.entity';

export interface ITokenService {
  generateTokens<P extends Record<string, any>>(payload: P): AuthTokensResponse;

  saveRefreshToken(refreshToken: string, userMetadata: UserMetadata): Promise<TokenEntity>;

  findRefreshToken(refreshToken: string): Promise<TokenEntity | undefined>;

  deleteRefreshToken(refreshToken: string): Promise<void>;

  deleteAllRefreshTokensForDevice(userId: number, userAgent: string): Promise<void>;
}
