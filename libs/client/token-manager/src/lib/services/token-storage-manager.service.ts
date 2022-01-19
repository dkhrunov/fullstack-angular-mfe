import { Inject, Injectable } from '@angular/core';

import { TOKEN_STORAGE_KEY } from '../const';
import { ETokenStorageType } from '../enums';
import { DEFAULT_TOKEN_STORAGE_TOKEN } from '../injection-tokens';
import { ITokenStorageManager } from '../interfaces';
import { TokenStorage, TokenStorageFactory } from '../token-storage';

@Injectable({
	providedIn: 'root',
})
export class TokenStorageManagerService implements ITokenStorageManager {
	private _tokenStorage: TokenStorage = this._rehydrate();

	public get tokenStorage(): TokenStorage {
		return this._tokenStorage;
	}

	constructor(
		@Inject(DEFAULT_TOKEN_STORAGE_TOKEN) private readonly _defaultTokenStorage: TokenStorage
	) {}

	public setTokenStorage(type: ETokenStorageType): void {
		this._tokenStorage = TokenStorageFactory.create(type);
		this._hydrate(type);
	}

	private _hydrate(type: ETokenStorageType): void {
		localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(type));
	}

	private _rehydrate() {
		const tokenStorageName = localStorage.getItem(TOKEN_STORAGE_KEY);

		if (!tokenStorageName) return this._defaultTokenStorage;

		const tokenStorage = JSON.parse(tokenStorageName) as ETokenStorageType;

		return TokenStorageFactory.create(tokenStorage);
	}
}
