import { IsJWT, IsNotEmpty } from 'class-validator';

export class AuthTokensResponse {
  @IsJWT()
  @IsNotEmpty()
  public readonly accessToken: string;

  @IsJWT()
  @IsNotEmpty()
  public readonly refreshToken: string;

  constructor(partial: Partial<AuthTokensResponse>) {
    Object.assign(this, partial);
  }
}
