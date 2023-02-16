import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuthTokenPayload {
  @Expose()
  public readonly id: number;

  @Expose()
  public readonly email: string;

  public readonly iat: number;

  public readonly exp: number;

  constructor(partial: Partial<AuthTokenPayload>) {
    Object.assign(this, partial);
  }
}
