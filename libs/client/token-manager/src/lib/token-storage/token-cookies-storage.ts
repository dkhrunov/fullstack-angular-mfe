import { CookieBuilder } from '../cookie-builder';
import { ESamesiteOption } from '../enums';
import { JwtDecoder } from '../helpers';
import { TokenStorage } from './token-storage';

export class TokenCookiesStorage extends TokenStorage {
	/**
	 * Получает значение кук по ключу.
	 * @param key Ключ, по которому храниться куки.
	 */
	public get(key: string): string | null {
		const matches = document.cookie.match(
			new RegExp(
				'(?:^|; )' +
					key.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
					'=([^;]*)'
			)
		);

		return matches ? decodeURIComponent(matches[1]) : null;
	}

	/**
	 * Создает и сохраняет куки.
	 * @param key Ключ, по которому будут храниться куки.
	 * @param token Токен.
	 */
	public set(key: string, token: string): void {
		const cookie =
			encodeURIComponent(key) + '=' + encodeURIComponent(token);
		const expireIn = JwtDecoder.decode(token).exp;

		const tenYearsInMilliseconds = 10 * 365 * 24 * 60 * 60 * 1000;
		const infiniteToken = Date.now() + tenYearsInMilliseconds;
		const tokenExpireIn =
			expireIn === -1
				? new Date(infiniteToken)
				: new Date(expireIn * 1000);

		document.cookie = CookieBuilder.instantiate(cookie)
			.expires(tokenExpireIn)
			.path('/')
			.secure()
			.samesite(ESamesiteOption.strict)
			.build();
	}

	/**
	 * Удаляет куки.
	 * @param key Ключ, по которому храниться куки.
	 */
	public delete(key: string): void {
		const cookie = encodeURIComponent(key) + '=';

		document.cookie = CookieBuilder.instantiate(cookie)
			.path('/')
			.expires(new Date(0))
			.build();
	}
}
