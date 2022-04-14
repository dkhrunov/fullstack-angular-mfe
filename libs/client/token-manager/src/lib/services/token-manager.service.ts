import { Inject, Injectable } from '@angular/core';
import { ITokenManager, ITokenStorageService } from '../interfaces';
import { TokenStorage } from '../token-storage';
import { TokenStorageService } from './token-storage.service';

@Injectable({
	providedIn: 'root',
})
export class TokenManager implements ITokenManager {
	private get _tokenStorage(): TokenStorage {
		return this._tokenStorageService.storage;
	}

	constructor(
		@Inject(TokenStorageService)
		private readonly _tokenStorageService: ITokenStorageService
	) {}

	public getToken(tokenName: string): string | null {
		return this._tokenStorage.get(tokenName);
	}

	public setToken(tokenName: string, token: string): void {
		this._tokenStorage.set(tokenName, token);
	}

	public deleteToken(tokenName: string): void {
		this._tokenStorage.delete(tokenName);
	}

	public isValidToken(tokenName: string): boolean {
		return this._tokenStorage.isValid(tokenName);
	}
}
