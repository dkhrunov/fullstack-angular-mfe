import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { AuthTokenManager } from '@nx-mfe/client/token-manager';
import { catchError, finalize, Observable, Subject, switchMap, tap, throwError } from 'rxjs';
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
		// TODO Use ApiUrlRegistry
		if (request.url.includes('/auth')) return next.handle(request);

		request = this._addAuthHeader(request);

		return next.handle(request).pipe(
			catchError((error: HttpErrorResponse) => {
				return this._handleResponseError(error, request, next);
			})
		);
	}

	private _addAuthHeader(request: HttpRequest<unknown>): HttpRequest<unknown> {
		const accessToken = this._authTokenManager.getAccessToken();

		return request.clone({
			setHeaders: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
	}

	private _handleResponseError(
		error: HttpErrorResponse,
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		if (error.status === 401) {
			return this._refreshToken().pipe(
				switchMap(() => {
					request = this._addAuthHeader(request);
					return next.handle(request);
				})
			);
		}

		return throwError(() => error);
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
				catchError((error: HttpErrorResponse) => {
					if (error.status === 401) {
						this._authService.logout();
					}

					return throwError(() => error);
				}),
				finalize(() => (this._refreshTokenInProgress = false))
			);
		}
	}
}
