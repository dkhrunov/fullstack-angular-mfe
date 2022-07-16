import { ComponentRef, Injectable, OnDestroy } from '@angular/core';
import { AuthApiService } from '@nx-mfe/client/auth';
import { HttpError } from '@nx-mfe/client/common';
import {
	DefaultHttpErrorResponse,
	RegistrationRequest,
	ResendRegistrationConfirmationMailRequest,
	ServerErrorResponse,
} from '@nx-mfe/shared/data-access';
import { ModalService } from 'carbon-components-angular/modal';
import { plainToClass } from 'class-transformer';
import { BehaviorSubject, catchError, EMPTY, finalize, Subject, takeUntil, tap, timer } from 'rxjs';

import { ConfirmRegistrationModalComponent } from './confirm-registration-modal/confirm-registration-modal.component';

@Injectable()
export class RegisterFacadeService implements OnDestroy {
	private readonly _isRegistering$ = new BehaviorSubject<boolean>(false);
	public readonly isRegistering$ = this._isRegistering$.asObservable();

	private readonly _registerError$ = new BehaviorSubject<string | null>(null);
	public readonly registerError$ = this._registerError$.asObservable();

	private readonly _destroy$ = new Subject<void>();

	constructor(
		private readonly _authApiService: AuthApiService,
		private readonly _modalService: ModalService
	) {}

	public ngOnDestroy(): void {
		this._destroy$.next();
		this._destroy$.complete();
	}

	public register(request: RegistrationRequest): void {
		this._isRegistering$.next(true);

		this._authApiService
			.register(request)
			.pipe(
				tap(() => this.resetRegisterError()),
				// TODO сделать сервис по обработке ошибок
				catchError((error: HttpError<ServerErrorResponse>) => {
					if (!error.error) {
						this._registerError$.next(new DefaultHttpErrorResponse().message);
					} else {
						this._registerError$.next(error?.error?.message || 'Unknown error');
					}

					return EMPTY;
				}),
				finalize(() => this._isRegistering$.next(false))
			)
			.subscribe(() => this._showConfirmRegistrationModal(request.email));
	}

	public resetRegisterError(): void {
		this._registerError$.next(null);
	}

	public resendRegistrationConfirmationMail(email: string): void {
		const request = plainToClass(ResendRegistrationConfirmationMailRequest, { email });

		this._authApiService.resendRegistrationConfirmationMail(request).subscribe();
	}

	private _showConfirmRegistrationModal(email: string): void {
		const ref: ComponentRef<ConfirmRegistrationModalComponent> =
			this._modalService.create<ConfirmRegistrationModalComponent>({
				component: ConfirmRegistrationModalComponent,
				inputs: { email },
			});

		ref.instance.send
			.pipe(takeUntil(this._destroy$))
			.subscribe(() => this.resendRegistrationConfirmationMail(email));

		// TODO PR to Carbon
		// HACK to show modal in OnPush strategy
		timer(0).subscribe(() => ref.hostView.detectChanges());
	}
}
