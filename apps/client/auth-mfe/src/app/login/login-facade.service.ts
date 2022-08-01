import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { JwtAuthService } from '@dekh/ngx-jwt-auth';
import { HttpError } from '@nx-mfe/client/common';
import {
	DefaultHttpErrorResponse,
	LoginRequest,
	ServerErrorResponse,
} from '@nx-mfe/shared/data-access';
import { BehaviorSubject, catchError, EMPTY, finalize, Subject, tap } from 'rxjs';

@Injectable()
export class LoginFacadeService implements OnDestroy {
	private readonly _isLogIn$ = new BehaviorSubject<boolean>(false);
	public readonly isLogIn$ = this._isLogIn$.asObservable();

	private readonly _logInError$ = new BehaviorSubject<string | null>(null);
	public readonly logInError$ = this._logInError$.asObservable();

	private readonly _destroy$ = new Subject<void>();

	constructor(
		private readonly _router: Router,
		private readonly _jwtAuthService: JwtAuthService
	) {}

	public ngOnDestroy(): void {
		this._destroy$.next();
		this._destroy$.complete();
	}

	public logIn(data: LoginRequest): void {
		this._isLogIn$.next(true);

		this._jwtAuthService
			.login(data)
			.pipe(
				tap(() => {
					this._router.navigate(['/']);
					this.resetLogInError();
				}),
				// TODO сделать сервис по обработке ошибок
				// TODO обработать ошибку когда сервер не доступен, выводить не Unknown error а что-то осмысленное
				catchError((error: HttpError<ServerErrorResponse>) => {
					if (!error.error) {
						this._logInError$.next(new DefaultHttpErrorResponse().message);
					} else {
						this._logInError$.next(error?.error?.message || 'Unknown error');
					}

					return EMPTY;
				}),
				finalize(() => this._isLogIn$.next(false))
			)
			.subscribe();
	}

	public resetLogInError(): void {
		this._logInError$.next(null);
	}
}
