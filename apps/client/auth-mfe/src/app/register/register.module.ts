import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// @ts-ignore
import { ArrowRight16, EmailNew32 } from '@carbon/icons';
import { MfeModule } from '@nx-mfe/client/mfe';
import { CardModule, DividerModule, LogoModule, PasswordInputModule } from '@nx-mfe/client/ui';
import { ButtonModule } from 'carbon-components-angular/button';
import { GridModule } from 'carbon-components-angular/grid';
import { IconModule, IconService } from 'carbon-components-angular/icon';
import { InputModule } from 'carbon-components-angular/input';
import { LoadingModule } from 'carbon-components-angular/loading';
import { ModalModule } from 'carbon-components-angular/modal';
import { NotificationModule } from 'carbon-components-angular/notification';
import { PlaceholderModule } from 'carbon-components-angular/placeholder';

import { ConfirmRegistrationModalComponent } from './confirm-registration-modal/confirm-registration-modal.component';
import { RegisterComponent } from './register.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: '',
				component: RegisterComponent,
			},
		]),
		ReactiveFormsModule,
		MfeModule,
		GridModule,
		InputModule,
		ButtonModule,
		IconModule,
		LoadingModule,
		NotificationModule,
		ModalModule,
		PlaceholderModule,
		CardModule,
		DividerModule,
		PasswordInputModule,
		LogoModule,
	],
	declarations: [RegisterComponent, ConfirmRegistrationModalComponent],
	exports: [RegisterComponent],
})
export class RegisterModule {
	constructor(private readonly _iconService: IconService) {
		this._iconService.registerAll([ArrowRight16, EmailNew32]);
	}
}
