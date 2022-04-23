import { Inject, Injectable } from '@angular/core';
import { BaseTokenManager } from './base-token-manager';
import { BaseTokenStorageManager } from './base-token-storage-manager';
import { TokenStorageManager } from './token-storage-manager.service';

@Injectable({
	providedIn: 'root',
})
export class TokenManager extends BaseTokenManager {
	constructor(
		@Inject(TokenStorageManager)
		protected override readonly _tokenStorageService: BaseTokenStorageManager
	) {
		super(_tokenStorageService);
	}
}
