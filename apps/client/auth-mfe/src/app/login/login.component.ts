import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@nx-mfe/client/auth';
import { startWith, Subject, takeUntil, tap } from 'rxjs';

const INITIAL_VALUE_REMEMBER_ME = true;

@Component({
	selector: 'nx-mfe-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy {
	public readonly form = this._createForm();
	public readonly isLoggedIn$ = this._authService.isLoggedIn$;

	private readonly _destroy$ = new Subject<void>();

	constructor(private readonly _fb: FormBuilder, private readonly _authService: AuthService) {
		this._listenRememberMeChanges();
	}

	public ngOnDestroy(): void {
		this._destroy$.next();
		this._destroy$.complete();
	}

	public login(): void {
		this._validate();

		if (this.form.valid) {
			const { email, password } = this.form.value;

			this._authService.login({ email, password }).subscribe();
		}
	}

	private _createForm(): FormGroup {
		return this._fb.group({
			email: [null, [Validators.required]],
			password: [null, [Validators.required]],
			rememberMe: [INITIAL_VALUE_REMEMBER_ME],
		});
	}

	private _validate(): void {
		for (const i in this.form.controls) {
			if (Object.prototype.hasOwnProperty.call(this.form.controls, i)) {
				this.form.controls[i].markAsDirty();
				this.form.controls[i].updateValueAndValidity();
			}
		}
	}

	private _listenRememberMeChanges(): void {
		this.form
			.get('rememberMe')
			?.valueChanges.pipe(
				takeUntil(this._destroy$),
				startWith(INITIAL_VALUE_REMEMBER_ME),
				tap((value: boolean) => this._authService.rememberMe(value))
			)
			.subscribe();
	}
}
