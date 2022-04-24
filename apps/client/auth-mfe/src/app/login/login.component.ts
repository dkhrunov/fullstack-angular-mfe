import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Form, IfFormValid } from '@nx-mfe/client/forms';
import { Login } from '@nx-mfe/shared/data-access';
import { BehaviorSubject, Subject } from 'rxjs';
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

	private _createForm(): void {
		this.form = this._fb.group({
			email: [null, [Validators.required, Validators.email]],
			password: [null, [Validators.required]],
			session: [false],
		});
	}
}
