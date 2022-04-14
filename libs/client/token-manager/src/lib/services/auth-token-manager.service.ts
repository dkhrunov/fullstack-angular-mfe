import { Inject, Injectable } from '@angular/core';
import { EAuthToken } from '../enums';
import { IAuthTokenManager, IAuthTokens, ITokenStorageService } from '../interfaces';
import { AuthTokenStorageService } from './auth-token-storage.service';
import { TokenManager } from './token-manager.service';

@Injectable({
	providedIn: 'root',
})
export class AuthTokenManager extends TokenManager implements IAuthTokenManager {
	constructor(
		@Inject(AuthTokenStorageService)
		protected readonly _authTokenStorageService: ITokenStorageService
	) {
		super(_authTokenStorageService);
	}

	public getAccessToken(): string | null {
		return this.getToken(EAuthToken.accessToken);
	}

	public setAccessToken(token: string): void {
		this.setToken(EAuthToken.accessToken, token);
	}

	public deleteAccessToken(): void {
		this.deleteToken(EAuthToken.accessToken);
	}

	public isValidAccessToken(): boolean {
		return this.isValidToken(EAuthToken.accessToken);
	}

	public getRefreshToken(): string | null {
		return this.getToken(EAuthToken.refreshToken);
	}

	public setRefreshToken(token: string): void {
		this.setToken(EAuthToken.refreshToken, token);
	}

	public deleteRefreshToken(): void {
		this.deleteToken(EAuthToken.refreshToken);
	}

	public isValidRefreshToken(): boolean {
		return this.isValidToken(EAuthToken.refreshToken);
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
