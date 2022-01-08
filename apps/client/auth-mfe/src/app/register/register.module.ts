import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RegisterComponent } from './register.component';

@NgModule({
	declarations: [RegisterComponent],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: '',
				component: RegisterComponent,
			},
		]),
	],
})
export class RegisterModule {}
