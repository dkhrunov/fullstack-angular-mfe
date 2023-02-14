import { UserMetadata } from '@nx-mfe/server/domains';
import {
  AuthTokensResponse,
  CredentialsRequest,
  RegisterRequest,
} from '@nx-mfe/shared/data-access';

export interface IAuthService {
  register(credentials: RegisterRequest): Promise<void>;

  login(credentials: CredentialsRequest, userMetadata: UserMetadata): Promise<AuthTokensResponse>;

  logout(refreshToken: string): Promise<void>;

  refresh(refreshToken: string, userMetadata: UserMetadata): Promise<AuthTokensResponse>;

  activateAccount(activationToken: string): Promise<void>;

  resendActivationEmail(email: string): Promise<void>;
}
