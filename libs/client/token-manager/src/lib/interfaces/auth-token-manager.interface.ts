import { IAuthTokens } from './auth-tokens.interface';

export interface IAuthTokenManager {
	/**
	 * Получить `accessToken`.
	 */
	getAccessToken(): string | null;
	/**
	 * Сохранить токен доступа (`token`).
	 * @param token Токен доступа.
	 */
	setAccessToken(token: string): void;
	/**
	 * Удалить `accessToken`.
	 */
	deleteAccessToken(): void;
	/**
	 * Проверка валидности `accessToken`?
	 */
	isValidAccessToken(): boolean;
	/**
	 * Получить `refreshToken`.
	 */
	getRefreshToken(): string | null;
	/**
	 * Сохранить токен обновления (`token`).
	 * @param token Токен обновления.
	 */
	setRefreshToken(token: string): void;
	/**
	 * Удалить `refreshToken`.
	 */
	deleteRefreshToken(): void;
	/**
	 * Проверка валидности `refreshToken`?
	 */
	isValidRefreshToken(): boolean;
	/**
	 * Получить `accessToken` и `refreshToken`.
	 */
	getAuthTokens(): {
		accessToken: string | null;
		refreshToken: string | null;
	};
	/**
	 * Сохранить токен доступа (`accessToken`) и токен обновления (`refreshToken`).
	 * @param tokens Содержит токен доступа и токен обновления.
	 */
	setAuthTokens(tokens: IAuthTokens): void;
	/**
	 * Удалить `accessToken` и `refreshToken`.
	 */
	deleteAuthTokens(): void;
}
