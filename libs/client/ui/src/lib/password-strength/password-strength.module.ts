import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordStrengthComponent } from './password-strength.component';
import { PasswordStrengthBarDirective } from './password-strength-bar.directive';

@NgModule({
	declarations: [PasswordStrengthComponent, PasswordStrengthBarDirective],
	imports: [CommonModule],
	exports: [PasswordStrengthComponent],
})
export class PasswordStrengthModule {}
