import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';

// eslint-disable-next-line @typescript-eslint/ban-types
export class JwtToken<T extends Object> {
  constructor(
    public readonly token: string,
    // FIXME здесь не должно быть сериса
    protected readonly _jwtService: JwtService
  ) {}

  public verify(options?: JwtVerifyOptions): T {
    return this._jwtService.verify(this.token, options);
  }

  public decode(): T {
    return this._jwtService.decode(this.token) as T;
  }
}
