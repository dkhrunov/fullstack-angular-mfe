import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthTokenManagerService } from '@nx-mfe/client/token-manager';
import { catchError, finalize, Observable, Subject, switchMap, tap, throwError } from 'rxjs';

import { AuthService } from '../services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	private _refreshTokenInProgress = false;
	private readonly _tokenRefreshed$ = new Subject<void>();

	public readonly tokenRefreshed$ = this._tokenRefreshed$.asObservable();

	constructor(
		private readonly _authTokenManagerService: AuthTokenManagerService,
		private readonly _authService: AuthService
	) {}

	public intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		request = this._addAuthHeader(request);

		return next.handle(request).pipe(
			catchError((error) => {
				// TODO Use ApiUrlRegistry
				if (request.url.includes('/auth')) {
					return throwError(error);
				}

				return this._handleResponseError(error, request, next);
			})
		);
	}

	private _addAuthHeader(request: HttpRequest<unknown>): HttpRequest<unknown> {
		const accessToken = this._authTokenManagerService.getAccessToken();

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
				catchError((error) => {
					if (error.status === 401) {
						return this._authService.logout();
					}

					return throwError(error);
				}),
				finalize(() => (this._refreshTokenInProgress = false))
			);
		}
	}
}
