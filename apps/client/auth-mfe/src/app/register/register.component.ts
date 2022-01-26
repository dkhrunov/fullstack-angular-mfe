import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@nx-mfe/client/auth';
import { CustomValidators } from '@nx-mfe/client/forms';
import { BehaviorSubject, finalize } from 'rxjs';

@Component({
	selector: 'nx-mfe-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
	public passwordVisible = false;
	public readonly form: FormGroup;

	private readonly _isLoading$ = new BehaviorSubject<boolean>(false);
	public readonly isLoading$ = this._isLoading$.asObservable();

	constructor(private fb: FormBuilder, private readonly _authService: AuthService) {
		this.form = this._createForm();
	}

	public submitForm(): void {
		this._validate();

		if (this.form.valid) {
			this._isLoading$.next(true);

			const { email, password } = this.form.value;

			this._authService
				.register({ email, password })
				.pipe(finalize(() => this._isLoading$.next(false)))
				.subscribe();
		}
	}

	public validateConfirmPassword(): void {
		setTimeout(() => this.form.controls.confirm.updateValueAndValidity());
	}

	private _createForm(): FormGroup {
		return this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required]],
			confirm: ['', [Validators.required, CustomValidators.confirm('password')]],
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
}
