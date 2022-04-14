import { ETokenStorage } from '../enums';
import { ITokenStorageService } from '../interfaces';
import { TokenStorage, TokenStorageFactory } from '../token-storage';

export abstract class BaseTokenStorageService implements ITokenStorageService {
	private _storage: TokenStorage;

	public get storage(): TokenStorage {
		return this._storage;
	}

	constructor(
		protected readonly _tokenStorageKey: string,
		protected readonly _defaultTokenStorage: TokenStorage
	) {
		this._storage = this._rehydrate();
	}

	public setStorage(type: ETokenStorage): void {
		this._storage = TokenStorageFactory.create(type);
		this._hydrate(type);
	}

	private _hydrate(type: ETokenStorage): void {
		localStorage.setItem(this._tokenStorageKey, JSON.stringify(type));
	}

	private _rehydrate(): TokenStorage {
		const tokenStorageName = localStorage.getItem(this._tokenStorageKey);

		if (!tokenStorageName) return this._defaultTokenStorage;

		const tokenStorage = JSON.parse(tokenStorageName) as ETokenStorage;

		return TokenStorageFactory.create(tokenStorage);
	}
}
