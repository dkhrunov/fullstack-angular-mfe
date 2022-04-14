import { Inject, Injectable } from '@angular/core';
import { AUTH_TOKEN_STORAGE_KEY } from '../const';
import { DEFAULT_AUTH_TOKEN_STORAGE } from '../injection-tokens';
import { TokenStorage } from '../token-storage';
import { BaseTokenStorageService } from './base-token-storage-service';

@Injectable({
	providedIn: 'root',
})
export class AuthTokenStorageService extends BaseTokenStorageService {
	constructor(
		@Inject(DEFAULT_AUTH_TOKEN_STORAGE)
		protected override readonly _defaultTokenStorage: TokenStorage
	) {
		super(AUTH_TOKEN_STORAGE_KEY, _defaultTokenStorage);
	}
}
