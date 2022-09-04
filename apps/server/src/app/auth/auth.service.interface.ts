import {
  AuthTokensResponse,
  CredentialsRequest,
  RegistrationRequest,
} from '@nx-mfe/shared/data-access';

export interface IAuthService {
  login(
    credentials: CredentialsRequest,
    userAgent: string,
    ip: string
  ): Promise<AuthTokensResponse>;

  logout(refreshToken: string): Promise<void>;

  refresh(refreshToken: string, userAgent: string, ip: string): Promise<AuthTokensResponse>;

  register(credentials: RegistrationRequest): Promise<void>;

  resendRegistrationConfirmationMail(id: number): Promise<void>;
  resendRegistrationConfirmationMail(email: string): Promise<void>;
  resendRegistrationConfirmationMail(idOrEmail: number | string): Promise<void>;
  resendRegistrationConfirmationMail(idOrEmail: number | string): Promise<void>;

  confirmRegistration(confirmationLink: string): Promise<void>;
}
