import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MfeFallbackComponent } from './mfe-fallback.component';

@NgModule({
	declarations: [MfeFallbackComponent],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: '',
				component: MfeFallbackComponent,
			},
		]),
	],
	exports: [MfeFallbackComponent],
})
export class MfeFallbackModule {}
