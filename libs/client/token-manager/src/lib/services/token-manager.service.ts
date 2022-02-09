import { Inject, Injectable } from '@angular/core';

import { TOKEN_STORAGE_STRATEGY } from '../injection-tokens';
import { ITokenManager, ITokenStorageStrategy } from '../interfaces';
import { TokenStorage } from '../token-storage';

@Injectable({
	providedIn: 'root',
})
export class TokenManager implements ITokenManager {
	constructor(
		@Inject(TOKEN_STORAGE_STRATEGY)
		private readonly _tokenStorageStrategy: ITokenStorageStrategy
	) {}

	private get _tokenStorage(): TokenStorage {
		return this._tokenStorageStrategy.strategy;
	}

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
