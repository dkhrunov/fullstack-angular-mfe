import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { AuthTokenManager } from '@nx-mfe/client/token-manager';
import { finalize, Observable, Subject, switchMap, tap } from 'rxjs';
import { AuthService } from '../services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	private _refreshTokenInProgress = false;

	private readonly _tokenRefreshed$ = new Subject<void>();
	public readonly tokenRefreshed$ = this._tokenRefreshed$.asObservable();

	// Hack to avoid circular dependency
	private get _authService(): AuthService {
		return this._injector.get(AuthService);
	}

	constructor(
		private readonly _authTokenManager: AuthTokenManager,
		@Inject(Injector) private readonly _injector: Injector
	) {}

	public intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		// Skip all `auth` endpoints to avoid circular
		// calling refresh token if 401 error thrownagain
		// TODO Use ApiUrlRegistry
		if (request.url.includes('/auth')) return next.handle(request);

		if (!this._authTokenManager.isValidAccessToken()) {
			return this._refreshToken().pipe(
				switchMap(() => {
					const requestWithToken = this._addAccessTokenToHeaders(request);
					return next.handle(requestWithToken);
				})
			);
		}

		const requestWithToken = this._addAccessTokenToHeaders(request);
		return next.handle(requestWithToken);
	}

	private _addAccessTokenToHeaders(request: HttpRequest<unknown>): HttpRequest<unknown> {
		const accessToken = this._authTokenManager.getAccessToken();

		return request.clone({
			setHeaders: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
	}

	private _refreshToken(): Observable<unknown> {
		if (this._refreshTokenInProgress) {
			return new Observable((observer) => {
				this.tokenRefreshed$.subscribe(() => {
					observer.next();
					observer.complete();
				});
			});
		} else {
			this._refreshTokenInProgress = true;

			return this._authService.refresh().pipe(
				tap(() => this._tokenRefreshed$.next()),
				finalize(() => (this._refreshTokenInProgress = false))
			);
		}
	}
}
