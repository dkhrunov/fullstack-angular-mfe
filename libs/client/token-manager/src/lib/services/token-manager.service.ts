import { Injectable } from '@angular/core';

import { ETokenStorageType } from '../enums';
import { ITokenManager } from '../interfaces';
import { TokenCookiesStorage, TokenStorage, TokenStorageFactory } from '../token-storage';

@Injectable({
	providedIn: 'root',
})
export class TokenManagerService implements ITokenManager {
	private static _tokenStorage: TokenStorage = TokenManagerService._initTokenStorage();

	// TODO пофиксить
	/**
	 * Устанавливает хранилище токена
	 * @param type Хранилище токена
	 */
	public static setTokenStorage(type: ETokenStorageType): void {
		TokenManagerService._tokenStorage = TokenStorageFactory.create(type);
		// TODO  вынести в отдельный сервис TokenStorageService
		// TODO сохранить в константу 'TOKEN_STORAGE'
		localStorage.setItem('TOKEN_STORAGE', JSON.stringify(type));
	}

	private static _initTokenStorage(): TokenStorage {
		const savedTokenStorage = localStorage.getItem('TOKEN_STORAGE');

		// TODO default tokenStorage in DI
		if (!savedTokenStorage) return new TokenCookiesStorage();

		const parsed = JSON.parse(savedTokenStorage) as ETokenStorageType;

		return TokenStorageFactory.create(parsed);
	}

	public getToken(tokenName: string): string | null {
		return TokenManagerService._tokenStorage.get(tokenName);
	}

	public setToken(tokenName: string, token: string): void {
		TokenManagerService._tokenStorage.set(tokenName, token);
	}

	public deleteToken(tokenName: string): void {
		TokenManagerService._tokenStorage.delete(tokenName);
	}

	public isValidToken(tokenName: string): boolean {
		return TokenManagerService._tokenStorage.isValid(tokenName);
	}
}
