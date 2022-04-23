import { Inject, Injectable, Type } from '@angular/core';
import { TOKEN_MANAGER_OPTIONS } from '../injection-tokens';
import { TokenManagerOptions } from '../interfaces';
import { BaseTokenStorage, PREDEFINED_TOKEN_STORAGES } from '../token-storages';

@Injectable({
	providedIn: 'root',
})
export class TokenStorageRegistry {
	private readonly _map = new Map<string, BaseTokenStorage>();

	constructor(
		@Inject(TOKEN_MANAGER_OPTIONS)
		private readonly _options: TokenManagerOptions
	) {
		// registers predefined token storages and user-provided token storages
		PREDEFINED_TOKEN_STORAGES.concat(this._options.customTokenStorages ?? []).forEach(
			(storage) => this.register(storage)
		);
	}

	/**
	 * Register new token storage
	 *
	 * @param storage instance of the `BaseTokenStorage`
	 */
	public register<T extends BaseTokenStorage>(storage: T): void {
		if (this.isRegistered(storage)) {
			throw new Error(
				`Unable to register the '${storage.constructor.name}' because it is already registered`
			);
		}

		this._map.set(storage.constructor.name, storage);
	}

	/**
	 * Gets the registered token store or undefined if the given store has not been registered
	 *
	 * @param storage the name of a class, instance, or the class itself
	 */
	public get<T extends BaseTokenStorage>(storage: string | T | Type<T>): T | undefined {
		if (typeof storage === 'string') {
			return this._map.get(storage) as T;
		}

		return this._map.get(storage.constructor.name) as T;
	}

	/**
	 * Checks that given storage registered
	 *
	 * @param storage the name of a class, instance, or the class itself
	 */
	public isRegistered<T extends BaseTokenStorage>(storage: string | T | Type<T>): boolean {
		if (typeof storage === 'string') {
			return this._map.has(storage);
		}

		return this._map.has(storage.constructor.name);
	}
}
