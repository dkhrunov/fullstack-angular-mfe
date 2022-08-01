import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoadingModule } from 'carbon-components-angular/loading';

import { SpinnerComponent } from './spinner.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: '',
				component: SpinnerComponent,
			},
		]),
		LoadingModule,
	],
	declarations: [SpinnerComponent],
	exports: [SpinnerComponent],
})
export class SpinnerModule {}
