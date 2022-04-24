import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthTokenManager } from '@nx-mfe/client/token-manager';
import { AuthTokensDto, Login, Registration } from '@nx-mfe/shared/data-access';
import { catchError, Observable, ReplaySubject, tap, throwError } from 'rxjs';
import { AuthApiService } from './auth-api.service';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private readonly _isLoggedIn$ = new ReplaySubject<boolean>(1);
	public readonly isLoggedIn$ = this._isLoggedIn$.asObservable();

	private get _isValidAccessToken(): boolean {
		return this._authTokenManager.isValidAccessToken();
	}

	constructor(
		private readonly _router: Router,
		private readonly _authApiService: AuthApiService,
		private readonly _authTokenManager: AuthTokenManager
	) {
		if (this._isValidAccessToken) {
			this._isLoggedIn$.next(true);
		} else {
			this.refresh().subscribe();
		}
	}

	public login(credentials: Login): Observable<AuthTokensDto> {
		return this._authApiService.login(credentials).pipe(
			tap((authTokens) => {
				this._authTokenManager.setAccessToken(authTokens.accessToken);
				this._router.navigate(['/']);
				this._isLoggedIn$.next(this._isValidAccessToken);
			}),
			catchError((error) => {
				this._isLoggedIn$.next(false);
				return throwError(() => error);
			})
		);
	}

	public register(credentials: Registration): Observable<void> {
		return this._authApiService.register(credentials);
	}

	public logout(): Observable<void> {
		return this._authApiService.logout().pipe(
			tap(() => {
				this._authTokenManager.deleteAccessToken();
				this._router.navigate(['/auth/login']);
				this._isLoggedIn$.next(this._isValidAccessToken);
			})
		);
	}

	public refresh(): Observable<AuthTokensDto> {
		return this._authApiService.refresh().pipe(
			tap((authTokens) => {
				this._authTokenManager.setAccessToken(authTokens.accessToken);
				this._isLoggedIn$.next(this._isValidAccessToken);
			}),
			catchError((error: HttpErrorResponse) => {
				if (error.status === 401) {
					this.logout();
				}

				this._isLoggedIn$.next(false);
				return throwError(() => error);
			})
		);
	}
}
