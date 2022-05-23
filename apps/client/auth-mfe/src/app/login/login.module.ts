import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MfeModule } from '@nx-mfe/client/mfe';
import {
	ButtonModule,
	CheckboxModule,
	DialogModule,
	GridModule,
	IconModule,
	InputModule,
	LinkModule,
	LoadingModule,
	TilesModule,
} from 'carbon-components-angular';

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
		TilesModule,
		DialogModule,
	],
	declarations: [LoginComponent],
	exports: [LoginComponent],
})
export class LoginModule {}
