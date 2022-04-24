import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PASSWORD_REGEXP } from '@nx-mfe/client/auth';
import { NzConfirmable } from '@nx-mfe/client/common';
import { CustomValidators, Form, IfFormValid } from '@nx-mfe/client/forms';
import { Registration } from '@nx-mfe/shared/data-access';
import { AuthFacadeService } from '../services/auth-facade.service';

@Component({
	selector: 'nx-mfe-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
	providers: [AuthFacadeService],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
	@Form()
	public form: FormGroup;

	public passwordVisible = false;

	constructor(public readonly authFacade: AuthFacadeService, private readonly _fb: FormBuilder) {
		this._createForm();
	}

	@IfFormValid()
	@NzConfirmable()
	public submitForm(): void {
		const credentials = new Registration(this.form.value);
		this.authFacade.register(credentials);
	}

	public validateConfirmPassword(): void {
		this.form.controls.confirm.updateValueAndValidity();
	}

	private _createForm(): void {
		this.form = this._fb.group({
			email: [null, [Validators.required, Validators.email]],
			password: [
				null,
				[Validators.required, Validators.minLength(8), Validators.pattern(PASSWORD_REGEXP)],
			],
			confirm: [null, [Validators.required, CustomValidators.confirm('password')]],
		});
	}
}
