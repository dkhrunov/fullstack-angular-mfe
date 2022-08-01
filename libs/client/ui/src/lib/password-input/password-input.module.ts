import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordInputComponent } from './password-input.component';
import { FormsModule } from '@angular/forms';
// @ts-ignore
import { View16, ViewOff16 } from '@carbon/icons';
import { IconModule, IconService } from 'carbon-components-angular/icon';
import { ButtonModule } from 'carbon-components-angular/button';
import { InputModule } from 'carbon-components-angular/input';
import { PasswordInputWrapperDirective } from './password-input-wrapper.directive';
import { PasswordStrengthModule } from '../password-strength';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IconModule,
		ButtonModule,
		InputModule,
		PasswordStrengthModule,
	],
	declarations: [PasswordInputComponent, PasswordInputWrapperDirective],
	exports: [PasswordInputComponent, PasswordInputWrapperDirective],
})
export class PasswordInputModule {
	constructor(private readonly _iconService: IconService) {
		this._iconService.registerAll([View16, ViewOff16]);
	}
}
