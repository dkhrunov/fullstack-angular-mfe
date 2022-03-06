import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { SpinnerComponent } from './spinner.component';

@NgModule({
	declarations: [SpinnerComponent],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: '',
				component: SpinnerComponent,
			},
		]),
		NzSpinModule,
	],
	exports: [SpinnerComponent],
})
export class SpinnerModule {}
