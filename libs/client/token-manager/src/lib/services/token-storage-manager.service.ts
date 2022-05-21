import { Inject, Injectable } from '@angular/core';

import { TOKEN_STORAGE_KEY } from '../const';
import { DEFAULT_TOKEN_STORAGE } from '../injection-tokens';
import { BaseTokenStorage } from '../token-storages';
import { BaseTokenStorageManager } from './base-token-storage-manager';
import { TokenStorageRegistry } from './token-storage-registry.service';

@Injectable({
	providedIn: 'root',
})
export class TokenStorageManager extends BaseTokenStorageManager {
	constructor(
		@Inject(DEFAULT_TOKEN_STORAGE)
		protected override readonly _defaultTokenStorage: BaseTokenStorage,
		protected override readonly _tokenStorageRegistry: TokenStorageRegistry
	) {
		super(TOKEN_STORAGE_KEY, _defaultTokenStorage, _tokenStorageRegistry);
	}
}
