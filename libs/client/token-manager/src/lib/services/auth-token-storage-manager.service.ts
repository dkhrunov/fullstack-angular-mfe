import { Inject, Injectable } from '@angular/core';

import { AUTH_TOKEN_STORAGE_KEY } from '../const';
import { DEFAULT_AUTH_TOKEN_STORAGE } from '../injection-tokens';
import { BaseTokenStorage } from '../token-storages';
import { BaseTokenStorageManager } from './base-token-storage-manager';
import { TokenStorageRegistry } from './token-storage-registry.service';

@Injectable({
	providedIn: 'root',
})
export class AuthTokenStorageManager extends BaseTokenStorageManager {
	constructor(
		@Inject(DEFAULT_AUTH_TOKEN_STORAGE)
		protected override readonly _defaultTokenStorage: BaseTokenStorage,
		protected override readonly _tokenStorageRegistry: TokenStorageRegistry
	) {
		super(AUTH_TOKEN_STORAGE_KEY, _defaultTokenStorage, _tokenStorageRegistry);
	}
}
