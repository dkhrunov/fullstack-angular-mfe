import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MfeModule } from '@nx-mfe/client/mfe';

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
	],
	declarations: [RegisterComponent],
	exports: [RegisterComponent],
})
export class RegisterModule {}
