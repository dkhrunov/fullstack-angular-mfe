import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// @ts-ignore
import { ArrowRight16, Information16 } from '@carbon/icons';
import { MfeModule } from '@nx-mfe/client/mfe';
import { CardModule, DividerModule, PasswordInputModule } from '@nx-mfe/client/ui';
import { ButtonModule } from 'carbon-components-angular/button';
import { CheckboxModule } from 'carbon-components-angular/checkbox';
import { DialogModule } from 'carbon-components-angular/dialog';
import { GridModule } from 'carbon-components-angular/grid';
import { IconModule, IconService } from 'carbon-components-angular/icon';
import { InputModule } from 'carbon-components-angular/input';
import { LinkModule } from 'carbon-components-angular/link';
import { LoadingModule } from 'carbon-components-angular/loading';
import { NotificationModule } from 'carbon-components-angular/notification';

import { LoginComponent } from './login.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: '',
				component: LoginComponent,
			},
		]),
		ReactiveFormsModule,
		MfeModule,
		GridModule,
		InputModule,
		CheckboxModule,
		ButtonModule,
		IconModule,
		LinkModule,
		LoadingModule,
		DialogModule,
		NotificationModule,
		CardModule,
		DividerModule,
		PasswordInputModule,
	],
	declarations: [LoginComponent],
	exports: [LoginComponent],
})
export class LoginModule {
	constructor(private readonly _iconService: IconService) {
		this._iconService.registerAll([ArrowRight16, Information16]);
	}
}
