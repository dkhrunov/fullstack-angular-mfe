import { Inject, Injectable } from '@angular/core';
import { EAuthToken } from '../enums';
import { IAuthTokens } from '../interfaces';
import { AuthTokenStorageManager } from './auth-token-storage-manager.service';
import { BaseTokenManager } from './base-token-manager';
import { BaseTokenStorageManager } from './base-token-storage-manager';

type Nullable<T> = { [P in keyof T]: T[P] | null };

@Injectable({
	providedIn: 'root',
})
export class AuthTokenManager extends BaseTokenManager {
	constructor(
		@Inject(AuthTokenStorageManager)
		protected readonly _authTokenStorageService: BaseTokenStorageManager
	) {
		super(_authTokenStorageService);
	}

	/**
	 * Получить `accessToken`.
	 */
	public getAccessToken(): string | null {
		return this.get(EAuthToken.accessToken);
	}

	/**
	 * Сохранить `accessToken`.
	 * @param token Токен.
	 */
	public setAccessToken(token: string): void {
		this.set(EAuthToken.accessToken, token);
	}

	/**
	 * Удалить `accessToken`.
	 */
	public deleteAccessToken(): void {
		this.delete(EAuthToken.accessToken);
	}

	/**
	 * Проверка валидности `accessToken`
	 */
	public isValidAccessToken(): boolean {
		return this.isValid(EAuthToken.accessToken);
	}

	/**
	 * Получить `refreshToken`.
	 */
	public getRefreshToken(): string | null {
		return this.get(EAuthToken.refreshToken);
	}

	/**
	 * Сохранить `refreshToken`.
	 * @param token Токен.
	 */
	public setRefreshToken(token: string): void {
		this.set(EAuthToken.refreshToken, token);
	}

	/**
	 * Удалить `refreshToken`.
	 */
	public deleteRefreshToken(): void {
		this.delete(EAuthToken.refreshToken);
	}

	/**
	 * Проверка валидности `refreshToken`?
	 */
	public isValidRefreshToken(): boolean {
		return this.isValid(EAuthToken.refreshToken);
	}

	/**
	 * Получить `accessToken` и `refreshToken`.
	 */
	public getAuthTokens(): Nullable<IAuthTokens> {
		return {
			accessToken: this.getAccessToken(),
			refreshToken: this.getRefreshToken(),
		};
	}

	/**
	 * Сохранить `accessToken` и `refreshToken`.
	 * @param tokens Пара токенов.
	 */
	public setAuthTokens(tokens: IAuthTokens): void {
		this.setAccessToken(tokens.accessToken);
		this.setRefreshToken(tokens.refreshToken);
	}

	/**
	 * Удалить `accessToken` и `refreshToken`.
	 */
	public deleteAuthTokens(): void {
		this.deleteAccessToken();
		this.deleteRefreshToken();
	}
}
