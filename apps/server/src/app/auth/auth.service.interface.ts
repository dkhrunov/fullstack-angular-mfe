import { UserMetadata } from '@nx-mfe/server/domains';
import {
  AuthTokensResponse,
  CredentialsRequest,
  RegisterRequest,
} from '@nx-mfe/shared/data-access';

export interface IAuthService {
  login(credentials: CredentialsRequest, userMetadata: UserMetadata): Promise<AuthTokensResponse>;

  logout(refreshToken: string): Promise<void>;

  refresh(refreshToken: string, userMetadata: UserMetadata): Promise<AuthTokensResponse>;

  register(credentials: RegisterRequest): Promise<void>;

  confirmRegister(confirmationLink: string): Promise<void>;

  resendRegisterConfirmationMail(email: string): Promise<void>;
}
