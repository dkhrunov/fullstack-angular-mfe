import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@nx-mfe/shared/data-access-user';

@Component({
	selector: 'nx-mfe-login-form',
	template: `
		<nz-alert
			*ngIf="isLoggedIn$ | async"
			nzType="success"
			nzMessage="User successfully logged in"
			nzShowIcon
		></nz-alert>

		<nz-alert
			*ngIf="(isLoggedIn$ | async) === false && ngForm.submitted"
			nzType="error"
			nzMessage="You input incorrect data, please try again"
			nzShowIcon
		></nz-alert>

		<form
			#ngForm="ngForm"
			nz-form
			class="login-form"
			[formGroup]="form"
			(ngSubmit)="login()"
		>
			<nz-form-item>
				<nz-form-control nzErrorTip="Please input your username!">
					<nz-input-group nzPrefixIcon="user">
						<input
							type="text"
							nz-input
							formControlName="username"
							placeholder="Username"
						/>
					</nz-input-group>
				</nz-form-control>
			</nz-form-item>
			<nz-form-item>
				<nz-form-control nzErrorTip="Please input your Password!">
					<nz-input-group nzPrefixIcon="lock">
						<input
							type="password"
							nz-input
							formControlName="password"
							placeholder="Password"
						/>
					</nz-input-group>
				</nz-form-control>
			</nz-form-item>
			<div nz-row class="login-form-margin">
				<div nz-col [nzSpan]="12">
					<label nz-checkbox formControlName="remember">
						<span>Remember me</span>
					</label>
				</div>
				<div nz-col [nzSpan]="12">
					<a class="login-form-forgot">Forgot password</a>
				</div>
			</div>
			<button
				nz-button
				nzBlock
				class="login-form-margin"
				nzType="primary"
			>
				Log in
			</button>
			Or
			<a>register now!</a>
		</form>
	`,
	styles: [
		`
			:host {
				position: relative;
			}

			nz-alert {
				position: absolute;
				width: 320px;
			}

			.login-form {
				width: 320px;
				margin-top: 40px;
				padding-top: 2rem;
			}

			.login-form-margin {
				margin-bottom: 16px;
			}

			.login-form-forgot {
				float: right;
			}
		`,
	],
})
export class LoginFormComponent implements OnInit {
	public form!: FormGroup;
	public readonly isLoggedIn$ = this._userService.isUserLoggedIn$;

	constructor(
		private _fb: FormBuilder,
		private readonly _userService: UserService
	) {
	}

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
			this._userService.checkCredentials(username, password);
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
