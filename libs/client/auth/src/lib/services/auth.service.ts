import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CONFIG_TOKEN, IConfig } from '@nx-mfe/client/config';
import {
	AuthTokenManagerService,
	ETokenStorageType,
	TokenStorageManagerService,
} from '@nx-mfe/client/token-manager';
import {
	AuthTokensDto,
	CredentialsDto,
	RegistrationCredentialsDto,
} from '@nx-mfe/shared/data-access';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private readonly _isLoggedIn$ = new BehaviorSubject<boolean>(this.isLoggedIn);
	public readonly isLoggedIn$ = this._isLoggedIn$.asObservable();

	// TODO разделить сервис для получения данных и сервис для хранения состояния
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
		private readonly _tokenStorageManager: TokenStorageManagerService,
		@Inject(CONFIG_TOKEN) private readonly _config: IConfig
	) {}

	public rememberMe(value: boolean): void {
		this._tokenStorageManager.setTokenStorage(
			value ? ETokenStorageType.Cookies : ETokenStorageType.SessionStorage
		);
	}

	public login(credentials: CredentialsDto): Observable<AuthTokensDto> {
		return this._httpClient
			.post<AuthTokensDto>(this._config.apiUrl + '/auth/login', credentials, {
				withCredentials: true,
			})
			.pipe(
				tap((authTokens) => {
					this._authTokenManagerService.setAuthTokens(authTokens);
					this._router.navigate(['/']);
					this._isLoggedIn$.next(this.isLoggedIn);
				})
			);
	}

	public register(credentials: RegistrationCredentialsDto): Observable<void> {
		return this._httpClient.post<void>(this._config.apiUrl + '/auth/register', credentials);
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
					this._isLoggedIn$.next(this.isLoggedIn);
				})
			);
	}

	public refresh(): Observable<AuthTokensDto> {
		return this._httpClient
			.get<AuthTokensDto>(this._config.apiUrl + '/auth/refresh', {
				withCredentials: true,
			})
			.pipe(
				tap((authTokens) => {
					this._authTokenManagerService.setAuthTokens(authTokens);
					this._isLoggedIn$.next(this.isLoggedIn);
				})
			);
	}
}
