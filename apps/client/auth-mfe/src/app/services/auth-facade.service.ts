import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { JwtAuthService } from '@dekh/ngx-jwt-auth';
import { AuthApiService } from '@nx-mfe/client/auth';
import { HttpError } from '@nx-mfe/client/common';
import { DefaultHttpError, Login, Registration, ServerErrorDto } from '@nx-mfe/shared/data-access';
import { BehaviorSubject, catchError, EMPTY, finalize, Subject, tap } from 'rxjs';

@Injectable()
export class AuthFacadeService implements OnDestroy {
	private readonly _isLogIn$ = new BehaviorSubject<boolean>(false);
	public readonly isLogIn$ = this._isLogIn$.asObservable();

	private readonly _loginError$ = new BehaviorSubject<string | null>(null);
	public readonly loginError$ = this._loginError$.asObservable();

	private readonly _isRegistering$ = new BehaviorSubject<boolean>(false);
	public readonly isRegistering$ = this._isRegistering$.asObservable();

	private readonly _registerError$ = new BehaviorSubject<string | null>(null);
	public readonly registerError$ = this._registerError$.asObservable();

	private readonly _destroy$ = new Subject<void>();

	constructor(
		private readonly _router: Router,
		private readonly _authApiService: AuthApiService,
		private readonly _jwtAuthService: JwtAuthService
	) {}

	public ngOnDestroy(): void {
		this._destroy$.next();
		this._destroy$.complete();
	}

	public login(data: Login): void {
		this._isLogIn$.next(true);

		this._jwtAuthService
			.login(data)
			.pipe(
				tap(() => {
					this._router.navigate(['/']);
					this._loginError$.next(null);
				}),
				// TODO сделать сервис по обработке ошибок
				catchError((error: HttpError<ServerErrorDto>) => {
					if (!error.error) {
						this._loginError$.next(new DefaultHttpError().message);
					} else {
						this._loginError$.next(error.error.message);
					}

					return EMPTY;
				}),
				finalize(() => this._isLogIn$.next(false))
			)
			.subscribe();
	}

	public register(data: Registration): void {
		this._isRegistering$.next(true);

		this._authApiService
			.register(data)
			.pipe(
				tap(() => this._registerError$.next(null)),
				// TODO сделать сервис по обработке ошибок
				catchError((error: HttpError<ServerErrorDto>) => {
					if (!error.error) {
						this._registerError$.next(new DefaultHttpError().message);
					} else {
						this._registerError$.next(error.error.message);
					}

					return EMPTY;
				}),
				finalize(() => this._isRegistering$.next(false))
			)
			.subscribe();
	}
}
