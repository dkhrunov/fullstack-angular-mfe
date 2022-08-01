import { JwtVerifyOptions } from '@nestjs/jwt';

import { AuthTokenPayload } from './auth-token-payload';
import { JwtToken } from './jwt-token';

export class RefreshToken extends JwtToken<AuthTokenPayload> {
	public override verify(options?: Omit<JwtVerifyOptions, 'secret'>): AuthTokenPayload {
		return super.verify({ ...options, secret: process.env.JWT_REFRESH_SECRET });
	}
}
