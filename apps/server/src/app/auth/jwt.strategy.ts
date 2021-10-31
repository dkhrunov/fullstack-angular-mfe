import { Injectable } from '@angular/core';
import { PassportStrategy } from '@nestjs/passport';
import { JwtTokenPayload } from '@nx-mfe/shared/data-access';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_ACCESS_SECRET,
		});
	}

	public async validate(payload: JwtTokenPayload): Promise<JwtTokenPayload> {
		// TODO: проверка на отзыв токена
		return {
			id: payload.id,
			email: payload.email,
			isConfirmed: payload.isConfirmed,
		};
	}
}
