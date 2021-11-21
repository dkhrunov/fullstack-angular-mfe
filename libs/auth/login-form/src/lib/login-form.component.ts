import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@nx-mfe/client-auth';
import { of } from 'rxjs';

@Component({
	selector: 'nx-mfe-login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.scss'],
})
export class AuthLoginFormComponent implements OnInit {
	public form!: FormGroup;
	public readonly isLoggedIn$ = of(false);

	constructor(
		private readonly _fb: FormBuilder,
		private readonly _authService: AuthService
	) {}

	public ngOnInit(): void {
		this.form = this._fb.group({
			email: [null, [Validators.required]],
			password: [null, [Validators.required]],
			remember: [false],
		});
	}

	public login(): void {
		this._validate();

		if (this.form.valid) {
			const { email, password } = this.form.value;
			this._authService.login({ email, password }).subscribe();
		}
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
