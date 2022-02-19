import { JwtVerifyOptions } from '@nestjs/jwt';
import { AuthTokenPayload } from '@nx-mfe/shared/data-access';

import { JwtToken } from './jwt-token';

export class AccessToken extends JwtToken<AuthTokenPayload> {
	public override verify(options?: Omit<JwtVerifyOptions, 'secret'>): AuthTokenPayload {
		return super.verify({ ...options, secret: process.env.JWT_ACCESS_SECRET });
	}
}
