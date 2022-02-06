import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CONFIG_TOKEN, IConfig } from '@nx-mfe/client/config';
import { AuthTokenManager } from '@nx-mfe/client/token-manager';
import { AuthTokensDto, Credentials, RegistrationCredentials } from '@nx-mfe/shared/data-access';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	// TODO разделить сервис для получения данных и сервис для хранения состояния
	private readonly _isLoggedIn$ = new BehaviorSubject<boolean>(this._isLoggedIn);
	public readonly isLoggedIn$ = this._isLoggedIn$.asObservable();

	private get _isLoggedIn(): boolean {
		return (
			this._authTokenManager.isValidAccessToken() ||
			this._authTokenManager.isValidRefreshToken()
		);
	}

	constructor(
		private readonly _httpClient: HttpClient,
		private readonly _router: Router,
		private readonly _authTokenManager: AuthTokenManager,
		@Inject(CONFIG_TOKEN) private readonly _config: IConfig
	) {}

	public login(credentials: Credentials): Observable<AuthTokensDto> {
		return this._httpClient
			.post<AuthTokensDto>(this._config.apiUrl + '/auth/login', credentials, {
				withCredentials: true,
			})
			.pipe(
				tap((authTokens) => {
					// TODO это должно тут быть или вынести в фасад? Разделить на 2 сервиса:
					//  1) только работает с запросами;
					//  2) выполняет запрос из первого сервиса и добавляет логику для процесса авторизации
					this._authTokenManager.setAuthTokens(authTokens);
					this._router.navigate(['/']);
					this._isLoggedIn$.next(this._isLoggedIn);
				})
			);
	}

	public register(credentials: RegistrationCredentials): Observable<void> {
		return this._httpClient.post<void>(this._config.apiUrl + '/auth/register', credentials);
	}

	public logout(): Observable<void> {
		return this._httpClient
			.post<void>(this._config.apiUrl + '/auth/logout', null, {
				withCredentials: true,
			})
			.pipe(
				tap(() => {
					this._authTokenManager.deleteAuthTokens();
					this._router.navigate(['/auth/login']);
					this._isLoggedIn$.next(this._isLoggedIn);
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
					this._authTokenManager.setAuthTokens(authTokens);
					this._isLoggedIn$.next(this._isLoggedIn);
				})
			);
	}
}
