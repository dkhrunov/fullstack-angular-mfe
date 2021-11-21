import { Injectable } from '@angular/core';

import { AuthTokensTypes } from '../enums';
import { IAuthTokenManager, IAuthTokens } from '../interfaces';
import { TokenStorage } from '../token-storage';
import { TokenManagerService } from './token-manager.service';

@Injectable({
	providedIn: 'root',
})
export class AuthTokenManagerService
	extends TokenManagerService
	implements IAuthTokenManager
{
	constructor(protected readonly _tokenStorage: TokenStorage) {
		super(_tokenStorage);
	}

	public getAccessToken(): string | null {
		return this.getToken(AuthTokensTypes.accessToken);
	}

	public setAccessToken(token: string): void {
		this.setToken(AuthTokensTypes.accessToken, token);
	}

	public deleteAccessToken(): void {
		this.deleteToken(AuthTokensTypes.accessToken);
	}

	public isValidAccessToken(): boolean {
		return this.isValidToken(AuthTokensTypes.accessToken);
	}

	public getRefreshToken(): string | null {
		return this.getToken(AuthTokensTypes.refreshToken);
	}

	public setRefreshToken(token: string): void {
		this.setToken(AuthTokensTypes.refreshToken, token);
	}

	public deleteRefreshToken(): void {
		this.deleteToken(AuthTokensTypes.refreshToken);
	}

	public isValidRefreshToken(): boolean {
		return this.isValidToken(AuthTokensTypes.refreshToken);
	}

	public getAuthTokens(): {
		accessToken: string | null;
		refreshToken: string | null;
	} {
		return {
			accessToken: this.getAccessToken(),
			refreshToken: this.getRefreshToken(),
		};
	}

	public setAuthTokens(tokens: IAuthTokens): void {
		this.setAccessToken(tokens.accessToken);
		this.setRefreshToken(tokens.refreshToken);
	}

	public deleteAuthTokens(): void {
		this.deleteAccessToken();
		this.deleteRefreshToken();
	}
}
