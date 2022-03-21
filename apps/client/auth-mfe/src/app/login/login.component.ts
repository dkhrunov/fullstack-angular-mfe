import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzConfirmable } from '@nx-mfe/client/common';
import { Form, IfFormValid } from '@nx-mfe/client/forms';
import { Credentials } from '@nx-mfe/shared/data-access';
import { BehaviorSubject, startWith, Subject, takeUntil, tap } from 'rxjs';
import { AuthFacadeService } from '../services/auth-facade.service';

@Component({
	selector: 'nx-mfe-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	providers: [AuthFacadeService],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy {
	@Form()
	public form: FormGroup;

	public text$ = new BehaviorSubject<string>('Test string');

	public passwordVisible = false;

	private readonly _destroy$ = new Subject<void>();

	constructor(public readonly authFacade: AuthFacadeService, private readonly _fb: FormBuilder) {
		this._createForm();
		this._listenRememberMeChanges();

		setTimeout(() => this.text$.next('Test string changed in Subject'), 2000);
		setTimeout(() => this.text$.next('Test string changed 2x in Subject'), 3000);
	}

	public ngOnDestroy(): void {
		this._destroy$.next();
		this._destroy$.complete();
	}

	@IfFormValid()
	@NzConfirmable()
	public login(): void {
		const credentials = new Credentials(this.form.value);
		this.authFacade.login(credentials);
	}

	private _createForm(): void {
		this.form = this._fb.group({
			email: [null, [Validators.required, Validators.email]],
			password: [null, [Validators.required]],
			rememberMe: [this.authFacade.rememberMeValue],
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
