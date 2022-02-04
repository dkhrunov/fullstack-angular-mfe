import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Form, IfFormValid } from '@nx-mfe/client/forms';
import { Credentials } from '@nx-mfe/shared/data-access';
import { startWith, Subject, takeUntil, tap } from 'rxjs';

import { AuthFacadeService } from '../services/auth-facade.service';

@Component({
	selector: 'nx-mfe-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	providers: [AuthFacadeService],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy {
	@Form({
		email: [[Validators.required, Validators.email]],
		password: [[Validators.required]],
		rememberMe: [[]],
	})
	public readonly form: FormGroup;

	public passwordVisible = false;

	private readonly _destroy$ = new Subject<void>();

	constructor(public readonly authFacade: AuthFacadeService) {
		this._setDefaultFormValue();
		this._listenRememberMeChanges();
	}

	public ngOnDestroy(): void {
		this._destroy$.next();
		this._destroy$.complete();
	}

	@IfFormValid('form')
	public async login(): Promise<void> {
		const credentials = new Credentials(this.form.value);
		this.authFacade.login(credentials);
	}

	private _setDefaultFormValue(): void {
		this.form.setValue({
			email: null,
			password: null,
			rememberMe: this.authFacade.rememberMeValue,
		});
	}

	private _listenRememberMeChanges(): void {
		this.form
			.get('rememberMe')
			?.valueChanges.pipe(
				takeUntil(this._destroy$),
				startWith(this.authFacade.rememberMeValue),
				tap((value: boolean) => this.authFacade.rememberMe(value))
			)
			.subscribe();
	}
}
