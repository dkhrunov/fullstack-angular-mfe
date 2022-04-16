import { Inject, Injectable, Type } from '@angular/core';
import { CUSTOM_TOKEN_STORAGES } from '../injection-tokens';
import { PREDEFINED_TOKEN_STORAGES, TokenStorage } from '../token-storages';

@Injectable({
	providedIn: 'root',
})
export class TokenStorageRegistry {
	private readonly _map = new Map<string, TokenStorage>();

	constructor(
		@Inject(CUSTOM_TOKEN_STORAGES)
		private readonly _customTokenStorages: TokenStorage[]
	) {
		// registers predefined token storages and user-provided token storages
		PREDEFINED_TOKEN_STORAGES.concat(this._customTokenStorages).forEach((storage) =>
			this.register(storage)
		);
	}

	/**
	 * Register new token storage
	 * @param storage instance of the `TokenStorage`
	 */
	public register(storage: TokenStorage): void {
		if (this.get(storage)) {
			throw new Error(
				`Unable to register the '${storage.constructor.name}' because it is already registered`
			);
		}

		this._map.set(storage.constructor.name, storage);
	}

	/**
	 * Gets the registered token store or undefined if the given store has not been registered
	 * @param storage the name of a class, instance, or the class itself
	 */
	public get(storage: string | TokenStorage | Type<TokenStorage>): TokenStorage | undefined {
		if (typeof storage === 'string') {
			return this._map.get(storage);
		}

		return this._map.get(storage.constructor.name);
	}
}
