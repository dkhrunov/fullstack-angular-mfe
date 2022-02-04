import { Inject, Injectable } from '@angular/core';

import { AUTH_TOKEN_STORAGE_KEY } from '../const';
import { ETokenStorageType } from '../enums';
import { DEFAULT_AUTH_TOKEN_STORAGE_TOKEN } from '../injection-tokens';
import { ITokenStorageStrategy } from '../interfaces';
import { TokenStorage, TokenStorageFactory } from '../token-storage';

@Injectable({
	providedIn: 'root',
})
export class AuthTokenStorageStrategy implements ITokenStorageStrategy {
	private _strategy: TokenStorage = this._dehydrate();

	public get strategy(): TokenStorage {
		return this._strategy;
	}

	constructor(
		@Inject(DEFAULT_AUTH_TOKEN_STORAGE_TOKEN)
		private readonly _defaultAuthTokenStorageStrategy: TokenStorage
	) {}

	public setStrategy(type: ETokenStorageType): void {
		this._strategy = TokenStorageFactory.create(type);
		this._hydrate(type);
	}

	private _hydrate(type: ETokenStorageType): void {
		localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, JSON.stringify(type));
	}

	private _dehydrate(): TokenStorage {
		const tokenStorageName = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

		if (!tokenStorageName) return this._defaultAuthTokenStorageStrategy;

		const tokenStorage = JSON.parse(tokenStorageName) as ETokenStorageType;

		return TokenStorageFactory.create(tokenStorage);
	}
}
