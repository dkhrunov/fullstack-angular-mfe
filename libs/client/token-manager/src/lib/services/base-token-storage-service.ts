import { ITokenStorageService } from '../interfaces';
import { TokenStorage } from '../token-storages';
import { TokenStorageRegistry } from './token-storage-registry.service';

export abstract class BaseTokenStorageService implements ITokenStorageService {
	private _storage: TokenStorage;

	public get storage(): TokenStorage {
		return this._storage;
	}

	constructor(
		protected readonly _tokenStorageKey: string,
		protected readonly _defaultTokenStorage: TokenStorage,
		protected readonly _tokenStorageRegistry: TokenStorageRegistry
	) {
		this._storage = this._rehydrate();
	}

	public setStorage(storage: TokenStorage): void {
		this._storage = storage;
		this._hydrate(storage);
	}

	private _hydrate(storage: TokenStorage): void {
		localStorage.setItem(this._tokenStorageKey, JSON.stringify(storage.constructor.name));
	}

	private _rehydrate(): TokenStorage {
		const tokenStorage = localStorage.getItem(this._tokenStorageKey);

		if (!tokenStorage) {
			return this._defaultTokenStorage;
		}

		return this._tokenStorageRegistry.get(tokenStorage) || this._defaultTokenStorage;
	}
}
