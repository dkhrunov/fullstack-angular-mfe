import { UserMetadata } from '@nx-mfe/server/domains';
import {
  AuthTokensResponse,
  CredentialsRequest,
  RegistrationRequest,
} from '@nx-mfe/shared/data-access';

export interface IAuthService {
  login(credentials: CredentialsRequest, userMetadata: UserMetadata): Promise<AuthTokensResponse>;

  logout(refreshToken: string): Promise<void>;

  refresh(refreshToken: string, userMetadata: UserMetadata): Promise<AuthTokensResponse>;

  register(credentials: RegistrationRequest): Promise<void>;

  confirmRegistration(confirmationLink: string): Promise<void>;

  resendRegistrationConfirmationMail(email: string): Promise<void>;
}
