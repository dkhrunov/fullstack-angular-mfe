import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthTokenPayload } from '@nx-mfe/server/domains';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  public async validate(payload: AuthTokenPayload): Promise<AuthTokenPayload> {
    return new AuthTokenPayload({
      id: payload.id,
      email: payload.email,
    });
  }
}
