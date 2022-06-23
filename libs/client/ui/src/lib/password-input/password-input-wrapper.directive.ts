import { Directive, HostBinding } from '@angular/core';

@Directive({
	selector: '[uiPasswordInputWrapper]',
})
export class PasswordInputWrapperDirective {
	@HostBinding('class.ui-password-input-wrapper') public baseClass = true;
}
