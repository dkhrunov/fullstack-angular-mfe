import { IsBoolean, IsNotEmpty } from 'class-validator';

import { CredentialsRequest } from './credentials.request';

export class LoginRequest extends CredentialsRequest {
  @IsBoolean()
  @IsNotEmpty()
  public session: boolean;
}
