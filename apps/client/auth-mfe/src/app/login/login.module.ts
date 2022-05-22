import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MfeModule } from '@nx-mfe/client/mfe';
import {
	ButtonModule,
	CheckboxModule,
	GridModule,
	IconModule,
	InputModule,
	LinkModule,
	LoadingModule,
	TilesModule,
} from 'carbon-components-angular';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

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
		NzFormModule,
		NzButtonModule,
		NzIconModule,
		NzInputModule,
		NzCheckboxModule,
		NzAlertModule,
		NzTypographyModule,
		GridModule,
		InputModule,
		CheckboxModule,
		ButtonModule,
		IconModule,
		LinkModule,
		LoadingModule,
		TilesModule,
	],
	declarations: [LoginComponent],
	exports: [LoginComponent],
})
export class LoginModule {}
