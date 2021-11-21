import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigToken, IConfig } from '@nx-mfe/client/config';
import { AuthTokenManagerService } from '@nx-mfe/client/token-manager';
import {
	AuthTokensDto,
	CredentialsDto,
	RegistrationCredentialsDto,
} from '@nx-mfe/shared/data-access';
import { Observable, tap } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	public get isLoggedIn(): boolean {
		return (
			this._authTokenManagerService.isValidAccessToken() ||
			this._authTokenManagerService.isValidRefreshToken()
		);
	}

	constructor(
		private readonly _httpClient: HttpClient,
		private readonly _router: Router,
		private readonly _authTokenManagerService: AuthTokenManagerService,
		@Inject(ConfigToken) private readonly _config: IConfig
	) {}

	public login(credentials: CredentialsDto): Observable<AuthTokensDto> {
		return this._httpClient
			.post<AuthTokensDto>(
				this._config.apiUrl + '/auth/login',
				credentials,
				{ withCredentials: true }
			)
			.pipe(
				tap((authTokens) => {
					this._authTokenManagerService.setAuthTokens(authTokens);
					this._router.navigate(['/']);
				})
			);
	}

	public register(credentials: RegistrationCredentialsDto): Observable<void> {
		return this._httpClient.post<void>(
			this._config.apiUrl + '/auth/register',
			credentials
		);
	}

	public logout(): Observable<void> {
		return this._httpClient
			.post<void>(this._config.apiUrl + '/auth/logout', null, {
				withCredentials: true,
			})
			.pipe(
				tap(() => {
					this._authTokenManagerService.deleteAuthTokens();
					this._router.navigate(['/auth/login']);
				})
			);
	}

	public refresh(): Observable<AuthTokensDto> {
		return this._httpClient
			.get<AuthTokensDto>(this._config.apiUrl + '/auth/refresh', {
				withCredentials: true,
			})
			.pipe(
				tap((authTokens) =>
					this._authTokenManagerService.setAuthTokens(authTokens)
				)
			);
	}
}
