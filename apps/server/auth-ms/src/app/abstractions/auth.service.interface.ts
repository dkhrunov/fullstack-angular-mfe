import { UserMetadata } from '@nx-mfe/server/domains';
import { AuthTokensResponse, CredentialsRequest, RegisterRequest } from '@nx-mfe/shared/dto';
import { Observable } from 'rxjs';

export interface IAuthService {
  register(credentials: RegisterRequest): Observable<void>;

  login(credentials: CredentialsRequest, userMetadata: UserMetadata): Promise<AuthTokensResponse>;

  logout(refreshToken: string): Promise<void>;

  refresh(refreshToken: string, userMetadata: UserMetadata): Promise<AuthTokensResponse>;

  confirmRegister(confirmationLink: string): Promise<void>;

  resendRegisterConfirmation(email: string): Promise<void>;
}
