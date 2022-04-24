import { TOKEN_MANAGER_OPTIONS } from '../injection-tokens';
import { TokenManagerModule } from '../token-manager.module';

export abstract class JwtDecoder {
	/**
	 * Decoding JWT token. return token payload.
	 * @param token Token string.
	 */
	public static decode<T extends Record<string, unknown>>(token: string): T {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join('')
		);

		return JSON.parse(jsonPayload);
	}

	/**
	 * Gets info when the token expires.
	 *
	 * This method get prop by name provided by `TokenManagerModule.forRoot` options
	 * in the `TokenManagerOptions.expireInField`.
	 * @param token Token string.
	 */
	public static expireIn(token: string): number {
		const expireInField = TokenManagerModule.injector.get(TOKEN_MANAGER_OPTIONS).expireInField;
		const expireIn = JwtDecoder.decode(token)[expireInField] as
			| number
			| string
			| undefined
			| null;

		if (expireIn === undefined || expireIn === null) {
			throw new Error(
				`Invalid expireIn field or token string. Field "${expireInField}" doesn't exist or value not setted.`
			);
		}

		return Number(expireIn);
	}
}
