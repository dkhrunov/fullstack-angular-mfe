import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { PASSWORD_REGEXP } from '@nx-mfe/client/auth';
import { CustomValidators, Form, IfFormValid } from '@nx-mfe/client/forms';
import { RegistrationCredentials } from '@nx-mfe/shared/data-access';

import { AuthFacadeService } from '../services/auth-facade.service';

@Component({
	selector: 'nx-mfe-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
	providers: [AuthFacadeService],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
	@Form({
		email: [[Validators.required, Validators.email]],
		password: [
			[Validators.required, Validators.minLength(6), Validators.pattern(PASSWORD_REGEXP)],
		],
		confirm: [[Validators.required, CustomValidators.confirm('password')]],
	})
	public readonly form: FormGroup;

	public passwordVisible = false;

	constructor(public readonly authFacade: AuthFacadeService) {}

	@IfFormValid('form')
	public submitForm(): void {
		const credentials = new RegistrationCredentials(this.form.value);
		this.authFacade.register(credentials);
	}

	public validateConfirmPassword(): void {
		setTimeout(() => this.form.controls.confirm.updateValueAndValidity());
	}
}
