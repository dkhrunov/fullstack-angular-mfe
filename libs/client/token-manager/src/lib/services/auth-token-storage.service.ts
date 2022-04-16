import { Inject, Injectable } from '@angular/core';
import { AUTH_TOKEN_STORAGE_KEY } from '../const';
import { DEFAULT_AUTH_TOKEN_STORAGE } from '../injection-tokens';
import { TokenStorage } from '../token-storages';
import { BaseTokenStorageService } from './base-token-storage-service';
import { TokenStorageRegistry } from './token-storage-registry.service';

@Injectable({
	providedIn: 'root',
})
export class AuthTokenStorageService extends BaseTokenStorageService {
	constructor(
		@Inject(DEFAULT_AUTH_TOKEN_STORAGE)
		protected override readonly _defaultTokenStorage: TokenStorage,
		protected override readonly _tokenStorageRegistry: TokenStorageRegistry
	) {
		super(AUTH_TOKEN_STORAGE_KEY, _defaultTokenStorage, _tokenStorageRegistry);
	}
}
