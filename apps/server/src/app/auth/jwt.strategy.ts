import { Injectable } from '@angular/core';
import { PassportStrategy } from '@nestjs/passport';
import { TokenPayload } from '@nx-mfe/shared/data-access';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.PRIVATE_KEY,
		});
	}

	public async validate(payload: TokenPayload): Promise<TokenPayload> {
		// TODO: проверка на отзыв токена
		return { id: payload.id, email: payload.email };
	}
}
