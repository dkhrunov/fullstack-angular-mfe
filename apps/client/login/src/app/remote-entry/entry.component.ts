import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@nx-mfe/client-auth';
import { Observable } from 'rxjs';

@Component({
	selector: 'nx-mfe-login-entry',
	templateUrl: './entry.component.html',
	styleUrls: ['./entry.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoteEntryComponent implements OnInit {
	public form!: FormGroup;
	public readonly isLoggedIn$: Observable<boolean>;

	constructor(private readonly _fb: FormBuilder, private readonly _authService: AuthService) {
		this.isLoggedIn$ = this._authService.isLoggedIn$;
	}

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
