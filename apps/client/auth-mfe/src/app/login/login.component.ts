import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Form, IfFormValid } from '@nx-mfe/client/forms';
import { Login } from '@nx-mfe/shared/data-access';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

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

	private _passwordVisible$ = new BehaviorSubject<boolean>(false);
	public passwordVisible$ = this._passwordVisible$.asObservable();
	public passwordVisible = false;

	private readonly _destroy$ = new Subject<void>();

	constructor(public readonly authFacade: AuthFacadeService, private readonly _fb: FormBuilder) {
		this._createForm();

		this.authFacade.loginError$
			.pipe(takeUntil(this._destroy$))
			.subscribe(() => this.form.get('password')?.setValue(null));

		setTimeout(() => this.text$.next('Test string changed in Subject'), 2000);
		setTimeout(() => this.text$.next('Test string changed 2x in Subject'), 3000);
	}

	public ngOnDestroy(): void {
		this._destroy$.next();
		this._destroy$.complete();
	}

	@IfFormValid()
	public login(): void {
		const credentials = new Login(this.form.value);
		this.authFacade.login(credentials);
	}

	public onClick(bool: MouseEvent): void {
		console.log('login', bool);
	}

	public tooglePasswordVisibility(): void {
		this.passwordVisible = !this.passwordVisible;
	}

	private _createForm(): void {
		this.form = this._fb.group({
			email: [null, [Validators.required, Validators.email]],
			password: [null, [Validators.required]],
			session: [false],
		});
	}
}
