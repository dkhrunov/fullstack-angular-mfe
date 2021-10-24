import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@nx-mfe/shared/data-access-user';

@Component({
	selector: 'nx-mfe-login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.scss'],
})
export class AuthLoginFormComponent implements OnInit {
	public form!: FormGroup;
	public readonly isLoggedIn$ = this._userService.isUserLoggedIn$;

	constructor(
		private readonly _fb: FormBuilder,
		private readonly _userService: UserService,
	) {}

	public ngOnInit(): void {
		this.form = this._fb.group({
			username: [null, [Validators.required]],
			password: [null, [Validators.required]],
			remember: [false],
		});
	}

	public login(): void {
		this._validate();

		if (this.form.valid) {
			const { username, password } = this.form.value;
			this._userService.login(username, password);
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
