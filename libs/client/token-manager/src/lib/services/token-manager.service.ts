import { Injectable } from '@angular/core';

import { ITokenManager } from '../interfaces';
import { TokenStorageManagerService } from './token-storage-manager.service';

@Injectable({
	providedIn: 'root',
})
export class TokenManagerService implements ITokenManager {
	constructor(private readonly _tokenStorageManager: TokenStorageManagerService) {}

	public getToken(tokenName: string): string | null {
		return this._tokenStorageManager.tokenStorage.get(tokenName);
	}

	public setToken(tokenName: string, token: string): void {
		this._tokenStorageManager.tokenStorage.set(tokenName, token);
	}

	public deleteToken(tokenName: string): void {
		this._tokenStorageManager.tokenStorage.delete(tokenName);
	}

	public isValidToken(tokenName: string): boolean {
		return this._tokenStorageManager.tokenStorage.isValid(tokenName);
	}
}
