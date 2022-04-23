import { BaseTokenStorage } from '../token-storages';
import { TokenStorageRegistry } from './token-storage-registry.service';

export abstract class BaseTokenStorageManager {
	private _storage: BaseTokenStorage;

	/**
	 * Get current TokenStorage
	 */
	public get storage(): BaseTokenStorage {
		return this._storage;
	}

	constructor(
		protected readonly _key: string,
		protected readonly _defaultTokenStorage: BaseTokenStorage,
		protected readonly _tokenStorageRegistry: TokenStorageRegistry
	) {
		this._storage = this._rehydrate();
	}

	/**
	 * Change current token storage to the given token storage.
	 *
	 * @param storage instance of the token storage
	 */
	public setStorage(storage: BaseTokenStorage): void {
		this._storage = storage;
		this._hydrate(storage);
	}

	private _hydrate(storage: BaseTokenStorage): void {
		localStorage.setItem(this._key, JSON.stringify(storage.constructor.name));
	}

	private _rehydrate(): BaseTokenStorage {
		const tokenStorageName = localStorage.getItem(this._key);

		if (!tokenStorageName) {
			this._hydrate(this._defaultTokenStorage);
			return this._defaultTokenStorage;
		}

		const tokenStorage: string = JSON.parse(tokenStorageName);

		return this._tokenStorageRegistry.get(tokenStorage) || this._defaultTokenStorage;
	}
}
