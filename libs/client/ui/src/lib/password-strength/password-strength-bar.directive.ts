import { Directive, HostBinding, Input } from '@angular/core';
import { Status } from './password-strength.types';

@Directive({
	selector: '[uiPasswordStrengthBar]',
})
export class PasswordStrengthBarDirective {
	@Input()
	public status: Status = 'base';

	@HostBinding('class.password-strength__bar')
	protected _baseClass = true;

	@HostBinding('class.password-strength__bar--base')
	protected get _isStatusBase(): boolean {
		return this.status === 'base';
	}

	@HostBinding('class.password-strength__bar--error')
	protected get _isStatusError(): boolean {
		return this.status === 'error';
	}

	@HostBinding('class.password-strength__bar--warning')
	protected get _isStatusWarning(): boolean {
		return this.status === 'warning';
	}

	@HostBinding('class.password-strength__bar--success')
	protected get _isStatusSuccess(): boolean {
		return this.status === 'success';
	}
}
