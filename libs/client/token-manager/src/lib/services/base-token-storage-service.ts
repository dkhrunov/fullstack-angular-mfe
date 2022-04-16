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

	public setStorage(storage: TokenStorage): void {
		this._storage = storage;
		this._hydrate(storage.constructor.name);
	}

	private _hydrate(className: string): void {
		localStorage.setItem(this._tokenStorageKey, JSON.stringify(className));
	}

	private _rehydrate(): TokenStorage {
		const tokenStorageName = localStorage.getItem(this._tokenStorageKey);

		if (!tokenStorageName) return this._defaultTokenStorage;

		const tokenStorage = JSON.parse(tokenStorageName);

		return TokenStorageFactory.create(tokenStorage);
	}
}
