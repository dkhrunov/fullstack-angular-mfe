import { Injectable } from '@angular/core';

import { ITokenManager } from '../interfaces';
import { TokenStorage } from '../token-storage';

@Injectable({
	providedIn: 'root',
})
export class TokenManagerService implements ITokenManager {
	constructor(protected readonly _tokenStorage: TokenStorage) {}

	public getToken(tokenName: string): string | null {
		return this._tokenStorage.get(tokenName);
	}

	public setToken(tokenName: string, token: string): void {
		this._tokenStorage.set(tokenName, token);
	}

	public deleteToken(tokenName: string): void {
		this._tokenStorage.delete(tokenName);
	}

	public isValidToken(tokenName: string): boolean {
		return this._tokenStorage.isValid(tokenName);
	}
}
