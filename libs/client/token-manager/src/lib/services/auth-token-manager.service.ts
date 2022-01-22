import { Inject, Injectable } from '@angular/core';

import { AuthTokensTypes } from '../enums';
import { AUTH_TOKEN_STORAGE_STRATEGY_TOKEN } from '../injection-tokens';
import { IAuthTokenManager, IAuthTokens, ITokenStorageStrategy } from '../interfaces';
import { TokenManager } from './token-manager.service';

@Injectable({
	providedIn: 'root',
})
export class AuthTokenManager extends TokenManager implements IAuthTokenManager {
	constructor(
		@Inject(AUTH_TOKEN_STORAGE_STRATEGY_TOKEN)
		protected readonly _authTokenStorageStrategy: ITokenStorageStrategy
	) {
		super(_authTokenStorageStrategy);
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
